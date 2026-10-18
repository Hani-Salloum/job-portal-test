import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ApplicantProfileView } from "@/components/applicants/applicant-profile-view";
import { applicants } from "@/lib/mock-data/applicants";
import { jobApplications } from "@/lib/mock-data/job-applications";

export default async function ApplicantProfilePage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [{ id }, { application_id: applicationId }] = await Promise.all([params, searchParams]);
  const applicant = applicants.find((candidate) => candidate.id === id);
  if (!applicant) notFound();

  const application = typeof applicationId === "string"
    ? jobApplications.find((candidate) => candidate.id === applicationId && candidate.applicant_id === applicant.id)
    : undefined;

  return (
    <DashboardShell title={applicant.name} subtitle="">
      <ApplicantProfileView key={applicant.id} applicant={applicant} application={application} />
    </DashboardShell>
  );
}
