"use client";

import { useId } from "react";
import { ArrowUpRight, BriefcaseBusiness, DollarSign } from "lucide-react";
import { LocalizedLink, useLocale, useTranslation } from "@/components/locale-provider";
import type { Applicant } from "@/types/applicant";
import type { JobApplication } from "@/types/job-application";

export interface JobApplicationCardProps {
  applicant: Applicant;
  application: JobApplication;
}

export function JobApplicationCard({ applicant, application }: JobApplicationCardProps) {
  const titleId = useId();
  const locale = useLocale();
  const t = useTranslation();
  const salary = new Intl.NumberFormat(locale, {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(application.expected_salary);
  const experience = new Intl.NumberFormat(locale, {
    style: "unit", unit: "year", unitDisplay: "long", maximumFractionDigits: 1,
  }).format(applicant.years_of_experience);

  return (
    <LocalizedLink
      href={`/applicants/${encodeURIComponent(applicant.id)}?application_id=${encodeURIComponent(application.id)}`}
      aria-labelledby={titleId}
      className="group block h-full min-w-0 rounded-[30px] border border-border bg-surface p-5 text-foreground no-underline transition-[border-color,box-shadow] duration-200 hover:border-primary/60 hover:shadow-[0_8px_28px_var(--chrome-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background motion-reduce:transition-none sm:p-6"
    >
      <article aria-labelledby={titleId} className="flex h-full min-w-0 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 id={titleId} className="min-w-0 text-lg leading-7 font-semibold tracking-[-.025em] sm:text-xl">
            <bdi className="break-words">{applicant.name}</bdi>
          </h3>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted/60 text-muted-foreground transition-colors group-hover:bg-primary/15 group-hover:text-foreground">
            <ArrowUpRight aria-hidden="true" className="size-4 rtl:-rotate-90" />
          </span>
        </div>
        <p className="mt-3 mb-6 flex-1 text-sm leading-6 text-muted-foreground" dir="auto">{applicant.small_bio}</p>
        <dl className="grid grid-cols-2 gap-4 border-t border-border/75 pt-4">
          <div className="min-w-0 space-y-2">
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BriefcaseBusiness aria-hidden="true" className="size-3.5 shrink-0" />
              {t("applications.experience")}
            </dt>
            <dd className="text-sm font-semibold tabular-nums">{experience}</dd>
          </div>
          <div className="min-w-0 space-y-2">
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <DollarSign aria-hidden="true" className="size-3.5 shrink-0" />
              {t("applications.salary")}
            </dt>
            <dd className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-sm font-semibold tabular-nums">
              <bdi>{salary}</bdi>
              <span className="text-xs font-normal text-muted-foreground">{t("applications.perMonth")}</span>
            </dd>
          </div>
        </dl>
      </article>
    </LocalizedLink>
  );
}
