import { Metadata } from "next";
import { getEcosystemData } from "@/utils/getData";
import RoadmapPageClient from "./RoadmapPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ecosystem Roadmap | Layerz",
  description: "Review the quarterly milestones, releases, open-source developments, and chapters rollout on the Layerz Ecosystem roadmap.",
  keywords: ["Ecosystem Roadmap", "Project Releases", "Developer Timelines", "Solidity Auditing Milestones", "Layerz Releases"],
};

interface Quarter {
  id: string;
  quarter: string;
  title: string;
  description: string;
  status: string;
  milestones: string[];
}

export default async function RoadmapPage() {
  const roadmap = await getEcosystemData<Quarter>("roadmap.json");

  // Create JSON-LD ItemList structured data representing the roadmap sequence
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Layerz Ecosystem Roadmap Timeline",
    "description": "Review the quarterly milestones, releases, open-source developments, and chapters rollout on the Layerz Ecosystem roadmap.",
    "numberOfItems": roadmap.length,
    "itemListElement": roadmap.map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "CreativeWork",
        "name": item.title,
        "headline": `${item.quarter} Milestone`,
        "description": item.description
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RoadmapPageClient initialRoadmap={roadmap} />
    </>
  );
}
