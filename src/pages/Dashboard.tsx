import { ArrowUpRight, Plus, TrendingUp } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Surface } from "../components/ui/Surface";
import { StatDisplay } from "../components/ui/StatDisplay";
import { Button } from "../components/ui/Button";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Divider } from "../components/ui/Divider";
import { Avatar } from "../components/ui/Avatar";
import { Link } from "react-router-dom";
import { usePortfolio } from "../data/PortfolioContext";
import { portfolioTotals, unitLabel } from "../data/selectors";
import { currency, paymentLabel, paymentTone } from "../utils/format";
import { useAuth } from "../contexts/AuthContext";
import { useLocalTime } from "../hooks/useLocalTime";

const stateOrder = { overdue: 0, due: 1, paid: 2 } as const;

export default function Dashboard() {
  const { profile } = useAuth();
  const userName = profile?.full_name || "Portfolio Owner";
  const { properties, units, tenants: allTenants, activity: allActivity } = usePortfolio();
  const totals = portfolioTotals(properties, units, allTenants);
  const portfolioStats = {
    collected: totals.collected,
    monthlyIncome: totals.expected,
    properties: totals.properties,
    units: totals.units,
    occupancy: Math.round(totals.occupancy),
    vacant: totals.vacant,
  };
  const tenants = [...allTenants].sort((a, b) => stateOrder[a.state] - stateOrder[b.state]);
  const activity = allActivity.slice(0, 5);
  const { greeting, monthYear } = useLocalTime();
  const collectedPct = portfolioStats.monthlyIncome && portfolioStats.monthlyIncome > 0
    ? Math.round((portfolioStats.collected / portfolioStats.monthlyIncome) * 100)
    : 0;

  return (
    <div className="space-y-6 sm:space-y-10 pb-20 sm:pb-0">
      <PageHeader
        eyebrow="Portfolio overview"
        title={`${greeting}, ${userName}`}
        description={`A calm summary of your properties, collections, and activity for ${monthYear}.`}
        actions={
          <>
            <Button variant="secondary" size="sm" icon={<TrendingUp />} onClick={() => window.location.hash = '#/activity'}>
              Reports
            </Button>
            <Button size="sm" icon={<Plus />} onClick={() => window.location.hash = '#/properties'}>
              Add property
            </Button>
          </>
        }
      />

      {/* Asymmetric summary — one hero panel + supporting metrics */}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Surface elevated className="relative flex flex-col justify-between overflow-hidden p-5 sm:p-7 bg-gradient-to-br from-white/95 via-white/80 to-[#fdf7f3]/80">
          <div className="pointer-events-none absolute -right-12 -top-12 size-32 sm:size-48 rounded-full bg-[var(--color-accent)]/12 blur-2xl sm:blur-3xl" />
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
            <StatDisplay
              size="lg"
              label="Collected this month"
              value={currency(portfolioStats.collected)}
              hint={
                <span className="inline-flex items-center gap-1.5 font-medium text-[var(--color-positive)]">
                  <TrendingUp className="size-3.5 stroke-[2]" />
                  {collectedPct}% of {currency(portfolioStats.monthlyIncome)} expected
                </span>
              }
            />
            <StatusBadge tone="positive" dot>
              On track
            </StatusBadge>
          </div>

          <div className="relative z-10 mt-6 sm:mt-8">
            <div className="mb-2 flex items-center justify-between text-[12.5px] text-[var(--color-ink-soft)]">
              <span>Collection progress</span>
              <span className="tabular font-semibold text-[var(--color-ink)]">{collectedPct}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/5 p-0.5 backdrop-blur-sm">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[#b87352] to-[#df9e7d] shadow-[0_0_12px_rgba(154,91,63,0.35)] transition-all duration-700"
                style={{ width: `${collectedPct}%` }}
              />
            </div>
          </div>
        </Surface>

        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          <Surface elevated className="relative overflow-hidden p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="pointer-events-none absolute -right-6 -bottom-6 size-16 sm:size-24 rounded-full bg-blue-500/8 blur-xl sm:blur-2xl" />
            <StatDisplay label="Properties" value={portfolioStats.properties} unit="active" />
          </Surface>
          <Surface elevated className="relative overflow-hidden p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="pointer-events-none absolute -right-6 -bottom-6 size-16 sm:size-24 rounded-full bg-indigo-500/8 blur-xl sm:blur-2xl" />
            <StatDisplay label="Total units" value={portfolioStats.units} />
          </Surface>
          <Surface elevated className="relative overflow-hidden p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="pointer-events-none absolute -right-6 -bottom-6 size-16 sm:size-24 rounded-full bg-emerald-500/10 blur-xl sm:blur-2xl" />
            <StatDisplay label="Occupancy" value={portfolioStats.occupancy} unit="%" />
          </Surface>
          <Surface elevated className="relative overflow-hidden p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="pointer-events-none absolute -right-6 -bottom-6 size-16 sm:size-24 rounded-full bg-amber-500/10 blur-xl sm:blur-2xl" />
            <StatDisplay
              label="Vacant"
              value={portfolioStats.vacant}
              hint={<span className="font-medium text-[var(--color-warning)] mt-0.5 block">Needs attention</span>}
            />
          </Surface>
        </div>
      </div>

      {/* Two-column secondary — recent tenants + activity */}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        <Surface elevated>
          <div className="px-4 pt-4 sm:px-5 sm:pt-5">
            <SectionHeader
              title="Rent status"
              count={tenants.length}
              action={
                <Button variant="ghost" size="sm" iconRight={<ArrowUpRight />} onClick={() => window.location.hash = '#/tenants'}>
                  All
                </Button>
              }
            />
          </div>
          <div className="mt-2">
            {tenants.slice(0, 4).map((t, i) => (
              <div key={t.id}>
                {i > 0 && <Divider className="mx-4 sm:mx-5" />}
                <div className="flex items-center gap-3 px-4 py-3 sm:gap-3.5 sm:px-5 sm:py-3.5">
                  <Avatar name={t.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-medium text-[var(--color-ink)]">
                      {t.name}
                    </div>
                    <div className="truncate text-[12.5px] text-[var(--color-ink-soft)]">
                      <Link
                        to={`/properties/${t.propertyId}`}
                        className="underline-offset-4 transition-colors hover:text-[var(--color-ink)] hover:underline"
                      >
                        {t.property}
                      </Link>{" "}
                      · {unitLabel(t.unit)}
                    </div>
                  </div>
                  <div className="tabular hidden text-right text-[13px] font-medium text-[var(--color-ink-soft)] sm:block">
                    {currency(t.rent)}
                  </div>
                  <StatusBadge tone={paymentTone(t.state)} dot>
                    {paymentLabel(t.state)}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </Surface>

        <Surface elevated>
          <div className="px-4 pt-4 sm:px-5 sm:pt-5">
            <SectionHeader title="Recent activity" />
          </div>
          <div className="mt-3 px-4 pb-4 sm:mt-4 sm:px-5 sm:pb-5">
            <ol className="relative space-y-4 sm:space-y-5 before:absolute before:left-[5px] before:top-1.5 before:h-[calc(100%-1rem)] before:w-px before:bg-[var(--color-line)]">
              {activity.map((a) => (
                <li key={a.id} className="relative flex gap-4 pl-6">
                  <span className="absolute left-0 top-1.5 size-[11px] rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-accent-soft)] ring-1 ring-[var(--color-line)]" />
                  <div className="flex-1">
                    <div className="text-[13.5px] font-medium text-[var(--color-ink)]">{a.title}</div>
                    <div className="text-[12.5px] text-[var(--color-ink-soft)]">{a.detail}</div>
                  </div>
                  <span className="tabular shrink-0 text-[11.5px] text-[var(--color-ink-faint)]">
                    {a.time}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Surface>
      </div>
    </div>
  );
}
