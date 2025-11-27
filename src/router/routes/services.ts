import type { RouteRecordRaw } from "vue-router";

export const servicesRoutes: RouteRecordRaw[] = [
  {
    path: "/services",
    name: "services",
    component: () => import("@/views/Services/ServicesList.vue"),
    meta: {
      title: "Services",
      requiresAuth: true,
    },
  },
];
