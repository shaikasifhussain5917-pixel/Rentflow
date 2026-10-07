import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  muted?: boolean;
  inset?: boolean;
  interactive?: boolean;
}

export function Surface({ className, elevated, muted, inset, interactive, ...props }: SurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-white/60 bg-[var(--color-surface)] backdrop-blur-xl transition-all duration-300",
        muted && "bg-[var(--color-surface-muted)]",
        elevated && "shadow-[var(--shadow-soft)]",
        (interactive || elevated) && "hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] hover:border-white/90",
        inset && "p-6",
        className,
      )}
      {...props}
    />
  );
}
