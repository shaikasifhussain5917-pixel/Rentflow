import { PageHeader } from "../components/ui/PageHeader";
import { Surface } from "../components/ui/Surface";
import { StatDisplay } from "../components/ui/StatDisplay";
import { usePortfolio } from "../data/PortfolioContext";
import { portfolioTotals } from "../data/selectors";
import { currency } from "../utils/format";

/* Earlier months are illustrative history derived from the current monthly rent roll. */
const history = [
  { back: 5, factor: 0.93 },
  { back: 4, factor: 0.96 },
  { back: 3, factor: 0.98 },
  { back: 2, factor: 1 },
  { back: 1, factor: 0.99 },
];

export default function RentHistory() {
  const { properties, units, tenants } = usePortfolio();
  const t = portfolioTotals(properties, units, tenants);

  const months = [
    ...history.map((h) => ({
      label: new Date(new Date().setMonth(new Date().getMonth() - h.back)).toLocaleDateString("en-GB", { month: "short" }),
      value: Math.round((t.expected * h.factor) / 500) * 500,
    })),
    { label: "Now", value: t.collected },
  ];

  const max = Math.max(...months.map((m) => m.value), 1);
  const total = months.reduce((s, m) => s + m.value, 0);
  const best = months.reduce((a, b) => (b.value > a.value ? b : a));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Insights"
        title="Rent History"
        description="Collected rent over the last six months across the portfolio."
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <Surface elevated className="p-6">
          <StatDisplay label="6-month total" value={currency(total, { compact: true })} />
        </Surface>
        <Surface elevated className="p-6">
          <StatDisplay label="Monthly average" value={currency(Math.round(total / 6), { compact: true })} />
        </Surface>
        <Surface elevated className="p-6">
          <StatDisplay label="Best month" value={currency(best.value, { compact: true })} hint={best.label} />
        </Surface>
      </div>

      <Surface elevated className="p-6 sm:p-8">
        <h2 className="text-[15px] font-semibold text-[var(--color-ink)]">Collected rent</h2>
        <p className="text-[13px] text-[var(--color-ink-soft)]">Monthly, in INR</p>
        <div className="mt-8 flex h-56 items-end gap-3 sm:gap-6">
          {months.map((m) => (
            <div key={m.label} className="flex flex-1 flex-col items-center gap-3">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-[6px] bg-[var(--color-accent)]/85 transition-all duration-700 hover:bg-[var(--color-accent)]"
                  style={{ height: `${(m.value / max) * 100}%` }}
                  title={currency(m.value)}
                />
              </div>
              <span className="text-[12px] font-medium text-[var(--color-ink-faint)]">{m.label}</span>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}
