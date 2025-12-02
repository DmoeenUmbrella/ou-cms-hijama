import type { RouteRecordRaw } from "vue-router";

export const followupRoutes: RouteRecordRaw[] = [
  {
    path: "/follow-ups",
    name: "follow-ups",
    component: () => import("@/views/Followup/FollowupView.vue"),
    meta: {
      title: "Follow-ups",
      requiresAuth: true,
    },
  },
];
