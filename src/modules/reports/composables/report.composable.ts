import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useReportStore, type DateRangeType } from "../stores/useReportStore";
import { storeToRefs } from "pinia";

export interface DateRangeOption {
  value: DateRangeType;
  label: string;
}

export function useReport() {
  const { t, locale } = useI18n();
  const reportStore = useReportStore();
  
  // Use storeToRefs for reactive state
  const { dateFilter, isLoading, dateRange } = storeToRefs(reportStore);

  // RTL detection
  const isRTL = computed(() => locale.value === "ar");

  // Date range options for dropdown
  const dateRangeOptions = computed<DateRangeOption[]>(() => [
    { value: 'last7Days' as DateRangeType, label: t('reports.filters.last_7_days') },
    { value: 'last30Days' as DateRangeType, label: t('reports.filters.last_30_days') },
    { value: 'last90Days' as DateRangeType, label: t('reports.filters.last_90_days') },
    { value: 'thisMonth' as DateRangeType, label: t('reports.filters.this_month') },
    { value: 'lastMonth' as DateRangeType, label: t('reports.filters.last_month') },
    { value: 'last3Months' as DateRangeType, label: t('reports.filters.last_3_months') },
    { value: 'customRange' as DateRangeType, label: t('reports.filters.custom') },
  ]);

  // Current filter type - with null safety
  const currentFilterType = computed(() => dateFilter.value?.type ?? 'last30Days');
  
  // Is custom range selected
  const isCustomRange = computed(() => dateFilter.value?.type === 'customRange');

  // Custom date values - with null safety
  const customStartDate = computed(() => dateFilter.value?.startDate ?? null);
  const customEndDate = computed(() => dateFilter.value?.endDate ?? null);

  // Handlers
  const handleFilterTypeChange = (type: DateRangeType) => {
    reportStore.setDateFilterType(type);
  };

  const handleStartDateChange = (date: string) => {
    reportStore.setStartDate(date);
  };

  const handleEndDateChange = (date: string) => {
    reportStore.setEndDate(date);
  };

  const handleApplyFilter = () => {
    // This can be used to trigger API calls with the new date range
    console.log('Applying filter with date range:', dateRange.value);
    // Return the date range for external use
    return dateRange.value;
  };

  const resetFilter = () => {
    reportStore.resetDateFilter();
  };

  return {
    // State from store
    isLoading,
    
    // Computed
    isRTL,
    dateRangeOptions,
    currentFilterType,
    isCustomRange,
    customStartDate,
    customEndDate,
    dateRange,

    // Handlers
    handleFilterTypeChange,
    handleStartDateChange,
    handleEndDateChange,
    handleApplyFilter,
    resetFilter,

    // Translation
    t,
  };
}
