import type { Applicant } from "@/types/applicant";
import type { JobOpportunity } from "@/types/job-opportunity";

export interface JobApplication {
  id: string;
  applicant_id: Applicant["id"];
  job_opportunity_id: JobOpportunity["id"];
  /** Expected monthly salary in USD. */
  expected_salary: number;
}
