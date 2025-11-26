import type { RouteRecordRaw } from "vue-router";

export const customerRoutes: RouteRecordRaw[] = [
  {
    path: "/customers",
    name: "customers",
    component: () => import("@/views/Customers/CustomerList.vue"),
    meta: {
      title: "Customers",
      requiresAuth: true,
    },
  },
  {
    path: "/customers/:id",
    name: "customer-details",
    component: () => import("@/views/Customers/CustomerDetailsView.vue"),
    props: true,
    meta: {
      title: "Customer Details",
      requiresAuth: true,
    },
  },
];
