"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for the whole page. Any element with a
 * `data-reveal` attribute fades/slides in once when it enters the viewport.
 * Server components only need the attribute — no client wrapper per element.
 */
export function RevealObserver() {
  useEffect(() => {
    // A "mask" element starts fully clipped, and Chrome reports a fully
    // clipped element as never intersecting — so watch its parent instead.
    const watched = new Map<Element, Element[]>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            for (const el of watched.get(entry.target) ?? [])
              el.setAttribute("data-revealed", "");
            watched.delete(entry.target);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const observeAll = () => {
      document
        .querySelectorAll("[data-reveal]:not([data-revealed])")
        .forEach((el) => {
          const target =
            el.getAttribute("data-reveal") === "mask" && el.parentElement
              ? el.parentElement
              : el;
          const list = watched.get(target) ?? [];
          if (list.includes(el)) return;
          list.push(el);
          watched.set(target, list);
          observer.observe(target);
        });
    };
    observeAll();

    // Content that mounts later (e.g. a tab panel) gets picked up too.
    const mutations = new MutationObserver(observeAll);
    mutations.observe(document.body, { childList: true, subtree: true });

    // Safety net: never leave content hidden if something goes wrong.
    const failsafe = window.setTimeout(() => {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.setAttribute("data-revealed", "");
      });
    }, 2500);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}
