import apiClient from "@/api/axios/config";
import type { AuthResponse, BackendAuthResponse } from "./interfaces";

export const exchangeAuthCode = async (code: string): Promise<AuthResponse> => {
  const redirect_uri = `${import.meta.env.VITE_APP_URL}/authenticating`;

  const response = await apiClient.post<BackendAuthResponse>("/auth", {
    code,
    redirect_uri,
  });

  // Map the backend format (accessToken) to our app format (token)
  // and cast the user to UserProfile (ensuring types align where needed)
  const { data } = response.data;
debugger
  return {
    token: data.accessToken,
    refreshToken: data?.keycloakTokens?.refresh_token ?? "",
    user: {
      id: String(data.user.id), // Convert number to string if your store expects string
      username: data.user.email, // Fallback username
      email: data.user.email,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      roles: data.isAdmin ? ["admin"] : ["user"], // Map boolean to role array
    },
  };
};

export const logoutUser = async (token: string): Promise<void> => {
    debugger
  await apiClient.put("/auth/logout", { refreshToken: token });
};