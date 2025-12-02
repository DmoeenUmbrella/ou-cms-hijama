import { onMounted, watch, inject, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useSessionReportStore } from "../stores/useSessionReportStore";
import { useReportStore } from "../stores/useReportStore";
import { getSessionReports } from "@/api/endpoints/reports/queries";
import type { ReportParams } from "@/api/endpoints/reports/types";

export function useSessionReport() {
  const { t } = useI18n();
  const sessionReportStore = useSessionReportStore();
  const reportStore = useReportStore();

  // Inject filter version from parent to watch for changes
  const filterVersion = inject<Ref<number>>('reportFilterVersion');

  // Use storeToRefs for reactive state
  const { dateFilter } = storeToRefs(reportStore);
  const { 
    isLoading, 
    error, 
    totalAppointments, 
    totalRevenue,
    formattedRevenue,
  } = storeToRefs(sessionReportStore);

  // --- API Call ---
  const fetchSessionReports = async () => {
    sessionReportStore.setLoading(true);
    sessionReportStore.setError(null);

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

      const response = await getSessionReports(params);

      if (response.isSuccess && response.data) {
        sessionReportStore.setReportData(response.data);
      } else {
        sessionReportStore.setError(response.message || t('common.error'));
      }
    } catch (err: any) {
      console.error("Error fetching session reports:", err);
      sessionReportStore.setError(err?.message || t('common.error'));
    } finally {
      sessionReportStore.setLoading(false);
    }
  };

  // --- Watch for filter changes ---
  if (filterVersion) {
    watch(filterVersion, () => {
      fetchSessionReports();
    });
  }

  // --- Lifecycle ---
  onMounted(() => {
    fetchSessionReports();
  });

  return {
    // State
    isLoading,
    error,

    // Data
    totalAppointments,
    totalRevenue,
    formattedRevenue,

    // Actions
    fetchSessionReports,

    // Translation
    t,
  };
}
