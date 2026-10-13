import Link from "next/link";

import { Container, Label, reveal } from "@/components/ui/primitives";
import { experience } from "@/content/profile";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      data-nav-theme="light"
      className="border-t border-sand bg-paper py-16 lg:py-20"
    >
      <Container>
        <Label className="text-stone">Experience</Label>
        <h2
          id="experience-title"
          className="mt-2 text-headline font-semibold"
          {...reveal(0)}
        >
          Where I’ve worked
        </h2>

        <ol className="mt-8 border-b border-sand-2">
          {experience.map((r) => (
            <li
              key={r.company}
              className="grid gap-x-8 gap-y-3 border-t border-sand-2 py-6 lg:grid-cols-12"
              {...reveal()}
            >
              <div className="lg:col-span-4">
                <h3 className="text-[1.375rem] leading-tight font-semibold tracking-tight">
                  {r.company}
                </h3>
                <p className="text-ink/80">{r.title}</p>
                <p className="mt-1 text-sm text-stone">
                  {r.dates}
                  {r.current && (
                    <span className="ml-2 inline-flex items-center gap-1.5 text-good-deep">
                      <span className="size-1.5 rounded-full bg-current" /> now
                    </span>
                  )}
                </p>
              </div>
              <div className="lg:col-span-8">
                <p>{r.summary}</p>
                <ul className="mt-3 grid gap-2">
                  {r.points.map((p) => (
                    <li
                      key={p}
                      className="grid grid-cols-[1rem_1fr] gap-2 text-[0.9375rem] leading-relaxed text-ink/80"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.7em] h-px w-2.5 bg-brand-deep"
                      />
                      {p}
                    </li>
                  ))}
                </ul>
                {r.link && (
                  <Link
                    href={r.link.href}
                    prefetch={false}
                    className="mt-3 inline-flex min-h-10 items-center text-sm font-medium text-brand-deep underline decoration-brand-deep/30 underline-offset-4 hover:decoration-brand-deep"
                  >
                    {r.link.label} →
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
