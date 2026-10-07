import { Bell, Command } from "lucide-react";
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
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-line)] bg-[var(--color-canvas)]/85 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-5 sm:px-8">
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
