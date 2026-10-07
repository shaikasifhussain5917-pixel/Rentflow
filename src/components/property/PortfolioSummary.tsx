import { cn } from "../../utils/cn";
import { Surface } from "../ui/Surface";
import { formatPercent } from "../../data/selectors";

interface Totals {
  properties: number;
  units: number;
  occupied: number;
  vacant: number;
  maintenance: number;
  occupancy: number;
}

function Figure({
  label,
  value,
  tone,
  dot,
}: {
  label: string;
  value: number;
  tone?: string;
  dot?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        {dot && <span className={cn("size-2 rounded-full", dot)} />}
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">{label}</span>
      </div>
      <div className={cn("tabular mt-2 text-[1.85rem] font-semibold leading-none", tone ?? "text-[var(--color-ink)]")}>
        {value}
      </div>
    </div>
  );
}

/** Composed portfolio summary — one surface, hierarchy through type and a single unit-mix bar. */
export function PortfolioSummary({ totals }: { totals: Totals }) {
  const { units, occupied, vacant, maintenance } = totals;
  const parts = [
    { key: "occ", n: occupied, cls: "bg-gradient-to-r from-emerald-600 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.25)]" },
    { key: "vac", n: vacant, cls: "bg-gradient-to-r from-amber-500 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.25)]" },
    { key: "mnt", n: maintenance, cls: "bg-gradient-to-r from-[var(--color-accent)] to-[#b47a5e] shadow-[0_0_8px_rgba(154,91,63,0.25)]" },
  ].filter((p) => p.n > 0);

  return (
    <Surface elevated className="relative overflow-hidden p-5 sm:p-7 bg-gradient-to-br from-white/95 via-white/85 to-[#fdf8f5]/75">
      <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />
      <div className="relative z-10 grid gap-7 lg:grid-cols-[auto_1fr] lg:gap-14">
        {/* anchor figures */}
        <div className="flex items-end gap-7 sm:gap-10">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
              Total properties
            </span>
            <div className="tabular mt-2 text-[3rem] font-semibold leading-none tracking-[-0.03em] text-[var(--color-ink)]">
              {totals.properties}
            </div>
          </div>
          <div className="h-12 w-px bg-[var(--color-line)]" />
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
              Total units
            </span>
            <div className="tabular mt-2 text-[3rem] font-semibold leading-none tracking-[-0.03em] text-[var(--color-ink)]">
              {units}
            </div>
          </div>
        </div>

        {/* unit mix */}
        <div className="flex flex-col justify-end border-t border-[var(--color-line)] pt-6 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
          <div className="grid grid-cols-3 gap-4">
            <Figure label="Occupied" value={occupied} dot="bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
            <Figure
              label="Vacant"
              value={vacant}
              dot="bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]"
              tone={vacant > 0 ? "text-[var(--color-warning)]" : undefined}
            />
            <Figure
              label="Maintenance"
              value={maintenance}
              dot="bg-[var(--color-accent)] shadow-[0_0_6px_rgba(154,91,63,0.7)]"
              tone={maintenance > 0 ? "text-[var(--color-accent)]" : undefined}
            />
          </div>
          <div className="mt-5 flex h-2.5 w-full gap-[4px] overflow-hidden rounded-full bg-black/5 p-0.5 backdrop-blur-sm" aria-label="Unit mix">
            {parts.length === 0 ? (
              <span className="h-full w-full rounded-full border border-dashed border-[var(--color-line-strong)]" />
            ) : (
              parts.map((p) => (
                <span key={p.key} className={cn("h-full rounded-full transition-all duration-500", p.cls)} style={{ flexGrow: p.n, flexBasis: 0 }} />
              ))
            )}
          </div>
          <div className="mt-2.5 text-[12.5px] text-[var(--color-ink-soft)]">
            <span className="tabular font-medium text-[var(--color-ink)]">{formatPercent(Math.round(totals.occupancy * 10) / 10)}</span>{" "}
            of units occupied
          </div>
        </div>
      </div>
    </Surface>
  );
}
