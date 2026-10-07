import { useState } from "react";
import type { ReactNode } from "react";
import { Building2 } from "lucide-react";
import { cn } from "../../utils/cn";

interface PropertyThumbnailProps {
  src: string;
  alt: string;
  ratio?: "square" | "landscape" | "portrait" | "wide" | "classic";
  overlay?: ReactNode;
  /** Zoom slightly when an ancestor marked `group/card` is hovered */
  interactive?: boolean;
  className?: string;
  imgClassName?: string;
}

const ratios = {
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  classic: "aspect-[5/4]",
  portrait: "aspect-[3/4]",
  wide: "aspect-[16/9]",
};

export function PropertyThumbnail({
  src,
  alt,
  ratio = "landscape",
  overlay,
  interactive,
  className,
  imgClassName,
}: PropertyThumbnailProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[10px] bg-[var(--color-surface-muted)] ring-1 ring-inset ring-[var(--color-line)]",
        ratios[ratio],
        className,
      )}
    >
      {failed ? (
        <div className="flex size-full items-center justify-center bg-[var(--color-accent-wash)]/60 text-[var(--color-ink-faint)]">
          <Building2 className="size-7 stroke-[1.3]" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={cn(
            "size-full object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            interactive && "group-hover/card:scale-[1.035]",
            imgClassName,
          )}
        />
      )}
      {overlay && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
          <div className="absolute inset-0">{overlay}</div>
        </>
      )}
      {/* hairline inner edge keeps photography crisp against the canvas */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/[0.04]" />
    </div>
  );
}
