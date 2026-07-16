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

interface ProjectedPoint3D extends Point3D {
  px: number;
  py: number;
  depth: number;
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
        color: "#5956c8",
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
        color: m.checkedIn ? "#10B981" : "#A5B4FC",
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
        color: "#4F46E5",
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
        color: "#111111",
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
        color: "#D946EF",
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
      const projected: ProjectedPoint3D[] = pts.map((p) => {
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
      let closestNode: ProjectedPoint3D | null = null;
      let minMouseDist = 20;

      for (const p of projected) {
        if (p.depth < -120) continue;

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
      }

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
    <div className="relative w-full min-h-[800vh] bg-[#fafafc] text-gray-900 overflow-hidden font-sans">
      {/* Premium light-theme animated mesh background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft grid overlay */}
        <div className="absolute inset-0 opacity-[0.25] bg-[linear-gradient(to_right,#dad9fc_1px,transparent_1px),linear-gradient(to_bottom,#dad9fc_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Dynamic mesh gradients */}
        <div className="absolute top-[5%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-[#8B88F8]/12 via-[#8B88F8]/6 to-[#89F336]/4 blur-3xl opacity-60 animate-float" />
        <div className="absolute top-[25%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-[#8B88F8]/6 via-[#3B82F6]/10 to-[#89F336]/4 blur-3xl opacity-50" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[50%] left-[-15%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-tr from-[#3B82F6]/8 via-[#8B88F8]/10 to-transparent blur-3xl opacity-50 animate-float" style={{ animationDuration: "12s" }} />
        <div className="absolute top-[75%] right-[-20%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-[#D946EF]/8 via-[#8B88F8]/10 to-transparent blur-3xl opacity-40 animate-float" style={{ animationDuration: "15s" }} />
        <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-[#8B88F8]/15 via-[#89F336]/8 to-[#fbfbfe] blur-3xl opacity-60 animate-float" />
      </div>
      
      {/* Fullscreen Master 3D Rendering Canvas */}
      <div className="fixed inset-0 w-full h-full z-10 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full pointer-events-auto" />
      </div>



      {/* Interactive side information panel */}
      {selectedItem && (
        <div className="fixed top-28 right-8 z-30 w-72 bg-white/95 border border-gray-200/50 p-6 rounded-2xl shadow-2xl backdrop-blur-md animate-scale-up text-left max-h-[70vh] overflow-y-auto text-gray-900">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
            <span className="font-mono text-[8px] text-[#5956c8] uppercase font-bold">NODE_METRICS_SPEC</span>
            <button 
              onClick={() => setSelectedItem(null)}
              className="text-gray-400 hover:text-gray-900 cursor-pointer font-mono text-[9px] font-bold"
            >
              [CLOSE]
            </button>
          </div>

          {(() => {
            if ("role" in selectedItem) {
              const member = selectedItem as Member;
              return (
                <div className="space-y-4">
                  <h4 className="font-black text-gray-900 text-base leading-tight">{member.name}</h4>
                  <p className="font-mono text-[9px] text-[#5956c8] font-bold">{member.role}</p>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2 font-mono text-[8px] text-gray-500">
                    <span className="block border-b border-gray-150 pb-1 text-gray-900 font-bold">CAPABILITIES</span>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map((s: string) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-gray-200/60 text-gray-700 font-medium">#{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            } else if ("client" in selectedItem) {
              const project = selectedItem as Project;
              return (
                <div className="space-y-4">
                  <h4 className="font-black text-gray-900 text-base leading-tight">{project.title}</h4>
                  <p className="font-mono text-[9px] text-gray-500 font-bold">Client: {project.client}</p>
                  <div className="space-y-2 text-xs text-gray-600 leading-relaxed">
                    <p><strong>Challenge:</strong> {project.challenge}</p>
                    <p><strong>Solution:</strong> {project.solution}</p>
                  </div>
                </div>
              );
            } else if ("website" in selectedItem) {
              const partner = selectedItem as Partner;
              return (
                <div className="space-y-4">
                  <h4 className="font-black text-gray-900 text-base leading-tight">{partner.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-[#5956c8]/10 border border-[#5956c8]/20 text-[#5956c8] font-mono text-[8px] font-bold uppercase">{partner.type}</span>
                  <a 
                    href={partner.website} target="_blank" rel="noopener noreferrer"
                    className="block text-center py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg font-mono transition-all shadow-md"
                  >
                    OPEN WEBSITE &rarr;
                  </a>
                </div>
              );
            } else {
              const program = selectedItem as Program;
              return (
                <div className="space-y-4">
                  <h4 className="font-black text-gray-900 text-base leading-tight">{program.title}</h4>
                  <p className="font-mono text-[9px] text-[#10B981] font-bold">{program.tagline}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{program.description}</p>
                </div>
              );
            }
          })()}
        </div>
      )}

      {/* ----------------------------------------------------
          8 NARRATIVE OVERLAY SCENES
          ---------------------------------------------------- */}
      <main className="relative z-20 pointer-events-none">

        {/* Scene 01: The Ecosystem Awakens */}
        <section className="narrative-layer min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
          <header className="max-w-4xl text-center space-y-8 pointer-events-auto flex flex-col items-center justify-center relative">
            {/* Holographic scanner top light */}
            <div className="absolute top-[-50px] w-64 h-1 bg-[#8B88F8] blur-md opacity-50 pulsing-ring" />
            
            <span className="px-4 py-1.5 text-[10px] font-mono font-black uppercase tracking-widest text-[#5956c8] bg-[#5956c8]/5 border border-[#5956c8]/25 rounded-full inline-block animate-pulse">
              INIT_STAGE // PROTOCOL_READY
            </span>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none text-gray-900 select-none flex flex-col gap-1">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#5956c8] via-[#8B88F8] to-[#10B981] animate-pulse">
                Layerz Group
              </span>
              <span className="text-3xl md:text-6xl font-black block mt-4 text-gray-700 leading-tight max-w-3xl">
                Building the Next Layer of <span className="underline decoration-wavy decoration-[#8B88F8]/60 underline-offset-8">Innovation</span>
              </span>
            </h1>
            
            <p className="text-base text-gray-500 leading-relaxed max-w-xl mx-auto font-medium">
              A decentralized global innovation ecosystem empowering developers, creators, and builders through technology, design, and systematic incubation.
            </p>
            
            <div className="flex justify-center gap-4 pt-4 relative group">
              <div className="absolute inset-0 bg-[#5956c8]/10 blur-xl rounded-lg opacity-50 group-hover:opacity-100 transition-opacity" />
              <Link href="/ecosystem" className="relative z-10 px-8 py-4 rounded-lg bg-gray-900 text-white hover:bg-[#5956c8] transition-all font-bold text-xs uppercase tracking-widest font-mono shadow-xl hover:-translate-y-0.5">
                Explore Ecosystem &rarr;
              </Link>
            </div>
          </header>
        </section>

        {/* Scene 02: Networks Assemble */}
        <section className="narrative-layer min-h-screen grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6 md:px-24">
          <aside className="w-full max-w-md md:max-w-lg h-[400px] flex justify-center items-center pointer-events-auto perspective-wrapper order-2 md:order-1">
            <figure className="relative w-80 h-80 block-3d hover:rotate-y-12 transform-gpu animate-float">
              {/* Glow backdrop inside the 3D container */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#5956c8]/10 to-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Card 1: Lead Engineer */}
              <div className="absolute top-0 left-0 w-56 bg-white/95 border border-gray-200 p-6 rounded-2xl shadow-xl transform translate-z-[60px] rotate-y-[-12deg] hover:translate-z-[90px] hover:scale-105 transition-all duration-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5956c8] to-[#8B88F8] flex items-center justify-center text-white text-xs font-bold font-mono">S</div>
                  <div>
                    <h3 className="font-bold text-xs text-gray-800">SARAH_DEV</h3>
                    <p className="text-[9px] text-[#5956c8] font-mono">Lead Smart Contracts</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-[#5956c8] h-full w-4/5 animate-pulse" />
                </div>
              </div>
              
              {/* Card 2: Creative Designer */}
              <div className="absolute top-20 right-[-20px] w-56 bg-white/95 border border-gray-200 p-6 rounded-2xl shadow-xl transform translate-z-[30px] rotate-x-[8deg] hover:translate-z-[60px] hover:scale-105 transition-all duration-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#10B981] to-[#89F336] flex items-center justify-center text-white text-xs font-bold font-mono">A</div>
                  <div>
                    <h3 className="font-bold text-xs text-gray-800">ALEX_DESIGN</h3>
                    <p className="text-[9px] text-[#10B981] font-mono">Creative Director</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-[#10B981] h-full w-11/12 animate-pulse" />
                </div>
              </div>

              {/* Card 3: Ecosystem Host */}
              <div className="absolute top-44 left-10 w-56 bg-white/95 border border-gray-200 p-6 rounded-2xl shadow-xl transform translate-z-[90px] rotate-z-[-6deg] hover:translate-z-[120px] hover:scale-105 transition-all duration-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D946EF] to-[#8B88F8] flex items-center justify-center text-white text-xs font-bold font-mono">M</div>
                  <div>
                    <h3 className="font-bold text-xs text-gray-800">MIKE_OPS</h3>
                    <p className="text-[9px] text-[#D946EF] font-mono">Chapter Coordinator</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-[#D946EF] h-full w-2/3 animate-pulse" />
                </div>
              </div>
            </figure>
          </aside>

          <article className="max-w-xl text-left space-y-6 pointer-events-auto bg-white/80 p-8 rounded-2xl border border-gray-200/50 shadow-xl backdrop-blur-md order-1 md:order-2">
            <span className="text-[10px] font-mono font-bold text-[#5956c8] uppercase tracking-widest block">
              SCENE_02 // ASSEMBLY PROTOCOL
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
              More Than a Company. An Ecosystem.
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Layerz exists to empower the next generation of innovators. We believe that great products, thriving communities, and impactful startups are built layer by layer—not overnight.
            </p>
            <Link href="/about" className="inline-block text-xs font-bold text-[#5956c8] hover:text-[#413eaf] font-mono">
              OPEN CONTRIBUTOR REGISTRY &rarr;
            </Link>
          </article>
        </section>        {/* Scene 03: Programs Emerge */}
        <section className="narrative-layer min-h-screen grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6 md:px-24">
          <article className="max-w-xl text-left space-y-6 pointer-events-auto bg-white/80 p-8 rounded-2xl border border-gray-200/50 shadow-xl backdrop-blur-md">
            <span className="text-[10px] font-mono font-bold text-[#5956c8] uppercase tracking-widest block">
              SCENE_03 // ARCHITECTURAL DRAFT
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
              One Ecosystem. Infinite Possibilities.
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every initiative within Layerz is designed to solve a different part of the innovation journey. From education to labs research to ventures incubation.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-[10px] text-gray-500">
              <div>
                <p className="text-gray-900 font-bold">L_01: FOUNDATION</p>
                <p>Empowering students and local campus chapters.</p>
              </div>
              <div>
                <p className="text-gray-900 font-bold">L_02: STUDIO</p>
                <p>Designing digital brands & Next.js systems.</p>
              </div>
            </div>
          </article>

          <aside className="w-full max-w-md md:max-w-lg h-[400px] flex justify-center items-center pointer-events-auto perspective-wrapper">
            <figure className="relative w-80 h-80 block-3d transform-gpu rotate-x-[38deg] rotate-z-[-22deg] animate-float">
              {/* Stack Layer 1 */}
              <div className="absolute top-0 left-0 w-72 h-20 bg-white/95 border-2 border-[#5956c8]/80 rounded-2xl shadow-2xl flex items-center justify-between px-6 transform translate-z-0 hover:-translate-y-4 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <span className="p-2.5 rounded-lg bg-[#5956c8]/10 text-[#5956c8] font-mono text-[10px] font-bold">L_01</span>
                  <span className="font-mono text-xs font-bold text-gray-800">FOUNDATION MODULE</span>
                </div>
                <span className="w-3 h-3 rounded-full bg-[#5956c8] pulsing-ring" />
              </div>
              
              {/* Stack Layer 2 */}
              <div className="absolute top-24 left-6 w-72 h-20 bg-white/95 border-2 border-[#10B981]/80 rounded-2xl shadow-2xl flex items-center justify-between px-6 transform translate-z-[45px] hover:-translate-y-4 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <span className="p-2.5 rounded-lg bg-[#10B981]/10 text-[#10B981] font-mono text-[10px] font-bold">L_02</span>
                  <span className="font-mono text-xs font-bold text-gray-800">CREATIVE STUDIO</span>
                </div>
                <span className="w-3 h-3 rounded-full bg-[#10B981] pulsing-ring" />
              </div>
              
              {/* Stack Layer 3 */}
              <div className="absolute top-48 left-12 w-72 h-20 bg-white/95 border-2 border-[#D946EF]/80 rounded-2xl shadow-2xl flex items-center justify-between px-6 transform translate-z-[90px] hover:-translate-y-4 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <span className="p-2.5 rounded-lg bg-[#D946EF]/10 text-[#D946EF] font-mono text-[10px] font-bold">L_03</span>
                  <span className="font-mono text-xs font-bold text-gray-800">VENTURE INCUBATOR</span>
                </div>
                <span className="w-3 h-3 rounded-full bg-[#D946EF] pulsing-ring" />
              </div>
            </figure>
          </aside>
        </section>

        {/* Scene 04: Events become memories */}
        <section className="narrative-layer min-h-screen grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6 md:px-24">
          <aside className="w-full max-w-md md:max-w-lg h-[400px] flex justify-center items-center pointer-events-auto perspective-wrapper order-2 md:order-1">
            <figure className="relative w-80 h-80 block-3d transform-gpu rotate-y-[18deg] rotate-x-[12deg] animate-float">
              <div className="w-72 bg-white/95 border border-gray-200 rounded-3xl shadow-2xl p-6 transform translate-z-[40px] border-pulse">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <span className="font-mono text-[10px] font-bold text-[#5956c8]">CHAPTER_CALENDAR</span>
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 font-mono text-[9px] font-bold animate-pulse">LIVE INDEX</span>
                </div>
                <div className="space-y-4 font-mono text-[10px]">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center hover:bg-gray-100 transition-colors">
                    <div>
                      <span className="block text-gray-800 font-bold">JUL_24 // HACKATHON</span>
                      <span className="text-[8px] text-gray-400">MEMBERS LABS DEMO</span>
                    </div>
                    <span className="text-[#10B981] font-bold">120 REG</span>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center hover:bg-gray-100 transition-colors">
                    <div>
                      <span className="block text-gray-800 font-bold">AUG_10 // WORKSHOP</span>
                      <span className="text-[8px] text-gray-400">SOLIDITY CODING SCALES</span>
                    </div>
                    <span className="text-[#5956c8] font-bold">ACTIVE</span>
                  </div>
                </div>
              </div>
            </figure>
          </aside>

          <article className="max-w-xl text-left space-y-6 pointer-events-auto bg-white/80 p-8 rounded-2xl border border-gray-200/50 shadow-xl backdrop-blur-md order-1 md:order-2">
            <span className="text-[10px] font-mono font-bold text-[#5956c8] uppercase tracking-widest block">
              SCENE_04 // KEYNOTE MEMORIES
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
              Ecosystem Chapters & Hackathons
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Connect with leading protocol builders. Apply to coordinate campus workshops, builder demo sessions, and open-source events.
            </p>
            <Link href="/events" className="inline-block text-xs font-bold text-[#5956c8] hover:text-[#413eaf] font-mono">
              INSPECT EVENTS INDEX &rarr;
            </Link>
          </article>
        </section>

        {/* Scene 05: Partners Connected Nodes */}
        <section className="narrative-layer min-h-screen grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6 md:px-24">
          <article className="max-w-xl text-left space-y-6 pointer-events-auto bg-white/80 p-8 rounded-2xl border border-gray-200/50 shadow-xl backdrop-blur-md">
            <span className="text-[10px] font-mono font-bold text-[#5956c8] uppercase tracking-widest block">
              SCENE_05 // RELATIONSHIP MAP
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
              Trusted by Industry Partners
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              We collaborate with decentralized VC networks, university chapters, and protocol groups backing modular innovation.
            </p>
          </article>

          <aside className="w-full max-w-md md:max-w-lg h-[400px] flex justify-center items-center pointer-events-auto perspective-wrapper">
            <figure className="relative w-80 h-80 block-3d transform-gpu rotate-x-[28deg] animate-float">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-2 border-dashed border-[#5956c8]/30 animate-spin" style={{ animationDuration: "16s" }} />
                <div className="absolute w-32 h-32 rounded-full border border-dashed border-[#10B981]/20 animate-spin" style={{ animationDuration: "8s", animationDirection: "reverse" }} />
              </div>
              <div className="absolute top-2 left-2 w-32 bg-white/95 border border-gray-200 p-3.5 rounded-xl shadow-lg flex items-center gap-3 transform translate-z-[40px]">
                <div className="w-6 h-6 rounded bg-gray-900 text-white font-mono text-[9px] flex items-center justify-center font-bold">V</div>
                <span className="font-mono text-[9px] font-bold text-gray-700">VERCEL_NODE</span>
              </div>
              <div className="absolute bottom-4 right-4 w-32 bg-white/95 border border-gray-200 p-3.5 rounded-xl shadow-lg flex items-center gap-3 transform translate-z-[60px]">
                <div className="w-6 h-6 rounded bg-[#5956c8] text-white font-mono text-[9px] flex items-center justify-center font-bold">P</div>
                <span className="font-mono text-[9px] font-bold text-gray-700">POLY_LABS</span>
              </div>
              <div className="absolute top-40 right-[-10px] w-32 bg-white/95 border border-gray-200 p-3.5 rounded-xl shadow-lg flex items-center gap-3 transform translate-z-[20px]">
                <div className="w-6 h-6 rounded bg-[#10B981] text-white font-mono text-[9px] flex items-center justify-center font-bold">G</div>
                <span className="font-mono text-[9px] font-bold text-gray-700">GATEWAY_VC</span>
              </div>
            </figure>
          </aside>
        </section>

        {/* Scene 06: Studio Projects */}
        <section className="narrative-layer min-h-screen grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6 md:px-24">
          <aside className="w-full max-w-md md:max-w-lg h-[400px] flex justify-center items-center pointer-events-auto perspective-wrapper order-2 md:order-1">
            <figure className="relative w-full max-w-sm h-64 block-3d transform-gpu rotate-y-[-12deg] rotate-x-[16deg] animate-float">
              <div className="w-full h-full bg-white/95 border-2 border-gray-800 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="font-mono text-[8px] text-gray-400">studio_editor.tsx</span>
                </div>
                <div className="flex-1 font-mono text-[10px] text-gray-500 space-y-2 pt-2 text-left">
                  <p className="text-[#5956c8]">const LayerzStudio = async () =&gt; &#123;</p>
                  <p className="pl-4">await compileFrontend(&quot;modular_core&quot;);</p>
                  <p className="pl-4 text-[#10B981]">return new StudioDeployment(&#123; success: true &#125;);</p>
                  <p className="text-[#5956c8]">&#125;;</p>
                </div>
                <div className="h-10 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between px-4 font-mono text-[9px] mt-4">
                  <span className="text-[#10B981] font-bold">DEPLOY: READY</span>
                  <span className="text-gray-400 font-bold">2.4ms</span>
                </div>
              </div>
            </figure>
          </aside>

          <article className="max-w-xl text-left space-y-6 pointer-events-auto bg-white/80 p-8 rounded-2xl border border-gray-200/50 shadow-xl backdrop-blur-md order-1 md:order-2">
            <span className="text-[10px] font-mono font-bold text-[#5956c8] uppercase tracking-widest block">
              SCENE_06 // PROJECTS PIPELINE
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
              Studio Scopes Build Themselves
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              From web app frontends to custom AI agent pipelines and Smart Account Solidity codes, see our selected client deployments.
            </p>
            <Link href="/studio" className="inline-block text-xs font-bold text-[#5956c8] hover:text-[#413eaf] font-mono">
              INSPECT CORE STUDIO WORK &rarr;
            </Link>
          </article>
        </section>

        {/* Scene 07: OS Resources Grid */}
        <section className="narrative-layer min-h-screen grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6 md:px-24">
          <article className="max-w-xl text-left space-y-6 pointer-events-auto bg-white/80 p-8 rounded-2xl border border-gray-200/50 shadow-xl backdrop-blur-md">
            <span className="text-[10px] font-mono font-bold text-[#5956c8] uppercase tracking-widest block">
              SCENE_07 // KNOWLEDGE VAULT
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
              Playbooks & Brand Identity Kits
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Access guidelines, copy colorways swatches, and inspect vector brandmarks blueprints directly.
            </p>
            <Link href="/resources" className="inline-block text-xs font-bold text-[#5956c8] hover:text-[#413eaf] font-mono">
              VAULT TERMINAL ENTRANCE &rarr;
            </Link>
          </article>

          <aside className="w-full max-w-md md:max-w-lg h-[400px] flex justify-center items-center pointer-events-auto perspective-wrapper">
            <figure className="relative w-80 h-80 block-3d transform-gpu flex items-center justify-center animate-float">
              <div className="absolute w-56 h-56 rounded-full border-2 border-dashed border-[#5956c8]/40 animate-spin" style={{ animationDuration: "20s" }} />
              <div className="absolute w-40 h-40 rounded-full border-2 border-dashed border-[#10B981]/50 animate-spin" style={{ animationDuration: "10s", animationDirection: "reverse" }} />
              <div className="absolute w-24 h-24 rounded-full border-2 border-[#D946EF]/30 flex items-center justify-center bg-white shadow-2xl">
                <span className="font-mono text-[10px] font-bold text-gray-900">VAULT_CORE</span>
              </div>
            </figure>
          </aside>
        </section>

        {/* Scene 08: Future Roadmap Heights */}
        <section className="narrative-layer min-h-screen flex items-center justify-center px-6 md:px-24">
          <article className="max-w-2xl text-center space-y-8 pointer-events-auto bg-white/90 p-12 rounded-3xl border border-gray-250 shadow-2xl backdrop-blur-md">
            <span className="text-[10px] font-mono font-bold text-[#5956c8] uppercase tracking-widest block">
              SCENE_08 // ROADMAP TARGETS
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-none tracking-tight">
              Ready to Build the Future?
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed max-w-lg mx-auto">
              Whether you&apos;re a student, developer, designer, founder, researcher, or organization, Layerz is where ambitious people come together to create meaningful impact.
            </p>
            
            <div className="flex justify-center gap-4 pt-4">
              <Link href="/join" className="px-8 py-4 bg-gray-900 text-white hover:bg-[#5956c8] transition-colors font-bold text-xs uppercase tracking-widest rounded-lg font-mono shadow-md">
                Apply to Chapters
              </Link>
              <Link href="/roadmap" className="px-8 py-4 border border-gray-300 hover:bg-gray-100 transition-colors text-gray-900 text-xs font-bold uppercase tracking-widest rounded-lg font-mono">
                Milestones Board
              </Link>
            </div>
          </article>
        </section>

      </main>
    </div>
  );
}
