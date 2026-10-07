import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  count?: number;
  ariaLabel?: string;
}

interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  label: string;
}

export function Segmented<T extends string>({ options, value, onChange, className, label }: SegmentedProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1 rounded-[12px] border border-white/70 bg-white/60 p-1 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]",
        className,
      )}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            aria-label={o.ariaLabel}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-[9px] px-3 text-[13px] font-medium transition-all duration-200 cursor-pointer [&>svg]:size-[16px] [&>svg]:stroke-[1.7]",
              active
                ? "bg-white text-[var(--color-ink)] shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] font-semibold"
                : "text-[var(--color-ink-faint)] hover:text-[var(--color-ink-soft)] hover:bg-white/40",
            )}
          >
            {o.label}
            {o.count !== undefined && (
              <span className={cn("tabular text-[11.5px]", active ? "text-[var(--color-ink-faint)]" : "opacity-70")}>
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
