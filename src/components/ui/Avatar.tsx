import { cn } from "../../utils/cn";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "size-8 text-[11px]",
  md: "size-10 text-[13px]",
  lg: "size-12 text-sm",
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-accent-wash)] font-semibold text-[var(--color-accent)] ring-1 ring-inset ring-[var(--color-line)]",
        sizes[size],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name} className="size-full object-cover" />
      ) : (
        <span className="tracking-wide">{initials(name)}</span>
      )}
    </span>
  );
}
