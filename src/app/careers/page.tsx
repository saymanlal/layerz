import { Metadata } from "next";
import Link from "next/link";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";

export const metadata: Metadata = {
  title: "Careers | Layerz Ecosystem",
  description: "Work on the frontier of AI, smart contracts, and product design. Explore open developer, design, and research opportunities at Layerz.",
  keywords: ["Web3 Jobs", "Solidity Developer Careers", "Next.js Jobs", "Product Designer Remote", "AI Engineering Jobs"],
};

export default function CareersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Careers | Layerz Ecosystem",
    "description": "Work on the frontier of AI, smart contracts, and product design. Explore open developer, design, and research opportunities at Layerz."
  };

  const jobs = [
    {
      id: "job-1",
      title: "Senior Smart Contract Auditor",
      department: "Layerz Labs",
      location: "Remote / Toronto Hub",
      type: "Full-Time",
      desc: "Auditing complex multi-chain protocols, researching EVM security vectors, and advising developer teams on gas optimizations."
    },
    {
      id: "job-2",
      title: "Lead UI/UX Product Designer",
      department: "Layerz Studio",
      location: "Remote / London Hub",
      type: "Full-Time",
      desc: "Creating typography guidelines, design tokens, smart account user interfaces, and complex interactive dashboard components."
    },
    {
      id: "job-3",
      title: "Full Stack Next.js & AI Engineer",
      department: "Layerz Studio",
      location: "Remote / San Francisco Hub",
      type: "Contract to Hire",
      desc: "Building low-latency Next.js client products, configuring AI pipeline automations, and deploying GitHub-backed CMS tools."
    },
    {
      id: "job-4",
      title: "Community Relations Manager",
      department: "Layerz Foundation",
      location: "Remote",
      type: "Part-Time",
      desc: "Onboarding campus chapters, coordinating hackathon schedules, and nurturing student builder cohorts globally."
    }
  ];

  const benefits = [
    { title: "Remote-First", desc: "Work from anywhere in the world. Access our hubs in Toronto, London, and SF." },
    { title: "Learning Budget", desc: "$2,000 yearly stipend for books, conferences, smart contract certifications, or AI credits." },
    { title: "Ecosystem Allowances", desc: "Access grants, developer audits, design reviews, and token allocation setups." },
    { title: "Hardware Stipend", desc: "We provide top-tier hardware setups, monitors, and designer workspace coordinates." }
  ];

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <div className="relative h-[450px] w-full border-b border-[#eaeaea] bg-gradient-to-b from-white to-[#f5f5ff] overflow-hidden">
        <ThreeDBlockBg colorType="default" opacity={0.4} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        
        <div className="max-w-4xl mx-auto px-4 pt-32 text-center relative z-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B88F8] bg-[#f0f0ff] border border-[#dad9fc] px-4 py-1.5 rounded-full inline-block mb-6">
            Join the Team
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#111111] mb-6 leading-none">
            Build the Future of Infrastructure
          </h1>
          <p className="text-lg md:text-xl text-[#5C5C5C] max-w-2xl mx-auto leading-relaxed">
            We are looking for ambitious developers, designers, writers, and community builders who want to create long-term ecosystem value.
          </p>
        </div>
      </div>

      {/* Open Roles list */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#111111]">Open Opportunities</h2>
          <p className="text-sm text-[#5c5c5c] mt-2">Explore active positions across our Foundation, Studio, and Labs.</p>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="premium-card p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="space-y-2 flex-grow">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#f5f5f5] border border-[#eaeaea] text-[9px] font-mono text-[#5c5c5c]">
                    {job.department}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{job.location}</span>
                </div>
                <h3 className="text-xl font-bold text-[#111111]">{job.title}</h3>
                <p className="text-xs text-[#5C5C5C] leading-relaxed max-w-xl">{job.desc}</p>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <span className="text-xs font-semibold text-gray-500 font-mono hidden sm:inline">{job.type}</span>
                <Link
                  href={`/contact?role=${encodeURIComponent(job.title)}`}
                  className="flex-1 md:flex-initial text-center px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-xs font-bold text-white uppercase tracking-wider transition-colors duration-200"
                >
                  Apply
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-[#fafafa] border-y border-[#eaeaea] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B88F8]">Perks</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111] mt-2 mb-4">Ecosystem Benefits</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((ben, idx) => (
              <div key={idx} className="p-6 bg-white border border-[#eaeaea] rounded-xl shadow-xs">
                <h4 className="font-bold text-[#111111] mb-2">{ben.title}</h4>
                <p className="text-xs text-[#5C5C5C] leading-relaxed">{ben.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
