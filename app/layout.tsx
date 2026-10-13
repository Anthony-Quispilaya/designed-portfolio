import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { themeScript } from "@/lib/theme";
import { site } from "@/content/site";
import { experience } from "@/content/profile";

import "./globals.css";

// One type family: Geist for text, Geist Mono for labels and code. They are
// drawn as a pair, so metrics and shapes match.
const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const title = `${site.name} | Software Engineer`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name, url: site.url }],
  keywords: [
    "Anthony Quispilaya",
    "software engineer",
    "full-stack developer",
    "game developer",
    "IT technician",
    "React Native",
    "React",
    "TypeScript",
    "Supabase",
    "Godot",
    "Blender",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Anthony Quispilaya, software engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: ["/og.png"],
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0d" },
  ],
  colorScheme: "light dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: "Software Engineer",
  worksFor: { "@type": "Organization", name: experience[0].company },
  alumniOf: { "@type": "CollegeOrUniversity", name: "New Jersey Institute of Technology" },
  knowsLanguage: ["English", "Spanish"],
  knowsAbout: ["React", "React Native", "TypeScript", "Supabase", "PostgreSQL", "Godot", "Blender", "Three.js", "IT support", "Networking"],
  sameAs: [site.github, site.linkedin],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Marks the document as JS-capable before paint so reveal styles only
            apply when they can actually be undone. Without JS, everything shows. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {/* Applies the saved or system theme before paint, so dark mode never flashes light. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
