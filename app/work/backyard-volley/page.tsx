import type { Metadata } from "next";

import { CaseStudyShell } from "@/components/layout/case-study-shell";
import { VolleyChapter } from "@/components/volley/volley-chapter";
import { volley } from "@/content/backyard-volley";

export const metadata: Metadata = {
  title: "Backyard Volley case study",
  description: volley.intro,
  alternates: { canonical: "/work/backyard-volley/" },
};

export default function BackyardVolleyPage() {
  return (
    <CaseStudyShell>
      <VolleyChapter />
    </CaseStudyShell>
  );
}
