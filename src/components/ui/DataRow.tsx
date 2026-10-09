import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface DataRowProps {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function DataRow({
  leading,
  title,
  subtitle,
  meta,
  trailing,
  onClick,
  className,
}: DataRowProps) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-4 px-5 py-4 text-left transition-all duration-200",
        onClick && "cursor-pointer hover:bg-white/75 hover:backdrop-blur-sm",
        className,
      )}
    >
      {leading && <div className="shrink-0">{leading}</div>}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-medium tracking-[-0.01em] text-[var(--color-ink)]">
          {title}
        </div>
        {subtitle && (
          <div className="mt-0.5 truncate text-[12.5px] text-[var(--color-ink-soft)]">{subtitle}</div>
        )}
      </div>
      {meta && <div className="hidden shrink-0 text-right md:block">{meta}</div>}
      {trailing && <div className="shrink-0">{trailing}</div>}
    </Comp>
  );
}
