import { Metadata } from "next";
import { getEcosystemData } from "@/utils/getData";
import ResourcesPageClient from "./ResourcesPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resources & Playbooks | Layerz",
  description: "Browse free guides, startup pitch deck templates, product requirements documents, and blockchain development toolkits compiled by Layerz.",
  keywords: ["Startup Templates", "Pitch Deck PDF", "Smart Contract Guide", "Product Brief Template", "Layerz Builder Playbook"],
};

interface Resource {
  id: string;
  title: string;
  category: string;
  type: string;
  description: string;
  downloadUrl: string;
  tags: string[];
}

export default async function ResourcesPage() {
  const resources = await getEcosystemData<Resource>("resources.json");

  // Create JSON-LD CreativeWork/MediaObject schema graph for search/answer engine optimization
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": resources.map((res) => ({
      "@type": "CreativeWork",
      "@id": `https://layerz.xyz/resources#${res.id}`,
      "name": res.title,
      "description": res.description,
      "genre": res.category,
      "learningResourceType": res.type,
      "publisher": {
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
      <ResourcesPageClient initialResources={resources} />
    </>
  );
}
