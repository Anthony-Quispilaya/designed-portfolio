// Every project on the home page, in one shape: a card that answers "what,
// my part, result" at a glance, and details that open in a dialog.
// The two featured projects reuse their case-study content; the rest come
// from the project index. No new claims are made here.

import { stages, volley, volleyOutcome } from "@/content/backyard-volley";
import { matchpoint, outcome, paymentsStory, redesign } from "@/content/matchpoint";
import { projectIndex } from "@/content/projects";

export type WorkItem = {
  id: string;
  name: string;
  year: string;
  kind: string;
  badge?: string;
  /** one line: what it is */
  summary: string;
  roleShort: string;
  highlight: string;
  stack: string[];
  featured?: boolean;
  // ---- dialog
  sections: { label: string; text: string }[];
  list?: { label: string; items: string[] };
  features?: string[];
  links: { label: string; href: string }[];
  /** route of the full interactive case study, if there is one */
  caseStudy?: string;
  /** shown when there are no public links */
  linkNote?: string;
  image?: { src: string; alt: string; width: number; height: number };
};

const mp: WorkItem = {
  id: "matchpoint",
  name: matchpoint.name,
  year: "2026",
  kind: "Production mobile app",
  badge: "Current role",
  summary: matchpoint.oneLiner,
  roleShort: "Software Engineer · app redesign, social features, payments",
  highlight: "Led a research-driven redesign and shipped friends, group chats, waivers, and a new payment portal",
  stack: [...matchpoint.stack],
  featured: true,
  sections: [
    { label: "User research", text: redesign.research },
    { label: "Redesign", text: redesign.design },
    { label: "Friends & chats", text: redesign.social },
    { label: "Events & payments", text: redesign.events },
    { label: "Payments & receipts", text: paymentsStory.body },
  ],
  list: { label: "What I shipped", items: [...redesign.features, outcome.delivered[4]] },
  links: [],
  caseStudy: "/work/matchpoint/",
  linkNote: "Private company codebase. The case study walks through the architecture instead.",
};

const bv: WorkItem = {
  id: "backyard-volley",
  name: volley.name,
  year: "2026",
  kind: "My own 3D game",
  badge: "Solo project",
  summary:
    "Arcade volleyball where you move by hand and aim every hit with the mouse: 1v1 to 6v6, bots that run real plays, and online matches with friends.",
  roleShort: volley.role,
  highlight: "A complete, playable game: 17.4k lines of GDScript, Blender art pipeline, online play",
  stack: [...volley.stack],
  featured: true,
  sections: [
    { label: "What it is", text: volley.intro },
    ...stages.map((s) => ({ label: s.title, text: `${s.lede} ${s.body[0]}` })),
  ],
  list: { label: "Delivered", items: [...volleyOutcome.delivered] },
  links: [],
  caseStudy: "/work/backyard-volley/",
  linkNote: volleyOutcome.review,
  image: {
    src: "/work/volley/spike-solid-1280.webp",
    alt: "Backyard Volley gameplay: a CPU player spikes over the net with a burst at the contact point.",
    width: 1280,
    height: 720,
  },
};

const rest: WorkItem[] = projectIndex.map((p) => ({
  id: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  name: p.name,
  year: p.year,
  kind: p.kind,
  badge: p.badge,
  summary: p.purpose,
  roleShort: p.roleShort,
  highlight: p.highlight,
  stack: p.stack,
  sections: [
    { label: "Problem", text: p.problem },
    { label: "Solution", text: p.solution },
    { label: "How it scales", text: p.scale },
    { label: "My part", text: p.role },
    { label: p.outcome.label, text: p.outcome.text },
  ],
  features: p.features,
  links: p.links,
  linkNote: p.links.length ? undefined : "Internal company tool (private repository).",
  image: p.image,
}));

export const work: WorkItem[] = [mp, bv, ...rest];
