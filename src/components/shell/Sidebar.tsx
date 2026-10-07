import { NavLink } from "react-router-dom";
import { ChevronsUpDown, LogOut, UserRound } from "lucide-react";
import { cn } from "../../utils/cn";
import { BrandMark } from "./BrandMark";
import { primaryNav, secondaryNav, settingsNav, type NavItem } from "./navConfig";
import { Divider } from "../ui/Divider";
import { Avatar } from "../ui/Avatar";
import { Dropdown } from "../ui/Dropdown";
import { useAuth } from "../../contexts/AuthContext";

function NavRow({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium transition-all duration-200",
          isActive
            ? "bg-[var(--color-surface-muted)] text-[var(--color-ink)]"
            : "text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-muted)]/60 hover:text-[var(--color-ink)]",
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-[var(--color-accent)] transition-all duration-300",
              isActive ? "opacity-100" : "opacity-0",
            )}
          />
          <Icon
            className={cn(
              "size-[18px] shrink-0 stroke-[1.7] transition-colors",
              isActive ? "text-[var(--color-accent)]" : "text-[var(--color-ink-faint)] group-hover:text-[var(--color-ink-soft)]",
            )}
          />
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="tabular inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-accent-wash)] px-1.5 text-[10.5px] font-semibold text-[var(--color-accent)]">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export function Sidebar({ onSignOut }: { onSignOut?: () => void }) {
  const { user, profile } = useAuth();
  const userName = profile?.full_name || user?.email || "User";

  return (
    <aside className="relative z-10 flex h-full w-[264px] shrink-0 flex-col border-r border-[var(--color-line)] bg-[var(--color-surface)] backdrop-blur-2xl">
      <div className="px-5 pb-4 pt-6">
        <BrandMark />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        <p className="px-3 pb-2 pt-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
          Property Management
        </p>
        {primaryNav.map((item) => (
          <NavRow key={item.to} item={item} />
        ))}

        <div className="px-2 py-3">
          <Divider />
        </div>

        <p className="px-3 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
          Insights
        </p>
        {secondaryNav.map((item) => (
          <NavRow key={item.to} item={item} />
        ))}
      </nav>

      <div className="space-y-1 px-3 pb-3">
        <Divider className="mb-3" />
        <NavRow item={settingsNav} />

        <div className="pt-2">
          <Dropdown
            align="left"
            className="w-full"
            trigger={
              <div className="flex w-full items-center gap-3 rounded-[12px] border border-[var(--color-line)] bg-[var(--color-surface-muted)] px-2.5 py-2.5 text-left transition-colors hover:border-[var(--color-line-strong)]">
                <Avatar name={userName} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold text-[var(--color-ink)]">
                    {userName}
                  </div>
                  <div className="truncate text-[11.5px] text-[var(--color-ink-faint)]">
                    Portfolio Owner
                  </div>
                </div>
                <ChevronsUpDown className="size-4 shrink-0 stroke-[1.7] text-[var(--color-ink-faint)]" />
              </div>
            }
            items={[
              { label: "Account", icon: <UserRound /> },
              { label: "Settings", icon: <settingsNav.icon /> },
              { label: "Sign out", icon: <LogOut />, tone: "critical", onClick: onSignOut },
            ]}
          />
        </div>
      </div>
    </aside>
  );
}
