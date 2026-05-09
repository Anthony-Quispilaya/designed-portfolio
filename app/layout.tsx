import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

const siteTitle = "Anthony Quispilaya | Full-Stack Engineer";
const siteDescription =
  "Full-stack engineer building user-focused products, practical AI systems, and reliable systems integrations.";

function getSiteUrl() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com");
  } catch {
    return new URL("https://example.com");
  }
}

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | Anthony Quispilaya`,
  },
  description: siteDescription,
  metadataBase: getSiteUrl(),
  applicationName: "Anthony Quispilaya Portfolio",
  icons: {
    icon: "/icon.svg",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
