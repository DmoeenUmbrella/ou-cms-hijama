import apiClient from "@/api/axios/config";
import type { DashboardParams, DashboardResponse } from "./types";

export const getDashboardAnalytics = async (params: DashboardParams) => {
  const response = await apiClient.get<DashboardResponse>("/dashboard", {
    params: {
      dataType: params.dataType,
      startDate: params.startDate,
      endDate: params.endDate,
    },
  });
  return response.data;
};
