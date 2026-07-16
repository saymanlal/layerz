"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#eaeaea] bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Isometric 3D Stacked Layers */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-3">
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                className="transform transition-transform duration-500 group-hover:rotate-12"
              >
                {/* Bottom Layer: Lime Green */}
                <path
                  d="M17 31.5L4 25L17 18.5L30 25L17 31.5Z"
                  fill="#89F336"
                  opacity="0.85"
                />
                <path
                  d="M4 25V28L17 34.5V31.5L4 25Z"
                  fill="#73D41E"
                />
                <path
                  d="M30 25V28L17 34.5V31.5L30 25Z"
                  fill="#5CB015"
                />

                {/* Middle Layer: Lavender Blue */}
                <path
                  d="M17 21.5L4 15L17 8.5L30 15L17 21.5Z"
                  fill="#8B88F8"
                  opacity="0.85"
                />
                <path
                  d="M4 15V18L17 24.5V21.5L4 15Z"
                  fill="#726FE5"
                />
                <path
                  d="M30 15V18L17 24.5V21.5L30 15Z"
                  fill="#5956C8"
                />

                {/* Top Layer: Dark Grey / Black */}
                <path
                  d="M17 11.5L4 5L17 -1.5L30 5L17 11.5Z"
                  fill="#111111"
                />
                <path
                  d="M4 5V8L17 14.5V11.5L4 5Z"
                  fill="#222222"
                />
                <path
                  d="M30 5V8L17 14.5V11.5L30 5Z"
                  fill="#000000"
                />
              </svg>
              <span className="text-xl font-bold tracking-tight text-[#111111]">
                Layerz<span className="text-[#8B88F8] group-hover:text-[#89F336] transition-colors">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-1 lg:space-x-1.5">
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
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#eaeaea] bg-white absolute w-full left-0 px-4 py-6 flex flex-col space-y-3 shadow-lg">
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
