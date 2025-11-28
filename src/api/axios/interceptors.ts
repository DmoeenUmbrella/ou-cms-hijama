import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { initiateLogin } from "@/composables/auth.composable";

export function setupInterceptors(instance: AxiosInstance) {
  // Request Interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const authStore = useAuthStore();
      if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        const authStore = useAuthStore();

        if (authStore.isAuthenticated) {
          authStore.logout();
          // Redirect to Keycloak on session expiry
          initiateLogin();
        }
      }
      return Promise.reject(error);
    }
  );
}
