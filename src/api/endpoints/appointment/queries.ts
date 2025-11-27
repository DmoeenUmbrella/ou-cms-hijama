import apiClient from "@/api/axios/config";
import type { Appointment } from "@/types/appointment";

interface FetchAppointmentsParams {
  page: number;
  count: number;
  keyword?: string;
}

interface FetchAppointmentsResponse {
  data: Appointment[];
  total: number;
}

export const getAppointments = async (params: FetchAppointmentsParams) => {
  // Ensure params are correctly passed as query string
  const response = await apiClient.get<FetchAppointmentsResponse>(
    "/appointment",
    {
      params: {
        page: params.page,
        count: params.count,
        keyword: params.keyword,
      },
    }
  );
  return response.data;
};

export const getAppointmentById = async (id: number) => {
  const response = await apiClient.get<Appointment>(`/appointment/${id}`);
  return response.data;
};
