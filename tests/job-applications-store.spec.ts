import { expect, test } from "@playwright/test";

import { applicants } from "@/lib/mock-data/applicants";
import { jobApplications } from "@/lib/mock-data/job-applications";
import {
  createJobApplicationsStore,
  EXPERIENCE_MAX,
  EXPERIENCE_MIN,
  EXPERIENCE_STEP,
  SALARY_MAX,
  SALARY_MIN,
  SALARY_STEP,
  selectFilteredApplications,
  type JobApplicationsState,
  type NumberRange,
} from "@/lib/stores/job-applications-store";

function filteredIds(
  state: Pick<JobApplicationsState, "jobId" | "salaryRange" | "experienceRange">,
) {
  return selectFilteredApplications(state).map(
    ({ application }) => application.id,
  );
}

test("defaults join 8 and 9 applications with bounded, on-step mock salaries", () => {
  expect([SALARY_MIN, SALARY_MAX, SALARY_STEP]).toEqual([0, 5000, 50]);
  expect([EXPERIENCE_MIN, EXPERIENCE_MAX, EXPERIENCE_STEP]).toEqual([0, 15, 0.5]);
  expect(jobApplications).toHaveLength(17);

  for (const [jobId, count] of [["job-001", 8], ["job-002", 9]] as const) {
    const state = createJobApplicationsStore(jobId).getState();
    expect(state).toMatchObject({
      jobId,
      salaryRange: [0, 5000],
      experienceRange: [0, 15],
    });
    const results = selectFilteredApplications(state);
    expect(results).toHaveLength(count);
    for (const { application, applicant } of results) {
      expect(application.job_opportunity_id).toBe(jobId);
      expect(applicant.id).toBe(application.applicant_id);
      expect(applicants).toContain(applicant);
    }
  }

  for (const application of jobApplications) {
    expect(application.expected_salary).toBeGreaterThanOrEqual(SALARY_MIN);
    expect(application.expected_salary).toBeLessThanOrEqual(SALARY_MAX);
    expect(application.expected_salary % SALARY_STEP).toBe(0);
  }
  expect(
    new Set(jobApplications.map((application) => application.expected_salary)).size,
  ).toBeGreaterThan(4);
});

test("salary and experience bounds are inclusive, including decimal experience", () => {
  const store = createJobApplicationsStore("job-001");
  store.getState().setSalaryRange([3250, 4000]);
  expect(filteredIds(store.getState())).toEqual([
    "application-001",
    "application-002",
    "application-005",
    "application-008",
  ]);
  store.getState().setSalaryRange([5000, 5000]);
  expect(filteredIds(store.getState())).toEqual(["application-004"]);

  store.getState().clearFilters();
  store.getState().setExperienceRange([1.5, 3.5]);
  expect(filteredIds(store.getState())).toEqual([
    "application-002",
    "application-003",
    "application-006",
    "application-008",
  ]);
  store.getState().setExperienceRange([3.5, 3.5]);
  expect(filteredIds(store.getState())).toEqual(["application-002"]);
});

test("both filters combine with AND and remain scoped to the job", () => {
  const store = createJobApplicationsStore("job-001");
  store.getState().setSalaryRange([3500, 4000]);
  store.getState().setExperienceRange([3.5, 6]);
  expect(filteredIds(store.getState())).toEqual([
    "application-001",
    "application-002",
  ]);
  expect(filteredIds({ ...store.getState(), jobId: "job-002" })).toEqual([
    "application-015",
  ]);
  expect(filteredIds({ ...store.getState(), jobId: "missing-job" })).toEqual([]);

  store.getState().setExperienceRange([10, 15]);
  expect(filteredIds(store.getState())).toEqual([]);
});

test("ranges normalize safely, clear resets, and new instances never share filters", () => {
  const store = createJobApplicationsStore("job-001");
  const initial = store.getState();
  const independent = createJobApplicationsStore("job-001");
  expect(initial.salaryRange).not.toBe(independent.getState().salaryRange);
  expect(initial.experienceRange).not.toBe(independent.getState().experienceRange);

  initial.setSalaryRange([6000, -50]);
  initial.setExperienceRange([20, -1]);
  expect(store.getState().salaryRange).toEqual([0, 5000]);
  expect(store.getState().experienceRange).toEqual([0, 15]);

  const salary: NumberRange = [4000, 3000];
  const experience: NumberRange = [6, 3.5];
  initial.setSalaryRange(salary);
  initial.setExperienceRange(experience);
  expect(salary).toEqual([4000, 3000]);
  expect(experience).toEqual([6, 3.5]);
  salary[0] = 0;
  experience[0] = 0;
  expect(store.getState().salaryRange).toEqual([3000, 4000]);
  expect(store.getState().experienceRange).toEqual([3.5, 6]);

  for (const fresh of [
    independent,
    createJobApplicationsStore("job-002"),
    createJobApplicationsStore("job-001"),
  ]) {
    expect(fresh.getState().salaryRange).toEqual([0, 5000]);
    expect(fresh.getState().experienceRange).toEqual([0, 15]);
  }

  initial.clearFilters();
  expect(store.getState()).toMatchObject({
    jobId: "job-001",
    salaryRange: [0, 5000],
    experienceRange: [0, 15],
  });
  expect(store.getState().salaryRange).not.toBe(initial.salaryRange);
  expect(store.getState().experienceRange).not.toBe(initial.experienceRange);
  expect(filteredIds(store.getState())).toHaveLength(8);
});
