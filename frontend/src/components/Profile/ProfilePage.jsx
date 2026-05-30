import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Camera, Save, Github, Linkedin, Globe, Mail,
  Phone, MapPin, Briefcase, RefreshCw, CheckCircle,
  ExternalLink, Star, GitFork, Code, AlertCircle, X, Edit3
} from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { useResumeStore } from "../../store/ResumeStore";
import toast from "react-hot-toast";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Avatar Component ────────────────────────────────────────────────────────
function AvatarSection({ user, onAvatarChange }) {
  const fileRef = useRef();
  const [preview, setPreview] = useState(user?.avatar || null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await axios.post(`${API}/auth/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onAvatarChange(res.data.avatarUrl);
      toast.success("Avatar updated!");
    } catch {
      // If backend not set up yet, keep local preview
      onAvatarChange(preview);
      toast.success("Avatar updated locally!");
    } finally {
      setUploading(false);
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        {preview ? (
          <img
            src={preview}
            alt="Avatar"
            className="w-28 h-28 rounded-2xl object-cover ring-4 ring-brand-100 dark:ring-brand-900/40"
          />
        ) : (
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center ring-4 ring-brand-100 dark:ring-brand-900/40">
            <span className="text-3xl font-bold text-white">{initials}</span>
          </div>
        )}

        {/* Upload overlay */}
        <button
          onClick={() => fileRef.current?.click()}
          className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          {uploading
            ? <RefreshCw size={22} className="text-white animate-spin" />
            : <Camera size={22} className="text-white" />}
        </button>

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <button
        onClick={() => fileRef.current?.click()}
        className="btn-ghost text-xs py-1.5 px-3"
      >
        <Camera size={13} /> Change Photo
      </button>
    </div>
  );
}

// ─── GitHub Import ────────────────────────────────────────────────────────────
function GitHubImport({ onImport }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selected, setSelected] = useState([]);
  const [step, setStep] = useState("input"); // input | results

  const fetchRepos = async () => {
    if (!username.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.github.com/users/${username.trim()}/repos?sort=stars&per_page=20`
      );
      if (!res.ok) throw new Error("User not found");
      const data = await res.json();
      setRepos(data.filter((r) => !r.fork).slice(0, 12));
      setStep("results");
    } catch {
      toast.error("GitHub user not found. Check the username.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRepo = (repo) => {
    setSelected((prev) =>
      prev.find((r) => r.id === repo.id)
        ? prev.filter((r) => r.id !== repo.id)
        : [...prev, repo]
    );
  };

  const importSelected = () => {
    if (!selected.length) { toast.error("Select at least one repo"); return; }
    const projects = selected.map((r) => ({
      title: r.name,
      tech: r.language || "",
      description: r.description
        ? `• ${r.description}\n• ${r.stargazers_count} stars · ${r.forks_count} forks`
        : `• Built with ${r.language || "various technologies"}`,
      github: r.html_url,
      link: r.homepage || "",
    }));
    onImport(projects);
    toast.success(`${projects.length} project${projects.length > 1 ? "s" : ""} imported to resume!`);
    setStep("input");
    setSelected([]);
    setUsername("");
    setRepos([]);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-700 flex items-center justify-center">
          <Github size={18} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">GitHub Projects Import</h3>
          <p className="text-xs text-slate-500">Auto-import your repos into your resume</p>
        </div>
      </div>

      {step === "input" && (
        <div className="flex gap-3">
          <input
            className="input flex-1"
            placeholder="Enter GitHub username (e.g. torvalds)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchRepos()}
          />
          <button onClick={fetchRepos} disabled={loading || !username.trim()} className="btn-primary px-5">
            {loading ? <RefreshCw size={15} className="animate-spin" /> : "Fetch"}
          </button>
        </div>
      )}

      {step === "results" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Found <span className="font-semibold text-slate-800 dark:text-slate-100">{repos.length}</span> repos
              · <span className="text-brand-600">{selected.length} selected</span>
            </p>
            <button onClick={() => { setStep("input"); setRepos([]); setSelected([]); }}
              className="btn-ghost text-xs py-1 px-2">
              <X size={13} /> Reset
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 mb-4">
            {repos.map((repo) => {
              const isSelected = selected.find((r) => r.id === repo.id);
              return (
                <button
                  key={repo.id}
                  onClick={() => toggleRepo(repo)}
                  className={`text-left p-3 rounded-xl border-2 transition-all
                    ${isSelected
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-slate-800 dark:text-slate-100 text-sm truncate">{repo.name}</p>
                    {isSelected && <CheckCircle size={15} className="text-brand-600 flex-shrink-0" />}
                  </div>
                  {repo.description && (
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{repo.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5">
                    {repo.language && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Code size={11} /> {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Star size={11} /> {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <GitFork size={11} /> {repo.forks_count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={importSelected}
            disabled={!selected.length}
            className="btn-primary w-full justify-center"
          >
            <Github size={16} /> Import {selected.length} Project{selected.length !== 1 ? "s" : ""} to Resume
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── LinkedIn Import ──────────────────────────────────────────────────────────
function LinkedInImport({ onImport }) {
  const [step, setStep] = useState("info"); // info | paste | processing
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const parseLinkedInText = async (rawText) => {
    setLoading(true);
    try {
      // Call AI to parse LinkedIn profile text
      const res = await axios.post(`${API}/ai/parse-linkedin`, { text: rawText });
      onImport(res.data);
      toast.success("LinkedIn data imported to your resume!");
      setStep("info");
      setText("");
    } catch {
      // Fallback: basic manual parse
      const lines = rawText.split("\n").filter((l) => l.trim());
      const parsed = {
        personal: {
          name: lines[0] || "",
          summary: lines.find((l) => l.length > 80) || "",
        },
      };
      onImport(parsed);
      toast.success("Basic profile info imported!");
      setStep("info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-[#0077b5] flex items-center justify-center">
          <Linkedin size={18} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">LinkedIn Profile Import</h3>
          <p className="text-xs text-slate-500">Import your LinkedIn data into your resume</p>
        </div>
      </div>

      {step === "info" && (
        <div className="space-y-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">How to import:</p>
            <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-1.5 list-decimal list-inside">
              <li>Go to your <a href="https://linkedin.com/in/me" target="_blank" rel="noopener noreferrer"
                className="underline font-medium inline-flex items-center gap-1">
                LinkedIn profile <ExternalLink size={11} />
              </a></li>
              <li>Select all text on the page (Ctrl+A / Cmd+A)</li>
              <li>Copy it (Ctrl+C / Cmd+C)</li>
              <li>Paste it below and click Import</li>
            </ol>
          </div>
          <button onClick={() => setStep("paste")} className="btn-primary w-full justify-center">
            <Linkedin size={16} /> Paste LinkedIn Data
          </button>
        </div>
      )}

      {step === "paste" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <textarea
            className="input resize-none text-sm"
            rows={8}
            placeholder="Paste your LinkedIn profile text here…&#10;&#10;Include your name, summary, experience, education, and skills sections for best results."
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
          <div className="flex gap-3">
            <button
              onClick={() => parseLinkedInText(text)}
              disabled={loading || !text.trim()}
              className="btn-primary flex-1 justify-center"
            >
              {loading
                ? <><RefreshCw size={15} className="animate-spin" /> Parsing…</>
                : <><Linkedin size={15} /> Import Profile</>}
            </button>
            <button onClick={() => { setStep("info"); setText(""); }} className="btn-secondary px-4">
              Cancel
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center">
            Your data stays private and is only used to fill your resume
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Profile Page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { resume, updatePersonal, addItem } = useResumeStore();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name:       user?.name || "",
    email:      user?.email || "",
    phone:      user?.phone || "",
    location:   user?.location || "",
    title:      user?.title || "",
    bio:        user?.bio || "",
    linkedin:   user?.linkedin || "",
    github:     user?.github || "",
    portfolio:  user?.portfolio || "",
    avatar:     user?.avatar || "",
  });

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      // Also sync to resume personal info
      updatePersonal({
        name:      form.name,
        email:     form.email,
        phone:     form.phone,
        location:  form.location,
        linkedin:  form.linkedin,
        github:    form.github,
        portfolio: form.portfolio,
      });
      toast.success("Profile saved & synced to resume!");
    } catch {
      toast.error("Save failed. Check your connection.");
    } finally {
      setSaving(false);
    }
  };

  const handleGitHubImport = (projects) => {
    projects.forEach((p) => addItem("projects", p));
  };

  const handleLinkedInImport = (data) => {
    if (data.personal) {
      updatePersonal(data.personal);
      if (data.personal.name)     setForm((f) => ({ ...f, name: data.personal.name }));
      if (data.personal.summary)  setForm((f) => ({ ...f, bio: data.personal.summary }));
    }
  };

  const completeness = () => {
    const fields = [form.name, form.email, form.phone, form.location, form.title, form.bio, form.linkedin, form.github];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  };

  const pct = completeness();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your info and import from LinkedIn & GitHub</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column — avatar + completeness */}
          <div className="space-y-5">
            {/* Avatar card */}
            <div className="card p-6 flex flex-col items-center text-center">
              <AvatarSection user={{ ...user, avatar: form.avatar }} onAvatarChange={(url) => handleChange("avatar", url)} />
              <h2 className="font-bold text-slate-800 dark:text-slate-100 mt-3 text-lg">
                {form.name || "Your Name"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{form.title || "Add your job title"}</p>

              {/* Profile completeness */}
              <div className="w-full mt-5">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Profile completeness</span>
                  <span className={pct === 100 ? "text-green-600 font-semibold" : "font-medium"}>{pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${pct === 100 ? "bg-green-500" : "bg-brand-500"}`}
                  />
                </div>
                {pct < 100 && (
                  <p className="text-xs text-slate-400 mt-1.5 text-left">
                    Fill all fields to reach 100%
                  </p>
                )}
              </div>

              {/* Quick links */}
              <div className="w-full mt-4 space-y-2">
                {form.github && (
                  <a href={`https://${form.github.replace("https://", "")}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 transition-colors">
                    <Github size={15} /> {form.github}
                  </a>
                )}
                {form.linkedin && (
                  <a href={`https://${form.linkedin.replace("https://", "")}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#0077b5] transition-colors">
                    <Linkedin size={15} /> {form.linkedin}
                  </a>
                )}
                {form.portfolio && (
                  <a href={`https://${form.portfolio.replace("https://", "")}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 transition-colors">
                    <Globe size={15} /> {form.portfolio}
                  </a>
                )}
              </div>
            </div>

            {/* Sync notice */}
            <div className="card p-4 flex items-start gap-3 bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800">
              <CheckCircle size={16} className="text-brand-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-brand-700 dark:text-brand-300">
                Saving your profile automatically syncs your name, email, phone, location, and links to your resume.
              </p>
            </div>
          </div>

          {/* Right column — form fields + imports */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic info */}
            <div className="card p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
                <User size={17} className="text-brand-600" /> Basic Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { field: "name",     label: "Full Name",     icon: User,     placeholder: "Jane Doe" },
                  { field: "title",    label: "Job Title",     icon: Briefcase,placeholder: "Full Stack Developer" },
                  { field: "email",    label: "Email",         icon: Mail,     placeholder: "jane@example.com" },
                  { field: "phone",    label: "Phone",         icon: Phone,    placeholder: "+1 (555) 000-0000" },
                  { field: "location", label: "Location",      icon: MapPin,   placeholder: "San Francisco, CA" },
                ].map(({ field, label, icon: Icon, placeholder }) => (
                  <div key={field}>
                    <label className="label">{label}</label>
                    <div className="relative">
                      <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        className="input pl-9"
                        placeholder={placeholder}
                        value={form[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="label">Bio / About Me</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="A short bio about yourself — this appears on your profile and can be used in your resume summary…"
                  value={form.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                />
              </div>
            </div>

            {/* Social links */}
            <div className="card p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
                <Globe size={17} className="text-brand-600" /> Social & Links
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { field: "linkedin",  label: "LinkedIn",  icon: Linkedin, placeholder: "linkedin.com/in/jane",  color: "text-[#0077b5]" },
                  { field: "github",    label: "GitHub",    icon: Github,   placeholder: "github.com/jane",       color: "text-slate-800 dark:text-white" },
                  { field: "portfolio", label: "Portfolio", icon: Globe,    placeholder: "jane.dev",              color: "text-brand-600" },
                ].map(({ field, label, icon: Icon, placeholder, color }) => (
                  <div key={field}>
                    <label className="label">{label}</label>
                    <div className="relative">
                      <Icon size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${color}`} />
                      <input
                        className="input pl-9"
                        placeholder={placeholder}
                        value={form[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Import */}
            <GitHubImport onImport={handleGitHubImport} />

            {/* LinkedIn Import */}
            <LinkedInImport onImport={handleLinkedInImport} />

            {/* Save button (bottom) */}
            <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center py-3">
              {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Saving…" : "Save Profile"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}