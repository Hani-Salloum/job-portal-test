"use client";

import { useState } from "react";
import { useStore } from "zustand";
import { ArrowLeft, UsersRound } from "lucide-react";
import { LocalizedLink, useLocale, useTranslation } from "@/components/locale-provider";
import { JobApplicationCard } from "@/components/job-applications/job-application-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { RangeFilter } from "@/components/ui/range-filter";
import {
  createJobApplicationsStore, selectFilteredApplications,
  SALARY_MIN, SALARY_MAX, SALARY_STEP,
  EXPERIENCE_MIN, EXPERIENCE_MAX, EXPERIENCE_STEP,
} from "@/lib/stores/job-applications-store";
import { jobApplications } from "@/lib/mock-data/job-applications";
import type { JobOpportunity } from "@/types/job-opportunity";

export function JobApplicationsView({ job }: { job: JobOpportunity }) {
  const locale = useLocale();
  const t = useTranslation();
  const [store] = useState(() => createJobApplicationsStore(job.id));
  const state = useStore(store);
  const applications = selectFilteredApplications(state);
  const hasApplications = jobApplications.some((application) => application.job_opportunity_id === job.id);
  const filtersActive = state.salaryRange[0] !== SALARY_MIN || state.salaryRange[1] !== SALARY_MAX
    || state.experienceRange[0] !== EXPERIENCE_MIN || state.experienceRange[1] !== EXPERIENCE_MAX;
  const currency = new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const years = new Intl.NumberFormat(locale, {
    style: "unit", unit: "year", unitDisplay: "long", maximumFractionDigits: 1,
  });

  return (
    <div className="mx-auto grid w-full max-w-[1500px] gap-6 sm:gap-8">
      <header className="grid gap-4">
        <LocalizedLink href="/dashboard/job-opportunities" className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl text-sm text-muted-foreground no-underline hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
          <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
          {t("applications.back")}
        </LocalizedLink>
        <div className="grid gap-2">
          <h2 className="max-w-4xl text-2xl leading-tight font-semibold tracking-[-.035em] text-foreground sm:text-3xl">
            <bdi dir="ltr" className="break-words">{job.role_name} {t("jobs.applications")}</bdi>
          </h2>
        </div>
      </header>

      {hasApplications && (
        <section aria-label={t("applications.filters.label")} className="grid gap-3 lg:w-3/4">
          <div className="flex min-h-9 items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-foreground">{t("applications.filters.label")}</h3>
            {filtersActive && <Button type="button" variant="ghost" size="sm" onClick={state.clearFilters} className="min-h-11 rounded-xl">{t("common.clearFilters")}</Button>}
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0 rounded-[30px] border border-border bg-surface p-5 sm:p-6">
              <RangeFilter label={t("applications.filters.salary")} min={SALARY_MIN} max={SALARY_MAX} step={SALARY_STEP} value={state.salaryRange} onChange={state.setSalaryRange} formatValue={(amount) => currency.format(amount)} />
            </div>
            <div className="min-w-0 rounded-[30px] border border-border bg-surface p-5 sm:p-6">
              <RangeFilter label={t("applications.experience")} min={EXPERIENCE_MIN} max={EXPERIENCE_MAX} step={EXPERIENCE_STEP} value={state.experienceRange} onChange={state.setExperienceRange} formatValue={(amount) => years.format(amount)} />
            </div>
          </div>
        </section>
      )}

      <section aria-label={t("jobs.applications")}>
        {applications.length > 0 ? (
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-5">
            {applications.map(({ application, applicant }) => (
              <JobApplicationCard key={application.id} application={application} applicant={applicant} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={UsersRound}
            title={t(hasApplications ? "applications.empty.filteredTitle" : "applications.empty.title")}
            description={t(hasApplications ? "applications.empty.filteredDescription" : "applications.empty.description")}
            action={hasApplications ? <Button type="button" variant="outline" onClick={state.clearFilters}>{t("common.clearFilters")}</Button> : undefined}
          />
        )}
      </section>
    </div>
  );
}
