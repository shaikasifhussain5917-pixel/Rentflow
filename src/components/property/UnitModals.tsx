import { useState, useEffect } from "react";
import type { FormEvent, ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import type { PaymentMethod, Tenant, Unit } from "../../data/types";
import { usePortfolio } from "../../data/PortfolioContext";
import { currency } from "../../utils/format";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { Field, Select, TextInput } from "../ui/Field";

interface ShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  formId: string;
  submitLabel: string;
  children: ReactNode;
  disabled?: boolean;
  isSubmitting?: boolean;
}

function ActionModal({ open, onClose, title, description, formId, submitLabel, children, disabled, isSubmitting }: ShellProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting}>
            {disabled ? "Close" : "Cancel"}
          </Button>
          {!disabled && (
            <Button type="submit" form={formId} disabled={isSubmitting}>
              {submitLabel}
            </Button>
          )}
        </>
      }
    >
      {children}
    </Modal>
  );
}

/* ------------------------------ Assign tenant ------------------------------ */

interface AssignProps {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  /** When set the unit is fixed — used by "Mark as rented" */
  unitId?: string;
}

function AssignForm({ propertyId, unitId, onClose, setIsSubmitting }: Omit<AssignProps, "open"> & { setIsSubmitting: (v: boolean) => void }) {
  const { units, assignTenant } = usePortfolio();
  const vacant = units.filter((u) => u.propertyId === propertyId && u.status === "vacant");
  const [selected, setSelected] = useState(unitId ?? vacant[0]?.id ?? "");
  const unit = units.find((u) => u.id === selected);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rent, setRent] = useState(String(unit?.rent ?? ""));
  const [error, setError] = useState("");

  const choose = (id: string) => {
    setSelected(id);
    const u = units.find((x) => x.id === id);
    if (u) setRent(String(u.rent));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Enter the tenant's name");
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await assignTenant(selected, { name, phone, rent: Math.max(0, Number(rent) || 0) });
      onClose();
    } catch (err: any) {
      if (err?.code === "23505" || err?.message?.includes("unique") || err?.code === "P0001") {
        setError("This unit already has an active tenant.");
      } else {
        setError(err.message || "An error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!unitId && vacant.length === 0) {
    return (
      <EmptyState
        className="py-8"
        title="No vacant units"
        description="Every unit here is occupied or under maintenance. Add a unit to rent it out."
      />
    );
  }

  return (
    <form id="assign-form" onSubmit={submit} className="space-y-4" noValidate>
      {unitId ? (
        <div className="flex items-center justify-between rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface-muted)] px-4 py-3">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">Unit</div>
            <div className="text-[15px] font-semibold text-[var(--color-ink)]">
              {unit?.number} <span className="font-normal text-[var(--color-ink-soft)]">· {unit?.config}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">Listed</div>
            <div className="tabular text-[15px] font-semibold text-[var(--color-ink)]">{currency(unit?.rent ?? 0)}</div>
          </div>
        </div>
      ) : (
        <Field label="Unit">
          <Select value={selected} onChange={(e) => choose(e.target.value)}>
            {vacant.map((u) => (
              <option key={u.id} value={u.id}>
                {u.number} · {u.config} · {currency(u.rent)}
              </option>
            ))}
          </Select>
        </Field>
      )}
      <Field label="Tenant name" error={error}>
        <TextInput value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="Full name" autoFocus />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Phone">
          <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91" inputMode="tel" />
        </Field>
        <Field label="Monthly rent">
          <TextInput value={rent} onChange={(e) => setRent(e.target.value)} inputMode="numeric" />
        </Field>
      </div>
    </form>
  );
}

export function AssignTenantModal({ open, onClose, propertyId, unitId }: AssignProps) {
  const { units } = usePortfolio();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const noneVacant = !unitId && !units.some((u) => u.propertyId === propertyId && u.status === "vacant");
  return (
    <ActionModal
      disabled={noneVacant}
      isSubmitting={isSubmitting}
      open={open}
      onClose={onClose}
      title={unitId ? "Mark as rented" : "Add tenant"}
      description={unitId ? "Record the new tenant for this unit." : "Move a tenant into a vacant unit."}
      formId="assign-form"
      submitLabel={unitId ? "Mark as rented" : "Add tenant"}
    >
      <AssignForm propertyId={propertyId} unitId={unitId} onClose={onClose} setIsSubmitting={setIsSubmitting} />
    </ActionModal>
  );
}

/* -------------------------------- Add unit -------------------------------- */

function AddUnitForm({ propertyId, onClose, setIsSubmitting }: { propertyId: string; onClose: () => void; setIsSubmitting: (v: boolean) => void }) {
  const { addUnit, units } = usePortfolio();
  const [number, setNumber] = useState("");
  const [config, setConfig] = useState("2BHK");
  const [rent, setRent] = useState("18000");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!number.trim()) return setError("Enter a unit number");
    if (units.some((u) => u.propertyId === propertyId && u.number.toLowerCase() === number.trim().toLowerCase()))
      return setError("This unit number already exists");
    setIsSubmitting(true);
    try {
      await addUnit(propertyId, { number, config, rent: Math.max(0, Number(rent) || 0) });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="unit-form" onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Unit number" error={error}>
          <TextInput value={number} onChange={(e) => { setNumber(e.target.value); setError(""); }} placeholder="e.g. 401" autoFocus />
        </Field>
        <Field label="Configuration">
          <TextInput value={config} onChange={(e) => setConfig(e.target.value)} placeholder="2BHK, Shop…" />
        </Field>
      </div>
      <Field label="Monthly rent">
        <TextInput value={rent} onChange={(e) => setRent(e.target.value)} inputMode="numeric" />
      </Field>
    </form>
  );
}

