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
        "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-5",
        className,
      )}
    >
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="flex flex-col gap-3">
          <div className="space-y-1 sm:space-y-2">
            {eyebrow && (
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-accent)]">
                {eyebrow}
              </span>
            )}
            <h1 className="font-serif text-[1.5rem] font-medium leading-[1.1] tracking-[-0.01em] text-[var(--color-ink)] sm:text-[2.4rem] break-words">
              {title}
            </h1>
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2 sm:hidden">{actions}</div>}
        </div>
        {description && (
          <div className="max-w-xl text-[13.5px] sm:text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
            {description}
          </div>
        )}
      </div>
      {actions && <div className="hidden shrink-0 items-center gap-2.5 sm:flex">{actions}</div>}
    </div>
  );
}
