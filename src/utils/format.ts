/** Indian currency formatting — lakh/crore grouping (₹1,42,000). */
export function currency(value: number, opts?: { compact?: boolean }) {
  const v = Math.round(value);
  if (opts?.compact) {
    const abs = Math.abs(v);
    if (abs >= 1e7) return `₹${Number((v / 1e7).toFixed(2))}Cr`;
    if (abs >= 1e5) return `₹${Number((v / 1e5).toFixed(2))}L`;
    if (abs >= 1e3) return `₹${Number((v / 1e3).toFixed(1))}k`;
  }
  return `₹${v.toLocaleString("en-IN")}`;
}

export function paymentTone(state: "paid" | "due" | "overdue") {
  return state === "paid" ? "positive" : state === "due" ? "warning" : "critical";
}

export function paymentLabel(state: "paid" | "due" | "overdue") {
  return state === "paid" ? "Paid" : state === "due" ? "Due" : "Overdue";
}

export function propertyStateTone(state: "occupied" | "vacant" | "maintenance") {
  return state === "occupied" ? "positive" : state === "vacant" ? "warning" : "accent";
}
