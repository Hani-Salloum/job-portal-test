"use client";

import { useLocale, useTranslation } from "@/components/locale-provider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface SkillBadgesProps {
  skills: readonly string[];
  maxVisible?: number;
}

export function SkillBadges({ skills, maxVisible = 6 }: SkillBadgesProps) {
  const locale = useLocale();
  const t = useTranslation();
  const limit = Math.max(0, Math.floor(maxVisible));
  const visibleSkills = skills.slice(0, limit);
  const remainingSkills = skills.slice(limit);

  return (
    <div>
      <h4 className='mb-2'>{t("jobs.skills.label")}</h4>
      <div aria-label={t("jobs.skills.label")} className="flex flex-wrap items-center gap-2">
        {visibleSkills.map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            className="max-w-full rounded-xl border border-primary/10 bg-primary/8 px-3 py-1.5 text-xs leading-5 font-medium text-foreground"
          >
            <bdi dir="ltr" className="break-words">{skill}</bdi>
          </span>
        ))}
        {remainingSkills.length > 0 && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={t("jobs.skills.more", { count: remainingSkills.length })}
                  className="inline-flex items-center justify-center rounded-xl border border-dashed border-border px-3 py-1.5 text-xs leading-5 font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                >
                  <bdi dir="ltr" className="text-xs leading-5 font-semibold">+{new Intl.NumberFormat(locale).format(remainingSkills.length)}</bdi>
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[min(20rem,calc(100vw-2rem))] rounded-2xl p-3" dir={locale === "ar" ? "rtl" : "ltr"}>
                <p className="mb-2 font-semibold">{t("jobs.skills.remaining")}</p>
                <ul className="flex list-none flex-wrap gap-x-3 gap-y-1">
                  {remainingSkills.map((skill, index) => (
                    <li key={`${skill}-${index}`}><bdi dir="ltr">{skill}</bdi></li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
