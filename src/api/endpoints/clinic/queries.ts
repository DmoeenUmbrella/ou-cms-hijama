import apiClient from "@/api/axios/config";
import type { ApiResponse } from "@/api/endpoints/patient/interfaces";
import type { Clinic } from "./interfaces";

export const getClinics = async (page = 1, count = 10, keyword = "") => {
  const response = await apiClient.get<ApiResponse<Clinic[]>>("/clinic", {
    params: { page, count, keyword },
  });

  return {
    data: response.data.data,
    total: response.data.totalCount ?? response.data.data.length,
  };
};

export const getClinicById = async (id: number) => {
  const response = await apiClient.get<ApiResponse<Clinic>>(`/clinic/${id}`);
  return response.data.data;
};
