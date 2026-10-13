import type { CSSProperties, ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "mx-auto w-full max-w-[1360px] px-4 sm:px-8 lg:px-12",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Monospace metadata label, e.g. "01 — MatchPoint". */
export function Label({
  children,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "span" | "div" | "h2" | "h3" | "dt";
}) {
  return <Tag className={cx("label", className)}>{children}</Tag>;
}

/** Props that make an element participate in the page-wide reveal. */
export function reveal(
  delay = 0,
  kind?: "mask" | "card",
): { "data-reveal": string; style?: CSSProperties } {
  return {
    "data-reveal": kind ?? "",
    style: delay
      ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
      : undefined,
  };
}

export function Ruler({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cx("ruler w-full", className)} />;
}
