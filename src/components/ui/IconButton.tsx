import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
  active?: boolean;
}

export function IconButton({ label, children, className, active, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-[12px] text-[var(--color-ink-soft)] transition-all duration-200 cursor-pointer hover:bg-white/70 hover:backdrop-blur-sm hover:text-[var(--color-ink)] hover:shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)]/12 [&>svg]:size-[18px] [&>svg]:stroke-[1.6]",
        active && "bg-white/80 text-[var(--color-ink)] shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
