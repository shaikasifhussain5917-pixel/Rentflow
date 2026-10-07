import { useMemo, useState } from "react";
import { Download, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { Surface } from "../components/ui/Surface";
import { Button } from "../components/ui/Button";
import { StatDisplay } from "../components/ui/StatDisplay";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Divider } from "../components/ui/Divider";
import { SearchField } from "../components/ui/SearchField";
import { Segmented } from "../components/ui/Segmented";
import { usePortfolio } from "../data/PortfolioContext";
import { portfolioTotals, plural } from "../data/selectors";
import { currency, paymentLabel, paymentTone } from "../utils/format";
import type { PaymentState } from "../data/types";

export default function Payments() {
  const { payments, properties, units, tenants, isLoading } = usePortfolio();
  
  const [query, setQuery] = useState("");
  const [filterState, setFilterState] = useState<PaymentState | "all">("all");
  const [monthFilter, setMonthFilter] = useState("all");

  const totals = portfolioTotals(properties, units, tenants);
  
  const months = useMemo(() => {
    const m = new Set(payments.map(p => p.billingMonth));
    return Array.from(m).sort().reverse();
  }, [payments]);

  const visiblePayments = useMemo(() => {
    const q = query.trim().toLowerCase();
    return payments.filter((p) => {
      const matchQuery = !q || p.tenant.toLowerCase().includes(q) || p.property.toLowerCase().includes(q);
      const matchState = filterState === "all" || p.state === filterState;
      const matchMonth = monthFilter === "all" || p.billingMonth === monthFilter;
      return matchQuery && matchState && matchMonth;
    });
  }, [payments, query, filterState, monthFilter]);

  const pending = visiblePayments.filter((p) => p.state !== "paid");

  const handleExport = () => {
    const headers = ["Tenant", "Property", "Unit", "Amount", "Method", "Status", "Date", "Billing Month"];
    const csv = [
      headers.join(","),
      ...visiblePayments.map(p => 
        `"${p.tenant}","${p.property}","${p.unit}",${p.amount},"${p.method}","${p.state}","${p.date}","${p.billingMonth}"`
      )
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Finance"
        title="Payments"
        description="Track incoming rent, outstanding balances, and payment methods."
        actions={
          <Button variant="secondary" size="sm" icon={<Download />} onClick={handleExport}>
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <Surface elevated className="relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1">
          <div className="pointer-events-none absolute -right-6 -bottom-6 size-24 rounded-full bg-emerald-500/10 blur-2xl" />
          <StatDisplay label="Collected" value={currency(totals.collected, { compact: true })} />
        </Surface>
        <Surface elevated className="relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1">
          <div className="pointer-events-none absolute -right-6 -bottom-6 size-24 rounded-full bg-rose-500/10 blur-2xl" />
          <StatDisplay
            label="Outstanding"
            value={currency(totals.outstanding, { compact: true })}
            tone={totals.outstanding > 0 ? "critical" : "default"}
            hint={
              pending.length > 0 ? (
                <span className="font-medium text-[var(--color-warning)]">{plural(pending.length, "tenant")} pending</span>
              ) : (
                "All rent received"
              )
            }
          />
        </Surface>
        <Surface elevated className="relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1">
          <div className="pointer-events-none absolute -right-6 -bottom-6 size-24 rounded-full bg-blue-500/10 blur-2xl" />
          <StatDisplay label="Expected" value={currency(totals.expected, { compact: true })} />
        </Surface>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchField
            containerClassName="w-full sm:w-72"
            placeholder="Search tenant or property"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:overflow-visible sm:px-0">
            <Segmented<PaymentState | "all">
              label="Filter by state"
              value={filterState}
              onChange={setFilterState}
              options={[
                { value: "all", label: "All" },
                { value: "due", label: "Due" },
                { value: "paid", label: "Paid" },
                { value: "overdue", label: "Overdue" },
              ]}
            />
          </div>
          <div className="flex items-center gap-2 rounded-[12px] border border-white/70 bg-white/60 px-3 py-1.5 backdrop-blur-md shadow-sm text-sm text-[var(--color-ink-soft)]">
            <Filter className="size-3.5 text-[var(--color-ink-faint)]" />
            <select
              className="bg-transparent text-[13px] font-medium text-[var(--color-ink)] outline-none cursor-pointer"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <option value="all">All months</option>
              {months.map((m) => (
                <option key={m} value={m}>{new Date(m).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Surface elevated className="overflow-hidden">
        <div className="hidden grid-cols-[1.4fr_1.4fr_1fr_0.8fr_auto] gap-4 border-b border-[var(--color-line)] bg-[var(--color-surface-muted)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-faint)] sm:grid">
          <span>Tenant</span>
          <span>Property</span>
          <span>Method</span>
          <span className="text-right">Amount</span>
          <span className="w-24 text-right">Status</span>
        </div>

        {isLoading && payments.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center text-[14px] text-[var(--color-ink-faint)]">
            Loading payments...
          </div>
        ) : visiblePayments.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-ink-faint)]">
            {payments.length === 0 ? "No payments recorded yet." : "No payments match your filters."}
          </div>
        ) : (
          visiblePayments.map((p, i) => (
            <div key={p.id}>
              {i > 0 && <Divider />}
              <div className="grid grid-cols-2 items-center gap-4 px-5 py-4 sm:grid-cols-[1.4fr_1.4fr_1fr_0.8fr_auto]">
                <div className="min-w-0">
                  <Link
                    to={`/tenants/${p.tenantId}`}
                    className="truncate text-[14px] font-medium text-[var(--color-ink)] underline-offset-4 hover:underline"
                  >
                    {p.tenant}
                  </Link>
                  <div className="tabular text-[12px] text-[var(--color-ink-faint)] sm:hidden">
                    {p.property} · {p.unit} · {p.date}
                  </div>
                </div>
                <span className="hidden truncate text-[13px] text-[var(--color-ink-soft)] sm:block">
                  <Link to={`/properties/${p.propertyId}`} className="underline-offset-4 hover:text-[var(--color-ink)] hover:underline">
                    {p.property}
                  </Link>{" "}
                  · {p.unit}
                </span>
                <span className="hidden text-[13px] text-[var(--color-ink-soft)] sm:block">{p.method}</span>
                <span className="tabular text-right text-[14px] font-semibold text-[var(--color-ink)]">
                  {currency(p.amount)}
                </span>
                <span className="col-span-2 flex w-full justify-end sm:col-span-1 sm:w-24">
                  <StatusBadge tone={paymentTone(p.state)} dot>
                    {paymentLabel(p.state)}
                  </StatusBadge>
                </span>
              </div>
            </div>
          ))
        )}
      </Surface>
    </div>
  );
}
