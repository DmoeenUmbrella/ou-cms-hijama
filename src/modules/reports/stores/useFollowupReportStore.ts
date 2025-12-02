import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { FollowupReportData } from "@/api/endpoints/reports/types";

export const useFollowupReportStore = defineStore("followupReport", () => {
  // --- STATE ---
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Report data
  const reportData = ref<FollowupReportData | null>(null);

  // --- GETTERS ---
  const totalFollowUps = computed(() => reportData.value?.totalFollowUps ?? 0);
  const responseRate = computed(() => reportData.value?.responseRate ?? 0);

  // Formatted response rate with percentage
  const formattedResponseRate = computed(() => `${responseRate.value}%`);

  // --- ACTIONS ---
  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const setError = (err: string | null) => {
    error.value = err;
  };

  const setReportData = (data: FollowupReportData) => {
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
    totalFollowUps,
    responseRate,
    formattedResponseRate,

    // Actions
    setLoading,
    setError,
    setReportData,
    resetReportData,
  };
});
