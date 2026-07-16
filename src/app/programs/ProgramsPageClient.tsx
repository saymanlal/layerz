"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";

interface Program {
  id: string;
  title: string;
  tagline: string;
  description: string;
  status: string;
  duration: string;
  features: string[];
}

interface ProgramsPageClientProps {
  initialPrograms: Program[];
}

export default function ProgramsPageClient({ initialPrograms }: ProgramsPageClientProps) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    github: "",
    interest: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync real-time programs content from admin endpoints
  useEffect(() => {
    async function syncPrograms() {
      try {
        const res = await fetch("/api/admin/data?file=programs.json");
        if (res.ok) {
          setPrograms(await res.json());
        }
      } catch (err) {
        console.error("Programs real-time sync failed:", err);
      }
    }
    syncPrograms();
    const interval = setInterval(syncPrograms, 6000);
    return () => clearInterval(interval);
  }, []);

  // Custom Tilt Handler for 3D card movement
  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -10; // Rotate up/down
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 10; // Rotate left/right
    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${ry}deg`);
  };

  const handleTiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  const handleApplyClick = (program: Program) => {
    setSelectedProgram(program);
    setFormSubmitted(false);
    setFormData({ name: "", email: "", github: "", interest: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      
      {/* Background decoration with distinct cyber grid background mode */}
      <div className="absolute inset-0 h-[450px] w-full border-b border-[#eaeaea] bg-gradient-to-b from-white to-[#f5f5ff] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/bg-3d.jpg')] bg-cover bg-center opacity-[0.06] mix-blend-overlay"></div>
        {/* Render distinct grid overlay for programs page */}
        <ThreeDBlockBg colorType="lavender" opacity={0.5} mode="grid" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
        
        {/* Header Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#8B88F8] bg-[#f0f0ff] border border-[#dad9fc] px-4 py-1.5 rounded-full inline-block">
            COHORT BLUEPRINTS
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#111111] mt-6 mb-4">
            Programs That Accelerate Builder Journeys.
          </h1>
          <p className="text-sm md:text-base text-[#5C5C5C] leading-relaxed">
            Layerz coordinates structured chapters to accelerate developer, designer, and founder milestones.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {programs.map((prog) => {
            const isOpen = prog.status.includes("Open") || prog.status.includes("Applications");
            return (
              <div key={prog.id} className="tilt-card-container">
                <div
                  onMouseMove={handleTiltMove}
                  onMouseLeave={handleTiltLeave}
                  className="tilt-card premium-card p-8 flex flex-col justify-between min-h-[460px] cursor-pointer"
                >
                  <div className="tilt-card-inner">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                        Duration: {prog.duration}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          isOpen
                            ? "bg-[#e8fcd7] border border-[#d2f9af] text-[#2d5a08]"
                            : "bg-gray-100 border border-[#eaeaea] text-gray-500"
                        }`}
                      >
                        {prog.status}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-[#111111] leading-none mb-1">
                      {prog.title}
                    </h3>
                    <p className="text-[10px] font-mono font-bold text-[#8B88F8] mb-4 uppercase tracking-wider">
                      {prog.tagline}
                    </p>
                    <p className="text-xs text-[#5C5C5C] leading-relaxed mb-6">
                      {prog.description}
                    </p>

                    <h4 className="text-[10px] font-mono font-black uppercase tracking-wider text-[#111111] mb-3">
                      Program Blueprints:
                    </h4>
                    <ul className="space-y-2 mb-8">
                      {prog.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#5C5C5C]">
                          <span className="text-[#89F336] font-bold">&bull;</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleApplyClick(prog)}
                    className={`tilt-card-inner w-full text-center py-3.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                      isOpen
                        ? "bg-[#111111] text-white hover:bg-[#89F336] hover:text-[#111111]"
                        : "bg-[#f5f5f5] text-gray-400 cursor-not-allowed border border-[#eaeaea]"
                    }`}
                    disabled={!isOpen}
                  >
                    {isOpen ? "Submit Application" : "Applications Closed"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Builder Journey Visual */}
        <div className="max-w-5xl mx-auto mt-24 p-8 bg-[#fafafa] border border-[#eaeaea] rounded-2xl">
          <h3 className="text-xl font-black text-[#111111] text-center mb-8 uppercase font-mono text-xs tracking-wider">
            SYSTEM ACCELERATION Blueprints
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
            {[
              { step: "STEP 01", title: "Discover & Learn", desc: "Attend university chapters, builder workshops, and system lectures." },
              { step: "STEP 02", title: "Collaborate & Prototype", desc: "Write smart contracts, design brand kit interfaces, and code widgets." },
              { step: "STEP 03", title: "Verify & Showcase", desc: "Present verified builds at ecosystem demo cohorts and hackathons." },
              { step: "STEP 04", title: "Launch & Support", desc: "Attain startup pre-seed checks and Layerz Studio code contracts." },
            ].map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-[#eaeaea] bg-white shadow-xs">
                <span className="text-[9px] font-mono font-bold text-[#8B88F8] block mb-2">{step.step}</span>
                <p className="text-xs font-bold text-[#111111] mb-1">{step.title}</p>
                <p className="text-[10px] text-[#5C5C5C] leading-normal">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Apply */}
        {selectedProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white border border-[#eaeaea] rounded-2xl shadow-2xl p-8 animate-scale-up">
              {/* Close */}
              <button
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {!formSubmitted ? (
                <div>
                  <h3 className="text-2xl font-bold text-[#111111] tracking-tight mb-1">Program Application</h3>
                  <p className="text-xs font-semibold text-[#8B88F8] uppercase tracking-wider mb-6">
                    {selectedProgram.title} &bull; {selectedProgram.duration}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#8B88F8] transition-colors"
                        placeholder="Jane Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#8B88F8] transition-colors"
                        placeholder="jane@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        GitHub / Portfolio URL
                      </label>
                      <input
                        type="url"
                        required
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#8B88F8] transition-colors"
                        placeholder="https://github.com/xxxxxx"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Why do you want to join? (Short desc)
                      </label>
                      <textarea
                        required
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full h-24 px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#8B88F8] transition-colors"
                        placeholder="Share your goals and building background..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full text-center py-3.5 rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-xs font-bold text-white uppercase tracking-widest cursor-pointer transition-all duration-300 mt-4 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          TRANSMITTING...
                        </>
                      ) : (
                        "SUBMIT APPLICATION"
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="h-12 w-12 bg-[#e8fcd7] border border-[#d2f9af] text-[#2d5a08] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#111111] mb-2">Application Received</h3>
                  
                  <div className="p-4 bg-[#fafafa] border border-[#eaeaea] rounded-xl text-left font-mono text-[11px] text-gray-500 mb-6 space-y-1">
                    <p><span className="text-gray-400">Name:</span> {formData.name}</p>
                    <p><span className="text-gray-400">Target:</span> {selectedProgram.title}</p>
                    <p><span className="text-gray-400">Status:</span> LOGGED &middot; VERIFYING</p>
                  </div>

                  <button
                    onClick={() => setSelectedProgram(null)}
                    className="px-6 py-2.5 rounded-lg bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#89F336] hover:text-[#111111] transition-all cursor-pointer"
                  >
                    Close
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
