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

// 3D Point definition for our custom canvas projection engine
interface Point3D {
  x: number;
  y: number;
  z: number;
  tx: number; // Target coordinates for morphing transitions
  ty: number;
  tz: number;
  color: string;
  size: number;
  label?: string;
  meta?: any;
}

export default function HomePageClient({
  programs,
  studioWork,
  members,
  partners,
  blogs,
}: HomePageClientProps) {
  const [activeScene, setActiveScene] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [isHoveredNode, setIsHoveredNode] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0, click: false, active: false });
  const pointsRef = useRef<Point3D[]>([]);
  const cameraRef = useRef({ x: 0, y: 0, z: -250, tx: 0, ty: 0, tz: -250, yaw: 0, pitch: 0, tyaw: 0, tpitch: 0 });

  // ----------------------------------------------------
  // INITIALIZE 3D NODE MESH FOR ALL SCENES
  // ----------------------------------------------------
  useEffect(() => {
    const points: Point3D[] = [];

    // Layer 1: Core logo schematic nodes (15 points)
    for (let i = 0; i < 15; i++) {
      points.push({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40,
        z: (Math.random() - 0.5) * 40,
        tx: 0, ty: 0, tz: 0,
        color: "#8B88F8",
        size: 3,
        label: i === 0 ? "GENESIS_NODE" : undefined
      });
    }

    // Layer 2: Contributor Registry nodes (linked to team members)
    members.forEach((m, idx) => {
      points.push({
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        z: (Math.random() - 0.5) * 100,
        tx: 0, ty: 0, tz: 0,
        color: m.checkedIn ? "#89F336" : "# dad9fc",
        size: 4,
        label: m.name.split(" ")[0].toUpperCase(),
        meta: { type: "member", data: m }
      });
    });

    // Layer 3: Studio Project nodes
    studioWork.forEach((p, idx) => {
      points.push({
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 120,
        z: (Math.random() - 0.5) * 120,
        tx: 0, ty: 0, tz: 0,
        color: "#FFFFFF",
        size: 5,
        label: p.client.toUpperCase(),
        meta: { type: "project", data: p }
      });
    });

    // Layer 4: Partner & Backer nodes
    partners.forEach((partner, idx) => {
      points.push({
        x: (Math.random() - 0.5) * 150,
        y: (Math.random() - 0.5) * 150,
        z: (Math.random() - 0.5) * 150,
        tx: 0, ty: 0, tz: 0,
        color: "#8B88F8",
        size: 3.5,
        label: partner.name.toUpperCase(),
        meta: { type: "partner", data: partner }
      });
    });

    pointsRef.current = points;
  }, [members, studioWork, partners]);

  // ----------------------------------------------------
  // SCENE MORPH MATHEMATICAL FLOW FIELD ENGINE
  // ----------------------------------------------------
  useEffect(() => {
    const points = pointsRef.current;
    if (points.length === 0) return;

    // --- Scene 01: The Ecosystem Awakens (Logo outline configuration) ---
    if (activeScene === 0) {
      cameraRef.current.tx = 0; cameraRef.current.ty = 0; cameraRef.current.tz = -200;
      cameraRef.current.tyaw = 0.3; cameraRef.current.tpitch = 0.4;

      points.forEach((p, idx) => {
        // Morph into centralized sphere
        const angle = (idx / points.length) * Math.PI * 2;
        p.tx = Math.cos(angle) * 35;
        p.ty = Math.sin(angle) * 35;
        p.tz = Math.sin(idx * 0.5) * 15;
      });
    }

    // --- Scene 02: Networks Assemble (Coordinate grid mesh) ---
    else if (activeScene === 1) {
      cameraRef.current.tx = 50; cameraRef.current.ty = -20; cameraRef.current.tz = -280;
      cameraRef.current.tyaw = 0.8; cameraRef.current.tpitch = -0.3;

      points.forEach((p, idx) => {
        // Explode into wide grid panel
        const col = idx % 8;
        const row = Math.floor(idx / 8) % 8;
        p.tx = (col - 3.5) * 30;
        p.ty = (row - 3.5) * 30;
        p.tz = Math.sin(col * 0.5 + row * 0.5) * 20;
      });
    }

    // --- Scene 03: Programs Emerge (Parallel pipeline columns) ---
    else if (activeScene === 2) {
      cameraRef.current.tx = -30; cameraRef.current.ty = 40; cameraRef.current.tz = -250;
      cameraRef.current.tyaw = -0.4; cameraRef.current.tpitch = 0.5;

      points.forEach((p, idx) => {
        // Group into three vertical coordinate columns
        const group = idx % 3;
        const colX = (group - 1) * 60;
        const heightY = (Math.floor(idx / 3) % 10 - 4.5) * 18;
        p.tx = colX;
        p.ty = heightY;
        p.tz = Math.cos(idx * 0.4) * 12;
      });
    }

    // --- Scene 04: Events Conclude (Projection plane matrices) ---
    else if (activeScene === 3) {
      cameraRef.current.tx = 0; cameraRef.current.ty = 0; cameraRef.current.tz = -300;
      cameraRef.current.tyaw = 1.2; cameraRef.current.tpitch = 0.1;

      points.forEach((p, idx) => {
        // Morph into dynamic flat projection wall
        const xIndex = idx % 12;
        const yIndex = Math.floor(idx / 12);
        p.tx = (xIndex - 5.5) * 24;
        p.ty = (yIndex - 3) * 24;
        p.tz = 0;
      });
    }

    // --- Scene 05: Partners Connected Nodes (Orbiting planetary rings) ---
    else if (activeScene === 4) {
      cameraRef.current.tx = 0; cameraRef.current.ty = 0; cameraRef.current.tz = -220;
      cameraRef.current.tyaw = 0.1; cameraRef.current.tpitch = 0.2;

      points.forEach((p, idx) => {
        // Map to multi-layered circular orbital tracks
        const ring = idx % 3;
        const radius = 40 + ring * 35;
        const angle = (idx / (points.length / 3)) * Math.PI * 2;
        p.tx = Math.cos(angle) * radius;
        p.ty = Math.sin(angle) * radius;
        p.tz = (ring - 1) * 25;
      });
    }

    // --- Scene 06: Studio Projects (3D boxes outline) ---
    else if (activeScene === 5) {
      cameraRef.current.tx = 80; cameraRef.current.ty = -30; cameraRef.current.tz = -260;
      cameraRef.current.tyaw = -0.5; cameraRef.current.tpitch = 0.3;

      points.forEach((p, idx) => {
        // Assemble into wireframe blocks corners
        const boxIdx = idx % 4;
        const corner = Math.floor(idx / 4) % 8;
        const boxX = (boxIdx - 1.5) * 70;
        
        // Cube corners offset coordinates
        const dx = (corner & 1) ? 15 : -15;
        const dy = (corner & 2) ? 15 : -15;
        const dz = (corner & 4) ? 15 : -15;

        p.tx = boxX + dx;
        p.ty = dy;
        p.tz = dz;
      });
    }

    // --- Scene 07: OS Console Grid (Flat console terminal) ---
    else if (activeScene === 6) {
      cameraRef.current.tx = 0; cameraRef.current.ty = 80; cameraRef.current.tz = -180;
      cameraRef.current.tyaw = 0; cameraRef.current.tpitch = 1.4; // Looking almost straight down

      points.forEach((p, idx) => {
        // Map onto horizontal data board
        const col = idx % 8;
        const row = Math.floor(idx / 8);
        p.tx = (col - 3.5) * 32;
        p.ty = 0;
        p.tz = (row - 3.5) * 32;
      });
    }

    // --- Scene 08: Future Roadmap heights (Rising planning column steps) ---
    else if (activeScene === 7) {
      cameraRef.current.tx = 0; cameraRef.current.ty = -20; cameraRef.current.tz = -320;
      cameraRef.current.tyaw = 0.4; cameraRef.current.tpitch = 0.2;

      points.forEach((p, idx) => {
        // Morph into architectural steps rising upwards
        const step = idx % 6;
        const col = Math.floor(idx / 6) % 8;
        p.tx = (col - 3.5) * 30;
        p.ty = -step * 15 + 40;
        p.tz = (step - 2.5) * 20;
      });
    }

  }, [activeScene]);

  // ----------------------------------------------------
  // CANVAS ANIMATION LOOP & ROTATION MATHEMATICS
  // ----------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse events inside canvas
    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseleave", handleLeave);

    // Coordinate matrix math projector
    const project = (x: number, y: number, z: number, yaw: number, pitch: number, cam: any) => {
      // Offset point by camera position targets
      let dx = x - cam.x;
      let dy = y - cam.y;
      let dz = z - cam.z;

      // Rotation around Y axis (Yaw)
      let rX = dx * Math.cos(yaw) - dz * Math.sin(yaw);
      let rZ = dx * Math.sin(yaw) + dz * Math.cos(yaw);
      let rY = dy;

      // Rotation around X axis (Pitch)
      let finalY = rY * Math.cos(pitch) - rZ * Math.sin(pitch);
      let finalZ = rY * Math.sin(pitch) + rZ * Math.cos(pitch);

      // Perspective projection division
      const scale = 250;
      const perspective = 300 / (300 + finalZ);
      const px = width / 2 + rX * scale * perspective;
      const py = height / 2 + finalY * scale * perspective;

      return { x: px, y: py, z: finalZ };
    };

    let localTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      localTime += 0.008;

      // Smooth camera position and angle interpolation (lerp)
      const cam = cameraRef.current;
      cam.x += (cam.tx - cam.x) * 0.05;
      cam.y += (cam.ty - cam.y) * 0.05;
      cam.z += (cam.tz - cam.z) * 0.05;
      cam.yaw += (cam.tyaw - cam.yaw) * 0.05;
      cam.pitch += (cam.tpitch - cam.pitch) * 0.05;

      // Add automatic camera orbit sway based on time
      const yawSway = cam.yaw + Math.sin(localTime * 0.5) * 0.08;
      const pitchSway = cam.pitch + Math.cos(localTime * 0.4) * 0.05;

      const points = pointsRef.current;

      // Update and project points
      const projected = points.map((p) => {
        // Interpolate point positions towards target scene configurations (physics simulation)
        p.x += (p.tx - p.x) * 0.06;
        p.y += (p.ty - p.y) * 0.06;
        p.z += (p.tz - p.z) * 0.06;

        // Apply mouse distortion gravity ripple if cursor is active nearby
        if (mouseRef.current.active) {
          const proj = project(p.x, p.y, p.z, yawSway, pitchSway, cam);
          const dx = mouseRef.current.x - proj.x;
          const dy = mouseRef.current.y - proj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const force = (1 - dist / 80) * 12;
            p.x -= (dx / dist) * force * 0.1;
            p.y -= (dy / dist) * force * 0.1;
          }
        }

        const proj = project(p.x, p.y, p.z, yawSway, pitchSway, cam);
        return { ...p, px: proj.x, py: proj.y, depth: proj.z };
      });

      // Sort points back-to-front (painter's algorithm)
      projected.sort((a, b) => b.depth - a.depth);

      // Render lines connecting close coordinates
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Standard distance threshold connection
          if (dist < 40) {
            ctx.strokeStyle = `rgba(139, 136, 248, ${(1 - dist / 40) * 0.15})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // Render node dots
      projected.forEach((p) => {
        if (p.depth < -100) return; // clip near plane

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.px, p.py, Math.max(1, p.size * (150 / (150 + p.depth))), 0, Math.PI * 2);
        ctx.fill();

        // Render technical node label tags on hover
        if (mouseRef.current.active && p.label) {
          const dx = mouseRef.current.x - p.px;
          const dy = mouseRef.current.y - p.py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 25) {
            ctx.fillStyle = "rgba(17,17,17,0.85)";
            ctx.fillRect(p.px + 8, p.py - 12, p.label.length * 6 + 10, 16);
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "8px monospace";
            ctx.fillText(p.label, p.px + 12, p.py - 2);

            // Draw line to cursor spotlight
            ctx.strokeStyle = "rgba(137,243,54,0.4)";
            ctx.beginPath();
            ctx.moveTo(p.px, p.py);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
          }
        }
      });

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  // Track scroll offsets to morph scenes
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const rawIndex = scrollY / windowHeight;
      const activeIdx = Math.min(Math.max(Math.floor(rawIndex), 0), 7);
      
      setActiveScene(activeIdx);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-[800vh] bg-[#111111] text-white overflow-hidden dark-theme selection:bg-[#89F336]/30">
      
      {/* Fullscreen Master 3D WebGL-like Canvas Staging */}
      <div className="fixed inset-0 w-full h-full z-10 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full pointer-events-auto" />
      </div>

      {/* Floating HUD controls */}
      <div className="fixed top-24 left-8 z-30 font-mono text-[9px] text-gray-500 uppercase tracking-widest pointer-events-none space-y-1.5 hidden md:block">
        <p>SYSTEM_CORE: ACTIVE</p>
        <p>CAMERA_ANGLE_X: {cameraRef.current.yaw.toFixed(3)}</p>
        <p>CAMERA_ANGLE_Y: {cameraRef.current.pitch.toFixed(3)}</p>
      </div>

      {/* ----------------------------------------------------
          SCENE OVERLAY NARRATIVES
          ---------------------------------------------------- */}
      <div className="relative z-20 pointer-events-none">

        {/* SCENE 01: The Ecosystem Awakens */}
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
                Explore Layerz
              </Link>
            </div>
          </div>
        </section>

        {/* SCENE 02: Contributor Nodes Assemble */}
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

        {/* SCENE 03: Cohort Pipeline Blueprints */}
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

        {/* SCENE 04: Staged Events Memories */}
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

        {/* SCENE 05: Partner Relationship Rings */}
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

        {/* SCENE 06: Studio Project Wireframes */}
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

        {/* SCENE 07: OS Resources Grid */}
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

        {/* SCENE 08: Future Roadmap Heights */}
        <section className="narrative-layer min-h-screen flex items-center justify-center px-6 md:px-24">
          <div className="max-w-2xl text-center space-y-8 pointer-events-auto bg-[#111111]/90 p-12 rounded-3xl border border-white/10 backdrop-blur-md">
            <span className="text-[10px] font-mono font-bold text-[#89F336] uppercase tracking-widest block">
              SCENE_08 // ROADMAP TARGETS
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
              Ready to Build the Future?
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed max-w-lg mx-auto">
              Whether you're a student, developer, designer, founder, researcher, or organization, Layerz is where ambitious people come together to create meaningful impact.
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
