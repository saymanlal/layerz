"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ThreeDBlockBg from "@/components/ThreeDBlockBg";

function ContactPageContent() {
  const searchParams = useSearchParams();
  const [reason, setReason] = useState("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam) {
      setReason("careers");
      setMsg(`Applying for position: ${roleParam}\n\nIntroduce yourself and attach resume/portfolio links here...`);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Simulate sending contact request
    setTimeout(() => {
      setLoading(false);
      setStatus({
        type: "success",
        text: "Thank you! Your message has been logged. Our ecosystem coordinators will follow up within 24 hours."
      });
      setName("");
      setEmail("");
      setOrg("");
      setMsg("");
    }, 1500);
  };

  const faqs = [
    { q: "How long does a Studio project scope take?", a: "We typically review and reply to initial discovery requests within 2 business days. Project scoping and kickoffs occur within 1-2 weeks." },
    { q: "Can university chapters receive funding?", a: "Yes, active Layerz chapters receive tool grants, speaker connections, and workshop budgets through the Layerz Foundation." },
    { q: "How are Labs research papers published?", a: "All publications are open-source. Researchers can coordinate draft submissions directly through our Contact gateway under General Enquiries." }
  ];

  return (
    <div className="relative min-h-screen bg-white text-[#111111] pb-24 overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 h-[400px] w-full border-b border-[#eaeaea] bg-gradient-to-b from-white to-[#f5f5ff] overflow-hidden">
        <ThreeDBlockBg colorType="lavender" opacity={0.4} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-32 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: FAQs and Info */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B88F8] bg-[#f0f0ff] border border-[#dad9fc] px-4 py-1.5 rounded-full inline-block mb-4">
              Get in Touch
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#111111] mb-4">
              Gateway to the Ecosystem
            </h1>
            <p className="text-sm text-[#5C5C5C] leading-relaxed">
              Have a project, sponsorship proposal, chapter inquiry, or career application? Submit the request below, and we'll route it to the appropriate Layer team.
            </p>
          </div>

          <div className="border-t border-[#eaeaea] pt-8 space-y-6">
            <h3 className="text-lg font-bold text-[#111111]">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[#111111]">{faq.q}</h4>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 bg-[#fafafa] border border-[#eaeaea] rounded-2xl p-8 shadow-sm">
          {status && (
            <div className={`p-4 rounded-lg text-xs font-semibold mb-6 border ${
              status.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {status.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Inquiry Focus
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#8B88F8] transition-colors"
              >
                <option value="general">General Enquiry</option>
                <option value="studio">Start a Studio Project</option>
                <option value="sponsor">Sponsor / Partnership</option>
                <option value="careers">Careers Application</option>
                <option value="chapters">Campus Chapter Request</option>
              </select>
            </div>

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
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Organization / Affiliation
              </label>
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#8B88F8] transition-colors"
                placeholder="e.g. Acme Corp or Stanford Chapter"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Description / Message
              </label>
              <textarea
                required
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full h-32 px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#8B88F8] transition-colors"
                placeholder="Details of your request..."
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
                  TRANSMITTING...
                </>
              ) : (
                "SUBMIT REQUEST"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white text-[#111111]">
        <p className="text-xs font-mono animate-pulse">LOADING CONTACT MODULE...</p>
      </div>
    }>
      <ContactPageContent />
    </Suspense>
  );
}
