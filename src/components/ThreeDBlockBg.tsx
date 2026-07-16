"use client";

import React, { useEffect, useRef } from "react";

interface ThreeDBlockBgProps {
  colorType?: "default" | "lavender" | "green";
  opacity?: number;
}

export default function ThreeDBlockBg({ colorType = "default", opacity = 0.85 }: ThreeDBlockBgProps) {
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

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Grid configuration
    const size = 35; // Size of isometric half-width
    const hSpacing = size * 2;
    const vSpacing = size * 1.15; // overlap factor for isometric stack

    let time = 0;

    const drawIsoBlock = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      w: number,
      h: number,
      baseColor: { r: number; g: number; b: number }
    ) => {
      const scale = 0.5; // height offset factor
      const topRhombusY = cy - h;

      // Colors based on faces for 3D depth shading
      // Top face (Brightest)
      ctx.fillStyle = `rgba(${baseColor.r + 15}, ${baseColor.g + 15}, ${baseColor.b + 15}, 0.85)`;
      ctx.beginPath();
      ctx.moveTo(cx, topRhombusY);
      ctx.lineTo(cx + w, topRhombusY - w * scale);
      ctx.lineTo(cx, topRhombusY - w);
      ctx.lineTo(cx - w, topRhombusY - w * scale);
      ctx.closePath();
      ctx.fill();

      // Left face (Darker)
      ctx.fillStyle = `rgba(${baseColor.r - 20}, ${baseColor.g - 20}, ${baseColor.b - 20}, 0.9)`;
      ctx.beginPath();
      ctx.moveTo(cx - w, topRhombusY - w * scale);
      ctx.lineTo(cx, topRhombusY);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx - w, cy - w * scale);
      ctx.closePath();
      ctx.fill();

      // Right face (Medium dark)
      ctx.fillStyle = `rgba(${baseColor.r - 5}, ${baseColor.g - 5}, ${baseColor.b - 5}, 0.9)`;
      ctx.beginPath();
      ctx.moveTo(cx, topRhombusY);
      ctx.lineTo(cx + w, topRhombusY - w * scale);
      ctx.lineTo(cx + w, cy - w * scale);
      ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fill();

      // Highlight wireframe outlines to look super crisp and detailed
      ctx.strokeStyle = `rgba(${baseColor.r + 40}, ${baseColor.g + 40}, ${baseColor.b + 40}, 0.25)`;
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

      ctx.beginPath();
      ctx.moveTo(cx, topRhombusY);
      ctx.lineTo(cx + w, topRhombusY - w * scale);
      ctx.stroke();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      // Base colors from theme
      let baseRGB = { r: 235, g: 235, b: 250 }; // default soft greyish blue
      if (colorType === "lavender") {
        baseRGB = { r: 139, g: 136, b: 248 }; // Lavender #8B88F8
      } else if (colorType === "green") {
        baseRGB = { r: 137, g: 243, b: 54 }; // Lime Green #89F336
      }

      // We render isometric layers of blocks
      const cols = Math.ceil(width / hSpacing) + 2;
      const rows = Math.ceil(height / vSpacing) + 4;

      for (let r = -2; r < rows; r++) {
        for (let c = -2; c < cols; c++) {
          // Iso staggered coords
          let cx = c * hSpacing;
          if (r % 2 === 1) {
            cx += size;
          }
          const cy = r * vSpacing;

          // Calculate interactive height
          const dx = cx - mouseRef.current.x;
          const dy = (cy - size * 0.5) - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Wave effect based on grid position and time
          const wave = Math.sin(c * 0.2 + r * 0.15 + time) * 12 + Math.cos(c * 0.1 - r * 0.2 + time * 0.7) * 8;
          
          // Hover height influence
          let hoverInfluence = 0;
          if (mouseRef.current.active && dist < 220) {
            hoverInfluence = (1 - dist / 220) * 35;
          }

          const blockHeight = 12 + Math.max(-5, wave + hoverInfluence);

          // Dynamic colors based on height
          const heightShiftRGB = {
            r: Math.max(20, Math.min(255, baseRGB.r - (blockHeight * 0.5))),
            g: Math.max(20, Math.min(255, baseRGB.g - (blockHeight * 0.2))),
            b: Math.max(20, Math.min(255, baseRGB.b + (blockHeight * 0.8)))
          };

          drawIsoBlock(ctx, cx, cy, size - 2, blockHeight, heightShiftRGB);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [colorType]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000"
      style={{ opacity, mixBlendMode: "multiply" }}
    />
  );
}
