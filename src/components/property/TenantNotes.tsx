import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { usePortfolio } from "../../data/PortfolioContext";
import type { Tenant, TenantNote } from "../../data/types";
import { Surface } from "../ui/Surface";
import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { Modal } from "../ui/Modal";
import { Field } from "../ui/Field";

interface ShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  formId: string;
  submitLabel: string;
  children: React.ReactNode;
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

export function TenantNotes({ tenant }: { tenant: Tenant }) {
  const { tenantNotes, addTenantNote, updateTenantNote, deleteTenantNote } = usePortfolio();
  const notes = tenantNotes.filter((n) => n.tenantId === tenant.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const [isAdding, setIsAdding] = useState(false);
  const [editingNote, setEditingNote] = useState<TenantNote | null>(null);
  const [deletingNote, setDeletingNote] = useState<TenantNote | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const openAdd = () => {
    setContent("");
    setError("");
    setIsAdding(true);
  };

  const openEdit = (note: TenantNote) => {
    setEditingNote(note);
    setContent(note.content);
    setError("");
  };

  const saveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Please write a note.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    try {
      if (editingNote) {
        await updateTenantNote(editingNote.id, content);
        setEditingNote(null);
      } else {
        await addTenantNote(tenant.id, content);
        setIsAdding(false);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletingNote) return;
    setIsSubmitting(true);
    try {
      await deleteTenantNote(deletingNote.id);
      setDeletingNote(null);
    } catch (err: any) {
      setError(err.message || "An error occurred while deleting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Surface elevated className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3 pt-4 sm:px-6 sm:pt-5">
          <SectionHeader title="Notes & Agreements" count={notes.length} />
          <Button variant="ghost" size="sm" icon={<Plus />} onClick={openAdd}>
            Add note
          </Button>
        </div>

        {notes.length === 0 ? (
          <EmptyState
            title="No notes yet"
            description="Write a note about this tenant, rent payments, or agreements."
            action={
              <Button size="sm" icon={<Plus />} onClick={openAdd}>
                Add note
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-[var(--color-line)] border-t border-[var(--color-line)]">
            {notes.map((note) => (
              <div key={note.id} className="p-4 sm:p-5 sm:px-6">
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0 break-words whitespace-pre-wrap text-[13.5px] sm:text-[14px] text-[var(--color-ink)] leading-relaxed">
                    {note.content}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(note)}
                      className="p-1.5 text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors rounded-md hover:bg-[var(--color-surface-muted)]"
                      title="Edit note"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingNote(note)}
                      className="p-1.5 text-[var(--color-ink-faint)] hover:text-[var(--color-critical)] transition-colors rounded-md hover:bg-red-50"
                      title="Delete note"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 text-[12px] text-[var(--color-ink-faint)]">
                  Added on {new Date(note.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}
                  {note.createdAt !== note.updatedAt && " (edited)"}
                </div>
              </div>
            ))}
          </div>
        )}
      </Surface>

      <ActionModal
        isSubmitting={isSubmitting}
        open={isAdding || !!editingNote}
        onClose={() => { setIsAdding(false); setEditingNote(null); }}
        title={editingNote ? "Edit Note" : "Add Note"}
        description={editingNote ? "Update your custom note." : "Write a custom note or agreement."}
        formId="note-form"
        submitLabel={isSubmitting ? "Saving..." : "Save Note"}
      >
        <form id="note-form" onSubmit={saveNote} className="space-y-4">
          <Field label="Note Content" error={error}>
            <textarea
              className="flex min-h-[120px] w-full resize-y rounded-[10px] border border-[var(--color-line)] bg-transparent p-3 text-[14px] text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-faint)] hover:border-[var(--color-line-heavy)] focus:border-[var(--color-ink)]"
              placeholder="Write a note..."
              value={content}
              onChange={(e) => { setContent(e.target.value); setError(""); }}
              autoFocus
            />
          </Field>
        </form>
      </ActionModal>

      <ActionModal
        isSubmitting={isSubmitting}
        open={!!deletingNote}
        onClose={() => setDeletingNote(null)}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        formId="delete-note-form"
        submitLabel={isSubmitting ? "Deleting..." : "Delete Note"}
      >
        <form id="delete-note-form" onSubmit={confirmDelete}>
          {error && <div className="text-[13px] text-[var(--color-critical)]">{error}</div>}
        </form>
      </ActionModal>
    </>
  );
}
