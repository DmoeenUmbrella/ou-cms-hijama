import { ref, computed, watch } from "vue";
import { useFollowupStore } from "../stores/useFollowUpStore";
import { useI18n } from "vue-i18n";
import type { Patient } from "@/types/appointment";
import dateToISOStringFormat from "@/utils/helpers/formatDateTime";

export function useFollowUpView() {
  const followupStore = useFollowupStore();
  const { t } = useI18n();

  // --- UI State ---
  const isModalActive = ref(false);
  const isDeleteModalActive = ref(false);
  const selectedFollowUp = ref<Patient | null>(null);
  const followUpToDelete = ref(null as any);
  const isEditing = ref(false);
  const currentAction = ref<"create-followup" | "edit-followup" | null>(null);

  // --- Computed ---
  const modalTitle = computed(() => {
    return isEditing.value
      ? t("followup.edit_label")
      : t("session.schedule_follow_up");
  });

  // Store data
  const upcomingFollowUps = computed(() => followupStore.upcomingFollowUps);
  const pastFollowUps = computed(() => followupStore.pastFollowUps);
  const allFollowUps = computed(() => followupStore.allFollowUps);
  const upcomingTotal = computed(() => followupStore.upcomingTotal);
  const pastTotal = computed(() => followupStore.pastTotal);
  const allTotal = computed(() => followupStore.allTotal);
  const isLoading = computed(() => followupStore.isLoading);

  // --- Handlers ---
  const openFollowUpModal = () => {
    followupStore.resetFormFollowUp();
    isModalActive.value = true;
  };

  const handleCreateFollowUp = async (patient: Patient) => {
    isEditing.value = false;
    currentAction.value = "create-followup";
    selectedFollowUp.value = patient;
    openFollowUpModal();
  };

  const handleEditFollowUp = (followUp: any) => {
    isEditing.value = true;
    currentAction.value = "edit-followup";
    selectedFollowUp.value = followUp;
    openFollowUpModal();
  };

  const handleDeleteConfirmation = (followUp: any) => {
    followUpToDelete.value = followUp;
    isDeleteModalActive.value = true;
  };

  const handleDeleteFollowUp = async () => {
    if (followUpToDelete.value) {
      await followupStore.deleteFollowUp(followUpToDelete.value.id);
      isDeleteModalActive.value = false;
    }
  };

  const handleFormSubmit = async (payload: any) => {
    const action = currentAction.value;

    // Helper to safely transform date fields
    const formatDateField = (field?: string | Date) => {
      if (!field) return null;
      if (field instanceof Date) {
        return field.toISOString();
      }
      return dateToISOStringFormat(field);
    };

    try {
      let response;

      switch (action) {
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
          throw new Error(`Unknown form action: ${action}`);
      }

      if (response && typeof response === 'object' && 'isSuccess' in response && response.isSuccess) {
        handleFormSubmitSuccess();
      } else if (response === true) {
        handleFormSubmitSuccess();
      } else {
        console.warn("Unexpected API response:", response);
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleFormSubmitSuccess = () => {
    isModalActive.value = false;
    selectedFollowUp.value = null;
  };

  const closeModal = () => {
    followupStore.resetFormFollowUp();
    isModalActive.value = false;
    selectedFollowUp.value = null;
  };

  watch(
    () => isModalActive.value,
    (newVal) => {
      if (!newVal) {
        selectedFollowUp.value = null;
      }
    },
    { deep: true }
  );

  return {
    // UI State
    isModalActive,
    isDeleteModalActive,
    selectedFollowUp,
    followUpToDelete,

    // Computed
    isEditing,
    modalTitle,
    currentAction,
    upcomingFollowUps,
    pastFollowUps,
    allFollowUps,
    upcomingTotal,
    pastTotal,
    allTotal,
    isLoading,

    // Handlers
    openFollowUpModal,
    handleCreateFollowUp,
    handleEditFollowUp,
    handleDeleteConfirmation,
    handleDeleteFollowUp,
    handleFormSubmitSuccess,
    handleFormSubmit,
    closeModal,
  };
}
