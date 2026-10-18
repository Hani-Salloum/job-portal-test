"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Award, BriefcaseBusiness, Download, Mail, Phone, Sparkles } from "lucide-react";
import { LocalizedLink, useLocale, useTranslation } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import type { Applicant, ApplicantSocialLinks } from "@/types/applicant";
import type { JobApplication } from "@/types/job-application";

const socialPlatforms = ["linked_in", "github", "instagram", "x"] as const;

function SocialIcon({ platform }: { platform: keyof ApplicantSocialLinks }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
      {platform === "linked_in" && <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7 10v7M11 17v-7m0 3a3 3 0 0 1 6 0v4" /><path d="M7 7h.01" strokeWidth="3" /></>}
      {platform === "github" && <><path d="M9 19c-4.3 1.3-4.3-2.2-6-2.6M15 22v-3.4a3 3 0 0 0-.8-2.3c2.7-.3 5.6-1.3 5.6-6a4.7 4.7 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.4 11.4 0 0 0-6 0C6.6 3.6 5.6 3.9 5.6 3.9a4.3 4.3 0 0 0-.1 3.2 4.7 4.7 0 0 0-1.3 3.3c0 4.6 2.9 5.6 5.6 5.9a3 3 0 0 0-.8 2.3V22" /></>}
      {platform === "instagram" && <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" strokeWidth="2.5" /></>}
      {platform === "x" && <path d="m4 3 12.3 18H20L7.7 3H4Zm0 18 6.8-7.9M20 3l-6.8 7.9" />}
    </svg>
  );
}

export function ApplicantProfileView({ applicant, application }: { applicant: Applicant; application?: JobApplication }) {
  const locale = useLocale();
  const t = useTranslation();
  const [imageFailed, setImageFailed] = useState(false);
  const date = new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" });
  const experience = new Intl.NumberFormat(locale, {
    style: "unit", unit: "year", unitDisplay: "long", maximumFractionDigits: 1,
  }).format(applicant.years_of_experience);
  const salary = application ? new Intl.NumberFormat(locale, {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(application.expected_salary) : null;
  const workHistory = [...applicant.work_history].sort((a, b) => b.start_date.localeCompare(a.start_date));
  const certificates = [...applicant.certificates].sort((a, b) => b.date.localeCompare(a.date));
  const initials = applicant.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("");
  const contactClass = "flex min-h-11 min-w-0 items-start gap-2 rounded-lg py-2 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring motion-reduce:transition-none";

  return (
    <div className="mx-auto grid w-full max-w-[1500px] gap-5 sm:gap-6">
      <LocalizedLink
        href={application ? `/job-opportunities/${encodeURIComponent(application.job_opportunity_id)}/applications` : "/dashboard/job-opportunities"}
        className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl text-sm text-muted-foreground no-underline hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      >
        <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
        {t(application ? "applicant.back" : "applications.back")}
      </LocalizedLink>

      <div className="grid min-w-0 items-start gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,1fr)]">
        <aside aria-labelledby="applicant-name" className="themed-scrollbar min-w-0 rounded-[32px] border border-border bg-surface p-5 sm:p-6 xl:sticky xl:top-30 xl:col-start-2 xl:row-start-1 xl:max-h-[calc(100dvh-9rem)] xl:overflow-y-auto">
          <div className="grid min-w-0 grid-cols-1 items-start gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="grid min-w-0 justify-items-start gap-4">
              <div className="grid size-18 shrink-0 place-items-center overflow-hidden rounded-full bg-muted text-xl font-semibold text-foreground ring-4 ring-muted/40 sm:size-20">
                {applicant.image && !imageFailed ? (
                  <Image src={applicant.image} alt="" width={80} height={80} sizes="80px" priority onError={() => setImageFailed(true)} className="size-full object-cover" />
                ) : <span aria-hidden="true">{initials}</span>}
              </div>
              <h2 id="applicant-name" className="min-w-0 text-lg leading-tight font-semibold tracking-[-.035em] sm:text-2xl">
                <bdi className="break-words">{applicant.name}</bdi>
              </h2>
            </div>
            <div className="min-w-0">
              <a href={`mailto:${applicant.email}`} aria-label={`${t("applicant.email")}: ${applicant.email}`} className={contactClass}>
                <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <bdi dir="ltr" className="min-w-0 break-all leading-5">{applicant.email}</bdi>
              </a>
              <a href={`tel:${applicant.phone_number.replace(/[^+\d]/g, "")}`} aria-label={`${t("applicant.phone")}: ${applicant.phone_number}`} className={contactClass}>
                <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <bdi dir="ltr" className="min-w-0 break-words leading-5">{applicant.phone_number}</bdi>
              </a>
              <dl className="flex min-h-11 items-start gap-2 py-2 text-sm text-muted-foreground">
                <dt>
                  <BriefcaseBusiness aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  <span className="sr-only">{t("applications.experience")}</span>
                </dt>
                <dd className="min-w-0 leading-5">{experience}</dd>
              </dl>
              <div aria-label={t("applicant.socialLinks")} className="-ms-2 mt-1 flex flex-wrap">
                {socialPlatforms.map((platform) => /^https?:\/\//i.test(applicant.social_links[platform]) && (
                  <a
                    key={platform}
                    href={applicant.social_links[platform]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("applicant.socialLink", { platform: t(`applicant.social.${platform}`) })}
                    className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring motion-reduce:transition-none"
                  >
                    <SocialIcon platform={platform} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <section aria-labelledby="applicant-about" className="mt-6 rounded-[24px] bg-muted/40 p-5 sm:mt-7">
            <h3 id="applicant-about" className="text-sm font-semibold text-foreground">{t("applicant.about")}</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground" dir="auto">{applicant.about || t("common.notProvided")}</p>
          </section>

          <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-5 sm:mt-7">
            <dl className="min-w-0 space-y-1.5">
              <dt className="text-xs text-muted-foreground">{t("applications.salary")}</dt>
              <dd className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-lg font-semibold tracking-[-.025em] tabular-nums">
                <bdi>{salary ?? t("common.notProvided")}</bdi>
                {salary !== null && <span className="text-xs font-normal tracking-normal text-muted-foreground">{t("applications.perMonth")}</span>}
              </dd>
            </dl>
            {applicant.cv_url ? (
              <Button asChild className="shrink-0 rounded-2xl">
                <a href={applicant.cv_url} download>
                  <Download aria-hidden="true" className="size-4" />
                  {t("applicant.downloadCv")}
                </a>
              </Button>
            ) : <Button disabled className="shrink-0 rounded-2xl"><Download aria-hidden="true" className="size-4" />{t("applicant.downloadCv")}</Button>}
          </footer>
        </aside>

        <div className="grid min-w-0 gap-5 sm:gap-6 xl:col-start-1 xl:row-start-1">
          <section aria-labelledby="applicant-skills" className="min-w-0 rounded-[32px] border border-border bg-surface p-5 sm:p-6">
            <h2 id="applicant-skills" className="flex items-center gap-2.5 text-base font-semibold tracking-[-.02em]">
              <Sparkles aria-hidden="true" className="size-4 text-muted-foreground" />
              {t("applicant.skills")}
            </h2>
            {applicant.skills.length ? (
              <ul className="mt-5 flex min-w-0 flex-wrap gap-2" aria-label={t("applicant.skills")}>
                {applicant.skills.map((skill) => <li key={skill} className="max-w-full rounded-xl bg-muted/60 px-3.5 py-2 text-sm leading-5 text-foreground"><bdi className="break-words">{skill}</bdi></li>)}
              </ul>
            ) : <p className="mt-4 text-sm leading-6 text-muted-foreground">{t("applicant.empty.skills")}</p>}
          </section>

          <div className="grid min-w-0 items-start gap-5 sm:grid-cols-2 sm:gap-6">
            <section aria-labelledby="applicant-work-history" className="min-w-0 rounded-[32px] border border-border bg-surface p-5 sm:p-6">
              <h2 id="applicant-work-history" className="flex items-center gap-2.5 text-base font-semibold tracking-[-.02em]">
                <BriefcaseBusiness aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                {t("applicant.workHistory")}
              </h2>
              {workHistory.length ? (
                <ol className="mt-6">
                  {workHistory.map((work) => (
                    <li key={work.id} className="relative border-s border-border ps-5 pb-7 last:border-transparent last:pb-0">
                      <span aria-hidden="true" className="absolute top-1.5 -start-[4.5px] size-2 rounded-full bg-primary ring-4 ring-surface" />
                      <h3 className="text-sm leading-6 font-semibold text-foreground"><bdi className="break-words">{work.role_name}</bdi></h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{work.company_name}</p>
                      <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-xs leading-5 text-muted-foreground">
                        <time dateTime={work.start_date}>{date.format(new Date(work.start_date))}</time>
                        <span aria-hidden="true">–</span>
                        {work.end_date ? <time dateTime={work.end_date}>{date.format(new Date(work.end_date))}</time> : <span>{t("applicant.present")}</span>}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground" dir="auto">{work.description}</p>
                    </li>
                  ))}
                </ol>
              ) : <p className="mt-4 text-sm leading-6 text-muted-foreground">{t("applicant.empty.workHistory")}</p>}
            </section>

            <section aria-labelledby="applicant-certificates" className="min-w-0 rounded-[32px] border border-border bg-surface p-5 sm:p-6">
              <h2 id="applicant-certificates" className="flex items-center gap-2.5 text-base font-semibold tracking-[-.02em]">
                <Award aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                {t("applicant.certificates")}
              </h2>
              {certificates.length ? (
                <ul className="mt-6 divide-y divide-border/75">
                  {certificates.map((certificate) => (
                    <li key={certificate.id} className="py-5 first:pt-0 last:pb-0">
                      <h3 className="text-sm leading-6 font-semibold text-foreground"><bdi className="break-words">{certificate.name}</bdi></h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{certificate.source}</p>
                      <time dateTime={certificate.date} className="mt-2 block text-xs leading-5 text-muted-foreground">{date.format(new Date(certificate.date))}</time>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-4 text-sm leading-6 text-muted-foreground">{t("applicant.empty.certificates")}</p>}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
