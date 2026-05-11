import { HackPrincetonCarousel } from "@/components/hackprinceton-carousel";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anthony Quispilaya | Full-Stack Engineer",
  description:
    "Reliable full-stack engineer building useful products, practical AI systems, and systems integrations.",
  openGraph: {
    title: "Anthony Quispilaya | Full-Stack Engineer",
    description:
      "Reliable full-stack engineering, user-first product thinking, and proof from AI, product, and systems-integration work.",
    type: "website",
  },
};

const featuredProjects = [
  {
    priority: "Flagship proof",
    eyebrow: "HackPrinceton 2026 winner",
    title: "LEGR",
    body: "AI-powered finance operations platform for startup teams, with a real-time dashboard and iMessage-style alerts for business workflows.",
    role: "Integrated sponsor API tooling, wired backend data paths, debugged real-time flows, and built testing support APIs so the product could show live data under deadline pressure.",
    result:
      "Won Best Business & Enterprise Hack and Best Use of Enter Pro after a 36-hour build.",
    image: "/assets/HackPrinceton%20Winner.jpg",
    imageAlt:
      "Anthony with the LEGR team after winning Best Business and Enterprise Hack at HackPrinceton.",
    link: "https://devpost.com/software/legr",
    linkLabel: "View Devpost",
    stack: [
      "Python",
      "JavaScript",
      "Supabase",
      "OpenAI",
      "Claude",
      "Dedalus",
      "Photon",
      "Knot",
    ],
  },
  {
    priority: "Sponsor product",
    eyebrow: "Capstone frontend developer",
    title: "Creator Copilot by Tapyoca",
    body: "Financial platform for creators, artists, and filmmakers to manage budgets, expenses, CSV import/export, dashboards, and AI-assisted insights.",
    role: "Owned frontend structure, dashboard UI, project flows, sponsor-aligned styling, Supabase/auth integration, and AI assistant integration work on a three-person team.",
    result:
      "Turned sponsor requirements into usable product flows with real stakeholder feedback.",
    image: "/assets/Creator%20Copilot.png",
    imageAlt:
      "Creator Copilot product interface showing the Tapyoca capstone application.",
    link: "https://creator-copilot-frontend-production.up.railway.app/",
    linkLabel: "Open live site",
    stack: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Shadcn/ui",
      "Recharts",
      "Gemini API",
      "FlaskAPI",
      "Python",
      "Supabase",
    ],
  },
  {
    priority: "AI systems",
    eyebrow: "Practical AI operations",
    title: "OpsMesh AI",
    body: "Messaging-first operations platform concept that connects a Next.js product surface, FastAPI backend, Postgres storage, orchestration agents, and Photon bridge support.",
    role: "Designed AI-first workflows that connect messages, agents, backend services, and operational actions instead of stopping at a single chatbot feature.",
    result:
      "Shows product thinking around useful AI systems: workflows, orchestration, and real business operations.",
    link: "https://github.com/Anthony-Quispilaya/opsmeshai",
    linkLabel: "View GitHub",
    stack: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Postgres",
      "Docker",
      "Photon",
      "Agents",
    ],
  },
];

const supportingProjects = [
  {
    eyebrow: "Systems Integration",
    title: "Steam Games Library Rank System",
    body: "Full-stack PHP/MySQL application integrating the Steam Web API with ranking, library, and social features.",
    role: "Built Dev, QA, and Prod Linux VM environments with Tailscale VPN access, RabbitMQ messaging, replication, backups, logging, monitoring, and deployment separation.",
    result:
      "Proof of backend reliability, infrastructure thinking, and operational discipline beyond a single web app.",
    link: "https://github.com/Anthony-Quispilaya/Steam-Games-Library-Rank-System",
    linkLabel: "View GitHub",
    stack: [
      "PHP",
      "MySQL",
      "RabbitMQ",
      "Linux VMs",
      "Tailscale",
      "Steam Web API",
      "Backups",
    ],
  },
];

