import type { RouteRecordRaw } from "vue-router";

export const reportRoutes: RouteRecordRaw[] = [
  {
    path: "/reports",
    name: "reports",
    component: () => import("@/views/ReportCommunication/ReportCommunicationView.vue"),
    meta: {
      title: "Reports & Communication",
      requiresAuth: true,
    },
  },
];
