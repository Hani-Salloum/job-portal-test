import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { JobApplicationsView } from "@/components/job-applications/job-applications-view";
import { jobOpportunitiesCards } from "@/lib/mock-data/job-opportunities-cards";
import { translate } from "@/lib/i18n";
import { currentRouteLocale } from "@/lib/route-locale";

export default async function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = jobOpportunitiesCards.find((opportunity) => opportunity.id === id);
  if (!job) notFound();
  const locale = await currentRouteLocale();

  return (
    <DashboardShell title={translate(locale, "jobs.applications")} subtitle={job.role_name}>
      <JobApplicationsView key={job.id} job={job} />
    </DashboardShell>
  );
}
