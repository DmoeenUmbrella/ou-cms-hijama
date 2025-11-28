import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { toast } from "vue-sonner";
import { i18n } from "@/i18n";
import type { FollowUp, CreateFollowUpPayload } from "@/types/appointment";
import { appointmentMutations, appointmentQueries } from "@/api/endpoints";
import type { FollowUpPayload } from "@/api/endpoints/patient/interfaces";

export const useFollowupStore = defineStore("followUps", () => {
  // --- STATE ---
  const followUps = ref<FollowUp[]>([]);
  const totalFollowUps = ref(0);
  const isLoading = ref(false);

  const filters = ref({
    page: 1,
    count: 10,
    keyword: "",
    clientId: "" as string | null,
  });

  // --- FORM STATE ---
  const formFollowUp = ref<CreateFollowUpPayload>({
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
  };

  // --- ACTIONS ---
  const fetchFollowUps = async () => {
    isLoading.value = true;
    try {
      const response = await appointmentQueries.getFollowUps({
        page: filters.value.page,
        count: filters.value.count,
        keyword: filters.value.keyword,
      });

      if (response.isSuccess) {
        followUps.value = response.data;
        totalFollowUps.value = response.total;
      } else {
        toast.error(
          i18n.global.t("followup.fetch_error") || "Failed to fetch follow-ups"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        i18n.global.t("followup.fetch_error") || "Failed to fetch follow-ups"
      );
    } finally {
      isLoading.value = false;
    }
  };

  const createFollowUp = async (payload: FollowUpPayload) => {
    isLoading.value = true;
    try {
      await appointmentMutations.createFollowUp({ ...payload });
      toast.success(
        i18n.global.t("followup.create_success") || "Follow-up created"
      );
      resetFormFollowUp();
      await fetchFollowUps();
      return true;
    } catch (error) {
      console.error(error);
      toast.error(
        i18n.global.t("followup.create_error") || "Failed to create follow-up"
      );
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const updateFollowUp = async (id: string) => {
    isLoading.value = true;
    try {
      await appointmentMutations.updateFollowUp(id, { ...formFollowUp.value });
      toast.success(
        i18n.global.t("followup.update_success") || "Follow-up updated"
      );
      resetFormFollowUp();
      await fetchFollowUps();
      return true;
    } catch (error) {
      console.error(error);
      toast.error(
        i18n.global.t("followup.update_error") || "Failed to update follow-up"
      );
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
      toast.success(
        i18n.global.t("followup.delete_success") || "Follow-up deleted"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        i18n.global.t("followup.delete_error") || "Failed to delete follow-up"
      );
    } finally {
      isLoading.value = false;
    }
  };

  return {
    followUps,
    totalFollowUps,
    isLoading,
    filters,
    formFollowUp,
    filteredFollowUps,
    fetchFollowUps,
    createFollowUp,
    updateFollowUp,
    deleteFollowUp,
    resetFormFollowUp,
  };
});
