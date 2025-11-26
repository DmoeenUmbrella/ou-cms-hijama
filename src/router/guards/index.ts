import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { initiateLogin } from "@/composables/auth.composable";

export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  // 1. Whitelist: Allow access to the callback route without a token
  if (to.name === "authenticating" || to.name === "login") {
    next();
    return;
  }

  // 2. Auth Check: If not authenticated, force redirect to Keycloak
  if (!isAuthenticated) {
    // We act as if we are "pausing" navigation to redirect externally
    initiateLogin();
    // We don't call next() here because the window.location.href in initiateLogin will navigate away
    return;
  }

  // 3. Proceed
  next();
};
