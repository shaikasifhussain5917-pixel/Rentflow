import { cn } from "../../utils/cn";

type Tone = "positive" | "warning" | "critical" | "neutral" | "accent";

interface StatusBadgeProps {
  tone?: Tone;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const tones: Record<Tone, { wrap: string; dot: string }> = {
  positive: {
    wrap: "bg-emerald-50/90 text-emerald-800 border border-emerald-600/20 shadow-[0_1px_4px_rgba(16,185,129,0.08)] backdrop-blur-sm",
    dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)] animate-pulse",
  },
  warning: {
    wrap: "bg-amber-50/90 text-amber-800 border border-amber-600/20 shadow-[0_1px_4px_rgba(245,158,11,0.08)] backdrop-blur-sm",
    dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]",
  },
  critical: {
    wrap: "bg-rose-50/90 text-rose-800 border border-rose-600/20 shadow-[0_1px_4px_rgba(244,63,94,0.08)] backdrop-blur-sm",
    dot: "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.7)]",
  },
  neutral: {
    wrap: "bg-white/70 text-[var(--color-ink-soft)] border border-white/90 shadow-[0_1px_4px_rgba(0,0,0,0.03)] backdrop-blur-sm",
    dot: "bg-[var(--color-ink-faint)]",
  },
  accent: {
    wrap: "bg-[var(--color-accent-wash)]/90 text-[var(--color-accent)] border border-[var(--color-accent)]/20 shadow-[0_1px_4px_rgba(154,91,63,0.08)] backdrop-blur-sm",
    dot: "bg-[var(--color-accent)] shadow-[0_0_6px_rgba(154,91,63,0.6)]",
  },
};

export function StatusBadge({ tone = "neutral", children, dot, className }: StatusBadgeProps) {
  const t = tones[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium tracking-[0.01em]",
        t.wrap,
        className,
      )}
    >
      {dot && <span className={cn("size-1.5 rounded-full", t.dot)} />}
      {children}
    </span>
  );
}
