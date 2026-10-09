import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import { IconButton } from "./IconButton";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  /** On desktop centered modal; on mobile it becomes a bottom sheet */
  className?: string;
}

export function Modal({ open, onClose, title, description, children, footer, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="animate-fade-in absolute inset-0 bg-slate-900/30 backdrop-blur-[6px] transition-opacity"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "animate-sheet-in relative z-10 flex max-h-[92dvh] w-[calc(100vw-16px)] max-w-lg flex-col overflow-hidden rounded-t-[24px] border border-white/80 bg-white/90 backdrop-blur-2xl shadow-[var(--shadow-panel),0_0_0_1px_rgba(255,255,255,0.8)] sm:w-full sm:rounded-[24px]",
          className,
        )}
      >
        {(title || description) && (
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/60 bg-white/50 px-6 py-5 backdrop-blur-md">
            <div className="space-y-1">
              {title && (
                <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-[13px] text-[var(--color-ink-soft)]">{description}</p>
              )}
            </div>
            <IconButton label="Close" onClick={onClose} className="-mr-2 -mt-1 hover:bg-black/5">
              <X />
            </IconButton>
          </div>
        )}
        {children && <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>}
        {footer && (
          <div className="flex shrink-0 justify-end gap-3 border-t border-white/60 bg-white/50 px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-4 backdrop-blur-md">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
