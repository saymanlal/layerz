"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProceduralBg from "@/components/ProceduralBg";

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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Ticket Generator States
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpEmail, setRsvpEmail] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [ticketPass, setTicketPass] = useState<{
    ticketCode: string;
    qrSeed: string;
    eventName: string;
    attendeeName: string;
  } | null>(null);

  // Live countdown state for next event
  const [countdown, setCountdown] = useState({ hours: 14, minutes: 22, seconds: 58 });

  // Sync real-time updates directly from databases
  useEffect(() => {
    async function syncEvents() {
      try {
        const res = await fetch("/api/admin/data?file=events.json");
        if (res.ok) {
          setEvents(await res.json());
        }
      } catch (err) {
        console.error("Events sync failed:", err);
      }
    }
    syncEvents();
    const interval = setInterval(syncEvents, 6000);
    return () => clearInterval(interval);
  }, []);

  // Tick countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredEvents = events.filter((ev) => {
    if (activeTab === "all") return true;
    return ev.type === activeTab;
  });

  const upcomingEvents = events.filter((e) => e.type === "upcoming");
  const nextEvent = upcomingEvents[0] || events[0];

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setIsRegistering(true);

    setTimeout(() => {
      setTicketPass({
        ticketCode: `LYZ-TKT-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        qrSeed: Math.random().toString(36).substring(7),
        eventName: selectedEvent.title,
        attendeeName: rsvpName
      });
      setIsRegistering(false);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      
      {/* Dark Stage laser background for header */}
      <div className="relative h-[540px] w-full border-b border-gray-900 bg-[#111111] text-white overflow-hidden dark-theme">
        <ProceduralBg mode="stage" colorType="lavender" opacity={0.45} />
        
        <div className="max-w-6xl mx-auto px-4 pt-32 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full relative z-10">
          <div className="lg:col-span-8 text-left space-y-6">
            <span className="text-[10px] font-mono font-bold text-[#89F336] bg-[#89F336]/10 border border-[#89F336]/30 px-4 py-1.5 rounded-full inline-block">
              KEYNOTE STAGE COORDS
            </span>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-none">
              Layerz Staged <br />
              Chapters & Hackathons
            </h1>
            <p className="text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed">
              Connect with leading protocol designers. Register to attend university developer workshops, demo days, and open hackathons.
            </p>
          </div>

          {/* Keynote Staged Countdown details */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-6 font-mono text-xs">
            <div>
              <span className="text-[8px] text-gray-500 uppercase block mb-1">NEXT STAGE EVENT STARTS:</span>
              <p className="font-bold font-sans text-sm text-[#89F336] truncate">{nextEvent?.title || "Ecosystem Keynote"}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-xl font-black block text-white tabular-nums">{countdown.hours}</span>
                <span className="text-[8px] text-gray-500 uppercase">Hours</span>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-xl font-black block text-white tabular-nums">{countdown.minutes}</span>
                <span className="text-[8px] text-gray-500 uppercase">Mins</span>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-xl font-black block text-white tabular-nums">{countdown.seconds}</span>
                <span className="text-[8px] text-gray-500 uppercase">Secs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 relative z-10">
        
        {/* Navigation Selector Tabs */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex rounded-lg bg-[#fafafa] p-1 border border-gray-100 font-mono text-[9px] uppercase font-bold">
            {(["all", "upcoming", "past"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setTicketPass(null);
                  setSelectedEvent(null);
                }}
                className={`px-6 py-2.5 rounded-md cursor-pointer transition-all ${
                  activeTab === tab
                    ? "bg-[#111111] text-white shadow-sm"
                    : "text-gray-500 hover:text-[#111111]"
                }`}
              >
                {tab} Events
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Staged Layout */}
        <div className="space-y-12 max-w-5xl mx-auto mb-24">
          {filteredEvents.map((ev) => {
            const isFull = ev.attendeesCount >= ev.capacity;
            const isUpcoming = ev.type === "upcoming";

            return (
              <div key={ev.id} className="premium-card p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Visual date coordinate (Left) */}
                <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-8 flex flex-col justify-between">
                  <div>
                    <span className="text-[8px] font-mono text-gray-400 block mb-2 uppercase">STAGED DATE</span>
                    <h3 className="text-2xl font-black text-[#111111] tracking-tight">{ev.date}</h3>
                    <p className="text-[10px] font-mono font-bold text-[#8B88F8] mt-1">{ev.time}</p>
                  </div>

                  <div className="mt-6 lg:mt-0 space-y-1">
                    <span className="text-[8px] font-mono text-gray-400 block uppercase">GATE_CAPACITY</span>
                    <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                      <div 
                        className="h-full bg-[#89F336]" 
                        style={{ width: `${(ev.attendeesCount / ev.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between font-mono text-[9px] text-gray-400">
                      <span>{ev.attendeesCount} IN</span>
                      <span>{ev.capacity} SEATS</span>
                    </div>
                  </div>
                </div>

                {/* Event core narrative details (Center) */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${
                        isUpcoming ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-400"
                      }`}>
                        {ev.type}
                      </span>
                      <span className="text-[10px] text-gray-500 font-semibold">{ev.location}</span>
                    </div>

                    <h4 className="text-xl font-black text-[#111111] leading-tight mb-2">{ev.title}</h4>
                    <p className="text-xs text-[#5C5C5C] leading-relaxed">{ev.description}</p>
                  </div>

                  {/* Panel speakers & sponsors */}
                  <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4 text-[10px]">
                    {ev.speakers && ev.speakers.length > 0 && (
                      <div>
                        <span className="text-[8px] font-mono text-gray-400 block mb-1 uppercase">SPEAKERS</span>
                        <p className="font-bold text-[#111111]">{ev.speakers.join(", ")}</p>
                      </div>
                    )}
                    {ev.sponsors && ev.sponsors.length > 0 && (
                      <div>
                        <span className="text-[8px] font-mono text-gray-400 block mb-1.5 uppercase">SPONSORS</span>
                        <div className="flex flex-wrap gap-1">
                          {ev.sponsors.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded border border-gray-100 bg-gray-50 text-[8px] font-mono text-gray-500">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Staged Register triggers (Right) */}
                <div className="lg:col-span-3 flex flex-col justify-center gap-3 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
                  {isUpcoming ? (
                    <>
                      <button
                        onClick={() => {
                          setSelectedEvent(ev);
                          setTicketPass(null);
                          setRsvpName("");
                          setRsvpEmail("");
                        }}
                        disabled={isFull}
                        className="w-full py-3 bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                      >
                        {isFull ? "SEATS EXHAUSTED" : "REGISTER ENTRY"}
                      </button>
                      <a
                        href={ev.lumaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center py-3 border border-black hover:bg-gray-50 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                      >
                        RSVP ON LUMA
                      </a>
                    </>
                  ) : (
                    <div className="text-center p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-400 flex flex-col items-center">
                      <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      EVENT CONCLUDED
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* REGISTRATION TICKET MODAL */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-2xl p-8 overflow-hidden animate-scale-up">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {!ticketPass ? (
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-[#111111] mb-1">Ecosystem Entrance Pass</h3>
                  <p className="text-xs text-[#8B88F8] font-bold font-mono uppercase tracking-wider mb-6">
                    {selectedEvent.title}
                  </p>

                  <form onSubmit={handleRsvpSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 font-mono">Full Name</label>
                      <input 
                        type="text" required value={rsvpName} onChange={(e) => setRsvpName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-white text-[#111111] text-xs focus:outline-none"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 font-mono">Email Address</label>
                      <input 
                        type="email" required value={rsvpEmail} onChange={(e) => setRsvpEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-white text-[#111111] text-xs focus:outline-none"
                        placeholder="jane@example.com"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isRegistering}
                      className="w-full text-center py-3.5 bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors font-mono cursor-pointer"
                    >
                      {isRegistering ? "TRANSMITTING..." : "GENERATE ENTRANCE TICKET"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-4">
                  {/* Visual Pass Ticket Card */}
                  <div className="border border-dashed border-[#8B88F8]/50 bg-gray-50/50 rounded-xl p-6 text-left relative overflow-hidden font-mono text-[10px]">
                    <div className="absolute top-1/2 -left-3 -translate-y-1/2 h-5 w-5 bg-white border-r border-dashed border-[#8B88F8]/50 rounded-full"></div>
                    <div className="absolute top-1/2 -right-3 -translate-y-1/2 h-5 w-5 bg-white border-l border-dashed border-[#8B88F8]/50 rounded-full"></div>

                    <div className="flex justify-between items-center text-[8px] text-gray-400 mb-4 pb-2 border-b border-gray-100">
                      <span>LAYERZ PASS ENTRY NODE</span>
                      <span className="text-[#89F336] font-bold">APPROVED</span>
                    </div>

                    <h4 className="font-bold text-sm text-[#111111] uppercase truncate mb-1">{ticketPass.eventName}</h4>
                    <p className="text-gray-400 mb-4">Attendee: {ticketPass.attendeeName}</p>

                    <div className="flex items-center justify-between gap-4 mt-6">
                      <div>
                        <span className="text-[8px] text-gray-400 block uppercase">Pass Code</span>
                        <span className="text-xs font-bold text-[#111111]">{ticketPass.ticketCode}</span>
                      </div>
                      <div className="w-10 h-10 bg-white p-1 border border-gray-100 rounded flex flex-wrap gap-0.5 justify-center items-center">
                        {Array.from({ length: 25 }).map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`w-[6px] h-[6px] ${(idx + ticketPass.qrSeed.charCodeAt(idx % ticketPass.qrSeed.length)) % 2 === 0 ? 'bg-black' : 'bg-transparent'}`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 my-6">
                    A confirmation pass has been logged. Present this verification code at the entry gate.
                  </p>

                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="w-full py-3 bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-white text-xs font-bold uppercase rounded-lg transition-colors font-mono cursor-pointer"
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
