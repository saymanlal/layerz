"use client";

import { useState } from "react";
import Link from "next/link";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";

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

interface AboutPageClientProps {
  initialMembers: Member[];
  partnerships: Partnership[];
}

export default function AboutPageClient({ initialMembers, partnerships }: AboutPageClientProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const investors = partnerships.filter((p) => p.type === "investor");
  const communityPartners = partnerships.filter(
    (p) => p.type === "partner" || p.type === "community_partner"
  );
  const sponsors = partnerships.filter((p) => p.type === "sponsor");

  // Copy helper for brand color kit
  const copyColor = (colorHex: string) => {
    navigator.clipboard.writeText(colorHex);
    setCopiedColor(colorHex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // Card 3D tilt coordinates handler
  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -10;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 10;
    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${ry}deg`);
  };

  const handleTiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      
      {/* Hero Header */}
      <div className="relative h-[480px] w-full border-b border-[#eaeaea] bg-gradient-to-b from-white to-[#f5f5ff] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/bg-3d.jpg')] bg-cover bg-center opacity-[0.06] mix-blend-overlay"></div>
        <ThreeDBlockBg colorType="default" opacity={0.4} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        
        <div className="max-w-6xl mx-auto px-4 pt-32 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 text-left">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#8B88F8] bg-[#f0f0ff] border border-[#dad9fc] px-4 py-1.5 rounded-full inline-block mb-6">
              GENESIS NETWORK
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#111111] mb-6 leading-none animate-fade-up">
              Building Infrastructure <br />
              for Global Innovation.
            </h1>
            <p className="text-sm md:text-base text-[#5C5C5C] max-w-2xl leading-relaxed">
              Layerz connects educational foundations, decentralized networks, design systems, and startup investments to lay down robust pathways for digital infrastructure.
            </p>
          </div>
          
          <div className="hidden lg:block lg:col-span-4">
            <div className="rounded-xl border border-[#eaeaea] bg-white p-2 shadow-lg overflow-hidden relative">
              <img 
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHB1dWd5NzJ3Mzl1ZHptbjY0aTF2Z3pncjRxbnAwOHd3ZnpycjBpZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tn33aiTi1jkl6H6/giphy.gif" 
                alt="System Architecture Diagram" 
                className="w-full h-48 object-cover rounded-lg filter grayscale"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded border border-[#eaeaea] text-[10px] font-mono text-gray-500 flex justify-between">
                <span>GENESIS_BLOCK_LOG</span>
                <span className="text-green-600 animate-pulse font-bold">● SECURE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story section */}
      <section className="max-w-6xl mx-auto px-4 py-24 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#8B88F8]">
            OUR CORE ROOTS
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#111111] mt-2 mb-6 tracking-tight leading-tight">
            Every Great Innovation Begins with a Strong Foundation.
          </h2>
          <p className="text-sm text-[#5C5C5C] leading-relaxed mb-4">
            Layerz was founded with a single belief: innovation shouldn't be limited by geography, background, or access to opportunities. We bridge gaps between education, acceleration, and real-world execution.
          </p>
          <p className="text-sm text-[#5C5C5C] leading-relaxed">
            Across the world, millions of talented individuals have the potential to build extraordinary things—but often lack the right community, mentorship, resources, and ecosystem. Layerz exists to bridge that gap.
          </p>
        </div>
        
        <div className="p-8 rounded-2xl bg-[#fafafa] border border-[#eaeaea] flex flex-col justify-center relative min-h-[300px] shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#89F336]/10 rounded-full blur-2xl"></div>
          <span className="text-6xl block mb-6 text-[#8B88F8] font-serif leading-none">“</span>
          <blockquote className="text-lg font-mono text-[#111111] leading-relaxed mb-6 italic">
            The future isn't built in a single breakthrough. It's built, layer by layer, with absolute engineering precision.
          </blockquote>
          <cite className="text-xs font-bold uppercase tracking-wider text-gray-400 block font-mono">
            — LAYERZ PROTOCOL TEAM
          </cite>
        </div>
      </section>

      {/* Dynamic Team Grid */}
      <section className="max-w-6xl mx-auto px-4 py-20 border-t border-[#eaeaea]">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#89F336]">
            CONTRIBUTOR NODE REGISTRY
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#111111] mt-2 mb-4 tracking-tight leading-none">
            Our Core Builders & Contributors
          </h2>
          <p className="text-sm text-[#5C5C5C] max-w-md mx-auto">
            Meet the engineers, designers, founders, and community leads coordinating smart systems across our global chapters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialMembers.map((member) => (
            <div key={member.id} className="tilt-card-container">
              <div 
                onMouseMove={handleTiltMove}
                onMouseLeave={handleTiltLeave}
                className="tilt-card premium-card p-6 flex flex-col justify-between min-h-[420px] hover:border-[#dad9fc] transition-all duration-300"
              >
                {/* 3D Parallax Layer 1: Avatar Image Container */}
                <div 
                  className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 border border-[#eaeaea] mb-4 flex items-center justify-center group/avatar shadow-inner"
                  style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
                >
                  <img 
                    src={`https://github.com/${member.github}.png`}
                    alt={`${member.name} Github Avatar`}
                    onError={(e) => {
                      // Fallback to identicon if github lookup fails
                      e.currentTarget.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${member.github}`;
                    }}
                    className="w-full h-full object-cover group-hover/avatar:scale-105 transition-transform duration-500"
                  />
                  {/* Hover status screen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/70 via-transparent to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-[8px] font-mono text-white tracking-widest uppercase font-bold">
                      VERIFIED BUILDER
                    </span>
                  </div>
                </div>

                {/* 3D Parallax Layer 2: Info Plate */}
                <div 
                  className="flex-grow flex flex-col justify-between"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <div>
                    {/* Status Banner */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-mono text-gray-400">ID: {member.id}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${member.checkedIn ? 'bg-[#89F336] animate-pulse' : 'bg-gray-300'}`}></span>
                        <span className="text-[8px] font-mono font-black uppercase tracking-widest text-gray-400">
                          {member.checkedIn ? "Active" : "Offline"}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-black text-lg text-[#111111] leading-none mb-1">{member.name}</h3>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B88F8] mb-4">
                      {member.role}
                    </p>
                    
                    {/* Skills badges */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {member.skills?.map((skill) => (
                        <span 
                          key={skill} 
                          className="px-2 py-0.5 rounded bg-[#f5f5f5] border border-[#eaeaea] text-[8px] font-mono text-gray-500"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3D Parallax Layer 3: Social Footer */}
                <div 
                  className="border-t border-[#f5f5f5] pt-4 flex items-center justify-between"
                  style={{ transform: "translateZ(20px)" }}
                >
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
            </div>
          ))}
        </div>
      </section>

      {/* Corporate network section */}
      <section className="bg-[#fafafa] border-y border-[#eaeaea] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#8B88F8]">
              NETWORK STACK
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#111111] mt-2 mb-4 tracking-tight leading-none">
              Sponsors, Investors & Partners
            </h2>
            <p className="text-sm text-[#5C5C5C] max-w-md mx-auto">
              Our ecosystem stands on the shoulders of organizations backing digital infrastructure and early startups.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Investors Column */}
            <div className="bg-white p-8 rounded-2xl border border-[#eaeaea] shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-6 rounded bg-purple-50 border border-purple-200 flex items-center justify-center text-[#8B88F8]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-black text-base text-[#111111]">Venture Capital & Investors</h3>
                </div>
                <p className="text-xs text-[#5c5c5c] leading-relaxed mb-6">
                  Past venture capital backers and seed funds supporting Layerz founders and venture pipelines.
                </p>
                
                <div className="space-y-3">
                  {investors.map((item) => (
                    <a 
                      key={item.id} 
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-[#eaeaea] hover:border-[#8B88F8] hover:bg-[#fcfcff] transition-all duration-300"
                    >
                      <span className="font-bold text-xs text-[#111111]">{item.name}</span>
                      <span className="text-[8px] font-mono uppercase px-2 py-0.5 rounded bg-purple-50 text-[#8B88F8] border border-purple-100 font-bold">
                        {item.tier} Backer
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Community Partners Column */}
            <div className="bg-white p-8 rounded-2xl border border-[#eaeaea] shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/50 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-6 rounded bg-green-50 border border-green-200 flex items-center justify-center text-[#89F336]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-black text-base text-[#111111]">Community Partners</h3>
                </div>
                <p className="text-xs text-[#5c5c5c] leading-relaxed mb-6">
                  Ecosystem nodes, builder chapters, and student university networks collaborating with Layerz.
                </p>
                
                <div className="space-y-3">
                  {communityPartners.map((item) => (
                    <a 
                      key={item.id} 
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-[#eaeaea] hover:border-[#89F336] hover:bg-[#fcfdfc] transition-all duration-300"
                    >
                      <span className="font-bold text-xs text-[#111111]">{item.name}</span>
                      <span className="text-[8px] font-mono uppercase px-2 py-0.5 rounded bg-green-50 text-[#2d5a08] border border-green-100 font-bold">
                        Node
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Strategic Tech Sponsors Column */}
            <div className="bg-white p-8 rounded-2xl border border-[#eaeaea] shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-6 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="font-black text-base text-[#111111]">Strategic Tech Sponsors</h3>
                </div>
                <p className="text-xs text-[#5c5c5c] leading-relaxed mb-6">
                  Technology foundation giants sponsoring developer resources, gas matching, and cloud grants.
                </p>
                
                <div className="space-y-3">
                  {sponsors.map((item) => (
                    <a 
                      key={item.id} 
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-[#eaeaea] hover:border-blue-400 hover:bg-[#fcfdff] transition-all duration-300"
                    >
                      <span className="font-bold text-xs text-[#111111]">{item.name}</span>
                      <span className="text-[8px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 font-bold">
                        {item.tier} Sponsor
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Brand Identity & Guidelines (Brand Kit) section */}
      <section className="max-w-6xl mx-auto px-4 py-24 border-b border-[#eaeaea]">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#8B88F8]">
            BRAND DESIGN SYSTEM
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#111111] mt-2 mb-4 tracking-tight leading-none">
            Identity & Brand Resources
          </h2>
          <p className="text-sm text-[#5C5C5C] max-w-md mx-auto">
            Review design guidelines, copy HEX brand colors, and inspect the Layerz mark.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Logo Showcase Card */}
          <div className="lg:col-span-5 p-8 rounded-2xl border border-[#eaeaea] bg-[#fafafa] flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono font-black text-[#8B88F8] uppercase tracking-widest block mb-4">
                BRANDMARK BLUEPRINT
              </span>
              <div className="p-6 bg-white border border-[#eaeaea] rounded-xl flex items-center justify-center h-48 mb-6 relative overflow-hidden group shadow-inner">
                <img 
                  src="/logo-org.jpg" 
                  alt="Layerz Organizational Logo" 
                  className="h-28 w-28 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h4 className="font-black text-[#111111] text-base mb-1">Standard Brandmark</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                The primary logo consists of the 3D isometric building blocks and the wordmark "Layerz."
              </p>
            </div>
            
            <a 
              href="/logo-org.jpg" 
              download 
              className="mt-6 w-full text-center py-3 bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              DOWNLOAD LOGO BRAND KIT
            </a>
          </div>

          {/* Color Palettes copy/paste */}
          <div className="lg:col-span-7 p-8 rounded-2xl border border-[#eaeaea] bg-white flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono font-black text-[#89F336] uppercase tracking-widest block mb-4">
                PRIMARY BRAND COLORWAY
              </span>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Layerz leverages lime green for energy/interaction indicators and lavender blue for intelligent context guidelines.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "Primary Lime Green", hex: "#89F336", desc: "Action, CTAs, checked-in nodes" },
                  { name: "Primary Lavender Blue", hex: "#8B88F8", desc: "Core links, illustrations, hover borders" },
                  { name: "Deep Premium Black", hex: "#111111", desc: "Primary text, headers, dark modules" },
                  { name: "Pure Light White", hex: "#FFFFFF", desc: "Main content backgrounds" },
                ].map((color) => (
                  <div 
                    key={color.hex}
                    onClick={() => copyColor(color.hex)}
                    className="p-4 rounded-xl border border-[#eaeaea] hover:border-[#dad9fc] transition-all cursor-pointer group flex flex-col justify-between h-28 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold block text-[#111111] group-hover:text-[#8B88F8]">
                          {color.name}
                        </span>
                        <span className="text-[9px] text-gray-400 block mt-0.5">{color.desc}</span>
                      </div>
                      <div 
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs" 
                        style={{ backgroundColor: color.hex }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 border-t border-[#f5f5f5] pt-2">
                      <span>{color.hex}</span>
                      <span className="text-[#8B88F8] font-bold text-[9px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedColor === color.hex ? "COPIED!" : "CLICK TO COPY"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#eaeaea] text-xs text-gray-500 font-mono">
              <p>🔤 Font Family: Geist Sans, Outfit, SFMono-Regular</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-4xl mx-auto px-4 pt-20">
        <div className="rounded-2xl border border-[#eaeaea] bg-gradient-to-br from-white to-[#f5f5ff] p-8 md:p-12 text-center shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#89F336]/10 rounded-full blur-2xl"></div>
          <h3 className="text-2xl md:text-3xl font-black text-[#111111] mb-4">Join the Layerz Contributor Node</h3>
          <p className="text-sm text-[#5C5C5C] max-w-xl mx-auto mb-8">
            Whether you're developing custom protocols, designing design tokens, or contributing code to chapters, Layerz is built layer by layer.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/ecosystem" className="px-6 py-3 border border-[#111111] text-xs font-bold uppercase hover:bg-[#89F336] hover:text-[#111111] transition-all rounded-lg text-center font-mono">
              Ecosystem Layers
            </Link>
            <Link href="/join" className="px-6 py-3 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#8B88F8] transition-all rounded-lg text-center font-mono">
              Apply to Chapters
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
