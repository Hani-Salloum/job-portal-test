import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon: Icon, action }: EmptyStateProps) {
  return (
    <section
      aria-label={title}
      className="flex min-h-72 flex-col items-center justify-center rounded-[30px] border border-border bg-surface px-6 py-12 text-center sm:px-10 sm:py-16"
    >
      {Icon && (
        <div className="mb-5 flex size-14 items-center justify-center rounded-[20px] bg-muted text-muted-foreground">
          <Icon aria-hidden="true" className="size-6" />
        </div>
      )}
      <h2 className="max-w-md break-words text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-2 max-w-md break-words text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action != null && <div className="mt-6 flex max-w-full flex-wrap justify-center gap-3">{action}</div>}
    </section>
  );
}
