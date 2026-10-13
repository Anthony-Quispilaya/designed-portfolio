import { ContactSection } from "@/components/contact/contact-section";
import { Hero } from "@/components/hero/hero";
import { SiteNav } from "@/components/layout/site-nav";
import { About } from "@/components/sections/about";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { Work } from "@/components/sections/work";
import { RevealObserver } from "@/components/ui/reveal-observer";

export default function HomePage() {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>
      <SiteNav />
      <main id="content">
        <Hero />
        <Work />
        <Experience />
        <Education />
        <Skills />
        <About />
        <ContactSection />
      </main>
      <RevealObserver />
    </>
  );
}
