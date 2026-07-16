"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pat, setPat] = useState("");
  const [repo, setRepo] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  
  // Data State
  const [activeFile, setActiveFile] = useState<string>("events.json");
  const [events, setEvents] = useState<Event[]>([]);
  const [rawJsonText, setRawJsonText] = useState("");
  const [isEditingRaw, setIsEditingRaw] = useState(false);
  
  // CRUD states for Events Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState<Partial<Event>>({
    id: "",
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    lumaLink: "",
    type: "upcoming",
    image: "/assets/docs_info.jpg",
    attendeesCount: 0,
    capacity: 100,
    sponsors: [],
    speakers: []
  });

  const [saveStatus, setSaveStatus] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
  }>({ loading: false });

  // Load stored auth details
  useEffect(() => {
    const storedPat = localStorage.getItem("layerz_admin_pat");
    const storedRepo = localStorage.getItem("layerz_admin_repo");
    if (storedPat && storedRepo) {
      setPat(storedPat);
      setRepo(storedRepo);
      // Auto authenticate
      verifyAuth(storedPat, storedRepo);
    }
  }, []);

  const verifyAuth = async (token: string, repository: string) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pat: token, repo: repository })
      });

      const data = await res.json();
      if (res.status === 200 && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("layerz_admin_pat", token);
        localStorage.setItem("layerz_admin_repo", repository);
        loadFileData(activeFile, token, repository);
      } else {
        setAuthError(data.error || "Authentication failed.");
      }
    } catch (err) {
      setAuthError("Failed to connect to authentication API.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyAuth(pat, repo);
  };

  const handleLogout = () => {
    localStorage.removeItem("layerz_admin_pat");
    localStorage.removeItem("layerz_admin_repo");
    setIsAuthenticated(false);
    setPat("");
    setRepo("");
  };

  const loadFileData = async (fileName: string, token = pat, repository = repo) => {
    setSaveStatus({ loading: true, message: `Loading ${fileName}...` });
    try {
      // Try to load raw contents from GitHub repo if available
      const url = `https://api.github.com/repos/${repository}/contents/src/data/${fileName}`;
      const res = await fetch(url, {
        headers: {
          "Authorization": `token ${token}`,
          "Accept": "application/vnd.github.v3.raw",
          "User-Agent": "Layerz-CMS"
        }
      });

      if (res.status === 200) {
        const text = await res.text();
        setRawJsonText(text);
        if (fileName === "events.json") {
          setEvents(JSON.parse(text));
        }
        setSaveStatus({ loading: false });
      } else {
        // Fetch from local API or fallback
        const localRes = await fetch(`/api/admin/save`); // simple check
        setSaveStatus({
          loading: false,
          error: true,
          message: `Could not retrieve file directly from GitHub. Check if file is in repo.`
        } as any);
      }
    } catch (err) {
      setSaveStatus({
        loading: false,
        error: true,
        message: "Failed to connect to GitHub to retrieve file."
      } as any);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadFileData(activeFile);
    }
  }, [activeFile, isAuthenticated]);

  const handleSaveToGitHub = async (fileContent: string) => {
    setSaveStatus({ loading: true, message: "Committing changes to GitHub..." });
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: `src/data/${activeFile}`,
          content: fileContent,
          commitMessage: `admin: update ${activeFile} data`,
          pat,
          repo
        })
      });

      const data = await res.json();
      if (res.status === 200 && data.success) {
        setSaveStatus({
          loading: false,
          success: true,
          message: data.message
        });
        // Reload data
        loadFileData(activeFile);
      } else {
        setSaveStatus({
          loading: false,
          success: false,
          message: data.error || "Save failed."
        });
      }
    } catch (err) {
      setSaveStatus({
        loading: false,
        success: false,
        message: "Connection failed. Check network."
      });
    }
  };

  // CRUD for Events
  const openAddEvent = () => {
    setEditingEvent(null);
    setEventForm({
      id: `event-${Date.now()}`,
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      time: "18:00 - 20:00",
      location: "Virtual",
      lumaLink: "",
      type: "upcoming",
      image: "/assets/docs_info.jpg",
      attendeesCount: 0,
      capacity: 100,
      sponsors: [],
      speakers: []
    });
    setIsFormOpen(true);
  };

  const openEditEvent = (ev: Event) => {
    setEditingEvent(ev);
    setEventForm({ ...ev });
    setIsFormOpen(true);
  };

  const handleEventFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedEvents = [...events];

    if (editingEvent) {
      // Edit mode
      updatedEvents = updatedEvents.map((item) => 
        item.id === editingEvent.id ? (eventForm as Event) : item
      );
    } else {
      // Create mode
      updatedEvents.push(eventForm as Event);
    }

    const contentStr = JSON.stringify(updatedEvents, null, 2);
    setEvents(updatedEvents);
    setRawJsonText(contentStr);
    setIsFormOpen(false);
    handleSaveToGitHub(contentStr);
  };

  const handleDeleteEvent = (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This action will write straight to GitHub.")) return;
    const updatedEvents = events.filter((item) => item.id !== id);
    const contentStr = JSON.stringify(updatedEvents, null, 2);
    setEvents(updatedEvents);
    setRawJsonText(contentStr);
    handleSaveToGitHub(contentStr);
  };

  // JSON Raw Editor Submit
  const handleRawJsonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // validate JSON structure
      const parsed = JSON.parse(rawJsonText);
      if (activeFile === "events.json") {
        setEvents(parsed);
      }
      setIsEditingRaw(false);
      handleSaveToGitHub(rawJsonText);
    } catch (err: any) {
      alert(`Invalid JSON structure: ${err.message}. Please fix before saving.`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative font-sans">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl border border-gray-200 shadow-xl relative z-10">
          <div className="text-center">
            <svg width="40" height="40" viewBox="0 0 34 34" fill="none" className="mx-auto">
              <path d="M17 31.5L4 25L17 18.5L30 25L17 31.5Z" fill="#89F336" opacity="0.85" />
              <path d="M4 25V28L17 34.5V31.5L4 25Z" fill="#73D41E" />
              <path d="M30 25V28L17 34.5V31.5L30 25Z" fill="#5CB015" />
              <path d="M17 21.5L4 15L17 8.5L30 15L17 21.5Z" fill="#8B88F8" opacity="0.85" />
              <path d="M4 15V18L17 24.5V21.5L4 15Z" fill="#726FE5" />
              <path d="M30 15V18L17 24.5V21.5L30 15Z" fill="#5956C8" />
              <path d="M17 11.5L4 5L17 -1.5L30 5L17 11.5Z" fill="#111111" />
            </svg>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
              Ecosystem Control
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Provide GitHub PAT authentication to authorize file changes.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="repo" className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                GitHub Repository
              </label>
              <input
                id="repo"
                name="repo"
                type="text"
                required
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                placeholder="e.g. krushn/layerz"
              />
            </div>

            <div>
              <label htmlFor="pat" className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Personal Access Token (PAT)
              </label>
              <input
                id="pat"
                name="pat"
                type="password"
                required
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              />
            </div>

            {authError && (
              <div className="text-red-500 text-xs font-semibold bg-red-50 p-3 rounded-lg border border-red-200">
                {authError}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 rounded-lg bg-black hover:bg-[#89F336] hover:text-black text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                {authLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    VERIFYING...
                  </>
                ) : (
                  "AUTHENTICATE CONTROL"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      {/* Admin Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg text-gray-900 tracking-tight">Layerz Control Panel</span>
          <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-[10px] font-mono text-gray-500">
            REPO: {repo}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-black">
            View Live Site
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main dashboard content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar file selector */}
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Ecosystem Files</h3>
            <ul className="space-y-1">
              {[
                "events.json",
                "blogs.json",
                "members.json",
                "programs.json",
                "studio.json",
                "partnerships.json",
                "resources.json",
                "roadmap.json"
              ].map((file) => (
                <li key={file}>
                  <button
                    onClick={() => {
                      setActiveFile(file);
                      setIsEditingRaw(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeFile === file
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-black"
                    }`}
                  >
                    {file}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-gray-100 text-xs text-gray-500">
            <p className="font-semibold text-gray-700 mb-1">How it works:</p>
            <p className="leading-relaxed">
              Edits made here are validated for schema correctness and pushed directly to your private GitHub repo as a new commit.
            </p>
          </div>
        </aside>

        {/* Editor Zone */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Header & statuses */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 capitalize">
                Managing {activeFile.replace(".json", "")}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Choose to edit either using the visual builder or the raw JSON schema.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {activeFile === "events.json" && (
                <button
                  onClick={() => setIsEditingRaw(!isEditingRaw)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  {isEditingRaw ? "Use GUI Form Builder" : "Edit Raw JSON File"}
                </button>
              )}
              {activeFile === "events.json" && !isEditingRaw && (
                <button
                  onClick={openAddEvent}
                  className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-[#89F336] hover:text-black transition-colors cursor-pointer"
                >
                  Add New Event
                </button>
              )}
            </div>
          </div>

          {/* Alert Status Banner */}
          {saveStatus.message && (
            <div className={`p-4 rounded-lg text-xs font-semibold mb-6 flex items-center gap-2 border ${
              saveStatus.loading
                ? "bg-blue-50 border-blue-200 text-blue-700 animate-pulse"
                : saveStatus.success
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {saveStatus.loading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {saveStatus.message}
            </div>
          )}

          {/* Form visual GUI for events */}
          {activeFile === "events.json" && !isEditingRaw ? (
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-500">No events found. Click "Add New Event" to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            ev.type === "upcoming" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                          }`}>
                            {ev.type}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">ID: {ev.id}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-base">{ev.title}</h4>
                        <p className="text-xs text-gray-500 font-mono">📅 {ev.date} ({ev.time}) | 📍 {ev.location}</p>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                          onClick={() => openEditEvent(ev)}
                          className="flex-1 md:flex-initial px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold hover:bg-gray-50 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="flex-1 md:flex-initial px-4 py-2 border border-red-200 hover:bg-red-50 text-red-500 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Raw JSON Editor (required for other non-events configuration files) */
            <form onSubmit={handleRawJsonSubmit} className="space-y-4">
              <div className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                💡 <strong>Raw Editing Mode:</strong> Editing this JSON will directly modify the data values. Please ensure you do not break the brackets <code>{"{ }"}</code> or brackets <code>[ ]</code> syntax.
              </div>

              <textarea
                value={rawJsonText}
                onChange={(e) => setRawJsonText(e.target.value)}
                className="w-full h-[550px] p-6 rounded-xl border border-gray-200 bg-gray-900 text-green-400 font-mono text-xs focus:outline-none focus:border-black"
                placeholder="Loading file raw JSON data..."
              />

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black hover:bg-[#89F336] hover:text-black text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Commit Raw Edits
                </button>
              </div>
            </form>
          )}

          {/* Form Modal for Add/Edit Event */}
          {isFormOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <h3 className="text-xl font-bold mb-6 text-gray-900">
                  {editingEvent ? "Edit Event Details" : "Create New Event Node"}
                </h3>

                <form onSubmit={handleEventFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Event ID (slug-like)
                      </label>
                      <input
                        type="text"
                        required
                        disabled={!!editingEvent}
                        value={eventForm.id}
                        onChange={(e) => setEventForm({ ...eventForm, id: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-black"
                        placeholder="event-hackathon-2026"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Status / Type
                      </label>
                      <select
                        value={eventForm.type}
                        onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-black"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Event Title
                    </label>
                    <input
                      type="text"
                      required
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none"
                      placeholder="e.g. AI Builder Cohort Demo Day"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      className="w-full h-24 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none"
                      placeholder="Detailed event summary..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Time range
                      </label>
                      <input
                        type="text"
                        required
                        value={eventForm.time}
                        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none"
                        placeholder="e.g. 18:00 - 21:00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Location / Venue
                      </label>
                      <input
                        type="text"
                        required
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none"
                        placeholder="e.g. Toronto Hub or Virtual"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Luma URL
                      </label>
                      <input
                        type="url"
                        required
                        value={eventForm.lumaLink}
                        onChange={(e) => setEventForm({ ...eventForm, lumaLink: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none"
                        placeholder="https://lu.ma/xxxxxx"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Registered Attendees
                      </label>
                      <input
                        type="number"
                        required
                        value={eventForm.attendeesCount}
                        onChange={(e) => setEventForm({ ...eventForm, attendeesCount: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Max Seating Capacity
                      </label>
                      <input
                        type="number"
                        required
                        value={eventForm.capacity}
                        onChange={(e) => setEventForm({ ...eventForm, capacity: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Speakers (comma separated)
                      </label>
                      <input
                        type="text"
                        value={eventForm.speakers?.join(", ") || ""}
                        onChange={(e) => setEventForm({ ...eventForm, speakers: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none"
                        placeholder="Sarah Chen, Marcus Aurel"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Sponsors (comma separated)
                      </label>
                      <input
                        type="text"
                        value={eventForm.sponsors?.join(", ") || ""}
                        onChange={(e) => setEventForm({ ...eventForm, sponsors: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none"
                        placeholder="ConsenSys, Polygon Labs"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-black hover:bg-[#89F336] hover:text-black text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      Push to GitHub
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
