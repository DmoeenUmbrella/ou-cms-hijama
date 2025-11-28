import type { RouteRecordRaw } from "vue-router";

export const usersRoutes: RouteRecordRaw[] = [
  {
    path: "/users",
    name: "users",
    component: () => import("@/views/Users/UserList.vue"),
    meta: {
      title: "Users",
      requiresAuth: true,
    },
  },
];
