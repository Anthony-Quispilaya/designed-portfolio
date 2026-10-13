import type { Metadata } from "next";

import { CaseStudyShell } from "@/components/layout/case-study-shell";
import { MatchPointChapter } from "@/components/matchpoint/matchpoint-chapter";
import { matchpoint } from "@/content/matchpoint";

export const metadata: Metadata = {
  title: "MatchPoint case study",
  description: matchpoint.oneLiner,
  alternates: { canonical: "/work/matchpoint/" },
};

export default function MatchPointPage() {
  return (
    <CaseStudyShell>
      <MatchPointChapter />
    </CaseStudyShell>
  );
}
