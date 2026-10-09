import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { cn } from "../../utils/cn";
import { primaryNav, secondaryNav, settingsNav, type NavItem } from "./navConfig";
import { BrandMark } from "./BrandMark";
import { useAuth } from "../../contexts/AuthContext";
import { usePortfolio } from "../../data/PortfolioContext";

function Row({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center justify-between rounded-xl px-3 h-[44px] transition-all duration-200",
          isActive
            ? "bg-[#F8F1EC] text-slate-900 shadow-sm"
            : "text-slate-700 hover:bg-slate-50"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#B96545]" />
          )}
          <div className="flex items-center gap-3.5">
            <Icon 
              className={cn(
                "size-[18px] transition-colors duration-200",
                isActive ? "text-[#B96545] stroke-[2]" : "text-slate-500 stroke-[1.5] group-hover:text-slate-700"
              )} 
            />
            <span className={cn("text-[14px]", isActive ? "font-semibold" : "font-medium")}>
              {item.label}
            </span>
          </div>
          {item.badge && (
            <span className="tabular flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/60 px-1.5 text-[10px] font-bold text-[#B96545] shadow-sm">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function NavGroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
      {children}
    </h3>
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
  const { tenants } = usePortfolio();
  const userName = profile?.full_name || user?.email || "User";
  const unpaidCount = tenants.filter((t) => t.status === "active" && t.state !== "paid").length;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEscape);
      };
    }
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      {/* Overlay - separate from drawer element */}
      <div 
        className="fixed inset-0 z-[90] bg-slate-900/40 lg:hidden" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div 
        className="fixed inset-y-0 left-0 z-[95] flex w-[min(310px,calc(100vw-24px))] flex-col bg-white shadow-[20px_0_40px_rgba(0,0,0,0.08)] border-r border-[#ECEEF2] lg:hidden transition-transform duration-300 ease-out animate-in slide-in-from-left"
        role="dialog"
        aria-label="Navigation Menu"
      >
        <div className="flex h-[72px] shrink-0 items-center justify-between px-5">
          <BrandMark />
          <button 
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <div className="mb-6 space-y-1">
            <NavGroupHeading>Primary</NavGroupHeading>
            {primaryNav.map((item) => (
              <Row key={item.to} item={{ ...item, badge: item.to === "/payments" && unpaidCount > 0 ? unpaidCount.toString() : item.badge }} onClose={onClose} />
            ))}
          </div>
          
          <div className="mb-6 space-y-1">
            <NavGroupHeading>Portfolio</NavGroupHeading>
            {secondaryNav.map((item) => (
              <Row key={item.to} item={item} onClose={onClose} />
            ))}
          </div>

          <div className="mb-6 space-y-1">
            <NavGroupHeading>Preferences</NavGroupHeading>
            <Row item={settingsNav} onClose={onClose} />
          </div>
        </div>
        
        <div className="shrink-0 border-t border-[#ECEEF2] bg-white p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F8F1EC] text-[#B96545] font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate text-[13.5px] font-semibold text-slate-900">{userName}</div>
              <div className="truncate text-[11.5px] font-medium text-slate-500">Portfolio Owner</div>
            </div>
            <button
              onClick={() => {
                onClose();
                onSignOut?.();
              }}
              aria-label="Sign out"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="size-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
