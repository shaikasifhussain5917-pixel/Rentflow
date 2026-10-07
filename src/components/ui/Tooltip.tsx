import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: "top" | "right" | "bottom";
  className?: string;
}

export function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  const pos = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  }[side];

  return (
    <span className={cn("group/tt relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-[var(--color-ink)] px-2 py-1 text-[11.5px] font-medium text-white opacity-0 shadow-[var(--shadow-lift)] transition-opacity duration-150 group-hover/tt:opacity-100",
          pos,
        )}
      >
        {content}
      </span>
    </span>
  );
}
