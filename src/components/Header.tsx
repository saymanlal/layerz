"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface Quarter {
  id: string;
  quarter: string;
  title: string;
  description: string;
  status: string;
  milestones: string[];
}

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const [roadmapData, setRoadmapData] = useState<Quarter[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: "Our Story", href: "/about" },
    { name: "Ecosystem", href: "/ecosystem" },
    { name: "Programs", href: "/programs" },
    { name: "Studio", href: "/studio" },
    { name: "Resources", href: "/resources" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  // Fetch roadmap milestones for the navigation calendar dropdown
  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const res = await fetch("/api/admin/data?file=roadmap.json");
        if (res.status === 200) {
          const json = await res.json();
          setRoadmapData(json);
        }
      } catch (err) {
        console.error("Failed to load header roadmap:", err);
      }
    }
    fetchRoadmap();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRoadmapOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#eaeaea] bg-white/95 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Organization Logo Image */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-3">
              <img
                src="/logo-org.jpg"
                alt="Layerz Logo"
                className="h-10 w-10 rounded-lg object-contain bg-white border border-[#eaeaea] transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-xl font-bold tracking-tight text-[#111111]">
                Layerz<span className="text-[#8B88F8] group-hover:text-[#89F336] transition-colors">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 relative">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? "text-[#111111] bg-[#f5f5ff] border border-[#dad9fc]/50"
                      : "text-[#5c5c5c] hover:text-[#111111] hover:bg-[#fafafa] border border-transparent"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-[#89F336]"></span>
                  )}
                </Link>
              );
            })}

            {/* Interactive Roadmap Calendar Dropdown trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setRoadmapOpen(!roadmapOpen)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer border ${
                  roadmapOpen || pathname === "/roadmap"
                    ? "text-[#111111] bg-[#f5f5ff] border-[#dad9fc]/50"
                    : "text-[#5c5c5c] hover:text-[#111111] hover:bg-[#fafafa] border-transparent"
                }`}
              >
                <span>Roadmap</span>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${roadmapOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Scrollable calendar-style popover */}
              {roadmapOpen && (
                <div className="absolute right-0 mt-3 w-[450px] bg-white border border-[#eaeaea] rounded-xl shadow-2xl p-6 z-50 animate-scale-up">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#eaeaea]">
                    <span className="text-xs font-bold text-[#8B88F8] uppercase tracking-wider font-mono">
                      Upcoming Milestone Calendar
                    </span>
                    <Link
                      href="/roadmap"
                      onClick={() => setRoadmapOpen(false)}
                      className="text-xs font-bold text-[#111111] hover:text-[#89F336] transition-colors"
                    >
                      Open 3D View
                    </Link>
                  </div>

                  {/* Horizontal Scroll Timeline */}
                  <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x scroll-smooth">
                    {roadmapData.length === 0 ? (
                      <div className="text-center py-6 w-full text-xs text-gray-400">
                        Retrieving timeline...
                      </div>
                    ) : (
                      roadmapData.map((item) => (
                        <div
                          key={item.id}
                          className="min-w-[180px] bg-[#fafafa] border border-[#eaeaea] rounded-lg p-4 snap-start flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[9px] font-bold text-gray-400 font-mono">
                                {item.quarter}
                              </span>
                              <span
                                className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                  item.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : item.status === "current"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-[#111111] line-clamp-1">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-[#5c5c5c] mt-1.5 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-[#eaeaea] flex items-center justify-between text-[8px] text-gray-400">
                            <span>{item.milestones?.length || 0} tasks</span>
                            <span className="font-mono">ONLINE</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#eaeaea] text-center">
                    <Link
                      href="/roadmap"
                      onClick={() => setRoadmapOpen(false)}
                      className="w-full inline-block py-2 bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors border border-[#111111]"
                    >
                      View Interactive 3D Timeline
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/join"
              className="px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-white text-xs font-bold tracking-wider transition-all duration-300 transform hover:-translate-y-0.5"
            >
              JOIN ECOSYSTEM
            </Link>
          </div>

          {/* Hamburger button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-[#5c5c5c] hover:bg-[#fafafa] hover:text-[#111111] focus:outline-none cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#eaeaea] bg-white absolute w-full left-0 px-4 py-6 flex flex-col space-y-3 shadow-lg z-50">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                  isActive
                    ? "text-[#111111] bg-[#f5f5ff] border border-[#dad9fc]/50"
                    : "text-[#5c5c5c] hover:text-[#111111] hover:bg-[#fafafa]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            );
          })}
          <Link
            href="/roadmap"
            className={`px-4 py-3 rounded-lg text-base font-semibold transition-all ${
              pathname === "/roadmap"
                ? "text-[#111111] bg-[#f5f5ff] border border-[#dad9fc]/50"
                : "text-[#5c5c5c] hover:text-[#111111] hover:bg-[#fafafa]"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Ecosystem Roadmap
          </Link>
          <div className="pt-4 border-t border-[#eaeaea]">
            <Link
              href="/join"
              className="w-full text-center block px-6 py-3.5 rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-sm font-bold text-white transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              JOIN ECOSYSTEM
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

