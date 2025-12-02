import apiClient from "@/api/axios/config";
import type {
  ApiResponse,
  Patient,
  Session,
  FollowUp,
  FetchParams,
} from "./interfaces";
import { toast } from "vue-sonner";
import { i18n } from "@/i18n";

// --- PATIENTS ---
export const getPatients = async (
  params: FetchParams = { page: 1, count: 10 }
) => {
  const response = await apiClient.get<ApiResponse<Patient[]>>("/clients", {
    params: {
      page: params.page,
      count: params.count,
      keyword: params.keyword,
      date: params.date,
    },
  });
  if (response?.data?.message?.toLowerCase()?.includes("no clients found")) {
    toast.error(i18n.global.t("session.no_clients") || "Failed to fetch patients");
  }
  return {
    data: response.data.data,
    total: response.data.totalCount ?? response.data.data.length,
    isSuccess: response.data.isSuccess,
    message: response.data.message
  };
};

export const getPatientById = async (id: string) => {
  const response = await apiClient.get<ApiResponse<Patient>>(`/clients/${id}`);
  return response.data.data;
};

// --- SESSIONS ---
export const getSessions = async (
  params: FetchParams & { clientId?: string } = { page: 1, count: 10 }
) => {
  const response = await apiClient.get<ApiResponse<Session[]>>("/appointment", {
    params: {
      page: params.page,
      count: params.count,
      keyword: params.keyword,
      clientId: params.clientId,
      date: params.date,
    },
  });

  return {
    data: response.data.data,
    total: response.data.totalCount ?? response.data.data.length,
    isSuccess: response.data.isSuccess,
  };
};

export const getSessionById = async (id: string) => {
  const response = await apiClient.get<ApiResponse<Session>>(
    `/appointment/${id}`
  );
  return response.data.data;
};

// --- FOLLOWUPS ---
export const getFollowUps = async (
  params: FetchParams & { clientId?: number } = { page: 1, count: 10 }
) => {
  const response = await apiClient.get<ApiResponse<FollowUp[]>>("/follow-up", {
    params: {
      page: params.page,
      count: params.count,
      keyword: params.keyword,
      clientId: params.clientId,
      date: params.date,
    },
  });

  return {
    data: response.data.data,
    total: response.data.totalCount ?? response.data.data.length,
    isSuccess: response.data.isSuccess,
  };
};

export const getFollowUpById = async (id: string) => {
  const response = await apiClient.get<ApiResponse<FollowUp>>(
    `/follow-up/${id}`
  );
  return response.data.data;
};

// Get follow-ups by status (upcoming, past, or all)
import type { FollowUpStatusResponse, CalendarResponse } from "./interfaces";

export const getFollowUpsByStatus = async (
  params: FetchParams & { status?: 'upcoming' | 'past' } = { page: 1, count: 20 }
) => {
  const response = await apiClient.get<FollowUpStatusResponse>("/follow-up/status", {
    params: {
      page: params.page,
      count: params.count,
      status: params.status, // undefined will fetch all
    },
  });

  return response.data;
};

// Get monthly calendar with follow-ups
export const getMonthlyCalendar = async (month: string, year: number) => {
  const response = await apiClient.get<CalendarResponse>("/follow-up/monthly-calendar", {
    params: {
      month,
      year,
    },
  });

  return response.data;
};
