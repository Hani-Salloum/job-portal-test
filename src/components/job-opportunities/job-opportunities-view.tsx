"use client";

import { useRef } from "react";
import { SearchX } from "lucide-react";
import { useTranslation } from "@/components/locale-provider";
import { JobOpportunitiesToolbar } from "@/components/job-opportunities/job-opportunities-toolbar";
import { JobOpportunityCard } from "@/components/job-opportunities/job-opportunity-card";
import { JobStatusConfirmationDialog } from "@/components/job-opportunities/job-status-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { selectFilteredJobs, useJobOpportunitiesStore } from "@/lib/stores/job-opportunities-store";
import type { JobOpportunity } from "@/types/job-opportunity";

export function JobOpportunitiesView() {
  const t = useTranslation();
  const state = useJobOpportunitiesStore();
  const actionTriggerRef = useRef<HTMLElement | null>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const jobs = selectFilteredJobs(state);
  const pendingJob = state.jobs.find((job) => job.id === state.pendingJobId) ?? null;

  function requestStatusChange(job: JobOpportunity) {
    actionTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    state.requestStatusChange(job.id);
  }

  return (
    <div className="mx-auto grid w-full max-w-[1500px] gap-6 sm:gap-8">
      <JobOpportunitiesToolbar
        search={state.search}
        jobTypes={state.jobTypes}
        jobLocations={state.jobLocations}
        statuses={state.statuses}
        onSearchChange={state.setSearch}
        onJobTypesChange={state.setJobTypes}
        onJobLocationsChange={state.setJobLocations}
        onStatusesChange={state.setStatuses}
        onClearFilters={state.clearFilters}
      />

      <section ref={resultsRef} tabIndex={-1} aria-label={t("jobs.title")} className="grid min-w-0 gap-4 rounded-[30px] focus-visible:outline-2 focus-visible:outline-focus-ring">
        {jobs.length > 0 ? (
          <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2 2xl:gap-5">
            {jobs.map((job) => (
              <JobOpportunityCard key={job.id} data={job} onStatusAction={requestStatusChange} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={SearchX}
            title={t("jobs.empty.title")}
            description={t("jobs.empty.description")}
            action={<Button variant="outline" onClick={state.clearFilters}>{t("common.clearFilters")}</Button>}
          />
        )}
      </section>

      <JobStatusConfirmationDialog
        job={pendingJob}
        onCancel={state.cancelStatusChange}
        onConfirm={state.confirmStatusChange}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          if (actionTriggerRef.current?.isConnected) actionTriggerRef.current.focus();
          else resultsRef.current?.focus();
        }}
      />
    </div>
  );
}
