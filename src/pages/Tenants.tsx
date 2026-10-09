import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, SearchX, UserPlus, Users } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Surface } from "../components/ui/Surface";
import { Button } from "../components/ui/Button";
import { SearchField } from "../components/ui/SearchField";

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
    const filtered = tenants.filter((t) => !q || `${t.name} ${t.property} ${t.unit}`.toLowerCase().includes(q));
    
    return filtered.sort((a, b) => {
      if (a.status === b.status) return 0;
      return a.status === "active" ? -1 : 1;
    });
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

            {visible.map((t, i) => {
              const formattedDate = isNaN(new Date(t.since).getTime())
                ? t.since
                : new Date(t.since).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
              
              return (
              <div key={t.id}>
                {i > 0 && <Divider />}
                <div
                  onClick={() => navigate(`/tenants/${t.id}`)}
                  className="group block md:grid md:grid-cols-[1.6fr_1.4fr_0.8fr_1.4fr_auto] md:items-center gap-4 px-5 py-4 transition-all duration-200 cursor-pointer hover:bg-white/75 hover:backdrop-blur-sm"
                >
                  {/* MOBILE LAYOUT (hidden on md) */}
                  <div className="flex md:hidden items-center gap-4 w-full">
                    <div className="shrink-0"><Avatar name={t.name} size="md" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-medium tracking-[-0.01em] text-[var(--color-ink)]">{t.name}</div>
                      <div className="mt-0.5 truncate text-[12.5px] text-[var(--color-ink-soft)]">{t.property} · {t.unit}</div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      {t.status === "vacated" ? (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-red-700 ring-1 ring-inset ring-red-200">
                          Vacated
                        </span>
                      ) : (
                        <>
                          <div className="tabular text-[13px] font-semibold text-[var(--color-ink)]">{currency(t.rent)}</div>
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => { e.stopPropagation(); setEditingTenant(t); }}
                            className="cursor-pointer transition-opacity hover:opacity-80"
                          >
                            <StatusBadge tone={paymentTone(t.state)} dot>{paymentLabel(t.state)}</StatusBadge>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* DESKTOP LAYOUT (hidden on mobile, uses grid on md) */}
                  <div className="hidden md:flex items-center gap-3 min-w-0">
                    <div className="shrink-0"><Avatar name={t.name} size="md" /></div>
                    <span className="truncate text-[14px] font-medium tracking-[-0.01em] text-[var(--color-ink)]">{t.name}</span>
                  </div>
                  
                  <div className="hidden md:block min-w-0">
                    <div className="truncate text-[13.5px] font-medium text-[var(--color-ink)]">{t.property}</div>
                    <div className="mt-0.5 truncate text-[12.5px] text-[var(--color-ink-soft)]">{t.unit}</div>
                  </div>

                  <div className="hidden md:block whitespace-nowrap tabular text-[13px] text-[var(--color-ink-soft)]">
                    {formattedDate}
                  </div>

                  <div className="hidden md:flex flex-col items-end justify-center gap-1.5 pr-2">
                      {t.status === "vacated" ? (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-red-700 ring-1 ring-inset ring-red-200">
                          Vacated
                        </span>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">{monthName}</span>
                            <span className="tabular text-[13.5px] font-semibold text-[var(--color-ink)]">{currency(t.rent)}</span>
                          </div>
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => { e.stopPropagation(); setEditingTenant(t); }}
                            className="cursor-pointer transition-opacity hover:opacity-80"
                          >
                            <StatusBadge tone={paymentTone(t.state)} dot>{paymentLabel(t.state)}</StatusBadge>
                          </div>
                        </>
                      )}
                  </div>

                  <div className="hidden md:flex justify-end">
                    <ChevronRight className="size-4 stroke-[1.7] text-[var(--color-ink-faint)] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            );
          })}

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
