import { Metadata } from "next";
import { getEcosystemData } from "@/utils/getData";
import AboutPageClient from "./AboutPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Story & Network | Layerz Ecosystem",
  description: "Learn about the mission, values, and builders of Layerz—a global innovation ecosystem. Meet our engineering team, active community chapters, past sponsors, and venture investors.",
  keywords: [
    "Layerz Team", 
    "Layerz Investors", 
    "Layerz Sponsors", 
    "Layerz Community Partners", 
    "Web3 Startup Incubator", 
    "AI Systems Engineering",
    "Open Source Contributors"
  ],
  openGraph: {
    title: "Our Story & Network | Layerz Ecosystem",
    description: "Learn about the mission, values, and builders of Layerz—a global innovation ecosystem.",
    images: [{ url: "/logo-org.jpg" }],
    type: "website",
  }
};

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
}

interface Partnership {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  type: string; // partner, sponsor, investor
  tier: string;
  featured: boolean;
}

export default async function AboutPage() {
  const [members, partnerships] = await Promise.all([
    getEcosystemData<Member>("members.json"),
    getEcosystemData<Partnership>("partnerships.json")
  ]);

  // JSON-LD schema markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": "https://layerz.xyz/about/#about",
    "name": "Our Story | Layerz Ecosystem",
    "description": "Learn about the mission, values, and story of Layerz—a global innovation ecosystem.",
    "publisher": {
      "@type": "Organization",
      "name": "Layerz Ecosystem",
      "logo": {
        "@type": "ImageObject",
        "url": "https://layerz.xyz/logo-org.jpg"
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": members.map((m, idx) => ({
        "@type": "Person",
        "position": idx + 1,
        "name": m.name,
        "jobTitle": m.role,
        "sameAs": `https://github.com/${m.github}`
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutPageClient
        initialMembers={members}
        partnerships={partnerships}
      />
    </>
  );
}
