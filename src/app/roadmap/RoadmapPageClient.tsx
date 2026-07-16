"use client";

import { useState, useEffect, useRef } from "react";
import ProceduralBg from "@/components/ProceduralBg";

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
  const [roadmap, setRoadmap] = useState<Quarter[]>(initialRoadmap);
  const [selectedQuarterId, setSelectedQuarterId] = useState<string>("rm-2");
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});
  const [zoomLevel, setZoomLevel] = useState<"quarter" | "month">("month");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const timelineRef = useRef<HTMLDivElement>(null);

  // Sync real-time roadmap content from admin endpoints
  useEffect(() => {
    async function syncRoadmap() {
      try {
        const res = await fetch("/api/admin/data?file=roadmap.json");
        if (res.ok) {
          setRoadmap(await res.json());
        }
      } catch (err) {
        console.error("Roadmap sync failed:", err);
      }
    }
    syncRoadmap();
    const interval = setInterval(syncRoadmap, 6000);
    return () => clearInterval(interval);
  }, []);

  // Pre-load completed milestones based on status
  useEffect(() => {
    const initialCompleted: Record<string, boolean> = {};
    roadmap.forEach((q) => {
      if (q.status === "completed") {
        q.milestones.forEach((m) => {
          initialCompleted[`${q.id}-${m}`] = true;
        });
      }
    });
    setCompletedMilestones(initialCompleted);
  }, [roadmap]);

  const toggleMilestone = (quarterId: string, milestone: string) => {
    const key = `${quarterId}-${milestone}`;
    setCompletedMilestones((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getQuarterCompletion = (q: Quarter) => {
    const total = q.milestones.length;
    const completed = q.milestones.filter(m => completedMilestones[`${q.id}-${m}`]).length;
    return total > 0 ? (completed / total) : 0;
  };

  const getMonthsForQuarter = (qStr: string) => {
    if (qStr.includes("Q1")) return ["January", "February", "March"];
    if (qStr.includes("Q2")) return ["April", "May", "June"];
    if (qStr.includes("Q3")) return ["July", "August", "September"];
    return ["October", "November", "December"];
  };

  const getGridSpan = (qStr: string) => {
    if (qStr.includes("Q1")) return "col-span-3 col-start-1";
    if (qStr.includes("Q2")) return "col-span-3 col-start-4";
    if (qStr.includes("Q3")) return "col-span-3 col-start-7";
    return "col-span-3 col-start-10";
  };

  const selectedQuarter = roadmap.find((q) => q.id === selectedQuarterId);

  const filteredRoadmap = roadmap.filter((q) => {
    if (activeFilter === "all") return true;
    return q.status === activeFilter;
  });

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 h-[480px] w-full border-b border-gray-100 bg-gradient-to-b from-white to-[#fcfcff] overflow-hidden">
        <ProceduralBg mode="minimal" colorType="lavender" opacity={0.35} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
        
        {/* Header Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-[10px] font-mono font-bold text-[#8B88F8] bg-[#f0f0ff] border border-[#dad9fc] px-4 py-1.5 rounded-full inline-block">
            ROADMAP SYSTEM
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#111111] mt-6 mb-4">
            Development Timeline
          </h1>
          <p className="text-sm md:text-base text-[#5C5C5C] leading-relaxed">
            Verify milestone completions. Interact with our Gantt-style planning board to trace dependencies and project releases.
          </p>
        </div>

        {/* CONTROLS BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-[#fafafa] border border-gray-100 rounded-xl max-w-6xl mx-auto font-mono text-[10px]">
          {/* Filters */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">FILTER:</span>
            {["all", "completed", "current", "upcoming"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded border uppercase font-bold cursor-pointer transition-all ${
                  activeFilter === f
                    ? "bg-[#111111] border-black text-white"
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">VIEW_SCALE:</span>
            {(["month", "quarter"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setZoomLevel(level)}
                className={`px-3 py-1 rounded border uppercase font-bold cursor-pointer transition-all ${
                  zoomLevel === level
                    ? "bg-[#8B88F8] border-[#8B88F8] text-white"
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* GANTT-STYLE PLANNING BOARD */}
        <div className="max-w-6xl mx-auto border border-gray-100 bg-white rounded-2xl overflow-hidden shadow-md mb-12">
          {/* Gantt Header Columns */}
          <div className="bg-gray-50 border-b border-gray-100 p-4 font-mono text-[9px] text-gray-400">
            {zoomLevel === "month" ? (
              <div className="grid grid-cols-12 text-center select-none">
                {["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"].map((m) => (
                  <span key={m} className="border-r border-gray-100 last:border-0">{m}</span>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 text-center select-none">
                {["Q1_CHAPTER", "Q2_CHAPTER", "Q3_CHAPTER", "Q4_CHAPTER"].map((q) => (
                  <span key={q} className="border-r border-gray-100 last:border-0">{q}</span>
                ))}
              </div>
            )}
          </div>

          {/* Gantt Row Tracks */}
          <div ref={timelineRef} className="p-6 min-h-[300px] relative space-y-6">
            <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-full border-r border-dashed border-gray-100/60 last:border-0"></div>
              ))}
            </div>

            {/* Render Quarter Blocks mapped dynamically onto the monthly columns */}
            {filteredRoadmap.map((item) => {
              const isActive = selectedQuarterId === item.id;
              const isCompleted = item.status === "completed";
              const isCurrent = item.status === "current";
              const completion = getQuarterCompletion(item);

              let blockBg = "bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-500";
              if (isActive) blockBg = "bg-[#f5f5ff] border-[#8B88F8] text-[#8B88F8] shadow-sm";
              else if (isCompleted) blockBg = "bg-green-50/50 border-green-200 text-green-700";
              else if (isCurrent) blockBg = "bg-blue-50/50 border-blue-200 text-blue-700";

              return (
                <div key={item.id} className="grid grid-cols-12 items-center relative z-10">
                  {/* Epic block spanning its corresponding months */}
                  <div
                    onClick={() => setSelectedQuarterId(item.id)}
                    className={`py-3.5 px-5 rounded-xl border cursor-pointer transition-all duration-300 ${getGridSpan(item.quarter)} ${blockBg}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-[9px] font-bold">{item.quarter}</span>
                      <span className="font-mono text-[8px] font-bold">
                        {Math.round(completion * 100)}%
                      </span>
                    </div>

                    <h4 className="font-black text-xs text-[#111111] line-clamp-1">{item.title}</h4>
                    
                    {/* Micro loading progress bar indicator */}
                    <div className="w-full bg-gray-200/50 rounded-full h-1 overflow-hidden mt-3">
                      <div 
                        className={`h-full transition-all duration-500 ${isCompleted ? 'bg-[#89F336]' : 'bg-[#8B88F8]'}`}
                        style={{ width: `${completion * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHECKLIST & DETAILS FOR SELECTED QUARTER */}
        {selectedQuarter ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch animate-scale-up">
            
            {/* Epic description info */}
            <div className="lg:col-span-5 p-8 bg-[#fafafa] border border-gray-100 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-6">
                  <span className="font-mono text-[9px] font-bold text-[#8B88F8] uppercase tracking-wider">
                    LAYER_SPECIFICATION: {selectedQuarter.quarter}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${
                    selectedQuarter.status === "completed"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-blue-50 border-blue-200 text-blue-700"
                  }`}>
                    {selectedQuarter.status}
                  </span>
                </div>

                <h3 className="text-3xl font-black text-[#111111] leading-none mb-4">{selectedQuarter.title}</h3>
                <p className="text-xs text-[#5C5C5C] leading-relaxed mb-6">{selectedQuarter.description}</p>
              </div>

              <div className="p-4 bg-white border border-gray-100 rounded-xl font-mono text-[9px] text-gray-400 space-y-2">
                <span className="block border-b border-gray-100 pb-1 text-[#111111] font-bold">TIMELINES & TARGETS:</span>
                <div className="space-y-1">
                  {getMonthsForQuarter(selectedQuarter.quarter).map((m) => (
                    <div key={m} className="flex justify-between">
                      <span>{m.toUpperCase()}</span>
                      <span className="text-[#89F336]">PROJ_ACTIVE</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Checklists and milestone checks */}
            <div className="lg:col-span-7 p-8 bg-white border border-gray-100 rounded-2xl shadow-lg flex flex-col justify-between">
              <div>
                <span className="font-mono text-[9px] font-bold text-gray-400 block mb-6 uppercase">
                  MILESTONES CHECKLIST VERIFICATION
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedQuarter.milestones.map((milestone) => {
                    const isDone = completedMilestones[`${selectedQuarter.id}-${milestone}`];
                    return (
                      <div
                        key={milestone}
                        onClick={() => toggleMilestone(selectedQuarter.id, milestone)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 bg-[#fafafa] hover:border-gray-300 ${
                          isDone 
                            ? "border-green-200 text-green-700 bg-green-50/20" 
                            : "border-gray-100 text-gray-500 hover:bg-white"
                        }`}
                      >
                        <span className="text-xs font-semibold leading-snug">{milestone}</span>
                        <div className={`h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                          isDone ? "bg-[#89F336] border-[#89F336] text-[#111111]" : "border-gray-300 bg-white"
                        }`}>
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

              <div className="pt-6 border-t border-gray-50 text-[9px] text-gray-400 font-mono flex justify-between mt-8">
                <span>DEPENDENCY: OK</span>
                <span>COMPILED: {Math.round(getQuarterCompletion(selectedQuarter) * 100)}% SUCCESS</span>
              </div>
            </div>

          </div>
        ) : (
          <div className="max-w-6xl mx-auto py-12 text-center border border-dashed border-gray-200 bg-gray-50 rounded-2xl text-xs text-gray-400 font-mono">
            Select a timeline row block above to inspect milestones.
          </div>
        )}

      </div>
    </div>
  );
}
