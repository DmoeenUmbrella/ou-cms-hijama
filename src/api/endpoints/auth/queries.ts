import apiClient from "@/api/axios/config";
import type { UserProfile } from "@/stores/useAuthStore";

export const fetchCurrentUser = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>("/auth/me");
  return response.data;
};
