export type PropertyType =
  | "Apartment"
  | "Independent House"
  | "Villa"
  | "Shop"
  | "Office"
  | "Other";

export const propertyTypes: PropertyType[] = [
  "Apartment",
  "Independent House",
  "Villa",
  "Shop",
  "Office",
  "Other",
];

export type UnitStatus = "occupied" | "vacant" | "maintenance";
export type PaymentState = "paid" | "due" | "overdue";
export type PropertyState = "occupied" | "vacant" | "maintenance";
export type PaymentMethod = "UPI" | "Bank Transfer" | "Cheque" | "Cash";
export type ActivityType = "payment" | "lease" | "maintenance" | "vacancy" | "note" | "expense";

export interface Property {
  id: string;
  name: string;
  address: string;
  locality: string;
  city: string;
  type: PropertyType;
  image: string;
  secondaryImage?: string;
  depositPerUnit: number;
  notes: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  number: string;
  config: string;
  rent: number;
  status: UnitStatus;
  tenantId?: string;
  vacantDays?: number;
  maintenanceNote?: string;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyId: string;
  property: string;
  unitId: string;
  unit: string;
  since: string;
  rent: number;
  state: PaymentState;
  status: "active" | "vacated";
  vacatedOn?: string;
}

export interface TenantNote {
  id: string;
  tenantId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  tenant: string;
  propertyId: string;
  property: string;
  unitId: string;
  unit: string;
  amount: number;
  date: string;
  billingMonth: string;
  method: PaymentMethod;
  state: PaymentState;
  reference?: string;
  notes?: string;
  recordedAt?: string;
}

export interface ActivityItem {
  id: string;
  propertyId: string;
  type: ActivityType;
  title: string;
  detail: string;
  daysAgo: number;
  hoursAgo: number;
  time: string;
}

/* ------------------------------ helpers ------------------------------ */

const DAY = 86_400_000;

export function dateAgo(days: number) {
  return new Date(Date.now() - days * DAY).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function shortDate(days: number) {
  return new Date(Date.now() - days * DAY).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function activityTime(daysAgo: number, hoursAgo = 0) {
  if (daysAgo === 0) return hoursAgo === 0 ? "Just now" : `${hoursAgo}h ago`;
  if (daysAgo === 1) return "Yesterday";
  return shortDate(daysAgo);
}

export function activityGroup(daysAgo: number) {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  return shortDate(daysAgo);
}

export function makeActivity(
  a: Omit<ActivityItem, "id" | "time" | "hoursAgo"> & { hoursAgo?: number; id?: string },
): ActivityItem {
  const hoursAgo = a.hoursAgo ?? 0;
  return {
    ...a,
    hoursAgo,
    id: a.id ?? `act-${Math.random().toString(36).slice(2, 9)}`,
    time: activityTime(a.daysAgo, hoursAgo),
  };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200`;

/** Fallback imagery by type — used when a new property has no photo. */
export const typeImages: Record<PropertyType, string> = {
  Apartment: px(1099065),
  "Independent House": px(19510801),
  Villa: px(13600836),
  Shop: px(8228650),
  Office: px(26241922),
  Other: px(11861957),
};