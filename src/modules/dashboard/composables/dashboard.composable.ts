import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useDashboardStore } from "@/modules/dashboard/stores/useDashboardStore";
import type { DashboardDataType } from "@/api/endpoints/dashboard/types";
import { getLocalTimeZone, today, type DateValue } from "@internationalized/date";
import { format } from "date-fns";

export const useDashboard = () => {
  const { t } = useI18n();
  const reportsStore = useDashboardStore();

  // --- UI State ---
  // Default matching the store default
  const timeFilter = ref<DashboardDataType>("thisMonth");
  const isCustomRangeModalActive = ref(false);
  const dateRange = ref<{
    start: DateValue | null;
    end: DateValue | null;
  }>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()),
  });

  // --- Computed ---
  // IDs must match DashboardDataType values: 'thisMonth', 'lastMonth', etc.
  const filterOptions = computed(() => [
    { id: "thisMonth", label: t("reports.filters.this_month") },
    { id: "lastMonth", label: t("reports.filters.last_month") },
    { id: "last3Months", label: t("reports.filters.last_3_months") },
    { id: "customRange", label: t("reports.filters.custom") },
  ]);

  // --- Methods ---
  const handleFilterChange = (val: string) => {
    const filter = val as DashboardDataType;
    timeFilter.value = filter;

    if (filter === "customRange") {
      isCustomRangeModalActive.value = true;
    } else {
      reportsStore.fetchDashboardStats(filter);
    }
  };

  const dateValueToJSDate = (date: {
    year: number;
    month: number;
    day: number;
  }) => {
    // month in JS Date is 0-based
    return new Date(date.year, date.month - 1, date.day);
  };

  const applyCustomRange = () => {
    if (dateRange.value?.start && dateRange.value?.end) {
      reportsStore.fetchDashboardStats("customRange", {
        start: dateValueToJSDate(dateRange.value.start),
        end: dateValueToJSDate(dateRange.value.end),
      });
      isCustomRangeModalActive.value = false;
    }
  };

  // --- Lifecycle ---
  onMounted(() => {
    reportsStore.fetchDashboardStats();
  });

  return {
    // State
    stats: computed(() => reportsStore.stats),
    appointmentVolume: computed(() => reportsStore.appointmentVolume),
    volumeSummary: computed(() => reportsStore.volumeSummary),
    clientJourney: computed(() => reportsStore.clientJourney),
    isLoading: computed(() => reportsStore.isLoading),

    timeFilter,
    isCustomRangeModalActive,
    dateRange,
    filterOptions,

    // Methods
    handleFilterChange,
    applyCustomRange,
  };
};

export default useDashboard;
