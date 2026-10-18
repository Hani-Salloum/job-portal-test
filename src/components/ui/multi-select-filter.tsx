"use client";

import { CheckboxItem, ItemIndicator } from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, X } from "lucide-react";
import { useRef } from "react";
import { useLocale, useTranslation } from "@/components/locale-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface MultiSelectFilterProps<T extends string> {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T[];
  onChange: (value: T[]) => void;
}

export function MultiSelectFilter<T extends string>({
  label,
  options,
  value,
  onChange,
}: MultiSelectFilterProps<T>) {
  const locale = useLocale();
  const t = useTranslation();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedOptions = options.filter((option) => value.includes(option.value));

  return (
    <div className="min-w-0" dir={locale === "ar" ? "rtl" : "ltr"}>
      <DropdownMenu dir={locale === "ar" ? "rtl" : "ltr"}>
        <div className="relative min-h-11 w-full rounded-[20px] border border-border bg-surface text-foreground">
          <DropdownMenuTrigger asChild>
            <button
              ref={triggerRef}
              type="button"
              aria-label={label}
              className="absolute inset-0 size-full cursor-pointer rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
            />
          </DropdownMenuTrigger>
          <div className="pointer-events-none relative flex min-h-11 min-w-0 flex-wrap items-center gap-2 py-2 pe-11 ps-4">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(value.filter((selected) => selected !== option.value));
                    triggerRef.current?.focus();
                  }}
                  aria-label={t("jobs.filters.remove", { filter: label, value: option.label })}
                  className="pointer-events-auto inline-flex min-h-8 min-w-0 max-w-full cursor-pointer items-center gap-2 rounded-[20px] border border-border bg-muted px-3 py-1 text-start text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                >
                  <span className="min-w-0 break-words">{option.label}</span>
                  <X aria-hidden="true" className="size-3.5 shrink-0" />
                </button>
              ))
            ) : (
              <span className="min-w-0 truncate text-sm font-medium">{label}</span>
            )}
          </div>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
        </div>
        <DropdownMenuContent
          align="start"
          className="max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[var(--radix-dropdown-menu-trigger-width)] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-[24px] border-border bg-surface p-2 text-foreground"
        >
          <DropdownMenuLabel className="px-3 text-xs text-muted-foreground">
            {label}
          </DropdownMenuLabel>
          {options.map((option) => (
            <CheckboxItem
              key={option.value}
              checked={value.includes(option.value)}
              onCheckedChange={(checked) =>
                onChange(
                  checked === true
                    ? value.includes(option.value) ? value : [...value, option.value]
                    : value.filter((selected) => selected !== option.value),
                )
              }
              onSelect={(event) => event.preventDefault()}
              className="flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-[20px] px-3 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring data-[highlighted]:bg-muted"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-border bg-surface">
                <ItemIndicator>
                  <Check aria-hidden="true" className="size-3.5" />
                </ItemIndicator>
              </span>
              <span className="min-w-0 break-words">{option.label}</span>
            </CheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
}
