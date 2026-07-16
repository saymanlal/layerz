import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEcosystemData } from "@/utils/getData";

export const dynamic = "force-dynamic";

interface Blog {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  date: string;
  readTime: string;
  slug: string;
  author: string;
  tags: string[];
  featured: boolean;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blogs = await getEcosystemData<Blog>("blogs.json");
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return {
      title: "Article Not Found | Layerz",
    };
  }

  return {
    title: `${blog.title} | Layerz Insights`,
    description: blog.summary,
    openGraph: {
      title: blog.title,
      description: blog.summary,
      type: "article",
      publishedTime: blog.date,
      authors: [blog.author],
      tags: blog.tags,
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const blogs = await getEcosystemData<Blog>("blogs.json");
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  // Parse custom paragraphs
  const renderParagraphs = (content: string) => {
    return content.split("\n\n").map((para, index) => {
      if (para.startsWith("### ")) {
        return (
          <h3 key={index} className="text-xl font-bold text-[#111111] mt-8 mb-4 border-b border-[#eaeaea] pb-2 font-sans">
            {para.replace("### ", "")}
          </h3>
        );
      }
      if (para.startsWith("1. ") || para.startsWith("2. ") || para.startsWith("3. ") || para.startsWith("4. ")) {
        const items = para.split("\n");
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 text-sm text-[#5c5c5c] my-4 pl-4 font-sans">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{item.replace(/^\d+\.\s+/, "")}</li>
            ))}
          </ol>
        );
      }
      return (
        <p key={index} className="text-sm md:text-base text-[#5c5c5c] leading-relaxed mb-6 font-sans">
          {para}
        </p>
      );
    });
  };

  // Structured JSON-LD Article Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "datePublished": blog.date,
    "abstract": blog.summary,
    "description": blog.summary,
    "author": {
      "@type": "Person",
      "name": blog.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Layerz Ecosystem",
      "url": "https://layerz.xyz"
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-[#111111] py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-black transition-colors mb-12"
        >
          &larr; Back to Research Archive
        </Link>

        {/* Article content */}
        <article className="space-y-8">
          <header className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f0f0ff] border border-[#dad9fc] text-[#8B88F8] uppercase tracking-widest">
                {blog.category}
              </span>
              <span className="text-xs text-gray-400 font-mono">{blog.date}</span>
              <span className="text-xs text-gray-400 font-mono">&bull;</span>
              <span className="text-xs text-gray-400 font-mono">{blog.readTime}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-[#111111] leading-tight">
              {blog.title}
            </h1>

            {/* Author Block */}
            <div className="flex items-center gap-4 pt-4 border-b border-[#eaeaea] pb-8">
              <div className="h-10 w-10 bg-[#fafafa] rounded-full border border-[#eaeaea] flex items-center justify-center text-sm font-bold text-[#111111]">
                {blog.author[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-[#111111]">{blog.author}</p>
                <p className="text-xs text-gray-400">Ecosystem Author &middot; Research Contributor</p>
              </div>
            </div>
          </header>

          {/* Article Body */}
          <div className="py-6 leading-relaxed">
            {renderParagraphs(blog.content)}
          </div>

          {/* Footer Tags */}
          <footer className="pt-8 border-t border-[#eaeaea] mt-12 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-lg bg-[#fafafa] border border-[#eaeaea] text-xs font-mono text-gray-500"
              >
                #{tag}
              </span>
            ))}
          </footer>
        </article>
      </div>
    </div>
  );
}
