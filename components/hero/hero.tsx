import { CharacterStage } from "@/components/hero/character-stage";
import {
  ArrowDown,
  FileIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/ui/icons";
import { Container, Label, reveal } from "@/components/ui/primitives";
import { hero, site } from "@/content/site";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      data-nav-theme="light"
      className="relative pt-[calc(var(--nav-h)+2rem)] pb-12 lg:pt-[calc(var(--nav-h)+2.5rem)] lg:pb-16"
    >
      <Container>
        <div className="scroll-out grid items-start gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Text first and top-aligned: name, pitch, and contact sit above the fold. */}
          <div className="lg:col-span-7 lg:pt-6">
            <div {...reveal(0)}>
              <Label>{hero.kicker}</Label>
            </div>

            <h1 id="hero-title" className="mt-5 text-display font-semibold">
              {site.name}
            </h1>

            <p
              className="prose-measure mt-6 text-lede text-ink/85"
              {...reveal(160)}
            >
              {hero.intro}
            </p>

            <p
              className="mt-6 flex max-w-xl items-baseline gap-3 text-[0.9375rem] text-stone"
              {...reveal(220)}
            >
              <span className="label shrink-0 text-ink">{hero.now.label}</span>
              <span className="relative mr-1 inline-flex size-2 shrink-0 translate-y-[-1px] self-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-good/60 motion-reduce:hidden" />
                <span className="relative size-2 rounded-full bg-good-deep" />
              </span>
              {hero.now.text}
            </p>

            <dl
              className="mt-6 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-3 border-t border-sand pt-4 sm:grid-cols-[auto_auto_auto]"
              {...reveal(260)}
            >
              {hero.facts.map((f) => (
                <div key={f.k}>
                  <dt className="label text-stone">{f.k}</dt>
                  <dd className="mt-0.5 text-[0.9375rem]">{f.v}</dd>
                </div>
              ))}
            </dl>

            <div
              className="mt-8 flex flex-wrap items-center gap-3"
              {...reveal(320)}
            >
              <a
                href="#work"
                className="group inline-flex min-h-12 items-center gap-3 rounded-sm bg-ink px-5 text-[0.9375rem] font-medium text-ivory transition-colors hover:bg-brand-deep"
              >
                See my work
                <ArrowDown
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </a>
              <a
                href={site.resume}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-12 items-center gap-2.5 rounded-sm border border-ink/25 px-5 text-[0.9375rem] font-medium transition-colors hover:border-ink"
              >
                <FileIcon size={16} /> Resume{" "}
                <span className="label text-stone">PDF</span>
              </a>
              <span
                className="mx-1 hidden h-6 w-px bg-ink/15 sm:block"
                aria-hidden="true"
              />
              <a
                href={`mailto:${site.email}`}
                className="inline-flex size-12 items-center justify-center rounded-sm transition-colors hover:bg-ink hover:text-ivory"
                aria-label={`Email ${site.email}`}
              >
                <MailIcon size={20} />
              </a>
              <a
                href={site.github}
                target="_blank"
                rel="noopener"
                className="inline-flex size-12 items-center justify-center rounded-sm transition-colors hover:bg-ink hover:text-ivory"
                aria-label="GitHub profile"
              >
                <GitHubIcon size={20} />
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener"
                className="inline-flex size-12 items-center justify-center rounded-sm transition-colors hover:bg-ink hover:text-ivory"
                aria-label="LinkedIn profile"
              >
                <LinkedInIcon size={19} />
              </a>
            </div>
          </div>

          <div className="hidden sm:block lg:col-span-5" {...reveal(200)}>
            <CharacterStage />
          </div>
        </div>
      </Container>
    </section>
  );
}
