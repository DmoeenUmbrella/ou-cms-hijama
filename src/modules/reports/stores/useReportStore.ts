import { defineStore } from "pinia";
import { ref, computed } from "vue";

export type DateRangeType = 
  | 'last7Days' 
  | 'last30Days' 
  | 'last90Days' 
  | 'thisMonth' 
  | 'lastMonth' 
  | 'last3Months' 
  | 'customRange';

export interface DateFilter {
  type: DateRangeType;
  startDate: string | null;
  endDate: string | null;
}

export const useReportStore = defineStore("reports", () => {
  // --- STATE ---
  const isLoading = ref(false);
  
  // Date filter state
  const dateFilter = ref<DateFilter>({
    type: 'last30Days',
    startDate: null,
    endDate: null,
  });

  // --- GETTERS ---
  const currentDateFilter = computed(() => dateFilter.value);
  
  const isCustomRange = computed(() => dateFilter.value.type === 'customRange');

  // Calculate actual date range based on filter type
  const dateRange = computed(() => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date = today;

    switch (dateFilter.value.type) {
      case 'last7Days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'last30Days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        break;
      case 'last90Days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 90);
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'last3Months':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 3);
        break;
      case 'customRange':
        return {
          startDate: dateFilter.value.startDate,
          endDate: dateFilter.value.endDate,
        };
      default:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  });

  // --- ACTIONS ---
  const setDateFilterType = (type: DateRangeType) => {
    dateFilter.value.type = type;
    if (type !== 'customRange') {
      dateFilter.value.startDate = null;
      dateFilter.value.endDate = null;
    }
  };

  const setCustomDateRange = (startDate: string, endDate: string) => {
    dateFilter.value.type = 'customRange';
    dateFilter.value.startDate = startDate;
    dateFilter.value.endDate = endDate;
  };

  const setStartDate = (date: string) => {
    dateFilter.value.startDate = date;
  };

  const setEndDate = (date: string) => {
    dateFilter.value.endDate = date;
  };

  const resetDateFilter = () => {
    dateFilter.value = {
      type: 'last30Days',
      startDate: null,
      endDate: null,
    };
  };

  return {
    // State
    isLoading,
    dateFilter,

    // Getters
    currentDateFilter,
    isCustomRange,
    dateRange,

    // Actions
    setDateFilterType,
    setCustomDateRange,
    setStartDate,
    setEndDate,
    resetDateFilter,
  };
});
