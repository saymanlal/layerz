import { Metadata } from "next";
import Link from "next/link";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Copyright & Legal Terms | Layerz Ecosystem",
  description: "Intellectual property agreements, open source software licensing notices, brand kit usage guidelines, and liability waivers for Layerz.",
  keywords: ["Layerz Copyright", "Open Source Licensing", "Trademark Guidelines", "Solidity Waiver", "Developer Terms of Use"],
};

export default function CopyrightPage() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      id: "ip-protection",
      title: "Intellectual Property Rights",
      content: "All brand marks, style guides, website designs, layouts, graphics, and custom software code hosted on the layerz.xyz domain and associated private networks are copyright-protected intellectual property of the Layerz Ecosystem. Unauthorized replication, redistribution, or derivation of proprietary site structures without explicit written permission from the Layerz Genesis Council is strictly prohibited."
    },
    {
      id: "brandmark-license",
      title: "Brandmark & Logo Guidelines",
      content: "The Layerz brand mark (the 3D isometric building block and the 'Layerz.' wordmark) is a registered trademark. Third-party developers, chapters, and community sponsors are granted a limited, revocable, non-exclusive license to display the brand logo (available at /logo-org.jpg) solely for purposes of referencing partnerships, event collaborations, or chapter sponsorships. Modifying brand mark colors, aspect ratios, or layering hierarchies is prohibited."
    },
    {
      id: "open-source",
      title: "Open Source Software Licensing",
      content: "While the primary user interface and database registries are proprietary, the Layerz Ecosystem is committed to supporting open-source development. Decentralized protocols, developer tooling modules, and SDK packages published under the 'layerz-eco' GitHub organizations are governed by their respective LICENSE files (typically MIT or Apache 2.0 licenses). Any codebase utilizing these packages must retain the corresponding copyright notices."
    },
    {
      id: "liability-disclaimer",
      title: "Engineering Liability Disclaimer",
      content: "Developer frameworks, Solidity smart contracts, AI indexing models, and technical blueprints provided by Layerz are shared on an 'AS IS' basis, without warranty of any kind, express or implied. Under no circumstances shall the Layerz Ecosystem or its contributors be held liable for any data loss, smart contract exploit, liquidity loss, or gas depletion resulting from the application of experimental alpha-release architectures."
    },
    {
      id: "dmca-compliance",
      title: "DMCA Takedown and Copyright Claims",
      content: "If you believe that any material hosted on the Layerz platform or private builder repositories infringes upon your copyright rights, you may submit a formal Digital Millennium Copyright Act (DMCA) notice to our designated agent. All notices must include details of the copyrighted work, description of the infringing URL, and your valid contact details. Submit takedown requests directly to legal@layerz.xyz."
    }
  ];

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      
      {/* Background decoration */}
      <div className="absolute inset-0 h-[400px] w-full border-b border-[#eaeaea] bg-gradient-to-b from-white to-[#f5f5ff] overflow-hidden">
        <ThreeDBlockBg colorType="lavender" opacity={0.4} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-32 relative z-10">
        
        {/* Breadcrumb */}
        <nav className="mb-8 font-mono text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <Link href="/" className="hover:text-[#8B88F8] transition-colors">HOME</Link>
          <span className="mx-2 font-mono">&gt;</span>
          <span className="text-[#111111]">COPYRIGHT & LEGAL</span>
        </nav>

        {/* Title */}
        <div className="border-b border-[#eaeaea] pb-8 mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#111111] mb-4">
            Legal & Copyright Policy
          </h1>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Last Updated: July 16, 2026 | Effective immediately for all network nodes.
          </p>
        </div>

        {/* General Copyright Notice Block */}
        <div className="p-8 rounded-2xl bg-[#fafafa] border border-[#eaeaea] shadow-xs mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#89F336]/10 rounded-full blur-2xl"></div>
          <span className="text-[10px] font-mono font-bold text-[#89F336] uppercase tracking-widest block mb-2">
            REGISTRATION SUMMARY
          </span>
          <h3 className="text-lg font-black text-[#111111] mb-3">
            &copy; {currentYear} Layerz Ecosystem. All Rights Reserved.
          </h3>
          <p className="text-xs text-[#5C5C5C] leading-relaxed">
            All proprietary software code, web architecture designs, style documents, graphical logos, media files, and intellectual content are copyright of the Layerz organization and its engineering contributors. Open source assets are explicitly declared under specific license headers inside their respective directories.
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-12 mb-16">
          {sections.map((sect) => (
            <section key={sect.id} id={sect.id} className="scroll-mt-24">
              <h3 className="text-xl font-black text-[#111111] mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8B88F8]"></span>
                {sect.title}
              </h3>
              <p className="text-xs text-[#5c5c5c] leading-relaxed pl-3.5 border-l border-[#eaeaea]">
                {sect.content}
              </p>
            </section>
          ))}
        </div>

        {/* Contact Block */}
        <div className="p-8 rounded-2xl border border-[#eaeaea] bg-white shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <h4 className="font-bold text-[#111111] text-sm mb-1">Have legal or licensing inquiries?</h4>
            <p className="text-xs text-gray-500">Submit requests for licensing, partnership permissions, or copyright notices.</p>
          </div>
          <a 
            href="mailto:legal@layerz.xyz" 
            className="px-6 py-3 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#8B88F8] transition-colors rounded-lg font-mono text-center shrink-0"
          >
            CONTACT LEGAL AGENT
          </a>
        </div>

      </div>
    </div>
  );
}
