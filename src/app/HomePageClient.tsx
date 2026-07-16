"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ProceduralBg from "@/components/ProceduralBg";
import ThreeDBuilderHero from "@/components/ThreeDBuilderHero";

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

// Animated Numbers Counter Component
function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }
    
    const incrementTime = Math.max(Math.floor(duration / end), 20);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span className="tabular-nums">{count}</span>;
}

// Procedural SVG logo badge for partner entities
function PartnerLogoBadge({ name }: { name: string }) {
  const charSum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const color = charSum % 2 === 0 ? "#8B88F8" : "#89F336";
  
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden border border-gray-150 bg-white group-hover:border-[#dad9fc] transition-all duration-300">
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
        <polygon points="50,15 90,80 10,80" stroke={color} strokeWidth="6" fill="none" />
      </svg>
      <span className="font-mono font-black text-xs relative z-10" style={{ color }}>
        {name.substring(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

export default function HomePageClient({
  programs: initialPrograms,
  studioWork: initialStudioWork,
  members: initialMembers,
  partners: initialPartners,
  blogs: initialBlogs,
}: HomePageClientProps) {
  // Sync states
  const [programs, setPrograms] = useState(initialPrograms);
  const [studioWork, setStudioWork] = useState(initialStudioWork);
  const [members, setMembers] = useState(initialMembers);
  const [partners, setPartners] = useState(initialPartners);
  const [blogs, setBlogs] = useState(initialBlogs);

  const [activeSection, setActiveSection] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Sync real-time updates directly from databases
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

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -8;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${ry}deg`);
  };

  const handleTiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterSubscribed(true);
    setNewsletterEmail("");
  };

  return (
    <div className="relative w-full bg-white text-[#111111] overflow-hidden font-sans">
      
      {/* Background canvas environment */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        {activeSection === 0 && <ProceduralBg mode="architecture" colorType="default" opacity={0.35} />}
        {activeSection === 1 && <ProceduralBg mode="topology" colorType="green" opacity={0.3} />}
        {activeSection === 2 && <ProceduralBg mode="blueprint" colorType="lavender" opacity={0.4} />}
        {activeSection === 3 && <ProceduralBg mode="mesh" colorType="default" opacity={0.35} />}
        {activeSection === 4 && <ProceduralBg mode="stage" colorType="lavender" opacity={0.3} />}
      </div>

      {/* Floating Scroll indicator */}
      <div className="fixed left-6 bottom-10 z-40 hidden lg:flex flex-col font-mono text-[9px] text-gray-400 space-y-2 select-none border-l border-gray-200 pl-4">
        <span className="text-[#8B88F8] font-bold">SYSTEM_INDEXER: IN_TRANSIT</span>
        <span>SECTION_COORDS: [LAYER_0{activeSection + 1}]</span>
      </div>

      {/* ========================================================
          HERO SECTION (Copy aligned with home page docs)
          ======================================================= */}
      <section className="narrative-layer min-h-screen relative flex items-center px-4 pt-20 border-b border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full relative z-10">
          
          <div className="lg:col-span-7 text-left space-y-8 animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-150 bg-gray-50 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
              <span>🚀 Building the Future, Layer by Layer</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#111111] leading-none">
              Building the Next <br />
              <span className="brand-gradient-text">Layer of Innovation.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm md:text-base text-[#5c5c5c] leading-relaxed max-w-xl">
              Layerz is a global innovation ecosystem empowering builders, creators, startups, and communities through technology, design, education, and collaboration.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/ecosystem"
                className="w-full sm:w-auto text-center px-8 py-4 rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-xs font-bold text-white uppercase tracking-widest transition-all duration-300"
              >
                Explore the Ecosystem
              </Link>
              <Link
                href="/join"
                className="w-full sm:w-auto text-center px-8 py-4 rounded-lg border border-[#111111] hover:bg-gray-50 text-xs font-bold text-[#111111] uppercase tracking-widest transition-all duration-300"
              >
                Join Layerz
              </Link>
            </div>
          </div>

          {/* Interactive 3D Stacker (Right Column) */}
          <div className="lg:col-span-5 flex justify-center">
            <ThreeDBuilderHero />
          </div>

        </div>
      </section>

      {/* ========================================================
          TRUSTED BY SECTION
          ======================================================= */}
      <section className="py-20 border-b border-gray-100 bg-gray-50/30 relative z-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-4">
            NETWORK TRUST
          </span>
          <h2 className="text-2xl font-black tracking-tight text-[#111111] mb-12">
            Trusted by Builders, Communities & Industry Partners
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {partners.slice(0, 4).map((p) => (
              <a
                key={p.id}
                href={p.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 bg-white border border-gray-150 rounded-2xl flex items-center gap-3.5 hover:border-[#8B88F8] transition-colors"
              >
                <PartnerLogoBadge name={p.name} />
                <div className="text-left min-w-0">
                  <h4 className="font-bold text-xs text-[#111111] truncate">{p.name}</h4>
                  <span className="text-[8px] font-mono text-gray-400 block uppercase">{p.type}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          ABOUT SECTION
          ======================================================= */}
      <section className="narrative-layer min-h-screen relative flex items-center py-24 px-4 border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center w-full relative z-10">
          
          <div className="md:col-span-7 space-y-6">
            <span className="text-[10px] font-mono font-bold text-[#8B88F8] uppercase tracking-widest">
              ABOUT LAYERZ
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] leading-none tracking-tight">
              More Than a Company. <br />An Ecosystem.
            </h2>
            <div className="space-y-4 text-xs text-[#5C5C5C] leading-relaxed">
              <p className="font-bold text-sm text-[#111111]">Layerz exists to empower the next generation of innovators.</p>
              <p>We believe that great products, thriving communities, and impactful startups are built layer by layer—not overnight.</p>
              <p>From education and research to product design, startup support, developer communities, and emerging technologies, Layerz creates the infrastructure that helps ideas grow into lasting impact.</p>
            </div>
          </div>

          <div className="md:col-span-5 p-8 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-center min-h-[220px]">
            <span className="text-5xl text-[#8B88F8] font-serif block mb-2">“</span>
            <blockquote className="text-base font-mono text-[#111111] italic leading-relaxed mb-4">
              Every breakthrough begins with a single layer.
            </blockquote>
          </div>

        </div>
      </section>

      {/* ========================================================
          ECOSYSTEM SECTION
          ======================================================= */}
      <section className="narrative-layer min-h-screen relative flex items-center py-24 px-4 border-b border-gray-100 bg-gray-50/20">
        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-[10px] font-mono font-bold text-[#89F336] uppercase tracking-widest">
              MODULAR CAPABILITIES
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#111111] mt-2 mb-4 leading-none">
              One Ecosystem. Infinite Possibilities.
            </h2>
            <p className="text-sm text-[#5c5c5c]">
              Every initiative within Layerz is designed to solve a different part of the innovation journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
            {[
              {
                id: "eco-1",
                title: "Layerz Foundation",
                color: "#89F336",
                desc: "Empowering students, developers, and communities through education, events, and innovation programs."
              },
              {
                id: "eco-2",
                title: "Layerz Studio",
                color: "#8B88F8",
                desc: "Designing brands, digital products, websites, and AI-powered experiences for the next generation of businesses."
              },
              {
                id: "eco-3",
                title: "Layerz Labs",
                color: "#111111",
                desc: "Researching, experimenting, and building technologies across AI, Blockchain, Web3, and emerging technologies."
              },
              {
                id: "eco-4",
                title: "Layerz Ventures",
                color: "#A0A0A0",
                desc: "Supporting founders with mentorship, grants, incubation, and strategic growth.",
                badge: "COMING SOON"
              }
            ].map((eco) => (
              <div key={eco.id} className="tilt-card-container">
                <div 
                  onMouseMove={handleTiltMove}
                  onMouseLeave={handleTiltLeave}
                  className="tilt-card premium-card p-6 flex flex-col justify-between min-h-[300px]"
                >
                  <div className="tilt-card-inner space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-mono text-gray-400">MODULE_{eco.id.toUpperCase()}</span>
                      {eco.badge && (
                        <span className="px-2 py-0.5 rounded bg-gray-50 border border-gray-150 text-[8px] font-mono text-gray-500 font-bold uppercase">{eco.badge}</span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-[#111111]" style={{ color: eco.color }}>{eco.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{eco.desc}</p>
                  </div>

                  <Link 
                    href="/ecosystem" 
                    className="tilt-card-inner text-[10px] font-mono font-bold text-[#111111] hover:underline uppercase"
                  >
                    INSPECT LAYER &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          WHAT WE DO SECTION (8 cards list)
          ======================================================= */}
      <section className="py-24 px-4 border-b border-gray-100 bg-white relative z-10">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono font-bold text-[#8B88F8] uppercase tracking-widest">
              CAPABILITIES GRID
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] mt-2 mb-4 leading-none tracking-tight">
              We Build Platforms That Help People Build.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Education Programs",
              "Community Building",
              "Product Design",
              "AI Solutions",
              "Blockchain Development",
              "Startup Support",
              "Research & Innovation",
              "Developer Ecosystems"
            ].map((item, idx) => (
              <div key={idx} className="p-5 border border-gray-100 bg-gray-50/50 rounded-2xl flex flex-col justify-between min-h-[140px] hover:border-[#8B88F8] transition-colors">
                <span className="font-mono text-xs text-gray-300">0{idx + 1}</span>
                <h4 className="font-black text-sm text-[#111111] leading-tight">{item}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          OUR IMPACT SECTION
          ======================================================= */}
      <section className="py-24 px-4 bg-[#111111] text-white border-y border-gray-900 relative z-10 dark-theme">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <span className="text-[10px] font-mono font-bold text-[#89F336] uppercase tracking-widest block">
            LAYER_IMPACT_METRICS
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
            Building Impact Across Communities
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-8">
            {[
              { value: 1000, suffix: "+", label: "Community Members" },
              { value: 50, suffix: "+", label: "Events & Workshops" },
              { value: 20, suffix: "+", label: "Partners" },
              { value: 100, suffix: "+", label: "Projects Supported" }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2 p-6 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-3xl md:text-4xl font-mono font-black text-[#89F336]">
                  <AnimatedCounter value={stat.value} />{stat.suffix}
                </p>
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          FEATURED PROGRAMS
          ======================================================= */}
      <section className="py-24 px-4 border-b border-gray-100 bg-white relative z-10">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono font-bold text-[#8B88F8] uppercase tracking-widest">
              ECOSYSTEM PIPELINE
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] mt-2 mb-4 leading-none tracking-tight">
              Programs Designed for Builders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: "Builder Program", desc: "Hands-on learning for developers and creators." },
              { name: "Campus Chapters", desc: "Building innovation communities across universities." },
              { name: "Hackathons", desc: "Turning ideas into real products through collaboration." },
              { name: "Workshops", desc: "Practical learning experiences led by industry experts." }
            ].map((prog, idx) => (
              <div key={idx} className="tilt-card-container">
                <div 
                  onMouseMove={handleTiltMove}
                  onMouseLeave={handleTiltLeave}
                  className="tilt-card premium-card p-6 flex flex-col justify-between min-h-[220px]"
                >
                  <div className="tilt-card-inner space-y-4">
                    <span className="font-mono text-[9px] text-gray-400 block uppercase">STAGE_0{idx + 1}</span>
                    <h4 className="font-black text-base text-[#111111] leading-tight">{prog.name}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{prog.desc}</p>
                  </div>
                  <Link href="/programs" className="tilt-card-inner text-[9px] font-mono font-bold text-[#8B88F8] hover:underline uppercase">
                    READ SPEC &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          WHY LAYERZ SECTION
          ======================================================= */}
      <section className="py-24 px-4 border-b border-gray-100 bg-gray-50/20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[10px] font-mono font-bold text-[#89F336] uppercase tracking-widest block">
            ECOSYSTEM VALUE
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#111111] tracking-tight">
            Why Builders Choose Layerz
          </h2>
          <div className="space-y-4 text-xs text-[#5C5C5C] leading-relaxed max-w-2xl mx-auto">
            <p className="font-bold text-sm text-[#111111]">We focus on creating long-term value rather than one-time events.</p>
            <p>Our ecosystem connects education, design, technology, startups, and community into one platform where builders can continuously learn, create, and grow.</p>
          </div>
        </div>
      </section>

      {/* ========================================================
          VISION SECTION
          ======================================================= */}
      <section className="py-24 px-4 border-b border-gray-100 bg-white relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[10px] font-mono font-bold text-[#8B88F8] uppercase tracking-widest block">
            SYSTEM VISION
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#111111] tracking-tight">
            Our Vision
          </h2>
          <p className="text-xs text-[#5C5C5C] leading-relaxed max-w-xl mx-auto">
            To become the world's most trusted innovation ecosystem where anyone with an idea has access to the knowledge, network, and opportunities needed to build the future.
          </p>
        </div>
      </section>

      {/* ========================================================
          NEWSLETTER SECTION
          ======================================================= */}
      <section className="py-20 px-4 bg-gray-50/50 border-b border-gray-100 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase block tracking-wider">
            LAYER_DISCOVERY_FEED
          </span>
          <h3 className="text-3xl font-black text-[#111111] tracking-tight">
            Stay Ahead of What's Next
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Get insights on AI, Blockchain, Startups, Design, and innovation delivered directly to your inbox.
          </p>

          {!newsletterSubscribed ? (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-stretch justify-center gap-2 max-w-md mx-auto pt-4">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-grow px-4 py-2.5 rounded-lg border border-gray-150 bg-white text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-white text-xs font-bold uppercase rounded-lg transition-colors font-mono cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-xs font-mono rounded-xl max-w-sm mx-auto">
              [SYSTEM_STATUS: SUBSCRIBED_OK]
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          FINAL CALL TO ACTION
          ======================================================= */}
      <section className="py-24 px-4 bg-white relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-gray-50 border border-gray-150 p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#89F336]/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <h3 className="text-3xl md:text-4xl font-black text-[#111111] leading-none tracking-tight">
            Ready to Build the Future?
          </h3>
          <p className="text-sm text-[#5c5c5c] max-w-xl mx-auto leading-relaxed">
            Whether you're a student, developer, designer, founder, researcher, or organization, Layerz is where ambitious people come together to create meaningful impact.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link 
              href="/join" 
              className="px-8 py-4 bg-[#111111] hover:bg-[#8B88F8] rounded-lg text-white text-xs font-bold uppercase tracking-widest transition-colors font-mono"
            >
              Join Layerz
            </Link>
            <Link 
              href="/ecosystem" 
              className="px-8 py-4 border border-black hover:bg-white/50 rounded-lg text-[#111111] text-xs font-bold uppercase tracking-widest transition-all font-mono"
            >
              Explore the Ecosystem
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
