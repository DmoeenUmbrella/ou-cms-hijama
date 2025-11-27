// src/modules/appointment/stores/useAppointmentsStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { toast } from "vue-sonner";
import { i18n } from "@/i18n";
import type {
  Patient,
  Session,
  FollowUp,
  PatientFormState,
  FollowUpFormState,
  Appointment,
  AppointmentFormState,
  AppointmentPayload,
} from "@/types/appointment";
import { appointmentMutations, appointmentQueries } from "@/api/endpoints";

export const useAppointmentsStore = defineStore("appointments", () => {
  // --- STATE ---
  const patients = ref<Patient[]>([]);
  const totalPatients = ref(0);
  const selectedPatient = ref<Patient | null>(null);

  const sessions = ref<Session[]>([]);
  const followUps = ref<FollowUp[]>([]);

  const appointments = ref<Appointment[]>([]);
  const selectedDate = ref(new Date().toISOString().slice(0, 10));
  const isLoading = ref(false);

  const filters = ref({
    page: 1,
    count: 10,
    keyword: "",
    date: null as string | null,
  });

  // --- FORM STATE ---
  const formPatient = ref<PatientFormState>({
    name: "",
    phone: "",
    gender: "Male",
    cupperName: "",
    serviceId: null,
    cupsCount: 0,
    amount: 0,
    paymentMethod: "Cash",
    date: new Date().toISOString().slice(0, 10),
    time: "09:00",
    notes: "",
  });

  const formFollowUp = ref<FollowUpFormState>({
    id: null,
    patientId: null,
    serviceId: null,
    date: new Date().toISOString().slice(0, 10),
    time: "09:00",
    notes: "",
  });

  const formAppointment = ref<AppointmentFormState>({
    id: null,
    client_id: null,
    service_id: null,
    cupper: null,
    date: new Date().toISOString().slice(0, 10),
    time: "09:00",
    duration: 30,
    notes: "",
  });

  // --- GETTERS ---
  const filteredPatients = computed(() => patients.value || []);
  const patientSessions = computed(() =>
    sessions.value.filter((s) => s.patientId === selectedPatient.value?.id)
  );
  const patientFollowUps = computed(() =>
    followUps.value.filter((f) => f.patientId === selectedPatient.value?.id)
  );

  const filteredAppointments = computed(() => appointments.value);
  const isAppointmentFormEditing = computed(() => !!formAppointment.value.id);
  const isPatientFormEditing = computed(() => false);

  // --- HELPERS ---
  const resetPatientForm = () => {
    Object.assign(formPatient.value, {
      name: "",
      phone: "",
      gender: "Male",
      cupperName: "",
      serviceId: null,
      cupsCount: 0,
      amount: 0,
      paymentMethod: "Cash",
      date: new Date().toISOString().slice(0, 10),
      time: "09:00",
      notes: "",
    });
  };

  const resetFollowUpForm = () => {
    Object.assign(formFollowUp.value, {
      id: null,
      patientId: null,
      serviceId: null,
      date: new Date().toISOString().slice(0, 10),
      time: "09:00",
      notes: "",
    });
  };

  const resetAppointmentForm = () => {
    Object.assign(formAppointment.value, {
      id: null,
      client_id: null,
      service_id: null,
      cupper: null,
      date: selectedDate.value,
      time: "09:00",
      duration: 30,
      notes: "",
    });
  };

  // --- ACTIONS ---
  async function fetchPatients() {
    isLoading.value = true;
    try {
      console.log("Fetching patients with filters:", filters.value);
      // TODO: replace with real API call
      patients.value = [
        {
          id: 1,
          name: "Ahmed Ali",
          phone: "12345",
          gender: "Male",
          totalSessions: 5,
          lastSessionDate: "2025-10-10",
        },
        {
          id: 2,
          name: "Fatima",
          phone: "67890",
          gender: "Female",
          totalSessions: 2,
          lastSessionDate: "2025-11-01",
        },
      ];
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch patients");
    } finally {
      isLoading.value = false;
    }
  }

  async function registerPatient() {
    isLoading.value = true;
    try {
      const payload = { ...formPatient.value };
      console.log("Registered Patient:", payload);
      toast.success("Patient registered successfully");
      resetPatientForm();
      fetchPatients();
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to register patient");
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function createFollowUp() {
    isLoading.value = true;
    try {
      const payload = { ...formFollowUp.value };
      console.log("Creating Follow Up:", payload);
      toast.success("Follow-up scheduled");
      resetFollowUpForm();
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule follow-up");
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function createSession() {
    isLoading.value = true;
    try {
      const payload = { ...formFollowUp.value };
      console.log("Creating Follow Up:", payload);
      toast.success("Follow-up scheduled");
      resetFollowUpForm();
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule follow-up");
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function convertFollowUpToSession(
    followUpId: number,
    sessionDetails: any
  ) {
    isLoading.value = true;
    try {
      console.log(
        `Converting FollowUp ${followUpId} to Session`,
        sessionDetails
      );
      toast.success("Follow-up converted to Session");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to convert follow-up");
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deletePatient(id: number) {
    console.log("Deleting patient", id);
    patients.value = patients.value.filter((p) => p.id !== id);
    toast.success("Patient deleted");
  }

  // --- Legacy Appointment Actions ---
  function setSelectedDate(date: string) {
    selectedDate.value = date;
  }

  function loadAppointmentForEdit(appointment: Appointment) {
    // Normalize incoming appointment fields and keep reactive object shape
    let dateStr = appointment.date ?? "";
    let timeStr = appointment.time ?? "";

    // If API returns full ISO strings, extract date/time portion
    if (dateStr && dateStr.includes("T")) dateStr = dateStr.split("T")[0];

    if (timeStr && timeStr.includes("T")) {
      const d = new Date(timeStr);
      if (!isNaN(d.getTime())) timeStr = d.toTimeString().slice(0, 5);
    } else if (timeStr && timeStr.length >= 5) {
      timeStr = timeStr.slice(0, 5);
    }

    // Use Object.assign to preserve reactivity references
    Object.assign(formAppointment.value, {
      id: appointment.id ? Number(appointment.id) : null,
      client_id: appointment.client_id ?? null,
      service_id: appointment.service_id ?? null,
      cupper: null,
      date: dateStr || selectedDate.value,
      time: timeStr || "09:00",
      duration:
        typeof appointment.duration === "string"
          ? parseInt(appointment.duration)
          : appointment.duration ?? 30,
      notes: appointment.notes ?? "",
    });
  }

  async function fetchAppointments() {
    isLoading.value = true;
    try {
      const response = await appointmentQueries.getAppointments({
        page: 1,
        count: 10,
      });
      appointments.value = response.data || [];
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch appointments");
    } finally {
      isLoading.value = false;
    }
  }

  // Create AppointmentPayload for API (ISO date/time)
  const createPayload = (): AppointmentPayload => {
    const data = formAppointment.value;
    // Build ISO date time using local date/time values
    // date: YYYY-MM-DD, time: HH:MM
    const datePart = data.date;
    const timePart = data.time?.slice(0, 5) ?? "00:00";
    // Create ISO in local zone: new Date(`${date}T${time}:00`)
    const iso = new Date(`${datePart}T${timePart}:00`).toISOString();

    return {
      clientId: Number(data.client_id!),
      clinicId: 1,
      serviceId: Number(data.service_id!),
      date: iso,
      time: iso,
      duration: Number(data.duration),
      notes: data.notes || "",
    };
  };

  async function addAppointment() {
    const payload = createPayload();
    try {
      await appointmentMutations.createAppointment(payload);
      toast.success("Appointment created");
      resetAppointmentForm();
      fetchAppointments();
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to create appointment");
      return false;
    }
  }

  async function updateAppointment() {
    const payload = createPayload();
    const id = formAppointment.value.id;
    if (!id) return false;
    try {
      await appointmentMutations.updateAppointment(Number(id), payload);
      toast.success("Appointment updated");
      resetAppointmentForm();
      fetchAppointments();
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to update appointment");
      return false;
    }
  }

  async function deleteAppointment(id: number) {
    try {
      await appointmentMutations.deleteAppointment(id);
      toast.success("Appointment deleted");
      fetchAppointments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete appointment");
    }
  }

  return {
    // State
    patients,
    selectedPatient,
    sessions,
    followUps,
    appointments,
    selectedDate,
    isLoading,
    filters,
    formPatient,
    formFollowUp,
    formAppointment,

    // Getters
    filteredPatients,
    patientSessions,
    patientFollowUps,
    filteredAppointments,
    isAppointmentFormEditing,
    isPatientFormEditing,

    // Actions
    fetchPatients,
    registerPatient,
    createSession,
    createFollowUp,
    convertFollowUpToSession,
    deletePatient,
    resetPatientForm,
    resetFollowUpForm,

    // Legacy Actions
    setSelectedDate,
    fetchAppointments,
    addAppointment,
    updateAppointment,
    resetAppointmentForm,
    loadAppointmentForEdit,
    deleteAppointment,
  };
});
