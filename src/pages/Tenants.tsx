import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, SearchX, UserPlus, Users } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Surface } from "../components/ui/Surface";
import { Button } from "../components/ui/Button";
import { SearchField } from "../components/ui/SearchField";
import { DataRow } from "../components/ui/DataRow";
import { Avatar } from "../components/ui/Avatar";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Divider } from "../components/ui/Divider";
import { EmptyState } from "../components/ui/EmptyState";
import { usePortfolio } from "../data/PortfolioContext";
import { plural } from "../data/selectors";
import { currency, paymentLabel, paymentTone } from "../utils/format";
import { UpdateRentModal } from "../components/property/UnitModals";
import type { Tenant } from "../data/types";

export default function Tenants() {
  const { tenants, isLoading } = usePortfolio();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  const monthName = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tenants.filter((t) => !q || `${t.name} ${t.property} ${t.unit}`.toLowerCase().includes(q));
  }, [tenants, query]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="People"
        title="Tenants"
        description={`${plural(tenants.length, "tenant")} across your portfolio`}
        actions={
          <Button size="sm" icon={<UserPlus />} onClick={() => navigate("/properties")}>
            Add tenant
          </Button>
        }
      />

      <div className="w-full max-w-xs">
        <SearchField placeholder="Search tenants" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <Surface elevated className="overflow-hidden">
        {isLoading && tenants.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center text-[14px] text-[var(--color-ink-faint)]">
            Loading tenants...
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={query ? <SearchX /> : <Users />}
            title={query ? "No tenants found" : "No tenants yet"}
            description={query ? "Try a different name, property or unit." : "Tenants appear once a unit is rented."}
          />
        ) : (
          <>
            <div className="hidden grid-cols-[1.6fr_1.4fr_0.8fr_1.4fr_auto] gap-4 border-b border-[var(--color-line)] bg-[var(--color-surface-muted)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-faint)] md:grid">
              <span>Tenant</span>
              <span>Property</span>
              <span>Since</span>
              <span className="text-right">Current Month Rent</span>
              <span></span>
            </div>

            {visible.map((t, i) => (
              <div key={t.id}>
                {i > 0 && <Divider />}
                <DataRow
                  onClick={() => navigate(`/tenants/${t.id}`)}
                  leading={<Avatar name={t.name} size="md" />}
                  title={t.name}
                  subtitle={
                    <span className="md:hidden">
                      {t.property} · {t.unit}
                    </span>
                  }
                  meta={
                    <div className="grid grid-cols-[1.4fr_0.8fr_1.4fr] items-center gap-4">
                      <span className="truncate text-[13px] text-[var(--color-ink-soft)]">
                        {t.property} · {t.unit}
                      </span>
                      <span className="tabular text-[13px] text-[var(--color-ink-soft)]">{t.since}</span>
                      <div className="flex flex-col items-end justify-center gap-0.5">
                        <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">{monthName}</span>
                        <div className="flex items-center gap-2">
                          <span className="tabular text-[13px] font-semibold text-[var(--color-ink)]">
                            {currency(t.rent)}
                          </span>
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTenant(t);
                            }}
                            className="cursor-pointer transition-opacity hover:opacity-80"
                          >
                            <StatusBadge tone={paymentTone(t.state)} dot>
                              {paymentLabel(t.state)}
                            </StatusBadge>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  trailing={
                    <span className="flex flex-col items-end justify-center gap-2 md:flex-row md:items-center md:gap-3">
                      <div className="md:hidden flex flex-col items-end gap-1">
                        <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">{monthName}</span>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTenant(t);
                          }}
                          className="cursor-pointer transition-opacity hover:opacity-80"
                        >
                          <StatusBadge tone={paymentTone(t.state)} dot>
                            {paymentLabel(t.state)}
                          </StatusBadge>
                        </div>
                      </div>
                      <ChevronRight className="size-4 stroke-[1.7] text-[var(--color-ink-faint)] transition-transform group-hover:translate-x-0.5" />
                    </span>
                  }
                />
              </div>
            ))}
          </>
        )}
      </Surface>

      <UpdateRentModal
        open={!!editingTenant}
        onClose={() => setEditingTenant(null)}
        tenant={editingTenant}
      />
    </div>
  );
}
