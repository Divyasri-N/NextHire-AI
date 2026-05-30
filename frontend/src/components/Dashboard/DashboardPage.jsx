import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@context/AuthContext";
import { useResumeStore } from "@store/ResumeStore";
import { callAI } from "@utils/aiApi";
import {
  Plus, FileText, Target, Clock, Trash2, Edit3, BarChart2,
  Briefcase, CheckCircle, XCircle, Calendar, ChevronDown,
  ChevronUp, Sparkles, RefreshCw, TrendingUp, AlertCircle,
  BookOpen, Code, Building2, Send, Eye, PhoneCall, Award,
  Circle, Filter
} from "lucide-react";
import toast from "react-hot-toast";

// ── Application Tracker ───────────────────────────────────────────
const APP_STATUSES = [
  { id: "applied",      label: "Applied",      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",   icon: Send },
  { id: "screening",    label: "Screening",    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: PhoneCall },
  { id: "interview",    label: "Interview",    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: Eye },
  { id: "offer",        label: "Offer",        color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",  icon: Award },
  { id: "rejected",     label: "Rejected",     color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",        icon: XCircle },
];

const EMPTY_APP = { company: "", role: "", status: "applied", date: new Date().toISOString().split("T")[0], notes: "" };

function ApplicationTracker() {
  const [apps, setApps]         = useState(() => {
    try { return JSON.parse(localStorage.getItem("nh_applications") || "[]"); } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(EMPTY_APP);
  const [filter, setFilter]     = useState("all");
  const [editId, setEditId]     = useState(null);

  const save = (list) => { setApps(list); localStorage.setItem("nh_applications", JSON.stringify(list)); };

  const handleSubmit = () => {
    if (!form.company.trim() || !form.role.trim()) { toast.error("Company and role are required"); return; }
    if (editId) {
      save(apps.map(a => a.id === editId ? { ...form, id: editId } : a));
      toast.success("Application updated!");
      setEditId(null);
    } else {
      save([{ ...form, id: Date.now().toString() }, ...apps]);
      toast.success("Application added!");
    }
    setForm(EMPTY_APP);
    setShowForm(false);
  };

  const handleEdit = (app) => {
    setForm(app);
    setEditId(app.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    save(apps.filter(a => a.id !== id));
    toast.success("Removed");
  };

  const filtered = filter === "all" ? apps : apps.filter(a => a.status === filter);

  const counts = APP_STATUSES.reduce((acc, s) => {
    acc[s.id] = apps.filter(a => a.status === s.id).length;
    return acc;
  }, {});

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Briefcase size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Application Tracker</h2>
            <p className="text-xs text-slate-400">{apps.length} applications tracked</p>
          </div>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY_APP); }} className="btn-primary text-sm py-2 px-4">
          <Plus size={15} /> Add
        </button>
      </div>

      {/* Status summary */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter === "all" ? "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-800" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}
        >
          All ({apps.length})
        </button>
        {APP_STATUSES.map(s => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter === s.id ? s.color : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}
          >
            {s.label} ({counts[s.id] || 0})
          </button>
        ))}
      </div>

      {/* Add/Edit form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">Company *</label>
                  <input className="input" placeholder="Google" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Role *</label>
                  <input className="input" placeholder="Software Engineer" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {APP_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Date Applied</label>
                  <input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">Notes</label>
                <input className="input" placeholder="Any notes about this application…" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSubmit} className="btn-primary text-sm">{editId ? "Update" : "Add Application"}</button>
                <button onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_APP); }} className="btn-secondary text-sm">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Applications list */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <Briefcase size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">{filter === "all" ? "No applications yet. Start tracking!" : `No ${filter} applications`}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(app => {
            const status = APP_STATUSES.find(s => s.id === app.status);
            const StatusIcon = status?.icon || Circle;
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Building2 size={16} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 dark:text-slate-100 text-sm truncate">{app.role}</p>
                  <p className="text-xs text-slate-400 truncate">{app.company} · {new Date(app.date).toLocaleDateString()}</p>
                  {app.notes && <p className="text-xs text-slate-400 truncate mt-0.5">{app.notes}</p>}
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium flex-shrink-0 ${status?.color}`}>
                  <StatusIcon size={11} /> {status?.label}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(app)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600">
                    <Edit3 size={13} />
                  </button>
                  <button onClick={() => handleDelete(app.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500">
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Activity Timeline ─────────────────────────────────────────────
function ActivityTimeline({ resumes }) {
  const events = [
    ...resumes.map(r => ({
      type: "resume",
      label: `Resume updated`,
      detail: r.data?.personal?.name || "Untitled Resume",
      date: new Date(r.updatedAt),
      icon: FileText,
      color: "bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400",
    })),
    ...resumes.filter(r => r.atsScore).map(r => ({
      type: "ats",
      label: `ATS Score: ${r.atsScore}%`,
      detail: r.data?.personal?.name || "Untitled Resume",
      date: new Date(r.updatedAt),
      icon: Target,
      color: r.atsScore >= 80
        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    })),
  ]
    .sort((a, b) => b.date - a.date)
    .slice(0, 8);

  const fmt = (d) => {
    const diff = Math.floor((Date.now() - d) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7)  return `${diff} days ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
          <Clock size={18} className="text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 dark:text-slate-100">Activity Timeline</h2>
          <p className="text-xs text-slate-400">Your recent resume activity</p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <Clock size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">No activity yet. Create your first resume!</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-700" />
          <div className="space-y-4">
            {events.map((ev, i) => {
              const Icon = ev.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-4 pl-2"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${ev.color}`}>
                    <Icon size={12} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{ev.label}</p>
                    <p className="text-xs text-slate-400 truncate">{ev.detail}</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0 pt-0.5">{fmt(ev.date)}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Skill Gap Analyzer ────────────────────────────────────────────
function SkillGapAnalyzer() {
  const { resume } = useResumeStore();
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState(null);
  const [open, setOpen]             = useState(true);

  const currentSkills = [
    ...(resume.skills.technical || []),
    ...(resume.skills.tools || []),
    ...(resume.skills.soft || []),
  ];

  const analyze = async () => {
    if (!targetRole.trim()) { toast.error("Enter a target role"); return; }
    setLoading(true);
    try {
      const res = await callAI(
        `You are a career coach. Analyze the skill gap for this candidate.

Current Skills: ${currentSkills.join(", ") || "None listed"}
Target Role: ${targetRole}

Respond ONLY with valid JSON in this exact format:
{
  "matchScore": <number 0-100>,
  "strongSkills": ["skill1", "skill2"],
  "missingSkills": [{"skill": "skill name", "priority": "high|medium|low", "reason": "why it matters"}],
  "learningPath": ["step 1", "step 2", "step 3"],
  "summary": "2-sentence summary"
}`
      );
      const cleaned = res.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(cleaned));
    } catch {
      toast.error("Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = (p) =>
    p === "high"   ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
    p === "medium" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" :
                     "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <TrendingUp size={18} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Skill Gap Analyzer</h2>
            <p className="text-xs text-slate-400">See what skills you need for your target role</p>
          </div>
        </div>
        <button onClick={() => setOpen(o => !o)} className="text-slate-400 hover:text-slate-600 transition-colors">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="space-y-4">
              {/* Current skills preview */}
              {currentSkills.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Your current skills ({currentSkills.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSkills.slice(0, 10).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 text-xs">{s}</span>
                    ))}
                    {currentSkills.length > 10 && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs">+{currentSkills.length - 10} more</span>
                    )}
                  </div>
                </div>
              )}

              {/* Target role input */}
              <div className="flex gap-3">
                <input
                  className="input flex-1"
                  placeholder="Target role (e.g. Senior Frontend Engineer)"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && analyze()}
                />
                <button onClick={analyze} disabled={loading} className="btn-primary px-5">
                  {loading ? <RefreshCw size={15} className="animate-spin" /> : <><Sparkles size={15} /> Analyze</>}
                </button>
              </div>

              {/* Results */}
              {result && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

                  {/* Match score */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Skills Match</p>
                      <span className={`text-lg font-bold ${
                        result.matchScore >= 70 ? "text-green-600" :
                        result.matchScore >= 40 ? "text-yellow-600" : "text-red-600"
                      }`}>{result.matchScore}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.matchScore}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          result.matchScore >= 70 ? "bg-green-500" :
                          result.matchScore >= 40 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                      />
                    </div>
                    {result.summary && <p className="text-xs text-slate-500 mt-2">{result.summary}</p>}
                  </div>

                  {/* Strong skills */}
                  {result.strongSkills?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                        <CheckCircle size={12} /> Strong Skills You Already Have
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.strongSkills.map(s => (
                          <span key={s} className="px-2.5 py-1 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing skills */}
                  {result.missingSkills?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-red-500 dark:text-red-400 mb-2 flex items-center gap-1">
                        <AlertCircle size={12} /> Skills to Learn
                      </p>
                      <div className="space-y-2">
                        {result.missingSkills.map((s, i) => (
                          <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-bold flex-shrink-0 ${priorityColor(s.priority)}`}>
                              {s.priority}
                            </span>
                            <div>
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{s.skill}</p>
                              <p className="text-xs text-slate-400">{s.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Learning path */}
                  {result.learningPath?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mb-2 flex items-center gap-1">
                        <BookOpen size={12} /> Recommended Learning Path
                      </p>
                      <ol className="space-y-1.5">
                        {result.learningPath.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const { savedResumes, loadResumes, deleteResume, loadResume } = useResumeStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadResumes().finally(() => setLoading(false)); }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await deleteResume(id);
    toast.success("Resume deleted");
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const stats = [
    { label: "Resumes Created", value: savedResumes.length, icon: FileText, color: "brand" },
    {
      label: "Avg ATS Score",
      value: savedResumes.filter(r => r.atsScore).length
        ? Math.round(savedResumes.reduce((a, r) => a + (r.atsScore || 0), 0) / savedResumes.filter(r => r.atsScore).length) + "%"
        : "N/A",
      icon: Target,
      color: "green",
    },
    {
      label: "Applications",
      value: (() => { try { return JSON.parse(localStorage.getItem("nh_applications") || "[]").length; } catch { return 0; } })(),
      icon: Briefcase,
      color: "blue",
    },
    { label: "Last Active", value: "Today", icon: Clock, color: "orange" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {greeting()}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your resume workspace</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
              <Icon size={22} className="text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { to: "/builder",   label: "New Resume",     icon: Plus,      desc: "Start from scratch",        primary: true },
          { to: "/ats",       label: "ATS Analyzer",   icon: Target,    desc: "Score your resume" },
          { to: "/interview", label: "Interview Prep", icon: FileText,  desc: "AI-generated questions" },
          { to: "/analytics", label: "Analytics",      icon: BarChart2, desc: "View your stats" },
        ].map(({ to, label, icon: Icon, desc, primary }) => (
          <Link
            key={to}
            to={to}
            className={`p-5 rounded-2xl border flex items-start gap-4 hover:shadow-md transition-all group
              ${primary
                ? "bg-brand-600 border-brand-600 text-white"
                : "card hover:border-brand-300 dark:hover:border-brand-700"}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
              ${primary ? "bg-white/20" : "bg-brand-50 dark:bg-brand-900/30"}`}>
              <Icon size={20} className={primary ? "text-white" : "text-brand-600 dark:text-brand-400"} />
            </div>
            <div>
              <div className={`font-semibold ${primary ? "text-white" : "text-slate-800 dark:text-slate-100"}`}>{label}</div>
              <div className={`text-sm ${primary ? "text-white/70" : "text-slate-500 dark:text-slate-400"}`}>{desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Skill Gap Analyzer */}
      <div className="mb-6">
        <SkillGapAnalyzer />
      </div>

      {/* Two-column: Application Tracker + Activity Timeline */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <ApplicationTracker />
        <ActivityTimeline resumes={savedResumes} />
      </div>

      {/* Resumes list */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">My Resumes</h2>
          <Link to="/builder" className="btn-primary text-sm py-2 px-4">
            <Plus size={16} /> New
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : savedResumes.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-12 text-center">
            <FileText size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-600 dark:text-slate-400 mb-2">No resumes yet</h3>
            <p className="text-sm text-slate-400 mb-5">Create your first AI-powered resume</p>
            <Link to="/builder" className="btn-primary">
              <Plus size={16} /> Create Resume
            </Link>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedResumes.map((resume, i) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center">
                    <FileText size={18} className="text-brand-600 dark:text-brand-400" />
                  </div>
                  {resume.atsScore && (
                    <span className={`badge text-xs ${resume.atsScore >= 80
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                      ATS {resume.atsScore}%
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                  {resume.data?.personal?.name || "Untitled Resume"}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/builder/${resume._id}`}
                    onClick={() => loadResume(resume._id)}
                    className="btn-ghost text-xs py-1.5 px-3 flex-1 justify-center"
                  >
                    <Edit3 size={13} /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(resume._id, resume.data?.personal?.name)}
                    className="btn-ghost text-xs py-1.5 px-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}