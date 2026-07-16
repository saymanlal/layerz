"use client";

import { useState } from "react";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";

interface CheckInHistoryItem {
  timestamp: string;
  location: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  github: string;
  twitter: string;
  checkedIn: boolean;
  lastCheckIn: string;
  skills: string[];
  checkInHistory: CheckInHistoryItem[];
}

interface MembersPageClientProps {
  initialMembers: Member[];
}

export default function MembersPageClient({ initialMembers }: MembersPageClientProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Check-in Gateway State
  const [showGateway, setShowGateway] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [gatewayLocation, setGatewayLocation] = useState("Layerz Hub (Toronto)");
  const [gatewayLogs, setGatewayLogs] = useState<string[]>([]);

  // Open Gateway with a specific member preselected
  const openGatewayForMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setShowGateway(true);
  };

  const handleGatewayAction = (action: "in" | "out") => {
    if (!selectedMemberId) return;

    const updated = members.map((m) => {
      if (m.id === selectedMemberId) {
        const timestamp = new Date().toISOString();
        if (action === "in") {
          const newHistory = [
            { timestamp, location: gatewayLocation },
            ...m.checkInHistory,
          ];
          return {
            ...m,
            checkedIn: true,
            lastCheckIn: timestamp,
            checkInHistory: newHistory,
          };
        } else {
          return {
            ...m,
            checkedIn: false,
          };
        }
      }
      return m;
    });

    const targetMember = members.find((m) => m.id === selectedMemberId);
    if (targetMember) {
      const logMsg = `[${new Date().toLocaleTimeString()}] ${targetMember.name} ${
        action === "in" ? `IN Node: ${gatewayLocation}` : "OUT Node (Away)"
      }`;
      setGatewayLogs((prev) => [logMsg, ...prev].slice(0, 8));
    }

    setMembers(updated);
  };

  // Filter members
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "checkedIn" && member.checkedIn) ||
      (statusFilter === "away" && !member.checkedIn);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 h-[450px] w-full border-b border-[#eaeaea] bg-gradient-to-b from-white to-[#f5f5ff] overflow-hidden">
        <ThreeDBlockBg colorType="lavender" opacity={0.5} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
        {/* Title */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 max-w-5xl mx-auto">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B88F8] bg-[#f0f0ff] border border-[#dad9fc] px-4 py-1.5 rounded-full inline-block mb-4">
              Ecosystem Node Logs
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#111111] leading-none mb-2">
              Members Directory
            </h1>
            <p className="text-sm text-[#5C5C5C]">
              Active builders, smart contract researchers, and designers checked-in across global nodes.
            </p>
          </div>

          <button
            onClick={() => setShowGateway(!showGateway)}
            className="px-5 py-2.5 rounded-lg border border-[#111111] hover:bg-[#fafafa] text-xs font-bold uppercase tracking-wider text-[#111111] transition-all cursor-pointer"
          >
            {showGateway ? "Hide Check-in Console" : "Open Check-in Console"}
          </button>
        </div>

        {/* Check-In Gateway Console */}
        {showGateway && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 p-8 bg-[#fafafa] border border-[#eaeaea] rounded-2xl animate-scale-up max-w-5xl mx-auto">
            {/* Input Form */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-1 flex items-center gap-2">
                  <span className="h-2 w-2 bg-[#89F336] rounded-full animate-pulse"></span>
                  Ecosystem Check-in Gateway
                </h3>
                <p className="text-xs text-gray-500">
                  Select a member identity to transmit check-in or check-out protocols.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Select Member
                  </label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#8B88F8] transition-colors"
                  >
                    <option value="">-- Choose Identity --</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Hub Location
                  </label>
                  <select
                    value={gatewayLocation}
                    onChange={(e) => setGatewayLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#8B88F8] transition-colors"
                  >
                    <option value="Layerz Hub (Toronto)">Layerz Hub (Toronto)</option>
                    <option value="Layerz Hub, San Francisco">Layerz Hub, San Francisco</option>
                    <option value="Layerz Studio, London">Layerz Studio, London</option>
                    <option value="Virtual Hub">Virtual Hub</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleGatewayAction("in")}
                  disabled={!selectedMemberId}
                  className="flex-1 py-3 rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-xs font-bold uppercase tracking-wider text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  TRANSMIT CHECK-IN
                </button>
                <button
                  onClick={() => handleGatewayAction("out")}
                  disabled={!selectedMemberId}
                  className="flex-1 py-3 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-bold uppercase tracking-wider text-red-500 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  TRANSMIT CHECK-OUT
                </button>
              </div>
            </div>

            {/* Terminal Feed */}
            <div className="bg-[#111111] rounded-xl border border-[#222222] p-6 flex flex-col justify-between font-mono text-xs text-gray-400 h-64 overflow-hidden relative dark-theme">
              <div className="absolute top-0 right-0 text-[9px] font-bold bg-[#222222] text-gray-500 px-3 py-1 rounded-bl-lg">
                GATEWAY_LOGS
              </div>
              <div className="space-y-1.5 overflow-y-auto max-h-[180px] scrollbar-thin">
                {gatewayLogs.length === 0 ? (
                  <p className="text-gray-600 italic">SYSTEM LISTENING FOR TRANSMISSIONS...</p>
                ) : (
                  gatewayLogs.map((log, index) => (
                    <p
                      key={index}
                      className={log.includes("IN Node") ? "text-[#89F336]" : "text-red-400"}
                    >
                      {log}
                    </p>
                  ))
                )}
              </div>
              <div className="border-t border-[#222222] pt-3 text-[10px] text-gray-500 flex justify-between">
                <span>GATEWAY: CONNECTED</span>
                <span>SYSTEM: READY</span>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12 p-4 bg-[#fafafa] border border-[#eaeaea] rounded-xl max-w-5xl mx-auto">
          <input
            type="text"
            placeholder="Search by name, skill, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-md px-4 py-2.5 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-xs focus:outline-none focus:border-[#8B88F8] transition-colors"
          />

          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-lg border border-[#eaeaea] bg-white text-gray-500 text-xs focus:outline-none focus:border-[#8B88F8]"
            >
              <option value="all">All Roles</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="founder">Founder</option>
              <option value="mentor">Mentor</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-lg border border-[#eaeaea] bg-white text-gray-500 text-xs focus:outline-none focus:border-[#8B88F8]"
            >
              <option value="all">All Statuses</option>
              <option value="checkedIn">Checked In</option>
              <option value="away">Away</option>
            </select>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="premium-card p-6 flex flex-col justify-between relative group"
            >
              {/* Check in badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    member.checkedIn ? "bg-[#89F336] animate-pulse" : "bg-gray-300"
                  }`}
                ></span>
                <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400">
                  {member.checkedIn ? "In Node" : "Away"}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#111111] group-hover:text-[#8B88F8] transition-colors mt-2">
                  {member.name}
                </h3>
                <p className="text-[10px] text-[#8B88F8] font-mono uppercase tracking-widest mb-4">
                  {member.role}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 mb-6">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded bg-[#f5f5f5] border border-[#eaeaea] text-[9px] font-mono text-gray-500"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {/* Last check in info */}
                <div className="text-[10px] text-gray-500 leading-tight">
                  <p className="font-bold text-gray-400 uppercase text-[9px] tracking-wider mb-0.5">Last Hub checked-in</p>
                  <p className="truncate text-gray-600 font-medium">
                    {member.checkInHistory.length > 0
                      ? member.checkInHistory[0].location
                      : "No record"}
                  </p>
                  <p className="text-[9px] text-gray-400 mt-0.5">
                    {member.checkInHistory.length > 0
                      ? new Date(member.checkInHistory[0].timestamp).toLocaleString()
                      : ""}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#eaeaea] flex items-center justify-between">
                  <div className="flex gap-2.5 text-[10px] font-semibold text-gray-400">
                    <a
                      href={`https://github.com/${member.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-black transition-colors"
                    >
                      GitHub
                    </a>
                    <a
                      href={`https://twitter.com/${member.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-black transition-colors"
                    >
                      X
                    </a>
                  </div>

                  <button
                    onClick={() => openGatewayForMember(member.id)}
                    className="px-3 py-1 rounded border border-[#eaeaea] hover:border-black bg-white text-[9px] font-bold text-[#111111] transition-all cursor-pointer"
                  >
                    Scan ID
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
