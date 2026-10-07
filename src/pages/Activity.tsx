import { CreditCard, DoorOpen, FileSignature, Receipt, StickyNote, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { Surface } from "../components/ui/Surface";
import { usePortfolio } from "../data/PortfolioContext";
import { type ActivityItem } from "../data/types";

const iconFor: Record<ActivityItem["type"], ReactNode> = {
  payment: <CreditCard />,
  vacancy: <DoorOpen />,
  maintenance: <Wrench />,
  lease: <FileSignature />,
  note: <StickyNote />,
  expense: <Receipt />,
};

export default function Activity() {
  const { activity, properties } = usePortfolio();
  const nameOf = (id: string) => properties.find((p) => p.id === id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Timeline"
        title="Activity"
        description="A chronological record of everything happening across your portfolio."
      />

      <Surface elevated className="p-6 sm:p-8">
        <ol className="relative space-y-6 before:absolute before:left-[19px] before:top-3 before:h-[calc(100%-2rem)] before:w-px before:bg-[var(--color-line)]">
          {activity.map((a) => {
            const property = nameOf(a.propertyId);
            return (
              <li key={a.id} className="relative flex items-start gap-4">
                <span className="relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink-soft)] shadow-[var(--shadow-soft)] [&>svg]:size-[17px] [&>svg]:stroke-[1.7]">
                  {iconFor[a.type]}
                </span>
                <div className="flex flex-1 items-start justify-between gap-4 pt-1.5">
                  <div>
                    <div className="text-[14px] font-medium text-[var(--color-ink)]">{a.title}</div>
                    <div className="text-[13px] text-[var(--color-ink-soft)]">
                      {property && (
                        <Link to={`/properties/${property.id}`} className="underline-offset-4 hover:text-[var(--color-ink)] hover:underline">
                          {property.name}
                        </Link>
                      )}{" "}
                      · {a.detail}
                    </div>
                  </div>
                  <span className="tabular shrink-0 text-[12px] text-[var(--color-ink-faint)]">{a.time}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </Surface>
    </div>
  );
}
