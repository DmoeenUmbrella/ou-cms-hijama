import type { RouteRecordRaw } from "vue-router";

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/Dashboard/DashboardView.vue"),
    meta: {
      title: "Dashboard",
      requiresAuth: true,
    },
  },
];
