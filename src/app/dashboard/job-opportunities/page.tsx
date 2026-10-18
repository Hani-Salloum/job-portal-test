import { DashboardShell } from "@/components/layout/dashboard-shell";
import { JobOpportunitiesView } from "@/components/job-opportunities/job-opportunities-view";
import { translate } from "@/lib/i18n";
import { currentRouteLocale } from "@/lib/route-locale";

export default async function JobOpportunitiesPage() {
  const locale = await currentRouteLocale();

  return (
    <DashboardShell title={translate(locale, "jobs.title")} subtitle={translate(locale, "jobs.description")}>
      <JobOpportunitiesView />
    </DashboardShell>
  );
}
