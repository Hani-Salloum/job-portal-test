import { create } from "zustand";

import { jobOpportunitiesCards } from "@/lib/mock-data/job-opportunities-cards";
import type {
  JobLocation,
  JobOpportunity,
  JobStatus,
  JobType,
} from "@/types/job-opportunity";

export interface JobOpportunitiesState {
  jobs: JobOpportunity[];
  search: string;
  jobTypes: JobType[];
  jobLocations: JobLocation[];
  statuses: JobStatus[];
  pendingJobId: string | null;
  setSearch: (search: string) => void;
  setJobTypes: (jobTypes: JobType[]) => void;
  setJobLocations: (jobLocations: JobLocation[]) => void;
  setStatuses: (statuses: JobStatus[]) => void;
  clearFilters: () => void;
  requestStatusChange: (id: string) => void;
  cancelStatusChange: () => void;
  confirmStatusChange: () => void;
}

export const useJobOpportunitiesStore = create<JobOpportunitiesState>((set) => ({
  jobs: jobOpportunitiesCards,
  search: "",
  jobTypes: [],
  jobLocations: [],
  statuses: [],
  pendingJobId: null,
  setSearch: (search) => set({ search }),
  setJobTypes: (jobTypes) => set({ jobTypes }),
  setJobLocations: (jobLocations) => set({ jobLocations }),
  setStatuses: (statuses) => set({ statuses }),
  clearFilters: () =>
    set({ search: "", jobTypes: [], jobLocations: [], statuses: [] }),
  requestStatusChange: (id) => set({ pendingJobId: id }),
  cancelStatusChange: () => set({ pendingJobId: null }),
  confirmStatusChange: () =>
    set((state) => {
      if (state.pendingJobId === null) return state;

      return {
        jobs: state.jobs.map((job) =>
          job.id === state.pendingJobId
            ? { ...job, status: job.status === "ACTIVE" ? "PAUSED" : "ACTIVE" }
            : job,
        ),
        pendingJobId: null,
      };
    }),
}));

export function selectFilteredJobs(
  state: Pick<
    JobOpportunitiesState,
    "jobs" | "search" | "jobTypes" | "jobLocations" | "statuses"
  >,
): JobOpportunity[] {
  const search = state.search.trim().toLowerCase();

  return state.jobs.filter(
    (job) =>
      (search === "" ||
        job.role_name.toLowerCase().includes(search) ||
        job.required_skill.some((skill) => skill.toLowerCase().includes(search))) &&
      (state.jobTypes.length === 0 || state.jobTypes.includes(job.job_type)) &&
      (state.jobLocations.length === 0 ||
        state.jobLocations.includes(job.job_location)) &&
      (state.statuses.length === 0 || state.statuses.includes(job.status)),
  );
}
