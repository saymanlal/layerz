"use client";

import { useState } from "react";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";

interface Resource {
  id: string;
  title: string;
  category: string;
  type: string;
  description: string;
  downloadUrl: string;
  tags: string[];
}

interface ResourcesPageClientProps {
  initialResources: Resource[];
}

export default function ResourcesPageClient({ initialResources }: ResourcesPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Downloader simulator state
  const [downloadingResource, setDownloadingResource] = useState<Resource | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadState, setDownloadState] = useState<"idle" | "connecting" | "downloading" | "complete">("idle");

  const categories = ["all", "Artificial Intelligence", "Blockchain & Web3", "Startups", "Product Design", "Community"];

  const handleDownloadStart = (resource: Resource) => {
    setDownloadingResource(resource);
    setDownloadState("connecting");
    setDownloadProgress(0);

    setTimeout(() => {
      setDownloadState("downloading");
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 5;
        if (currentProgress >= 100) {
          currentProgress = 100;
          setDownloadProgress(100);
          setDownloadState("complete");
          clearInterval(interval);
        } else {
          setDownloadProgress(currentProgress);
        }
      }, 150);
    }, 800);
  };

  const filteredResources = initialResources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "all" || res.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 h-[450px] w-full border-b border-[#eaeaea] bg-gradient-to-b from-white to-[#f5f5ff] overflow-hidden">
        <ThreeDBlockBg colorType="default" opacity={0.5} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
        {/* Header Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B88F8] bg-[#f0f0ff] border border-[#dad9fc] px-4 py-1.5 rounded-full inline-block">
            Knowledge Vault
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#111111] mt-6 mb-4">
            Knowledge That Helps You Build Better.
          </h1>
          <p className="text-lg text-[#5C5C5C] leading-relaxed">
            Explore curated playbooks, guides, research templates, and toolkits across AI, Blockchain, Product Design, and Startups.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-12 max-w-3xl mx-auto">
          {/* Search Input */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search guides, templates, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-xs focus:outline-none focus:border-[#8B88F8] transition-colors"
            />
          </div>

          {/* Categories select */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? "bg-[#111111] text-white border-black"
                    : "bg-[#fafafa] text-gray-500 border-[#eaeaea] hover:text-black hover:border-gray-300"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredResources.length === 0 ? (
            <div className="col-span-full text-center py-16 border border-[#eaeaea] bg-[#fafafa] rounded-xl">
              <p className="text-xs text-gray-500">No resources found matching the criteria.</p>
            </div>
          ) : (
            filteredResources.map((res) => (
              <div
                key={res.id}
                className="premium-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] uppercase font-bold text-[#8B88F8] tracking-wider font-mono">
                      {res.type}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium bg-[#fafafa] px-2.5 py-0.5 rounded-full border border-[#eaeaea]">
                      {res.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#111111] mb-2 leading-snug">{res.title}</h3>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed mb-6">{res.description}</p>
                </div>

                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-6">
                    {res.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-[#f5f5f5] border border-[#eaeaea] text-[9px] font-mono text-gray-500"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleDownloadStart(res)}
                    className="w-full py-3 text-center rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-xs font-bold text-white uppercase tracking-wider transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    Download Resource
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Vault downloader simulator */}
        {downloadingResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="relative w-full max-w-sm bg-white rounded-2xl border border-[#eaeaea] shadow-2xl p-8 text-center animate-scale-up font-mono text-xs">
              {downloadState === "complete" && (
                <button
                  onClick={() => setDownloadingResource(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer font-sans"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              <h3 className="text-sm font-bold text-[#111111] mb-4 uppercase tracking-wider">
                Layerz Vault Terminal
              </h3>

              {downloadState === "connecting" && (
                <div className="py-8 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B88F8] mx-auto"></div>
                  <p className="text-xs text-[#8B88F8] animate-pulse">ESTABLISHING SECURE GATEWAY...</p>
                  <p className="text-[9px] text-gray-400">CONNECTING SECURE ENDPOINT</p>
                </div>
              )}

              {downloadState === "downloading" && (
                <div className="py-8 space-y-4">
                  {/* Progress Ring visual */}
                  <div className="relative h-20 w-20 mx-auto flex items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full transform -rotate-90">
                      <circle cx="40" cy="40" r="34" className="stroke-gray-100" strokeWidth="4" fill="transparent" />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        className="stroke-[#8B88F8] transition-all duration-100"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={213.6}
                        strokeDashoffset={213.6 - (213.6 * downloadProgress) / 100}
                      />
                    </svg>
                    <span className="text-sm font-bold text-[#111111]">{downloadProgress}%</span>
                  </div>
                  <p className="text-xs text-gray-500">RETRIEVING ENCRYPTED BLOCKS...</p>
                </div>
              )}

              {downloadState === "complete" && (
                <div className="py-6 space-y-6">
                  <div className="h-12 w-12 bg-[#e8fcd7] border border-[#d2f9af] text-[#2d5a08] rounded-full flex items-center justify-center mx-auto">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold text-[#111111] uppercase mb-1">
                      {downloadingResource.title}
                    </p>
                    <p className="text-[10px] text-[#2d5a08] font-bold">TRANSMISSION SECURED &middot; OK</p>
                  </div>

                  <div className="p-4 bg-[#fafafa] border border-[#eaeaea] rounded-xl text-left text-xs leading-relaxed text-gray-500 space-y-2">
                    <p className="text-[10px] font-bold text-[#111111] uppercase border-b border-[#eaeaea] pb-1">
                      Verification Log:
                    </p>
                    <p>
                      This resource has been logged to your browser download stack. It contains templates, worksheets, and scoping details assembled by the Layerz ecosystem.
                    </p>
                  </div>

                  <button
                    onClick={() => setDownloadingResource(null)}
                    className="px-6 py-2.5 rounded-lg bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#89F336] hover:text-[#111111] transition-colors w-full cursor-pointer"
                  >
                    CLOSE VAULT
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
