import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { authRoutes } from "./routes/auth";
import { dashboardRoutes } from "./routes/dashboard";
import { authGuard } from "./guards";
// import { customerRoutes } from "./routes/customers";
import { appointmentRoutes } from "./routes/appointments";
import { customerRoutes } from "./routes/customers";
import { technicianRoutes } from "./routes/technicians";
import { usersRoutes } from "./routes/users";
import { followupRoutes } from "./routes/followups";
import { reportRoutes } from "./routes/reports";
// import { appointmentRoutes } from "./routes/appointments";
// import { adminRoutes } from "./routes/admin";

export const routes: RouteRecordRaw[] = [
  ...authRoutes,
  ...dashboardRoutes,
  // ...customerRoutes,
  ...appointmentRoutes,
  ...customerRoutes,
  ...technicianRoutes,
  ...usersRoutes,
  ...followupRoutes,
  ...reportRoutes,
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
