"use client";

import { useState, useEffect } from "react";

export default function CinematicLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Only run loader on initial load per tab session
    const hasLoaded = sessionStorage.getItem("layerz_loaded");
    if (hasLoaded === "true") {
      setVisible(false);
      return;
    }

    const duration = 2000; // 2 seconds loader
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      const currentProgress = Math.min(Math.round((stepCount / steps) * 100), 100);
      setProgress(currentProgress);

      if (stepCount >= steps) {
        clearInterval(timer);
        setFade(true);
        sessionStorage.setItem("layerz_loaded", "true");
        setTimeout(() => {
          setVisible(false);
        }, 500); // Wait for transition fade
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#111111] flex flex-col items-center justify-center font-mono select-none transition-all duration-700 ease-in-out ${
        fade ? "opacity-0 scale-95 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="max-w-xs w-full flex flex-col items-center text-center space-y-12">
        {/* Cinematic Logo Construction Outline */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="none">
            {/* Background structure guidelines */}
            <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

            {/* Isometric Cubes Drawn Step-by-Step */}
            {/* Top Cube Core */}
            <polygon 
              points="50,20 75,32.5 50,45 25,32.5" 
              stroke="#89F336" 
              strokeWidth="2.5" 
              strokeDasharray="200" 
              strokeDashoffset={200 - (progress * 2)} 
              className="transition-all duration-300"
            />
            {/* Bottom Left Cube Core */}
            <polygon 
              points="25,52.5 50,65 25,77.5 0,65" 
              stroke="#8B88F8" 
              strokeWidth="2.5" 
              strokeDasharray="200" 
              strokeDashoffset={progress > 30 ? 200 - ((progress - 30) * 2.8) : 200}
              className="transition-all duration-300"
            />
            {/* Bottom Right Cube Core */}
            <polygon 
              points="75,52.5 100,65 75,77.5 50,65" 
              stroke="#FFFFFF" 
              strokeWidth="2.5" 
              strokeDasharray="200" 
              strokeDashoffset={progress > 60 ? 200 - ((progress - 60) * 5) : 200}
              className="transition-all duration-300"
            />
          </svg>
          {/* Subtle central glow */}
          <div className="absolute inset-0 bg-[#89F336]/10 rounded-full blur-xl animate-pulse"></div>
        </div>

        {/* Loading Terminal logs */}
        <div className="w-full space-y-4">
          <div className="text-[10px] text-gray-500 tracking-widest uppercase">
            {progress < 30 && "INITIALIZING SYSTEM SCHEMAS..."}
            {progress >= 30 && progress < 70 && "COMPILING PROCEDURAL ENVIRONMENTS..."}
            {progress >= 70 && progress < 100 && "SYNCHRONIZING SECURE REPOSITORIES..."}
            {progress === 100 && "SYSTEM SECURED. REDIRECTING..."}
          </div>
          
          {/* Custom minimal visual bar */}
          <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-[#8B88F8] to-[#89F336] transition-all duration-100" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[9px] text-gray-400">
            <span>NODE_LOAD: OK</span>
            <span className="font-black text-white tabular-nums">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
