import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  UserCog,
  Stethoscope,
  BarChart,
} from "lucide-vue-next";

export default [
  {
    to: "/dashboard",
    label: "aside.dashboard",
    icon: LayoutDashboard,
  },

  {
    to: "/reports",
    label: "aside.reports",
    icon: BarChart,
  },
  // {
  //   to: "/customers",
  //   label: "aside.customers",
  //   icon: Users,
  // },

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
    to: "/follow-ups",
    label: "aside.followUps",
    icon: Calendar,
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
  {
    to: "/technicians",
    label: "aside.technicians",
    icon: Stethoscope,
  },
];
