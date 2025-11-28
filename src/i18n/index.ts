import { createI18n, type Composer } from "vue-i18n";
import en from "./en";
import ar from "./ar";
import type { MessageSchema, LocaleType } from "@/types/i18n";

export const messages = { en, ar };
// List of supported locales (must match LocaleType)
export const availableLocales: readonly LocaleType[] = ["en", "ar"];

// Type guard to check if a string is a valid locale
function isSupportedLocale(locale: string | null): locale is LocaleType {
  return !!locale && availableLocales.includes(locale as LocaleType);
}

// Get saved locale or default to 'en'
const savedLocale = localStorage.getItem("app-locale");
export const defaultLocale: LocaleType = isSupportedLocale(savedLocale)
  ? savedLocale
  : "en";

export const i18n = createI18n<[MessageSchema], LocaleType>({
  legacy: false, // Use Composition API mode
  locale: defaultLocale,
  fallbackLocale: "en",
  messages,
});

export function setLocale(locale: LocaleType) {
  // Guard: Ensure the passed string is a valid supported locale
  if (!isSupportedLocale(locale)) {
    console.warn(`Locale ${locale} is not supported.`);
    return;
  }

  // Update vue-i18n state
  // Cast to Composer to fix TS error about .value not existing on the legacy type
  const globalI18n = i18n.global as unknown as Composer;

  if (globalI18n.locale.value !== locale) {
    globalI18n.locale.value = locale;
  }

  // Persist language
  localStorage.setItem("app-locale", locale);
  document.documentElement.setAttribute("lang", locale);

  // RTL handling
  if (locale === "ar") {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.classList.add("rtl");
  } else {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.classList.remove("rtl");
  }
}

// Initialize locale on load
setLocale(defaultLocale);
