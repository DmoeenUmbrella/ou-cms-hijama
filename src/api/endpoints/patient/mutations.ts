import apiClient from "@/api/axios/config";
import type {
  PatientPayload,
  SessionPayload,
  FollowUpPayload,
  ApiResponse,
} from "./interfaces";

// --- PATIENTS ---
export const createPatient = async (payload: PatientPayload) => {
  const response = await apiClient.post<ApiResponse<any>>("/clients", payload);
  return response.data;
};

export const updatePatient = async (payload: PatientPayload) => {
  const response = await apiClient.put<ApiResponse<any>>("/clients", {
    ...payload,
  });
  return response.data;
};

export const deletePatient = async (id: string) => {
  const response = await apiClient.delete<ApiResponse<any>>(`/clients/${id}`);
  return response.data;
};

// --- SESSIONS ---
export const createSession = async (payload: SessionPayload) => {
  const response = await apiClient.post<ApiResponse<any>>(
    "/appointment",
    payload
  );
  return response.data;
};

export const updateSession = async (payload: SessionPayload) => {
  const response = await apiClient.put<ApiResponse<any>>("/appointment", {
    ...payload,
  });
  return response.data;
};

export const deleteSession = async (id: string) => {
  const response = await apiClient.delete<ApiResponse<any>>(
    `/appointment/${id}`
  );
  return response.data;
};

// --- FOLLOW-UPS ---
export const createFollowUp = async (payload: FollowUpPayload) => {
  const response = await apiClient.post<ApiResponse<any>>(
    "/follow-up",
    payload
  );
  return response.data;
};

export const updateFollowUp = async (id: string, payload: FollowUpPayload) => {
  const response = await apiClient.put<ApiResponse<any>>("/follow-up", {
    id,
    ...payload,
  });
  return response.data;
};

export const deleteFollowUp = async (id: string) => {
  const response = await apiClient.delete<ApiResponse<any>>(`/follow-up/${id}`);
  return response.data;
};