export function AddUnitModal({ open, onClose, propertyId }: { open: boolean; onClose: () => void; propertyId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <ActionModal isSubmitting={isSubmitting} open={open} onClose={onClose} title="Add unit" description="The unit is added as vacant." formId="unit-form" submitLabel="Add unit">
      <AddUnitForm propertyId={propertyId} onClose={onClose} setIsSubmitting={setIsSubmitting} />
    </ActionModal>
  );
}

/* ------------------------------- Record rent ------------------------------- */

function RecordRentForm({ propertyId, onClose, setIsSubmitting }: { propertyId: string; onClose: () => void; setIsSubmitting: (v: boolean) => void }) {
  const { units, tenants, recordRent } = usePortfolio();
  const pending: { unit: Unit; tenant: Tenant }[] = [];
  for (const u of units) {
    if (u.propertyId !== propertyId || u.status !== "occupied") continue;
    const t = tenants.find((x) => x.id === u.tenantId);
    if (t && t.state !== "paid") pending.push({ unit: u, tenant: t });
  }
  const [selected, setSelected] = useState(pending[0]?.unit.id ?? "");
  const [method, setMethod] = useState<PaymentMethod>("UPI");
  const current = pending.find((p) => p.unit.id === selected);

  if (pending.length === 0) {
    return (
      <EmptyState
        className="py-8"
        icon={<CheckCircle2 />}
        title="All rent is recorded"
        description="Every occupied unit in this property has paid for the month."
      />
    );
  }

  const [error, setError] = useState("");
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await recordRent(selected, method);
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred while recording rent.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="rent-form" onSubmit={submit} className="space-y-4">
      <Field label="Unit" error={error}>
        <Select value={selected} onChange={(e) => setSelected(e.target.value)}>
          {pending.map(({ unit, tenant }) => (
            <option key={unit.id} value={unit.id}>
              {unit.number} · {tenant.name} · {tenant.state === "overdue" ? "overdue" : "due"}
            </option>
          ))}
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Amount">
          <div className="flex h-11 items-center rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface-muted)] px-3.5 text-sm font-semibold tabular text-[var(--color-ink)]">
            {currency(current?.unit.rent ?? 0)}
          </div>
        </Field>
        <Field label="Method">
          <Select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
            {(["UPI", "Bank Transfer", "Cheque", "Cash"] as PaymentMethod[]).map((m) => (
              <option key={m}>{m}</option>
            ))}
          </Select>
        </Field>
      </div>
    </form>
  );
}

