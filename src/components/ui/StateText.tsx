import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type Tone = "positive" | "warning" | "critical" | "accent" | "neutral";

const tones: Record<Tone, { text: string; dot: string }> = {
  positive: { text: "text-[var(--color-positive)]", dot: "bg-[var(--color-positive)]" },
  warning: { text: "text-[var(--color-warning)]", dot: "bg-[var(--color-warning)]" },
  critical: { text: "text-[var(--color-critical)]", dot: "bg-[var(--color-critical)]" },
  accent: { text: "text-[var(--color-accent)]", dot: "bg-[var(--color-accent)]" },
  neutral: { text: "text-[var(--color-ink-soft)]", dot: "bg-[var(--color-ink-faint)]" },
};

/** Quiet status — a dot and a word, no pill. Use where badges would add noise. */
export function StateText({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  const t = tones[tone];
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-medium", t.text, className)}>
      <span className={cn("size-1.5 rounded-full", t.dot)} />
      {children}
    </span>
  );
}
