import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Mail, Phone, Users } from "lucide-react";
import { usePortfolio } from "../data/PortfolioContext";
import { unitLabel } from "../data/selectors";
import { currency, paymentLabel, paymentTone } from "../utils/format";
import { UpdateRentModal } from "../components/property/UnitModals";
import { PageHeader } from "../components/ui/PageHeader";
import { Surface } from "../components/ui/Surface";
import { StatDisplay } from "../components/ui/StatDisplay";
import { StatusBadge } from "../components/ui/StatusBadge";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";

export default function TenantDetail() {
  const { tenantId } = useParams();
  const { tenants, payments, isLoading } = usePortfolio();
  const [editingRent, setEditingRent] = useState(false);
  const tenant = tenants.find((t) => t.id === tenantId);

  if (isLoading && !tenant) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-[14px] text-[var(--color-ink-faint)]">
        Loading tenant details...
      </div>
    );
  }

  if (!tenant) {
    return (
      <EmptyState
        className="pt-10"
        icon={<Users />}
        title="Tenant not found"
        description="This tenant may have moved out, or the link is out of date."
        action={
          <Link to="/tenants">
            <Button variant="secondary" size="sm" icon={<ChevronLeft />}>
              Back to tenants
            </Button>
          </Link>
        }
      />
    );
  }

  const history = payments.filter((p) => p.tenantId === tenant.id);
  const today = new Date();
  const monthName = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const currentBillingMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
  const currentPayment = history.find((p) => p.billingMonth === currentBillingMonth);
  const currentStatus = currentPayment?.state === "paid" ? "paid" : "due";

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <nav className="flex items-center gap-1.5 text-[13px] text-[var(--color-ink-faint)]">
          <Link to="/tenants" className="-ml-1 inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:text-[var(--color-ink)]">
            <ChevronLeft className="size-4 stroke-[1.7]" />
            Tenants
          </Link>
          <span>/</span>
          <span className="text-[var(--color-ink-soft)]">{tenant.name}</span>
        </nav>
        <PageHeader
          eyebrow={`Tenant since ${tenant.since}`}
          title={tenant.name}
          description={
            <span>
              <Link to={`/properties/${tenant.propertyId}`} className="underline-offset-4 hover:text-[var(--color-ink)] hover:underline">
                {tenant.property}
              </Link>{" "}
              · {unitLabel(tenant.unit)}
            </span>
          }
          actions={
            <button
              onClick={() => setEditingRent(true)}
              className="cursor-pointer transition-opacity hover:opacity-80"
            >
              <StatusBadge tone={paymentTone(currentStatus)} dot>
                Rent {paymentLabel(currentStatus).toLowerCase()}
              </StatusBadge>
            </button>
          }
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Surface elevated className="p-6 sm:p-7 space-y-6">
          <StatDisplay size="lg" label="Monthly rent" value={currency(tenant.rent)} hint={`${unitLabel(tenant.unit)} · ${tenant.property}`} />
          <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-muted)] p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">
                  {monthName}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-semibold text-[var(--color-ink)]">{currency(tenant.rent)}</span>
                  <StatusBadge tone={paymentTone(currentStatus)} dot>{paymentLabel(currentStatus)}</StatusBadge>
                </div>
                {currentPayment?.state === "paid" && currentPayment?.date && (
                  <div className="text-[13px] text-[var(--color-ink-soft)] mt-1">
                    Paid on {new Date(currentPayment.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                )}
              </div>
              <Button size="sm" variant="ghost" onClick={() => setEditingRent(true)}>
                Edit Status
              </Button>
            </div>
          </div>
        </Surface>
        <Surface elevated className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <Avatar name={tenant.name} size="lg" />
            <div className="text-[15px] font-semibold text-[var(--color-ink)]">{tenant.name}</div>
          </div>
          <div className="space-y-2.5 text-[13.5px] text-[var(--color-ink-soft)]">
            <div className="flex items-center gap-2.5">
              <Phone className="size-4 stroke-[1.6] text-[var(--color-ink-faint)]" />
              <span className="tabular">{tenant.phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="size-4 stroke-[1.6] text-[var(--color-ink-faint)]" />
              {tenant.email}
            </div>
          </div>
        </Surface>
      </div>

      <Surface elevated className="overflow-hidden">
        <div className="px-5 pt-5">
          <SectionHeader title="Payments" count={history.length} />
        </div>
        {history.length === 0 ? (
          <EmptyState className="py-10" title="No payments yet" description="Rent payments will be listed here." />
        ) : (
          <div className="mt-2 divide-y divide-[var(--color-line)]">
            {history.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <div className="tabular text-[14px] font-semibold text-[var(--color-ink)]">{currency(p.amount)}</div>
                  <div className="text-[12.5px] text-[var(--color-ink-soft)]">
                    {p.date} · {p.method}
                  </div>
                </div>
                <StatusBadge tone={paymentTone(p.state)} dot>
                  {paymentLabel(p.state)}
                </StatusBadge>
              </div>
            ))}
          </div>
        )}
      </Surface>

      <UpdateRentModal
        open={editingRent}
        onClose={() => setEditingRent(false)}
        tenant={tenant}
      />
    </div>
  );
}
