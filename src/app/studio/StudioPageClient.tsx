"use client";

import { useState } from "react";
import Link from "next/link";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";

interface Project {
  id: string;
  title: string;
  category: string;
  client: string;
  description: string;
  challenge: string;
  solution: string;
  outcome: string;
  technologies: string[];
}

interface StudioPageClientProps {
  initialProjects: Project[];
}

export default function StudioPageClient({ initialProjects }: StudioPageClientProps) {
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState({
    category: "",
    bottleneck: "",
    timeline: "",
  });
  const [proposal, setProposal] = useState<string | null>(null);

  const startQuiz = () => {
    setQuizStep(1);
    setProposal(null);
    setAnswers({ category: "", bottleneck: "", timeline: "" });
  };

  const handleSelect = (field: string, value: string) => {
    setAnswers({ ...answers, [field]: value });
    if (quizStep < 3) {
      setQuizStep(quizStep + 1);
    } else {
      generateProposal(value);
    }
  };

  const generateProposal = (lastVal: string) => {
    const finalAnswers = { ...answers, timeline: lastVal };
    let recommendation = "";
    
    if (finalAnswers.category === "AI Solutions") {
      recommendation = `A Next.js frontend integrated with an automated LangChain/Python WebSocket streaming server. We recommend utilizing Pinecone for vector indexing and local agent workflows for low-latency context retrieval.`;
    } else if (finalAnswers.category === "Blockchain Development") {
      recommendation = `A decentralized application built on Next.js, incorporating wagmi/viem for web3 connections, and an ERC-4337 Smart Account structure to enable social login recovery and gasless user onboarding.`;
    } else {
      recommendation = `A high-performance modern web framework with smooth canvas interactive modules, styled with fluid CSS animations and structured design tokens to create a memorable, premium brand presence.`;
    }

    setProposal(recommendation);
    setQuizStep(4);
  };

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 h-[450px] w-full border-b border-[#eaeaea] bg-gradient-to-b from-white to-[#f5f5ff] overflow-hidden">
        <ThreeDBlockBg colorType="lavender" opacity={0.4} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
        {/* Header Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B88F8] bg-[#f0f0ff] border border-[#dad9fc] px-4 py-1.5 rounded-full inline-block">
            Layerz Studio
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#111111] mt-6 mb-4">
            Designing Products. Building Experiences.
          </h1>
          <p className="text-lg text-[#5C5C5C] leading-relaxed">
            Layerz Studio is the product design and technology arm of Layerz, helping startups and organizations build products using modern design standards and emerging technology.
          </p>
        </div>

        {/* Case Studies - Deep Contrast Dark Panels as specified: "Studio Section: #111111" */}
        <div className="space-y-16 mb-24 max-w-5xl mx-auto">
          {initialProjects.map((project, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                id={project.id}
                key={project.id}
                className="bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 text-white shadow-xl dark-theme"
              >
                {/* Text Content */}
                <div className={`p-8 md:p-12 lg:col-span-7 flex flex-col justify-between ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#8B88F8]/10 border border-[#8B88F8]/20 text-[#8B88F8]">
                        {project.category}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">Client: {project.client}</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-6">
                      {project.title}
                    </h3>

                    <div className="space-y-6 text-sm text-gray-300">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                          The Challenge
                        </span>
                        <p className="leading-relaxed">{project.challenge}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                          Our Solution
                        </span>
                        <p className="leading-relaxed">{project.solution}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#222222] flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-[#222222] border border-[#333333] text-[9px] font-mono text-gray-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Outcome Panel */}
                <div
                  className={`lg:col-span-5 flex flex-col justify-center items-center bg-[#222222]/50 border-t lg:border-t-0 border-[#222222] p-8 text-center relative overflow-hidden ${
                    isEven ? "lg:order-2 lg:border-l" : "lg:order-1 lg:border-r"
                  }`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#89F336]/5 rounded-full blur-[40px] pointer-events-none"></div>
                  
                  {/* SVG Isometric Cube Graphics */}
                  <svg width="48" height="48" viewBox="0 0 34 34" fill="none" className="mb-6">
                    <path d="M17 26.5L6 21L17 15.5L28 21L17 26.5Z" fill="#89F336" opacity="0.8" />
                    <path d="M6 21V23L17 28.5V26.5L6 21Z" fill="#73D41E" />
                    <path d="M28 21V23L17 28.5V26.5L28 21Z" fill="#5CB015" />
                    <path d="M17 17.5L6 12L17 6.5L28 12L17 17.5Z" fill="#8B88F8" opacity="0.8" />
                    <path d="M6 12V14L17 19.5V17.5L6 12Z" fill="#726FE5" />
                    <path d="M28 12V14L17 19.5V17.5L28 12Z" fill="#5956C8" />
                  </svg>

                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Impact & Outcome
                  </span>
                  <p className="text-xl md:text-2xl font-black text-[#89F336] max-w-sm mb-4 leading-none tracking-tight">
                    {project.outcome}
                  </p>
                  <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                    Successfully integrated into client workloads. benchmark verification targets achieved.
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Studio Consultation Intake Section */}
        <section className="max-w-4xl mx-auto rounded-2xl border border-[#222222] bg-[#111111] p-8 md:p-12 relative overflow-hidden text-white shadow-xl dark-theme">
          <div className="absolute left-0 bottom-0 w-64 h-64 bg-[#8B88F8]/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10 text-center">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
              Need Product Design or Technology Scopes?
            </h3>
            <p className="text-sm text-gray-400 max-w-lg mx-auto mb-8">
              Take our 3-step intake planner to calculate an initial recommended architecture proposal instantly.
            </p>

            {quizStep === 0 && (
              <button
                onClick={startQuiz}
                className="px-6 py-3 bg-[#89F336] hover:bg-[#73D41E] text-[#111111] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Start Intake Planner
              </button>
            )}

            {/* Quiz Step 1: Category */}
            {quizStep === 1 && (
              <div className="space-y-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8B88F8]">
                  Step 1: What type of project are you building?
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                  {["AI Solutions", "Blockchain Development", "UI/UX & Branding"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleSelect("category", cat)}
                      className="px-6 py-4 rounded-xl border border-[#222222] bg-[#222222] hover:border-[#8B88F8] text-xs font-bold text-white transition-all cursor-pointer"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz Step 2: Bottleneck */}
            {quizStep === 2 && (
              <div className="space-y-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8B88F8]">
                  Step 2: What is your primary engineering bottleneck?
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                  {["High Latency", "Web3 User Onboarding", "Complex Visual Design"].map((bot) => (
                    <button
                      key={bot}
                      onClick={() => handleSelect("bottleneck", bot)}
                      className="px-6 py-4 rounded-xl border border-[#222222] bg-[#222222] hover:border-[#8B88F8] text-xs font-bold text-white transition-all cursor-pointer"
                    >
                      {bot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz Step 3: Timeline */}
            {quizStep === 3 && (
              <div className="space-y-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8B88F8]">
                  Step 3: What is your timeline for prototype launch?
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                  {["Under 1 Month", "1 - 3 Months", "Flexible"].map((time) => (
                    <button
                      key={time}
                      onClick={() => handleSelect("timeline", time)}
                      className="px-6 py-4 rounded-xl border border-[#222222] bg-[#222222] hover:border-[#8B88F8] text-xs font-bold text-white transition-all cursor-pointer"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Proposal Result */}
            {quizStep === 4 && proposal && (
              <div className="space-y-6 max-w-xl mx-auto animate-scale-up">
                <div className="p-6 bg-[#222222]/80 rounded-xl border border-[#333333] text-left relative overflow-hidden font-mono text-xs">
                  <span className="absolute right-0 top-0 text-[9px] font-mono bg-[#8B88F8]/20 text-[#8B88F8] px-3 py-1 rounded-bl-lg uppercase">
                    Architecture Proposal
                  </span>
                  
                  <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-[#89F336]">
                    Technical Strategy Recommendation
                  </h4>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {proposal}
                  </p>
                  
                  <div className="p-3 bg-[#111111] rounded-lg text-gray-500 space-y-1">
                    <p>🎯 Category: {answers.category}</p>
                    <p>⚡ Focus Bottleneck: {answers.bottleneck}</p>
                    <p>⏳ Timeline: {answers.timeline}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href={`/contact?role=Project%20Scoping%20(${encodeURIComponent(answers.category)})`}
                    className="px-6 py-3 rounded-lg bg-[#89F336] hover:bg-[#73D41E] text-xs font-bold uppercase tracking-wider text-[#111111] transition-colors cursor-pointer text-center"
                  >
                    Confirm Scope Scrutiny Call
                  </Link>
                  <button
                    onClick={startQuiz}
                    className="px-6 py-3 rounded-lg border border-[#222222] bg-[#222222] text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    Restart Planner
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
