import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[20px] border border-white/60 bg-white/40 p-8 py-16 text-center backdrop-blur-md shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      {icon && (
        <div className="mb-5 inline-flex size-14 items-center justify-center rounded-full border border-white/80 bg-white/80 text-[var(--color-accent)] shadow-[0_4px_16px_rgba(154,91,63,0.1)] backdrop-blur-md [&>svg]:size-6 [&>svg]:stroke-[1.6]">
          {icon}
        </div>
      )}
      <h3 className="text-[16px] font-semibold text-[var(--color-ink)]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
