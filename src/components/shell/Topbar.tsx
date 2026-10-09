import { ArrowLeft, Bell, Command } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { BrandMark } from "./BrandMark";
import { SearchField } from "../ui/SearchField";
import { IconButton } from "../ui/IconButton";
import { Avatar } from "../ui/Avatar";
import { Dropdown } from "../ui/Dropdown";
import { Tooltip } from "../ui/Tooltip";
import { useAuth } from "../../contexts/AuthContext";
import { useLocalTime } from "../../hooks/useLocalTime";

export function Topbar({ onSignOut }: { onSignOut?: () => void }) {
  const { user, profile } = useAuth();
  const { formattedDate } = useLocalTime();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const hasHistory = window.history.state && window.history.state.idx > 0;
    if (hasHistory) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  const isDashboard = location.pathname === "/dashboard" || location.pathname === "/";

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-line)] bg-[var(--color-canvas)]/85 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:gap-4 sm:px-8">
        {!isDashboard && (
          <button
            onClick={handleBack}
            className="flex lg:hidden size-[44px] shrink-0 items-center justify-center rounded-[12px] border border-[var(--color-line-strong)] bg-white/70 text-[var(--color-ink)] shadow-[0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all active:scale-95 active:bg-white"
            aria-label="Go back"
          >
            <ArrowLeft className="size-5 stroke-[1.7]" />
          </button>
        )}

        {/* Mobile brand */}
        <div className="lg:hidden">
          <BrandMark compact />
        </div>

        {/* Contextual date — desktop */}
        <div className="hidden flex-col leading-tight lg:flex">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
            Today
          </span>
          <span className="tabular text-[13.5px] font-medium text-[var(--color-ink-soft)]">
            {formattedDate}
          </span>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <div className="hidden w-full max-w-sm md:block">
            <SearchField placeholder="Search properties, tenants…" shortcut="⌘K" />
          </div>

          <IconButton label="Command menu" className="md:hidden">
            <Command />
          </IconButton>

          <Tooltip content="Notifications" side="bottom">
            <IconButton label="Notifications" className="relative">
              <Bell />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[var(--color-accent)] ring-2 ring-[var(--color-canvas)]" />
            </IconButton>
          </Tooltip>

          <div className="mx-1 hidden h-6 w-px bg-[var(--color-line)] sm:block" />

          <Dropdown
            trigger={<Avatar name={profile?.full_name || user?.email || "User"} size="md" className="cursor-pointer" />}
            items={[
              { label: "Account", onClick: () => window.location.hash = '#/settings' },
              { label: "Preferences", onClick: () => window.location.hash = '#/settings' },
              { label: "Sign out", tone: "critical", onClick: onSignOut },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
