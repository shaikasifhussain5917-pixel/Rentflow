import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "subtle";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-[#1f2937] to-[#111827] text-white hover:from-[#111827] hover:to-black active:scale-[0.98] shadow-[0_4px_14px_rgba(17,24,39,0.2),inset_0_1px_0_rgba(255,255,255,0.22)] hover:shadow-[0_6px_20px_rgba(17,24,39,0.28)]",
  secondary:
    "bg-white/70 backdrop-blur-md text-[var(--color-ink)] border border-white/80 hover:bg-white/95 hover:border-white active:scale-[0.98] shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)]",
  subtle:
    "bg-[var(--color-accent-wash)] text-[var(--color-accent)] border border-[var(--color-accent)]/15 hover:bg-[var(--color-accent-wash)]/80 active:scale-[0.98]",
  ghost:
    "text-[var(--color-ink-soft)] hover:bg-white/60 hover:backdrop-blur-sm hover:text-[var(--color-ink)] active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5 rounded-[10px]",
  md: "h-11 px-5 text-sm gap-2 rounded-[12px]",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex select-none items-center justify-center font-medium tracking-[-0.01em] transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)]/15 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0 [&>svg]:size-[17px]">{icon}</span>}
      {children}
      {iconRight && <span className="shrink-0 [&>svg]:size-[17px]">{iconRight}</span>}
    </button>
  );
}
