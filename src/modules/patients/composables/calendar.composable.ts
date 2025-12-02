import { computed } from "vue";
import { useFollowupStore } from "../stores/useFollowUpStore";
import { useI18n } from "vue-i18n";
import type { CalendarDay } from "@/api/endpoints/patient/interfaces";

export function useFollowUpCalendar() {
  const followupStore = useFollowupStore();
  const { t, locale } = useI18n();

  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const arabicMonthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const arabicWeekDays = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  // Computed properties
  const calendarData = computed(() => followupStore.calendarData);
  const currentMonth = computed(() => followupStore.currentMonth);
  const currentYear = computed(() => followupStore.currentYear);
  const isLoading = computed(() => followupStore.isCalendarLoading);

  const isRTL = computed(() => locale.value === 'ar');

  const displayMonthName = computed(() => {
    const names = isRTL.value ? arabicMonthNames : monthNames;
    return names[currentMonth.value] || monthNames[0];
  });

  const displayWeekDays = computed(() => {
    return isRTL.value ? arabicWeekDays : weekDays;
  });

  const displayMonthYear = computed(() => {
    return `${displayMonthName.value} ${currentYear.value}`;
  });

  // Helper to convert numbers to Arabic numerals
  const toArabicNumerals = (num: number | string): string => {
    if (locale.value !== "ar") return num.toString();

    const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num
      .toString()
      .split("")
      .map((digit) => {
        const parsed = parseInt(digit);
        return isNaN(parsed) ? digit : arabicNumerals[parsed];
      })
      .join("");
  };

  // Get day number from date string
  const getDayNumber = (dateString: string): number => {
    const date = new Date(dateString);
    return date.getDate();
  };

  // Check if a date is today
  const isToday = (dateString: string): boolean => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Get the first day of the month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = computed(() => {
    const date = new Date(currentYear.value, currentMonth.value, 1);
    return date.getDay();
  });

  // Get empty cells for the start of the calendar
  const emptyStartCells = computed(() => {
    return Array(getFirstDayOfMonth.value).fill(null);
  });

  // Calendar grid with empty cells for proper alignment
  const calendarGrid = computed(() => {
    const emptyCells = emptyStartCells.value.map(() => ({
      date: '',
      isCreated: false,
      followUps: [],
      isEmpty: true,
    }));
    
    const dateCells = calendarData.value.map((day: CalendarDay) => ({
      ...day,
      isEmpty: false,
    }));

    return [...emptyCells, ...dateCells];
  });

  // Total scheduled follow-ups in current month
  const totalScheduledFollowUps = computed(() => {
    return calendarData.value.reduce((total, day) => {
      return total + day.followUps.length;
    }, 0);
  });

  // Actions
  const goToPreviousMonth = () => {
    followupStore.goToPreviousMonth();
  };

  const goToNextMonth = () => {
    followupStore.goToNextMonth();
  };

  const fetchCalendarData = (month?: number, year?: number) => {
    followupStore.fetchCalendarData(month, year);
  };

  // Initialize calendar on mount
  const initializeCalendar = () => {
    fetchCalendarData();
  };

  return {
    // State
    calendarData,
    currentMonth,
    currentYear,
    isLoading,
    isRTL,

    // Computed
    displayMonthName,
    displayWeekDays,
    displayMonthYear,
    emptyStartCells,
    calendarGrid,
    getFirstDayOfMonth,
    totalScheduledFollowUps,

    // Helpers
    getDayNumber,
    isToday,
    toArabicNumerals,

    // Actions
    goToPreviousMonth,
    goToNextMonth,
    fetchCalendarData,
    initializeCalendar,

    // i18n
    t,
  };
}
