"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";

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

interface HomePageClientProps {
  programs: Program[];
  studioWork: Project[];
  members: Member[];
  partners: Partner[];
  blogs: Blog[];
}

export default function HomePageClient({
  programs,
  studioWork,
  members,
  partners,
  blogs,
}: HomePageClientProps) {
  const [activeMembers, setActiveMembers] = useState(members.filter((m) => m.checkedIn));
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Custom Tilt Handler for 3D card movement
  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -12; // Rotate up/down
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 12; // Rotate left/right
    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${ry}deg`);
  };

  const handleTiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  // Pulse active member simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // randomly toggle checkedIn statuses for some members to simulate real-time coordination
      setActiveMembers((prev) => {
        if (prev.length === 0) return members.slice(0, 3);
        const copy = [...prev];
        if (Math.random() > 0.6 && copy.length > 2) {
          copy.pop();
        } else if (copy.length < members.length) {
          const inactive = members.find((m) => !copy.some((c) => c.id === m.id));
          if (inactive) copy.push(inactive);
        }
        return copy;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [members]);

  const activePrograms = programs.slice(0, 3);
  const featuredStudio = studioWork.filter((p) => p.featured).slice(0, 2);
  const featuredPartners = partners.filter((p) => p.featured);
  const featuredBlogs = blogs.filter((b) => b.featured).slice(0, 3);

  return (
    <div className="relative w-full bg-white text-[#111111] overflow-hidden font-sans">
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative pt-32 pb-24 px-4 text-center hero-gradient border-b border-[#eaeaea]"
      >
        {/* Dynamic Canvas + 3D mesh overlay */}
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <div className="absolute inset-0 bg-[url('/bg-3d.jpg')] bg-cover bg-center opacity-[0.06] mix-blend-overlay"></div>
          <ThreeDBlockBg colorType="default" opacity={0.4} />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">
          
          {/* Animated Chapter Pulse Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#dad9fc] bg-[#f5f5ff] text-[#8B88F8] text-[10px] font-bold uppercase tracking-widest mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#89F336] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#89F336]"></span>
            </span>
            <span>Ecosystem Node Online: {activeMembers.length} Builders Checked-In</span>
          </div>

          {/* BIG High-Tech Glowing Logo Showcase */}
          <div className="relative w-36 h-36 md:w-44 md:h-44 mb-10 tilt-card-container">
            <div 
              onMouseMove={handleTiltMove}
              onMouseLeave={handleTiltLeave}
              className="tilt-card w-full h-full p-4 rounded-3xl bg-white border border-[#eaeaea] shadow-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer"
            >
              {/* Spinning backdrop circles */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[#8B88F8]/20 animate-spin" style={{ animationDuration: "25s" }}></div>
              <div className="absolute inset-2 rounded-full border border-[#89F336]/20 pulsing-ring"></div>
              
              <div className="tilt-card-inner flex flex-col items-center justify-center">
                <img
                  src="/logo-org.jpg"
                  alt="Layerz Organizational Brand Mark"
                  className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105 animate-float"
                />
              </div>

              {/* Laser sweep overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#8B88F8]/10 to-transparent translate-y-full group-hover:translate-y-[-200%] transition-transform duration-1000 ease-in-out"></div>
            </div>
            
            {/* Soft dynamic drop glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#8B88F8] to-[#89F336] rounded-full filter blur-2xl opacity-15 -z-10 group-hover:opacity-25 transition-opacity"></div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#111111] mb-6 leading-none animate-fade-up">
            Architecting the Next <br />
            <span className="brand-gradient-text">Layer of Innovation.</span>
          </h1>

          {/* Technical Wow Quote */}
          <div className="max-w-2xl mx-auto mb-10">
            <blockquote className="text-base md:text-lg font-mono text-[#5c5c5c] border-l-2 border-[#89F336] pl-4 italic mb-2 text-left bg-gray-50/50 py-2 pr-2">
              "The architecture of tomorrow isn't discovered in a single breakthrough. It is built, layer by layer, with absolute engineering precision."
            </blockquote>
            <p className="text-[10px] text-right font-bold tracking-widest text-[#8B88F8] uppercase font-mono">- Layerz Genesis Block</p>
          </div>

          <p className="max-w-xl mx-auto text-sm md:text-base text-[#5c5c5c] mb-12 leading-relaxed">
            Layerz is a high-fidelity innovation ecosystem backing designers, engineers, startups, and community builders deploying next-generation digital products.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/join"
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-xs font-bold text-white uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-[#89F336]/20"
            >
              JOIN ECOSYSTEM
            </Link>
            <Link
              href="/ecosystem"
              className="w-full sm:w-auto px-8 py-4 rounded-lg border border-[#111111] hover:bg-[#fafafa] text-xs font-bold text-[#111111] uppercase tracking-widest transition-all duration-300"
            >
              EXPLORE LAYERS
            </Link>
          </div>
        </div>
      </section>

      {/* Infinite Partner Marquee Carousel */}
      <section className="py-12 border-b border-[#eaeaea] bg-[#fafafa] overflow-hidden relative">
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center mb-6">
          <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#808080]">
            SUPPORTED & CO-DEVELOPED BY
          </span>
        </div>

        {/* Marquee Body */}
        <div className="w-full relative">
          <div className="animate-marquee flex gap-16 items-center">
            {/* Render 3 copies to ensure continuous flow across any display size */}
            {[0, 1, 2].map((loopIndex) => (
              <div key={loopIndex} className="flex gap-16 items-center">
                {featuredPartners.map((partner) => (
                  <a
                    key={`${partner.id}-${loopIndex}`}
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 group whitespace-nowrap"
                  >
                    <div className="h-2 w-2 rounded-full bg-[#8B88F8] opacity-50 group-hover:bg-[#89F336] group-hover:scale-125 transition-all"></div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#5c5c5c] hover:text-[#111111] transition-colors relative">
                      {partner.name}
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#89F336] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                    </span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative Section: Ecosystem Breakdown */}
      <section className="max-w-6xl mx-auto px-4 py-24 border-b border-[#eaeaea] grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#8B88F8]">
            ORGANIZATIONAL DNA
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111111] mt-2 mb-6 leading-none">
            An Autonomous Innovation Engine.
          </h2>
          <p className="text-sm text-[#5C5C5C] leading-relaxed mb-6">
            Layerz operates as an integrated grid of capabilities. We develop open protocols, fund community innovation networks, and construct bespoke visual products for technical enterprises.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded bg-green-50 border border-green-200 flex items-center justify-center text-[#89F336] mt-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-xs text-[#5c5c5c]"><strong className="text-[#111111]">Open Education:</strong> Global builder chapters incubating raw engineering talent.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded bg-purple-50 border border-purple-200 flex items-center justify-center text-[#8B88F8] mt-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-xs text-[#5c5c5c]"><strong className="text-[#111111]">Studio Scopes:</strong> High-end frontend engineering, Solidity auditing, and design structures.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Visual Showcase Box */}
        <div className="tilt-card-container">
          <div 
            onMouseMove={handleTiltMove}
            onMouseLeave={handleTiltLeave}
            className="tilt-card p-8 bg-[#fafafa] border border-[#eaeaea] rounded-2xl flex flex-col justify-between relative min-h-[320px] shadow-sm overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#89F336]/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="tilt-card-inner space-y-6">
              <span className="text-[9px] font-mono font-bold bg-[#111111] text-[#89F336] px-2.5 py-1 rounded uppercase tracking-wider">
                System Load Metrics
              </span>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-[#eaeaea] rounded-xl">
                  <span className="text-2xl font-black text-[#111111]">{members.length}</span>
                  <span className="block text-[9px] text-gray-400 uppercase font-mono mt-1">Registry Nodes</span>
                </div>
                <div className="p-4 bg-white border border-[#eaeaea] rounded-xl">
                  <span className="text-2xl font-black text-[#89F336]">{activeMembers.length}</span>
                  <span className="block text-[9px] text-gray-400 uppercase font-mono mt-1">Coordinating</span>
                </div>
                <div className="p-4 bg-white border border-[#eaeaea] rounded-xl">
                  <span className="text-2xl font-black text-[#8B88F8]">{studioWork.length}</span>
                  <span className="block text-[9px] text-gray-400 uppercase font-mono mt-1">Production Scopes</span>
                </div>
                <div className="p-4 bg-white border border-[#eaeaea] rounded-xl">
                  <span className="text-2xl font-black text-[#111111]">100+</span>
                  <span className="block text-[9px] text-gray-400 uppercase font-mono mt-1">Total Deployments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Layers Cards */}
      <section className="max-w-6xl mx-auto px-4 py-24 border-b border-[#eaeaea]">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#8B88F8]">
            MODULAR STACK
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111111] mt-2 mb-4 leading-none">
            Built in Layers. Connected by Vision.
          </h2>
          <p className="text-sm text-[#5c5c5c] max-w-lg mx-auto">
            Each initiative coordinates to provide path-to-market acceleration for emerging protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              layer: "Layer 01",
              title: "Layerz Foundation",
              color: "#89F336",
              href: "/ecosystem#foundation",
              desc: "Empowering developers and chapters through fellowships, university nodes, open workshops, and campus hackathons.",
            },
            {
              layer: "Layer 02",
              title: "Layerz Studio",
              color: "#8B88F8",
              href: "/ecosystem#studio",
              desc: "Deploying production-grade visual designs, Next.js setups, customized AI integrations, and vetted Solidity smart contract codebases.",
            },
            {
              layer: "Layer 03",
              title: "Layerz Labs & Ventures",
              color: "#5c5c5c",
              href: "/ecosystem#labs",
              desc: "Backing developers and open-source infrastructure tooling through developer grants, venture scaling, and code contributions.",
            },
          ].map((item, idx) => (
            <div key={idx} className="tilt-card-container">
              <div
                onMouseMove={handleTiltMove}
                onMouseLeave={handleTiltLeave}
                className="tilt-card premium-card p-8 flex flex-col justify-between min-h-[340px] cursor-pointer"
              >
                <div className="tilt-card-inner">
                  <span 
                    className="text-[10px] font-mono font-black uppercase tracking-wider mb-3 block"
                    style={{ color: item.color }}
                  >
                    {item.layer}
                  </span>
                  <h3 className="text-2xl font-black text-[#111111] mb-4">{item.title}</h3>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed mb-6">{item.desc}</p>
                </div>
                
                <Link 
                  href={item.href} 
                  className="tilt-card-inner text-xs font-bold uppercase tracking-wider text-[#8B88F8] hover:text-[#726FE5] flex items-center gap-1.5"
                >
                  Inspect Layer <span>&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Storytelling Business Portfolio Section */}
      <section className="max-w-6xl mx-auto px-4 py-24 border-b border-[#eaeaea]">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-16">
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#89F336]">
              CLIENT SHOWCASE
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111111] mt-1 leading-none">
              Selected Case Studies
            </h2>
          </div>
          <Link href="/studio" className="text-xs font-bold text-[#8B88F8] hover:underline uppercase tracking-wider mt-4 sm:mt-0 font-mono">
            View All Scopes &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {featuredStudio.map((project) => (
            <div key={project.id} className="tilt-card-container">
              <div 
                onMouseMove={handleTiltMove}
                onMouseLeave={handleTiltLeave}
                className="tilt-card premium-card p-8 md:p-10 flex flex-col justify-between min-h-[440px]"
              >
                <div className="tilt-card-inner">
                  <div className="flex justify-between items-center mb-6 text-[10px] font-mono">
                    <span className="px-3 py-1 rounded bg-[#f0f0ff] border border-[#dad9fc] text-[#8B88F8] font-bold">
                      {project.category}
                    </span>
                    <span className="text-gray-400">Client: {project.client}</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-black text-[#111111] mb-4 leading-tight">{project.title}</h3>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed mb-6">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded bg-[#f5f5f5] border border-[#eaeaea] text-[9px] font-mono text-gray-500">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="tilt-card-inner border-t border-[#f5f5f5] pt-6 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 block mb-0.5">Outcome Verified</span>
                    <span className="text-xs font-mono font-black text-[#2d5a08]">{project.outcome}</span>
                  </div>
                  <Link 
                    href={`/studio#${project.id}`} 
                    className="px-4 py-2.5 border border-[#111111] hover:bg-[#111111] hover:text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Technical compilation GIF to show portfolio action */}
        <div className="mt-12 p-2 rounded-2xl border border-[#eaeaea] bg-white max-w-2xl mx-auto shadow-sm">
          <div className="relative rounded-xl overflow-hidden h-64">
            <img 
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGlqdnh3cHFocnB2bjJ4OWxydmJrbThpNGw5NWhkbW8zYXoyNmN0ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LdOyjZ7dxu168/giphy.gif"
              alt="Engineering compilation terminal loading indicators"
              className="w-full h-full object-cover filter grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <span className="text-[10px] font-mono text-[#89F336] uppercase tracking-widest font-black">
                STORYTELLING METRIC LOGS
              </span>
              <p className="text-white text-sm font-bold mt-1">
                Real-time validation pipelines compiled. Code deployments vetted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="max-w-6xl mx-auto px-4 py-24 border-b border-[#eaeaea]">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-16">
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#89F336]">
              ACADEMIC CHAPTERS
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111111] mt-1 leading-none">
              Ecosystem Programs
            </h2>
          </div>
          <Link href="/programs" className="text-xs font-bold text-[#8B88F8] hover:underline uppercase tracking-wider mt-4 sm:mt-0 font-mono">
            View All Programs &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activePrograms.map((prog) => (
            <div key={prog.id} className="tilt-card-container">
              <div 
                onMouseMove={handleTiltMove}
                onMouseLeave={handleTiltLeave}
                className="tilt-card premium-card p-6 md:p-8 flex flex-col justify-between min-h-[340px]"
              >
                <div className="tilt-card-inner">
                  <span className="text-[9px] font-mono text-gray-400 block mb-2">{prog.duration}</span>
                  <h4 className="text-xl font-black text-[#111111] mb-1">{prog.title}</h4>
                  <p className="text-xs font-semibold text-[#8B88F8] mb-4">{prog.tagline}</p>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed mb-6">{prog.description}</p>
                </div>
                <Link
                  href="/programs"
                  className="tilt-card-inner w-full text-center py-3 bg-[#fafafa] border border-[#eaeaea] hover:border-black rounded-lg text-xs font-bold transition-all text-[#111111] uppercase tracking-wider"
                >
                  Inspect Blueprint
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-16">
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#8B88F8]">
              ENGINEERING INSIGHTS
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111111] mt-1 leading-none">
              Insights & Publications
            </h2>
          </div>
          <Link href="/blog" className="text-xs font-bold text-[#8B88F8] hover:underline uppercase tracking-wider mt-4 sm:mt-0 font-mono">
            Read Publication &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredBlogs.map((blog) => (
            <article key={blog.id} className="tilt-card-container">
              <div 
                onMouseMove={handleTiltMove}
                onMouseLeave={handleTiltLeave}
                className="tilt-card premium-card p-6 md:p-8 flex flex-col justify-between min-h-[300px]"
              >
                <div className="tilt-card-inner">
                  <div className="flex items-center gap-2 text-[9px] font-mono text-gray-400 mb-3">
                    <span>{blog.date}</span>
                    <span>&bull;</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h4 className="text-lg font-black text-[#111111] hover:text-[#8B88F8] transition-colors mb-3 leading-snug">
                    <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h4>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed line-clamp-3 mb-6">
                    {blog.summary}
                  </p>
                </div>
                
                <div className="tilt-card-inner border-t border-[#f5f5f5] pt-4 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-[#8B88F8] font-bold uppercase tracking-wider">{blog.category}</span>
                  <Link href={`/blog/${blog.slug}`} className="font-black text-[#111111] hover:underline">
                    Read &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
