"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProceduralBg from "@/components/ProceduralBg";

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
  type: string;
  tier: string;
  featured: boolean;
}

interface AboutPageClientProps {
  initialMembers: Member[];
  partnerships: Partnership[];
}

export default function AboutPageClient({ initialMembers, partnerships: initialPartnerships }: AboutPageClientProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [partnerships, setPartnerships] = useState<Partnership[]>(initialPartnerships);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [activePartnerTab, setActivePartnerTab] = useState<"all" | "investor" | "sponsor" | "partner">("all");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Sync real-time updates directly from databases
  useEffect(() => {
    async function syncAbout() {
      try {
        const [resMembers, resPartnerships] = await Promise.all([
          fetch("/api/admin/data?file=members.json"),
          fetch("/api/admin/data?file=partnerships.json")
        ]);
        if (resMembers.ok) setMembers(await resMembers.json());
        if (resPartnerships.ok) setPartnerships(await resPartnerships.json());
      } catch (err) {
        console.error("About sync failed:", err);
      }
    }
    syncAbout();
    const interval = setInterval(syncAbout, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (members.length > 0 && !selectedMember) {
      setSelectedMember(members[0]);
    }
  }, [members, selectedMember]);

  const filteredPartners = partnerships.filter(
    (p) => activePartnerTab === "all" || p.type === activePartnerTab
  );

  const copyColor = (colorHex: string) => {
    navigator.clipboard.writeText(colorHex);
    setCopiedColor(colorHex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // Pre-defined project hubs for the interactive network map
  const projectHubs = [
    { id: "hub-1", label: "Smart Contracts", x: 100, y: 150, skills: ["Solidity", "Audit", "Rust", "Cryptography"] },
    { id: "hub-2", label: "UI & Design System", x: 250, y: 80, skills: ["React", "Next.js", "Figma", "Branding", "CSS Modules"] },
    { id: "hub-3", label: "AI & Data Systems", x: 400, y: 160, skills: ["AI Engineering", "Go", "WebGL"] }
  ];

  // Calculate coordinates for member nodes in a circular formation
  const getMemberCoords = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 110;
    return {
      x: 250 + Math.cos(angle) * radius,
      y: 150 + Math.sin(angle) * radius
    };
  };

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      
      {/* Background Perlin-noise topology */}
      <div className="absolute inset-0 h-[480px] w-full border-b border-gray-100 bg-gradient-to-b from-white to-[#fcfcff] overflow-hidden">
        <ProceduralBg mode="topology" colorType="default" opacity={0.35} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
        
        {/* Header Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#8B88F8] bg-[#f0f0ff] border border-[#dad9fc] px-4 py-1.5 rounded-full inline-block">
            LAYER_01: GENESIS STRUCTURE
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#111111] mt-6 mb-4">
            Our Core Roots
          </h1>
          <p className="text-sm md:text-base text-[#5C5C5C] leading-relaxed">
            Layerz bridges education, brand design, technical auditing, and investment into one unified lifecycle.
          </p>
        </div>

        {/* Narrative Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-24">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-[#111111] tracking-tight">
              Building Systematic Foundations.
            </h2>
            <p className="text-sm text-[#5C5C5C] leading-relaxed">
              We reject the superficial templates of the tech landscape. Our mission is to back designer, developer, and research nodes deploying decentralized digital products, built systematically from foundation to scale.
            </p>
            <p className="text-sm text-[#5C5C5C] leading-relaxed">
              Through the Layerz Foundation, we sponsor campus chapters and engineer pipelines. Through the Studio, we deploy audits, brand designs, and high-fidelity client interfaces.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#fafafa] border border-gray-100 flex flex-col justify-center min-h-[260px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#89F336]/5 rounded-full blur-2xl"></div>
            <span className="text-6xl block mb-4 text-[#8B88F8] font-serif leading-none">“</span>
            <blockquote className="text-base font-mono text-[#111111] leading-relaxed italic mb-4">
              Every layer coordinates to provide path-to-market acceleration for emerging protocols.
            </blockquote>
            <cite className="text-[9px] font-mono font-bold text-gray-400 uppercase">
              — LAYERZ CONSTITUTIONS
            </cite>
          </div>
        </section>

        {/* INTERACTIVE TEAM RELATIONSHIP NETWORK */}
        <section className="border-t border-gray-100 pt-24 mb-24 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#89F336]">
              CONTRIBUTOR NODE REGISTRY
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#111111] mt-2 mb-4 tracking-tight">
              Interactive Team Mesh
            </h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Inspect how contributors connect to our core technical modules. Hover nodes to trace projects.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* SVG Network Canvas Board (Left Column) */}
            <div className="lg:col-span-7 p-6 bg-[#fafafa] border border-gray-100 rounded-2xl min-h-[480px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-4 left-4 text-[9px] font-mono text-gray-400">
                ACTIVE_REGISTRY_MESH
              </div>

              <svg className="w-full h-full min-h-[350px] relative z-10 text-gray-300" viewBox="0 0 500 300">
                {/* Draw connection lines between members and project hubs */}
                {members.map((member, memberIdx) => {
                  const coords = getMemberCoords(memberIdx, members.length);
                  return projectHubs.map((hub) => {
                    // Check if member has matching skills for the hub
                    const isConnected = member.skills.some((s) => hub.skills.includes(s));
                    const isSpotlight = selectedMember?.id === member.id;

                    if (isConnected) {
                      return (
                        <line
                          key={`${member.id}-${hub.id}`}
                          x1={coords.x}
                          y1={coords.y}
                          x2={hub.x}
                          y2={hub.y}
                          stroke={isSpotlight ? "#8B88F8" : "rgba(17,17,17,0.06)"}
                          strokeWidth={isSpotlight ? "1.5" : "0.6"}
                          strokeDasharray={isSpotlight ? "0" : "2 2"}
                          className="transition-all duration-300"
                        />
                      );
                    }
                    return null;
                  });
                })}

                {/* Draw Project Hub Nodes */}
                {projectHubs.map((hub) => (
                  <g key={hub.id}>
                    <circle cx={hub.x} cy={hub.y} r="12" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
                    <circle cx={hub.x} cy={hub.y} r="4" fill="#89F336" />
                    <text x={hub.x} y={hub.y - 18} textAnchor="middle" className="text-[7px] font-mono font-bold fill-gray-500">
                      {hub.label.toUpperCase()}
                    </text>
                  </g>
                ))}

                {/* Draw Team Member Nodes */}
                {members.map((member, memberIdx) => {
                  const coords = getMemberCoords(memberIdx, members.length);
                  const isSelected = selectedMember?.id === member.id;

                  return (
                    <g
                      key={member.id}
                      onClick={() => setSelectedMember(member)}
                      className="cursor-pointer group/node"
                    >
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={isSelected ? "9" : "6"}
                        fill={isSelected ? "#8B88F8" : "#111111"}
                        stroke={isSelected ? "#FFFFFF" : "transparent"}
                        strokeWidth="2.5"
                        className="transition-all duration-300"
                      />
                      <text
                        x={coords.x}
                        y={coords.y + 16}
                        textAnchor="middle"
                        className={`text-[6.5px] font-mono font-bold transition-all ${
                          isSelected ? "fill-[#8B88F8]" : "fill-gray-400 group-hover/node:fill-[#111111]"
                        }`}
                      >
                        {member.name.split(" ")[0].toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Technical Node Details Panel (Right Column) */}
            <div className="lg:col-span-5">
              {selectedMember ? (
                <div className="p-8 border border-gray-100 bg-white rounded-2xl shadow-lg h-full flex flex-col justify-between font-mono text-xs text-gray-500">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-[#8B88F8] font-bold">NODE_INDEX: 0{members.indexOf(selectedMember) + 1}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${selectedMember.checkedIn ? "bg-[#89F336] animate-pulse" : "bg-gray-300"}`}></span>
                        <span className="text-[8px] font-bold text-gray-400">
                          {selectedMember.checkedIn ? "ACTIVE" : "OFFLINE"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] text-gray-400 block mb-1">MEMBER_IDENTITY:</span>
                      <h3 className="text-2xl font-black text-[#111111] leading-none tracking-tight font-sans">
                        {selectedMember.name}
                      </h3>
                    </div>

                    <div>
                      <span className="text-[8px] text-gray-400 block mb-1">CAPABILITY:</span>
                      <span className="text-xs text-[#8B88F8] font-bold uppercase">{selectedMember.role}</span>
                    </div>

                    <div>
                      <span className="text-[8px] text-gray-400 block mb-2">SYSTEM_SKILLS:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMember.skills?.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded border border-gray-100 bg-gray-50 text-[9px] font-mono text-gray-500">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Simulated Git Commits feed */}
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
                      <span className="text-[8px] text-gray-400 block uppercase border-b border-gray-200 pb-1">
                        SIMULATED COMMITS_FEED
                      </span>
                      <div className="text-[9px] text-gray-600 space-y-1">
                        <p className="truncate"><span className="text-green-600 font-bold">feat:</span> optimize contract gas usage</p>
                        <p className="truncate"><span className="text-[#8B88F8] font-bold">refactor:</span> integrate layout variables</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-[10px]">
                    <a
                      href={`https://github.com/${selectedMember.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#111111] hover:underline"
                    >
                      github/{selectedMember.github}
                    </a>
                    <a
                      href={`https://x.com/${selectedMember.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#8B88F8]"
                    >
                      x/{selectedMember.twitter}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center border border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-400 font-mono text-xs">
                  Select a builder node to inspect details.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FULL-WIDTH RELATIONSHIP GRID (PARTNERS) */}
        <section className="bg-gray-50/50 border-y border-gray-100 py-24 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-24 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#8B88F8]">
                SUPPORT GRID
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#111111] mt-2 mb-4 tracking-tight leading-none">
                Ecosystem Backers
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Decentralized VC funds and strategic university chapters backing Layerz protocols.
              </p>

              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {(["all", "investor", "sponsor", "partner"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivePartnerTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      activePartnerTab === tab
                        ? "bg-[#111111] border-[#111111] text-white"
                        : "bg-white border-gray-200 text-gray-500 hover:border-[#dad9fc]"
                    }`}
                  >
                    {tab === "all" ? "ALL NODES" : tab === "partner" ? "PARTNERS" : `${tab}s`}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {filteredPartners.map((item) => (
                <a
                  key={item.id}
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:border-[#8B88F8] hover:shadow-lg transition-all duration-300"
                >
                  <div className="space-y-1">
                    <h4 className="font-black text-sm text-[#111111] group-hover:text-[#8B88F8] transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 font-mono text-[9px] text-gray-400">
                      <span>{item.type.toUpperCase()}</span>
                      <span>&bull;</span>
                      <span className="font-bold text-[#89F336]">{item.tier}</span>
                    </div>
                  </div>
                  <div className="text-gray-300 group-hover:text-[#8B88F8] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* DESIGN SYSTEM BRAND SWATCHES */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#8B88F8]">
              DESIGN SYSTEM
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#111111] mt-2 mb-4 tracking-tight leading-none">
              Identity & Guidelines
            </h2>
            <p className="text-sm text-gray-500">
              Copy HEX colorways and download the standard visual marks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Visual Mark card */}
            <div className="lg:col-span-5 p-8 rounded-2xl border border-gray-100 bg-[#fafafa] flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono font-black text-gray-400 block mb-4 uppercase">
                  PRIMARY BRANDMARK
                </span>
                <div className="p-6 bg-white border border-gray-100 rounded-xl flex items-center justify-center h-44 mb-6 shadow-inner">
                  <img src="/logo-org.jpg" alt="Logo" className="h-24 w-24 object-contain" />
                </div>
                <h4 className="font-black text-base text-[#111111] mb-1">Standard Brandmark</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Consisting of the isometric block mark and monospaced typography coordinates.
                </p>
              </div>

              <a
                href="/logo-org.jpg"
                download
                className="mt-6 w-full text-center py-3 bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] rounded-lg text-white text-[10px] font-bold uppercase tracking-wider font-mono cursor-pointer"
              >
                DOWNLOAD LOGO PACK
              </a>
            </div>

            {/* Colors Swatches Grid */}
            <div className="lg:col-span-7 p-8 rounded-2xl border border-gray-100 bg-white flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[9px] font-mono font-black text-gray-400 block uppercase">
                  COLORWAY PALETTE
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "Primary Green", hex: "#89F336", desc: "Interact status indicators" },
                    { name: "Primary Lavender", hex: "#8B88F8", desc: "Decentralized coordinates links" },
                    { name: "Deep Premium Black", hex: "#111111", desc: "Primary headers & dark modules" },
                    { name: "Light White", hex: "#FFFFFF", desc: "Main content panels" }
                  ].map((color) => (
                    <div
                      key={color.hex}
                      onClick={() => copyColor(color.hex)}
                      className="p-4 rounded-xl border border-gray-100 hover:border-[#dad9fc] transition-colors cursor-pointer group flex flex-col justify-between h-24"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold block text-[#111111] group-hover:text-[#8B88F8]">
                            {color.name}
                          </span>
                          <span className="text-[9px] text-gray-400">{color.desc}</span>
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: color.hex }}></div>
                      </div>

                      <div className="flex justify-between items-center text-[8px] font-mono text-gray-400 pt-2 border-t border-gray-50">
                        <span>{color.hex}</span>
                        <span className="text-[#8B88F8] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          {copiedColor === color.hex ? "COPIED" : "COPY CODE"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 text-[10px] text-gray-400 font-mono">
                TYPOGRAPHY: Geist Sans, SFMono-Regular
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
