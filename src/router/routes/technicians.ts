import type { RouteRecordRaw } from "vue-router";

export const technicianRoutes: RouteRecordRaw[] = [
  {
    path: "/technicians",
    name: "technicians",
    component: () => import("@/views/Technicians/TechniciansList.vue"),
    meta: {
      title: "Technicians",
      requiresAuth: true,
    },
  },
];
