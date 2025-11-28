import { ref, computed, watch } from "vue";
import { usePatientStore } from "../stores/usePatientStore";
import { useI18n } from "vue-i18n";
import type { Patient } from "@/types/appointment";
import { useSessionStore } from "../stores/useSessionStore";
import { useFollowupStore } from "../stores/useFollowUpStore";
import dateToISOStringFormat, { isoToReadableDate, timeToIsoDateString } from "@/utils/helpers/formatDateTime";

export function useAppointmentView() {
  const patientStore = usePatientStore();
  const sessionsStore = useSessionStore();
  const followupsStore = useFollowupStore();
  
  const { t } = useI18n();

  // --- UI State ---
  const isModalActive = ref(false); // Controls Registration Form (legacy)
  const isSessionModalActive = ref(false); // Controls New Session/Follow-up Form
  const isFollowUpModalActive = ref(false); // Controls New Session/Follow-up Form
  const isDeleteModalActive = ref(false);
  const patientContext = ref<Patient | null>(null); // Patient clicked from the table for session/follow-up
  const selectedPatient = ref<Patient | null>(null); 
  const appointmentToDelete = ref(null as any);
  const isEditing = ref(false);
  const currentAction = ref<
   "create-patient" | "edit-patient" | "create-session" | "create-followup" | null
  >(null);

  // --- Computed ---
  const modalTitle = computed(() => {
    return isEditing.value
      ? t("appointment.edit_label")
      : currentAction.value === "create-session"
      ? t("session.create")
      : currentAction.value === "create-followup"
      ? t("session.schedule_follow_up")
      : t("appointment.create_label");
  });

  // --- Handlers ---

  // 1. Handlers for Registration/Legacy Flow
  const openNewAppointmentModal = () => {
    patientStore.resetPatientForm();
    isModalActive.value = true;
  };

  const handleCreateAppointment = () => {
    isEditing.value = false;
    currentAction.value = "create-patient";
    // populate patient form
    openNewAppointmentModal();
  };
  const handleEditAppointment = (patient: Patient) => {
    isEditing.value = true;
    currentAction.value = "edit-patient";
    selectedPatient.value = patient;
    // populate patient form
    openNewAppointmentModal();
  };

  const handleCreateSession = async (patient: Patient) => {
    isEditing.value = false;
    currentAction.value = "create-session";
    selectedPatient.value = patient;
    openNewAppointmentModal();
    const data = await patientStore.getClients(patient.id);
    patient.lastSessionDate = isoToReadableDate(data?.lastAppointmentDate);
    patient.totalSessions = data?.totalSessions;
    // populate session form with patient info
  };

  const handleCreateFollowUp = async (patient: Patient) => {
    isEditing.value = false;
    currentAction.value = "create-followup";
    selectedPatient.value = patient;
    // populate followup form with patient info
    openNewAppointmentModal();
    const data = await patientStore.getClients(patient.id);
    patient.lastSessionDate = isoToReadableDate(data?.lastAppointmentDate);
    patient.totalSessions = data?.totalSessions;
  };


  // 3. Delete Handlers
  const handleDeleteConfirmation = (patient: Patient) => {
    appointmentToDelete.value = patient; // Renamed to patient for clarity
    isDeleteModalActive.value = true;
  };

  const handleDeleteAppointment = async () => {
    if (appointmentToDelete.value) {
      // Assuming deletePatient action exists in store
      await patientStore.deletePatient(appointmentToDelete.value.id);
      isDeleteModalActive.value = false;
    }
  };

  const handleFormSubmit = async (payload: any) => {
    const action = currentAction.value;

    // Helper to safely transform date fields
    const formatDateField = (field?: string | Date) =>
      field ? dateToISOStringFormat(field) : null;

    // Helper for session time
    const formatSessionTime = (date?: string, time?: string) =>
      date && time ? timeToIsoDateString(date, time) : null;

    try {
      let response;

      switch (action) {
        case "create-patient":
          response = await patientStore.createPatient({
            ...payload,
            reminder: formatDateField(payload.reminder),
            date: formatDateField(payload.date),
          });
          break;

        case "edit-patient":
          response = await patientStore.updatePatient(payload);
          break;

        case "create-session":
          response = await sessionsStore.createSession({
            ...payload,
            date: formatDateField(payload.date),
            reminder: formatDateField(payload.reminder),
            time: formatSessionTime(payload.date, payload.time),
          });
          break;

        case "create-followup":
          response = await followupsStore.createFollowUp({
            ...payload,
            date: formatDateField(payload.date),
          });
          break;

        default:
          throw new Error(`Unknown form action: ${action}`);
      }

      if (response?.isSuccess) {
        handleFormSubmitSuccess();
      } else {
        console.warn("Unexpected API response:", response);
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };


  const handleFormSubmitSuccess = () => {
    // Closes the modal from where the success event originated
    isModalActive.value = false;
    isSessionModalActive.value = false;
    selectedPatient.value = null;
  };

  const closeModal = () => {
    // Reset state and close all modals
    patientStore.resetPatientForm();
    patientContext.value = null;
    isModalActive.value = false;
    isSessionModalActive.value = false;
    isFollowUpModalActive.value = false;
    selectedPatient.value = null;
  };

  watch(
    () => isModalActive.value,
    (newVal) => {
      if(!newVal) {
        selectedPatient.value = null;
      }
    },
    { deep: true }
  );

  return {
    // UI State
    isModalActive,
    isSessionModalActive, // New state for existing patient flow
    isFollowUpModalActive,
    isDeleteModalActive,
    patientContext, // Context for SessionForm
    selectedPatient,
    appointmentToDelete,

    // Computed
    isEditing,
    modalTitle,
    currentAction,

    // Handlers
    openNewAppointmentModal,
    handleCreateAppointment,
    handleEditAppointment,
    handleDeleteConfirmation,
    handleDeleteAppointment,
    handleFormSubmitSuccess,
    handleFormSubmit,
    closeModal,
    handleCreateSession, // Export new action
    handleCreateFollowUp, // Export new action
  };
}
