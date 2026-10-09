import { NavLink } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { cn } from "../../utils/cn";
import { mobileNav } from "./navConfig";
import { usePortfolio } from "../../data/PortfolioContext";

export function MobileNavigation({ onMore }: { onMore: () => void }) {
  const { tenants } = usePortfolio();
  const unpaidCount = tenants.filter((t) => t.status === "active" && t.state !== "paid").length;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-line)] bg-[var(--color-surface)]/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 py-1.5">
        {mobileNav.map((item) => {
          const Icon = item.icon;
          const badge = item.to === "/payments" && unpaidCount > 0 ? unpaidCount.toString() : item.badge;
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "relative flex flex-1 flex-col items-center gap-1 rounded-[10px] px-2 py-2 text-[10.5px] font-medium transition-colors",
                  isActive ? "text-[var(--color-ink)]" : "text-[var(--color-ink-faint)]",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <Icon className="size-[21px] stroke-[1.7]" />
                    {badge && (
                      <span className="absolute -right-1.5 -top-1 flex size-[15px] items-center justify-center rounded-full bg-[var(--color-accent)] text-[9px] font-bold text-white">
                        {badge}
                      </span>
                    )}
                  </span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-0.5 h-[3px] w-6 rounded-full bg-[var(--color-accent)]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
        <button
          onClick={onMore}
          className="flex flex-1 flex-col items-center gap-1 rounded-[10px] px-2 py-2 text-[10.5px] font-medium text-[var(--color-ink-faint)]"
        >
          <MoreHorizontal className="size-[21px] stroke-[1.7]" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
}
