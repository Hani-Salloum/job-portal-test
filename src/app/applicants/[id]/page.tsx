import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { applicants } from "@/lib/mock-data/applicants";

export default async function ApplicantProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const applicant = applicants.find((candidate) => candidate.id === id);
  if (!applicant) notFound();

  return <DashboardShell title={applicant.name} subtitle="">{null}</DashboardShell>;
}
