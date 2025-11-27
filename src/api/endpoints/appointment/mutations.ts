import apiClient from "@/api/axios/config";
import type { AppointmentPayload } from "@/types/appointment";

export const createAppointment = async (payload: AppointmentPayload) => {
  const response = await apiClient.post("/appointment", payload);
  return response.data;
};

export const updateAppointment = async (
  id: number,
  payload: AppointmentPayload
) => {
  // API expects ID in body as well based on your description
  const response = await apiClient.put("/appointment", { id, ...payload });
  return response.data;
};

export const deleteAppointment = async (id: number) => {
  const response = await apiClient.delete(`/appointment/${id}`);
  return response.data;
};
