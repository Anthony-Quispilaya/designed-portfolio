"use client";

import Image from "next/image";
import { useState } from "react";

import { cx } from "@/components/ui/primitives";

export type Hotspot = { x: number; y: number; title: string; body: string };

export function AnnotatedShot({
  src,
  srcSmall,
  alt,
  width,
  height,
  hotspots,
  caption,
}: {
  src: string;
  srcSmall?: string;
  alt: string;
  width: number;
  height: number;
  hotspots: Hotspot[];
  caption: string;
}) {
  const [active, setActive] = useState<number | null>(0);
  const spot = active === null ? null : hotspots[active];

  return (
    <figure className="m-0">
      <div className="relative overflow-hidden rounded-sm border border-ink bg-ink">
        <picture>
          {srcSmall && <source media="(max-width: 700px)" srcSet={srcSmall} />}
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(min-width: 1360px) 1260px, 100vw"
            className="block h-auto w-full"
          />
        </picture>
        {hotspots.map((h, i) => (
          <button
            key={h.title}
            type="button"
            onClick={() => setActive(active === i ? null : i)}
            aria-pressed={active === i}
            aria-label={`${i + 1}. ${h.title}`}
            className="group absolute -translate-x-1/2 -translate-y-1/2 p-2"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
          >
            <span
              className={cx(
                "relative grid size-7 place-items-center rounded-full border-2 text-xs font-medium shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110",
                active === i
                  ? "border-ink bg-brand text-ink"
                  : "border-ink bg-ivory text-ink",
              )}
            >
              {i + 1}
              {active === i && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border-2 border-brand [animation:pulse-ring_1.6s_ease-out_infinite] motion-reduce:hidden"
                />
              )}
            </span>
          </button>
        ))}
        {spot && (
          <div
            className="pointer-events-none absolute right-3 bottom-3 hidden max-w-[22rem] rounded-sm border border-ink bg-ivory/95 p-4 shadow-lg backdrop-blur md:block"
            aria-live="polite"
          >
            <p className="label text-brand-deep">
              {String((active ?? 0) + 1).padStart(2, "0")} · {spot.title}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed">{spot.body}</p>
          </div>
        )}
      </div>
      <figcaption className="mt-3 text-sm text-stone">{caption}</figcaption>
      <ol className="mt-5 grid gap-3 md:hidden">
        {hotspots.map((h, i) => (
          <li
            key={h.title}
            className={cx(
              "grid grid-cols-[1.75rem_1fr] gap-3 rounded-sm p-2 transition-colors",
              active === i && "bg-brand-soft",
            )}
          >
            <span className="grid size-7 place-items-center rounded-full border-2 border-ink text-xs">
              {i + 1}
            </span>
            <span>
              <span className="block text-sm font-medium">{h.title}</span>
              <span className="block text-sm text-stone">{h.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
