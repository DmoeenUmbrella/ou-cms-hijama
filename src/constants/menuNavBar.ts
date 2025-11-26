import { Languages, User, Settings, LogOut, SunMoon } from "lucide-vue-next";
import { setLocale } from "@/i18n";
import type { LocaleType } from "@/types/i18n";

const changeLanguage = (lang: LocaleType) => setLocale(lang);

export default [
  {
    icon: Languages,
    label: "nav.translate",
    menu: [
      {
        icon: Languages,
        label: "nav.arabic",
        method: changeLanguage,
        locale: "ar",
      },
      {
        icon: Languages,
        label: "nav.english",
        method: changeLanguage,
        locale: "en",
      },
    ],
  },
  {
    isCurrentUser: true,
    menu: [
      { icon: User, label: "nav.myProfile", to: "/profile" },
      { icon: Settings, label: "nav.settings" },
    ],
  },
  {
    icon: SunMoon,
    label: "nav.toggleDark",
    isDesktopNoLabel: true,
    isToggleLightDark: true,
  },
  {
    icon: LogOut,
    label: "nav.logout",
    isDesktopNoLabel: true,
    isLogout: true,
  },
];
