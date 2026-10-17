"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { localePath, type Locale, translate, type TranslationKey } from "@/lib/i18n";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useTranslation() {
  const locale = useLocale();
  return useCallback(
    (key: TranslationKey, values?: Record<string, string | number>) => translate(locale, key, values),
    [locale],
  );
}

export function useLocalizedRouter() {
  const router = useRouter();
  const locale = useLocale();
  return useMemo(
    () => ({
      ...router,
      push: (href: string) => router.push(localePath(href, locale)),
      replace: (href: string) => router.replace(localePath(href, locale)),
    }),
    [locale, router],
  );
}

export function useLocalizedPath() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  return localePath(`${pathname}${searchParams.size ? `?${searchParams.toString()}` : ""}`, locale);
}

type LocalizedLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & { href: string };
export function LocalizedLink({ href, ...props }: LocalizedLinkProps) {
  const locale = useLocale();
  return <Link href={localePath(href, locale)} {...props} />;
}
