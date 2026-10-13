import { withBase } from "@/lib/base-path";

// Identity, links, and page-level copy. Everything here is sourced from the
// resume (Oct 2026), the NJIT diploma, and docs/portfolio/PROOF.md.

export const site = {
  name: "Anthony Quispilaya",
  shortName: "Anthony",
  initials: "AQ",
  role: "Software Engineer",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.anthonyjquispilaya.com",
  email: "anthonyquispilaya@gmail.com",
  github: "https://github.com/Anthony-Quispilaya",
  linkedin: "https://www.linkedin.com/in/anthony-quispilaya/",
  resume: withBase("/Anthony_Quispilaya_Resume.pdf"),
  location: "New Jersey",
  languages: "English and Spanish",
  description:
    "Anthony Quispilaya is a versatile software engineer and technician who builds applications people use, from a production React Native volleyball platform and its Postgres backend to a 3D volleyball game made in Godot and Blender.",
};

export const nav = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export const hero = {
  kicker: "Software Engineer · New Jersey",
  intro:
    "I build web and mobile apps that people actually use, for the companies I work with and for myself. I enjoy exploring new areas and picking up new skills with every project. Open to software engineering roles.",
  now: {
    label: "Now",
    text: "Software Engineer at MatchPoint.",
  },
  facts: [
    { k: "Degree", v: "B.S. IT, NJIT · Cum Laude" },
    { k: "Focus", v: "Full-stack web & mobile" },
    { k: "Languages", v: "English, Spanish" },
  ],
};
