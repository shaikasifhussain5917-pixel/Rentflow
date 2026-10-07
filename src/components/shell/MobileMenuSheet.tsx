import { NavLink } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { cn } from "../../utils/cn";
import { primaryNav, secondaryNav, settingsNav, type NavItem } from "./navConfig";
import { BrandMark } from "./BrandMark";
import { Avatar } from "../ui/Avatar";
import { Divider } from "../ui/Divider";
import { IconButton } from "../ui/IconButton";
import { useAuth } from "../../contexts/AuthContext";

function Row({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3.5 rounded-[12px] px-3.5 py-3 text-[15px] font-medium transition-colors",
          isActive
            ? "bg-[var(--color-surface-muted)] text-[var(--color-ink)]"
            : "text-[var(--color-ink-soft)]",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={cn("size-[20px] stroke-[1.7]", isActive && "text-[var(--color-accent)]")} />
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="tabular rounded-full bg-[var(--color-accent-wash)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-accent)]">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export function MobileMenuSheet({
  open,
  onClose,
  onSignOut,
}: {
  open: boolean;
  onClose: () => void;
  onSignOut?: () => void;
}) {
  const { user, profile } = useAuth();
  const userName = profile?.full_name || user?.email || "User";

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] lg:hidden">
      <div className="animate-fade-in absolute inset-0 bg-[var(--color-ink)]/35 backdrop-blur-[2px]" onClick={onClose} />
      <div className="animate-sheet-in absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[22px] border-t border-[var(--color-line)] bg-[var(--color-surface)] pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-[var(--shadow-panel)]">
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-4">
          <BrandMark />
          <IconButton label="Close" onClick={onClose}>
            <X />
          </IconButton>
        </div>
        <div className="space-y-1 px-3 py-4">
          {primaryNav.map((item) => (
            <Row key={item.to} item={item} onClose={onClose} />
          ))}
          <div className="px-2 py-2">
            <Divider />
          </div>
          {secondaryNav.map((item) => (
            <Row key={item.to} item={item} onClose={onClose} />
          ))}
          <Row item={settingsNav} onClose={onClose} />
        </div>
        <div className="px-3 pb-2">
          <Divider className="mb-3" />
          <div className="flex items-center gap-3 rounded-[14px] bg-[var(--color-surface-muted)] px-3.5 py-3">
            <Avatar name={userName} size="lg" />
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-[var(--color-ink)]">{userName}</div>
              <div className="text-[12px] text-[var(--color-ink-faint)]">Portfolio Owner</div>
            </div>
            <IconButton
              label="Sign out"
              onClick={() => {
                onClose();
                onSignOut?.();
              }}
              className="text-[var(--color-critical)]"
            >
              <LogOut />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
