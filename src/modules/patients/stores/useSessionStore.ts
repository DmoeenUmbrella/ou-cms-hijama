import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { toast } from "vue-sonner";
import { i18n } from "@/i18n";
import type { Session, CreateSessionPayload } from "@/types/appointment";
import { appointmentMutations, appointmentQueries } from "@/api/endpoints";
import type { SessionPayload } from "@/api/endpoints/patient/interfaces";

export const useSessionStore = defineStore("sessions", () => {
  // --- STATE ---
  const sessions = ref<Session[]>([]);
  const totalSessions = ref(0);
  const isLoading = ref(false);

  const filters = ref({
    page: 1,
    count: 10,
    keyword: "",
    clientId: "" as string | null,
  });

  // --- FORM STATE ---
  const formSession = ref<CreateSessionPayload>({
    id: "",
    clientId: "",
    clinicId: "",
    serviceId: "",
    cupsCount: 0,
    amount: 0,
    paymentMethod: "Cash",
    notes: "",
    date: new Date().toISOString().slice(0, 10),
    time: "09:00",
    status: "completed",
  });

  // --- GETTERS ---
  const filteredSessions = computed(() => sessions.value);

  // --- HELPERS ---
  const resetFormSession = () => {
    Object.assign(formSession.value, {
      clientId: "",
      serviceId: "",
      cupsCount: 0,
      amount: 0,
      paymentMethod: "Cash",
      notes: "",
      date: new Date().toISOString().slice(0, 10),
      time: "09:00",
      status: "completed",
    });
  };

  // --- ACTIONS ---
  const fetchSessions = async () => {
    isLoading.value = true;
    try {
      const response = await appointmentQueries.getSessions({
        page: filters.value.page,
        count: filters.value.count,
        keyword: filters.value.keyword,
        clientId: filters.value.clientId || undefined,
      });

      if (response.isSuccess) {
        sessions.value = response.data;
        totalSessions.value = response.total;
      } else {
        toast.error(
          i18n.global.t("session.fetch_error") || "Failed to fetch sessions"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        i18n.global.t("session.fetch_error") || "Failed to fetch sessions"
      );
    } finally {
      isLoading.value = false;
    }
  };

  const createSession = async (payload: SessionPayload) => {
    isLoading.value = true;
    try {
      await appointmentMutations.createSession({ ...payload });
      toast.success(
        i18n.global.t("session.create_success") || "Session created"
      );
      resetFormSession();
      await fetchSessions();
      return true;
    } catch (error) {
      console.error(error);
      toast.error(
        i18n.global.t("session.create_error") || "Failed to create session"
      );
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const updateSession = async (payload: SessionPayload) => {
    isLoading.value = true;
    try {
      await appointmentMutations.updateSession({ ...payload });
      toast.success(
        i18n.global.t("session.update_success") || "Session updated"
      );
      resetFormSession();
      await fetchSessions();
      return true;
    } catch (error) {
      console.error(error);
      toast.error(
        i18n.global.t("session.update_error") || "Failed to update session"
      );
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteSession = async (id: string) => {
    isLoading.value = true;
    try {
      await appointmentMutations.deleteSession(id);
      sessions.value = sessions.value.filter((s) => s.id !== id);
      toast.success(
        i18n.global.t("session.delete_success") || "Session deleted"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        i18n.global.t("session.delete_error") || "Failed to delete session"
      );
    } finally {
      isLoading.value = false;
    }
  };

  return {
    sessions,
    totalSessions,
    isLoading,
    filters,
    formSession,
    filteredSessions,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
    resetFormSession,
  };
});
