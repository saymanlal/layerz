import { Metadata } from "next";
import { getEcosystemData } from "@/utils/getData";
import HomePageClient from "./HomePageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Layerz | Global Innovation Ecosystem",
  description: "Layerz is a global innovation ecosystem empowering builders, creators, startups, and communities through technology, design, education, and collaboration.",
  keywords: [
    "Layerz Ecosystem", 
    "Web3 Builders Network", 
    "Product Design Studio", 
    "AI Systems Engineering", 
    "Smart Contract Audit", 
    "Campus Hackathons",
    "Open Source Protocol Lab"
  ],
  openGraph: {
    title: "Layerz | Global Innovation Ecosystem",
    description: "Layerz is a global innovation ecosystem empowering builders, creators, startups, and communities through technology, design, education, and collaboration.",
    images: [{ url: "/logo-org.jpg" }],
    type: "website",
  }
};

interface Program {
  id: string;
  title: string;
  tagline: string;
  description: string;
  status: string;
  duration: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  client: string;
  description: string;
  outcome: string;
  technologies: string[];
  featured: boolean;
}

interface Member {
  id: string;
  name: string;
  role: string;
  checkedIn: boolean;
}

interface Partner {
  id: string;
  name: string;
  website: string;
  type: string;
  featured: boolean;
}

interface Blog {
  id: string;
  title: string;
  category: string;
  summary: string;
  date: string;
  readTime: string;
  slug: string;
  featured: boolean;
}

export default async function Home() {
  // Load data dynamically from private repo / local fallback
  const [programs, studioWork, members, partners, blogs] = await Promise.all([
    getEcosystemData<Program>("programs.json"),
    getEcosystemData<Project>("studio.json"),
    getEcosystemData<Member>("members.json"),
    getEcosystemData<Partner>("partnerships.json"),
    getEcosystemData<Blog>("blogs.json")
  ]);

  // SEO/AEO JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://layerz.xyz/#organization",
    "name": "Layerz Ecosystem",
    "url": "https://layerz.xyz",
    "logo": "https://layerz.xyz/logo-org.jpg",
    "image": "https://layerz.xyz/logo-org.jpg",
    "description": "Layerz is a global innovation ecosystem empowering builders, creators, startups, and communities through technology, design, education, and collaboration.",
    "sameAs": [
      "https://x.com/layerz_eco",
      "https://github.com/layerz-eco"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "technical support",
      "email": "support@layerz.xyz"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageClient
        programs={programs}
        studioWork={studioWork}
        members={members}
        partners={partners}
        blogs={blogs}
      />
    </>
  );
}
