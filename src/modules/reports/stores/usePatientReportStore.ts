import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { PatientReportData, PatientActivityItem } from "@/api/endpoints/reports/types";

export const usePatientReportStore = defineStore("patientReport", () => {
  // --- STATE ---
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Report data
  const reportData = ref<PatientReportData | null>(null);

  // Activity table state
  const activityData = ref<PatientActivityItem[]>([]);
  const activityLoading = ref(false);
  const activityError = ref<string | null>(null);
  const activityPage = ref(1);
  const activityPageSize = ref(10);
  const hasMoreActivity = ref(true);

  // --- GETTERS ---
  const totalClients = computed(() => reportData.value?.totalClients ?? 0);
  const activeClients = computed(() => reportData.value?.activeClients ?? 0);
  const newClients = computed(() => reportData.value?.newClients ?? 0);
  const retentionRate = computed(() => reportData.value?.retentionRate ?? 0);
  const clientDemographicsRatio = computed(() => reportData.value?.clientDemographicsRatio ?? {});
  const clientGrowthTrend = computed(() => reportData.value?.clientGrowthTrend ?? []);

  // Formatted values
  const formattedRetentionRate = computed(() => `${retentionRate.value}%`);

  // --- ACTIONS ---
  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const setError = (err: string | null) => {
    error.value = err;
  };

  const setReportData = (data: PatientReportData) => {
    reportData.value = data;
  };

  const resetReportData = () => {
    reportData.value = null;
    error.value = null;
  };

  // Activity table actions
  const setActivityLoading = (loading: boolean) => {
    activityLoading.value = loading;
  };

  const setActivityError = (err: string | null) => {
    activityError.value = err;
  };

  const setActivityData = (data: PatientActivityItem[]) => {
    activityData.value = data;
    // If we got fewer items than page size, there's no more data
    hasMoreActivity.value = data.length >= activityPageSize.value;
  };

  const setActivityPage = (page: number) => {
    activityPage.value = page;
  };

  const resetActivityData = () => {
    activityData.value = [];
    activityError.value = null;
    activityPage.value = 1;
    hasMoreActivity.value = true;
  };

  return {
    // State
    isLoading,
    error,
    reportData,

    // Activity state
    activityData,
    activityLoading,
    activityError,
    activityPage,
    activityPageSize,
    hasMoreActivity,

    // Getters
    totalClients,
    activeClients,
    newClients,
    retentionRate,
    formattedRetentionRate,
    clientDemographicsRatio,
    clientGrowthTrend,

    // Actions
    setLoading,
    setError,
    setReportData,
    resetReportData,

    // Activity actions
    setActivityLoading,
    setActivityError,
    setActivityData,
    setActivityPage,
    resetActivityData,
  };
});
