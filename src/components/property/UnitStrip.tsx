import { cn } from "../../utils/cn";
import type { Tenant, Unit } from "../../data/types";

/* Colour only marks exceptions: occupied stays neutral ink,
   vacancy is ochre, maintenance is clay. */
const segment = {
  occupied: "bg-[var(--color-ink)]/80",
  vacant: "bg-[var(--color-warning)]/65",
  maintenance: "bg-[var(--color-accent)]/70",
} as const;

/** Compact one-row visual: one segment per unit. */
export function UnitStrip({ units, className }: { units: Unit[]; className?: string }) {
  if (units.length === 0) {
    return <div className={cn("h-1.5 w-full rounded-full border border-dashed border-[var(--color-line-strong)]", className)} />;
  }
  return (
    <div className={cn("flex h-1.5 w-full gap-[3px]", className)} aria-hidden>
      {units.map((u) => (
        <span key={u.id} className={cn("h-full min-w-[4px] flex-1 rounded-full", segment[u.status])} />
      ))}
    </div>
  );
}

const block = {
  occupied:
    "border-[var(--color-line-strong)] bg-[var(--color-surface-muted)] text-[var(--color-ink)]",
  vacant:
    "border-dashed border-[var(--color-warning)]/45 bg-[var(--color-warning-wash)]/60 text-[var(--color-warning)]",
  maintenance:
    "border-[var(--color-accent)]/30 bg-[var(--color-accent-wash)] text-[var(--color-accent)]",
} as const;

const statusWord = { occupied: "Occupied", vacant: "Vacant", maintenance: "Maintenance" } as const;

/** Large labelled version — one block per unit, with a payment dot for exceptions. */
export function UnitBlocks({ units, tenants }: { units: Unit[]; tenants: Tenant[] }) {
  const byId = new Map(tenants.map((t) => [t.id, t]));
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(68px,1fr))] gap-2">
      {units.map((u) => {
        const pay = u.tenantId ? byId.get(u.tenantId)?.state : undefined;
        return (
          <div
            key={u.id}
            title={`${u.number} · ${statusWord[u.status]}${pay && pay !== "paid" ? ` · rent ${pay}` : ""}`}
            className={cn(
              "relative flex h-[58px] flex-col justify-between rounded-[9px] border px-2.5 py-2 transition-colors",
              block[u.status],
            )}
          >
            <span className="tabular truncate text-[13px] font-semibold leading-none">{u.number}</span>
            <span className="truncate text-[10.5px] leading-none opacity-70">{u.config}</span>
            {pay && pay !== "paid" && (
              <span
                className={cn(
                  "absolute right-2 top-2 size-1.5 rounded-full",
                  pay === "overdue" ? "bg-[var(--color-critical)]" : "bg-[var(--color-warning)]",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function UnitLegend({ className }: { className?: string }) {
  const items = [
    { label: "Occupied", dot: "bg-[var(--color-ink)]/80" },
    { label: "Vacant", dot: "bg-[var(--color-warning)]/70" },
    { label: "Maintenance", dot: "bg-[var(--color-accent)]/75" },
  ];
  return (
    <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-[var(--color-ink-soft)]", className)}>
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full", i.dot)} />
          {i.label}
        </span>
      ))}
    </div>
  );
}
