import { createStore } from "zustand/vanilla";

import { applicants } from "@/lib/mock-data/applicants";
import { jobApplications } from "@/lib/mock-data/job-applications";
import type { Applicant } from "@/types/applicant";
import type { JobApplication } from "@/types/job-application";

export type NumberRange = [number, number];

export const SALARY_MIN = 0;
export const SALARY_MAX = 5000;
export const SALARY_STEP = 50;
export const EXPERIENCE_MIN = 0;
export const EXPERIENCE_MAX = 15;
export const EXPERIENCE_STEP = 0.5;

export interface JobApplicationsState {
  jobId: string;
  salaryRange: NumberRange;
  experienceRange: NumberRange;
  setSalaryRange: (range: NumberRange) => void;
  setExperienceRange: (range: NumberRange) => void;
  clearFilters: () => void;
}

function normalizeRange(
  range: NumberRange,
  min: number,
  max: number,
): NumberRange {
  return [
    Math.max(min, Math.min(max, Math.min(...range))),
    Math.max(min, Math.min(max, Math.max(...range))),
  ];
}

export function createJobApplicationsStore(jobId: string) {
  return createStore<JobApplicationsState>((set) => ({
    jobId,
    salaryRange: [SALARY_MIN, SALARY_MAX],
    experienceRange: [EXPERIENCE_MIN, EXPERIENCE_MAX],
    setSalaryRange: (range) =>
      set({ salaryRange: normalizeRange(range, SALARY_MIN, SALARY_MAX) }),
    setExperienceRange: (range) =>
      set({
        experienceRange: normalizeRange(range, EXPERIENCE_MIN, EXPERIENCE_MAX),
      }),
    clearFilters: () =>
      set({
        salaryRange: [SALARY_MIN, SALARY_MAX],
        experienceRange: [EXPERIENCE_MIN, EXPERIENCE_MAX],
      }),
  }));
}

export function selectFilteredApplications(
  state: Pick<JobApplicationsState, "jobId" | "salaryRange" | "experienceRange">,
): { application: JobApplication; applicant: Applicant }[] {
  return jobApplications.flatMap((application) => {
    if (
      application.job_opportunity_id !== state.jobId ||
      application.expected_salary < state.salaryRange[0] ||
      application.expected_salary > state.salaryRange[1]
    ) {
      return [];
    }

    const applicant = applicants.find(
      (candidate) => candidate.id === application.applicant_id,
    );
    if (
      !applicant ||
      applicant.years_of_experience < state.experienceRange[0] ||
      applicant.years_of_experience > state.experienceRange[1]
    ) {
      return [];
    }

    return [{ application, applicant }];
  });
}
