"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { cx } from "@/components/ui/primitives";

export type Perspective = "product" | "engineering" | "outcome";

const TABS: { id: Perspective; label: string; question: string }[] = [
  { id: "product", label: "The Product", question: "What was built?" },
  {
    id: "engineering",
    label: "The Engineering",
    question: "How was it built?",
  },
  { id: "outcome", label: "The Outcome", question: "What changed?" },
];

/**
 * "Behind the Build": one project, three perspectives. Every panel is rendered
 * into the HTML (inactive ones are `hidden`), so the full story is crawlable
 * and readable without JavaScript — the switcher only changes which is shown.
 */
export function BehindTheBuild({
  id,
  tone,
  initial = "engineering",
  panels,
  barClassName,
}: {
  id: string;
  /** background of the sticky switcher bar, to match the chapter surface */
  barClassName?: string;
  tone: "dark" | "light";
  initial?: Perspective;
  panels: Record<Perspective, ReactNode>;
}) {
  const [active, setActive] = useState<Perspective>(initial);
  const reduce = useReducedMotion();
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dark = tone === "dark";

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = TABS.length;
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    else if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    setActive(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="relative">
      <div
        className={cx(
          "sticky top-[var(--nav-h)] z-20 -mx-4 px-4 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12",
          barClassName ?? (dark ? "bg-ink/80" : "bg-ivory/80"),
        )}
      >
        <div className="flex items-center gap-4">
          <p
            className={cx(
              "label hidden shrink-0 sm:block",
              dark ? "text-mist" : "text-stone",
            )}
          >
            Behind the build
          </p>
          <div
            role="tablist"
            aria-label={`Behind the build: ${id}`}
            className={cx(
              "relative grid w-full grid-cols-3 rounded-sm border p-1 sm:w-auto",
              dark ? "border-ink-4 bg-ink-2" : "border-sand-2 bg-paper",
            )}
          >
            {TABS.map((t, i) => {
              const selected = active === t.id;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`${uid}-tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`${uid}-panel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(t.id)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={cx(
                    "relative z-10 min-h-11 rounded-[2px] px-3 py-1.5 text-left transition-colors sm:min-w-[11rem] sm:px-4",
                    selected
                      ? dark
                        ? "text-ink"
                        : "text-ivory"
                      : dark
                        ? "text-mist hover:text-chalk"
                        : "text-stone hover:text-ink",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId={`btb-pill-${id}`}
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 36 }
                      }
                      className={cx(
                        "absolute inset-0 -z-10 rounded-[2px]",
                        dark ? "bg-brand" : "bg-ink",
                      )}
                    />
                  )}
                  <span className="block text-[0.8125rem] font-semibold leading-tight sm:text-sm">
                    {t.label}
                  </span>
                  <span
                    className={cx(
                      "hidden text-xs leading-tight sm:block",
                      selected ? "opacity-75" : "opacity-60",
                    )}
                  >
                    {t.question}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {TABS.map((t) => {
        const selected = active === t.id;
        return (
          <div
            key={t.id}
            role="tabpanel"
            id={`${uid}-panel-${t.id}`}
            aria-labelledby={`${uid}-tab-${t.id}`}
            hidden={!selected}
            tabIndex={0}
            className="pt-10 focus-visible:outline-offset-8 lg:pt-14"
          >
            {selected ? (
              <motion.div
                key={t.id}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {panels[t.id]}
              </motion.div>
            ) : (
              panels[t.id]
            )}
          </div>
        );
      })}
    </div>
  );
}
