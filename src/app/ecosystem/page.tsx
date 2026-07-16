import { Metadata } from "next";
import Link from "next/link";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";

export const metadata: Metadata = {
  title: "Ecosystem Layers | Layerz",
  description: "Explore the unified Layers of the Layerz Ecosystem: Foundation (Education), Studio (Product & Design), Labs (Emerging Tech Research), and Ventures.",
  keywords: ["Layerz Foundation", "Layerz Studio", "Layerz Labs", "Layerz Ventures", "Blockchain Ecosystem"],
};

export default function EcosystemPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Ecosystem Layers | Layerz",
    "description": "Explore the unified Layers of the Layerz Ecosystem: Foundation, Studio, Labs, and Ventures.",
    "publisher": {
      "@type": "Organization",
      "name": "Layerz Ecosystem",
      "logo": "https://layerz.xyz/logo-bg.jpg"
    }
  };

  const layers = [
    {
      id: "foundation",
      badge: "Heart of the Ecosystem",
      title: "Layerz Foundation",
      subtitle: "Empowering Communities Through Learning",
      desc: "The Foundation is the heart of Layerz. It nurtures talent through education, workshops, hackathons, fellowships, campus chapters, and community-led programs.",
      focus: ["Education & Courses", "Community Building", "Local Campus Chapters", "Developer Fellowships", "Research Grants", "Events & Workshops"],
      cta: "Explore Programs",
      href: "/programs",
      color: "green",
      status: "active"
    },
    {
      id: "studio",
      badge: "Product & Technology",
      title: "Layerz Studio",
      subtitle: "Designing the Future of Digital Products",
      desc: "Layerz Studio helps startups, builders, and enterprises prototype and design modern brands, digital interfaces, Web3 infrastructures, and custom AI implementations.",
      focus: ["Brand Visual Identity", "UI/UX Design Systems", "Next.js Web Development", "AI Agent Pipelines", "Blockchain & Solidity", "Product Strategy"],
      cta: "Explore Studio",
      href: "/studio",
      color: "lavender",
      status: "active"
    },
    {
      id: "labs",
      badge: "Coming Soon",
      title: "Layerz Labs",
      subtitle: "Research. Experiment. Build.",
      desc: "Layerz Labs explores emerging technological breakthroughs and architects open-source tools to optimize developer experience and coordinate smart systems.",
      focus: ["Artificial Intelligence", "Zero Knowledge Proofs", "Developer Toolkits", "Decentralized Hosting", "Open Source Libraries", "DePIN Infrastructure"],
      cta: "Coming Soon",
      href: "#",
      color: "default",
      status: "soon"
    },
    {
      id: "ventures",
      badge: "Coming Soon",
      title: "Layerz Ventures",
      subtitle: "Supporting Builders Beyond Ideas",
      desc: "Layerz Ventures will assist early-stage startup founders in scaling validation pipelines, obtaining incubation resources, connecting to capital partners, and driving strategic growth.",
      focus: ["Mentorship matching", "Startup Incubation", "Accelerator cohorts", "Pre-seed Grants", "VC & Investor networks", "Security Audits"],
      cta: "Coming Soon",
      href: "#",
      color: "default",
      status: "soon"
    }
  ];

  const steps = [
    { num: "01", title: "Learn", desc: "Gain knowledge through workshops, chapters, and intensive builder cohorts." },
    { num: "02", title: "Build", desc: "Create working prototypes and MVPs with design resources from the Studio and Labs." },
    { num: "03", title: "Launch", desc: "Showcase projects, pitch to mentors, compete in hackathons, and validate fit." },
    { num: "04", title: "Scale", desc: "Access grants, founder networks, strategic funding, and incubator programs." }
  ];

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <div className="relative h-[480px] w-full border-b border-[#eaeaea] bg-gradient-to-b from-white to-[#f5f5ff] overflow-hidden">
        <ThreeDBlockBg colorType="green" opacity={0.5} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        
        <div className="max-w-4xl mx-auto px-4 pt-32 text-center relative z-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#89F336] bg-[#fdfef0] border border-[#d2f9af] px-4 py-1.5 rounded-full inline-block mb-6">
            Ecosystem Directory
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#111111] mb-6 leading-none">
            One Ecosystem. Infinite Possibilities.
          </h1>
          <p className="text-lg md:text-xl text-[#5C5C5C] max-w-2xl mx-auto leading-relaxed">
            Layerz bridges education, design, engineering, and funding into a unified cycle where ambitious builders can learn, deploy, and scale.
          </p>
        </div>
      </div>

      {/* Philosophy block */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center relative z-10 border-b border-[#eaeaea]">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8B88F8] block mb-2">Our Philosophy</span>
        <h2 className="text-3xl font-extrabold tracking-tight text-[#111111] mb-6">Every Layer Strengthens the Next.</h2>
        <p className="text-base text-[#5C5C5C] leading-relaxed max-w-2xl mx-auto">
          Innovation doesn't happen in isolation. A student becomes a developer. A developer builds a product. A product becomes a startup. A startup creates opportunities for others. Layerz connects every stage of that journey.
        </p>
      </section>

      {/* Layers list */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#111111]">Building Every Layer of Innovation</h2>
          <p className="text-xs text-[#5c5c5c] mt-2">Explore the operational layers that compose the Layerz ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {layers.map((layer) => {
            const isSoon = layer.status === "soon";
            const borderColors: Record<string, string> = {
              green: "hover:border-[#89F336] hover:shadow-[#89F336]/5",
              lavender: "hover:border-[#8B88F8] hover:shadow-[#8B88F8]/5",
              default: "hover:border-gray-300"
            };

            return (
              <div
                key={layer.id}
                id={layer.id}
                className={`premium-card p-8 flex flex-col justify-between ${borderColors[layer.color]}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                      {layer.badge}
                    </span>
                    {isSoon && (
                      <span className="px-2.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                        Coming
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-[#111111] mb-1">{layer.title}</h3>
                  <h4 className="text-sm font-semibold text-[#8B88F8] mb-4">{layer.subtitle}</h4>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed mb-6">{layer.desc}</p>
                  
                  <div className="border-t border-[#f5f5f5] pt-6 mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-3">Focus Core Areas:</span>
                    <ul className="grid grid-cols-2 gap-2 text-xs text-[#111111]">
                      {layer.focus.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="h-1 w-1 bg-[#89F336] rounded-full"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  {isSoon ? (
                    <div className="w-full text-center py-2.5 rounded-lg bg-gray-100 border border-gray-200 text-xs font-bold text-gray-400 cursor-not-allowed">
                      {layer.cta}
                    </div>
                  ) : (
                    <Link
                      href={layer.href}
                      className="w-full text-center block py-2.5 rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-xs font-bold text-white uppercase tracking-wider transition-colors duration-200"
                    >
                      {layer.cta}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it connects */}
      <section className="bg-[#fafafa] border-y border-[#eaeaea] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B88F8]">Visual Flow</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111] mt-2 mb-4">One Journey. Multiple Layers.</h2>
            <p className="text-sm text-[#5C5C5C] max-w-md mx-auto">See how builders scale their project validation path within our framework.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((st, idx) => (
              <div key={idx} className="p-6 bg-white border border-[#eaeaea] rounded-xl relative shadow-xs">
                <span className="font-mono text-3xl font-bold text-gray-200 block mb-4">{st.num}</span>
                <h4 className="text-lg font-bold text-[#111111] mb-2">{st.title}</h4>
                <p className="text-xs text-[#5C5C5C] leading-relaxed">{st.desc}</p>
                
                {idx < 3 && (
                  <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 hidden lg:block text-gray-300 z-20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ/Why Ecosystem */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-[#111111] tracking-tight">Why an Ecosystem?</h2>
          <p className="text-sm text-[#5C5C5C] mt-2">Because innovation needs more than one isolated platform.</p>
        </div>

        <div className="space-y-6">
          <div className="p-6 border border-[#eaeaea] rounded-xl bg-white shadow-xs">
            <h4 className="font-bold text-[#111111] text-base mb-2">Connecting Education & Capital</h4>
            <p className="text-xs text-[#5C5C5C] leading-relaxed">
              Traditional models separate design agencies, developer cohorts, and venture funds. Layerz aligns education, brand design, technical auditing, and investment into one continuous lifecycle.
            </p>
          </div>

          <div className="p-6 border border-[#eaeaea] rounded-xl bg-white shadow-xs">
            <h4 className="font-bold text-[#111111] text-base mb-2">Eliminating Startup Friction</h4>
            <p className="text-xs text-[#5C5C5C] leading-relaxed">
              By packaging tools, guidelines, legal briefs, and team coordinates directly, builders skip configuration setups and start writing code or prototyping products immediately.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pt-8">
        <div className="rounded-2xl border border-[#eaeaea] bg-gradient-to-br from-white to-[#f5f5ff] p-8 md:p-12 text-center shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#89F336]/10 rounded-full blur-2xl"></div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#111111] mb-4">Ready to Become Part of the Ecosystem?</h3>
          <p className="text-sm text-[#5C5C5C] max-w-xl mx-auto mb-8">
            Whether you're here to learn, build, design, research, or launch your next startup, there's a place for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/join" className="btn-primary px-8 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider text-center">
              Apply to Join
            </Link>
            <Link href="/programs" className="btn-secondary px-8 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider text-center">
              Explore Programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
