import type { RouteRecordRaw } from "vue-router";

export const appointmentRoutes: RouteRecordRaw[] = [
  {
    path: "/appointments",
    name: "appointments",
    component: () => import("@/views/Appointments/AppointmentList.vue"),
    meta: {
      title: "Appointments",
      requiresAuth: true,
    },
  },
  {
    path: "/sessions",
    name: "sessions",
    component: () => import("@/views/Sessions/SessionList.vue"),
    meta: {
      title: "Sessions",
      requiresAuth: true,
    },
  },
];
