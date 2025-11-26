import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  UserCog,
  Stethoscope,
} from "lucide-vue-next";

export default [
  {
    to: "/",
    label: "aside.dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/customers",
    label: "aside.customers",
    icon: Users,
  },
  {
    to: "/appointments",
    label: "aside.appointments",
    icon: Calendar,
  },
  {
    to: "/sessions",
    label: "aside.sessions",
    icon: ClipboardList,
  },
  {
    to: "/users",
    label: "aside.users",
    icon: UserCog,
  },
  {
    to: "/services",
    label: "aside.services",
    icon: Stethoscope,
  },
];
