import Image from "next/image";

import { Container, Label, reveal } from "@/components/ui/primitives";
import { withBase } from "@/lib/base-path";
import { about } from "@/content/profile";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      data-nav-theme="light"
      className="border-t border-sand bg-paper py-16 lg:py-20"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Label className="text-stone">About</Label>
            <figure className="m-0 mt-5 max-w-xs" {...reveal(0, "card")}>
              <div className="overflow-hidden rounded-md bg-sand">
                <Image
                  src={withBase("/assets/headshot.webp")}
                  alt="Portrait of Anthony Quispilaya."
                  width={720}
                  height={720}
                  sizes="(min-width: 1024px) 20rem, 80vw"
                  className="h-auto w-full"
                />
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                {about.facts.map((f) => (
                  <div key={f.k}>
                    <dt className="label text-stone">{f.k}</dt>
                    <dd className="mt-0.5">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </figure>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <h2
              id="about-title"
              className="text-headline font-semibold text-balance"
              {...reveal(0)}
            >
              {about.title}
            </h2>
            <div className="mt-6 grid gap-4 text-[1.0625rem] leading-relaxed text-ink/85">
              {about.paragraphs.map((p, i) => (
                <p key={p} className="prose-measure" {...reveal(80 + i * 70)}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
