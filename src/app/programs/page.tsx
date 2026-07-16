import { Metadata } from "next";
import { getEcosystemData } from "@/utils/getData";
import ProgramsPageClient from "./ProgramsPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ecosystem Programs | Layerz",
  description: "Explore builder programs, fellowships, university chapters, and innovation hackathons run by the Layerz Foundation. Apply now to start building.",
  keywords: ["Builder Program", "University Hackathons", "Solidity Fellowships", "Layerz Cohorts", "Campus Chapters"],
};

interface Program {
  id: string;
  title: string;
  tagline: string;
  description: string;
  status: string;
  duration: string;
  features: string[];
}

export default async function ProgramsPage() {
  const programs = await getEcosystemData<Program>("programs.json");

  // Create JSON-LD Course / EducationalProgram schema for search/answer engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": programs.map((prog) => ({
      "@type": "EducationalOccupationalProgram",
      "@id": `https://layerz.xyz/programs#${prog.id}`,
      "name": prog.title,
      "description": prog.description,
      "provider": {
        "@type": "Organization",
        "name": "Layerz Foundation",
        "url": "https://layerz.xyz"
      },
      "timeToComplete": prog.duration,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "category": "Free Builder Education"
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProgramsPageClient initialPrograms={programs} />
    </>
  );
}
