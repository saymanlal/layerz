"use client";

import { useState } from "react";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";

export default function JoinPage() {
  const [role, setRole] = useState("developer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [links, setLinks] = useState("");
  const [pitch, setPitch] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [memberPass, setMemberPass] = useState<{
    passId: string;
    qrSeed: string;
    role: string;
    name: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMemberPass({
        passId: `LYZ-MEM-${Math.floor(1000 + Math.random() * 9000)}-${Math.random()
          .toString(36)
          .substring(2, 6)
          .toUpperCase()}`,
        qrSeed: Math.random().toString(36).substring(6),
        role: role.toUpperCase(),
        name: name
      });
    }, 1500);
  };

  const roles = [
    { id: "student", label: "Student", desc: "Gain hands-on experience, chapters support, and mentor connections." },
    { id: "developer", label: "Developer", desc: "Contribute to Labs projects, smart contract auditing, and cohorts." },
    { id: "designer", label: "Designer", desc: "Create typography rules, visual branding, and interactive UI assets." },
    { id: "mentor", label: "Mentor", desc: "Advise builders on product paths, security auditing, and design standards." },
    { id: "startup", label: "Startup / Founder", desc: "Validate MVPs, scope brand products, and apply for incubation." },
    { id: "investor", label: "Investor / Fund", desc: "Review upcoming builder cohorts and support high-potential founders." },
    { id: "partner", label: "Ecosystem Partner", desc: "Sponsor events, support hackathons, and coordinate integrations." }
  ];

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 h-[400px] w-full border-b border-[#eaeaea] bg-gradient-to-b from-white to-[#f5f5ff] overflow-hidden">
        <ThreeDBlockBg colorType="green" opacity={0.4} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-32 relative z-10">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#89F336] bg-[#fdfef0] border border-[#d2f9af] px-4 py-1.5 rounded-full inline-block mb-4">
            Ecosystem Entrance
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#111111] mb-4">
            Join the Layerz Ecosystem
          </h1>
          <p className="text-sm text-[#5C5C5C] leading-relaxed">
            Apply to connect with our global network of builders. Select your profile below, complete the form, and get your digital entrance pass.
          </p>
        </div>

        {!memberPass ? (
          <form onSubmit={handleSubmit} className="bg-[#fafafa] border border-[#eaeaea] rounded-2xl p-8 shadow-sm space-y-6">
            {/* Role Select Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Select Your Profile Layer
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      role === r.id
                        ? "bg-white border-[#89F336] shadow-sm ring-1 ring-[#89F336]"
                        : "bg-white border-[#eaeaea] hover:border-gray-300"
                    }`}
                  >
                    <span className="font-bold text-xs text-[#111111] block mb-1">{r.label}</span>
                    <span className="text-[10px] text-gray-400 leading-tight block">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#89F336] transition-colors"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#89F336] transition-colors"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                GitHub / Portfolio / LinkedIn URL
              </label>
              <input
                type="url"
                required
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#89F336] transition-colors"
                placeholder="https://github.com/xxxxx"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Tell us what you want to build or achieve
              </label>
              <textarea
                required
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                className="w-full h-28 px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#89F336] transition-colors"
                placeholder="Briefly share your builder ideas, project vision, or partner expectations..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-center py-3.5 rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-xs font-bold text-white uppercase tracking-widest cursor-pointer transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  GENERATING PASS...
                </>
              ) : (
                "APPLY & GENERATE WELCOME PASS"
              )}
            </button>
          </form>
        ) : (
          <div className="bg-[#fafafa] border border-[#eaeaea] rounded-2xl p-8 shadow-sm max-w-md mx-auto text-center space-y-6 animate-scale-up">
            <h3 className="text-2xl font-bold text-[#111111]">Application Logged!</h3>
            
            <div className="border border-dashed border-[#89F336]/60 bg-white rounded-xl p-6 text-left relative overflow-hidden font-mono text-xs">
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 h-6 w-6 bg-[#fafafa] border-r border-dashed border-[#89F336]/60 rounded-full"></div>
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 h-6 w-6 bg-[#fafafa] border-l border-dashed border-[#89F336]/60 rounded-full"></div>

              <div className="flex justify-between items-center text-[9px] text-gray-400 mb-4 pb-2 border-b border-[#eaeaea]">
                <span>LAYERZ MEMBER PASS</span>
                <span className="text-[#89F336] font-bold">VERIFYING</span>
              </div>

              <h4 className="font-bold text-[#111111] uppercase truncate mb-1 text-sm">
                {memberPass.name}
              </h4>
              <p className="text-[10px] text-[#8B88F8] font-bold mb-4">
                ROLE: {memberPass.role}
              </p>

              <div className="flex items-center justify-between gap-4 mt-6">
                <div>
                  <span className="text-[9px] text-gray-400 block uppercase">Member Code</span>
                  <span className="text-xs font-bold text-[#111111]">{memberPass.passId}</span>
                </div>
                <div className="w-12 h-12 bg-white p-1 border border-[#eaeaea] rounded flex flex-wrap gap-0.5 justify-center items-center">
                  {Array.from({ length: 36 }).map((_, i) => {
                    const isBlack = (i + memberPass.qrSeed.charCodeAt(i % memberPass.qrSeed.length)) % 2 === 0;
                    return (
                      <div
                        key={i}
                        className={`w-[5px] h-[5px] ${isBlack ? "bg-black" : "bg-transparent"}`}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="text-xs text-[#5C5C5C] leading-relaxed">
              Your builder request and references have been logged in the repo pipeline. We will review your links and issue your access invite shortly. Keep this code secure.
            </p>

            <button
              onClick={() => setMemberPass(null)}
              className="px-6 py-2.5 rounded-lg bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#89F336] hover:text-[#111111] transition-all cursor-pointer"
            >
              Apply Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
