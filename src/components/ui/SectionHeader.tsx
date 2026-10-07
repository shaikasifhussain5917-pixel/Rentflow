import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface SectionHeaderProps {
  title: string;
  count?: number | string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, count, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex items-baseline gap-2.5">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
          {title}
        </h2>
        {count !== undefined && (
          <span className="tabular text-[13px] font-medium text-[var(--color-ink-faint)]">
            {count}
          </span>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
