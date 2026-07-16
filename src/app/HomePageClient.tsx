"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Program {
  id: string;
  title: string;
  tagline: string;
  description: string;
  status: string;
  duration: string;
}

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
  featured: boolean;
}

interface Member {
  id: string;
  name: string;
  role: string;
  checkedIn: boolean;
  github: string;
  twitter: string;
  skills: string[];
}

interface Partner {
  id: string;
  name: string;
  website: string;
  type: string;
  tier: string;
  featured: boolean;
}

interface Blog {
  id: string;
  title: string;
  category: string;
  summary: string;
  date: string;
  readTime: string;
  slug: string;
  featured: boolean;
}

interface HomePageClientProps {
  programs: Program[];
  studioWork: Project[];
  members: Member[];
  partners: Partner[];
  blogs: Blog[];
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  tx: number; // target coordinate
  ty: number;
  tz: number;
  color: string;
  size: number;
  label?: string;
  type: "genesis" | "member" | "project" | "partner" | "program" | "roadmap";
  meta?: Member | Project | Partner | Program;
}

interface CursorParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export default function HomePageClient({
  programs,
  studioWork,
  members,
  partners,
  // blogs,
}: HomePageClientProps) {
  const [activeScene, setActiveScene] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Member | Project | Partner | Program | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point3D[]>([]);
  const particlesRef = useRef<CursorParticle[]>([]);
  
  const cameraRef = useRef({
    x: 0, y: 0, z: -250,
    tx: 0, ty: 0, tz: -250,
    yaw: 0, pitch: 0,
    tyaw: 0, tpitch: 0
  });

  const mouseRef = useRef({
    x: -1000, y: -1000,
    active: false,
    click: false,
    hoveredNode: null as Point3D | null
  });

  // ----------------------------------------------------
  // INITIALIZE SCENE COORDINATE SETS
  // ----------------------------------------------------
  useEffect(() => {
    const pts: Point3D[] = [];

    // 1. Genesis logo blocks (isometric coordinate nodes)
    const logoCoords = [
      {x: 0, y: -20, z: 0}, {x: 15, y: -10, z: 15}, {x: -15, y: -10, z: -15},
      {x: 0, y: 0, z: 0}, {x: 20, y: 10, z: -20}, {x: -20, y: 10, z: 20},
      {x: 10, y: -30, z: 10}, {x: -10, y: -30, z: -10}, {x: 0, y: 20, z: 0}
    ];
    logoCoords.forEach((coord, i) => {
      pts.push({
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 50,
        z: (Math.random() - 0.5) * 50,
        tx: coord.x, ty: coord.y, tz: coord.z,
        color: "#8B88F8",
        size: 4,
        label: i === 0 ? "GENESIS_ROOT" : `NODE_0${i}`,
        type: "genesis"
      });
    });

    // 2. Contributor Registry nodes
    members.forEach((m) => {
      pts.push({
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        z: (Math.random() - 0.5) * 100,
        tx: 0, ty: 0, tz: 0,
        color: m.checkedIn ? "#89F336" : "#DAD9FC",
        size: 5,
        label: m.name.split(" ")[0].toUpperCase(),
        type: "member",
        meta: m
      });
    });

    // 3. Program Cohort nodes
    programs.forEach((pr) => {
      pts.push({
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 120,
        z: (Math.random() - 0.5) * 120,
        tx: 0, ty: 0, tz: 0,
        color: "#89F336",
        size: 6,
        label: pr.title.split(" ")[0].toUpperCase(),
        type: "program",
        meta: pr
      });
    });

    // 4. Studio Project blocks
    studioWork.forEach((proj) => {
      pts.push({
        x: (Math.random() - 0.5) * 150,
        y: (Math.random() - 0.5) * 150,
        z: (Math.random() - 0.5) * 150,
        tx: 0, ty: 0, tz: 0,
        color: "#FFFFFF",
        size: 5.5,
        label: proj.client.toUpperCase(),
        type: "project",
        meta: proj
      });
    });

    // 5. Venture & Partner nodes
    partners.forEach((partner) => {
      pts.push({
        x: (Math.random() - 0.5) * 180,
        y: (Math.random() - 0.5) * 180,
        z: (Math.random() - 0.5) * 180,
        tx: 0, ty: 0, tz: 0,
        color: "#8B88F8",
        size: 4.5,
        label: partner.name.toUpperCase(),
        type: "partner",
        meta: partner
      });
    });

    pointsRef.current = pts;
  }, [members, programs, studioWork, partners]);

  // ----------------------------------------------------
  // SCENE NARRATIVE TRANSITIONS (MORPHING MATRIX)
  // ----------------------------------------------------
  useEffect(() => {
    const pts = pointsRef.current;
    if (pts.length === 0) return;

    // SCENE 01: The Ecosystem Awakens (Centered Isometric Core)
    if (activeScene === 0) {
      cameraRef.current.tx = 0; cameraRef.current.ty = 0; cameraRef.current.tz = -180;
      cameraRef.current.tyaw = 0.4; cameraRef.current.tpitch = 0.5;

      pts.forEach((p, i) => {
        if (p.type === "genesis") {
          // Stay locked in logo config
        } else {
          // Orbit outer boundary sphere
          const angle = (i / pts.length) * Math.PI * 2;
          p.tx = Math.cos(angle) * 45;
          p.ty = Math.sin(angle) * 45;
          p.tz = Math.sin(i * 0.3) * 20;
        }
      });
    }

    // SCENE 02: Contributor Nodes Assemble (Wide mesh net)
    else if (activeScene === 1) {
      cameraRef.current.tx = 30; cameraRef.current.ty = -10; cameraRef.current.tz = -260;
      cameraRef.current.tyaw = 0.7; cameraRef.current.tpitch = -0.2;

      pts.forEach((p, i) => {
        const col = i % 8;
        const row = Math.floor(i / 8) % 8;
        p.tx = (col - 3.5) * 26;
        p.ty = (row - 3.5) * 26;
        p.tz = Math.sin(col * 0.4 + row * 0.4) * 24;
      });
    }

    // SCENE 03: Programs emerge from architecture (Columns)
    else if (activeScene === 2) {
      cameraRef.current.tx = -20; cameraRef.current.ty = 30; cameraRef.current.tz = -230;
      cameraRef.current.tyaw = -0.5; cameraRef.current.tpitch = 0.4;

      pts.forEach((p, i) => {
        const group = i % 3; // three paths
        const trackX = (group - 1) * 55;
        const trackY = (Math.floor(i / 3) % 10 - 4.5) * 16;
        p.tx = trackX;
        p.ty = trackY;
        p.tz = Math.cos(i * 0.5) * 15;
      });
    }

    // SCENE 04: Events become memories (Flat screen matrix)
    else if (activeScene === 3) {
      cameraRef.current.tx = 0; cameraRef.current.ty = 0; cameraRef.current.tz = -280;
      cameraRef.current.tyaw = 1.1; cameraRef.current.tpitch = 0.15;

      pts.forEach((p, i) => {
        const xIdx = i % 10;
        const yIdx = Math.floor(i / 10);
        p.tx = (xIdx - 4.5) * 28;
        p.ty = (yIdx - 3) * 28;
        p.tz = 0;
      });
    }

    // SCENE 05: Partners connected nodes (Concentric solar orbits)
    else if (activeScene === 4) {
      cameraRef.current.tx = 0; cameraRef.current.ty = 0; cameraRef.current.tz = -200;
      cameraRef.current.tyaw = 0.2; cameraRef.current.tpitch = 0.3;

      pts.forEach((p, i) => {
        const layer = i % 3;
        const radius = 35 + layer * 30;
        const angle = (i / (pts.length / 3)) * Math.PI * 2;
        p.tx = Math.cos(angle) * radius;
        p.ty = Math.sin(angle) * radius;
        p.tz = (layer - 1) * 20;
      });
    }

    // SCENE 06: Studio projects build themselves (Cube boxes)
    else if (activeScene === 5) {
      cameraRef.current.tx = 60; cameraRef.current.ty = -20; cameraRef.current.tz = -240;
      cameraRef.current.tyaw = -0.4; cameraRef.current.tpitch = 0.25;

      pts.forEach((p, i) => {
        const cluster = i % 3;
        const corner = Math.floor(i / 3) % 8;
        const groupX = (cluster - 1) * 65;
        
        const dx = (corner & 1) ? 12 : -12;
        const dy = (corner & 2) ? 12 : -12;
        const dz = (corner & 4) ? 12 : -12;

        p.tx = groupX + dx;
        p.ty = dy;
        p.tz = dz;
      });
    }

    // SCENE 07: Resources unfold OS (Horizontal table deck)
    else if (activeScene === 6) {
      cameraRef.current.tx = 0; cameraRef.current.ty = 60; cameraRef.current.tz = -160;
      cameraRef.current.tyaw = 0; cameraRef.current.tpitch = 1.35; // Downward lookup

      pts.forEach((p, i) => {
        const xVal = i % 8;
        const zVal = Math.floor(i / 8);
        p.tx = (xVal - 3.5) * 28;
        p.ty = 0;
        p.tz = (zVal - 3.5) * 28;
      });
    }

    // SCENE 08: Future roadmap constructs (Step increments)
    else if (activeScene === 7) {
      cameraRef.current.tx = 0; cameraRef.current.ty = -15; cameraRef.current.tz = -300;
      cameraRef.current.tyaw = 0.3; cameraRef.current.tpitch = 0.15;

      pts.forEach((p, i) => {
        const column = i % 6;
        const heightLevel = Math.floor(i / 6) % 8;
        p.tx = (heightLevel - 3.5) * 25;
        p.ty = -column * 14 + 30;
        p.tz = (column - 2.5) * 18;
      });
    }

  }, [activeScene]);

  // ----------------------------------------------------
  // ENGINE DRAW & INTERACTION LOOP
  // ----------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse vectors
    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;

      // Spawn cursor flow particles
      if (Math.random() < 0.4) {
        particlesRef.current.push({
          x: mouseRef.current.x,
          y: mouseRef.current.y,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          life: 1.0,
          color: Math.random() < 0.5 ? "#89F336" : "#8B88F8"
        });
      }
    };

    const handleLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const handleClick = () => {
      if (mouseRef.current.hoveredNode) {
        setSelectedItem(mouseRef.current.hoveredNode.meta || null);
      }
    };

    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("click", handleClick);

    // Project coordinates
    const project = (x: number, y: number, z: number, yaw: number, pitch: number, cam: typeof cameraRef.current) => {
      const dx = x - cam.x;
      const dy = y - cam.y;
      const dz = z - cam.z;

      // Yaw rotation
      const rX = dx * Math.cos(yaw) - dz * Math.sin(yaw);
      const rZ = dx * Math.sin(yaw) + dz * Math.cos(yaw);
      
      // Pitch rotation
      const finalY = dy * Math.cos(pitch) - rZ * Math.sin(pitch);
      const finalZ = dy * Math.sin(pitch) + rZ * Math.cos(pitch);

      const scale = 260;
      const perspective = 320 / (320 + finalZ);
      const px = width / 2 + rX * scale * perspective;
      const py = height / 2 + finalY * scale * perspective;

      return { x: px, y: py, z: finalZ };
    };

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.006;

      // Camera lerp
      const cam = cameraRef.current;
      cam.x += (cam.tx - cam.x) * 0.05;
      cam.y += (cam.ty - cam.y) * 0.05;
      cam.z += (cam.tz - cam.z) * 0.05;
      cam.yaw += (cam.tyaw - cam.yaw) * 0.05;
      cam.pitch += (cam.tpitch - cam.pitch) * 0.05;

      const yawEl = document.getElementById("hud-camera-yaw");
      if (yawEl) yawEl.innerText = cam.yaw.toFixed(4);
      const pitchEl = document.getElementById("hud-camera-pitch");
      if (pitchEl) pitchEl.innerText = cam.pitch.toFixed(4);

      const yawSway = cam.yaw + Math.sin(time * 0.4) * 0.06;
      const pitchSway = cam.pitch + Math.cos(time * 0.3) * 0.04;

      // Render flow particles trail
      const particles = particlesRef.current;
      ctx.lineWidth = 1;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.035;

        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life * 0.6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.life * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;

      const pts = pointsRef.current;

      // Morph coordinates position towards targets
      const projected = pts.map((p) => {
        p.x += (p.tx - p.x) * 0.05;
        p.y += (p.ty - p.y) * 0.05;
        p.z += (p.tz - p.z) * 0.05;

        // Apply mouse sway gravity
        if (mouseRef.current.active) {
          const proj = project(p.x, p.y, p.z, yawSway, pitchSway, cam);
          const dx = mouseRef.current.x - proj.x;
          const dy = mouseRef.current.y - proj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 75) {
            const pull = (1 - dist / 75) * 8;
            p.x -= (dx / dist) * pull * 0.08;
            p.y -= (dy / dist) * pull * 0.08;
          }
        }

        const proj = project(p.x, p.y, p.z, yawSway, pitchSway, cam);
        return { ...p, px: proj.x, py: proj.y, depth: proj.z };
      });

      // Painter's sorting
      projected.sort((a, b) => b.depth - a.depth);

      // Render architectural connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Render link if distance matches spec
          if (dist < 38) {
            ctx.strokeStyle = `rgba(139, 136, 248, ${(1 - dist / 38) * 0.12})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // Check node cursor overlaps
      let closestNode: Point3D | null = null;
      let minMouseDist = 20;

      projected.forEach((p) => {
        if (p.depth < -120) return;

        const isGenesis = p.type === "genesis";
        const dotSize = Math.max(1, p.size * (150 / (150 + p.depth)));

        // Hover highlight
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.px;
          const dy = mouseRef.current.y - p.py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minMouseDist) {
            minMouseDist = dist;
            closestNode = p;
          }
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.px, p.py, dotSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw blueprint target outlines
        if (isGenesis) {
          ctx.strokeStyle = "rgba(139, 136, 248, 0.2)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(p.px, p.py, dotSize * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Update hovered node coordinate
      mouseRef.current.hoveredNode = closestNode;

      // Draw technical overlay tag for hovered node
      if (closestNode && closestNode.label) {
        ctx.fillStyle = "rgba(17,17,17,0.92)";
        ctx.fillRect(closestNode.px + 12, closestNode.py - 14, closestNode.label.length * 6.5 + 14, 18);
        ctx.strokeStyle = "rgba(137,243,54,0.3)";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(closestNode.px + 12, closestNode.py - 14, closestNode.label.length * 6.5 + 14, 18);

        ctx.fillStyle = "#89F336";
        ctx.font = "8px monospace";
        ctx.fillText(closestNode.label, closestNode.px + 18, closestNode.py - 2);

        // Vector pointer to mouse coordinate
        ctx.strokeStyle = "rgba(137, 243, 54, 0.4)";
        ctx.beginPath();
        ctx.moveTo(closestNode.px, closestNode.py);
        ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
        ctx.stroke();
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  // Sync scroll values to morph scenes
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = window.innerHeight;
      const index = Math.min(Math.max(Math.floor(scrollY / height), 0), 7);
      setActiveScene(index);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-[800vh] bg-[#111111] text-white overflow-hidden font-sans">
      
      {/* Fullscreen Master 3D Rendering Canvas */}
      <div className="fixed inset-0 w-full h-full z-10 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full pointer-events-auto" />
      </div>

      {/* Floating HUD System logs overlay */}
      <div className="fixed top-24 left-8 z-30 font-mono text-[9px] text-gray-500 uppercase tracking-widest pointer-events-none space-y-1 hidden md:block">
        <p>SYSTEM_CORE: ACTIVE_OK</p>
        <p>ACTIVE_SCENE_COORDS: [LAYER_0{activeScene + 1}]</p>
        <p>CAMERA_YAW: <span id="hud-camera-yaw">0.0000</span></p>
        <p>CAMERA_PITCH: <span id="hud-camera-pitch">0.0000</span></p>
      </div>

      {/* Interactive side information panel */}
      {selectedItem && (
        <div className="fixed top-28 right-8 z-30 w-72 bg-[#171717] border border-white/5 p-6 rounded-2xl backdrop-blur-md animate-scale-up text-left max-h-[70vh] overflow-y-auto">
          <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-4">
            <span className="font-mono text-[8px] text-[#89F336] uppercase">NODE_METRICS_SPEC</span>
            <button 
              onClick={() => setSelectedItem(null)}
              className="text-gray-500 hover:text-white cursor-pointer font-mono text-[9px]"
            >
              [CLOSE]
            </button>
          </div>

          {selectedItem.role ? (
            // Member Node details
            <div className="space-y-4">
              <h4 className="font-black text-white text-base leading-tight">{selectedItem.name}</h4>
              <p className="font-mono text-[9px] text-[#8B88F8]">{selectedItem.role}</p>
              <div className="p-3 bg-black/40 rounded-lg border border-white/5 space-y-2 font-mono text-[8px] text-gray-400">
                <span className="block border-b border-white/5 pb-1 text-white font-bold">CAPABILITIES</span>
                <div className="flex flex-wrap gap-1">
                  {selectedItem.skills.map((s: string) => (
                    <span key={s} className="px-1.5 py-0.5 rounded bg-white/5 text-gray-300">#{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedItem.client ? (
            // Project Node details
            <div className="space-y-4">
              <h4 className="font-black text-white text-base leading-tight">{selectedItem.title}</h4>
              <p className="font-mono text-[9px] text-gray-500">Client: {selectedItem.client}</p>
              <div className="space-y-2 text-xs text-gray-400">
                <p><strong>Challenge:</strong> {selectedItem.challenge}</p>
                <p><strong>Solution:</strong> {selectedItem.solution}</p>
              </div>
            </div>
          ) : selectedItem.website ? (
            // Partner Node details
            <div className="space-y-4">
              <h4 className="font-black text-white text-base leading-tight">{selectedItem.name}</h4>
              <span className="px-2 py-0.5 rounded bg-[#8B88F8]/10 border border-[#8B88F8]/20 text-[#8B88F8] font-mono text-[8px] uppercase">{selectedItem.type}</span>
              <a 
                href={selectedItem.website} target="_blank" rel="noopener noreferrer"
                className="block text-center py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-lg font-mono"
              >
                OPEN WEBSITE &rarr;
              </a>
            </div>
          ) : (
            // Program details
            <div className="space-y-4">
              <h4 className="font-black text-white text-base leading-tight">{selectedItem.title}</h4>
              <p className="font-mono text-[9px] text-[#89F336]">{selectedItem.tagline}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{selectedItem.description}</p>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          8 NARRATIVE OVERLAY SCENES
          ---------------------------------------------------- */}
      <div className="relative z-20 pointer-events-none">

        {/* Scene 01: The Ecosystem Awakens */}
        <section className="narrative-layer min-h-screen flex items-center justify-start px-6 md:px-24">
          <div className="max-w-xl text-left space-y-6 pointer-events-auto bg-[#111111]/85 p-8 rounded-2xl border border-white/5 backdrop-blur-md">
            <span className="text-[10px] font-mono font-bold text-[#89F336] uppercase tracking-widest block">
              SCENE_01 // THE AWAKENING
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
              Building the Next Layer of Innovation.
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed">
              Layerz is a global innovation ecosystem empowering builders, creators, startups, and communities through technology, design, education, and collaboration.
            </p>
            <div className="flex gap-4">
              <Link href="/ecosystem" className="px-6 py-3 rounded-lg bg-white text-black hover:bg-[#89F336] hover:text-black font-bold text-xs uppercase tracking-wider transition-colors font-mono">
                Explore Ecosystem
              </Link>
            </div>
          </div>
        </section>

        {/* Scene 02: Networks Assemble */}
        <section className="narrative-layer min-h-screen flex items-center justify-end px-6 md:px-24">
          <div className="max-w-xl text-left space-y-6 pointer-events-auto bg-[#111111]/85 p-8 rounded-2xl border border-white/5 backdrop-blur-md">
            <span className="text-[10px] font-mono font-bold text-[#8B88F8] uppercase tracking-widest block">
              SCENE_02 // ASSEMBLY PROTOCOL
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tight">
              More Than a Company. An Ecosystem.
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Layerz exists to empower the next generation of innovators. We believe that great products, thriving communities, and impactful startups are built layer by layer—not overnight.
            </p>
            <Link href="/about" className="inline-block text-xs font-bold text-[#89F336] hover:underline font-mono">
              OPEN CONTRIBUTOR REGISTRY &rarr;
            </Link>
          </div>
        </section>

        {/* Scene 03: Programs Emerge */}
        <section className="narrative-layer min-h-screen flex items-center justify-start px-6 md:px-24">
          <div className="max-w-xl text-left space-y-6 pointer-events-auto bg-[#111111]/85 p-8 rounded-2xl border border-white/5 backdrop-blur-md">
            <span className="text-[10px] font-mono font-bold text-[#89F336] uppercase tracking-widest block">
              SCENE_03 // ARCHITECTURAL DRAFT
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tight">
              One Ecosystem. Infinite Possibilities.
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every initiative within Layerz is designed to solve a different part of the innovation journey. From education to labs research to ventures incubation.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-[10px] text-gray-500">
              <div>
                <p className="text-white font-bold">L_01: FOUNDATION</p>
                <p>Empowering students and local campus chapters.</p>
              </div>
              <div>
                <p className="text-white font-bold">L_02: STUDIO</p>
                <p>Designing digital brands & Next.js systems.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Scene 04: Events become memories */}
        <section className="narrative-layer min-h-screen flex items-center justify-end px-6 md:px-24">
          <div className="max-w-xl text-left space-y-6 pointer-events-auto bg-[#111111]/85 p-8 rounded-2xl border border-white/5 backdrop-blur-md">
            <span className="text-[10px] font-mono font-bold text-[#8B88F8] uppercase tracking-widest block">
              SCENE_04 // KEYNOTE MEMORIES
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tight">
              Ecosystem Chapters & Hackathons
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Connect with leading protocol builders. Apply to coordinate campus workshops, builder demo sessions, and open-source events.
            </p>
            <Link href="/events" className="inline-block text-xs font-bold text-[#8B88F8] hover:underline font-mono">
              INSPECT EVENTS INDEX &rarr;
            </Link>
          </div>
        </section>

        {/* Scene 05: Partners Connected Nodes */}
        <section className="narrative-layer min-h-screen flex items-center justify-start px-6 md:px-24">
          <div className="max-w-xl text-left space-y-6 pointer-events-auto bg-[#111111]/85 p-8 rounded-2xl border border-white/5 backdrop-blur-md">
            <span className="text-[10px] font-mono font-bold text-[#89F336] uppercase tracking-widest block">
              SCENE_05 // RELATIONSHIP MAP
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tight">
              Trusted by Industry Partners
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              We collaborate with decentralized VC networks, university chapters, and protocol groups backing modular innovation.
            </p>
          </div>
        </section>

        {/* Scene 06: Studio Projects */}
        <section className="narrative-layer min-h-screen flex items-center justify-end px-6 md:px-24">
          <div className="max-w-xl text-left space-y-6 pointer-events-auto bg-[#111111]/85 p-8 rounded-2xl border border-white/5 backdrop-blur-md">
            <span className="text-[10px] font-mono font-bold text-[#8B88F8] uppercase tracking-widest block">
              SCENE_06 // PROJECTS PIPELINE
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tight">
              Studio Scopes Build Themselves
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              From web app frontends to custom AI agent pipelines and Smart Account Solidity codes, see our selected client deployments.
            </p>
            <Link href="/studio" className="inline-block text-xs font-bold text-[#89F336] hover:underline font-mono">
              INSPECT CORE STUDIO WORK &rarr;
            </Link>
          </div>
        </section>

        {/* Scene 07: OS Resources Grid */}
        <section className="narrative-layer min-h-screen flex items-center justify-start px-6 md:px-24">
          <div className="max-w-xl text-left space-y-6 pointer-events-auto bg-[#111111]/85 p-8 rounded-2xl border border-white/5 backdrop-blur-md">
            <span className="text-[10px] font-mono font-bold text-[#89F336] uppercase tracking-widest block">
              SCENE_07 // KNOWLEDGE VAULT
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tight">
              Playbooks & Brand Identity Kits
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Access guidelines, copy colorways swatches, and inspect vector brandmarks blueprints directly.
            </p>
            <Link href="/resources" className="inline-block text-xs font-bold text-[#8B88F8] hover:underline font-mono">
              VAULT TERMINAL ENTRANCE &rarr;
            </Link>
          </div>
        </section>

        {/* Scene 08: Future Roadmap Heights */}
        <section className="narrative-layer min-h-screen flex items-center justify-center px-6 md:px-24">
          <div className="max-w-2xl text-center space-y-8 pointer-events-auto bg-[#111111]/90 p-12 rounded-3xl border border-white/10 backdrop-blur-md">
            <span className="text-[10px] font-mono font-bold text-[#89F336] uppercase tracking-widest block">
              SCENE_08 // ROADMAP TARGETS
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
              Ready to Build the Future?
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed max-w-lg mx-auto">
              Whether you&apos;re a student, developer, designer, founder, researcher, or organization, Layerz is where ambitious people come together to create meaningful impact.
            </p>
            
            <div className="flex justify-center gap-4 pt-4">
              <Link href="/join" className="px-8 py-4 bg-[#89F336] text-[#111111] hover:bg-white transition-colors font-bold text-xs uppercase tracking-widest rounded-lg font-mono">
                Apply to Chapters
              </Link>
              <Link href="/roadmap" className="px-8 py-4 border border-white/20 hover:bg-white/5 transition-colors text-white text-xs font-bold uppercase tracking-widest rounded-lg font-mono">
                Milestones Board
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
