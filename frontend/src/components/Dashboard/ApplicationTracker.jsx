import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Plus, Edit3, Trash2, Building2, Send,
  PhoneCall, Eye, Award, XCircle, Circle, ChevronDown, ChevronUp
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");
const authConfig = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const APP_STATUSES = [
  { id: "applied",   label: "Applied",   color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",     icon: Send },
  { id: "screening", label: "Screening", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: PhoneCall },
  { id: "interview", label: "Interview", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: Eye },
  { id: "offer",     label: "Offer",     color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",  icon: Award },
  { id: "rejected",  label: "Rejected",  color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",         icon: XCircle },
];

const EMPTY = { company: "", role: "", status: "applied", date: new Date().toISOString().split("T")[0], notes: "", jobUrl: "", salary: "" };

export default function ApplicationTracker() {
  const [apps, setApps]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(EMPTY);
  const [editId, setEditId]     = useState(null);
  const [filter, setFilter]     = useState("all");

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    try {
      const res = await axios.get(`${API}/applications`, authConfig());
      setApps(res.data.applications);
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.company.trim() || !form.role.trim()) { toast.error("Company and role are required"); return; }
    try {
      if (editId) {
        const res = await axios.put(`${API}/applications/${editId}`, form, authConfig());
        setApps(apps.map(a => a._id === editId ? res.data.application : a));
        toast.success("Updated!");
      } else {
        const res = await axios.post(`${API}/applications`, form, authConfig());
        setApps([res.data.application, ...apps]);
        toast.success("Application added!");
      }
      setForm(EMPTY); setShowForm(false); setEditId(null);
    } catch {
      toast.error("Failed to save. Try again.");
    }
  };

  const handleEdit = (app) => {
    setForm({ company: app.company, role: app.role, status: app.status, date: app.date?.split("T")[0] || "", notes: app.notes || "", jobUrl: app.jobUrl || "", salary: app.salary || "" });
    setEditId(app._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this application?")) return;
    try {
      await axios.delete(`${API}/applications/${id}`, authConfig());
      setApps(apps.filter(a => a._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered = filter === "all" ? apps : apps.filter(a => a.status === filter);
  const counts   = APP_STATUSES.reduce((acc, s) => { acc[s.id] = apps.filter(a => a.status === s.id).length; return acc; }, {});

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
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY); }} className="btn-primary text-sm py-2 px-4">
          <Plus size={15} /> Add
        </button>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter === "all" ? "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-800" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
          All ({apps.length})
        </button>
        {APP_STATUSES.map(s => (
          <button key={s.id} onClick={() => setFilter(s.id)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter === s.id ? s.color : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
            {s.label} ({counts[s.id] || 0})
          </button>
        ))}
      </div>

      {/* Add / Edit form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div><label className="label">Company *</label><input className="input" placeholder="Google" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} /></div>
                <div><label className="label">Role *</label><input className="input" placeholder="Software Engineer" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} /></div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {APP_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div><label className="label">Date Applied</label><input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
                <div><label className="label">Job URL</label><input className="input" placeholder="https://..." value={form.jobUrl} onChange={e => setForm(f => ({ ...f, jobUrl: e.target.value }))} /></div>
                <div><label className="label">Salary Range</label><input className="input" placeholder="$80k - $100k" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} /></div>
              </div>
              <div><label className="label">Notes</label><input className="input" placeholder="Any notes…" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
              <div className="flex gap-2">
                <button onClick={handleSubmit} className="btn-primary text-sm">{editId ? "Update" : "Add Application"}</button>
                <button onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY); }} className="btn-secondary text-sm">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
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
              <motion.div key={app._id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-colors group">
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
                  <button onClick={() => handleEdit(app)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"><Edit3 size={13} /></button>
                  <button onClick={() => handleDelete(app._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500"><Trash2 size={13} /></button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}