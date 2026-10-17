"use client";

import { Languages } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { localePath, type Locale } from "@/lib/i18n";
import { useLocale, useTranslation } from "@/components/locale-provider";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslation();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;
    const query = searchParams.size ? `?${searchParams}` : "";
    window.location.assign(localePath(`${pathname}${query}${window.location.hash}`, nextLocale));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="icon" className="language-switcher" aria-label={t("language.switch")}>
          <Languages aria-hidden="true" size={17} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-label={t("language.switch")}>
        <DropdownMenuItem disabled={locale === "en"} onSelect={() => switchLocale("en")}>{t("language.english")}</DropdownMenuItem>
        <DropdownMenuItem disabled={locale === "ar"} onSelect={() => switchLocale("ar")}>{t("language.arabic")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
