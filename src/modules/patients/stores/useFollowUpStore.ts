import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { toast } from "vue-sonner";
import { appointmentMutations } from "@/api/endpoints";
import type { FollowUpPayload, FollowUpWithClient, CalendarDay } from "@/api/endpoints/patient/interfaces";
import { getFollowUpById, getFollowUpsByStatus, getMonthlyCalendar } from "@/api/endpoints/patient/queries";
import type { FollowUp as FollowUpAPI } from "@/api/endpoints/patient/interfaces";
import { useI18n } from "vue-i18n";
export const useFollowupStore = defineStore("followUps", () => {
  // --- STATE ---
  const { t } = useI18n();
  const followUps = ref<FollowUpAPI[]>([]);
  const upcomingFollowUps = ref<FollowUpWithClient[]>([]);
  const pastFollowUps = ref<FollowUpWithClient[]>([]);
  const allFollowUps = ref<FollowUpWithClient[]>([]);
  const totalFollowUps = ref(0);
  const upcomingTotal = ref(0);
  const pastTotal = ref(0);
  const allTotal = ref(0);
  const selectedFollowUp = ref<FollowUpAPI | null>(null);
  const isLoading = ref(false);
  const pageSize = ref(20);

  // Calendar state
  const calendarData = ref<CalendarDay[]>([]);
  const currentMonth = ref(new Date().getMonth()); // 0-indexed
  const currentYear = ref(new Date().getFullYear());
  const isCalendarLoading = ref(false);

  const filters = ref({
    page: 1,
    count: 20,
    keyword: "",
  });

  // --- FORM STATE ---
  const formFollowUp = ref<FollowUpPayload>({
    clientId: "",
    date: new Date().toISOString().slice(0, 10),
  });

  // --- GETTERS ---
  const filteredFollowUps = computed(() => followUps.value);

  // --- HELPERS ---
  const resetFormFollowUp = () => {
    Object.assign(formFollowUp.value, {
      clientId: "",
      date: new Date().toISOString().slice(0, 10),
    });
    selectedFollowUp.value = null;
  };

  // --- ACTIONS ---
  const fetchFollowUpsByStatus = async (status?: 'upcoming' | 'past', page: number = 1) => {
    isLoading.value = true;
    try {
      const response = await getFollowUpsByStatus({
        page,
        count: filters.value.count,
        status,
      });

      if (response.isSuccess) {
        if (status === 'upcoming') {
          upcomingFollowUps.value = response.data.followUps;
          upcomingTotal.value = response.totalCount;
        } else if (status === 'past') {
          pastFollowUps.value = response.data.followUps;
          pastTotal.value = response.totalCount;
        } else {
          // All follow-ups
          allFollowUps.value = response.data.followUps;
          allTotal.value = response.totalCount;
        }
        totalFollowUps.value = response.data.totalFollowUps;
      } else {
        toast.error("Failed to fetch follow-ups");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch follow-ups");
    } finally {
      isLoading.value = false;
    }
  };

  const getFollowUp = async (id: string) => {
    try {
      const response = await getFollowUpById(id);
      return response;
    } catch (error) {
      toast.error("Failed to fetch follow-up");
    }
  };

  const createFollowUp = async (payload: FollowUpPayload) => {
    isLoading.value = true;
    try {
      const data = await appointmentMutations.createFollowUp(payload);
      if (data.isSuccess) {
        toast.success("Follow-up created successfully");
        resetFormFollowUp();
        // Refresh both upcoming and past follow-ups
        await Promise.all([
          fetchFollowUpsByStatus('upcoming', filters.value.page),
          fetchFollowUpsByStatus('past', filters.value.page),
        ]);
      } else {
        toast.error(
        t("session.create_failed") || "Failed to create follow-up"
        );
      }
      return data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to create follow-up");
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const updateFollowUp = async (payload: FollowUpPayload) => {
    if (!payload.clientId) return false;
    isLoading.value = true;
    try {
      const data = await appointmentMutations.updateFollowUp(payload.clientId.toString(), payload);
      if (data.isSuccess) {
        toast.success("Follow-up updated successfully");
        resetFormFollowUp();
        // Refresh both upcoming and past follow-ups
        await Promise.all([
          fetchFollowUpsByStatus('upcoming', filters.value.page),
          fetchFollowUpsByStatus('past', filters.value.page),
        ]);
      } else {
        toast.error("Failed to update follow-up");
      }
      return data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to update follow-up");
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteFollowUp = async (id: string) => {
    isLoading.value = true;
    try {
      await appointmentMutations.deleteFollowUp(id);
      followUps.value = followUps.value.filter((f) => f.id !== id);
      toast.success("Follow-up deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete follow-up");
    } finally {
      isLoading.value = false;
    }
  };

  // Calendar actions
  const monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];

  const fetchCalendarData = async (month?: number, year?: number) => {
    isCalendarLoading.value = true;
    const targetMonth = month ?? currentMonth.value;
    const targetYear = year ?? currentYear.value;
    const monthName = monthNames[targetMonth] || 'january';
    
    try {
      const response = await getMonthlyCalendar(monthName, targetYear);
      if (response.isSuccess) {
        calendarData.value = response.data.calendar;
        currentMonth.value = targetMonth;
        currentYear.value = targetYear;
      } else {
        toast.error("Failed to fetch calendar data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch calendar data");
    } finally {
      isCalendarLoading.value = false;
    }
  };

  const goToPreviousMonth = () => {
    let newMonth = currentMonth.value - 1;
    let newYear = currentYear.value;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    fetchCalendarData(newMonth, newYear);
  };

  const goToNextMonth = () => {
    let newMonth = currentMonth.value + 1;
    let newYear = currentYear.value;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    fetchCalendarData(newMonth, newYear);
  };

  return {
    // State
    followUps,
    upcomingFollowUps,
    pastFollowUps,
    allFollowUps,
    totalFollowUps,
    upcomingTotal,
    pastTotal,
    allTotal,
    selectedFollowUp,
    isLoading,
    filters,
    pageSize,
    formFollowUp,

    // Calendar state
    calendarData,
    currentMonth,
    currentYear,
    isCalendarLoading,

    // Getters
    filteredFollowUps,

    // Actions
    fetchFollowUpsByStatus,
    getFollowUp,
    createFollowUp,
    updateFollowUp,
    deleteFollowUp,
    resetFormFollowUp,

    // Calendar actions
    fetchCalendarData,
    goToPreviousMonth,
    goToNextMonth,
  };
});
