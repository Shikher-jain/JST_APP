import hi from "@/locales/hi.json";
import en from "@/locales/en.json";
import { Locale } from "@/types";

export const dictionaries = {
  hi,
  en,
};

export function getDictionary(locale: Locale = "hi") {
  return dictionaries[locale] || dictionaries.hi;
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
