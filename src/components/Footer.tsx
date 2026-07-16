import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#222222] bg-[#111111] py-16 relative overflow-hidden dark-theme">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand block */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="group flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
                <path d="M17 31.5L4 25L17 18.5L30 25L17 31.5Z" fill="#89F336" opacity="0.85" />
                <path d="M4 25V28L17 34.5V31.5L4 25Z" fill="#73D41E" />
                <path d="M30 25V28L17 34.5V31.5L30 25Z" fill="#5CB015" />
                <path d="M17 21.5L4 15L17 8.5L30 15L17 21.5Z" fill="#8B88F8" opacity="0.85" />
                <path d="M4 15V18L17 24.5V21.5L4 15Z" fill="#726FE5" />
                <path d="M30 15V18L17 24.5V21.5L30 15Z" fill="#5956C8" />
                <path d="M17 11.5L4 5L17 -1.5L30 5L17 11.5Z" fill="#FFFFFF" />
                <path d="M4 5V8L17 14.5V11.5L4 5Z" fill="#EAEAEA" />
                <path d="M30 5V8L17 14.5V11.5L30 5Z" fill="#B0B0B0" />
              </svg>
              <span className="text-xl font-bold tracking-tight text-white">
                Layerz<span className="text-[#89F336]">.</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              A global innovation ecosystem connecting education, design, emerging technologies, startups, and community. Building the next generation of solutions layer by layer.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#89F336] transition-colors text-sm">
                X / Twitter
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#8B88F8] transition-colors text-sm">
                GitHub
              </a>
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-sm">
                Discord
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Ecosystem</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-[#89F336] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/ecosystem" className="text-sm text-gray-400 hover:text-[#89F336] transition-colors">
                  Ecosystem Layers
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-sm text-gray-400 hover:text-[#89F336] transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/studio" className="text-sm text-gray-400 hover:text-[#89F336] transition-colors">
                  Studio Work
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Open Source */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/resources" className="text-sm text-gray-400 hover:text-[#8B88F8] transition-colors">
                  Playbooks & Guides
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-400 hover:text-[#8B88F8] transition-colors">
                  Insights Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-400 hover:text-[#8B88F8] transition-colors">
                  Open Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-[#8B88F8] transition-colors">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Layerz Ecosystem. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <span className="text-[10px] text-gray-400 bg-[#222222] px-3 py-1 rounded-full border border-[#333333] tracking-widest font-mono">
              STATUS: ECOSYSTEM ONLINE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
