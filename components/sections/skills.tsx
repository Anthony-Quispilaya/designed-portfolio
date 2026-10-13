import { Container, Label, reveal } from "@/components/ui/primitives";
import { alsoWritten, skillGroups } from "@/content/profile";

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      data-nav-theme="light"
      className="border-t border-sand bg-paper py-16 lg:py-20"
    >
      <Container>
        <Label className="text-stone">Skills</Label>
        <h2
          id="skills-title"
          className="mt-2 text-headline font-semibold"
          {...reveal(0)}
        >
          What I work with
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => (
            <div
              key={g.title}
              className="rounded-md border border-sand-2 bg-ivory p-5"
              {...reveal((i % 3) * 90, "card")}
            >
              <h3 className="text-[1.125rem] leading-tight font-semibold tracking-tight">
                {g.title}
              </h3>
              <p className="mt-1.5 text-sm text-stone">{g.claim}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {g.skills.map((s) => (
                  <li
                    key={s}
                    className="rounded-sm border border-sand-2 bg-paper px-2 py-0.5 text-[0.8125rem]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-stone">
          {alsoWritten} Fluent in English and Spanish.
        </p>
      </Container>
    </section>
  );
}
