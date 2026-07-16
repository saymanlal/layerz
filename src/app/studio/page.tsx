import { Metadata } from "next";
import { getEcosystemData } from "@/utils/getData";
import StudioPageClient from "./StudioPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studio Work & Case Studies | Layerz",
  description: "Explore product design, Web3 development, and AI solutions crafted by Layerz Studio. See project outcomes, challenges, and technologies used.",
  keywords: ["Product Design Portfolio", "UI/UX Case Studies", "Solidity Auditing Cases", "Next.js Web Projects", "Layerz Studio Portfolio"],
};

interface Project {
  id: string;
  title: string;
  category: string;
  client: string;
  description: string;
  challenge: string;
  solution: string;
  outcome: string;
  technologies: string[];
  featured: boolean;
}

export default async function StudioPage() {
  const projects = await getEcosystemData<Project>("studio.json");

  // Create JSON-LD CreativeWork/Project schemas for search and answer engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": projects.map((proj) => ({
      "@type": "CreativeWork",
      "@id": `https://layerz.xyz/studio#${proj.id}`,
      "name": proj.title,
      "headline": proj.title,
      "description": proj.description,
      "genre": proj.category,
      "author": {
        "@type": "Organization",
        "name": "Layerz Studio"
      },
      "provider": {
        "@type": "Organization",
        "name": "Layerz Ecosystem",
        "url": "https://layerz.xyz"
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StudioPageClient initialProjects={projects} />
    </>
  );
}
