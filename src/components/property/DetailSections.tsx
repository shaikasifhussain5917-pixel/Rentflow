import { Link } from "react-router-dom";
import { CheckCircle2, Pencil, UserPlus } from "lucide-react";
import type { ReactNode } from "react";
import { activityGroup, type ActivityItem, type Property, type Tenant, type Unit } from "../../data/types";
import { formatPercent, plural, unitLabel, type PropertyMetrics } from "../../data/selectors";
import { currency, paymentLabel, paymentTone } from "../../utils/format";
import { Surface } from "../ui/Surface";
import { SectionHeader } from "../ui/SectionHeader";
import { StatDisplay } from "../ui/StatDisplay";
import { StateText } from "../ui/StateText";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { UnitBlocks, UnitLegend } from "./UnitStrip";

/* ------------------------------ Financial snapshot ------------------------------ */

export function FinancialSnapshot({ m }: { m: PropertyMetrics }) {
  const pct = m.expected > 0 ? Math.round((m.collected / m.expected) * 100) : 0;
  const cell = "bg-[var(--color-surface)] p-5 sm:p-6";

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-line)] shadow-[var(--shadow-soft)] sm:grid-cols-[1.35fr_1fr_1fr_1fr]">
      <div className={`${cell} col-span-2 sm:col-span-1`}>
        <StatDisplay
          size="lg"
          label="Monthly rent"
          value={currency(m.expected)}
          hint={m.expected > 0 ? `From ${plural(m.occupied, "occupied unit")}` : "No occupied units yet"}
        />
      </div>
      <div className={cell}>
        <StatDisplay
          label="Collected"
          value={currency(m.collected, { compact: m.collected >= 1e7 })}
          hint={m.expected > 0 ? `${pct}% of rent` : "—"}
        />
      </div>
      <div className={cell}>
        <StatDisplay
          label="Outstanding"
          tone={m.outstanding > 0 ? "critical" : "default"}
          value={currency(m.outstanding)}
          hint={
            m.outstanding === 0 ? (
              <span className="inline-flex items-center gap-1 text-[var(--color-positive)]">
                <CheckCircle2 className="size-3.5 stroke-[1.8]" /> All rent paid
              </span>
            ) : m.overdueCount > 0 ? (
              `${m.overdueCount} overdue`
            ) : (
              "Due this month"
            )
          }
        />
      </div>
      <div className={`${cell} col-span-2 sm:col-span-1`}>
        <StatDisplay
          label="Occupancy"
          value={formatPercent(Math.round(m.occupancy * 10) / 10).replace("%", "")}
          unit="%"
          hint={`${m.occupied} of ${plural(m.total, "unit")}`}
        />
      </div>

      {m.expected > 0 && (
        <div className="col-span-full flex items-center gap-4 bg-[var(--color-surface-muted)] px-5 py-3 sm:px-6">
          <span className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">Collection</span>
          <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-line)]">
            <div className="h-full bg-[var(--color-ink)]/80 transition-all duration-700" style={{ width: `${pct}%` }} />
            <div className="h-full bg-[var(--color-critical)]/55" style={{ width: `${100 - pct}%` }} />
          </div>
          <span className="tabular text-[12.5px] font-medium text-[var(--color-ink-soft)]">{pct}%</span>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- Occupancy ---------------------------------- */

export function OccupancySection({ units, tenants, m }: { units: Unit[]; tenants: Tenant[]; m: PropertyMetrics }) {
  return (
    <Surface elevated className="p-5 sm:p-7">
      {units.length === 0 ? (
        <EmptyState title="No units to show" description="Occupancy appears here once units are added." className="py-6" />
      ) : (
        <div className="grid gap-7 lg:grid-cols-[220px_1fr] lg:gap-12">
          <div>
            <StatDisplay
              label="Units"
              size="lg"
              value={m.total}
              hint={
                <span className="block space-y-0.5">
                  <span className="block">{m.occupied} occupied</span>
                  {m.vacant > 0 && <span className="block text-[var(--color-warning)]">{m.vacant} vacant</span>}
                  {m.maintenance > 0 && <span className="block text-[var(--color-accent)]">{m.maintenance} under maintenance</span>}
                </span>
              }
            />
            <div className="tabular mt-4 text-[13px] text-[var(--color-ink-soft)]">
              <span className="font-semibold text-[var(--color-ink)]">{formatPercent(Math.round(m.occupancy * 10) / 10)}</span> occupancy
            </div>
          </div>
          <div className="flex flex-col justify-between gap-5 lg:border-l lg:border-[var(--color-line)] lg:pl-12">
            <UnitBlocks units={units} tenants={tenants} />
            <UnitLegend />
          </div>
        </div>
      )}
    </Surface>
  );
}

