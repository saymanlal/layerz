"use client";

import React, { useEffect, useRef } from "react";

interface ThreeDBlockBgProps {
  colorType?: "default" | "lavender" | "green";
  opacity?: number;
  mode?: "blocks" | "particles" | "grid";
}

export default function ThreeDBlockBg({ 
  colorType = "default", 
  opacity = 0.85, 
  mode = "blocks" 
}: ThreeDBlockBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Color definitions
    let baseRGB = { r: 235, g: 235, b: 250 };
    if (colorType === "lavender") {
      baseRGB = { r: 139, g: 136, b: 248 }; // #8B88F8
    } else if (colorType === "green") {
      baseRGB = { r: 137, g: 243, b: 54 }; // #89F336
    }

    let time = 0;

    // --- MODE 1: ISOMETRIC BLOCKS ---
    const size = 35;
    const hSpacing = size * 2;
    const vSpacing = size * 1.15;

    const drawIsoBlock = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      w: number,
      h: number,
      color: { r: number; g: number; b: number }
    ) => {
      const scale = 0.5;
      const topRhombusY = cy - h;

      // Top Face
      ctx.fillStyle = `rgba(${color.r + 15}, ${color.g + 15}, ${color.b + 15}, 0.85)`;
      ctx.beginPath();
      ctx.moveTo(cx, topRhombusY);
      ctx.lineTo(cx + w, topRhombusY - w * scale);
      ctx.lineTo(cx, topRhombusY - w);
      ctx.lineTo(cx - w, topRhombusY - w * scale);
      ctx.closePath();
      ctx.fill();

      // Left Face
      ctx.fillStyle = `rgba(${color.r - 20}, ${color.g - 20}, ${color.b - 20}, 0.9)`;
      ctx.beginPath();
      ctx.moveTo(cx - w, topRhombusY - w * scale);
      ctx.lineTo(cx, topRhombusY);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx - w, cy - w * scale);
      ctx.closePath();
      ctx.fill();

      // Right Face
      ctx.fillStyle = `rgba(${color.r - 5}, ${color.g - 5}, ${color.b - 5}, 0.9)`;
      ctx.beginPath();
      ctx.moveTo(cx, topRhombusY);
      ctx.lineTo(cx + w, topRhombusY - w * scale);
      ctx.lineTo(cx + w, cy - w * scale);
      ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fill();

      // Outlines
      ctx.strokeStyle = `rgba(${color.r + 40}, ${color.g + 40}, ${color.b + 40}, 0.25)`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(cx, topRhombusY);
      ctx.lineTo(cx + w, topRhombusY - w * scale);
      ctx.lineTo(cx, topRhombusY - w);
      ctx.lineTo(cx - w, topRhombusY - w * scale);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - w, topRhombusY - w * scale);
      ctx.lineTo(cx, topRhombusY);
      ctx.lineTo(cx, cy);
      ctx.stroke();
    };

    // --- MODE 2: NEURAL CONNECTIONS PARTICLES ---
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }
    const particleCount = 45;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2.5 + 1
      });
    }

    // --- MODE 3: PERSPECTIVE CYBER GRID ---
    let gridOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.012;

      if (mode === "blocks") {
        const cols = Math.ceil(width / hSpacing) + 2;
        const rows = Math.ceil(height / vSpacing) + 4;

        for (let r = -2; r < rows; r++) {
          for (let c = -2; c < cols; c++) {
            let cx = c * hSpacing;
            if (r % 2 === 1) cx += size;
            const cy = r * vSpacing;

            const dx = cx - mouseRef.current.x;
            const dy = (cy - size * 0.5) - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const wave = Math.sin(c * 0.2 + r * 0.15 + time) * 10 + Math.cos(c * 0.1 - r * 0.2 + time * 0.7) * 7;
            
            let hoverInfluence = 0;
            if (mouseRef.current.active && dist < 220) {
              hoverInfluence = (1 - dist / 220) * 32;
            }

            const blockHeight = 12 + Math.max(-5, wave + hoverInfluence);
            const heightShiftRGB = {
              r: Math.max(20, Math.min(255, baseRGB.r - (blockHeight * 0.4))),
              g: Math.max(20, Math.min(255, baseRGB.g - (blockHeight * 0.15))),
              b: Math.max(20, Math.min(255, baseRGB.b + (blockHeight * 0.6)))
            };

            drawIsoBlock(ctx, cx, cy, size - 2, blockHeight, heightShiftRGB);
          }
        }
      } 
      
      else if (mode === "particles") {
        // Draw connecting lines and update coordinates
        ctx.strokeStyle = `rgba(${baseRGB.r}, ${baseRGB.g}, ${baseRGB.b}, 0.08)`;
        ctx.lineWidth = 1.0;

        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          p1.x += p1.vx;
          p1.y += p1.vy;

          if (p1.x < 0 || p1.x > width) p1.vx *= -1;
          if (p1.y < 0 || p1.y > height) p1.vy *= -1;

          // Draw node dot
          ctx.fillStyle = `rgba(${baseRGB.r}, ${baseRGB.g}, ${baseRGB.b}, 0.45)`;
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
          ctx.fill();

          // Mouse attraction
          if (mouseRef.current.active) {
            const dx = mouseRef.current.x - p1.x;
            const dy = mouseRef.current.y - p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              ctx.strokeStyle = `rgba(${baseRGB.r}, ${baseRGB.g}, ${baseRGB.b}, ${(1 - dist / 150) * 0.25})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
              ctx.stroke();
            }
          }

          // Inter-node connections
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
              ctx.strokeStyle = `rgba(${baseRGB.r}, ${baseRGB.g}, ${baseRGB.b}, ${(1 - dist / 120) * 0.12})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      } 
      
      else if (mode === "grid") {
        // Draw 3D scrolling perspective cyber grid
        gridOffset += 0.8;
        if (gridOffset >= 60) gridOffset = 0;

        ctx.strokeStyle = `rgba(${baseRGB.r}, ${baseRGB.g}, ${baseRGB.b}, 0.08)`;
        ctx.lineWidth = 1.2;

        const horizon = height * 0.1; // perspective vanishing line
        const gridCount = 26;

        // Draw perspective lines meeting at vanishing point
        for (let i = -10; i <= gridCount + 10; i++) {
          const xStart = (i / gridCount) * width;
          ctx.beginPath();
          ctx.moveTo(width / 2, horizon);
          ctx.lineTo(xStart, height);
          ctx.stroke();
        }

        // Draw horizontal lines scrolling forward
        for (let y = gridOffset; y < height; y += 60) {
          const ratio = (y / height);
          const drawY = horizon + ratio * (height - horizon);
          
          ctx.strokeStyle = `rgba(${baseRGB.r}, ${baseRGB.g}, ${baseRGB.b}, ${ratio * 0.15})`;
          ctx.beginPath();
          ctx.moveTo(0, drawY);
          ctx.lineTo(width, drawY);
          ctx.stroke();
        }

        // Mouse hover ripple
        if (mouseRef.current.active) {
          ctx.strokeStyle = `rgba(${baseRGB.r}, ${baseRGB.g}, ${baseRGB.b}, 0.05)`;
          ctx.beginPath();
          ctx.arc(mouseRef.current.x, mouseRef.current.y, 80, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [colorType, mode]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000"
      style={{ opacity, mixBlendMode: "multiply" }}
    />
  );
}
