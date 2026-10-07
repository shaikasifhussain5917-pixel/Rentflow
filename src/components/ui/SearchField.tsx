import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface SearchFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  shortcut?: string;
  containerClassName?: string;
}

export function SearchField({
  className,
  containerClassName,
  shortcut,
  placeholder = "Search",
  ...props
}: SearchFieldProps) {
  return (
    <label
      className={cn(
        "group flex h-10 items-center gap-2.5 rounded-[12px] border border-white/70 bg-white/60 px-3.5 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.02),0_1px_2px_rgba(255,255,255,0.7)] transition-all duration-200 hover:bg-white/80 hover:border-[var(--color-line-strong)] focus-within:border-[var(--color-accent)]/50 focus-within:bg-white/95 focus-within:ring-4 focus-within:ring-[var(--color-accent)]/15 focus-within:shadow-[0_4px_14px_rgba(154,91,63,0.1)]",
        containerClassName,
      )}
    >
      <Search className="size-[17px] shrink-0 stroke-[1.8] text-[var(--color-ink-faint)] transition-colors group-focus-within:text-[var(--color-accent)]" />
      <input
        placeholder={placeholder}
        className={cn(
          "w-full bg-transparent text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:outline-none",
          className,
        )}
        {...props}
      />
      {shortcut && (
        <kbd className="hidden shrink-0 rounded-md border border-white/80 bg-white/80 px-1.5 py-0.5 font-sans text-[10.5px] font-medium text-[var(--color-ink-faint)] shadow-sm sm:inline-block">
          {shortcut}
        </kbd>
      )}
    </label>
  );
}
