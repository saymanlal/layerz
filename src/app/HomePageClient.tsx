"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ProceduralBg from "@/components/ProceduralBg";

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
  github: string;
  twitter: string;
  skills: string[];
}

interface Partner {
  id: string;
  name: string;
  website: string;
  type: string;
  tier: string;
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

interface HomePageClientProps {
  programs: Program[];
  studioWork: Project[];
  members: Member[];
  partners: Partner[];
  blogs: Blog[];
}

export default function HomePageClient({
  programs: initialPrograms,
  studioWork: initialStudioWork,
  members: initialMembers,
  partners: initialPartners,
  blogs: initialBlogs,
}: HomePageClientProps) {
  // Real-time synchronization state
  const [programs, setPrograms] = useState(initialPrograms);
  const [studioWork, setStudioWork] = useState(initialStudioWork);
  const [members, setMembers] = useState(initialMembers);
  const [partners, setPartners] = useState(initialPartners);
  const [blogs, setBlogs] = useState(initialBlogs);

  const [activeSection, setActiveSection] = useState(0);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [activePartnerType, setActivePartnerType] = useState<string>("all");

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync real-time updates directly from CMS databases
  useEffect(() => {
    async function syncHome() {
      try {
        const [resPrograms, resStudio, resMembers, resPartners, resBlogs] = await Promise.all([
          fetch("/api/admin/data?file=programs.json"),
          fetch("/api/admin/data?file=studio.json"),
          fetch("/api/admin/data?file=members.json"),
          fetch("/api/admin/data?file=partnerships.json"),
          fetch("/api/admin/data?file=blogs.json")
        ]);

        if (resPrograms.ok) setPrograms(await resPrograms.json());
        if (resStudio.ok) setStudioWork(await resStudio.json());
        if (resMembers.ok) setMembers(await resMembers.json());
        if (resPartners.ok) setPartners(await resPartners.json());
        if (resBlogs.ok) setBlogs(await resBlogs.json());
      } catch (err) {
        console.error("Home sync failed:", err);
      }
    }
    syncHome();
    const interval = setInterval(syncHome, 6000);
    return () => clearInterval(interval);
  }, []);

  // Track active layer based on window scrolling heights
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      const sections = document.querySelectorAll(".narrative-layer");
      sections.forEach((sec, idx) => {
        const top = (sec as HTMLElement).offsetTop;
        const height = (sec as HTMLElement).offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          setActiveSection(idx);
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set first member as selected default once loaded
  useEffect(() => {
    if (members.length > 0 && !selectedMember) {
      setSelectedMember(members[0]);
    }
  }, [members, selectedMember]);

  // Mouse tilt calculator for 3D layered cards
  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -12;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 12;
    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${ry}deg`);
  };

  const handleTiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  const activePrograms = programs.slice(0, 3);
  const featuredProjects = studioWork.filter((p) => p.featured).slice(0, 3);
  const activeMembers = members.slice(0, 8);
  const filteredPartners = partners.filter((p) => activePartnerType === "all" || p.type === activePartnerType);

  return (
    <div ref={containerRef} className="relative w-full bg-white text-[#111111] overflow-hidden font-sans">
      
      {/* Dynamic Procedural Background linked to active narrative section */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        {activeSection === 0 && <ProceduralBg mode="architecture" colorType="default" opacity={0.35} />}
        {activeSection === 1 && <ProceduralBg mode="topology" colorType="green" opacity={0.3} />}
        {activeSection === 2 && <ProceduralBg mode="blueprint" colorType="lavender" opacity={0.4} />}
        {activeSection === 3 && <ProceduralBg mode="mesh" colorType="default" opacity={0.35} />}
        {activeSection === 4 && <ProceduralBg mode="stage" colorType="lavender" opacity={0.3} />}
      </div>

      {/* Floating Left Sidebar Metadata Gauge */}
      <div className="fixed left-6 bottom-10 z-40 hidden lg:flex flex-col font-mono text-[9px] text-gray-400 space-y-2 select-none border-l border-gray-200 pl-4">
        <span className="text-[#8B88F8] font-bold">SYSTEM_INDEXER: IN_TRANSIT</span>
        <span>SECTION_COORDS: [LAYER_0{activeSection + 1}]</span>
        <span>NODES_ACTIVE: {members.filter(m => m.checkedIn).length} VERIFIED</span>
        <div className="w-16 h-[1.5px] bg-gray-200 relative overflow-hidden mt-1">
          <div 
            className="absolute top-0 left-0 h-full bg-[#89F336] transition-all duration-300"
            style={{ width: `${(activeSection + 1) * 20}%` }}
          ></div>
        </div>
      </div>

      {/* Floating Right Sidebar Layer Timeline Navigation */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-4 select-none">
        {["CORE_NARRATIVE", "PHILOSOPHY", "ACADEMIC_PIPELINE", "CASE_STUDIES", "TEAM_MESH", "PARTNERS"].map((layer, idx) => (
          <div key={idx} className="flex items-center gap-3 justify-end group cursor-pointer">
            <span className="text-[8px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              {layer}
            </span>
            <div 
              className={`w-2.5 h-2.5 rounded-full border transition-all ${
                activeSection === idx
                  ? "bg-[#111111] border-[#111111] scale-125"
                  : "bg-white border-gray-300 group-hover:border-gray-500"
              }`}
            ></div>
          </div>
        ))}
      </div>

      {/* ========================================================
          LAYER 0: CINEMATIC HERO SCENE
          ======================================================== */}
      <section className="narrative-layer min-h-screen relative flex items-center justify-center px-4 pt-20 border-b border-gray-100">
        <div className="max-w-6xl mx-auto text-center relative z-10 flex flex-col items-center">
          {/* Logo animation schematic */}
          <svg className="w-16 h-16 text-[#111111] mb-8 animate-float" viewBox="0 0 100 100" fill="none">
            <polygon points="50,15 90,40 50,65 10,40" stroke="#111111" strokeWidth="2.5" />
            <line x1="50" y1="15" x2="50" y2="65" stroke="#111111" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="50" cy="40" r="6" fill="#89F336" />
          </svg>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-[#111111] leading-none mb-8">
            Architecting <br />
            The Next Layer.
          </h1>

          <p className="max-w-xl mx-auto text-sm md:text-base text-[#5c5c5c] leading-relaxed mb-12">
            Layerz operates as an integrated grid of capabilities. We build open protocols, fund community chapters, and construct bespoke visual products for technical enterprises.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/join"
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-xs font-bold text-white uppercase tracking-widest transition-all duration-300"
            >
              JOIN ECOSYSTEM
            </Link>
            <Link
              href="/ecosystem"
              className="w-full sm:w-auto px-8 py-4 rounded-lg border border-[#111111] hover:bg-gray-50 text-xs font-bold text-[#111111] uppercase tracking-widest transition-all duration-300"
            >
              EXPLORE LAYERS
            </Link>
          </div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-400 font-mono text-[9px] select-none">
            <span>SCROLL TO DESCEND</span>
            <div className="w-[1.5px] h-6 bg-gray-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-[#8B88F8] animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          LAYER 1: BRAND PHILOSOPHY & BLUEPRINT SCHEMA
          ======================================================== */}
      <section className="narrative-layer min-h-screen relative flex items-center py-24 px-4 border-b border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-mono font-bold text-[#8B88F8] uppercase tracking-widest">
              LAYER_01: SYSTEM PHILOSOPHY
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#111111] leading-none">
              Every Great Innovation Begins with a Blueprint.
            </h2>
            <p className="text-sm text-[#5c5c5c] leading-relaxed">
              We reject the superficial templates of the tech landscape. Our mission is to back designer, developer, and research nodes deploying decentralized digital products, built systematically from foundation to scale.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                <span className="font-mono text-xs font-black text-[#89F336]">L_01: INTELLECTUAL CAPITALS</span>
                <p className="text-[11px] text-gray-500 mt-1">Nurturing engineering talent globally through campus cohorts and developer grants.</p>
              </div>
              <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                <span className="font-mono text-xs font-black text-[#8B88F8]">L_02: PRODUCTION SCALES</span>
                <p className="text-[11px] text-gray-500 mt-1">Deploying frontend layouts, secure Solidity contract audits, and brand kits.</p>
              </div>
            </div>
          </div>

          {/* Interactive SVG Blueprint diagram */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full aspect-square max-w-[420px] rounded-2xl border border-gray-100 bg-[#fafafa] p-8 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#eaeaea_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              
              <svg className="w-full h-full relative z-10 text-gray-400" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="30" stroke="rgba(139,136,248,0.2)" strokeWidth="1" />
                <circle cx="50" cy="50" r="40" stroke="rgba(139,136,248,0.1)" strokeWidth="0.8" strokeDasharray="3 3" />
                
                {/* Horizontal blueprint lines */}
                <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(17,17,17,0.06)" strokeWidth="0.5" />
                <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(17,17,17,0.06)" strokeWidth="0.5" />
                
                {/* Visual connectors mapping out the modular layers */}
                <g className="cursor-pointer group/node">
                  <circle cx="50" cy="20" r="4" fill="#8B88F8" />
                  <line x1="50" y1="20" x2="50" y2="50" stroke="#8B88F8" strokeWidth="1" />
                  <text x="56" y="22" className="text-[5px] font-mono fill-gray-500 font-bold group-hover/node:fill-[#8B88F8] transition-colors">CHAPTERS</text>
                </g>

                <g className="cursor-pointer group/node">
                  <circle cx="80" cy="50" r="4" fill="#89F336" />
                  <line x1="80" y1="50" x2="50" y2="50" stroke="#89F336" strokeWidth="1" />
                  <text x="86" y="52" className="text-[5px] font-mono fill-gray-500 font-bold group-hover/node:fill-[#89F336] transition-colors">STUDIO</text>
                </g>

                <g className="cursor-pointer group/node">
                  <circle cx="50" cy="80" r="4" fill="#111111" />
                  <line x1="50" y1="80" x2="50" y2="50" stroke="#111111" strokeWidth="1" />
                  <text x="56" y="82" className="text-[5px] font-mono fill-gray-500 font-bold group-hover/node:fill-[#111111] transition-colors">LABS</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          LAYER 2: ACADEMIC TIMELINE PIPELINE (PROGRAMS)
          ======================================================== */}
      <section className="narrative-layer min-h-screen relative flex items-center py-24 px-4 border-b border-gray-100">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-[10px] font-mono font-bold text-[#89F336] uppercase tracking-widest">
              LAYER_02: EDUCATION & COHORTS
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#111111] mt-2 mb-4 leading-none">
              The Cohort Pipeline
            </h2>
            <p className="text-sm text-[#5c5c5c]">
              We run structured chapters to accelerate developers, designers, and founders through sequential checkpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {activePrograms.map((prog, idx) => (
              <div key={prog.id} className="tilt-card-container">
                <div 
                  onMouseMove={handleTiltMove}
                  onMouseLeave={handleTiltLeave}
                  className="tilt-card premium-card p-8 flex flex-col justify-between min-h-[380px]"
                >
                  <div className="tilt-card-inner space-y-6">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-[#8B88F8] font-bold uppercase tracking-wider">PIPELINE STAGE 0{idx + 1}</span>
                      <span className="text-gray-400">{prog.duration}</span>
                    </div>

                    <h3 className="text-2xl font-black text-[#111111] leading-tight">{prog.title}</h3>
                    <p className="text-xs text-[#8B88F8] font-semibold font-mono">{prog.tagline}</p>
                    <p className="text-xs text-[#5c5c5c] leading-relaxed">{prog.description}</p>
                  </div>

                  <div className="tilt-card-inner pt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-gray-50 border border-gray-100 text-[8px] font-mono font-bold text-gray-500 uppercase">
                      STATUS: {prog.status}
                    </span>
                    <Link 
                      href="/programs" 
                      className="text-xs font-bold text-[#111111] hover:underline uppercase tracking-wider font-mono"
                    >
                      SPEC_DATA &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          LAYER 3: 3D CARD TILT PARALLAX CASE STUDIES (STUDIO)
          ======================================================== */}
      <section className="narrative-layer min-h-screen relative flex items-center py-24 px-4 border-b border-gray-100">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-16">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#8B88F8] uppercase tracking-widest">
                LAYER_03: SELECTED AUDITS & PROJECTS
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#111111] mt-2 leading-none">
                Studio Deployments
              </h2>
            </div>
            <Link href="/studio" className="text-xs font-bold text-[#8B88F8] hover:underline uppercase tracking-wider font-mono">
              INSPECT ALL SCOPES &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div key={project.id} className="tilt-card-container">
                <div 
                  onMouseMove={handleTiltMove}
                  onMouseLeave={handleTiltLeave}
                  className="tilt-card premium-card p-8 flex flex-col justify-between min-h-[420px]"
                >
                  <div className="tilt-card-inner space-y-6">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="px-2.5 py-0.5 rounded bg-gray-50 border border-gray-100 text-[#8B88F8] font-bold">
                        {project.category}
                      </span>
                      <span className="text-gray-400">CLIENT: {project.client}</span>
                    </div>

                    <h3 className="text-2xl font-black text-[#111111] leading-tight">{project.title}</h3>
                    <p className="text-xs text-[#5c5c5c] leading-relaxed line-clamp-4">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded bg-gray-50 border border-gray-100 text-[8px] font-mono text-gray-500">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="tilt-card-inner pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-gray-400 block uppercase font-mono">OUTCOME</span>
                      <span className="text-[10px] font-mono font-bold text-green-700">{project.outcome}</span>
                    </div>
                    <Link 
                      href={`/studio#${project.id}`} 
                      className="px-4 py-2 border border-black hover:bg-[#111111] hover:text-white rounded-lg text-[10px] font-bold uppercase font-mono tracking-wider transition-colors"
                    >
                      INSPECT
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          LAYER 4: INTERACTIVE CONTRIBUTOR NETWORK (TEAM)
          ======================================================= */}
      <section className="narrative-layer min-h-screen relative flex items-center py-24 px-4 border-b border-gray-100">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">
          
          {/* Network Node board (Left Column) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 bg-[#fafafa] border border-gray-100 rounded-2xl min-h-[480px] relative overflow-hidden">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#89F336] uppercase tracking-widest block mb-2">
                LAYER_04: INTERACTIVE CONTRIBUTOR NETWORK
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#111111] tracking-tight leading-none mb-6">
                Decentralized Builder Nodes
              </h2>
            </div>

            {/* Interactive graphical node mesh */}
            <div className="relative w-full h-72 border border-dashed border-gray-200 rounded-xl bg-white flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full text-gray-300" viewBox="0 0 200 200">
                {/* Connective background mesh lines */}
                {activeMembers.map((m1, idx1) => 
                  activeMembers.map((m2, idx2) => {
                    if (idx1 < idx2 && (idx1 + idx2) % 2 === 0) {
                      const x1 = 40 + (idx1 % 3) * 60;
                      const y1 = 40 + Math.floor(idx1 / 3) * 60;
                      const x2 = 40 + (idx2 % 3) * 60;
                      const y2 = 40 + Math.floor(idx2 / 3) * 60;
                      
                      const isLinked = selectedMember?.id === m1.id || selectedMember?.id === m2.id;

                      return (
                        <line 
                          key={`${idx1}-${idx2}`} 
                          x1={x1} y1={y1} x2={x2} y2={y2} 
                          stroke={isLinked ? "#8B88F8" : "rgba(17,17,17,0.04)"} 
                          strokeWidth={isLinked ? "1" : "0.5"} 
                          className="transition-all duration-300"
                        />
                      );
                    }
                    return null;
                  })
                )}

                {/* Nodes */}
                {activeMembers.map((member, idx) => {
                  const cx = 40 + (idx % 3) * 60;
                  const cy = 40 + Math.floor(idx / 3) * 60;
                  const isSelected = selectedMember?.id === member.id;

                  return (
                    <g 
                      key={member.id} 
                      onClick={() => setSelectedMember(member)}
                      className="cursor-pointer group/node"
                    >
                      <circle 
                        cx={cx} cy={cy} r={isSelected ? "8" : "5"} 
                        fill={isSelected ? "#89F336" : "#111111"} 
                        stroke={isSelected ? "#FFFFFF" : "transparent"}
                        strokeWidth="2"
                        className="transition-all duration-300 group-hover/node:fill-[#8B88F8]" 
                      />
                      <text 
                        x={cx + 8} y={cy + 3} 
                        className={`text-[6px] font-mono font-bold transition-all ${
                          isSelected ? "fill-[#8B88F8] scale-105" : "fill-gray-400 group-hover/node:fill-[#111111]"
                        }`}
                      >
                        {member.name.split(" ")[0].toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <p className="text-[10px] text-gray-400 font-mono mt-6">
              Click any registry node in the matrix grid to inspect their codebase records.
            </p>
          </div>

          {/* Member Details Terminal (Right Column) */}
          <div className="lg:col-span-5">
            {selectedMember ? (
              <div className="p-8 border border-gray-100 bg-white rounded-2xl shadow-lg h-full flex flex-col justify-between font-mono text-xs text-gray-500">
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-[#8B88F8] font-bold">NODE_DETAILS: VERIFIED</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${
                      selectedMember.checkedIn 
                        ? "bg-green-50 border-green-200 text-green-700 animate-pulse" 
                        : "bg-gray-50 border-gray-200 text-gray-400"
                    }`}>
                      {selectedMember.checkedIn ? "ONLINE" : "OFFLINE"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] text-gray-400">MEMBER_NAME:</span>
                    <h3 className="text-2xl font-black text-[#111111] leading-none tracking-tight font-sans">
                      {selectedMember.name}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] text-gray-400">ASSIGNED_ROLE:</span>
                    <p className="text-[#8B88F8] font-bold text-xs uppercase">{selectedMember.role}</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] text-gray-400">SKILLSET_INDEX:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMember.skills?.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded border border-gray-100 bg-gray-50 text-[9px] font-mono text-gray-500">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 space-y-4">
                  <div className="flex justify-between text-[10px]">
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

                  <Link 
                    href="/about" 
                    className="w-full text-center block py-3 bg-[#111111] hover:bg-[#8B88F8] rounded-lg text-white text-[10px] font-bold uppercase tracking-wider transition-colors font-mono"
                  >
                    OPEN ARCHIVE DIRECTORY
                  </Link>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-400 font-mono text-xs">
                Select a network node from the map on the left to inspect records.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          LAYER 5: THE SUPPORT NETWORK RELATIONSHIP MAP (PARTNERS)
          ======================================================= */}
      <section className="narrative-layer min-h-screen relative flex items-center py-24 px-4 bg-gray-50/50">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-[10px] font-mono font-bold text-[#8B88F8] uppercase tracking-widest">
              LAYER_05: ECOSYSTEM SUPPORT GRID
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#111111] mt-2 mb-4 leading-none">
              Ecosystem Backers
            </h2>
            <p className="text-sm text-[#5c5c5c]">
              Click any network category to segment VC partners, academic chapters, and protocol sponsors.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {(["all", "investor", "sponsor", "partner"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setActivePartnerType(type)}
                  className={`px-4 py-1.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                    activePartnerType === type
                      ? "bg-[#111111] border-[#111111] text-white"
                      : "bg-white border-gray-200 text-gray-500 hover:border-[#dad9fc] hover:text-[#111111]"
                  }`}
                >
                  {type === "all" ? "ALL NODES" : type === "partner" ? "PARTNERS" : `${type}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {filteredPartners.map((p) => (
              <a
                key={p.id}
                href={p.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:border-[#8B88F8] hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-1">
                  <h4 className="font-black text-sm text-[#111111] group-hover:text-[#8B88F8] transition-colors">
                    {p.name}
                  </h4>
                  <div className="flex items-center gap-2 font-mono text-[9px] text-gray-400">
                    <span>{p.type.toUpperCase()}</span>
                    <span>&bull;</span>
                    <span className="font-bold text-[#89F336]">{p.tier}</span>
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

      {/* ========================================================
          LATEST RESEARCH BLOGS
          ======================================================= */}
      <section className="py-24 px-4 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#8B88F8] uppercase tracking-widest">
                ECOSYSTEM PUBLICATIONS
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#111111] mt-2 leading-none">
                Research Archives
              </h2>
            </div>
            <Link href="/blog" className="text-xs font-bold text-[#8B88F8] hover:underline uppercase tracking-wider font-mono">
              READ ARCHIVES &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((blog) => (
              <article key={blog.id} className="tilt-card-container">
                <div 
                  onMouseMove={handleTiltMove}
                  onMouseLeave={handleTiltLeave}
                  className="tilt-card premium-card p-8 flex flex-col justify-between min-h-[320px]"
                >
                  <div className="tilt-card-inner space-y-4">
                    <div className="flex justify-between items-center text-[9px] font-mono text-gray-400">
                      <span>{blog.date}</span>
                      <span>{blog.readTime}</span>
                    </div>

                    <h4 className="text-lg font-black text-[#111111] hover:text-[#8B88F8] transition-colors leading-snug">
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h4>

                    <p className="text-xs text-[#5c5c5c] leading-relaxed line-clamp-3">
                      {blog.summary}
                    </p>
                  </div>

                  <div className="tilt-card-inner pt-6 border-t border-gray-50 flex justify-between items-center text-[9px] font-mono">
                    <span className="text-[#8B88F8] font-bold uppercase">{blog.category}</span>
                    <Link href={`/blog/${blog.slug}`} className="font-bold text-[#111111] hover:underline">
                      READ POST
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          FINAL CALL TO ACTION
          ======================================================= */}
      <section className="py-24 px-4 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-white border border-gray-100 p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#89F336]/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <h3 className="text-3xl md:text-4xl font-black text-[#111111] leading-none tracking-tight">
            Apply to Coordinate at Layerz
          </h3>
          <p className="text-sm text-[#5c5c5c] max-w-xl mx-auto leading-relaxed">
            Connect with our global network. Contribute code, design assets, or apply for university chapters.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/join" 
              className="px-8 py-4 bg-[#111111] hover:bg-[#8B88F8] rounded-lg text-white text-xs font-bold uppercase tracking-widest transition-colors font-mono"
            >
              GENERATE ENTRANCE PASS
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-4 border border-black hover:bg-gray-50 rounded-lg text-[#111111] text-xs font-bold uppercase tracking-widest transition-all font-mono"
            >
              ENQUIRE DIRECTLY
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
