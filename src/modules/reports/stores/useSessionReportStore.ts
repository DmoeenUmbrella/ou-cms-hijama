import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { SessionReportData } from "@/api/endpoints/reports/types";

export const useSessionReportStore = defineStore("sessionReport", () => {
  // --- STATE ---
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Report data
  const reportData = ref<SessionReportData | null>(null);

  // --- GETTERS ---
  const totalAppointments = computed(() => reportData.value?.totalAppointments ?? 0);
  const totalRevenue = computed(() => reportData.value?.totalRevenue ?? 0);

  // Formatted revenue with currency
  const formattedRevenue = computed(() => `${totalRevenue.value} SAR`);

  // --- ACTIONS ---
  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const setError = (err: string | null) => {
    error.value = err;
  };

  const setReportData = (data: SessionReportData) => {
    reportData.value = data;
  };

  const resetReportData = () => {
    reportData.value = null;
    error.value = null;
  };

  return {
    // State
    isLoading,
    error,
    reportData,

    // Getters
    totalAppointments,
    totalRevenue,
    formattedRevenue,

    // Actions
    setLoading,
    setError,
    setReportData,
    resetReportData,
  };
});
