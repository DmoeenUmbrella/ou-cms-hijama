import apiClient from "@/api/axios/config";
import type { ApiResponse } from "@/api/endpoints/patient/interfaces";
import type { Technician } from "./interfaces";

export const getTechnicians = async (page = 1, count = 10, keyword = "") => {
  const response = await apiClient.get<ApiResponse<Technician[]>>(
    "/technician",
    {
      params: { page, count, keyword },
    }
  );

  return {
    data: response.data.data,
    total: response.data.totalCount ?? response.data.data.length,
  };
};

export const getTechnicianById = async (id: number) => {
  const response = await apiClient.get<ApiResponse<Technician>>(
    `/technician/${id}`
  );
  return response.data.data;
};
