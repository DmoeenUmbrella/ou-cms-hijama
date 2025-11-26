import { useMutation } from "@tanstack/vue-query";
import { useRouter } from "vue-router";
import { authMutations } from "@/api/endpoints";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "vue-sonner";

// Standalone function for use in Router Guards (outside component context)
export const initiateLogin = () => {
  const authUrl = import.meta.env.VITE_KEYCLOAK_AUTH_URL;
  const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
  const redirectUri = `${import.meta.env.VITE_APP_URL}/authenticating`;
  if (!authUrl || !clientId) {
    console.error("Missing Keycloak Environment Variables");
    return;
  }

  const targetUrl = `${authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=openid`;

  // Hard redirect to Keycloak
  window.location.href = targetUrl;
};

export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore();

  // 1. Login (Redirects to Keycloak)
  const login = () => {
    initiateLogin();
  };

  // 2. Exchange Code
  const {
    mutate: exchangeCode,
    isPending: isAuthenticating,
    error: authError,
  } = useMutation({
    mutationFn: authMutations.exchangeAuthCode,

    onSuccess: (response) => {
      authStore.setAuth(response.token, response.refreshToken, response.user);
      toast.success(`Welcome back, ${response.user.firstName || "User"}!`);
      router.replace("/dashboard");
    },
    onError: (error: any) => {
      console.error("Auth Failed", error);
      toast.error("Authentication failed. Please try again.");
      // On error, maybe redirect back to login after a delay?
      setTimeout(() => initiateLogin(), 2000);
    },
  });
  const { mutate: performLogout } = useMutation({
    mutationFn: () => {
      const token = authStore.keycloakRefreshToken;
      if (!token) {
        return Promise.resolve(); // Nothing to invalidate on server if no token
      }
      debugger
      return authMutations.logoutUser(token);
    },
    onSettled: () => {
      // We clear local state regardless of server success/fail
      debugger
      authStore.logout();
      toast.info("Logged out successfully");
      initiateLogin();
    },
  });

  const logout = () => {
    performLogout();
    debugger
  };

  return {
    login,
    exchangeCode,
    isAuthenticating,
    authError,
    logout,
  };
}
