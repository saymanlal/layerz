"use client";

import { useState } from "react";
import Link from "next/link";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  lumaLink: string;
  type: string;
  image: string;
  attendeesCount: number;
  capacity: number;
  sponsors: string[];
  speakers: string[];
}

interface EventsPageClientProps {
  initialEvents: Event[];
}

export default function EventsPageClient({ initialEvents }: EventsPageClientProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past">("all");
  
  // RSVP State
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [ticketPass, setTicketPass] = useState<{
    ticketCode: string;
    qrSeed: string;
    eventName: string;
    attendeeName: string;
  } | null>(null);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setIsRegistering(true);

    setTimeout(() => {
      const ticketCode = `LMR-${Math.floor(1000 + Math.random() * 9000)}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;

      // Update attendee counts locally
      const updated = events.map((ev) => {
        if (ev.id === selectedEvent.id) {
          return {
            ...ev,
            attendeesCount: ev.attendeesCount + 1,
          };
        }
        return ev;
      });

      setEvents(updated);
      setTicketPass({
        ticketCode,
        qrSeed: Math.random().toString(36).substring(7),
        eventName: selectedEvent.title,
        attendeeName: name,
      });
      setIsRegistering(false);
    }, 1200);
  };

  const filteredEvents = events.filter((ev) => {
    if (activeTab === "all") return true;
    return ev.type === activeTab;
  });

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 h-[450px] w-full border-b border-[#eaeaea] bg-gradient-to-b from-white to-[#f5f5ff] overflow-hidden">
        <ThreeDBlockBg colorType="lavender" opacity={0.6} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
        {/* Header Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B88F8] bg-[#f0f0ff] border border-[#dad9fc] px-4 py-1.5 rounded-full inline-block">
            Ecosystem Events Nodes
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#111111] mt-6 mb-4">
            Ecosystem Events & Hackathons
          </h1>
          <p className="text-lg text-[#5C5C5C] leading-relaxed">
            Connect with the leading edge of technology. Join our university Chapters, Builder demo days, and AI & Blockchain hackathons.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg bg-[#fafafa] p-1 border border-[#eaeaea]">
            {(["all", "upcoming", "past"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setTicketPass(null);
                  setSelectedEvent(null);
                }}
                className={`px-6 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#111111] text-white shadow-sm"
                    : "text-[#5c5c5c] hover:text-[#111111]"
                }`}
              >
                {tab} Events
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid/List */}
        <div className="space-y-8 max-w-5xl mx-auto">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16 border border-[#eaeaea] rounded-2xl bg-[#fafafa]">
              <p className="text-sm text-[#5C5C5C]">No events found in this category.</p>
            </div>
          ) : (
            filteredEvents.map((ev) => {
              const isUpcoming = ev.type === "upcoming";
              const isFull = ev.attendeesCount >= ev.capacity;
              return (
                <div
                  key={ev.id}
                  className="premium-card p-6 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch"
                >
                  {/* Meta stats Column */}
                  <div className="flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#eaeaea] pb-6 lg:pb-0 lg:pr-8">
                    <div>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-2">
                        Schedule Node
                      </span>
                      <p className="text-2xl font-bold text-[#111111] tracking-tight">{ev.date}</p>
                      <p className="text-xs font-semibold text-[#8B88F8] font-mono mt-1">{ev.time}</p>
                    </div>
                    <div className="mt-6 lg:mt-0">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">
                        Registration Capacity
                      </span>
                      <div className="w-full bg-[#eaeaea] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#89F336] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (ev.attendeesCount / ev.capacity) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 mt-1">
                        <span>{ev.attendeesCount} Registered</span>
                        <span>{ev.capacity} Seats</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Column */}
                  <div className="lg:col-span-2 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            isUpcoming
                              ? "bg-[#e8fcd7] border border-[#d2f9af] text-[#2d5a08]"
                              : "bg-[#f5f5f5] border border-[#eaeaea] text-gray-500"
                          }`}
                        >
                          {ev.type}
                        </span>
                        <span className="text-xs font-medium text-[#5C5C5C] flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {ev.location}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#111111] leading-tight mb-2">
                        {ev.title}
                      </h3>
                      <p className="text-sm text-[#5C5C5C] leading-relaxed">
                        {ev.description}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-[#f5f5f5]">
                      {/* Speakers */}
                      {ev.speakers && ev.speakers.length > 0 && (
                        <div className="flex-1">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-0.5">
                            Panel Speakers
                          </span>
                          <p className="text-xs font-semibold text-[#111111]">{ev.speakers.join(", ")}</p>
                        </div>
                      )}

                      {/* Sponsors */}
                      {ev.sponsors && ev.sponsors.length > 0 && (
                        <div className="flex-1">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                            Sponsors & Partners
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {ev.sponsors.map((sp) => (
                              <span
                                key={sp}
                                className="px-2 py-0.5 rounded bg-[#f5f5f5] border border-[#eaeaea] text-[9px] font-mono text-[#5c5c5c]"
                              >
                                {sp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col justify-center gap-3">
                    {isUpcoming ? (
                      <>
                        <button
                          onClick={() => {
                            setSelectedEvent(ev);
                            setTicketPass(null);
                            setEmail("");
                            setName("");
                          }}
                          disabled={isFull}
                          className="w-full text-center py-3 rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-xs font-bold text-white uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {isFull ? "SEATS EXHAUSTED" : "REGISTER NOW"}
                        </button>
                        <a
                          href={ev.lumaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full text-center py-3 rounded-lg border border-[#111111] hover:bg-[#fafafa] text-xs font-bold text-[#111111] uppercase tracking-wider transition-all duration-200"
                        >
                          RSVP ON LUMA
                        </a>
                      </>
                    ) : (
                      <div className="text-center p-4 bg-[#fafafa] rounded-xl border border-[#eaeaea] text-xs text-gray-400 flex flex-col items-center">
                        <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        EVENT CONCLUDED
                        <span className="block text-[10px] text-[#8B88F8] font-semibold mt-1 cursor-pointer hover:underline">
                          Watch Recording →
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RSVP Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#eaeaea] shadow-2xl overflow-hidden p-8 animate-scale-up">
              {/* Close */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-[#111111] cursor-pointer transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {!ticketPass ? (
                <div>
                  <h3 className="text-2xl font-bold text-[#111111] tracking-tight mb-1">Ecosystem Register</h3>
                  <p className="text-xs font-semibold text-[#8B88F8] uppercase tracking-wider mb-6">
                    {selectedEvent.title}
                  </p>

                  <form onSubmit={handleRsvpSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#8B88F8] transition-colors"
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
                        className="w-full px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#8B88F8] transition-colors"
                        placeholder="jane@example.com"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isRegistering}
                      className="w-full text-center py-3.5 rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-xs font-bold text-white uppercase tracking-widest cursor-pointer transition-all duration-300 mt-4 flex items-center justify-center gap-2"
                    >
                      {isRegistering ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          GENERATING SECURE TICKET...
                        </>
                      ) : (
                        "CONFIRM REGISTRATION"
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-4">
                  {/* Ticket design */}
                  <div className="border border-dashed border-[#8B88F8]/50 bg-[#fafafa] rounded-xl p-6 mb-6 text-left relative overflow-hidden font-mono text-xs">
                    {/* ticket punches */}
                    <div className="absolute top-1/2 -left-3 -translate-y-1/2 h-6 w-6 bg-white border-r border-dashed border-[#8B88F8]/50 rounded-full"></div>
                    <div className="absolute top-1/2 -right-3 -translate-y-1/2 h-6 w-6 bg-white border-l border-dashed border-[#8B88F8]/50 rounded-full"></div>

                    <div className="flex justify-between items-center text-[9px] text-gray-400 mb-4 pb-2 border-b border-[#eaeaea]">
                      <span>LAYERZ PASS ENTRY NODE</span>
                      <span className="text-[#89F336] font-bold">APPROVED</span>
                    </div>

                    <h4 className="font-bold text-[#111111] uppercase truncate mb-1 text-sm">
                      {ticketPass.eventName}
                    </h4>
                    <p className="text-[10px] text-gray-500 mb-4">
                      Attendee: {ticketPass.attendeeName}
                    </p>

                    <div className="flex items-center justify-between gap-4 mt-6">
                      <div>
                        <span className="text-[9px] text-gray-400 block uppercase">Pass Code</span>
                        <span className="text-sm font-bold text-[#111111]">{ticketPass.ticketCode}</span>
                      </div>
                      {/* Generates CSS QR */}
                      <div className="w-12 h-12 bg-white p-1 border border-[#eaeaea] rounded flex flex-wrap gap-0.5 justify-center items-center">
                        {Array.from({ length: 36 }).map((_, i) => {
                          const isBlack = (i + ticketPass.qrSeed.charCodeAt(i % ticketPass.qrSeed.length)) % 2 === 0;
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

                  <p className="text-xs text-[#5C5C5C] mb-6">
                    A confirmation pass and check-in calendar invite have been logged. Present this verification code at the entry gate.
                  </p>

                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-6 py-2.5 rounded-lg bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#89F336] hover:text-[#111111] transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
