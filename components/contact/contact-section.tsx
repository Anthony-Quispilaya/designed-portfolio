import { ContactForm } from "@/components/contact/contact-form";
import { CopyEmail } from "@/components/contact/copy-email";
import {
  ArrowUpRight,
  FileIcon,
  GitHubIcon,
  LinkedInIcon,
} from "@/components/ui/icons";
import { Container, Label, reveal, Ruler } from "@/components/ui/primitives";
import { site } from "@/content/site";

export function ContactSection() {
  const links = [
    {
      href: site.github,
      label: "GitHub",
      sub: "Anthony-Quispilaya",
      icon: <GitHubIcon size={20} />,
    },
    {
      href: site.linkedin,
      label: "LinkedIn",
      sub: "anthony-quispilaya",
      icon: <LinkedInIcon size={19} />,
    },
    {
      href: site.resume,
      label: "Resume",
      sub: "PDF, one page",
      icon: <FileIcon size={20} />,
    },
  ];
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      data-nav-theme="dark"
      className="on-dark bg-ink pt-16 pb-10 text-chalk lg:pt-20"
    >
      <Container>
        <div className="flex items-baseline gap-4" {...reveal()}>
          <Label className="text-mist">Contact</Label>
        </div>
        <h2 id="contact-title" className="mt-4 text-chapter font-semibold">
          <span className="block" {...reveal(60, "mask")}>
            Have something
          </span>
          <span className="block" {...reveal(140, "mask")}>
            worth <span className="text-brand">building?</span>
          </span>
        </h2>

        <div className="mt-10 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7" {...reveal(100)}>
            <ContactForm email={site.email} />
          </div>
          <div className="lg:col-span-4 lg:col-start-9" {...reveal(180)}>
            <p className="text-lede text-chalk/80">
              I’m looking for software engineering roles where I can build
              things people use, and I’m always happy to talk volleyball, games,
              or whatever I’m learning next.
            </p>
            <div className="mt-8">
              <p className="label text-mist">Email</p>
              <CopyEmail email={site.email} />
            </div>
            <ul className="mt-8 grid border-t border-ink-3">
              {links.map((l) => (
                <li key={l.label} className="border-b border-ink-3">
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener"
                    className="group flex min-h-16 items-center gap-4 py-3 transition-colors hover:text-brand"
                  >
                    <span className="text-mist transition-colors group-hover:text-brand">
                      {l.icon}
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium">{l.label}</span>
                      <span className="block text-xs text-mist">{l.sub}</span>
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="mt-20">
          <Ruler className="text-chalk" />
          <div className="mt-6 flex flex-col gap-4 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {site.name}
            </p>
            <a
              href="#top"
              className="label inline-flex min-h-10 items-center hover:text-chalk"
            >
              Back to top ↑
            </a>
          </div>
        </footer>
      </Container>
    </section>
  );
}
