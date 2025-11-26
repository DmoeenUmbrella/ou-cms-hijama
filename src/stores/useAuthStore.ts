import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

export const useAuthStore = defineStore("auth", () => {
  // Initialize from localStorage
  const token = ref<string | null>(localStorage.getItem("auth_token"));
  const keycloakRefreshToken = ref<string | null>(localStorage.getItem("keycloak_token"));
  const user = ref<UserProfile | null>(
    localStorage.getItem("auth_user")
      ? JSON.parse(localStorage.getItem("auth_user") as string)
      : null
  );

  const isAuthenticated = computed(() => !!token.value);

  function setAuth(newToken: string, keycloakToken: string, newUser: UserProfile) {
    token.value = newToken;
    keycloakRefreshToken.value = keycloakToken;
    user.value = newUser;
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("keycloak_token", keycloakToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("keycloak_token");
    localStorage.removeItem("auth_user");
  }

  return {
    token,
    keycloakRefreshToken,
    user,
    isAuthenticated,
    setAuth,
    logout,
  };
});
