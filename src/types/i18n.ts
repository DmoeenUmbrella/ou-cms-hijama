import en from "@/i18n/en";

// 1. Infer the message schema from the default English file
export type MessageSchema = typeof en;

// 2. Define supported locales explicitly
export type LocaleType = "en" | "ar";
