import { Metadata } from "next";
import Link from "next/link";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";
import { getEcosystemData } from "@/utils/getData";

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
    images: [{ url: "/logo-bg.jpg" }]
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

  const investors = partnerships.filter(p => p.type === "investor");
  const communityPartners = partnerships.filter(p => p.type === "partner" || p.type === "community_partner");
  const sponsors = partnerships.filter(p => p.type === "sponsor");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Our Story | Layerz Ecosystem",
    "description": "Learn about the mission, values, and story of Layerz—a global innovation ecosystem.",
    "publisher": {
      "@type": "Organization",
      "name": "Layerz Ecosystem",
      "logo": "https://layerz.xyz/logo-org.jpg"
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
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <div className="relative h-[480px] w-full border-b border-[#eaeaea] bg-gradient-to-b from-white to-[#f5f5ff] overflow-hidden">
        <ThreeDBlockBg colorType="default" opacity={0.5} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        
        <div className="max-w-6xl mx-auto px-4 pt-32 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 text-left">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B88F8] bg-[#f0f0ff] border border-[#dad9fc] px-4 py-1.5 rounded-full inline-block mb-6">
              Core Genesis
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#111111] mb-6 leading-none">
              Building the Infrastructure <br />
              for the Next Generation of Builders.
            </h1>
            <p className="text-lg text-[#5C5C5C] max-w-2xl leading-relaxed">
              Layerz is a global innovation ecosystem dedicated to empowering builders, creators, startups, researchers, and communities through technology, design, education, and collaboration.
            </p>
          </div>
          
          <div className="hidden lg:block lg:col-span-4">
            {/* Technical system architecture GIF instead of placeholder/emoji */}
            <div className="rounded-xl border border-[#eaeaea] bg-white p-2 shadow-lg overflow-hidden relative">
              <img 
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHB1dWd5NzJ3Mzl1ZHptbjY0aTF2Z3pncjRxbnAwOHd3ZnpycjBpZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tn33aiTi1jkl6H6/giphy.gif" 
                alt="System Architecture Diagram" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded border border-[#eaeaea] text-[10px] font-mono text-gray-500 flex justify-between">
                <span>GENESIS_BLOCK_LOG</span>
                <span className="text-green-600 animate-pulse">● SECURE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story section */}
      <section className="max-w-6xl mx-auto px-4 py-20 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B88F8]">Our Foundations</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111] mt-2 mb-6 tracking-tight">
            Every Great Innovation Begins with a Strong Foundation.
          </h2>
          <p className="text-sm text-[#5C5C5C] leading-relaxed mb-4">
            Layerz was founded with a simple belief: innovation shouldn't be limited by geography, background, or access to opportunities.
          </p>
          <p className="text-sm text-[#5C5C5C] leading-relaxed mb-4">
            Across the world, millions of talented individuals have the potential to build extraordinary things—but often lack the right community, mentorship, resources, and ecosystem. Layerz exists to bridge that gap.
          </p>
          <p className="text-sm text-[#5C5C5C] leading-relaxed">
            We are creating an ecosystem where learning leads to building, building leads to innovation, and innovation creates lasting impact.
          </p>
        </div>
        
        <div className="p-8 rounded-2xl bg-[#fafafa] border border-[#eaeaea] flex flex-col justify-center relative min-h-[300px] shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#89F336]/10 rounded-full blur-2xl"></div>
          <span className="text-6xl block mb-6 text-[#8B88F8] font-serif">“</span>
          <blockquote className="text-xl font-medium text-[#111111] leading-relaxed mb-4 italic">
            The future isn't built in a single breakthrough. It's built layer by layer.
          </blockquote>
          <cite className="text-xs font-bold uppercase tracking-wider text-[#5C5C5C] block">
            — Layerz Design Team
          </cite>
        </div>
      </section>

      {/* Dynamic Team Grid */}
      <section className="max-w-6xl mx-auto px-4 py-20 border-t border-[#eaeaea]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#89F336]">Active Chapters</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111] mt-2 mb-4 tracking-tight">Our Core Builders & Contributors</h2>
          <p className="text-sm text-[#5C5C5C] max-w-md mx-auto">
            Meet the developers, designers, founders, and mentors coordinating smart systems across our global chapters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400 text-xs font-mono">
              [NO_BUILDERS_LOGGED_IN_REGISTRY]
            </div>
          ) : (
            members.map((member) => (
              <div 
                key={member.id} 
                className="premium-card p-6 flex flex-col justify-between hover:border-[#dad9fc] transition-all duration-300"
              >
                <div>
                  {/* Status Banner */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-mono text-gray-400">ID: {member.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${member.checkedIn ? 'bg-[#89F336] animate-pulse' : 'bg-gray-300'}`}></span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">
                        {member.checkedIn ? "Active" : "Offline"}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-lg text-[#111111]">{member.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8B88F8] mb-4">{member.role}</p>
                  
                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1 mb-6">
                    {member.skills?.map((skill) => (
                      <span 
                        key={skill} 
                        className="px-2 py-0.5 rounded bg-[#f5f5f5] border border-[#eaeaea] text-[9px] font-mono text-gray-500"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Developer social contacts */}
                <div className="border-t border-[#f5f5f5] pt-4 flex items-center justify-between">
                  <a 
                    href={`https://github.com/${member.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono font-bold text-[#111111] hover:text-[#8B88F8] transition-colors"
                  >
                    github/{member.github}
                  </a>
                  <a 
                    href={`https://x.com/${member.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono font-bold text-gray-400 hover:text-[#8B88F8] transition-colors"
                  >
                    x/{member.twitter}
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Corporate network section */}
      <section className="bg-[#fafafa] border-y border-[#eaeaea] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B88F8]">The Network</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111] mt-2 mb-4 tracking-tight">Sponsors, Investors & Partners</h2>
            <p className="text-sm text-[#5C5C5C] max-w-md mx-auto">
              Our ecosystem stands on the shoulders of organizations backing digital infrastructure and early startups.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Investors Column */}
            <div className="bg-white p-8 rounded-2xl border border-[#eaeaea] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-6 rounded bg-purple-50 border border-purple-200 flex items-center justify-center text-[#8B88F8]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-extrabold text-base text-[#111111]">Venture Capital & Investors</h3>
                </div>
                <p className="text-xs text-[#5c5c5c] leading-relaxed mb-6">
                  Past venture capital backers and seed funds supporting Layerz founders and venture pipelines.
                </p>
                
                <div className="space-y-3">
                  {investors.length === 0 ? (
                    <p className="text-xs text-gray-400 font-mono">[NO_INVESTORS_REGISTERED]</p>
                  ) : (
                    investors.map((item) => (
                      <a 
                        key={item.id} 
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border border-[#eaeaea] hover:border-[#8B88F8] hover:bg-[#fcfcff] transition-all"
                      >
                        <span className="font-bold text-xs text-[#111111]">{item.name}</span>
                        <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-purple-50 text-[#8B88F8] border border-purple-100 font-bold">{item.tier} Backer</span>
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Community Partners Column */}
            <div className="bg-white p-8 rounded-2xl border border-[#eaeaea] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-6 rounded bg-green-50 border border-green-200 flex items-center justify-center text-[#89F336]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-extrabold text-base text-[#111111]">Community Partners</h3>
                </div>
                <p className="text-xs text-[#5c5c5c] leading-relaxed mb-6">
                  Ecosystem nodes, builder chapters, and student university networks collaborating with Layerz.
                </p>
                
                <div className="space-y-3">
                  {communityPartners.length === 0 ? (
                    <p className="text-xs text-gray-400 font-mono">[NO_COMMUNITY_PARTNERS]</p>
                  ) : (
                    communityPartners.map((item) => (
                      <a 
                        key={item.id} 
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border border-[#eaeaea] hover:border-[#89F336] hover:bg-[#fcfdfc] transition-all"
                      >
                        <span className="font-bold text-xs text-[#111111]">{item.name}</span>
                        <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-green-50 text-[#2d5a08] border border-green-100 font-bold">Node</span>
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Strategic Tech Sponsors Column */}
            <div className="bg-white p-8 rounded-2xl border border-[#eaeaea] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-6 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="font-extrabold text-base text-[#111111]">Strategic Tech Sponsors</h3>
                </div>
                <p className="text-xs text-[#5c5c5c] leading-relaxed mb-6">
                  Technology foundation giants sponsoring developer resources, gas matching, and cloud grants.
                </p>
                
                <div className="space-y-3">
                  {sponsors.length === 0 ? (
                    <p className="text-xs text-gray-400 font-mono">[NO_SPONSORS_REGISTERED]</p>
                  ) : (
                    sponsors.map((item) => (
                      <a 
                        key={item.id} 
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border border-[#eaeaea] hover:border-blue-400 hover:bg-[#fcfdff] transition-all"
                      >
                        <span className="font-bold text-xs text-[#111111]">{item.name}</span>
                        <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 font-bold">{item.tier} Sponsor</span>
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-20 border-b border-[#eaeaea]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-8 rounded-2xl bg-[#fafafa] border border-[#eaeaea] shadow-xs">
            <div className="h-10 w-10 rounded-lg bg-[#8B88F8]/10 flex items-center justify-center text-[#8B88F8] mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
            <p className="text-xs text-[#5C5C5C] leading-relaxed">
              To empower the next generation of innovators by creating an ecosystem where education, technology, design, research, and entrepreneurship come together to solve meaningful problems and shape the future.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#fafafa] border border-[#eaeaea] shadow-xs">
            <div className="h-10 w-10 rounded-lg bg-[#89F336]/10 flex items-center justify-center text-[#89F336] mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
            <p className="text-xs text-[#5C5C5C] leading-relaxed">
              To become the world's most trusted innovation ecosystem—connecting people, ideas, and technology to build solutions that create lasting global impact.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-4xl mx-auto px-4 pt-20">
        <div className="rounded-2xl border border-[#eaeaea] bg-gradient-to-br from-white to-[#f5f5ff] p-8 md:p-12 text-center shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#89F336]/10 rounded-full blur-2xl"></div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#111111] mb-4">Join the Next Layer of Innovation</h3>
          <p className="text-sm text-[#5C5C5C] max-w-xl mx-auto mb-8">
            Whether you're building your first project or your next company, Layerz is where ideas grow into impact.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/ecosystem" className="px-6 py-3 border border-[#111111] text-xs font-bold uppercase hover:bg-[#89F336] hover:text-[#111111] transition-all rounded-lg">
              Explore Ecosystem
            </Link>
            <Link href="/join" className="px-6 py-3 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#8B88F8] transition-all rounded-lg">
              Join Layerz
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
