"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { cx, reveal } from "@/components/ui/primitives";
import type { WorkItem } from "@/content/work";
import { withBase } from "@/lib/base-path";

/**
 * Every project as a card with the essentials visible; clicking a card opens
 * a dialog with the full story, links, and (for featured work) the case study.
 * Uses the native <dialog>: focus is trapped, Escape closes, and focus returns
 * to the card that opened it.
 */
export function WorkGrid({ items }: { items: WorkItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const open = items.find((w) => w.id === openId) ?? null;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
        {items.map((w, i) => (
          <li
            key={w.id}
            className={cx(
              "flex",
              w.featured || i >= items.length - 2
                ? "lg:col-span-3"
                : "lg:col-span-2",
            )}
            {...reveal(staggerInRow(i, items.length), "card")}
          >
            <WorkCard w={w} onOpen={() => setOpenId(w.id)} />
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-labelledby={open ? `work-${open.id}-title` : undefined}
        onClose={() => setOpenId(null)}
        onClick={(e) => {
          // A click on the backdrop lands on the <dialog> element itself.
          if (e.target === e.currentTarget) setOpenId(null);
        }}
        className="work-dialog m-auto max-h-[min(88vh,56rem)] w-[min(100vw-1.5rem,48rem)] overflow-hidden rounded-md border border-sand-2 bg-ivory p-0 text-ink shadow-2xl"
      >
        {open && <WorkDetails w={open} onClose={() => setOpenId(null)} />}
      </dialog>
    </>
  );
}

/** Delay by position within its row (2 · 3 · 2 on desktop), so each row cascades left to right. */
function staggerInRow(i: number, total: number) {
  const col = i < 2 ? i : i >= total - 2 ? i - (total - 2) : i - 2;
  return col * 110;
}

function WorkCard({ w, onOpen }: { w: WorkItem; onOpen: () => void }) {
  const shown = w.stack.slice(0, w.featured ? 5 : 4);
  const more = w.stack.length - shown.length;
  return (
    <article
      className={cx(
        "group relative flex w-full flex-col rounded-md border p-5 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-4 has-[button:focus-visible]:outline-brand-deep sm:p-6 bg-paper text-ink border-sand-2 hover:border-ink",
      )}
      aria-labelledby={`card-${w.id}-title`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="label text-stone">
          {w.kind} · {w.year}
        </p>
        {w.badge && (
          <span className="rounded-sm bg-ink px-2 py-0.5 text-xs font-medium text-ivory">
            {w.badge}
          </span>
        )}
      </div>

      <h3
        id={`card-${w.id}-title`}
        className={cx(
          "mt-3 font-semibold tracking-tight",
          w.featured
            ? "text-[1.9rem] leading-tight"
            : "text-[1.5rem] leading-tight",
        )}
      >
        {/* The button covers the whole card, so the card is one click target. */}
        <button
          type="button"
          onClick={onOpen}
          className="text-left after:absolute after:inset-0 after:rounded-md after:content-[''] focus-visible:outline-none"
        >
          {w.name}
          <span className="sr-only">, view details</span>
        </button>
      </h3>
      <p className="mt-2 text-[0.9875rem] leading-relaxed text-ink/80">
        {w.summary}
      </p>

      <dl className="mt-5 grid gap-3 border-t border-sand-2 pt-4 text-[0.9375rem]">
        <div>
          <dt className="label text-stone">My part</dt>
          <dd className="mt-0.5">{w.roleShort}</dd>
        </div>
        <div>
          <dt className="label text-brand-deep">Result</dt>
          <dd className="mt-0.5 font-medium">{w.highlight}</dd>
        </div>
      </dl>

      <div className="mt-auto pt-5">
        <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
          {shown.map((s) => (
            <li
              key={s}
              className="rounded-sm border border-sand-2 px-2 py-0.5 text-[0.72rem] text-ink/80"
            >
              {s}
            </li>
          ))}
          {more > 0 && (
            <li className="px-1 py-0.5 text-[0.72rem] text-stone">+{more}</li>
          )}
        </ul>
        <p
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-deep"
          aria-hidden="true"
        >
          View details
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </p>
      </div>
    </article>
  );
}

function WorkDetails({ w, onClose }: { w: WorkItem; onClose: () => void }) {
  const hasActions = w.caseStudy || w.links.length > 0;
  return (
    <div className="flex max-h-[inherit] flex-col">
      <header className="flex items-start justify-between gap-4 border-b border-sand-2 px-5 py-4 sm:px-7">
        <div>
          <p className="label text-stone">
            {w.kind} · {w.year}
            {w.badge && <> · {w.badge}</>}
          </p>
          <h2
            id={`work-${w.id}-title`}
            className="mt-1 text-[1.75rem] leading-tight font-semibold tracking-tight"
          >
            {w.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-sm text-2xl leading-none transition-colors hover:bg-sand"
          aria-label="Close details"
        >
          ×
        </button>
      </header>

      <div className="overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">
        <p className="text-[1.0625rem] leading-relaxed">{w.summary}</p>

        {hasActions && (
          <div className="mt-5 flex flex-wrap gap-2.5">
            {w.caseStudy && (
              <Link
                href={w.caseStudy}
                prefetch={false}
                className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-ink px-4 text-[0.9375rem] font-medium text-ivory transition-colors hover:bg-brand-deep"
              >
                Read the full case study <ArrowRight size={15} />
              </Link>
            )}
            {w.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-ink/25 px-4 text-[0.9375rem] font-medium transition-colors hover:border-ink"
              >
                {l.label} <ArrowUpRight size={14} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ))}
          </div>
        )}
        {w.linkNote && <p className="mt-3 text-sm text-stone">{w.linkNote}</p>}

        <div className="mt-7 grid gap-5">
          {w.sections.map((s) => (
            <section key={s.label}>
              <h3 className="label text-brand-deep">{s.label}</h3>
              <p className="mt-1.5 text-[0.9875rem] leading-relaxed text-ink/85">
                {s.text}
              </p>
            </section>
          ))}
        </div>

        {w.list && (
          <section className="mt-7">
            <h3 className="label text-brand-deep">{w.list.label}</h3>
            <ul className="mt-2 grid gap-2">
              {w.list.items.map((item) => (
                <li
                  key={item}
                  className="grid grid-cols-[1rem_1fr] gap-2 text-[0.9375rem] leading-relaxed text-ink/85"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.7em] h-px w-2.5 bg-brand-deep"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {w.features && (
          <section className="mt-7">
            <h3 className="label text-brand-deep">Key features</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {w.features.map((f) => (
                <li key={f} className="rounded-sm bg-sand px-2.5 py-1 text-sm">
                  {f}
                </li>
              ))}
            </ul>
          </section>
        )}

        {w.image && (
          <div className="mt-7 overflow-hidden rounded-sm border border-sand-2">
            <Image
              src={withBase(w.image.src)}
              alt={w.image.alt}
              width={w.image.width}
              height={w.image.height}
              sizes="(min-width: 768px) 46rem, 100vw"
              className="h-auto w-full"
            />
          </div>
        )}

        <section className="mt-7 border-t border-sand-2 pt-5">
          <h3 className="label text-stone">Stack</h3>
          <p className="mt-1.5 text-[0.8rem] leading-relaxed">
            {w.stack.join(" · ")}
          </p>
        </section>
      </div>
    </div>
  );
}
