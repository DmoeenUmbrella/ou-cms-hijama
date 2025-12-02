import { onMounted, watch, inject, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useFollowupReportStore } from "../stores/useFollowupReportStore";
import { useReportStore } from "../stores/useReportStore";
import { getFollowupReports } from "@/api/endpoints/reports/queries";
import type { ReportParams } from "@/api/endpoints/reports/types";

export function useFollowupReport() {
  const { t } = useI18n();
  const followupReportStore = useFollowupReportStore();
  const reportStore = useReportStore();

  // Inject filter version from parent to watch for changes
  const filterVersion = inject<Ref<number>>('reportFilterVersion');

  // Use storeToRefs for reactive state
  const { dateFilter } = storeToRefs(reportStore);
  const { 
    isLoading, 
    error, 
    totalFollowUps, 
    responseRate,
    formattedResponseRate,
  } = storeToRefs(followupReportStore);

  // --- API Call ---
  const fetchFollowupReports = async () => {
    followupReportStore.setLoading(true);
    followupReportStore.setError(null);

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

      const response = await getFollowupReports(params);

      if (response.isSuccess && response.data) {
        followupReportStore.setReportData(response.data);
      } else {
        followupReportStore.setError(response.message || t('common.error'));
      }
    } catch (err: any) {
      console.error("Error fetching followup reports:", err);
      followupReportStore.setError(err?.message || t('common.error'));
    } finally {
      followupReportStore.setLoading(false);
    }
  };

  // --- Watch for filter changes ---
  if (filterVersion) {
    watch(filterVersion, () => {
      fetchFollowupReports();
    });
  }

  // --- Lifecycle ---
  onMounted(() => {
    fetchFollowupReports();
  });

  return {
    // State
    isLoading,
    error,

    // Data
    totalFollowUps,
    responseRate,
    formattedResponseRate,

    // Actions
    fetchFollowupReports,

    // Translation
    t,
  };
}
