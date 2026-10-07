import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        {eyebrow && (
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-accent)]">
            {eyebrow}
          </span>
        )}
        <h1 className="font-serif text-[2rem] font-medium leading-[1.05] tracking-[-0.01em] text-[var(--color-ink)] sm:text-[2.4rem]">
          {title}
        </h1>
        {description && (
          <div className="max-w-xl text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
            {description}
          </div>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2.5">{actions}</div>}
    </div>
  );
}
