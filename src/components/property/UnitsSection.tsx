import { Link } from "react-router-dom";
import { DoorOpen, Plus, Wrench } from "lucide-react";
import type { Tenant, Unit } from "../../data/types";
import { currency, paymentLabel, paymentTone } from "../../utils/format";
import { Surface } from "../ui/Surface";
import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";
import { StatusBadge } from "../ui/StatusBadge";
import { EmptyState } from "../ui/EmptyState";
import { cn } from "../../utils/cn";

const cols = "md:grid-cols-[92px_minmax(0,1fr)_112px_120px]";

function UnitId({ unit }: { unit: Unit }) {
  return (
    <div className="order-1 md:order-none">
      <div className="tabular text-[15px] font-semibold leading-tight tracking-[-0.01em] text-[var(--color-ink)]">
        {unit.number}
      </div>
      <div className="mt-0.5 text-[12px] text-[var(--color-ink-faint)]">{unit.config}</div>
    </div>
  );
}

function OccupiedRow({ unit, tenant }: { unit: Unit; tenant?: Tenant }) {
  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-5 py-4 sm:px-6", cols)}>
      <UnitId unit={unit} />
      <div className="order-3 min-w-0 md:order-none">
        {tenant ? (
          <Link
            to={`/tenants/${tenant.id}`}
            className="truncate text-[14px] font-medium tracking-[-0.01em] text-[var(--color-ink)] underline-offset-4 hover:underline"
          >
            {tenant.name}
          </Link>
        ) : (
          <span className="text-[14px] text-[var(--color-ink-soft)]">Tenant details missing</span>
        )}
        {tenant && <div className="mt-0.5 text-[12px] text-[var(--color-ink-faint)]">Since {tenant.since}</div>}
      </div>
      <div className="tabular order-4 text-right text-[14.5px] font-semibold text-[var(--color-ink)] md:order-none">
        {currency(tenant ? tenant.rent : unit.rent)}
        <span className="text-[11.5px] font-normal text-[var(--color-ink-faint)]"> /mo</span>
      </div>
      <div className="order-2 flex justify-end md:order-none">
        {tenant && (
          <StatusBadge tone={paymentTone(tenant.state)} dot>
            {paymentLabel(tenant.state)}
          </StatusBadge>
        )}
      </div>
    </div>
  );
}

function VacantRow({ unit, onRent }: { unit: Unit; onRent: () => void }) {
  const days = unit.vacantDays ?? 0;
  const lost = Math.round((unit.rent / 30) * days);
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 bg-[var(--color-warning-wash)]/45 px-5 py-4 sm:px-6",
        cols,
      )}
    >
      <UnitId unit={unit} />
      <div className="order-2 flex justify-end md:hidden">
        <StatusBadge tone="warning" dot>
          Vacant
        </StatusBadge>
      </div>
      <div className="order-3 col-span-2 min-w-0 md:order-none md:col-span-2">
        <div className="text-[14px] font-medium text-[var(--color-warning)]">
          {days === 0 ? "Vacant · just listed" : `Vacant for ${days} ${days === 1 ? "day" : "days"}`}
        </div>
        <div className="mt-0.5 text-[12.5px] text-[var(--color-ink-soft)]">
          <span className="tabular font-medium text-[var(--color-ink)]">{currency(unit.rent)}</span> potential monthly rent
          {lost > 0 && (
            <>
              {" "}
              · <span className="tabular">≈ {currency(lost)}</span> not earned so far
            </>
          )}
        </div>
      </div>
      <div className="order-4 col-span-2 md:order-none md:col-span-1 md:justify-self-end">
        <Button variant="secondary" size="sm" onClick={onRent} icon={<DoorOpen />} className="w-full md:w-auto">
          Mark as rented
        </Button>
      </div>
    </div>
  );
}

function MaintenanceRow({ unit, onResolve }: { unit: Unit; onResolve: () => void }) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 bg-[var(--color-accent-wash)]/55 px-5 py-4 sm:px-6",
        cols,
      )}
    >
      <UnitId unit={unit} />
      <div className="order-2 flex justify-end md:hidden">
        <StatusBadge tone="accent" dot>
          Maintenance
        </StatusBadge>
      </div>
      <div className="order-3 col-span-2 min-w-0 md:order-none md:col-span-2">
        <div className="flex items-center gap-2 text-[14px] font-medium text-[var(--color-accent)]">
          <Wrench className="size-3.5 stroke-[1.8]" />
          Under maintenance
        </div>
        <div className="mt-0.5 text-[12.5px] text-[var(--color-ink-soft)]">
          {unit.maintenanceNote ?? "Repair work in progress"} · <span className="tabular">{currency(unit.rent)}</span> rent on hold
        </div>
      </div>
      <div className="order-4 col-span-2 md:order-none md:col-span-1 md:justify-self-end">
        <Button variant="secondary" size="sm" onClick={onResolve} className="w-full md:w-auto">
          Mark resolved
        </Button>
      </div>
    </div>
  );
}

interface Props {
  units: Unit[];
  tenants: Tenant[];
  onAddUnit: () => void;
  onMarkRented: (unitId: string) => void;
  onResolve: (unitId: string) => void;
}

export function UnitsSection({ units, tenants, onAddUnit, onMarkRented, onResolve }: Props) {
  const byId = new Map(tenants.map((t) => [t.id, t]));

  return (
    <Surface elevated className="overflow-hidden">
      <div className="flex items-center justify-between px-5 pb-3 pt-5 sm:px-6">
        <SectionHeader title="Units" count={units.length} />
        <Button variant="ghost" size="sm" icon={<Plus />} onClick={onAddUnit}>
          Add unit
        </Button>
      </div>

      {units.length === 0 ? (
        <EmptyState
          title="No units yet"
          description="Add the first unit to start tracking tenants and rent for this property."
          action={
            <Button size="sm" icon={<Plus />} onClick={onAddUnit}>
              Add unit
            </Button>
          }
        />
      ) : (
        <>
          <div
            className={cn(
              "hidden grid-cols-[92px_minmax(0,1fr)_112px_120px] gap-x-4 border-y border-[var(--color-line)] bg-[var(--color-surface-muted)] px-6 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-faint)] md:grid",
            )}
          >
            <span>Unit</span>
            <span>Tenant</span>
            <span className="text-right">Rent</span>
            <span className="text-right">Status</span>
          </div>
          <div className="divide-y divide-[var(--color-line)] border-t border-[var(--color-line)] md:border-t-0">
            {units.map((u) =>
              u.status === "vacant" ? (
                <VacantRow key={u.id} unit={u} onRent={() => onMarkRented(u.id)} />
              ) : u.status === "maintenance" ? (
                <MaintenanceRow key={u.id} unit={u} onResolve={() => onResolve(u.id)} />
              ) : (
                <OccupiedRow key={u.id} unit={u} tenant={u.tenantId ? byId.get(u.tenantId) : undefined} />
              ),
            )}
          </div>
        </>
      )}
    </Surface>
  );
}