type PortfolioProject = {
  priority?: string;
  eyebrow: string;
  title: string;
  body: string;
  role: string;
  result: string;
  image?: string;
  imageAlt?: string;
  link: string;
  linkLabel: string;
  stack: string[];
};

const keyProjects: PortfolioProject[] = [
  ...featuredProjects,
  ...supportingProjects,
];

const proofBlocks = [
  {
    source: "Hackathon Win",
    quote: "Best Business & Enterprise Hack",
    context:
      "HackPrinceton 2026 selected LEGR for the business and enterprise track award, with LEGR named in the official winner materials.",
  },
  {
    source: "Tapyoca Sponsor Feedback",
    quote: "You've been extremely proactive in your work with us thus far.",
    context:
      "Feedback from Myron Paes, Head Product Manager at Tapyoca, recognizing initiative on the sponsored capstone product.",
  },
  {
    source: "NJIT Recognition",
    quote: "NJIT publicly recognized the LEGR team.",
    context:
      "The post connects the project to both awards and gives the achievement institutional visibility.",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7457397339591307264/?utm_source=share&utm_medium=member_desktop&rcm=ACoAADUojL0BnvhdHtVAObhuMfPEp-F440dUqac",
    linkLabel: "Open post",
  },
  {
    source: "Enter Pro Recognition",
    quote: "Best Use of Enter Pro",
    context:
      "Sponsor-track validation for using Enter Pro in a practical AI finance operations workflow.",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7457396576487976960/?utm_source=share&utm_medium=member_desktop&rcm=ACoAADUojL0BnvhdHtVAObhuMfPEp-F440dUqac",
    linkLabel: "Open post",
  },
];

const hackPrincetonCarousel = [
  {
    src: "/assets/DSCF4249.JPG",
    alt: "Anthony at HackPrinceton during the LEGR project presentation.",
    label: "Enter Pro Winner",
    caption:
      "Our team was selected for Best Use of Enter Pro at HackPrinceton 2026 after shipping LEGR in just 36 hours.",
  },
  {
    src: "/assets/HackPrinceton%20Winner.jpg",
    alt: "Anthony with the LEGR team after winning Best Business and Enterprise Hack at HackPrinceton.",
    label: "Team win",
    caption: "Our team LEGR won Best Business & Enterprise Hack.",
  },
  {
    src: "/assets/LEGR%20WINNER.png",
    alt: "HackPrinceton award slide naming LEGR as Best Business and Enterprise Hack winner.",
    label: "Award slide",
    caption: "Official winner slide naming LEGR as the track winner.",
  },
];

const capabilities = [
  {
    title: "Full-stack web development",
    body: "React/Next.js product surfaces connected to APIs, auth, databases, dashboards, and user flows.",
  },
  {
    title: "Practical AI automation",
    body: "AI workflows built around real tasks: finance ops, creator insights, messaging, and operations support.",
  },
  {
    title: "Systems integration",
    body: "Steam API, RabbitMQ, Linux VMs, VPN access, replication, backups, and deployment separation.",
  },
  {
    title: "Reliability and debugging",
    body: "Comfortable tracing issues across UI, backend paths, environments, and user-facing support needs.",
  },
  {
    title: "Product thinking",
    body: "I translate stakeholder goals into clear screens, useful defaults, and flows people can actually use.",
  },
  {
    title: "Speed and delivery",
    body: "I move quickly, keep scope visible, and prioritize working software that can be tested and improved.",
  },
];

