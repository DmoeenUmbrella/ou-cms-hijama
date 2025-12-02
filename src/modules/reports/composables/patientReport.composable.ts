import { onMounted, watch, inject, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { usePatientReportStore } from "../stores/usePatientReportStore";
import { useReportStore } from "../stores/useReportStore";
import { getPatientReports, getPatientActivityReports } from "@/api/endpoints/reports/queries";
import type { ReportParams } from "@/api/endpoints/reports/types";

export function usePatientReport() {
  const { t } = useI18n();
  const patientReportStore = usePatientReportStore();
  const reportStore = useReportStore();

  // Inject filter version from parent to watch for changes
  const filterVersion = inject<Ref<number>>('reportFilterVersion');

  // Use storeToRefs for reactive state
  const { dateFilter } = storeToRefs(reportStore);
  const { 
    isLoading, 
    error, 
    totalClients, 
    activeClients, 
    newClients, 
    retentionRate,
    formattedRetentionRate,
    clientDemographicsRatio,
    clientGrowthTrend,
    // Activity table state
    activityData,
    activityLoading,
    activityError,
    activityPage,
    activityPageSize,
    hasMoreActivity,
  } = storeToRefs(patientReportStore);

  // --- API Call ---
  const fetchPatientReports = async () => {
    patientReportStore.setLoading(true);
    patientReportStore.setError(null);

    try {
      const filter = dateFilter.value;
      const params: ReportParams = {
        dateType: filter?.type ?? 'last30Days',
      };

      // Add date range for custom range
      if (filter?.type === 'customRange' && filter?.startDate && filter?.endDate) {
        params.startDate = filter.startDate;
        params.endDate = filter.endDate;
      }

      const response = await getPatientReports(params);

      if (response.isSuccess && response.data) {
        patientReportStore.setReportData(response.data);
      } else {
        patientReportStore.setError(response.message || t('common.error'));
      }
    } catch (err: any) {
      console.error("Error fetching patient reports:", err);
      patientReportStore.setError(err?.message || t('common.error'));
    } finally {
      patientReportStore.setLoading(false);
    }
  };

  // --- Activity API Call ---
  const fetchPatientActivity = async (page?: number) => {
    patientReportStore.setActivityLoading(true);
    patientReportStore.setActivityError(null);

    try {
      const currentPage = page ?? activityPage.value;
      const response = await getPatientActivityReports({
        page: currentPage,
        count: activityPageSize.value,
      });

      if (response.isSuccess && response.data) {
        patientReportStore.setActivityData(response.data);
        patientReportStore.setActivityPage(currentPage);
      } else {
        patientReportStore.setActivityError(response.message || t('common.error'));
      }
    } catch (err: any) {
      console.error("Error fetching patient activity:", err);
      patientReportStore.setActivityError(err?.message || t('common.error'));
    } finally {
      patientReportStore.setActivityLoading(false);
    }
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (hasMoreActivity.value) {
      fetchPatientActivity(activityPage.value + 1);
    }
  };

  const goToPrevPage = () => {
    if (activityPage.value > 1) {
      fetchPatientActivity(activityPage.value - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1) {
      fetchPatientActivity(page);
    }
  };

  // --- Watch for filter changes ---
  if (filterVersion) {
    watch(filterVersion, () => {
      fetchPatientReports();
      // Reset and refetch activity on filter change
      patientReportStore.resetActivityData();
      fetchPatientActivity(1);
    });
  }

  // --- Lifecycle ---
  onMounted(() => {
    fetchPatientReports();
    fetchPatientActivity(1);
  });

  return {
    // State
    isLoading,
    error,

    // Data
    totalClients,
    activeClients,
    newClients,
    retentionRate,
    formattedRetentionRate,
    clientDemographicsRatio,
    clientGrowthTrend,

    // Activity state
    activityData,
    activityLoading,
    activityError,
    activityPage,
    activityPageSize,
    hasMoreActivity,

    // Actions
    fetchPatientReports,
    fetchPatientActivity,
    goToNextPage,
    goToPrevPage,
    goToPage,

    // Translation
    t,
  };
}
