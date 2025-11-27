import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { authRoutes } from "./routes/auth";
import { dashboardRoutes } from "./routes/dashboard";
import { authGuard } from "./guards";
import { servicesRoutes } from "./routes/services";
import { usersRoutes } from "./routes/users";
// import { appointmentRoutes } from "./routes/appointments";
// import { adminRoutes } from "./routes/admin";

export const routes: RouteRecordRaw[] = [
  ...authRoutes,
  ...dashboardRoutes,
  ...servicesRoutes,
  ...usersRoutes,
  // ...appointmentRoutes,
  // ...adminRoutes,
  // 404 Fallback
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/Status/NotFound.vue"), // Ensure this view exists
    meta: { title: "404 Not Found" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

router.beforeEach(authGuard);

export default router;