/* ---------------------------------- Tenants ---------------------------------- */

export function TenantsSection({ tenants, onAdd }: { tenants: Tenant[]; onAdd: () => void }) {
  return (
    <Surface elevated className="overflow-hidden">
      <div className="px-5 pt-5">
        <SectionHeader title="Current tenants" count={tenants.length} />
      </div>
      {tenants.length === 0 ? (
        <EmptyState
          className="py-10"
          title="No tenants yet"
          description="Tenants appear here once a unit is rented."
          action={
            <Button size="sm" variant="secondary" icon={<UserPlus />} onClick={onAdd}>
              Add tenant
            </Button>
          }
        />
      ) : (
        <div className="mt-2 divide-y divide-[var(--color-line)] pb-1">
          {tenants.map((t) => (
            <Link
              key={t.id}
              to={`/tenants/${t.id}`}
              className="group flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-[var(--color-surface-muted)]"
            >
              <Avatar name={t.name} size="md" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-medium tracking-[-0.01em] text-[var(--color-ink)]">{t.name}</div>
                <div className="text-[12px] text-[var(--color-ink-faint)]">{unitLabel(t.unit)}</div>
              </div>
              <div className="text-right">
                <div className="tabular text-[13px] font-semibold text-[var(--color-ink)]">{currency(t.rent)}</div>
                <StateText tone={paymentTone(t.state)} className="text-[11.5px]">
                  {paymentLabel(t.state)}
                </StateText>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Surface>
  );
}

/* ---------------------------------- Activity ---------------------------------- */

export function PropertyActivityFeed({ items }: { items: ActivityItem[] }) {
  const groups: { label: string; items: ActivityItem[] }[] = [];
  for (const a of items) {
    const label = activityGroup(a.daysAgo);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(a);
    else groups.push({ label, items: [a] });
  }

  return (
    <Surface elevated>
      <div className="px-5 pt-5">
        <SectionHeader title="Activity" />
      </div>
      {items.length === 0 ? (
        <EmptyState className="py-10" title="Nothing yet" description="Rent, lease and maintenance events will be recorded here." />
      ) : (
        <div className="mt-4 space-y-6 px-5 pb-6">
          {groups.slice(0, 6).map((g) => (
            <div key={g.label}>
              <div className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
                {g.label}
              </div>
              <ol className="relative space-y-4 before:absolute before:bottom-1 before:left-[5px] before:top-1.5 before:w-px before:bg-[var(--color-line)]">
                {g.items.map((a) => (
                  <li key={a.id} className="relative pl-6">
                    <span className="absolute left-0 top-1.5 size-[11px] rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-accent-soft)] ring-1 ring-[var(--color-line)]" />
                    <div className="text-[13.5px] font-medium text-[var(--color-ink)]">{a.title}</div>
                    <div className="text-[12.5px] text-[var(--color-ink-soft)]">{a.detail}</div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </Surface>
  );
}

/* ---------------------------------- Info ---------------------------------- */

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[104px_1fr] gap-4 py-3">
      <dt className="pt-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">{label}</dt>
      <dd className="text-[13.5px] leading-relaxed text-[var(--color-ink)]">{children}</dd>
    </div>
  );
}

export function PropertyInfo({
  property,
  m,
  onEdit,
}: {
  property: Property;
  m: PropertyMetrics;
  onEdit: () => void;
}) {
  const held = property.depositPerUnit * m.occupied;
  return (
    <Surface elevated className="px-5 pb-3 pt-5">
      <SectionHeader
        title="Property information"
        action={
          <Button variant="ghost" size="sm" icon={<Pencil />} onClick={onEdit} className="-mr-2">
            Edit
          </Button>
        }
      />
      <dl className="mt-2 divide-y divide-[var(--color-line)]">
        <InfoRow label="Address">
          {property.address}
          <br />
          <span className="text-[var(--color-ink-soft)]">
            {property.locality}, {property.city}
          </span>
        </InfoRow>
        <InfoRow label="Type">{property.type}</InfoRow>
        <InfoRow label="Units">{plural(m.total, "unit")}</InfoRow>
        <InfoRow label="Deposits">
          <span className="tabular">{currency(property.depositPerUnit)}</span>{" "}
          <span className="text-[var(--color-ink-soft)]">per unit</span>
          {held > 0 && (
            <div className="tabular mt-0.5 text-[12.5px] text-[var(--color-ink-soft)]">{currency(held)} held</div>
          )}
        </InfoRow>
        <InfoRow label="Notes">
          {property.notes ? (
            <span className="text-[var(--color-ink-soft)]">{property.notes}</span>
          ) : (
            <span className="text-[var(--color-ink-faint)]">No notes added</span>
          )}
        </InfoRow>
      </dl>
    </Surface>
  );
}
