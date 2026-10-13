"use client";

import { useEffect, useRef, useState } from "react";

import { FileIcon } from "@/components/ui/icons";
import { cx } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { nav, site } from "@/content/site";

export function SiteNav() {
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Theme flips when the band under the nav is a dark chapter.
  useEffect(() => {
    const navH = 60;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting)
            setDark(e.target.getAttribute("data-nav-theme") === "dark");
        }
      },
      {
        rootMargin: `-${navH / 2}px 0px -${Math.max(0, window.innerHeight - navH / 2 - 1)}px 0px`,
      },
    );
    document
      .querySelectorAll("[data-nav-theme]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Active link + progress line, one rAF per scroll burst.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (progress.current) progress.current.style.transform = `scaleX(${p})`;
      const marker = window.scrollY + window.innerHeight * 0.35;
      let current = "";
      for (const item of nav) {
        const el = document.querySelector<HTMLElement>(item.href);
        if (el && el.offsetTop <= marker) current = item.href;
      }
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4)
        current = "#contact";
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Mobile menu: Escape closes, focus moves into the panel and back.
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        dark ? "on-dark bg-ink/85 text-chalk" : "bg-ivory/85 text-ink",
        "backdrop-blur-md backdrop-saturate-150",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[var(--nav-h)] max-w-[1360px] items-center justify-between px-4 sm:px-8 lg:px-12"
      >
        <a
          href="#top"
          className="flex min-h-11 items-center"
          aria-label={`${site.name}, back to top`}
        >
          <span className="text-[0.95rem] font-semibold tracking-tight">
            {site.name}
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={active === item.href ? "true" : undefined}
                className={cx(
                  "relative rounded-sm px-3 py-2 text-[0.9375rem] transition-colors",
                  active === item.href
                    ? "opacity-100"
                    : "opacity-65 hover:opacity-100",
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute inset-x-3 -bottom-px h-px origin-left bg-current transition-transform duration-500 ease-[var(--ease-out-quint)]",
                    active === item.href ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </a>
            </li>
          ))}
          <li className="ml-2">
            <ThemeToggle />
          </li>
          <li className="ml-1">
            <a
              href={site.resume}
              target="_blank"
              rel="noopener"
              className={cx(
                "inline-flex items-center gap-2 rounded-sm border px-3.5 py-1.5 text-[0.875rem] font-medium transition-colors",
                dark
                  ? "border-chalk/30 hover:border-brand hover:bg-brand hover:text-ink"
                  : "border-ink/25 hover:border-ink hover:bg-ink hover:text-ivory",
              )}
            >
              <FileIcon size={15} /> Resume
            </a>
          </li>
        </ul>

        <div className="-mr-2 flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            ref={menuButton}
            type="button"
            className="flex h-11 items-center gap-2 rounded-sm px-2"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="label">{open ? "Close" : "Menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span
                className={cx(
                  "absolute left-0 h-px w-5 bg-current transition-transform duration-300",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cx(
                  "absolute left-0 h-px w-5 bg-current transition-transform duration-300",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={panel}
        hidden={!open}
        className={cx(
          "border-t md:hidden",
          dark ? "border-chalk/15" : "border-ink/10",
        )}
      >
        <ul className="px-4 py-3">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between py-3 text-2xl font-medium tracking-tight"
              >
                {item.label}
                <span className="label opacity-50">{item.href.slice(1)}</span>
              </a>
            </li>
          ))}
          <li className="mt-2 border-t border-current/10 pt-3 pb-2">
            <a
              href={site.resume}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 py-2 text-lg"
            >
              <FileIcon /> Resume (PDF)
            </a>
          </li>
        </ul>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-current/10"
      >
        <div ref={progress} className="h-full origin-left scale-x-0 bg-brand" />
      </div>
    </header>
  );
}
