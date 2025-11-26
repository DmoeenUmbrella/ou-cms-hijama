import type { RouteRecordRaw } from "vue-router";

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: "/users",
    name: "users",
    component: () => import("@/views/Users/UserList.vue"),
    meta: {
      title: "Users",
      requiresAuth: true,
      requiresAdmin: true, // Example permission
    },
  },
  {
    path: "/services",
    name: "services",
    component: () => import("@/views/Services/ServiceCatalogView.vue"),
    meta: {
      title: "Services",
      requiresAuth: true,
    },
  },
];
