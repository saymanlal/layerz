import { Metadata } from "next";
import Link from "next/link";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";

export const metadata: Metadata = {
  title: "Our Story | Layerz Ecosystem",
  description: "Learn about the mission, values, and story of Layerz—a global innovation ecosystem empowering developers, creators, founders, and research builders.",
  keywords: ["Layerz Story", "Layerz Mission", "Web3 Incubator", "AI Research", "Developer Foundations"],
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Our Story | Layerz Ecosystem",
    "description": "Learn about the mission, values, and story of Layerz—a global innovation ecosystem empowering developers, creators, founders, and research builders.",
    "publisher": {
      "@type": "Organization",
      "name": "Layerz Ecosystem",
      "logo": "https://layerz.xyz/logo-bg.jpg"
    }
  };

  const principles = [
    { title: "Build with Purpose", desc: "Every product, program, and initiative should create meaningful value." },
    { title: "Learn Continuously", desc: "Growth happens one layer at a time through curiosity and continuous learning." },
    { title: "Community First", desc: "Great innovation is built together, not alone." },
    { title: "Design Matters", desc: "Thoughtful design creates better products, experiences, and outcomes." },
    { title: "Think Globally", desc: "Build solutions that can create impact beyond borders." },
    { title: "Stay Open", desc: "Knowledge grows when it's shared." }
  ];

  const values = [
    { title: "Innovation", desc: "Challenge assumptions and explore new possibilities." },
    { title: "Integrity", desc: "Operate with honesty, transparency, and accountability." },
    { title: "Excellence", desc: "Pursue quality in every product, experience, and interaction." },
    { title: "Collaboration", desc: "Great things happen when talented people work together." },
    { title: "Accessibility", desc: "Innovation should be accessible to everyone, everywhere." },
    { title: "Impact", desc: "Focus on creating lasting value instead of short-term success." }
  ];

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
        
        <div className="max-w-4xl mx-auto px-4 pt-32 text-center relative z-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B88F8] bg-[#f0f0ff] border border-[#dad9fc] px-4 py-1.5 rounded-full inline-block mb-6">
            Who We Are
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#111111] mb-6 leading-none">
            Building the Infrastructure for the Next Generation of Builders.
          </h1>
          <p className="text-lg md:text-xl text-[#5C5C5C] max-w-2xl mx-auto leading-relaxed">
            Layerz is a global innovation ecosystem dedicated to empowering builders, creators, startups, researchers, and communities through technology, education, design, and collaboration.
          </p>
        </div>
      </div>

      {/* Our Story section */}
      <section className="max-w-6xl mx-auto px-4 py-20 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B88F8]">Our Foundations</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111] mt-2 mb-6 tracking-tight">
            Every Great Innovation Begins with a Strong Foundation.
          </h2>
          <p className="text-base text-[#5C5C5C] leading-relaxed mb-4">
            Layerz was founded with a simple belief: innovation shouldn't be limited by geography, background, or access to opportunities.
          </p>
          <p className="text-base text-[#5C5C5C] leading-relaxed mb-4">
            Across the world, millions of talented individuals have the potential to build extraordinary things—but often lack the right community, mentorship, resources, and ecosystem. Layerz exists to bridge that gap.
          </p>
          <p className="text-base text-[#5C5C5C] leading-relaxed">
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

      {/* Mission & Vision */}
      <section className="bg-[#fafafa] border-y border-[#eaeaea] py-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-8 rounded-2xl bg-white border border-[#eaeaea] shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-[#8B88F8]/10 flex items-center justify-center text-[#8B88F8] mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
            <p className="text-[#5C5C5C] leading-relaxed">
              To empower the next generation of innovators by creating an ecosystem where education, technology, design, research, and entrepreneurship come together to solve meaningful problems and shape the future.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-[#eaeaea] shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-[#89F336]/10 flex items-center justify-center text-[#89F336] mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
            <p className="text-[#5C5C5C] leading-relaxed">
              To become the world's most trusted innovation ecosystem—connecting people, ideas, and technology to build solutions that create lasting global impact.
            </p>
          </div>
        </div>
      </section>

      {/* Our Principles */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B88F8]">Guided By</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111] mt-2 mb-4 tracking-tight">Our Core Principles</h2>
          <p className="text-sm text-[#5C5C5C] max-w-md mx-auto">The operational pillars guiding our educational design, software standards, and community growth.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {principles.map((pr, idx) => (
            <div key={idx} className="premium-card p-6 md:p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-gray-300 block mb-4">0{idx + 1}</span>
                <h4 className="text-lg font-bold text-[#111111] mb-2">{pr.title}</h4>
                <p className="text-xs text-[#5C5C5C] leading-relaxed">{pr.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 border-t border-[#eaeaea] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#89F336]">Ethos</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111] mt-2 mb-4 tracking-tight">Our Core Values</h2>
            <p className="text-sm text-[#5C5C5C] max-w-md mx-auto">The internal compass of our builders, engineers, and collective partners.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <div key={idx} className="p-6 bg-white border border-[#eaeaea] rounded-xl shadow-xs">
                <h4 className="font-bold text-[#111111] mb-2">{val.title}</h4>
                <p className="text-xs text-[#5C5C5C] leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B88F8]">Chronology</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111] mt-2 mb-4 tracking-tight">Building Layer by Layer</h2>
        </div>

        <div className="relative border-l border-[#eaeaea] ml-4 md:ml-32 space-y-12">
          {/* Node 1 */}
          <div className="relative pl-8">
            <div className="absolute -left-2 top-1.5 h-4 w-4 rounded-full border-4 border-white bg-[#89F336]"></div>
            <div className="absolute left-[-120px] top-1 hidden md:block text-right w-24">
              <span className="font-mono font-bold text-sm text-[#111111]">Q1-Q2 2026</span>
            </div>
            <h4 className="text-lg font-bold text-[#111111] mb-1">Ecosystem Genesis</h4>
            <p className="text-xs text-[#5C5C5C] leading-relaxed">
              Launch of Layerz Foundation Chapter cohorts, smart contract fellowships, and standard design specifications globally.
            </p>
          </div>

          {/* Node 2 */}
          <div className="relative pl-8">
            <div className="absolute -left-2 top-1.5 h-4 w-4 rounded-full border-4 border-white bg-[#8B88F8]"></div>
            <div className="absolute left-[-120px] top-1 hidden md:block text-right w-24">
              <span className="font-mono font-bold text-sm text-[#5C5C5C]">Q3-Q4 2026</span>
            </div>
            <h4 className="text-lg font-bold text-[#111111] mb-1">Product Design Studio Integration</h4>
            <p className="text-xs text-[#5C5C5C] leading-relaxed">
              Consolidation of Product Design & tech consultings, providing smart client branding, full-stack Web3 interfaces, and custom AI implementations.
            </p>
          </div>

          {/* Node 3 */}
          <div className="relative pl-8">
            <div className="absolute -left-2 top-1.5 h-4 w-4 rounded-full border-4 border-white bg-gray-300"></div>
            <div className="absolute left-[-120px] top-1 hidden md:block text-right w-24">
              <span className="font-mono font-bold text-sm text-gray-400">2027 & Beyond</span>
            </div>
            <h4 className="text-lg font-bold text-gray-400 mb-1">Labs & Venture Programs</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Scaling advanced open-source tools under Layerz Labs and launching pre-seed capital grants under Layerz Ventures to validate MVPs globally.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-4xl mx-auto px-4 pt-12">
        <div className="rounded-2xl border border-[#eaeaea] bg-gradient-to-br from-white to-[#f5f5ff] p-8 md:p-12 text-center shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#89F336]/10 rounded-full blur-2xl"></div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#111111] mb-4">Join the Next Layer of Innovation</h3>
          <p className="text-sm text-[#5C5C5C] max-w-xl mx-auto mb-8">
            Whether you're building your first project or your next company, Layerz is where ideas grow into impact.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/ecosystem" className="btn-primary px-8 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider text-center">
              Explore Ecosystem
            </Link>
            <Link href="/join" className="btn-secondary px-8 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider text-center">
              Join Layerz
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
