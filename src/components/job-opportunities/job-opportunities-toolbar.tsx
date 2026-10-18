"use client";

import { useId, useRef } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelectFilter } from "@/components/ui/multi-select-filter";
import type { JobType, JobLocation, JobStatus } from "@/types/job-opportunity";

export interface JobOpportunitiesToolbarProps {
  search: string;
  jobTypes: JobType[];
  jobLocations: JobLocation[];
  statuses: JobStatus[];
  onSearchChange: (search: string) => void;
  onJobTypesChange: (value: JobType[]) => void;
  onJobLocationsChange: (value: JobLocation[]) => void;
  onStatusesChange: (value: JobStatus[]) => void;
  onClearFilters: () => void;
}

export function JobOpportunitiesToolbar({
  search,
  jobTypes,
  jobLocations,
  statuses,
  onSearchChange,
  onJobTypesChange,
  onJobLocationsChange,
  onStatusesChange,
  onClearFilters,
}: JobOpportunitiesToolbarProps) {
  const t = useTranslation();
  const searchId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const hasActiveFilters = search.length > 0 || jobTypes.length > 0 || jobLocations.length > 0 || statuses.length > 0;

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-[24px] border border-border bg-surface p-3 sm:p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="relative min-w-0 flex-1">
          <label htmlFor={searchId} className="sr-only">
            {t("jobs.search.label")}
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            ref={searchRef}
            id={searchId}
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("jobs.search.placeholder")}
            className="min-h-11 rounded-[20px] border-border bg-muted/40 pe-14 ps-11 text-foreground placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none"
          />
          {search.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("jobs.search.clear")}
              onClick={() => {
                onSearchChange("");
                searchRef.current?.focus();
              }}
              className="absolute end-0 top-1/2 size-11 -translate-y-1/2 rounded-[20px] text-muted-foreground"
            >
              <X aria-hidden="true" className="size-4" />
            </Button>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={onClearFilters}
            className="min-h-11 shrink-0 self-start rounded-[20px] px-4 text-muted-foreground sm:self-auto"
          >
            {t("common.clearFilters")}
          </Button>
        )}
      </div>
      <div className="grid min-w-0 grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MultiSelectFilter<JobType>
          label={t("jobs.filters.jobType")}
          options={[
            { value: "FULL_TIME", label: t("jobs.type.FULL_TIME") },
            { value: "PART_TIME", label: t("jobs.type.PART_TIME") },
          ]}
          value={jobTypes}
          onChange={onJobTypesChange}
        />
        <MultiSelectFilter<JobLocation>
          label={t("jobs.filters.jobLocation")}
          options={[
            { value: "REMOTE", label: t("jobs.location.REMOTE") },
            { value: "HYBRID", label: t("jobs.location.HYBRID") },
            { value: "ONSITE", label: t("jobs.location.ONSITE") },
          ]}
          value={jobLocations}
          onChange={onJobLocationsChange}
        />
        <MultiSelectFilter<JobStatus>
          label={t("jobs.filters.status")}
          options={[
            { value: "ACTIVE", label: t("jobs.status.ACTIVE") },
            { value: "DRAFT", label: t("jobs.status.DRAFT") },
            { value: "PAUSED", label: t("jobs.status.PAUSED") },
          ]}
          value={statuses}
          onChange={onStatusesChange}
        />
      </div>
    </div>
  );
}
