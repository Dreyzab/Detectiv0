import { z } from "zod";

export const LocaleSchema = z.enum(["en", "ru", "de"]);
export type Locale = z.infer<typeof LocaleSchema>;

export const TranslationSchema = z.record(z.string(), z.string());
export type Translation = z.infer<typeof TranslationSchema>;