export function RecordRentModal({ open, onClose, propertyId }: { open: boolean; onClose: () => void; propertyId: string }) {
  const { units, tenants } = usePortfolio();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nothingPending = !units.some((u) => {
    if (u.propertyId !== propertyId || u.status !== "occupied") return false;
    const t = tenants.find((x) => x.id === u.tenantId);
    return !!t && t.state !== "paid";
  });
  return (
    <ActionModal isSubmitting={isSubmitting} disabled={nothingPending} open={open} onClose={onClose} title="Record rent" description="Mark a pending payment as received." formId="rent-form" submitLabel="Record payment">
      <RecordRentForm propertyId={propertyId} onClose={onClose} setIsSubmitting={setIsSubmitting} />
    </ActionModal>
  );
}

/* ------------------------------- Add expense ------------------------------- */

const categories = ["Repairs", "Plumbing", "Electrical", "Painting", "Property tax", "Society charges", "Other"];

function ExpenseForm({ propertyId, onClose, setIsSubmitting }: { propertyId: string; onClose: () => void; setIsSubmitting: (v: boolean) => void }) {
  const { addExpense } = usePortfolio();
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const n = Number(amount);
    if (!n || n <= 0) return setError("Enter the amount spent");
    setIsSubmitting(true);
    try {
      await addExpense(propertyId, { category, amount: n, note });
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred while adding expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="expense-form" onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Category">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <Field label="Amount" error={error}>
          <TextInput value={amount} onChange={(e) => { setAmount(e.target.value); setError(""); }} inputMode="numeric" placeholder="₹" autoFocus />
        </Field>
      </div>
      <Field label="Note" hint="optional">
        <TextInput value={note} onChange={(e) => setNote(e.target.value)} placeholder="What was it for?" />
      </Field>
    </form>
  );
}

export function AddExpenseModal({ open, onClose, propertyId }: { open: boolean; onClose: () => void; propertyId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <ActionModal isSubmitting={isSubmitting} open={open} onClose={onClose} title="Add expense" description="Logged to this property's activity." formId="expense-form" submitLabel="Add expense">
      <ExpenseForm propertyId={propertyId} onClose={onClose} setIsSubmitting={setIsSubmitting} />
    </ActionModal>
  );
}

/* ------------------------------- Update rent status ------------------------------- */

export function UpdateRentModal({ open, onClose, tenant }: { open: boolean; onClose: () => void; tenant: Tenant | null }) {
  const { updateRentStatus } = usePortfolio();
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Sync state when modal opens
  useEffect(() => {
    if (open && tenant) {
      setIsPaid(tenant.state === "paid");
      setError("");
    }
  }, [open, tenant]);

  const today = new Date();
  const monthName = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!tenant) return;
    setIsSubmitting(true);
    setError("");
    try {
      await updateRentStatus(tenant.id, isPaid);
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred while updating rent status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tenant) return null;

  return (
    <ActionModal isSubmitting={isSubmitting} open={open} onClose={onClose} title={`${monthName} Rent`} description={`Tenant: ${tenant.name} | Amount: ${currency(tenant.rent)}`} formId="update-rent-form" submitLabel={isSubmitting ? "Saving..." : "Save"}>
      <form id="update-rent-form" onSubmit={submit} className="space-y-4">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="rent_status" checked={isPaid} onChange={() => setIsPaid(true)} className="accent-[var(--color-ink)]" />
            <span className="text-[14px] text-[var(--color-ink)] font-medium">🟢 Paid</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="rent_status" checked={!isPaid} onChange={() => setIsPaid(false)} className="accent-[var(--color-ink)]" />
            <span className="text-[14px] text-[var(--color-ink)] font-medium">🔴 Not Paid</span>
          </label>
        </div>
        {error && <div className="text-[13px] text-[var(--color-critical)]">{error}</div>}
      </form>
    </ActionModal>
  );
}
