import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { FollowUpItem } from "@/api/endpoints/customer/queries";
import type { Patient } from "@/types/appointment";
import type { FollowUpWithClient } from "@/api/endpoints/patient/interfaces";
import { useFollowupStore } from "../stores/useFollowUpStore";
import { usePatientStore } from "../stores/usePatientStore";
import { isoToReadableDate } from "@/utils/helpers/formatDateTime";
import dateToISOStringFormat from "@/utils/helpers/formatDateTime";

// Helper to convert FollowUpWithClient to FollowUpItem (with client data for general view)
const convertToFollowUpItem = (followUp: FollowUpWithClient): FollowUpItem & { client?: { id: number; name: string } } => ({
  id: followUp.id,
  appointmentId: followUp.appointmentId,
  clientId: followUp.clientId,
  date: followUp.date,
  deletedTime: followUp.deletedTime,
  isDeleted: followUp.isDeleted,
  client: followUp.client ? { id: followUp.client.id, name: followUp.client.name } : undefined,
});

export function useFollowUpTable(
  upcomingFollowUps: FollowUpItem[] | (() => FollowUpItem[]),
  pastFollowUps: FollowUpItem[] | (() => FollowUpItem[]),
  upcomingTotal: number | (() => number),
  pastTotal: number | (() => number),
  _isLoading: boolean | (() => boolean),
  emit: any,
  isClientView: boolean = true // Default to client view for backward compatibility
) {
  const { t, locale } = useI18n();
  const followupStore = useFollowupStore();
  const patientStore = usePatientStore();

  // For general view (!isClientView): use store data directly
  // For client view (isClientView): use props passed from parent
  const upcomingFollowUpsRef = computed(() => {
    if (!isClientView) {
      return followupStore.upcomingFollowUps.map(convertToFollowUpItem);
    }
    return typeof upcomingFollowUps === 'function' 
      ? upcomingFollowUps() 
      : upcomingFollowUps;
  });
  
  const pastFollowUpsRef = computed(() => {
    if (!isClientView) {
      return followupStore.pastFollowUps.map(convertToFollowUpItem);
    }
    return typeof pastFollowUps === 'function'
      ? pastFollowUps()
      : pastFollowUps;
  });
  
  const upcomingTotalRef = computed(() => {
    if (!isClientView) {
      return followupStore.upcomingTotal;
    }
    return typeof upcomingTotal === 'function'
      ? upcomingTotal()
      : upcomingTotal;
  });
  
  const pastTotalRef = computed(() => {
    if (!isClientView) {
      return followupStore.pastTotal;
    }
    return typeof pastTotal === 'function'
      ? pastTotal()
      : pastTotal;
  });

  const allFollowUpsRef = computed(() => {
    if (!isClientView) {
      return followupStore.allFollowUps.map(convertToFollowUpItem);
    }
    return [...upcomingFollowUpsRef.value, ...pastFollowUpsRef.value];
  });

  const allTotalRef = computed(() => {
    if (!isClientView) {
      return followupStore.allTotal;
    }
    return upcomingTotalRef.value + pastTotalRef.value;
  });

  // Active tab
  const activeTab = ref("upcoming");

  // Search and filter state
  const searchQuery = ref("");
  const selectedDate = ref("");

  // Pagination state
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  // Dialog state
  const isModalActive = ref(false);
  const isEditing = ref(false);
  const currentAction = ref<"create-followup" | "edit-followup" | null>(null);
  const selectedPatient = ref<Patient | null>(null);

  // Helper function to convert numbers to Arabic numerals
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

  // Computed: RTL detection
  const isRTL = computed(() => locale.value === "ar");

  // Computed: Text alignment
  const textAlign = computed(() => (isRTL.value ? "text-right" : "text-left"));

  // Computed: All follow-ups (use ref which handles both client and general view)
  const allFollowUps = allFollowUpsRef;
  const allTotal = allTotalRef;

  // Computed: Current tab's data
  const currentFollowUps = computed(() => {
    switch (activeTab.value) {
      case "upcoming":
        return upcomingFollowUpsRef.value;
      case "past":
        return pastFollowUpsRef.value;
      case "all":
        return allFollowUps.value;
      default:
        return [];
    }
  });

  const currentTotal = computed(() => {
    switch (activeTab.value) {
      case "upcoming":
        return upcomingTotalRef.value;
      case "past":
        return pastTotalRef.value;
      case "all":
        return allTotalRef.value;
      default:
        return 0;
    }
  });

  // Helper to get client initials
  const getClientInitials = (name?: string): string => {
    if (!name) return 'NA';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Helper to format date with day name and time
  const formatFollowUpDate = (dateString: string): { date: string; time: string } => {
    const date = new Date(dateString);
    
    // Format: "Wed, Dec 3, 2025"
    const dateFormatted = date.toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    
    // Format: "10:30 AM"
    const timeFormatted = date.toLocaleTimeString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    
    return { date: dateFormatted, time: timeFormatted };
  };

  // Computed: Formatted follow-ups for display
  const formattedFollowUps = computed(() => {
    return currentFollowUps.value.map((followUp: any) => {
      const formattedDate = formatFollowUpDate(followUp.date);
      return {
        id: followUp.id,
        followUpId: `#${toArabicNumerals(followUp.id)}`,
        appointmentId: toArabicNumerals(followUp.appointmentId),
        clientId: toArabicNumerals(followUp.clientId),
        date: formattedDate.date,
        time: formattedDate.time,
        // Client info for general view
        client: followUp.client ? {
          id: followUp.client.id,
          name: followUp.client.name,
          initials: getClientInitials(followUp.client.name),
        } : null,
      };
    });
  });

  // Computed: Pagination
  const totalPages = computed(() =>
    Math.ceil(currentTotal.value / itemsPerPage.value)
  );
  const canGoPrevious = computed(() => currentPage.value > 1);
  const canGoNext = computed(() => currentPage.value < totalPages.value);

  // Computed: Modal title
  const modalTitle = computed(() => {
    return isEditing.value
      ? t("followup.edit_label")
      : t("session.schedule_follow_up");
  });

  // Handlers
  const handleAddFollowUp = () => {
    emit("add-followup");
  };

  const openFollowUpModal = async (patient: Patient) => {
    isEditing.value = false;
    currentAction.value = "create-followup";
    selectedPatient.value = patient;
    console.log("Patient in followup", patient);
    
    // Fetch patient details
    const data = await patientStore.getClients(patient.id);
    console.log("Fetched patient data:", data);
    
    if (data) {
      patient.lastSessionDate = isoToReadableDate(data?.lastAppointmentDate);
      patient.totalSessions = data?.totalSessions;
      selectedPatient.value = patient;
    }
    
    followupStore.resetFormFollowUp();
    isModalActive.value = true;
  };

  const closeModal = () => {
    followupStore.resetFormFollowUp();
    isModalActive.value = false;
    selectedPatient.value = null;
    isEditing.value = false;
    currentAction.value = null;
  };

  const handleFormSubmit = async (payload: any) => {
    const formatDateField = (field?: string | Date) => {
      if (!field) return null;
      if (field instanceof Date) {
        return field.toISOString();
      }
      return dateToISOStringFormat(field);
    };

    try {
      let response;

      switch (currentAction.value) {
        case "create-followup":
          response = await followupStore.createFollowUp({
            ...payload,
            date: formatDateField(payload.date),
          });
          break;

        case "edit-followup":
          response = await followupStore.updateFollowUp({
            ...payload,
            date: formatDateField(payload.date),
          });
          break;

        default:
          throw new Error(`Unknown form action: ${currentAction.value}`);
      }

      if (response && typeof response === 'object' && 'isSuccess' in response && response.isSuccess) {
        closeModal();
        // Refresh follow-ups list
        emit("refresh-followups");
      } else if (response === true) {
        closeModal();
        emit("refresh-followups");
      } else {
        console.warn("Unexpected API response:", response);
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handlePageChange = (page: number) => {
    currentPage.value = page;
    emit(
      "page-change",
      activeTab.value as "upcoming" | "past" | "all",
      page
    );
  };

  const handlePreviousPage = () => {
    if (canGoPrevious.value) {
      handlePageChange(currentPage.value - 1);
    }
  };

  const handleNextPage = () => {
    if (canGoNext.value) {
      handlePageChange(currentPage.value + 1);
    }
  };

  // Watch active tab to reset pagination
  watch(activeTab, () => {
    currentPage.value = 1;
  });

  return {
    // State
    activeTab,
    searchQuery,
    selectedDate,
    currentPage,
    itemsPerPage,

    // Dialog state
    isModalActive,
    isEditing,
    currentAction,
    selectedPatient,

    // Computed
    isRTL,
    textAlign,
    allFollowUps,
    allTotal,
    upcomingTotal: upcomingTotalRef,
    pastTotal: pastTotalRef,
    currentFollowUps,
    currentTotal,
    formattedFollowUps,
    totalPages,
    canGoPrevious,
    canGoNext,
    modalTitle,

    // Helpers
    toArabicNumerals,

    // Handlers
    handleAddFollowUp,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
    openFollowUpModal,
    closeModal,
    handleFormSubmit,

    // Translation
    t,
  };
}
