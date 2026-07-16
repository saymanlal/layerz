import { Metadata } from "next";
import { getEcosystemData } from "@/utils/getData";
import MembersPageClient from "./MembersPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Members Directory | Layerz Ecosystem",
  description: "Check the directory logs of designers, Solidity developers, research authors, and startup mentors active within the Layerz Ecosystem.",
  keywords: ["Solidity Developers Directory", "Web3 Designers", "AI Researchers", "Layerz Members", "Chapter Members Log"],
};

interface CheckInHistoryItem {
  timestamp: string;
  location: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  github: string;
  twitter: string;
  checkedIn: boolean;
  lastCheckIn: string;
  skills: string[];
  checkInHistory: CheckInHistoryItem[];
}

export default async function MembersPage() {
  const members = await getEcosystemData<Member>("members.json");

  // Create JSON-LD ItemList structured data for search and answer engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Layerz Ecosystem Members Directory",
    "description": "Check the directory logs of designers, Solidity developers, research authors, and startup mentors active within the Layerz Ecosystem.",
    "numberOfItems": members.length,
    "itemListElement": members.map((mem, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Person",
        "name": mem.name,
        "jobTitle": mem.role,
        "sameAs": [
          `https://github.com/${mem.github}`,
          `https://twitter.com/${mem.twitter}`
        ]
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MembersPageClient initialMembers={members} />
    </>
  );
}
