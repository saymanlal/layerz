import { Metadata } from "next";
import Link from "next/link";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";
import { getEcosystemData } from "@/utils/getData";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Layerz | Global Innovation Ecosystem",
  description: "Layerz is a global innovation ecosystem empowering builders, creators, startups, and communities through technology, design, education, and collaboration.",
  keywords: ["Layerz Ecosystem", "Web3 Builders", "Product Design Studio", "AI Engineering", "Smart Contracts", "Campus Hackathons"],
  openGraph: {
    title: "Layerz | Global Innovation Ecosystem",
    description: "Layerz is a global innovation ecosystem empowering builders, creators, startups, and communities.",
    images: [{ url: "/logo-bg.jpg" }]
  }
};

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

export default async function Home() {
  // Load data dynamically
  const [programs, studioWork, members, partners, blogs] = await Promise.all([
    getEcosystemData<Program>("programs.json"),
    getEcosystemData<Project>("studio.json"),
    getEcosystemData<Member>("members.json"),
    getEcosystemData<Partner>("partnerships.json"),
    getEcosystemData<Blog>("blogs.json")
  ]);

  const activePrograms = programs.slice(0, 3);
  const featuredStudio = studioWork.filter(p => p.featured).slice(0, 2);
  const activeMembers = members.filter(m => m.checkedIn);
  const featuredPartners = partners.filter(p => p.featured);
  const featuredBlogs = blogs.filter(b => b.featured).slice(0, 3);

  // SEO schemas
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Layerz Ecosystem",
    "url": "https://layerz.xyz",
    "logo": "https://layerz.xyz/logo-bg.jpg",
    "description": "Layerz is a global innovation ecosystem empowering builders, creators, startups, and communities through technology, design, education, and collaboration.",
    "sameAs": [
      "https://x.com/layerz_eco",
      "https://github.com/layerz-eco"
    ]
  };

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-4 text-center hero-gradient border-b border-[#eaeaea]">
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          {/* Static 3D block background texture */}
          <div className="absolute inset-0 bg-[url('/bg-3d.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <ThreeDBlockBg colorType="default" opacity={0.5} />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#dad9fc] bg-[#f5f5ff] text-[#8B88F8] text-xs font-semibold uppercase tracking-widest mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-[#89F336] animate-pulse"></span>
            Building the Future, Layer by Layer
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-[#111111] mb-6 leading-none">
            Building the Next <br />
            <span className="brand-gradient-text">Layer of Innovation.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#5C5C5C] mb-10 leading-relaxed">
            Layerz is a global innovation ecosystem empowering builders, creators, startups, and communities through technology, design, education, and collaboration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/join"
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-xs font-bold text-white uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5"
            >
              JOIN ECOSYSTEM
            </Link>
            <Link
              href="/ecosystem"
              className="w-full sm:w-auto px-8 py-4 rounded-lg border border-[#111111] hover:bg-[#fafafa] text-xs font-bold text-[#111111] uppercase tracking-wider transition-all duration-300"
            >
              EXPLORE ECOSYSTEM
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted By / Sponsor Grid */}
      <section className="py-12 border-b border-[#eaeaea] bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#808080] mb-6">
            Supported & Sponsored By
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-75">
            {featuredPartners.map((partner) => (
              <a
                key={partner.id}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <span className="text-sm font-bold tracking-tight text-[#5c5c5c] hover:text-[#111111] transition-colors">
                  {partner.name}
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#89F336] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* What is Layerz info block */}
      <section className="max-w-6xl mx-auto px-4 py-24 border-b border-[#eaeaea] grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B88F8]">About Layerz</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#111111] mt-2 mb-6">
            More Than a Company. An Ecosystem.
          </h2>
          <p className="text-sm text-[#5C5C5C] leading-relaxed mb-4">
            Layerz exists to empower the next generation of innovators. We believe that great products, thriving communities, and impactful startups are built layer by layer—not overnight.
          </p>
          <p className="text-sm text-[#5C5C5C] leading-relaxed">
            From education and research to product design, startup support, developer communities, and emerging technologies, Layerz creates the infrastructure that helps ideas grow into lasting impact.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-[#fafafa] border border-[#eaeaea] rounded-xl text-center">
            <span className="text-3xl font-extrabold text-[#111111]">{members.length}</span>
            <span className="block text-[10px] text-gray-500 uppercase tracking-wider mt-1">Total Members</span>
          </div>
          <div className="p-6 bg-[#fafafa] border border-[#eaeaea] rounded-xl text-center">
            <span className="text-3xl font-extrabold text-[#89F336]">{activeMembers.length}</span>
            <span className="block text-[10px] text-gray-500 uppercase tracking-wider mt-1">Active Today</span>
          </div>
          <div className="p-6 bg-[#fafafa] border border-[#eaeaea] rounded-xl text-center">
            <span className="text-3xl font-extrabold text-[#8B88F8]">{studioWork.length}</span>
            <span className="block text-[10px] text-gray-500 uppercase tracking-wider mt-1">Case Studies</span>
          </div>
          <div className="p-6 bg-[#fafafa] border border-[#eaeaea] rounded-xl text-center">
            <span className="text-3xl font-extrabold text-[#111111]">100+</span>
            <span className="block text-[10px] text-gray-500 uppercase tracking-wider mt-1">Projects Built</span>
          </div>
        </div>
      </section>

      {/* Ecosystem Layers Cards */}
      <section className="max-w-6xl mx-auto px-4 py-24 border-b border-[#eaeaea]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B88F8]">Core Framework</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#111111] mt-2">
            One Ecosystem. Infinite Possibilities.
          </h2>
          <p className="text-sm text-[#5c5c5c] mt-2">Every initiative within Layerz is designed to solve a different part of the innovation journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="premium-card p-8 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#89F336] uppercase tracking-wider mb-2 block">Layer 01</span>
              <h3 className="text-xl font-bold mb-2">Layerz Foundation</h3>
              <p className="text-xs text-[#5C5C5C] leading-relaxed mb-6">
                Empowering students, developers, and chapters through structured education, fellowships, events, and community innovation programs.
              </p>
            </div>
            <Link href="/ecosystem#foundation" className="text-xs font-bold text-[#8B88F8] hover:text-[#726FE5]">
              Learn More &rarr;
            </Link>
          </div>

          <div className="premium-card p-8 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#8B88F8] uppercase tracking-wider mb-2 block">Layer 02</span>
              <h3 className="text-xl font-bold mb-2">Layerz Studio</h3>
              <p className="text-xs text-[#5C5C5C] leading-relaxed mb-6">
                A Product Design & Technology studio architecting visual brands, Next.js designs, Solidity smart contracts, and custom AI implementations.
              </p>
            </div>
            <Link href="/ecosystem#studio" className="text-xs font-bold text-[#8B88F8] hover:text-[#726FE5]">
              Learn More &rarr;
            </Link>
          </div>

          <div className="premium-card p-8 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Layer 03</span>
              <h3 className="text-xl font-bold mb-2 font-sans">Layerz Labs & Ventures</h3>
              <p className="text-xs text-[#5C5C5C] leading-relaxed mb-6">
                Exploring open-source development, developer tools, and incubator grants to support founders beyond initial mockups.
              </p>
            </div>
            <Link href="/ecosystem#labs" className="text-xs font-bold text-[#8B88F8] hover:text-[#726FE5]">
              Learn More &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="max-w-6xl mx-auto px-4 py-24 border-b border-[#eaeaea]">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#89F336]">Education & Builder chapters</span>
            <h2 className="text-3xl font-extrabold text-[#111111] mt-1">Ecosystem Programs</h2>
          </div>
          <Link href="/programs" className="text-xs font-bold text-[#8B88F8] hover:underline mt-2 sm:mt-0">
            View All Programs &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activePrograms.map((prog) => (
            <div key={prog.id} className="premium-card p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-gray-400 block mb-2">{prog.duration}</span>
                <h4 className="text-lg font-bold text-[#111111] mb-1">{prog.title}</h4>
                <p className="text-xs font-semibold text-[#8B88F8] mb-3">{prog.tagline}</p>
                <p className="text-xs text-[#5C5C5C] leading-relaxed mb-6">{prog.description}</p>
              </div>
              <Link
                href="/programs"
                className="w-full text-center py-2 bg-[#fafafa] border border-[#eaeaea] hover:border-black rounded-lg text-xs font-bold transition-all text-[#111111]"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Studio Projects Section */}
      <section className="max-w-6xl mx-auto px-4 py-24 border-b border-[#eaeaea]">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B88F8]">Featured Case Studies</span>
            <h2 className="text-3xl font-extrabold text-[#111111] mt-1">Studio Portfolio</h2>
          </div>
          <Link href="/studio" className="text-xs font-bold text-[#8B88F8] hover:underline mt-2 sm:mt-0">
            View Case Studies &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredStudio.map((project) => (
            <div key={project.id} className="premium-card p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4 text-[10px] font-mono text-gray-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f0f0ff] border border-[#dad9fc] text-[#8B88F8] font-bold">
                    {project.category}
                  </span>
                  <span>Client: {project.client}</span>
                </div>
                <h3 className="text-2xl font-bold text-[#111111] mb-2">{project.title}</h3>
                <p className="text-xs text-[#5C5C5C] leading-relaxed mb-6">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded bg-[#f5f5f5] border border-[#eaeaea] text-[9px] font-mono text-gray-500">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-[#f5f5f5] pt-4 flex justify-between items-center">
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">Key Outcome</span>
                  <span className="text-xs font-bold text-[#2d5a08]">{project.outcome}</span>
                </div>
                <Link href={`/studio#${project.id}`} className="px-4 py-2 border border-[#111111] hover:bg-[#111111] hover:text-white rounded-lg text-xs font-bold transition-all text-[#111111]">
                  View Scopes
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#89F336]">Insights & Publications</span>
            <h2 className="text-3xl font-extrabold text-[#111111] mt-1">Ecosystem Blog</h2>
          </div>
          <Link href="/blog" className="text-xs font-bold text-[#8B88F8] hover:underline mt-2 sm:mt-0">
            Read Publication &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredBlogs.map((blog) => (
            <article key={blog.id} className="premium-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 mb-3">
                  <span>{blog.date}</span>
                  <span>&bull;</span>
                  <span>{blog.readTime}</span>
                </div>
                <h4 className="text-lg font-bold text-[#111111] hover:text-[#8B88F8] transition-colors mb-2">
                  <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h4>
                <p className="text-xs text-[#5C5C5C] leading-relaxed line-clamp-3 mb-4">
                  {blog.summary}
                </p>
              </div>
              
              <div className="border-t border-[#f5f5f5] pt-4 flex justify-between items-center text-[10px] font-mono">
                <span className="text-[#8B88F8] font-bold uppercase tracking-wider">{blog.category}</span>
                <Link href={`/blog/${blog.slug}`} className="font-bold text-[#111111] hover:underline">
                  Read Article &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
