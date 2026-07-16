import { Metadata } from "next";
import Link from "next/link";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";
import { getEcosystemData } from "@/utils/getData";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Insights Blog | Layerz Ecosystem",
  description: "Read the latest engineering articles, design tokens updates, Solidity auditing findings, and AI workflows from Layerz Studio and Labs.",
  keywords: ["AI publication", "Smart Contract blog", "UI/UX design systems", "Ecosystem updates", "Layerz Blog"],
};

interface Blog {
  id: string;
  title: string;
  category: string;
  summary: string;
  date: string;
  readTime: string;
  slug: string;
  author: string;
  tags: string[];
  featured: boolean;
}

export default async function BlogIndexPage() {
  const blogs = await getEcosystemData<Blog>("blogs.json");

  const featuredBlog = blogs.find((b) => b.featured) || blogs[0];
  const regularBlogs = blogs.filter((b) => b.id !== featuredBlog?.id);

  // JSON-LD structured data roll for GEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Layerz Insights Publication",
    "description": "Read the latest engineering articles, design tokens updates, Solidity auditing findings, and AI workflows from Layerz Studio and Labs.",
    "publisher": {
      "@type": "Organization",
      "name": "Layerz Ecosystem",
      "logo": "https://layerz.xyz/logo-bg.jpg"
    },
    "blogPost": blogs.map((b) => ({
      "@type": "BlogPosting",
      "headline": b.title,
      "datePublished": b.date,
      "abstract": b.summary,
      "author": {
        "@type": "Person",
        "name": b.author
      }
    }))
  };

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background decoration */}
      <div className="absolute inset-0 h-[450px] w-full border-b border-[#eaeaea] bg-gradient-to-b from-white to-[#f5f5ff] overflow-hidden">
        <ThreeDBlockBg colorType="lavender" opacity={0.4} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
        {/* Header Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B88F8] bg-[#f0f0ff] border border-[#dad9fc] px-4 py-1.5 rounded-full inline-block">
            Ecosystem Publication
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#111111] mt-6 mb-4">
            Insights & Ideas
          </h1>
          <p className="text-lg text-[#5C5C5C] leading-relaxed">
            Technical writing, smart contract security briefs, product design systems, and AI workflows from Layerz Studio and Labs.
          </p>
        </div>

        {/* Featured Post Card */}
        {featuredBlog && (
          <div className="premium-card overflow-hidden mb-16 max-w-5xl mx-auto hover:border-[#8B88F8]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f0f0ff] border border-[#dad9fc] text-[#8B88F8] uppercase tracking-widest">
                    Featured Article
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{featuredBlog.date}</span>
                </div>

                <h2 className="text-2xl md:text-4xl font-extrabold text-[#111111] leading-tight hover:text-[#8B88F8] transition-colors">
                  <Link href={`/blog/${featuredBlog.slug}`}>{featuredBlog.title}</Link>
                </h2>

                <p className="text-sm text-[#5C5C5C] leading-relaxed">
                  {featuredBlog.summary}
                </p>

                <div className="flex items-center gap-4 pt-2">
                  <div className="h-10 w-10 bg-[#fafafa] rounded-full border border-[#eaeaea] flex items-center justify-center text-sm font-bold text-[#111111]">
                    {featuredBlog.author[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#111111]">{featuredBlog.author}</p>
                    <p className="text-[10px] text-gray-500">Author &bull; {featuredBlog.readTime}</p>
                  </div>
                </div>
              </div>

              {/* Graphical block */}
              <div className="flex flex-col justify-center items-center bg-[#fafafa] rounded-xl border border-[#eaeaea] p-8 text-center min-h-[250px] relative overflow-hidden">
                <div className="absolute right-0 top-0 text-[9px] font-mono text-gray-400 bg-white px-3 py-1 border-bl border-[#eaeaea] rounded-bl-lg">
                  PUB_NODE_ID: {featuredBlog.id}
                </div>
                
                {/* SVG Isometric layers stack */}
                <svg width="40" height="40" viewBox="0 0 34 34" fill="none" className="mb-4">
                  <path d="M17 26.5L6 21L17 15.5L28 21L17 26.5Z" fill="#8B88F8" opacity="0.8" />
                  <path d="M17 17.5L6 12L17 6.5L28 12L17 17.5Z" fill="#89F336" opacity="0.8" />
                </svg>

                <p className="text-xs font-bold text-[#8B88F8] tracking-widest uppercase mb-2">
                  Topic: {featuredBlog.category}
                </p>
                <div className="flex gap-1.5 flex-wrap justify-center mt-1">
                  {featuredBlog.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-white border border-[#eaeaea] text-[9px] font-mono text-gray-500">
                      #{t}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/blog/${featuredBlog.slug}`}
                  className="mt-6 px-6 py-2.5 rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-xs font-bold text-white uppercase tracking-wider transition-colors duration-200"
                >
                  Read Article
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {regularBlogs.map((blog) => (
            <article
              key={blog.id}
              className="premium-card flex flex-col justify-between"
            >
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#8B88F8] tracking-wider font-mono">
                    {blog.category}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">{blog.date}</span>
                </div>

                <h3 className="text-xl font-bold text-[#111111] hover:text-[#8B88F8] transition-colors leading-tight">
                  <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h3>

                <p className="text-xs text-[#5C5C5C] leading-relaxed line-clamp-3">
                  {blog.summary}
                </p>
              </div>

              <div className="p-8 border-t border-[#f5f5f5] bg-[#fafafa] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-white rounded-full border border-[#eaeaea] flex items-center justify-center text-xs font-bold text-[#111111]">
                    {blog.author[0]}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#111111]">{blog.author}</p>
                    <p className="text-[9px] text-gray-400">{blog.readTime}</p>
                  </div>
                </div>

                <Link
                  href={`/blog/${blog.slug}`}
                  className="text-xs font-bold text-[#111111] hover:text-[#8B88F8] flex items-center gap-1"
                >
                  Read Post &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
