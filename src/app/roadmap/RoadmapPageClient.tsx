"use client";

import { useState, useEffect } from "react";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";

interface Quarter {
  id: string;
  quarter: string;
  title: string;
  description: string;
  status: string;
  milestones: string[];
}

interface RoadmapPageClientProps {
  initialRoadmap: Quarter[];
}

export default function RoadmapPageClient({ initialRoadmap }: RoadmapPageClientProps) {
  const [selectedQuarterId, setSelectedQuarterId] = useState<string>("rm-2");
  
  // Interactive user-toggled milestones checklist
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialCompleted: Record<string, boolean> = {};
    initialRoadmap.forEach((q) => {
      if (q.status === "completed") {
        q.milestones.forEach((m) => {
          initialCompleted[`${q.id}-${m}`] = true;
        });
      }
    });
    setCompletedMilestones(initialCompleted);
  }, [initialRoadmap]);

  const toggleMilestone = (quarterId: string, milestone: string) => {
    const key = `${quarterId}-${milestone}`;
    setCompletedMilestones((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const selectedQuarter = initialRoadmap.find((q) => q.id === selectedQuarterId);

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
            Ecosystem Timeline
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#111111] mt-6 mb-4">
            Ecosystem Roadmap
          </h1>
          <p className="text-lg text-[#5C5C5C] leading-relaxed">
            A chronological progression detailing our chapters rollout, open-source SDK releases, Smart Contract Audits, and micro-grants funding.
          </p>
        </div>

        {/* Timeline Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {/* Vertical picker (Left Column) */}
          <div className="lg:col-span-1 space-y-4 relative">
            <div className="absolute left-7 top-6 bottom-6 w-0.5 bg-gray-200 pointer-events-none"></div>
            
            {initialRoadmap.map((q) => {
              const isActive = q.id === selectedQuarterId;
              const isCompleted = q.status === "completed";
              const isCurrent = q.status === "current";

              const quarterMilestones = q.milestones;
              const completedCount = quarterMilestones.filter(
                (m) => completedMilestones[`${q.id}-${m}`]
              ).length;
              const completionPercent = Math.round(
                (completedCount / quarterMilestones.length) * 100
              ) || 0;

              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuarterId(q.id)}
                  className={`w-full text-left p-5 rounded-xl border flex items-start gap-4 transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? "border-[#8B88F8] bg-[#f5f5ff] shadow-sm" 
                      : "bg-white border-[#eaeaea] hover:border-gray-300"
                  }`}
                >
                  {/* Circle Indicator */}
                  <span className="relative z-10 flex h-4 w-4 mt-1">
                    {isCurrent && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8B88F8] opacity-75"></span>
                    )}
                    <span
                      className={`relative inline-flex h-4 w-4 rounded-full border ${
                        isCompleted
                          ? "bg-[#89F336] border-[#89F336]"
                          : isCurrent
                          ? "bg-[#8B88F8] border-[#8B88F8]"
                          : "bg-white border-gray-300"
                      }`}
                    ></span>
                  </span>

                  <div className="flex-grow space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-gray-400 font-mono">
                        {q.quarter}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                          isCompleted
                            ? "bg-[#e8fcd7] text-[#2d5a08]"
                            : isCurrent
                            ? "bg-[#f5f5ff] text-[#8B88F8]"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#111111]">
                      {q.title}
                    </h4>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-3">
                      <div
                        className={`h-1.5 rounded-full ${
                          isCompleted ? "bg-[#89F336]" : "bg-[#8B88F8]"
                        }`}
                        style={{ width: `${completionPercent}%` }}
                      ></div>
                    </div>
                    <p className="text-[9px] text-gray-400 mt-1 text-right">
                      {completedCount}/{quarterMilestones.length} checklist ({completionPercent}%)
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details Card (Right Column) */}
          <div className="lg:col-span-2">
            {selectedQuarter ? (
              <div className="p-8 md:p-12 border border-[#eaeaea] bg-[#fafafa] rounded-2xl shadow-sm h-full flex flex-col justify-between animate-scale-up">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#eaeaea]">
                    <span className="text-xs font-bold text-[#8B88F8] font-mono uppercase tracking-widest">
                      Milestone Logs &middot; {selectedQuarter.quarter}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white border border-[#eaeaea] text-gray-500 capitalize">
                      {selectedQuarter.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-[#111111]">
                    {selectedQuarter.title}
                  </h3>
                  
                  <p className="text-sm text-[#5C5C5C] leading-relaxed">
                    {selectedQuarter.description}
                  </p>

                  <div className="pt-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block mb-4">
                      Interactive Milestone Checklist:
                    </span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedQuarter.milestones.map((milestone) => {
                        const isDone = completedMilestones[`${selectedQuarter.id}-${milestone}`];
                        return (
                          <div
                            key={milestone}
                            onClick={() => toggleMilestone(selectedQuarter.id, milestone)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 bg-white ${
                              isDone
                                ? "border-[#89F336] text-[#2d5a08] shadow-xs"
                                : "border-[#eaeaea] text-gray-500 hover:border-gray-300"
                            }`}
                          >
                            <span className="text-xs font-medium">{milestone}</span>
                            <div
                              className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${
                                isDone
                                  ? "bg-[#89F336] border-[#89F336] text-[#111111]"
                                  : "border-gray-200"
                              }`}
                            >
                              {isDone && (
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#eaeaea] text-[10px] text-gray-400 font-mono flex justify-between">
                  <span>SYSTEM: LOGGED</span>
                  <span>INDEXING SHARDS: OK</span>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400 border border-[#eaeaea] bg-[#fafafa] rounded-2xl">
                Please select a Quarter from the left timeline to review milestones.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
