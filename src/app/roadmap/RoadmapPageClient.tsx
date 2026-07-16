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
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});
  const [tilt, setTilt] = useState({ x: 12, y: -15 });

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

  // Track cursor position to tilt the 3D stack dynamically
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xNorm = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const yNorm = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      setTilt({
        x: 15 - yNorm * 10, // Rotate X based on Y mouse pos
        y: -20 + xNorm * 15 // Rotate Y based on X mouse pos
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const selectedQuarter = initialRoadmap.find((q) => q.id === selectedQuarterId);

  // Helper to calculate height of each 3D block
  const getQuarterCompletion = (q: Quarter) => {
    const total = q.milestones.length;
    const completed = q.milestones.filter(m => completedMilestones[`${q.id}-${m}`]).length;
    return total > 0 ? (completed / total) : 0;
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
            Interactive Roadmap
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#111111] mt-6 mb-4">
            Ecosystem Roadmap
          </h1>
          <p className="text-lg text-[#5C5C5C] leading-relaxed">
            Verify milestone completions. Watch the 3D layered stack grow as tasks are completed.
          </p>
        </div>

        {/* 3D Roadmap Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          {/* Interactive 3D Stack (Left/Center Column) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-[#fafafa] border border-[#eaeaea] rounded-2xl min-h-[500px] perspective-wrapper">
            <h3 className="text-xs font-bold text-[#808080] uppercase tracking-wider mb-8 font-mono">
              Hover & Drag cursor to rotate stack
            </h3>

            {/* 3D Stack Container */}
            <div
              className="relative w-[280px] h-[360px] block-3d flex flex-col justify-end items-center"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: "preserve-3d",
                transition: "transform 0.1s ease-out"
              }}
            >
              {initialRoadmap.map((q, idx) => {
                const isActive = q.id === selectedQuarterId;
                const isCompleted = q.status === "completed";
                const isCurrent = q.status === "current";
                const completion = getQuarterCompletion(q);
                
                // Height based on completion (scales from 12px flat to 50px thick)
                const thickness = 15 + completion * 35;
                
                // Color scaling
                let blockColor = "#8B88F8"; // Lavender
                if (isCompleted) blockColor = "#89F336"; // Green
                else if (isCurrent) blockColor = "#8B88F8";
                else blockColor = "#D8D8D8"; // Grey

                // Z-index layout offset
                const zOffset = idx * 60;

                return (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQuarterId(q.id)}
                    className="absolute cursor-pointer transition-all duration-300 ease-out"
                    style={{
                      transform: `translateZ(${zOffset}px) ${isActive ? "translateY(-15px) scale(1.05)" : ""}`,
                      transformStyle: "preserve-3d",
                      width: "180px",
                      height: "120px",
                    }}
                  >
                    {/* 3D Cube faces */}
                    {/* Top Face */}
                    <div
                      className="absolute inset-0 border transition-all duration-300"
                      style={{
                        backgroundColor: blockColor,
                        transform: `translateZ(${thickness}px)`,
                        borderRadius: "10px",
                        boxShadow: isActive ? "0 0 20px rgba(139,136,248,0.4)" : "0 5px 15px rgba(0,0,0,0.05)",
                        borderColor: isActive ? "#FFFFFF" : "transparent"
                      }}
                    >
                      <div className="p-3 text-white h-full flex flex-col justify-between">
                        <span className="text-[9px] font-bold font-mono tracking-widest uppercase">
                          {q.quarter}
                        </span>
                        <div>
                          <h4 className="text-[10px] font-bold line-clamp-1">
                            {q.title}
                          </h4>
                          <span className="text-[8px] opacity-75 font-mono">
                            {Math.round(completion * 100)}% COMPLETE
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Front Face */}
                    <div
                      className="absolute bottom-0 left-0 right-0 origin-bottom transition-all duration-300"
                      style={{
                        backgroundColor: isCompleted ? "#73D41E" : isCurrent ? "#726FE5" : "#B0B0B0",
                        height: `${thickness}px`,
                        transform: "rotateX(-90deg)",
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                        opacity: 0.95
                      }}
                    />

                    {/* Right Face */}
                    <div
                      className="absolute top-0 bottom-0 right-0 origin-right transition-all duration-300"
                      style={{
                        backgroundColor: isCompleted ? "#5CB015" : isCurrent ? "#5956C8" : "#808080",
                        width: `${thickness}px`,
                        transform: "rotateY(90deg)",
                        borderTopRightRadius: "10px",
                        borderBottomRightRadius: "10px",
                        opacity: 0.9
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details & Milestone Checklist (Right Column) */}
          <div className="lg:col-span-7">
            {selectedQuarter ? (
              <div className="p-8 md:p-12 border border-[#eaeaea] bg-white rounded-2xl shadow-lg h-full flex flex-col justify-between animate-scale-up border-l-4" style={{ borderLeftColor: selectedQuarter.status === "completed" ? "#89F336" : "#8B88F8" }}>
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#eaeaea]">
                    <span className="text-xs font-bold text-[#8B88F8] font-mono uppercase tracking-widest">
                      Milestone Tracker &middot; {selectedQuarter.quarter}
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                        selectedQuarter.status === "completed"
                          ? "bg-green-50 border-green-200 text-green-700"
                          : selectedQuarter.status === "current"
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-gray-50 border-gray-200 text-gray-500"
                      }`}
                    >
                      {selectedQuarter.status}
                    </span>
                  </div>

                  <h3 className="text-3xl font-extrabold text-[#111111] tracking-tight">
                    {selectedQuarter.title}
                  </h3>
                  
                  <p className="text-sm text-[#5C5C5C] leading-relaxed">
                    {selectedQuarter.description}
                  </p>

                  <div className="pt-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block mb-4 font-mono">
                      Milestones Checklist:
                    </span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedQuarter.milestones.map((milestone) => {
                        const isDone = completedMilestones[`${selectedQuarter.id}-${milestone}`];
                        return (
                          <div
                            key={milestone}
                            onClick={() => toggleMilestone(selectedQuarter.id, milestone)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 bg-[#fafafa] ${
                              isDone
                                ? "border-[#89F336] text-[#2d5a08] bg-[#f4fdeb]"
                                : "border-[#eaeaea] text-gray-500 hover:border-gray-300"
                            }`}
                          >
                            <span className="text-xs font-semibold leading-snug">{milestone}</span>
                            <div
                              className={`h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                                isDone
                                  ? "bg-[#89F336] border-[#89F336] text-[#111111]"
                                  : "border-gray-300 bg-white"
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
                  <span>SHARDS STATUS: SYNCHRONIZED</span>
                  <span>COMPLETION: {Math.round(getQuarterCompletion(selectedQuarter) * 100)}%</span>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400 border border-[#eaeaea] bg-white rounded-2xl shadow-sm">
                Select a layer from the 3D stack on the left to verify milestones.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

