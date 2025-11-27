import { ref, computed } from "vue";
import { useAppointmentsStore } from "../stores/useAppointmentsStore";
import { useI18n } from "vue-i18n";
import type { Patient } from "@/types/appointment";

export function useAppointmentView() {
  const appointmentsStore = useAppointmentsStore();
  const { t } = useI18n();

  // --- UI State ---
  const isModalActive = ref(false); // Controls Registration Form (legacy)
  const isSessionModalActive = ref(false); // Controls New Session/Follow-up Form
  const isFollowUpModalActive = ref(false); // Controls New Session/Follow-up Form
  const isDeleteModalActive = ref(false);
  const patientContext = ref<Patient | null>(null); // Patient clicked from the table for session/follow-up
  const appointmentToDelete = ref(null as any);

  // --- Computed ---
  const isEditing = computed(() => appointmentsStore.isAppointmentFormEditing);

  const modalTitle = computed(
    () => t("patient.registration_title") || "Patient Registration"
  );

  // --- Handlers ---

  // 1. Handlers for Registration/Legacy Flow
  const openNewAppointmentModal = () => {
    appointmentsStore.resetPatientForm();
    isModalActive.value = true;
  };

  const handleEditAppointment = (appointment: any) => {
    appointmentsStore.loadAppointmentForEdit(appointment);
    isModalActive.value = true;
  };

  // 2. Handlers for New Patient-Centric Actions (from AppointmentsTable)

  const handleCreateSession = (patient: Patient) => {
    patientContext.value = patient;
    isSessionModalActive.value = true;
  };

  const handleCreateFollowUp = (patient: Patient) => {
    patientContext.value = patient;
    // For simplicity, reuse the session modal for follow-up scheduling initially,
    // or create a separate form if logic dictates. For now, we open the session flow.
    isFollowUpModalActive.value = true;
  };

  // 3. Delete Handlers
  const handleDeleteConfirmation = (patient: Patient) => {
    appointmentToDelete.value = patient; // Renamed to patient for clarity
    isDeleteModalActive.value = true;
  };

  const handleDeleteAppointment = async () => {
    if (appointmentToDelete.value) {
      // Assuming deletePatient action exists in store
      await appointmentsStore.deletePatient(appointmentToDelete.value.id);
      isDeleteModalActive.value = false;
    }
  };

  const handleFormSubmitSuccess = () => {
    // Closes the modal from where the success event originated
    isModalActive.value = false;
    isSessionModalActive.value = false;
  };

  const closeModal = () => {
    // Reset state and close all modals
    appointmentsStore.resetPatientForm();
    patientContext.value = null;
    isModalActive.value = false;
    isSessionModalActive.value = false;
    isFollowUpModalActive.value = false;
  };

  return {
    // UI State
    isModalActive,
    isSessionModalActive, // New state for existing patient flow
    isFollowUpModalActive,
    isDeleteModalActive,
    patientContext, // Context for SessionForm
    appointmentToDelete,

    // Computed
    isEditing,
    modalTitle,

    // Handlers
    openNewAppointmentModal,
    handleEditAppointment,
    handleDeleteConfirmation,
    handleDeleteAppointment,
    handleFormSubmitSuccess,
    closeModal,
    handleCreateSession, // Export new action
    handleCreateFollowUp, // Export new action
  };
}
