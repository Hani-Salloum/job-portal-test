export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "ar";
}

export function localePath(path: string, locale: Locale): string {
  const [pathnameAndQuery, hash = ""] = path.split("#", 2);
  const [pathname = "/", query = ""] = pathnameAndQuery.split("?", 2);
  const normalizedPathname = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;
  const withoutLocale =
    normalizedPathname.replace(/^\/(?:en|ar)(?=\/|$)/, "") || "/";
  return `/${locale}${withoutLocale === "/" ? "" : withoutLocale}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

const en = {
  "common.cancel": "Cancel",
  "common.done": "Done",
  "common.save": "Save",
  "common.saving": "Saving…",
  "common.previous": "Previous",
  "common.next": "Next",
  "common.loading": "Loading…",
  "common.notProvided": "Not provided",
  "common.tryAgain": "Try again.",
  "nav.dashboard": "Dashboard",
  "nav.members": "Members",
  "nav.memberships": "Memberships",
  "nav.payments": "Payments & Refunds",
  "nav.checkIns": "Check-ins",
  "nav.trainer": "Trainer workspace",
  "nav.staff": "Staff Accounts",
  "nav.plans": "Membership Plans",
  "nav.exports": "Exports",
  "nav.audit": "Audit Log",
  "nav.primary": "Primary navigation",
  "nav.open": "Open navigation",
  "nav.close": "Close navigation",
  "nav.collapse": "Collapse navigation",
  "nav.expand": "Expand navigation",
  "account.owner": "Owner",
  "account.staff": "Staff",
  "account.receptionist": "Receptionist",
  "account.trainer": "Trainer",
  "account.editProfile": "Edit profile",
  "account.changePassword": "Change password",
  "account.logout": "Logout",
  "account.openMenu": "Open account menu for {name}",
  "account.options": "Account options",
  "edition.base": "Base Edition",
  "edition.trainer": "Trainer Edition",
  "edition.configured": "Configured edition: {edition}",
  "language.switch": "Switch language",
  "language.english": "English",
  "language.arabic": "العربية",
  "theme.dark": "Switch to dark theme",
  "theme.light": "Switch to light theme",
  "theme.darkLabel": "Dark theme",
  "theme.lightLabel": "Light theme",
  "errors.network":
    "We could not reach the server. Check your connection and try again.",
  "errors.server": "The server could not complete the request. Try again.",
  "errors.unknown": "Something went wrong. Try again.",
  "errors.missing": "Missing translation: {key}",
} as const;

const ar: Record<keyof typeof en, string> = {
  "common.cancel": "إلغاء",
  "common.done": "تم",
  "common.save": "حفظ",
  "common.saving": "جارٍ الحفظ…",
  "common.previous": "السابق",
  "common.next": "التالي",
  "common.loading": "جارٍ التحميل…",
  "common.notProvided": "غير متوفر",
  "common.tryAgain": "حاول مجددًا.",
  "nav.dashboard": "لوحة التحكم",
  "nav.members": "الأعضاء",
  "nav.memberships": "الاشتراكات",
  "nav.payments": "المدفوعات والاستردادات",
  "nav.checkIns": "تسجيل الدخول",
  "nav.trainer": "مساحة المدرب",
  "nav.staff": "حسابات الموظفين",
  "nav.plans": "خطط الاشتراك",
  "nav.exports": "التصديرات",
  "nav.audit": "سجل التدقيق",
  "nav.primary": "التنقل الرئيسي",
  "nav.open": "فتح التنقل",
  "nav.close": "إغلاق التنقل",
  "nav.collapse": "طي التنقل",
  "nav.expand": "توسيع التنقل",
  "account.owner": "المالك",
  "account.staff": "موظف",
  "account.receptionist": "موظف الاستقبال",
  "account.trainer": "مدرب",
  "account.editProfile": "تعديل الملف الشخصي",
  "account.changePassword": "تغيير كلمة المرور",
  "account.logout": "تسجيل الخروج",
  "account.openMenu": "فتح قائمة الحساب لـ {name}",
  "account.options": "خيارات الحساب",
  "edition.base": "الإصدار الأساسي",
  "edition.trainer": "إصدار المدربين",
  "edition.configured": "الإصدار المهيأ: {edition}",
  "language.switch": "تبديل اللغة",
  "language.english": "English",
  "language.arabic": "العربية",
  "theme.dark": "التبديل إلى المظهر الداكن",
  "theme.light": "التبديل إلى المظهر الفاتح",
  "theme.darkLabel": "المظهر الداكن",
  "theme.lightLabel": "المظهر الفاتح",
  "errors.network": "تعذر الوصول إلى الخادم. تحقق من الاتصال وحاول مجددًا.",
  "errors.server": "تعذر على الخادم إكمال الطلب. حاول مجددًا.",
  "errors.unknown": "حدث خطأ ما. حاول مجددًا.",
  "errors.missing": "ترجمة مفقودة: {key}",
};

const operationalEn = {
  "common.yes": "Yes",
  "common.no": "No",
  "common.clearFilters": "Clear filters",
  "common.allTime": "All time",
  "common.everyone": "Everyone",
  "common.everything": "Everything",
  "common.search": "Search",
  "common.status": "Status",
  "common.reason": "Reason",
  "common.optional": "optional",
  "common.recording": "Recording…",
  "common.submitting": "Submitting…",
  "common.approving": "Approving…",
  "common.rejecting": "Rejecting…",
  "common.cancelling": "Cancelling…",
  "common.notSet": "Not set",
  "common.before": "Before",
  "common.after": "After",
  "common.by": "By {name}",
  "common.pageOf": "Page {page} of {total}",
} as const;

const operationalAr: Record<keyof typeof operationalEn, string> = {
  "common.yes": "نعم",
  "common.no": "لا",
  "common.clearFilters": "مسح عوامل التصفية",
  "common.allTime": "كل الوقت",
  "common.everyone": "الجميع",
  "common.everything": "كل شيء",
  "common.search": "بحث",
  "common.status": "الحالة",
  "common.reason": "السبب",
  "common.optional": "اختياري",
  "common.recording": "جارٍ التسجيل…",
  "common.submitting": "جارٍ التقديم…",
  "common.approving": "جارٍ الموافقة…",
  "common.rejecting": "جارٍ الرفض…",
  "common.cancelling": "جارٍ الإلغاء…",
  "common.notSet": "غير معيّن",
  "common.before": "قبل",
  "common.after": "بعد",
  "common.by": "بواسطة {name}",
  "common.pageOf": "الصفحة {page} من {total}",
};

export type TranslationKey = keyof typeof en | keyof typeof operationalEn;
type TranslationCatalog = Record<TranslationKey, string>;
const catalogs: Record<Locale, TranslationCatalog> = {
  en: { ...en, ...operationalEn },
  ar: { ...ar, ...operationalAr },
};

/** Missing keys are visible in the UI and logged, never silently replaced with English. */
export function translate(
  locale: Locale,
  key: TranslationKey | string,
  values: Record<string, string | number> = {},
): string {
  const template = (catalogs[locale] as Record<string, string>)[key];
  if (!template) {
    console.error(`Missing ${locale} translation: ${key}`);
    return `[${translate(locale, "errors.missing", { key })}]`;
  }
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    String(values[name] ?? `{${name}}`),
  );
}
