import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface StatDisplayProps {
  label: string;
  value: ReactNode;
  unit?: string;
  hint?: ReactNode;
  size?: "md" | "lg";
  tone?: "default" | "critical" | "positive";
  className?: string;
}

const toneClass = {
  default: "text-[var(--color-ink)]",
  critical: "text-[var(--color-critical)]",
  positive: "text-[var(--color-positive)]",
};

export function StatDisplay({ label, value, unit, hint, size = "md", tone = "default", className }: StatDisplayProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span
          className={cn(
            "tabular font-semibold leading-none",
            toneClass[tone],
            size === "lg" ? "text-[2.6rem]" : "text-[1.85rem]",
          )}
        >
          {value}
        </span>
        {unit && <span className="text-sm font-medium text-[var(--color-ink-faint)]">{unit}</span>}
      </div>
      {hint && <div className="text-[13px] text-[var(--color-ink-soft)]">{hint}</div>}
    </div>
  );
}
