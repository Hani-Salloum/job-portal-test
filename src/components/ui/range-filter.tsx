"use client";

import { useId } from "react";
import * as Slider from "@radix-ui/react-slider";
import { useLocale, useTranslation } from "@/components/locale-provider";

export interface RangeFilterProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue: (value: number) => string;
}

export function RangeFilter({ label, min, max, step, value, onChange, formatValue }: RangeFilterProps) {
  const labelId = useId();
  const locale = useLocale();
  const t = useTranslation();

  return (
    <div className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <span id={labelId} className="text-sm font-medium text-foreground">{label}</span>
        <span className="rounded-xl bg-muted px-2.5 py-1 text-xs font-medium text-foreground tabular-nums">
          <bdi>{formatValue(value[0])}</bdi>
          <span aria-hidden="true" className="mx-2 text-muted-foreground">–</span>
          <bdi>{formatValue(value[1])}</bdi>
        </span>
      </div>
      <Slider.Root
        aria-labelledby={labelId}
        dir={locale === "ar" ? "rtl" : "ltr"}
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(next) => onChange([next[0], next[1]])}
        className="relative flex h-11 w-full touch-none items-center select-none"
      >
        <Slider.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-muted">
          <Slider.Range className="absolute h-full rounded-full bg-primary" />
        </Slider.Track>
        {value.map((amount, index) => (
          <Slider.Thumb
            key={index}
            aria-label={t(index === 0 ? "applications.filters.minimum" : "applications.filters.maximum", { filter: label })}
            aria-valuetext={formatValue(amount)}
            className="relative block size-5 rounded-full border-2 border-primary bg-surface shadow-sm outline-none transition-shadow before:absolute before:-inset-3 before:rounded-full hover:ring-4 hover:ring-primary/15 focus-visible:ring-4 focus-visible:ring-focus-ring/35 motion-reduce:transition-none"
          />
        ))}
      </Slider.Root>

    </div>
  );
}
