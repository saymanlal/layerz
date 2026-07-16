"use client";

import { useState, useEffect } from "react";
import ProceduralBg from "@/components/ProceduralBg";

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
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "playbook" | "toolkit" | "brand" | "press">("all");
  const [downloadingResource, setDownloadingResource] = useState<Resource | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadState, setDownloadState] = useState<"idle" | "connecting" | "downloading" | "complete">("idle");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Sync real-time updates directly from databases
  useEffect(() => {
    async function syncResources() {
      try {
        const res = await fetch("/api/admin/data?file=resources.json");
        if (res.ok) {
          setResources(await res.json());
        }
      } catch (err) {
        console.error("Resources sync failed:", err);
      }
    }
    syncResources();
    const interval = setInterval(syncResources, 6000);
    return () => clearInterval(interval);
  }, []);

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

  const copyColor = (colorHex: string) => {
    navigator.clipboard.writeText(colorHex);
    setCopiedColor(colorHex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesTab = true;
    if (activeTab === "playbook") matchesTab = res.category === "Startups" || res.category === "Product Design";
    else if (activeTab === "toolkit") matchesTab = res.category === "Artificial Intelligence" || res.category === "Blockchain & Web3";
    else if (activeTab === "brand" || activeTab === "press") matchesTab = false; // Custom section handled below

    return matchesSearch && matchesTab;
  });

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      
      {/* Background Knowledge Mesh Grid */}
      <div className="absolute inset-0 h-[480px] w-full border-b border-gray-100 bg-gradient-to-b from-white to-[#fcfcff] overflow-hidden">
        <ProceduralBg mode="mesh" colorType="default" opacity={0.35} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
        
        {/* Header Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-[10px] font-mono font-bold text-[#8B88F8] bg-[#f0f0ff] border border-[#dad9fc] px-4 py-1.5 rounded-full inline-block">
            KNOWLEDGE VAULT
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#111111] mt-6 mb-4">
            Resources & Brand Kit
          </h1>
          <p className="text-sm md:text-base text-[#5C5C5C] leading-relaxed">
            Access playbooks, design system variables, developer toolkits, and official brand assets.
          </p>
        </div>

        {/* Portal layout with sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
          
          {/* Left Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
            <div className="border border-gray-100 bg-[#fafafa] rounded-2xl p-6 space-y-2">
              <span className="text-[8px] font-mono text-gray-400 block mb-2 uppercase">RESOURCES INDEX</span>
              
              <ul className="space-y-1 font-mono text-[10px]">
                {[
                  { id: "all", label: "ALL RESOURCES" },
                  { id: "playbook", label: "PLAYBOOKS & GUIDES" },
                  { id: "toolkit", label: "DEVELOPER SDKS" },
                  { id: "brand", label: "BRAND IDENTITY KIT" },
                  { id: "press", label: "PRESS & MEDIA KIT" }
                ].map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id as "all" | "playbook" | "toolkit" | "brand" | "press")}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-[#111111] text-white"
                          : "text-gray-500 hover:bg-gray-100 hover:text-[#111111]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right Content Space */}
          <main className="lg:col-span-9 space-y-12">
            
            {/* Search Input */}
            {activeTab !== "brand" && activeTab !== "press" && (
              <div className="max-w-md relative">
                <input
                  type="text"
                  placeholder="Search resources, tags, or playbooks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-3 rounded-lg border border-gray-100 bg-white text-xs focus:outline-none focus:border-[#8B88F8] transition-colors"
                />
              </div>
            )}

            {/* List resources */}
            {activeTab !== "brand" && activeTab !== "press" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredResources.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-xs text-gray-400 font-mono">
                    No files matching search queries.
                  </div>
                ) : (
                  filteredResources.map((res) => (
                    <div key={res.id} className="premium-card p-6 flex flex-col justify-between min-h-[220px]">
                      <div>
                        <div className="flex justify-between items-center text-[9px] font-mono mb-3">
                          <span className="text-[#8B88F8] font-bold uppercase">{res.type}</span>
                          <span className="text-gray-400 uppercase">{res.category}</span>
                        </div>

                        <h3 className="text-base font-black text-[#111111] leading-tight mb-2">{res.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4">{res.description}</p>
                      </div>

                      <div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {res.tags.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded border border-gray-100 bg-gray-50 text-[8px] font-mono text-gray-400">#{t}</span>
                          ))}
                        </div>

                        <button
                          onClick={() => handleDownloadStart(res)}
                          className="w-full py-2.5 bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-white text-xs font-bold uppercase rounded-lg transition-colors font-mono cursor-pointer"
                        >
                          DOWNLOAD_PAYLOAD
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* CUSTOM BRAND KIT VIEW */}
            {activeTab === "brand" && (
              <div className="space-y-8 animate-scale-up">
                <div className="p-8 border border-gray-100 bg-[#fafafa] rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <span className="text-[8px] font-mono text-gray-400 block uppercase">PRIMARY IDENTITY</span>
                    <h3 className="text-2xl font-black text-[#111111] leading-none">The Brandmark</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      The official Layerz identifier consists of our stacked isometric nodes and our technical monospaced wordmark.
                    </p>
                    <a
                      href="/logo-org.jpg"
                      download
                      className="inline-block px-6 py-2.5 bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg font-mono transition-colors"
                    >
                      DOWNLOAD BRANDMARK SVG
                    </a>
                  </div>

                  <div className="p-8 bg-white border border-gray-100 rounded-xl flex items-center justify-center h-44 shadow-inner">
                    <img src="/logo-org.jpg" alt="Logo" className="h-24 w-24 object-contain" />
                  </div>
                </div>

                {/* Color swatch dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "Primary Green", hex: "#89F336", desc: "Interact states, check-in nodes" },
                    { name: "Primary Lavender", hex: "#8B88F8", desc: "Decentralized links, visual blueprints" },
                    { name: "Deep Black", hex: "#111111", desc: "Primary headers, text, dark segments" },
                    { name: "Light White", hex: "#FFFFFF", desc: "Background panels, clean grids" }
                  ].map((color) => (
                    <div
                      key={color.hex}
                      onClick={() => copyColor(color.hex)}
                      className="p-4 rounded-xl border border-gray-100 hover:border-[#dad9fc] transition-colors cursor-pointer group flex flex-col justify-between h-24 bg-white"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold block text-[#111111] group-hover:text-[#8B88F8]">
                            {color.name}
                          </span>
                          <span className="text-[9px] text-gray-400 mt-0.5">{color.desc}</span>
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: color.hex }}></div>
                      </div>

                      <div className="flex justify-between items-center text-[8px] font-mono text-gray-400 pt-2 border-t border-gray-50">
                        <span>{color.hex}</span>
                        <span className="text-[#8B88F8] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          {copiedColor === color.hex ? "COPIED" : "CLICK TO COPY"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CUSTOM PRESS KIT VIEW */}
            {activeTab === "press" && (
              <div className="space-y-8 animate-scale-up">
                <div className="p-8 border border-gray-100 bg-[#fafafa] rounded-2xl space-y-6">
                  <span className="text-[8px] font-mono text-gray-400 block uppercase">CORPORATE DESCRIPTION</span>
                  <h3 className="text-2xl font-black text-[#111111] leading-none">Press & Media Brief</h3>
                  
                  <div className="space-y-4 text-xs text-gray-500 leading-relaxed">
                    <p>
                      <strong>Boilerplate description:</strong> Layerz is an integrated Web3 capability engine. We operate a decentralized network of campus builder chapters (Foundation), deploy full-stack design prototypes and Solidity audits (Studio), and research cryptographically secure open-source tooling (Labs).
                    </p>
                    <p>
                      <strong>Founding Year:</strong> 2026 &bull; <strong>HQ:</strong> Remote / San Francisco &bull; <strong>Founders:</strong> Sarah Chen, Jane Doe
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleDownloadStart({
                      id: "press-vault",
                      title: "Layerz Official Media Press Kit",
                      category: "Press",
                      type: "ZIP",
                      description: "ZIP payload containing official vector logos, founder photos, and text template copy.",
                      downloadUrl: "/press-kit.zip",
                      tags: []
                    })}
                    className="px-6 py-2.5 bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg font-mono transition-all cursor-pointer"
                  >
                    DOWNLOAD COMPREHENSIVE PRESS KIT
                  </button>
                </div>
              </div>
            )}

          </main>

        </div>

        {/* Vault terminal simulator */}
        {downloadingResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="relative w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-2xl p-8 text-center animate-scale-up font-mono text-xs text-gray-500">
              {downloadState === "complete" && (
                <button
                  onClick={() => setDownloadingResource(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer font-sans"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              <h3 className="text-sm font-bold text-[#111111] mb-4 uppercase tracking-wider">
                Layerz Terminal Gateway
              </h3>

              {downloadState === "connecting" && (
                <div className="py-8 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B88F8] mx-auto"></div>
                  <p className="text-[#8B88F8] animate-pulse">ESTABLISHING SECURE GATEWAY...</p>
                </div>
              )}

              {downloadState === "downloading" && (
                <div className="py-8 space-y-4">
                  <div className="relative h-20 w-20 mx-auto flex items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full transform -rotate-90">
                      <circle cx="40" cy="40" r="34" className="stroke-gray-100" strokeWidth="3" fill="transparent" />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        className="stroke-[#8B88F8] transition-all duration-100"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={213.6}
                        strokeDashoffset={213.6 - (213.6 * downloadProgress) / 100}
                      />
                    </svg>
                    <span className="text-xs font-bold text-[#111111]">{downloadProgress}%</span>
                  </div>
                  <p className="text-gray-400">RETRIEVING FILES...</p>
                </div>
              )}

              {downloadState === "complete" && (
                <div className="py-6 space-y-6">
                  <div className="h-12 w-12 bg-green-50 border border-green-200 text-green-700 rounded-full flex items-center justify-center mx-auto">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <div>
                    <p className="font-bold text-[#111111] uppercase truncate mb-1">
                      {downloadingResource.title}
                    </p>
                    <p className="text-[#89F336] font-bold">TRANSMISSION COMPLETION STATUS &middot; OK</p>
                  </div>

                  <button
                    onClick={() => setDownloadingResource(null)}
                    className="px-6 py-2.5 rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-white text-xs font-bold uppercase tracking-wider w-full cursor-pointer transition-colors"
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
