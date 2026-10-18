"use client";

import { useId, type ReactNode } from "react";

import {
  BriefcaseBusiness, CalendarDays, CircleDot, MapPin, Pause,
  Play, Send, UsersRound,
} from "lucide-react";
import { LocalizedLink, useLocale, useTranslation } from "@/components/locale-provider";
import { SkillBadges } from "@/components/job-opportunities/skill-badges";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { JobOpportunity } from "@/types/job-opportunity";

export interface JobOpportunityCardProps {
  data: JobOpportunity;
  onStatusAction: (job: JobOpportunity) => void;
}

function ActionTooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function JobOpportunityCard({ data, onStatusAction }: JobOpportunityCardProps) {
  const titleId = useId();
  const locale = useLocale();
  const t = useTranslation();
  const statusAction = data.status === "DRAFT" ? "publish" : data.status === "ACTIVE" ? "disable" : "enable";
  const StatusActionIcon = data.status === "DRAFT" ? Send : data.status === "ACTIVE" ? Pause : Play;
  const date = new Date(data.date_posted.length === 10 ? `${data.date_posted}T00:00:00Z` : data.date_posted);
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  }).format(date);

  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full min-w-0 flex-col rounded-[30px] border border-border bg-surface p-5 transition-[border-color,box-shadow] duration-200 hover:border-primary/45 hover:shadow-[0_8px_28px_var(--chrome-shadow)] motion-reduce:transition-none sm:p-6"
    >
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2">
        <h3 id={titleId} className="col-start-1 row-start-1 min-w-0 text-lg leading-7 font-semibold tracking-[-.025em] text-foreground sm:text-xl">
          <bdi dir="ltr" className="break-words">{data.role_name}</bdi>
        </h3>
        <TooltipProvider delayDuration={200}>
          <div className="col-start-2 row-span-2 row-start-1 -mt-1 flex shrink-0 items-center gap-0.5">
            <ActionTooltip label={t(`jobs.actions.${statusAction}`)}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-11 rounded-2xl border border-transparent hover:border-border"
                aria-label={t(`jobs.actions.${statusAction}`)}
                onClick={() => onStatusAction(data)}
              >
                <StatusActionIcon aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
              </Button>
            </ActionTooltip>
            <ActionTooltip label={t("jobs.actions.applications")}>
              <Button variant="ghost" size="icon" className="size-11 rounded-2xl border border-transparent hover:border-border" asChild>
                <LocalizedLink href={`/job-opportunities/${encodeURIComponent(data.id)}/applications`} aria-label={t("jobs.actions.applications")}>
                  <UsersRound aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
                </LocalizedLink>
              </Button>
            </ActionTooltip>
          </div>
        </TooltipProvider>

        <div className="col-start-1 row-start-2 flex flex-wrap items-center gap-2 text-xs leading-5 font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/65 px-2.5 py-1">
            <BriefcaseBusiness aria-hidden="true" className="size-3.5 shrink-0" />
            {t(`jobs.type.${data.job_type}`)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/65 px-2.5 py-1">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
            {t(`jobs.location.${data.job_location}`)}
          </span>
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
            data.status === "ACTIVE" && "border-primary/20 bg-primary/12 text-foreground",
            data.status === "DRAFT" && "border-border bg-muted/60 text-muted-foreground",
            data.status === "PAUSED" && "border-amber-600/20 bg-amber-500/10 text-amber-800 dark:border-amber-300/20 dark:text-amber-200",
          )}>
            <CircleDot aria-hidden="true" className="size-3.5 shrink-0" />
            {t(`jobs.status.${data.status}`)}
          </span>
        </div>
      </header>

      <div className="flex flex-1 items-center py-7">
        <SkillBadges skills={data.required_skill} />
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-border/75 pt-4">
        <div aria-label={t("jobs.posted")} className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
          <span className="sr-only">{t("jobs.posted")}</span>
          <time dateTime={data.date_posted} className="text-xs leading-5 font-medium text-foreground">{formattedDate}</time>
        </div>
        <div aria-label={t("jobs.applications")} className="flex items-center gap-2 text-muted-foreground">
          <UsersRound aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
          <span className="sr-only">{t("jobs.applications")}</span>
          <span className="text-sm leading-5 font-semibold text-foreground tabular-nums">{new Intl.NumberFormat(locale).format(data.applications_number)}</span>
        </div>
      </footer>
    </article>
  );
}
