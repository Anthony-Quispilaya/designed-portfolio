import Image from "next/image";

import { Container, Label, reveal } from "@/components/ui/primitives";
import { education } from "@/content/profile";
import { withBase } from "@/lib/base-path";

export function Education() {
  return (
    <section
      id="education"
      aria-labelledby="education-title"
      data-nav-theme="light"
      className="border-t border-sand bg-ivory py-16 lg:py-20"
    >
      <Container>
        <Label className="text-stone">Education</Label>
        <h2
          id="education-title"
          className="mt-2 text-headline font-semibold"
          {...reveal(0)}
        >
          Where I studied
        </h2>

        <div
          className="mt-8 grid gap-x-8 gap-y-4 border-y border-sand-2 py-6 lg:grid-cols-12"
          {...reveal()}
        >
          <div className="lg:col-span-4">
            {/* Decorative: the school name right below says the same thing. */}
            <Image
              src={withBase(education.logo.src)}
              alt=""
              width={education.logo.width}
              height={education.logo.height}
              className="h-9 w-auto object-contain sm:h-10"
            />
            <h3 className="mt-3 text-[1.375rem] leading-tight font-semibold tracking-tight">
              {education.school}
            </h3>
            <p className="mt-1 text-sm text-stone">
              {education.college} · {education.year}
            </p>
          </div>
          <div className="lg:col-span-8">
            <p className="text-[1.0625rem]">
              {education.degree},{" "}
              <span className="font-medium">{education.honors}</span>
            </p>
            <p className="label mt-4 text-stone">Relevant coursework</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {education.coursework.map((c) => (
                <li
                  key={c}
                  className="rounded-sm border border-sand-2 bg-paper px-2 py-0.5 text-[0.8125rem]"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
