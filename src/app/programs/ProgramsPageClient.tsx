"use client";

import { useState } from "react";
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
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    github: "",
    interest: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      {/* Background decoration */}
      <div className="absolute inset-0 h-[450px] w-full border-b border-[#eaeaea] bg-gradient-to-b from-white to-[#f5f5ff] overflow-hidden">
        <ThreeDBlockBg colorType="lavender" opacity={0.5} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
        {/* Header Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B88F8] bg-[#f0f0ff] border border-[#dad9fc] px-4 py-1.5 rounded-full inline-block">
            Ecosystem Programs
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#111111] mt-6 mb-4">
            Programs That Turn Potential Into Progress.
          </h1>
          <p className="text-lg text-[#5C5C5C] leading-relaxed">
            Layerz creates practical, community-driven cohorts that help developers, designers, and startup teams build products and launch solutions.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {initialPrograms.map((prog) => {
            const isOpen = prog.status.includes("Open") || prog.status.includes("Applications");
            return (
              <div
                key={prog.id}
                className="premium-card p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                      Duration: {prog.duration}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isOpen
                          ? "bg-[#e8fcd7] border border-[#d2f9af] text-[#2d5a08]"
                          : "bg-gray-100 border border-[#eaeaea] text-gray-500"
                      }`}
                    >
                      {prog.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-[#111111]">
                    {prog.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#8B88F8] mt-1 mb-4 uppercase tracking-wider">
                    {prog.tagline}
                  </p>
                  <p className="text-sm text-[#5C5C5C] leading-relaxed mb-6">
                    {prog.description}
                  </p>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-3">
                    Program Includes:
                  </h4>
                  <ul className="space-y-2 mb-8">
                    {prog.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#5C5C5C]">
                        <span className="text-[#89F336] mt-1 text-[16px] leading-none">&bull;</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleApplyClick(prog)}
                  className={`w-full text-center py-3.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    isOpen
                      ? "bg-[#111111] text-white hover:bg-[#89F336] hover:text-[#111111]"
                      : "bg-[#f5f5f5] text-gray-400 cursor-not-allowed border border-[#eaeaea]"
                  }`}
                  disabled={!isOpen}
                >
                  {isOpen ? "Submit Application" : "Applications Closed"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Builder Journey Visual */}
        <div className="max-w-5xl mx-auto mt-24 p-8 bg-[#fafafa] border border-[#eaeaea] rounded-2xl">
          <h3 className="text-xl font-bold text-[#111111] text-center mb-8">A Simple Builder Journey</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
            <div>
              <span className="text-xs font-mono font-bold text-gray-300 block mb-2">STEP 1</span>
              <p className="text-xs font-bold text-[#111111] mb-1">Discover & Learn</p>
              <p className="text-[11px] text-[#5C5C5C] leading-tight">Attend university chapters, audits, and emerging workshops.</p>
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-gray-300 block mb-2">STEP 2</span>
              <p className="text-xs font-bold text-[#111111] mb-1">Collaborate & Build</p>
              <p className="text-[11px] text-[#5C5C5C] leading-tight">Write smart contracts, design components, and build MVPs.</p>
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-gray-300 block mb-2">STEP 3</span>
              <p className="text-xs font-bold text-[#111111] mb-1">Showcase & Pitch</p>
              <p className="text-[11px] text-[#5C5C5C] leading-tight">Demonstrate working software at Hackathons and Demo Days.</p>
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-gray-300 block mb-2">STEP 4</span>
              <p className="text-xs font-bold text-[#111111] mb-1">Launch & Scale</p>
              <p className="text-[11px] text-[#5C5C5C] leading-tight">Acquire pre-seed grants, Studio scopes, and incubator entries.</p>
            </div>
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
