"use client";

import React, { useEffect, useRef, useState } from "react";

interface Block3D {
  x: number;
  y: number;
  z: number;
  color: string;
}

export default function ThreeDBuilderHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blocks, setBlocks] = useState<Block3D[]>([
    { x: 0, y: 0, z: 0, color: "#8B88F8" },
    { x: 1, y: 0, z: 0, color: "#89F336" },
    { x: 0, y: 1, z: 0, color: "#111111" },
    { x: 0, y: 0, z: 1, color: "#FFFFFF" },
    { x: 1, y: 1, z: 0, color: "#8B88F8" },
  ]);

  const mouseRef = useRef({ x: 0, y: 0, angleX: -0.5, angleY: 0.6, targetAngleX: -0.5, targetAngleY: 0.6 });

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
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      
      // Calculate target camera angles based on cursor
      mouseRef.current.targetAngleY = (mx / width - 0.5) * 1.5;
      mouseRef.current.targetAngleX = (my / height - 0.5) * -1.5;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Dynamic block placement on click
    const handleCanvasClick = () => {
      const colors = ["#8B88F8", "#89F336", "#111111", "#dad9fc"];
      const randColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Spawn block at random coordinates close to core
      const newBlock = {
        x: Math.floor(Math.random() * 3) - 1,
        y: Math.floor(Math.random() * 3) - 1,
        z: Math.floor(Math.random() * 3),
        color: randColor
      };

      // Check duplicate
      setBlocks((prev) => {
        const duplicate = prev.some(b => b.x === newBlock.x && b.y === newBlock.y && b.z === newBlock.z);
        if (duplicate) return prev;
        return [...prev, newBlock].slice(-16); // limit max blocks
      });
    };

    canvas.addEventListener("click", handleCanvasClick);

    // 3D Isometric Projection Helper
    const project = (x: number, y: number, z: number, angleX: number, angleY: number) => {
      // Rotation on Y axis (Yaw)
      let rotX = x * Math.cos(angleY) - z * Math.sin(angleY);
      let rotZ = x * Math.sin(angleY) + z * Math.cos(angleY);
      let rotY = y;

      // Rotation on X axis (Pitch)
      let finalY = rotY * Math.cos(angleX) - rotZ * Math.sin(angleX);
      let finalZ = rotY * Math.sin(angleX) + rotZ * Math.cos(angleX);

      // Project with perspective
      const scale = 50;
      const perspective = 300 / (300 + finalZ);
      const projX = width / 2 + rotX * scale * perspective;
      const projY = height / 2 + finalY * scale * perspective;

      return { x: projX, y: projY, z: finalZ };
    };

    const drawCube = (cx: number, cy: number, size: number, color: string, depth: number) => {
      const scale = 0.5; // isometric scaling

      // Color tints based on light source from top-right
      const baseRGB = hexToRgb(color) || { r: 139, g: 136, b: 248 };
      
      // Top face
      ctx.fillStyle = `rgba(${Math.min(255, baseRGB.r + 20)}, ${Math.min(255, baseRGB.g + 20)}, ${Math.min(255, baseRGB.b + 20)}, 0.95)`;
      ctx.beginPath();
      ctx.moveTo(cx, cy - size);
      ctx.lineTo(cx + size * 1.5, cy - size * 0.5);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx - size * 1.5, cy - size * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Left face
      ctx.fillStyle = `rgba(${Math.max(0, baseRGB.r - 25)}, ${Math.max(0, baseRGB.g - 25)}, ${Math.max(0, baseRGB.b - 25)}, 0.95)`;
      ctx.beginPath();
      ctx.moveTo(cx - size * 1.5, cy - size * 0.5);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx, cy + size);
      ctx.lineTo(cx - size * 1.5, cy + size * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right face
      ctx.fillStyle = `rgba(${baseRGB.r}, ${baseRGB.g}, ${baseRGB.b}, 0.95)`;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + size * 1.5, cy - size * 0.5);
      ctx.lineTo(cx + size * 1.5, cy + size * 0.5);
      ctx.lineTo(cx, cy + size);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    function hexToRgb(hex: string) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate camera angle transitions
      mouseRef.current.angleX += (mouseRef.current.targetAngleX - mouseRef.current.angleX) * 0.08;
      mouseRef.current.angleY += (mouseRef.current.targetAngleY - mouseRef.current.angleY) * 0.08;

      // Draw grid blueprint base
      ctx.strokeStyle = "rgba(17,17,17,0.03)";
      ctx.lineWidth = 0.5;
      const blueprintSize = 80;
      for (let x = -2; x <= 2; x++) {
        const p1 = project(x, 1, -2, mouseRef.current.angleX, mouseRef.current.angleY);
        const p2 = project(x, 1, 2, mouseRef.current.angleX, mouseRef.current.angleY);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      for (let z = -2; z <= 2; z++) {
        const p1 = project(-2, 1, z, mouseRef.current.angleX, mouseRef.current.angleY);
        const p2 = project(2, 1, z, mouseRef.current.angleX, mouseRef.current.angleY);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Sort blocks back-to-front (depth buffer) before drawing
      const projectedBlocks = blocks.map((b) => {
        const proj = project(b.x, -b.z, b.y, mouseRef.current.angleX, mouseRef.current.angleY);
        return { ...b, projX: proj.x, projY: proj.y, depth: proj.z };
      });

      projectedBlocks.sort((a, b) => b.depth - a.depth);

      // Render projected blocks
      projectedBlocks.forEach((b) => {
        drawCube(b.projX, b.projY, 18, b.color, b.depth);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (canvas) {
        canvas.removeEventListener("click", handleCanvasClick);
      }
    };
  }, [blocks]);

  return (
    <div className="relative w-full aspect-square max-w-[440px] rounded-3xl border border-gray-100 bg-[#fafafa] p-6 shadow-lg overflow-hidden flex flex-col justify-between select-none">
      {/* Blueprint grid underlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#eaeaea_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
      
      <div className="absolute top-4 left-4 font-mono text-[8px] text-gray-400 z-10 flex items-center gap-1.5 uppercase">
        <span className="h-1.5 w-1.5 bg-[#89F336] rounded-full animate-ping"></span>
        <span>BUILDER_COMPILER_STAGING</span>
      </div>

      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair relative z-10" />

      <div className="absolute bottom-4 left-4 right-4 font-mono text-[8px] text-gray-400 z-10 flex justify-between uppercase">
        <span>CLICK GRID TO PLACE BLOCKS</span>
        <span>BLOCKS: {blocks.length}/16</span>
      </div>
    </div>
  );
}
