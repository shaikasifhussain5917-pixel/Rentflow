import { cn } from "../../utils/cn";

export function Divider({
  className,
  vertical,
}: {
  className?: string;
  vertical?: boolean;
}) {
  return (
    <div
      role="separator"
      className={cn(
        "bg-[var(--color-line)]",
        vertical ? "h-full w-px" : "h-px w-full",
        className,
      )}
    />
  );
}