const experience = [
  {
    role: "Frontend Developer",
    company: "Tapyoca",
    dates: "Jan 2026 to Present",
    impact: [
      "Build React interfaces for Creator Copilot, a sponsored financial platform for creators, artists, and filmmakers.",
      "Create dashboard, budgeting, expense, CSV, and project-management flows backed by Supabase authentication.",
      "Collaborate through GitHub, Trello, and Agile/Scrum routines while contributing to AI-assisted insight features.",
    ],
    stack: [
      "React",
      "JavaScript",
      "Supabase",
      "Dashboards",
      "UI/UX",
      "AI Integration",
    ],
  },
  {
    role: "IT Technician",
    company: "Quest Technologies",
    dates: "Aug 2024 to Sept 2025",
    impact: [
      "Troubleshot hardware, software, workstation, and basic networking issues in professional environments.",
      "Set up devices, documented resolutions, and helped users return to productive work with less downtime.",
      "Built strong habits around clear diagnosis, reliability, communication, and follow-through.",
    ],
    stack: [
      "Technical Support",
      "Troubleshooting",
      "Device Setup",
      "Networking",
      "Documentation",
      "Client Support",
    ],
  },
];

const pythonProject = {
  title: "Calculator Application",
  link: "https://github.com/Anthony-Quispilaya/midterm_ajq",
  body: "Supporting Python proof: a tested REPL calculator with modular commands, calculation history, error handling, logging, and documentation.",
  proof:
    "Shows fundamentals in Python, REST-style endpoint thinking, tests, debugging, and clear user feedback without competing with the flagship projects.",
  stack: ["Python", "pytest", "pytest-cov", "Faker", "pandas", "logging"],
};

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f3ec] font-sans text-[#17231c]">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#17231c] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky inset-x-0 top-0 z-50 border-b border-[#d7ddcf]/80 bg-[#f7f3ec]/92 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="text-sm font-bold tracking-[0.18em] !text-[#24352b] uppercase"
          >
            Anthony Quispilaya
          </Link>
          <nav
            aria-label="Portfolio sections"
            className="hidden gap-5 text-sm font-semibold !text-[#4b5966] sm:flex"
          >
            <a href="#experience">Experience</a>
            <a href="#work">Work</a>
            <a href="#proof">Proof</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <div
        id="content"
        className="mx-auto flex w-full max-w-7xl flex-col gap-22 overflow-x-hidden px-5 pt-10 pb-16 sm:px-8 lg:gap-28 lg:px-10"
      >
        <section className="grid gap-10 pt-6 lg:min-h-[calc(100svh-6rem)] lg:grid-cols-[1fr_0.96fr] lg:items-center lg:pt-0">
          <div className="min-w-0 max-w-3xl">
            <p className="text-sm font-bold tracking-[0.2em] text-[#697b56] uppercase">
              Full-stack engineer for practical product teams
            </p>
            <h1
              className="mt-5 max-w-4xl text-4xl leading-[1.04] font-extrabold tracking-normal text-[#17231c] sm:text-6xl lg:text-7xl"
              style={{
                fontFamily: "Avenir Next, Segoe UI, Helvetica Neue, sans-serif",
              }}
            >
              Reliable full-stack engineer building useful products and
              practical AI systems.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#394a40] sm:text-xl sm:leading-9">
              I turn product ideas into working software across frontend,
              backend, AI workflows, and systems integration. The proof: a
              HackPrinceton-winning AI finance platform, a sponsored capstone
              product, and infrastructure-heavy full-stack work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#work"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#17231c] px-6 text-base font-bold !text-white shadow-[0_8px_18px_rgba(23,35,28,0.12)] transition hover:-translate-y-0.5 hover:bg-[#25372d]"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#aeb9a4] bg-white/78 px-6 text-base font-bold !text-[#17231c] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Contact Me
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {[
                "Hackathon Winner",
                "Capstone Frontend Developer",
                "AI + Full-Stack Projects",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#d1d9ca] bg-white/70 px-4 py-2 text-sm font-extrabold text-[#344238]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="min-w-0 max-w-full overflow-hidden rounded-[8px] border border-[#cdd7d9] bg-[#e9eff0] p-3 shadow-[0_12px_28px_rgba(30,43,34,0.08)] sm:p-4">
            <HackPrincetonCarousel slides={hackPrincetonCarousel} />
            <div className="grid gap-3 border-x border-b border-white/70 bg-white/82 p-4 sm:grid-cols-3">
              <ProofStat
                label="HackPrinceton"
                value="Best Business & Enterprise Hack"
              />
              <ProofStat label="Sponsor track" value="Best Use of Enter Pro" />
              <ProofStat label="Build window" value="Shipped in 36 hours" />
            </div>
          </div>
        </section>

        <section
          aria-labelledby="about-title"
          className="grid gap-8 border-y border-[#d7ddcf] py-12 lg:grid-cols-[0.3fr_0.46fr_0.24fr] lg:items-center"
        >
          <div>
            <p className="text-sm font-bold tracking-[0.2em] text-[#697b56] uppercase">
              About
            </p>
            <h2
              id="about-title"
              className="mt-3 text-3xl leading-tight font-extrabold tracking-normal"
              style={{
                fontFamily: "Avenir Next, Segoe UI, Helvetica Neue, sans-serif",
              }}
            >
              Fast builder habits, grounded engineering judgment.
            </h2>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-[#33433a] sm:text-xl sm:leading-9">
            I care about software that works for the person using it: clear
            flows, real data, reliable integrations, and fewer repeated tasks.
            My strongest work sits where product execution meets AI workflows
            and backend systems.
          </p>
          <figure className="max-w-xs overflow-hidden rounded-[8px] border border-[#d7ddcf] bg-white/72 p-3 shadow-[0_10px_24px_rgba(30,43,34,0.05)]">
            <div className="relative aspect-square overflow-hidden rounded-[8px] border border-[#d7ddcf] bg-[#e9eff0]">
              <Image
                src="/assets/headshot_square.jpg"
                alt="Headshot of Anthony Quispilaya."
                fill
                sizes="(min-width: 1024px) 22vw, 280px"
                className="object-cover"
              />
            </div>
            <figcaption className="px-1 pt-4">
              <p className="text-base font-extrabold text-[#17231c]">
                Anthony Quispilaya
              </p>
              <p className="mt-1 text-sm leading-6 text-[#506052]">
                Full-stack engineer building useful products and practical AI.
              </p>
            </figcaption>
          </figure>
        </section>

        <section id="experience" className="space-y-8">
          <SectionHeader
            eyebrow="Professional experience"
            title="Product work plus real support discipline."
            body="I bring frontend product execution from Tapyoca and troubleshooting instincts from Quest Technologies. That mix makes me useful on teams that need both shipping speed and reliability."
          />
          <div className="space-y-5">
            {experience.map((job) => (
              <article
                key={`${job.role}-${job.company}`}
                className="grid gap-6 rounded-[8px] border border-[#d7ddcf] bg-white/76 p-6 shadow-[0_10px_24px_rgba(30,43,34,0.05)] sm:p-7 lg:grid-cols-[0.28fr_0.72fr]"
              >
                <div>
                  <p className="text-sm font-bold tracking-[0.2em] text-[#697b56] uppercase">
                    {job.company}
                  </p>
                  <h3
                    className="mt-3 text-2xl font-extrabold tracking-normal text-[#17231c]"
                    style={{
                      fontFamily:
                        "Avenir Next, Segoe UI, Helvetica Neue, sans-serif",
                    }}
                  >
                    {job.role}
                  </h3>
                  <p className="mt-2 text-base font-bold text-[#506052]">
                    {job.dates}
                  </p>
                </div>
                <div>
                  <ul className="space-y-3">
                    {job.impact.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-base leading-7 text-[#38493f]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#697b56]"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[#eef3f2] px-3 py-2 text-xs font-bold text-[#41575c] ring-1 ring-[#cfd8da]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="space-y-8">
          <SectionHeader
            eyebrow="Key projects"
            title="The fastest path to understanding my value."
            body="These are arranged by recruiter relevance: award-winning AI finance work, sponsored frontend product execution, practical AI operations, then deeper systems integration."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {keyProjects.map((project, index) => (
              <article
                key={project.title}
                className={`flex h-full flex-col rounded-[8px] border border-[#d7ddcf] bg-white/76 p-6 shadow-[0_10px_24px_rgba(30,43,34,0.05)] sm:p-7 ${index === 0 ? "ring-2 ring-[#b7c4aa]" : ""}`}
              >
                {project.priority ? (
                  <p className="mb-4 w-fit rounded-full bg-[#eef3f2] px-3 py-1.5 text-xs font-extrabold tracking-[0.16em] text-[#41575c] uppercase ring-1 ring-[#cfd8da]">
                    {project.priority}
                  </p>
                ) : null}
                {project.image ? (
                  <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-[8px] border border-[#d7ddcf]">
                    <Image
                      src={project.image}
                      alt={
                        project.imageAlt ?? `${project.title} project image.`
                      }
                      fill
                      sizes="(min-width: 1024px) 42vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <p className="text-sm font-bold tracking-[0.2em] text-[#697b56] uppercase">
                  {project.eyebrow}
                </p>
                <h3
                  className="mt-3 text-3xl font-extrabold tracking-normal text-[#17231c]"
                  style={{
                    fontFamily:
                      "Avenir Next, Segoe UI, Helvetica Neue, sans-serif",
                  }}
                >
                  {project.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-[#425247]">
                  {project.body}
                </p>
                <div className="mt-6 space-y-3 border-t border-[#dfe5d9] pt-5">
                  <p className="text-base leading-7 text-[#506052]">
                    <strong className="block text-sm font-extrabold tracking-[0.14em] text-[#17231c] uppercase">
                      What I built
                    </strong>
                    {project.role}
                  </p>
                  <p className="text-base leading-7 text-[#506052]">
                    <strong className="block text-sm font-extrabold tracking-[0.14em] text-[#17231c] uppercase">
                      Result
                    </strong>
                    {project.result}
                  </p>
                </div>
                {project.stack ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[#eef3f2] px-3 py-2 text-xs font-bold text-[#41575c] ring-1 ring-[#cfd8da]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex min-h-10 items-center justify-center self-center rounded-full bg-[#17231c] px-5 text-sm font-bold !text-white transition hover:-translate-y-0.5 hover:bg-[#25372d]"
                  >
                    {project.linkLabel}
                  </a>
                ) : null}
              </article>
            ))}
          </div>

          <div className="rounded-[8px] border border-[#d7c8b4] bg-[#ece2d2] p-6 sm:p-7">
            <article className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr] lg:items-start">
              <div>
                <p className="text-sm font-bold tracking-[0.22em] text-[#775b38] uppercase">
                  Additional engineering proof
                </p>
                <h3
                  className="mt-3 max-w-3xl text-3xl font-extrabold tracking-normal text-[#352b20]"
                  style={{
                    fontFamily:
                      "Avenir Next, Segoe UI, Helvetica Neue, sans-serif",
                  }}
                >
                  {pythonProject.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-[#4f463a]">
                  {pythonProject.body}
                </p>
                <p className="mt-4 text-base leading-7 text-[#5a4d3c]">
                  <strong className="text-[#352b20]">Why it matters:</strong>{" "}
                  {pythonProject.proof}
                </p>
                <a
                  href={pythonProject.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mx-auto mt-6 flex min-h-10 w-fit items-center justify-center rounded-full bg-[#17231c] px-5 text-sm font-bold !text-white transition hover:-translate-y-0.5 hover:bg-[#25372d]"
                >
                  View Python project
                </a>
              </div>
              <div className="rounded-[8px] border border-[#d7c8b4] bg-white/50 p-5">
                <h4 className="text-lg font-extrabold leading-snug text-[#352b20]">
                  Tech stack
                </h4>
                <div className="mt-5 flex flex-wrap gap-2">
                  {pythonProject.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-white/72 px-3 py-2 text-xs font-bold text-[#4f463a] ring-1 ring-[#d7c8b4]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        <section id="proof" className="space-y-8">
          <SectionHeader
            eyebrow="External validation"
            title="Proof from outside the portfolio."
            body="A compact set of signals from official event materials, public posts, sponsor recognition, and stakeholder feedback."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {proofBlocks.map((block, index) => (
              <figure
                key={block.source}
                className={`rounded-[8px] border p-6 shadow-[0_10px_24px_rgba(30,43,34,0.04)] ${
                  index === 0
                    ? "border-[#b7c4aa] bg-white/82"
                    : "border-[#d7ddcf] bg-white/76"
                }`}
              >
                <figcaption className="text-sm font-bold tracking-[0.18em] text-[#697b56] uppercase">
                  {block.source}
                </figcaption>
                <blockquote
                  className={`mt-4 font-extrabold leading-snug tracking-normal text-[#17231c] ${
                    index === 0 ? "text-2xl" : "text-xl"
                  }`}
                >
                  &ldquo;{block.quote}&rdquo;
                </blockquote>
                <p className="mt-4 text-base leading-7 text-[#506052]">
                  {block.context}
                </p>
                {block.link ? (
                  <a
                    href={block.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mx-auto mt-5 flex min-h-10 w-fit items-center justify-center rounded-full bg-[#17231c] px-5 text-sm font-bold !text-white transition hover:-translate-y-0.5 hover:bg-[#25372d]"
                  >
                    {block.linkLabel}
                  </a>
                ) : null}
              </figure>
            ))}
          </div>
        </section>

        <section id="skills" className="space-y-8">
          <SectionHeader
            eyebrow="Capabilities"
            title="How I help a software team."
            body="No logo wall. These are the working strengths that show up across my projects and professional experience."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <article
                key={capability.title}
                className="rounded-[8px] border border-[#d7ddcf] bg-white/76 p-6"
              >
                <h3 className="text-xl font-extrabold leading-snug text-[#17231c]">
                  {capability.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-[#506052]">
                  {capability.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="contact"
          aria-labelledby="contact-title"
          className="grid gap-8 rounded-[8px] bg-[#17231c] p-7 text-white shadow-[0_12px_28px_rgba(23,35,28,0.1)] sm:p-10 lg:grid-cols-[0.68fr_0.32fr] lg:items-end"
        >
          <div>
            <p className="text-sm font-bold tracking-[0.22em] text-[#c8d6bb] uppercase">
              Contact
            </p>
            <h2
              id="contact-title"
              className="mt-3 max-w-3xl text-4xl font-extrabold tracking-normal"
              style={{
                fontFamily: "Avenir Next, Segoe UI, Helvetica Neue, sans-serif",
              }}
            >
              Ready to help a team ship useful software with care.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#dce5d7]">
              I&apos;m looking for full-stack, frontend, backend, AI automation,
              and software engineering opportunities where I can contribute to
              real products.
            </p>
          </div>
          <div className="grid gap-3 text-sm font-bold sm:grid-cols-3 lg:grid-cols-1">
            <a
              className="rounded-full bg-white px-5 py-3 text-center !text-[#17231c] transition hover:-translate-y-0.5"
              href="mailto:anthonyquispilaya@gmail.com"
            >
              Email me
            </a>
            <a
              className="rounded-full border border-white/30 px-5 py-3 text-center !text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              href="https://www.linkedin.com/in/anthony-quispilaya/"
              rel="noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
            <a
              className="rounded-full border border-white/30 px-5 py-3 text-center !text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              href="https://github.com/Anthony-Quispilaya"
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

function ProofStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-[#d7ddcf] bg-white/72 p-4">
      <p className="text-xs font-bold tracking-[0.18em] text-[#697b56] uppercase">
        {label}
      </p>
      <p className="mt-2 text-base font-extrabold leading-6 text-[#17231c]">
        {value}
      </p>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-bold tracking-[0.22em] text-[#697b56] uppercase">
        {eyebrow}
      </p>
      <h2
        className="mt-3 text-4xl font-extrabold tracking-normal text-[#17231c]"
        style={{
          fontFamily: "Avenir Next, Segoe UI, Helvetica Neue, sans-serif",
        }}
      >
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-[#506052] sm:text-lg">
        {body}
      </p>
    </div>
  );
}
