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

interface Blog {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured: boolean;
  tags: string[];
}

interface Quarter {
  id: string;
  quarter: string;
  title: string;
  description: string;
  status: string;
  milestones: string[];
}

interface Program {
  id: string;
  title: string;
  tagline: string;
  description: string;
  status: string;
  duration: string;
  features: string[];
}

interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  category: string;
  challenge: string;
  solution: string;
  outcome: string;
  technologies: string[];
  image: string;
  featured: boolean;
}

interface Member {
  id: string;
  name: string;
  role: string;
  checkedIn: boolean;
}

interface Partner {
  id: string;
  name: string;
  website: string;
  type: string;
  featured: boolean;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  link: string;
  type: string;
}

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authWarning, setAuthWarning] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  
  // Data State
  const [activeFile, setActiveFile] = useState<string>("events.json");
  const [fileData, setFileData] = useState<any[]>([]);
  const [rawJsonText, setRawJsonText] = useState("");
  const [isEditingRaw, setIsEditingRaw] = useState(false);
  
  // Modal / Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  
  // Form State Union (stores current form draft)
  const [eventForm, setEventForm] = useState<Partial<Event>>({});
  const [blogForm, setBlogForm] = useState<Partial<Blog>>({});
  const [quarterForm, setQuarterForm] = useState<Partial<Quarter>>({});
  const [programForm, setProgramForm] = useState<Partial<Program>>({});
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});
  const [memberForm, setMemberForm] = useState<Partial<Member>>({});
  const [partnerForm, setPartnerForm] = useState<Partial<Partner>>({});
  const [resourceForm, setResourceForm] = useState<Partial<Resource>>({});

  const [saveStatus, setSaveStatus] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
  }>({ loading: false });

  // Load status of session
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/auth/status");
        if (res.status === 200) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            loadFileData(activeFile);
          }
        }
      } catch (err) {
        console.error("Session verification failed:", err);
      }
    }
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    setAuthWarning("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.status === 200 && data.success) {
        setIsAuthenticated(true);
        if (data.warning) {
          setAuthWarning(data.warning);
        }
        loadFileData(activeFile);
      } else {
        setAuthError(data.error || "Authentication failed.");
      }
    } catch (err) {
      setAuthError("Failed to connect to authentication API.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/status", { method: "DELETE" });
    } catch (err) {
      console.error("Logout request failed:", err);
    }
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setFileData([]);
    setRawJsonText("");
  };

  const loadFileData = async (fileName: string) => {
    setSaveStatus({ loading: true, message: `Retrieving ${fileName}...` });
    try {
      const repo = "saymanlal/layerz-data";
      // Fetch contents from GitHub (falls back to local in api if repo unconfigured)
      const res = await fetch(`/api/admin/save?file=${fileName}`); // Check if check route is present or fetch via proxy
      
      // Let's call Github API on the client side using a public fetch check,
      // but since GITHUB_PAT is stored on the server side, we should query our website's internal API!
      // Wait, let's create a server route or query our website to get the data,
      // actually, the website provides getEcosystemData on the server side. Let's make an API route to fetch data if needed,
      // or we can query GitHub directly if GITHUB_PAT is in the headers? GITHUB_PAT is secret, so we should query our API!
      // Wait! Do we have a API route to fetch?
      // Let's create an API route `/api/admin/data?file=...` that reads files using `getEcosystemData`!
      // Ah! We can easily make that endpoint! Let's check if there is an endpoint `/api/admin/data` first.
      // If we don't have it, we can create it, or fetch via a GET request to `/api/admin/save?file=...`?
      // Wait! Let's check if the GET method is supported in `save/route.ts`. In our saved save/route.ts, we only wrote POST!
      // Let's add GET support to `save/route.ts` or make `/api/admin/data/route.ts` so it fetches data from GitHub in real time!
      // Yes, let's modify `/api/admin/save/route.ts` to ALSO support GET!
      // Wait, we can implement GET in `/api/admin/save/route.ts` to return the file content.
      // Let's look at how the page currently gets data. It does a direct fetch to github contents API at:
      // `https://api.github.com/repos/${repository}/contents/src/data/${fileName}`
      // but that requires token on the client side!
      // If the token is on the server side, we can just do a GET request to our server which handles the GitHub fetching securely!
      // Yes! Let's make a GET endpoint in `/api/admin/save/route.ts` that fetches the file content using GITHUB_PAT on the server,
      // and returns it to the client! That prevents any rate-limit exhaustion and leaks of GITHUB_PAT.
      // Let's first look at the fetch logic we're writing here:
      const response = await fetch(`/api/admin/data?file=${fileName}`);
      if (response.status === 200) {
        const json = await response.json();
        setFileData(json);
        setRawJsonText(JSON.stringify(json, null, 2));
        setSaveStatus({ loading: false });
      } else {
        // Fallback: load local mock data if the API failed or is not ready yet
        const fallbackRes = await fetch(`/api/admin/data?file=${fileName}&local=true`);
        if (fallbackRes.status === 200) {
          const json = await fallbackRes.json();
          setFileData(json);
          setRawJsonText(JSON.stringify(json, null, 2));
          setSaveStatus({ loading: false });
        } else {
          setSaveStatus({
            loading: false,
            success: false,
            message: `Could not retrieve ${fileName}. Verify credentials on Server.`
          });
        }
      }
    } catch (err) {
      setSaveStatus({
        loading: false,
        success: false,
        message: "Failed to connect to data endpoint."
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadFileData(activeFile);
      setIsEditingRaw(false);
    }
  }, [activeFile, isAuthenticated]);

  const handleSaveToGitHub = async (fileContent: string) => {
    setSaveStatus({ loading: true, message: "Committing changes to GitHub..." });
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: activeFile,
          content: fileContent,
          commitMessage: `admin: update ${activeFile} data`
        })
      });

      const data = await res.json();
      if (res.status === 200 && data.success) {
        setSaveStatus({
          loading: false,
          success: true,
          message: data.message
        });
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

  // CRUD handlers
  const openAddForm = () => {
    setEditingItemIndex(null);
    const newId = `${activeFile.replace(".json", "")}-${Date.now()}`;
    
    // Set initial structural drafts
    if (activeFile === "events.json") {
      setEventForm({
        id: newId,
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        time: "18:00 - 20:00",
        location: "Virtual",
        lumaLink: "",
        type: "upcoming",
        image: "/logo-bg.jpg",
        attendeesCount: 0,
        capacity: 100,
        sponsors: [],
        speakers: []
      });
    } else if (activeFile === "blogs.json") {
      setBlogForm({
        id: newId,
        title: "",
        slug: "",
        summary: "",
        content: "",
        category: "Tech",
        author: "Admin",
        date: new Date().toISOString().split("T")[0],
        readTime: "5 min read",
        featured: false,
        tags: []
      });
    } else if (activeFile === "roadmap.json") {
      setQuarterForm({
        id: newId,
        quarter: "Q1 2026",
        title: "",
        description: "",
        status: "upcoming",
        milestones: []
      });
    } else if (activeFile === "programs.json") {
      setProgramForm({
        id: newId,
        title: "",
        tagline: "",
        description: "",
        status: "open",
        duration: "6 Weeks",
        features: []
      });
    } else if (activeFile === "studio.json") {
      setProjectForm({
        id: newId,
        title: "",
        client: "",
        description: "",
        category: "Design",
        challenge: "",
        solution: "",
        outcome: "",
        technologies: [],
        image: "/logo-bg.jpg",
        featured: false
      });
    } else if (activeFile === "members.json") {
      setMemberForm({
        id: newId,
        name: "",
        role: "",
        checkedIn: false
      });
    } else if (activeFile === "partnerships.json") {
      setPartnerForm({
        id: newId,
        name: "",
        website: "",
        type: "sponsor",
        featured: false
      });
    } else if (activeFile === "resources.json") {
      setResourceForm({
        id: newId,
        title: "",
        description: "",
        category: "Guide",
        link: "",
        type: "PDF"
      });
    }
    setIsFormOpen(true);
  };

  const openEditForm = (item: any, index: number) => {
    setEditingItemIndex(index);
    if (activeFile === "events.json") setEventForm({ ...item });
    else if (activeFile === "blogs.json") setBlogForm({ ...item });
    else if (activeFile === "roadmap.json") setQuarterForm({ ...item });
    else if (activeFile === "programs.json") setProgramForm({ ...item });
    else if (activeFile === "studio.json") setProjectForm({ ...item });
    else if (activeFile === "members.json") setMemberForm({ ...item });
    else if (activeFile === "partnerships.json") setPartnerForm({ ...item });
    else if (activeFile === "resources.json") setResourceForm({ ...item });
    setIsFormOpen(true);
  };

  const handleDeleteItem = (index: number) => {
    if (!confirm("Confirm deleting this record? Changes will sync directly to GitHub.")) return;
    const updatedData = [...fileData];
    updatedData.splice(index, 1);
    setFileData(updatedData);
    const contentStr = JSON.stringify(updatedData, null, 2);
    setRawJsonText(contentStr);
    handleSaveToGitHub(contentStr);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let draftItem: any;

    if (activeFile === "events.json") draftItem = eventForm;
    else if (activeFile === "blogs.json") draftItem = blogForm;
    else if (activeFile === "roadmap.json") draftItem = quarterForm;
    else if (activeFile === "programs.json") draftItem = programForm;
    else if (activeFile === "studio.json") draftItem = projectForm;
    else if (activeFile === "members.json") draftItem = memberForm;
    else if (activeFile === "partnerships.json") draftItem = partnerForm;
    else if (activeFile === "resources.json") draftItem = resourceForm;

    const updatedData = [...fileData];
    if (editingItemIndex !== null) {
      updatedData[editingItemIndex] = draftItem;
    } else {
      updatedData.push(draftItem);
    }

    setFileData(updatedData);
    const contentStr = JSON.stringify(updatedData, null, 2);
    setRawJsonText(contentStr);
    setIsFormOpen(false);
    handleSaveToGitHub(contentStr);
  };

  const handleRawJsonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(rawJsonText);
      setFileData(parsed);
      setIsEditingRaw(false);
      handleSaveToGitHub(rawJsonText);
    } catch (err: any) {
      alert(`Invalid JSON format: ${err.message}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative font-sans">
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/bg-3d.jpg')" }}></div>
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl border border-[#eaeaea] shadow-xl relative z-10">
          <div className="text-center">
            <img src="/logo-org.jpg" alt="Layerz Logo" className="mx-auto h-12 w-12 rounded-lg object-contain bg-white border border-[#eaeaea] mb-6" />
            <h2 className="text-3xl font-extrabold text-[#111111] tracking-tight">
              Ecosystem Control
            </h2>
            <p className="mt-2 text-sm text-[#5c5c5c]">
              Authenticate via access list to perform workspace changes.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#5c5c5c] mb-1">
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#111111] transition-colors"
                placeholder="admin@layerz.xyz"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#5c5c5c] mb-1">
                Access Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#eaeaea] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#111111] transition-colors"
                placeholder="password"
              />
            </div>

            {authError && (
              <div className="text-red-600 text-xs font-semibold bg-red-50 p-3 rounded-lg border border-red-200">
                {authError}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 rounded-lg bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-transparent hover:border-[#111111]"
              >
                {authLoading ? "VERIFYING..." : "ENTER WORKSPACE"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111111] font-sans flex flex-col relative">
      {/* Top Banner Alert if fallback */}
      {authWarning && (
        <div className="bg-[#dad9fc] text-[#2b296a] px-6 py-2.5 text-xs font-semibold text-center border-b border-[#aaa7f9] flex items-center justify-center gap-2">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{authWarning}</span>
        </div>
      )}

      {/* Admin Nav */}
      <nav className="bg-white border-b border-[#eaeaea] sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/logo-org.jpg" alt="Logo" className="h-8 w-8 object-contain rounded-md border border-[#eaeaea]" />
          <span className="font-bold text-lg text-[#111111] tracking-tight">Layerz Control Center</span>
          <span className="px-2 py-0.5 rounded bg-[#f5f5ff] border border-[#dad9fc] text-[9px] font-mono text-[#8B88F8]">
            DATA-STORE: saymanlal/layerz-data
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs font-semibold text-[#5c5c5c] hover:text-[#111111] transition-colors">
            View Live Site
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-red-600 hover:text-red-800 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main dashboard content */}
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-[#eaeaea] p-6 space-y-6">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#808080] mb-3">Ecosystem Schemas</h3>
            <ul className="space-y-1">
              {[
                { name: "events.json", label: "Events Manager" },
                { name: "blogs.json", label: "Publications Blog" },
                { name: "roadmap.json", label: "Interactive Roadmap" },
                { name: "programs.json", label: "Chapters & Cohorts" },
                { name: "studio.json", label: "Studio Portfolio" },
                { name: "partnerships.json", label: "Sponsors & Investors" },
                { name: "members.json", label: "Community Members" },
                { name: "resources.json", label: "Guides & Resources" }
              ].map((file) => (
                <li key={file.name}>
                  <button
                    onClick={() => {
                      setActiveFile(file.name);
                      setIsEditingRaw(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between border ${
                      activeFile === file.name
                        ? "bg-[#111111] text-white border-[#111111]"
                        : "text-[#5c5c5c] hover:bg-[#fafafa] hover:text-[#111111] border-transparent"
                    }`}
                  >
                    <span>{file.label}</span>
                    <span className="text-[9px] opacity-60 font-mono">{file.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-[#eaeaea] text-[10px] text-[#808080] leading-relaxed">
            <p className="font-bold text-[#111111] mb-1">Security & Updates:</p>
            <p>
              Commits are pushed directly to saymanlal/layerz-data. The live application automatically updates data within 15 seconds.
            </p>
          </div>
        </aside>

        {/* Editor Zone */}
        <main className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-[#eaeaea]">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#111111] capitalize">
                {activeFile.replace(".json", "")}
              </h1>
              <p className="text-xs text-[#5c5c5c] mt-1">
                Visual builders for structured data entry. Syncs directly to GitHub repo.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingRaw(!isEditingRaw)}
                className="px-4 py-2 border border-[#eaeaea] bg-white rounded-lg text-xs font-bold text-[#5c5c5c] hover:text-[#111111] hover:border-[#808080] transition-colors cursor-pointer"
              >
                {isEditingRaw ? "Use GUI Form Builder" : "Edit Raw JSON"}
              </button>
              {!isEditingRaw && (
                <button
                  onClick={openAddForm}
                  className="px-4 py-2 bg-[#111111] text-white rounded-lg text-xs font-bold hover:bg-[#89F336] hover:text-[#111111] transition-all cursor-pointer border border-[#111111]"
                >
                  Create Record
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
                <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {saveStatus.message}
            </div>
          )}

          {/* List display */}
          {!isEditingRaw ? (
            <div className="space-y-4">
              {fileData.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-[#eaeaea]">
                  <p className="text-xs text-[#808080]">No records found. Click "Create Record" to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {fileData.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-white p-6 rounded-xl border border-[#eaeaea] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#dad9fc] transition-colors"
                    >
                      <div className="space-y-1.5 flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#f5f5ff] border border-[#dad9fc] text-[9px] font-mono text-[#8B88F8] font-bold">
                            {item.category || item.quarter || item.role || item.type || "Record"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">ID: {item.id || idx}</span>
                          {item.featured && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-[8px] text-amber-600 font-bold uppercase">
                              Featured
                            </span>
                          )}
                          {item.checkedIn && (
                            <span className="px-1.5 py-0.5 rounded bg-green-50 border border-green-200 text-[8px] text-green-600 font-bold uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-[#111111] text-base">
                          {item.title || item.name || item.id}
                        </h4>
                        <p className="text-xs text-[#5c5c5c] line-clamp-2 leading-relaxed">
                          {item.description || item.summary || item.tagline || (item.website ? `Url: ${item.website}` : "")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                        <button
                          onClick={() => openEditForm(item, idx)}
                          className="flex-1 md:flex-initial px-4 py-2 border border-[#eaeaea] hover:border-[#111111] rounded-lg text-xs font-bold text-[#111111] bg-white transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(idx)}
                          className="flex-1 md:flex-initial px-4 py-2 border border-red-100 hover:bg-red-50 text-red-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
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
            /* Raw JSON Editor */
            <form onSubmit={handleRawJsonSubmit} className="space-y-4">
              <div className="text-xs text-[#2b296a] bg-[#f5f5ff] border border-[#dad9fc] p-4 rounded-lg">
                Raw JSON Editor: Be careful to keep the correct array structure and commas when editing directly.
              </div>

              <textarea
                value={rawJsonText}
                onChange={(e) => setRawJsonText(e.target.value)}
                className="w-full h-[550px] p-6 rounded-xl border border-[#eaeaea] bg-[#111111] text-[#89F336] font-mono text-xs focus:outline-none"
                placeholder="Loading raw JSON data..."
              />

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer border border-[#111111]"
                >
                  Commit Raw Edits
                </button>
              </div>
            </form>
          )}

          {/* Dialog Form Modal */}
          {isFormOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
              <div className="bg-white rounded-2xl border border-[#eaeaea] p-8 w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl relative">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <h3 className="text-xl font-bold mb-6 text-[#111111] tracking-tight">
                  {editingItemIndex !== null ? "Edit Item Record" : "Create Item Record"}
                </h3>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Visual Builder depending on file */}
                  {activeFile === "events.json" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Event ID</label>
                        <input type="text" required disabled={editingItemIndex !== null} value={eventForm.id || ""} onChange={(e) => setEventForm({ ...eventForm, id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Event Title</label>
                        <input type="text" required value={eventForm.title || ""} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Description</label>
                        <textarea required value={eventForm.description || ""} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="w-full h-20 px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Date</label>
                          <input type="date" required value={eventForm.date || ""} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Time Range</label>
                          <input type="text" required value={eventForm.time || ""} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" placeholder="e.g. 18:00 - 20:00" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Location</label>
                          <input type="text" required value={eventForm.location || ""} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Luma Link</label>
                          <input type="url" required value={eventForm.lumaLink || ""} onChange={(e) => setEventForm({ ...eventForm, lumaLink: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" placeholder="https://lu.ma/xxx" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Registered Count</label>
                          <input type="number" required value={eventForm.attendeesCount || 0} onChange={(e) => setEventForm({ ...eventForm, attendeesCount: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Capacity</label>
                          <input type="number" required value={eventForm.capacity || 100} onChange={(e) => setEventForm({ ...eventForm, capacity: parseInt(e.target.value) || 100 })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Speakers (comma sep)</label>
                          <input type="text" value={eventForm.speakers?.join(", ") || ""} onChange={(e) => setEventForm({ ...eventForm, speakers: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" placeholder="Sarah Chen, Marcus Aurel" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Sponsors (comma sep)</label>
                          <input type="text" value={eventForm.sponsors?.join(", ") || ""} onChange={(e) => setEventForm({ ...eventForm, sponsors: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" placeholder="Polygon, Arbitrum" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFile === "blogs.json" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Blog ID</label>
                        <input type="text" required disabled={editingItemIndex !== null} value={blogForm.id || ""} onChange={(e) => setBlogForm({ ...blogForm, id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Title</label>
                          <input type="text" required value={blogForm.title || ""} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Slug</label>
                          <input type="text" required value={blogForm.slug || ""} onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" placeholder="url-friendly-slug" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Summary</label>
                        <input type="text" required value={blogForm.summary || ""} onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Markdown Content</label>
                        <textarea required value={blogForm.content || ""} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} className="w-full h-32 px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Category</label>
                          <input type="text" required value={blogForm.category || ""} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Author</label>
                          <input type="text" required value={blogForm.author || ""} onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Read Time</label>
                          <input type="text" required value={blogForm.readTime || ""} onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" placeholder="5 min read" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Tags (comma sep)</label>
                          <input type="text" value={blogForm.tags?.join(", ") || ""} onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" placeholder="AI, Web3, design" />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                          <input type="checkbox" id="featuredBlog" checked={blogForm.featured || false} onChange={(e) => setBlogForm({ ...blogForm, featured: e.target.checked })} className="rounded text-[#8B88F8] focus:ring-[#8B88F8]" />
                          <label htmlFor="featuredBlog" className="text-xs font-bold uppercase text-[#5c5c5c]">Featured Post</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFile === "roadmap.json" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Milestone ID</label>
                        <input type="text" required disabled={editingItemIndex !== null} value={quarterForm.id || ""} onChange={(e) => setQuarterForm({ ...quarterForm, id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Quarter Name</label>
                          <input type="text" required value={quarterForm.quarter || ""} onChange={(e) => setQuarterForm({ ...quarterForm, quarter: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" placeholder="e.g. Q3 2026" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Status</label>
                          <select value={quarterForm.status || "upcoming"} onChange={(e) => setQuarterForm({ ...quarterForm, status: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none bg-white">
                            <option value="completed">Completed</option>
                            <option value="current">Current</option>
                            <option value="upcoming">Upcoming</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Title</label>
                        <input type="text" required value={quarterForm.title || ""} onChange={(e) => setQuarterForm({ ...quarterForm, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Description</label>
                        <textarea required value={quarterForm.description || ""} onChange={(e) => setQuarterForm({ ...quarterForm, description: e.target.value })} className="w-full h-20 px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Milestones Checklist (comma sep)</label>
                        <textarea value={quarterForm.milestones?.join(", ") || ""} onChange={(e) => setQuarterForm({ ...quarterForm, milestones: e.target.value.split(",").map(m => m.trim()).filter(Boolean) })} className="w-full h-16 px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" placeholder="Release UI Kit, Deploy landing gateway, Set up node" />
                      </div>
                    </div>
                  )}

                  {activeFile === "programs.json" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Program ID</label>
                        <input type="text" required disabled={editingItemIndex !== null} value={programForm.id || ""} onChange={(e) => setProgramForm({ ...programForm, id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Program Title</label>
                        <input type="text" required value={programForm.title || ""} onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Tagline</label>
                          <input type="text" required value={programForm.tagline || ""} onChange={(e) => setProgramForm({ ...programForm, tagline: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Duration</label>
                          <input type="text" required value={programForm.duration || ""} onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" placeholder="e.g. 6 Weeks" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Description</label>
                        <textarea required value={programForm.description || ""} onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })} className="w-full h-20 px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Key Features (comma sep)</label>
                        <textarea value={programForm.features?.join(", ") || ""} onChange={(e) => setProgramForm({ ...programForm, features: e.target.value.split(",").map(f => f.trim()).filter(Boolean) })} className="w-full h-16 px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" placeholder="Interactive lectures, Swag matching, demo days" />
                      </div>
                    </div>
                  )}

                  {activeFile === "studio.json" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Project ID</label>
                        <input type="text" required disabled={editingItemIndex !== null} value={projectForm.id || ""} onChange={(e) => setProjectForm({ ...projectForm, id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Project Title</label>
                          <input type="text" required value={projectForm.title || ""} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Client Name</label>
                          <input type="text" required value={projectForm.client || ""} onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Overview Description</label>
                        <textarea required value={projectForm.description || ""} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full h-16 px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Challenge</label>
                          <textarea required value={projectForm.challenge || ""} onChange={(e) => setProjectForm({ ...projectForm, challenge: e.target.value })} className="w-full h-16 px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Solution</label>
                          <textarea required value={projectForm.solution || ""} onChange={(e) => setProjectForm({ ...projectForm, solution: e.target.value })} className="w-full h-16 px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Outcome</label>
                          <input type="text" required value={projectForm.outcome || ""} onChange={(e) => setProjectForm({ ...projectForm, outcome: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Category</label>
                          <input type="text" required value={projectForm.category || ""} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" placeholder="AI Solutions, Web3, Branding" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Technologies (comma sep)</label>
                          <input type="text" value={projectForm.technologies?.join(", ") || ""} onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" placeholder="React, Solidity, WebGL" />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                          <input type="checkbox" id="featuredProject" checked={projectForm.featured || false} onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })} className="rounded text-[#8B88F8]" />
                          <label htmlFor="featuredProject" className="text-xs font-bold uppercase text-[#5c5c5c]">Featured Portfolio Case</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFile === "members.json" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Member ID</label>
                        <input type="text" required disabled={editingItemIndex !== null} value={memberForm.id || ""} onChange={(e) => setMemberForm({ ...memberForm, id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Member Name</label>
                          <input type="text" required value={memberForm.name || ""} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Role</label>
                          <input type="text" required value={memberForm.role || ""} onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-4">
                        <input type="checkbox" id="checkedIn" checked={memberForm.checkedIn || false} onChange={(e) => setMemberForm({ ...memberForm, checkedIn: e.target.checked })} className="rounded text-[#8B88F8]" />
                        <label htmlFor="checkedIn" className="text-xs font-bold uppercase text-[#5c5c5c]">Checked In Today</label>
                      </div>
                    </div>
                  )}

                  {activeFile === "partnerships.json" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Partner ID</label>
                        <input type="text" required disabled={editingItemIndex !== null} value={partnerForm.id || ""} onChange={(e) => setPartnerForm({ ...partnerForm, id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Partner Name</label>
                        <input type="text" required value={partnerForm.name || ""} onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Website URL</label>
                          <input type="url" required value={partnerForm.website || ""} onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" placeholder="https://..." />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Partner Type</label>
                          <select value={partnerForm.type || "sponsor"} onChange={(e) => setPartnerForm({ ...partnerForm, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none bg-white">
                            <option value="sponsor">Sponsor / Supporter</option>
                            <option value="community_partner">Community Partner</option>
                            <option value="investor">Past Sponsor / Investor</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-4">
                        <input type="checkbox" id="featuredPartner" checked={partnerForm.featured || false} onChange={(e) => setPartnerForm({ ...partnerForm, featured: e.target.checked })} className="rounded text-[#8B88F8]" />
                        <label htmlFor="featuredPartner" className="text-xs font-bold uppercase text-[#5c5c5c]">Featured / Show on Homepage</label>
                      </div>
                    </div>
                  )}

                  {activeFile === "resources.json" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Resource ID</label>
                        <input type="text" required disabled={editingItemIndex !== null} value={resourceForm.id || ""} onChange={(e) => setResourceForm({ ...resourceForm, id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Title</label>
                          <input type="text" required value={resourceForm.title || ""} onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Category</label>
                          <input type="text" required value={resourceForm.category || ""} onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" placeholder="Playbook, Guide, Audit Template" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Short Description</label>
                        <input type="text" required value={resourceForm.description || ""} onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">Resource URL</label>
                          <input type="url" required value={resourceForm.link || ""} onChange={(e) => setResourceForm({ ...resourceForm, link: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#5c5c5c] mb-1">File Type</label>
                          <input type="text" required value={resourceForm.type || ""} onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none" placeholder="PDF, Notion, GitHub" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 flex justify-end gap-2 border-t border-[#eaeaea] mt-6">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-4 py-2 border border-[#eaeaea] rounded-lg text-xs font-bold text-[#5c5c5c] hover:text-[#111111] hover:border-[#808080] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#111111] hover:bg-[#89F336] hover:text-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer border border-[#111111]"
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
  );
}

