import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Activity,
  DoorOpen,
  History,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
}

export const primaryNav: NavItem[] = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Properties", to: "/properties", icon: Building2 },
  { label: "Tenants", to: "/tenants", icon: Users },
  { label: "Payments", to: "/payments", icon: CreditCard, badge: "2" },
  { label: "Activity", to: "/activity", icon: Activity },
];

export const secondaryNav: NavItem[] = [
  { label: "Vacancies", to: "/vacant", icon: DoorOpen },
  { label: "Rent History", to: "/rent-history", icon: History },
];

export const settingsNav: NavItem = { label: "Settings", to: "/settings", icon: Settings };

// Compact set used for mobile bottom dock
export const mobileNav: NavItem[] = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Properties", to: "/properties", icon: Building2 },
  { label: "Tenants", to: "/tenants", icon: Users },
  { label: "Payments", to: "/payments", icon: CreditCard, badge: "2" },
];
