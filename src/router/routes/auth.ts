// import type { RouteRecordRaw } from "vue-router";

// export const authRoutes: RouteRecordRaw[] = [
//   {
//     path: '/authenticating',
//     name: 'authenticating',
//     component: () => import('@/views/Auth/Authenticating.vue'),
//     meta: { title: 'Authenticating...' }
//   },
//   {
//     path: "/login",
//     name: "login",
//     component: () => import("@/views/Auth/Login.vue"),
//     meta: {
//       title: "Login",
//       layout: "AuthLayout", // Optional: for future layout handling
//       requiresGuest: true,
//     },
//   },
// ];

import type { RouteRecordRaw } from "vue-router";

export const authRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Auth/Login.vue"),
    meta: {
      title: "Login",
      layout: "AuthLayout", // Optional: for future layout handling
      requiresGuest: true,
    },
  },
  {
    path: "/authenticating",
    name: "authenticating",
    component: () => import("@/views/Auth/Authenticating.vue"),
    meta: {
      title: "Authenticating...",
      layout: "AuthLayout",
    },
  },
];
