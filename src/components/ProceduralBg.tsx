"use client";

import React, { useEffect, useRef } from "react";

interface ProceduralBgProps {
  mode: "architecture" | "topology" | "blueprint" | "mesh" | "stage" | "minimal";
  colorType?: "default" | "lavender" | "green";
  opacity?: number;
}

export default function ProceduralBg({
  mode = "architecture",
  colorType = "default",
  opacity = 0.85
}: ProceduralBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false, rx: 0, ry: 0 });

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
      mouseRef.current.rx = (mouseRef.current.x / width - 0.5) * 2;
      mouseRef.current.ry = (mouseRef.current.y / height - 0.5) * 2;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      mouseRef.current.rx = 0;
      mouseRef.current.ry = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Color definitions
    let primaryRGB = { r: 139, g: 136, b: 248 }; // #8B88F8
    let secondaryRGB = { r: 137, g: 243, b: 54 }; // #89F336

    if (colorType === "green") {
      primaryRGB = { r: 137, g: 243, b: 54 };
      secondaryRGB = { r: 139, g: 136, b: 248 };
    } else if (colorType === "lavender") {
      primaryRGB = { r: 139, g: 136, b: 248 };
      secondaryRGB = { r: 17, g: 17, b: 17 };
    }

    let time = 0;

    // --- SETUP FOR TOPOLOGY MODE (Perlin-noise simulation flow field) ---
    const topologyPoints: { x: number; y: number; angle: number; speed: number; seed: number }[] = [];
    const maxTopologyPoints = 60;
    for (let i = 0; i < maxTopologyPoints; i++) {
      topologyPoints.push({
        x: Math.random() * width,
        y: Math.random() * height,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.4 + 0.2,
        seed: Math.random() * 100
      });
    }

    // --- SETUP FOR BLUEPRINT MODE (Rotating geometry frames) ---
    let blueprintsAngle = 0;

    // --- SETUP FOR MESH MODE (Dynamic interconnected nodes) ---
    interface MeshNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      connections: number;
    }
    const meshNodes: MeshNode[] = [];
    const maxMeshNodes = 50;
    for (let i = 0; i < maxMeshNodes; i++) {
      meshNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        connections: 0
      });
    }

    // --- SETUP FOR STAGE MODE (Laser beams and diagonal matrix rain) ---
    const stageStreams: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];
    const maxStreams = 25;
    for (let i = 0; i < maxStreams; i++) {
      stageStreams.push({
        x: Math.random() * width,
        y: Math.random() * -height * 0.5,
        length: Math.random() * 120 + 40,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.01;

      // ----------------------------------------------------
      // MODE 1: ARCHITECTURE (Isometric block stacks + sweeping sweep beams)
      // ----------------------------------------------------
      if (mode === "architecture") {
        ctx.strokeStyle = `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.04)`;
        ctx.lineWidth = 1.0;

        // Draw dynamic grid mesh
        const gridSize = 40;

        for (let x = -gridSize * 2; x < width + gridSize * 2; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x - mouseRef.current.rx * 50, 0);
          ctx.lineTo(x + mouseRef.current.rx * 100, height);
          ctx.stroke();
        }

        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y - mouseRef.current.ry * 50);
          ctx.lineTo(width, y + mouseRef.current.ry * 100);
          ctx.stroke();
        }

        // Draw sweeping spotlight beam
        const sweepX = width / 2 + Math.sin(time * 0.5) * (width / 2);
        const sweepGrad = ctx.createLinearGradient(sweepX - 100, 0, sweepX + 100, height);
        sweepGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
        sweepGrad.addColorStop(0.5, `rgba(${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}, 0.03)`);
        sweepGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.moveTo(sweepX - 150, 0);
        ctx.lineTo(sweepX + 150, 0);
        ctx.lineTo(sweepX + 400, height);
        ctx.lineTo(sweepX - 400, height);
        ctx.closePath();
        ctx.fill();
      }

      // ----------------------------------------------------
      // MODE 2: TOPOLOGY (Organic mathematical noise flow topology)
      // ----------------------------------------------------
      else if (mode === "topology") {
        ctx.strokeStyle = `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.09)`;
        ctx.lineWidth = 1.2;

        // Draw topological wavy contour bands
        for (let r = 0; r < 5; r++) {
          ctx.beginPath();
          for (let x = 0; x <= width; x += 15) {
            const noise = Math.sin(x * 0.005 + time + r) * 35 + Math.cos(x * 0.003 - time + r * 2) * 20;
            const y = (height / 6) * (r + 1) + noise;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Draw flowing vectors
        topologyPoints.forEach((p) => {
          p.angle = Math.sin(p.x * 0.002 + time) * Math.cos(p.y * 0.002 - time) * Math.PI * 2;
          p.x += Math.cos(p.angle) * p.speed;
          p.y += Math.sin(p.angle) * p.speed;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.fillStyle = `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.35)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ----------------------------------------------------
      // MODE 3: BLUEPRINT (Engineering drafting grid coordinates)
      // ----------------------------------------------------
      else if (mode === "blueprint") {
        ctx.strokeStyle = `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.08)`;
        ctx.lineWidth = 0.8;

        blueprintsAngle += 0.0015;
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(blueprintsAngle);

        ctx.beginPath();
        ctx.arc(0, 0, 180, 0, Math.PI * 2);
        ctx.stroke();

        ctx.setLineDash([5, 10]);
        ctx.beginPath();
        ctx.arc(0, 0, 220, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.setLineDash([]);
        ctx.strokeStyle = `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.03)`;
        const spacing = 60;
        for (let x = 0; x < width; x += spacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += spacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        if (mouseRef.current.active) {
          ctx.strokeStyle = `rgba(${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}, 0.15)`;
          ctx.beginPath();
          ctx.moveTo(mouseRef.current.x, 0);
          ctx.lineTo(mouseRef.current.x, height);
          ctx.moveTo(0, mouseRef.current.y);
          ctx.lineTo(width, mouseRef.current.y);
          ctx.stroke();

          ctx.fillStyle = `rgba(${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}, 0.45)`;
          ctx.font = "8px monospace";
          ctx.fillText(`COORD [${Math.round(mouseRef.current.x)}, ${Math.round(mouseRef.current.y)}]`, mouseRef.current.x + 8, mouseRef.current.y - 8);
        }
      }

      // ----------------------------------------------------
      // MODE 4: MESH (Decentralized Knowledge Mesh network)
      // ----------------------------------------------------
      else if (mode === "mesh") {
        ctx.strokeStyle = `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.06)`;
        ctx.lineWidth = 1.0;

        meshNodes.forEach((node, i) => {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;

          if (mouseRef.current.active) {
            const dx = mouseRef.current.x - node.x;
            const dy = mouseRef.current.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 220) {
              node.x += (dx / dist) * 0.25;
              node.y += (dy / dist) * 0.25;
            }
          }

          ctx.fillStyle = `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.35)`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
          ctx.fill();

          for (let j = i + 1; j < meshNodes.length; j++) {
            const other = meshNodes[j];
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
              ctx.strokeStyle = `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, ${(1 - dist / 130) * 0.12})`;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        });
      }

      // ----------------------------------------------------
      // MODE 5: STAGE (Laser sweeps and code vertical rain)
      // ----------------------------------------------------
      else if (mode === "stage") {
        stageStreams.forEach((stream) => {
          stream.y += stream.speed;
          if (stream.y > height) {
            stream.y = -stream.length;
            stream.x = Math.random() * width;
          }

          const streamGrad = ctx.createLinearGradient(stream.x, stream.y, stream.x, stream.y + stream.length);
          streamGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
          streamGrad.addColorStop(1, `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, ${stream.opacity})`);
          
          ctx.strokeStyle = streamGrad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(stream.x, stream.y);
          ctx.lineTo(stream.x, stream.y + stream.length);
          ctx.stroke();
        });

        ctx.strokeStyle = `rgba(${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}, 0.05)`;
        ctx.lineWidth = 1.0;
        const angleSweep = Math.sin(time) * 0.15;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width * (0.5 + angleSweep), height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width, 0);
        ctx.lineTo(width * (0.5 - angleSweep), height);
        ctx.stroke();
      }

      // ----------------------------------------------------
      // MODE 6: MINIMAL (Fine dots and layout grids)
      // ----------------------------------------------------
      else if (mode === "minimal") {
        ctx.fillStyle = `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.06)`;
        const dotSpacing = 30;
        
        for (let x = 15; x < width; x += dotSpacing) {
          for (let y = 15; y < height; y += dotSpacing) {
            ctx.fillRect(x, y, 1, 1);
          }
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
  }, [mode, colorType, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000"
      style={{ opacity }}
    />
  );
}
