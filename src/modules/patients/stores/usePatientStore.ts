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
  const pageSize = ref(10);

  const { t } = i18n.global;

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
        if (response?.message?.toLowerCase()?.includes("No Clients Found")) {
          toast.error(t("session.no_clients") || "Failed to fetch patients");
        } else {
          toast.error(t("session.create_failed") || "Failed to fetch patients");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(
        t("session.create_failed") || "Failed to fetch patients"
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
      if(data.isSuccess) {
        toast.success(
          t("patient.create_success") ||
            "Patient created successfully"
        );
        resetPatientForm();
        await fetchPatients();
      } else {
        toast.error(t("session.create_failed") || "Failed to create patient");
      }
      return data;
    } catch (error) {
      console.error(error);
      toast.error(t("session.create_failed") || "Failed to create patient");
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const updatePatient = async (payload: PatientPayload) => {
    if (!payload.id) return false;
    isLoading.value = true;
    try {
      // const payload = { ...formPatient.value };
      const data = await appointmentMutations.updatePatient(payload);
      if(data.isSuccess) {
        toast.success(
          t("patient.update_success") || "Patient updated successfully"
        );
        resetPatientForm();
        await fetchPatients();
      } else {
        toast.error(t("session.create_failed") || "Failed to update patient");
      }
      return data;
    } catch (error) {
      console.error(error);
      toast.error(t("session.create_failed") || "Failed to update patient");
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
        t("patient.delete_success") || "Patient deleted"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        t("patient.delete_error") || "Failed to delete patient"
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
    pageSize,
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
