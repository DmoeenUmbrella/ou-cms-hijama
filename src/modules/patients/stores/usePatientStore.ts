// src/modules/appointment/stores/usePatientStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { toast } from "vue-sonner";
import { i18n } from "@/i18n";
import type { Patient, PatientFormState } from "@/types/appointment";
import { appointmentMutations, appointmentQueries } from "@/api/endpoints";
import type { PatientPayload } from "@/api/endpoints/patient/interfaces";

export const usePatientStore = defineStore("patients", () => {
  // --- STATE ---
  const patients = ref<Patient[]>([]);
  const totalPatients = ref(0);
  const selectedPatient = ref<Patient | null>(null);
  const isLoading = ref(false);
  const isAppointmentFormEditing = ref(false);

  const filters = ref({
    page: 1,
    count: 10,
    keyword: "",
  });

  // --- FORM STATE ---
  const formPatient = ref<PatientFormState>({
    id: "",
    name: "",
    phoneNumber: "",
    gender: "Male",
    numberOfCups: "",
    amount: 0,
    paymentMethod: "Cash",
    technicianId: "",
    notes: "",
    date: new Date().toISOString().slice(0, 10),
    reminder: "",
    time: "",
    serviceId: "",
  });

  // --- GETTERS ---
  const filteredPatients = computed(() => patients.value);

  // --- HELPERS ---
  const resetPatientForm = () => {
    Object.assign(formPatient.value, {
      id: null,
      name: "",
      phoneNumber: "",
      gender: "Male",
      numberOfCups: "",
      amount: 0,
      paymentMethod: "Cash",
      technicianId: null,
      notes: "",
      date: new Date().toISOString().slice(0, 10),
      reminder: "",
    });
    selectedPatient.value = null;
  };

  // --- ACTIONS ---
  const fetchPatients = async () => {
    isLoading.value = true;
    try {
      const response = await appointmentQueries.getPatients({
        page: filters.value.page,
        count: filters.value.count,
        keyword: filters.value.keyword,
      });

      if (response.isSuccess) {
        patients.value = response.data;
        totalPatients.value = response.total;
      } else {
        toast.error(
          i18n.global.t("patient.fetch_error") || "Failed to fetch patients"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        i18n.global.t("patient.fetch_error") || "Failed to fetch patients"
      );
    } finally {
      isLoading.value = false;
    }
  };

  const createPatient = async (payload: PatientPayload) => {
    isLoading.value = true;
    try {
      // const payload = { ...formPatient.value };
      const data = await appointmentMutations.createPatient(payload);
      toast.success(
        i18n.global.t("patient.create_success") ||
          "Patient created successfully"
      );
      resetPatientForm();
      await fetchPatients();
      return data;
    } catch (error) {
      console.error(error);
      toast.error(
        i18n.global.t("patient.create_error") || "Failed to create patient"
      );
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const updatePatient = async (payload: PatientPayload) => {
    if (!formPatient.value.id) return false;
    isLoading.value = true;
    try {
      // const payload = { ...formPatient.value };
      const data = await appointmentMutations.updatePatient(payload);
      toast.success(
        i18n.global.t("patient.update_success") ||
          "Patient updated successfully"
      );
      resetPatientForm();
      await fetchPatients();
      return data;
    } catch (error) {
      console.error(error);
      toast.error(
        i18n.global.t("patient.update_error") || "Failed to update patient"
      );
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const deletePatient = async (id: string) => {
    isLoading.value = true;
    try {
      await appointmentMutations.deletePatient(id);
      patients.value = patients.value.filter((p) => p.id !== id);
      toast.success(
        i18n.global.t("patient.delete_success") || "Patient deleted"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        i18n.global.t("patient.delete_error") || "Failed to delete patient"
      );
    } finally {
      isLoading.value = false;
    }
  };

    function loadAppointmentForEdit(patient: PatientFormState) {
      // Normalize incoming patient fields and keep reactive object shape
      let dateStr = patient.date ?? "";
      let timeStr = patient.time ?? "";

      // If API returns full ISO strings, extract date/time portion
      if (dateStr && dateStr.includes("T")) dateStr = dateStr.split("T")[0] || "";

      if (timeStr && timeStr.includes("T")) {
        const d = new Date(timeStr);
        if (!isNaN(d.getTime())) timeStr = d.toTimeString().slice(0, 5);
      } else if (timeStr && timeStr.length >= 5) {
        timeStr = timeStr.slice(0, 5);
      }

      // Use Object.assign to preserve reactivity references
      Object.assign(formPatient.value, {
        id: patient.id ? Number(patient.id) : null,
        clientId: patient.id ?? null,
      });
    }

  return {
    // State
    patients,
    totalPatients,
    selectedPatient,
    isLoading,
    filters,
    formPatient,

    // Getters
    filteredPatients,

    // Actions
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
    resetPatientForm,
    isAppointmentFormEditing,
    loadAppointmentForEdit,
  };
});
