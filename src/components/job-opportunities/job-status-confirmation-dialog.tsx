"use client";

import { Pause, Play, Send } from "lucide-react";
import { useLocale, useTranslation } from "@/components/locale-provider";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { JobOpportunity } from "@/types/job-opportunity";

export interface JobStatusConfirmationDialogProps {
  job: JobOpportunity | null;
  onCancel: () => void;
  onConfirm: () => void;
  onCloseAutoFocus?: (event: Event) => void;
}

export function JobStatusConfirmationDialog({ job, onCancel, onConfirm, onCloseAutoFocus }: JobStatusConfirmationDialogProps) {
  const locale = useLocale();
  const t = useTranslation();
  const action = job?.status === "DRAFT" ? "publish" : job?.status === "ACTIVE" ? "disable" : "enable";
  const Icon = action === "publish" ? Send : action === "disable" ? Pause : Play;

  return (
    <AlertDialog open={job !== null} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <AlertDialogContent onCloseAutoFocus={onCloseAutoFocus} dir={locale === "ar" ? "rtl" : "ltr"} className="w-[calc(100%_-_2rem)] rounded-[30px] p-6 sm:p-8">
        <div className="grid size-12 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-foreground">
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(`jobs.confirm.${action}.title`)}</AlertDialogTitle>
          <AlertDialogDescription className="break-words">
            {t(`jobs.confirm.${action}.description`, { role: job?.role_name ?? "" })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-1">
          <AlertDialogCancel className="rounded-2xl">{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="rounded-2xl">
            {t(`jobs.confirm.${action}.action`)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
