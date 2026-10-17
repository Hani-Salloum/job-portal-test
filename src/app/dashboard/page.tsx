import { DashboardShell } from "@/components/dashboard-shell";
import { translate } from "@/lib/i18n";
import { currentRouteLocale } from "@/lib/route-locale";

export default async function DashboardPage() {
  const locale = await currentRouteLocale();
  return (
    <DashboardShell title={translate(locale, "nav.dashboard")} subtitle={translate(locale, "dashboard.todayOperations")}>
      Just testing
    </DashboardShell>
  );
}
