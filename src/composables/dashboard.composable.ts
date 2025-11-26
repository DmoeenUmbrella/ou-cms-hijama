import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useReportsStore, type FilterType } from "@/stores/useReportsStore";

export const useDashboard = () => {
  const { t } = useI18n();
  const reportsStore = useReportsStore();

  // --- UI State ---
  const timeFilter = ref<FilterType>("this_month");
  const isCustomRangeModalActive = ref(false);
  const dateRange = ref({ start: new Date(), end: new Date() });

  // --- Computed ---
  const filterOptions = computed(() => [
    { id: "this_month", label: t("reports.filters.this_month") },
    { id: "last_month", label: t("reports.filters.last_month") },
    { id: "last_3_months", label: t("reports.filters.last_3_months") },
    { id: "custom", label: t("reports.filters.custom") },
  ]);

  // --- Methods ---
  const handleFilterChange = (val: string) => {
    // Cast string to FilterType
    const filter = val as FilterType;
    timeFilter.value = filter;

    if (filter === "custom") {
      isCustomRangeModalActive.value = true;
    } else {
      reportsStore.fetchDashboardStats(filter);
    }
  };

  const applyCustomRange = () => {
    if (dateRange.value?.start && dateRange.value?.end) {
      reportsStore.fetchDashboardStats("custom", dateRange.value);
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
    chartData: computed(() => reportsStore.chartData),
    isLoading: computed(() => reportsStore.isLoading),
    timeFilter,
    isCustomRangeModalActive,
    dateRange,
    filterOptions,

    // Methods
    handleFilterChange,
    applyCustomRange,
  };
}

export default useDashboard;
