import { expect, test } from "@playwright/test";

import { jobOpportunitiesCards } from "@/lib/mock-data/job-opportunities-cards";
import {
  selectFilteredJobs,
  useJobOpportunitiesStore,
  type JobOpportunitiesState,
} from "@/lib/stores/job-opportunities-store";
import type { JobStatus } from "@/types/job-opportunity";

const originalMockJobs = structuredClone(jobOpportunitiesCards);

function resetStore() {
  useJobOpportunitiesStore.setState(
    useJobOpportunitiesStore.getInitialState(),
    true,
  );
}

function filteredIds(overrides: Partial<JobOpportunitiesState> = {}) {
  return selectFilteredJobs({
    ...useJobOpportunitiesStore.getState(),
    ...overrides,
  }).map((job) => job.id);
}

test.beforeEach(resetStore);
test.afterEach(resetStore);

test("mock jobs have valid, varied data and unique IDs", () => {
  expect(jobOpportunitiesCards).toHaveLength(8);
  expect(new Set(jobOpportunitiesCards.map((job) => job.id)).size).toBe(8);

  for (const job of jobOpportunitiesCards) {
    expect(typeof job.id).toBe("string");
    expect(job.id.trim()).not.toBe("");
    expect(typeof job.role_name).toBe("string");
    expect(job.role_name.trim()).not.toBe("");
    expect(["FULL_TIME", "PART_TIME"]).toContain(job.job_type);
    expect(["REMOTE", "HYBRID", "ONSITE"]).toContain(job.job_location);
    expect(["ACTIVE", "DRAFT", "PAUSED"]).toContain(job.status);
    expect(Number.isInteger(job.applications_number)).toBe(true);
    expect(job.applications_number).toBeGreaterThanOrEqual(0);
    expect(job.date_posted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(new Date(job.date_posted).toISOString().slice(0, 10)).toBe(
      job.date_posted,
    );
    expect(job.required_skill.length).toBeGreaterThan(0);
    for (const skill of job.required_skill) {
      expect(typeof skill).toBe("string");
      expect(skill.trim()).not.toBe("");
    }
    if (job.status === "DRAFT") {
      expect(job.applications_number).toBe(0);
    }
  }

  expect(new Set(jobOpportunitiesCards.map((job) => job.job_type))).toEqual(
    new Set(["FULL_TIME", "PART_TIME"]),
  );
  expect(new Set(jobOpportunitiesCards.map((job) => job.job_location))).toEqual(
    new Set(["REMOTE", "HYBRID", "ONSITE"]),
  );
  expect(new Set(jobOpportunitiesCards.map((job) => job.status))).toEqual(
    new Set(["ACTIVE", "DRAFT", "PAUSED"]),
  );
  expect(
    jobOpportunitiesCards.filter((job) => job.required_skill.length > 6).length,
  ).toBeGreaterThan(1);
});

test("initial state contains the mock jobs and no filters or pending change", () => {
  expect(useJobOpportunitiesStore.getState()).toMatchObject({
    jobs: jobOpportunitiesCards,
    search: "",
    jobTypes: [],
    jobLocations: [],
    statuses: [],
    pendingJobId: null,
  });
  expect(selectFilteredJobs(useJobOpportunitiesStore.getState())).toEqual(
    jobOpportunitiesCards,
  );
});

test("role search trims whitespace and matches case-insensitive substrings", () => {
  expect(filteredIds({ search: " \tFrOnTeNd\n " })).toEqual(["job-001"]);
});

test("skill search trims whitespace and matches case-insensitive substrings", () => {
  expect(filteredIds({ search: " \tLaYwRiGh\n " })).toEqual([
    "job-001",
    "job-005",
  ]);
});

test("blank search includes all jobs and unmatched search includes none", () => {
  expect(filteredIds({ search: " \t\n " })).toEqual(
    jobOpportunitiesCards.map((job) => job.id),
  );
  expect(filteredIds({ search: "no-such-role-or-skill" })).toEqual([]);
});

test("job type filters use OR within the group", () => {
  expect(filteredIds({ jobTypes: ["PART_TIME"] })).toEqual([
    "job-003",
    "job-005",
    "job-008",
  ]);
  expect(filteredIds({ jobTypes: ["FULL_TIME", "PART_TIME"] })).toEqual(
    jobOpportunitiesCards.map((job) => job.id),
  );
});

test("job location filters use OR within the group", () => {
  expect(filteredIds({ jobLocations: ["REMOTE", "ONSITE"] })).toEqual([
    "job-001",
    "job-003",
    "job-004",
    "job-007",
    "job-008",
  ]);
});

test("status filters use OR within the group", () => {
  expect(filteredIds({ statuses: ["DRAFT", "PAUSED"] })).toEqual([
    "job-003",
    "job-004",
    "job-006",
    "job-008",
  ]);
});

test("search and filter groups combine with AND", () => {
  expect(
    filteredIds({
      search: "  tYpEsCrIpT  ",
      jobTypes: ["PART_TIME"],
      jobLocations: ["REMOTE", "HYBRID"],
      statuses: ["ACTIVE"],
    }),
  ).toEqual(["job-005"]);
  expect(
    filteredIds({ jobTypes: ["PART_TIME"], jobLocations: ["ONSITE"] }),
  ).toEqual([]);
});

test("filtering does not mutate its input or the store", () => {
  const storeState = useJobOpportunitiesStore.getState();
  const state = {
    jobs: structuredClone(storeState.jobs),
    search: "  tYpEsCrIpT  ",
    jobTypes: [...storeState.jobTypes],
    jobLocations: [...storeState.jobLocations],
    statuses: [...storeState.statuses],
  };
  const snapshot = structuredClone(state);

  selectFilteredJobs(state);
  selectFilteredJobs(state);

  expect(state).toEqual(snapshot);
  expect(useJobOpportunitiesStore.getState()).toBe(storeState);
  expect(jobOpportunitiesCards).toEqual(originalMockJobs);
});

test("setters replace their own values without changing jobs or pending ID", () => {
  const initial = useJobOpportunitiesStore.getState();
  initial.requestStatusChange("job-001");
  initial.setSearch("  React  ");
  initial.setJobTypes(["FULL_TIME"]);
  initial.setJobLocations(["ONSITE"]);
  initial.setStatuses(["PAUSED"]);

  expect(useJobOpportunitiesStore.getState()).toMatchObject({
    search: "  React  ",
    jobTypes: ["FULL_TIME"],
    jobLocations: ["ONSITE"],
    statuses: ["PAUSED"],
    pendingJobId: "job-001",
  });

  initial.setSearch("TypeScript");
  initial.setJobTypes(["PART_TIME"]);
  initial.setJobLocations(["REMOTE", "HYBRID"]);
  initial.setStatuses(["ACTIVE", "DRAFT"]);

  expect(useJobOpportunitiesStore.getState()).toMatchObject({
    search: "TypeScript",
    jobTypes: ["PART_TIME"],
    jobLocations: ["REMOTE", "HYBRID"],
    statuses: ["ACTIVE", "DRAFT"],
    pendingJobId: "job-001",
  });
  expect(useJobOpportunitiesStore.getState().jobs).toBe(initial.jobs);
});

test("clearFilters clears only search and filters, preserving changed jobs and pending ID", () => {
  const actions = useJobOpportunitiesStore.getState();
  actions.requestStatusChange("job-001");
  actions.confirmStatusChange();
  const changedJobs = useJobOpportunitiesStore.getState().jobs;
  actions.setSearch("React");
  actions.setJobTypes(["PART_TIME"]);
  actions.setJobLocations(["REMOTE"]);
  actions.setStatuses(["DRAFT"]);
  actions.requestStatusChange("job-004");

  actions.clearFilters();

  expect(useJobOpportunitiesStore.getState()).toMatchObject({
    search: "",
    jobTypes: [],
    jobLocations: [],
    statuses: [],
    pendingJobId: "job-004",
  });
  expect(useJobOpportunitiesStore.getState().jobs).toBe(changedJobs);
});

test("request replaces the pending ID and cancel leaves jobs and filters unchanged", () => {
  const actions = useJobOpportunitiesStore.getState();
  actions.setSearch("React");
  actions.setJobTypes(["FULL_TIME"]);
  actions.setJobLocations(["REMOTE"]);
  actions.setStatuses(["ACTIVE"]);
  const before = useJobOpportunitiesStore.getState();

  actions.requestStatusChange("job-001");
  expect(useJobOpportunitiesStore.getState().pendingJobId).toBe("job-001");
  expect(useJobOpportunitiesStore.getState().jobs).toBe(before.jobs);
  actions.requestStatusChange("job-004");
  expect(useJobOpportunitiesStore.getState().pendingJobId).toBe("job-004");
  actions.cancelStatusChange();

  expect(useJobOpportunitiesStore.getState()).toEqual(before);
  expect(useJobOpportunitiesStore.getState().jobs).toBe(before.jobs);
  actions.confirmStatusChange();
  expect(useJobOpportunitiesStore.getState().jobs).toBe(before.jobs);
});

const transitions: { from: JobStatus; to: JobStatus }[] = [
  { from: "ACTIVE", to: "PAUSED" },
  { from: "DRAFT", to: "ACTIVE" },
  { from: "PAUSED", to: "ACTIVE" },
];

for (const { from, to } of transitions) {
  test(`confirm transitions ${from} to ${to} immutably and clears pending ID`, () => {
    const before = useJobOpportunitiesStore.getState();
    const target = before.jobs.find((job) => job.status === from)!;
    expect(target).toBeDefined();
    const originalJobs = structuredClone(before.jobs);
    before.setSearch("TypeScript");
    before.setJobTypes(["PART_TIME"]);
    before.setJobLocations(["REMOTE"]);
    before.setStatuses(["DRAFT"]);
    before.requestStatusChange(target.id);
    expect(useJobOpportunitiesStore.getState().jobs).toBe(before.jobs);

    before.confirmStatusChange();

    const after = useJobOpportunitiesStore.getState();
    expect(after.pendingJobId).toBeNull();
    expect(after.jobs).not.toBe(before.jobs);
    expect(after.jobs).toEqual(
      originalJobs.map((job) =>
        job.id === target.id ? { ...job, status: to } : job,
      ),
    );
    expect(after.jobs.find((job) => job.id === target.id)).not.toBe(target);
    for (const job of before.jobs) {
      if (job.id !== target.id) {
        expect(after.jobs.find((updated) => updated.id === job.id)).toBe(job);
      }
    }
    expect(after).toMatchObject({
      search: "TypeScript",
      jobTypes: ["PART_TIME"],
      jobLocations: ["REMOTE"],
      statuses: ["DRAFT"],
    });
    expect(before.jobs).toEqual(originalJobs);
    expect(jobOpportunitiesCards).toEqual(originalMockJobs);

    after.confirmStatusChange();
    expect(useJobOpportunitiesStore.getState().jobs).toBe(after.jobs);
    expect(useJobOpportunitiesStore.getState().pendingJobId).toBeNull();
  });
}

test("confirm without a pending ID leaves state unchanged", () => {
  const before = useJobOpportunitiesStore.getState();

  before.confirmStatusChange();

  expect(useJobOpportunitiesStore.getState()).toBe(before);
  expect(useJobOpportunitiesStore.getState().pendingJobId).toBeNull();
});

test("confirm for a missing ID preserves jobs and clears pending ID", () => {
  const before = useJobOpportunitiesStore.getState();
  const snapshot = structuredClone(before.jobs);
  const missingId = "missing-job-id";
  expect(before.jobs.some((job) => job.id === missingId)).toBe(false);

  before.requestStatusChange(missingId);
  before.confirmStatusChange();

  const after = useJobOpportunitiesStore.getState();
  expect(after.pendingJobId).toBeNull();
  expect(after.jobs).toEqual(snapshot);
  for (const job of before.jobs) {
    expect(after.jobs.find((updated) => updated.id === job.id)).toBe(job);
  }
  expect(before.jobs).toEqual(snapshot);
  expect(jobOpportunitiesCards).toEqual(originalMockJobs);
});
