export type JobType = "FULL_TIME" | "PART_TIME";

export type JobLocation = "REMOTE" | "HYBRID" | "ONSITE";

export type JobStatus = "ACTIVE" | "DRAFT" | "PAUSED";

export interface JobOpportunity {
  id: string;
  role_name: string;
  job_type: JobType;
  job_location: JobLocation;
  status: JobStatus;
  applications_number: number;
  date_posted: string;
  required_skill: string[];
}
