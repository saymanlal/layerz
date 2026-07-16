import { Metadata } from "next";
import { getEcosystemData } from "@/utils/getData";
import EventsPageClient from "./EventsPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events & Hackathons | Layerz Ecosystem",
  description: "Join upcoming events, hackathons, and builder demo days organized by the Layerz innovation ecosystem. Learn, build, and scale with global developer chapters.",
  keywords: ["Layerz Hackathons", "Web3 Developer Events", "AI Hackathon 2026", "Toronto Builders Demo Day", "Developer Community Events"],
  openGraph: {
    title: "Events & Hackathons | Layerz Ecosystem",
    description: "Join upcoming events, hackathons, and builder demo days organized by the Layerz innovation ecosystem.",
    type: "website",
  }
};

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  lumaLink: string;
  type: string;
  image: string;
  attendeesCount: number;
  capacity: number;
  sponsors: string[];
  speakers: string[];
}

export default async function EventsPage() {
  const events = await getEcosystemData<Event>("events.json");

  // Create JSON-LD structured data for search and answer engines (AEO/GEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": events.map((ev) => ({
      "@type": "Event",
      "@id": `https://layerz.xyz/events#${ev.id}`,
      "name": ev.title,
      "description": ev.description,
      "startDate": ev.date,
      "location": {
        "@type": "Place",
        "name": ev.location.includes("Virtual") ? "Virtual Event" : ev.location,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": ev.location
        }
      },
      "offers": {
        "@type": "Offer",
        "url": ev.lumaLink,
        "price": "0",
        "priceCurrency": "USD",
        "availability": ev.attendeesCount >= ev.capacity ? "https://schema.org/SoldOut" : "https://schema.org/InStock"
      },
      "performer": ev.speakers.map(s => ({
        "@type": "Person",
        "name": s
      })),
      "organizer": {
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
      <EventsPageClient initialEvents={events} />
    </>
  );
}
