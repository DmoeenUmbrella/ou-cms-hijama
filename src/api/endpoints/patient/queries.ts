import apiClient from "@/api/axios/config";
import type {
  ApiResponse,
  Patient,
  Session,
  FollowUp,
  FetchParams,
} from "./interfaces";

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

  return {
    data: response.data.data,
    total: response.data.totalCount ?? response.data.data.length,
    isSuccess: response.data.isSuccess,
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
