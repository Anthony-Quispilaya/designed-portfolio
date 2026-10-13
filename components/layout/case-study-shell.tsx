import Link from "next/link";
import type { ReactNode } from "react";

import { FileIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { RevealObserver } from "@/components/ui/reveal-observer";
import { site } from "@/content/site";

/** Frame for a full case study: a back link, the chapter, and a way home. */
export function CaseStudyShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-ivory/85 text-ink backdrop-blur-md backdrop-saturate-150">
        <nav
          aria-label="Case study"
          className="mx-auto flex h-[var(--nav-h)] max-w-[1360px] items-center justify-between px-4 sm:px-8 lg:px-12"
        >
          <Link
            href="/#work"
            className="group inline-flex min-h-11 items-center text-[0.9375rem] font-medium"
          >
            <span>
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:-translate-x-0.5"
              >
                ←
              </span>{" "}
              All projects
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={site.resume}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-sm border border-ink/25 px-3.5 py-1.5 text-[0.875rem] font-medium transition-colors hover:border-ink hover:bg-ink hover:text-ivory"
            >
              <FileIcon size={15} /> Resume
            </a>
          </div>
        </nav>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-current/10"
        />
      </header>
      <main id="content" className="pt-[var(--nav-h)]">
        {children}
      </main>
      <footer className="border-t border-sand bg-ivory py-10">
        <Container className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/#work"
            className="text-[0.9375rem] font-medium underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            ← Back to all projects
          </Link>
          <Link
            href="/#contact"
            className="inline-flex min-h-11 items-center rounded-sm bg-ink px-5 text-[0.9375rem] font-medium text-ivory transition-colors hover:bg-brand-deep"
          >
            Get in touch
          </Link>
        </Container>
      </footer>
      <RevealObserver />
    </>
  );
}
