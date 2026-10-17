import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Locale } from "./i18n";

const localeTags: Record<Locale, string> = {
  en: "en-GB-u-nu-latn",
  ar: "ar-SY-u-nu-latn",
};

function parseDate(value: Date | string): Date {
  if (value instanceof Date) return value;
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00Z`)
    : new Date(value);
}

/** Formats a date-only value without shifting it across time zones. */
export function formatDate(
  locale: Locale,
  value: Date | string,
  timeZone = "UTC",
): string {
  return new Intl.DateTimeFormat(localeTags[locale], {
    dateStyle: "medium",
    timeZone,
  }).format(parseDate(value));
}

/** Formats an instant using the supplied gym time zone, retaining Western digits in Arabic. */
export function formatDateTime(
  locale: Locale,
  value: Date | string,
  timeZone = "UTC",
): string {
  return new Intl.DateTimeFormat(localeTags[locale], {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(parseDate(value));
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}