import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Wand2, Code, Briefcase, GraduationCap, FileText, RefreshCw } from "lucide-react";
import { useResumeStore } from "../../store/ResumeStore";
import { callAI } from "../../utils/aiApi";
import toast from "react-hot-toast";

const AI_ACTIONS = {
  personal: [
    { icon: FileText, label: "Generate Summary", action: "summary", prompt: (r) =>
      `Write a professional resume summary (3-4 sentences) for: Name: ${r.personal.name}, Skills: ${r.skills.technical?.join(", ")}, Experience: ${r.experience.map(e => e.role + " at " + e.company).join(", ")}. Make it ATS-friendly and impactful.` },
  ],
  experience: [
    { icon: Briefcase, label: "Improve Description", action: "improve", prompt: (r) => {
      const last = r.experience[r.experience.length - 1];
      return `Rewrite this work experience description to be more impactful and ATS-friendly using strong action verbs and quantified achievements:\n\nRole: ${last?.role} at ${last?.company}\nCurrent description: ${last?.description || "(empty)"}\n\nReturn 3-5 bullet points starting with •`;
    }},
  ],
  projects: [
    { icon: Code, label: "Generate Description", action: "project_desc", prompt: (r) => {
      const last = r.projects[r.projects.length - 1];
      return `Write 3 professional resume bullet points (starting with •) for this project:\nTitle: ${last?.title}\nTech Stack: ${last?.tech}\n\nFocus on impact, scale, and technical achievements. Make it ATS-optimized.`;
    }},
  ],
  skills: [
    { icon: Wand2, label: "Suggest Skills", action: "skills", prompt: (r) =>
      `Based on these existing skills: ${r.skills.technical?.join(", ")}, suggest 10 complementary technical skills that would strengthen a resume. Return as a comma-separated list only, no explanation.` },
  ],
  education: [
    { icon: GraduationCap, label: "Enhance Activities", action: "activities", prompt: (r) => {
      const edu = r.education[0];
      return `Suggest 5 impressive academic activities and achievements to add for a ${edu?.degree} in ${edu?.field} student that would look great on a resume. Return as a short comma-separated list.`;
    }},
  ],
};

export default function AIPanel({ activeSection, onClose }) {
  const { resume, updatePersonal, updateItem, addItem } = useResumeStore();
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");

  const actions = AI_ACTIONS[activeSection] || [];

  const runAction = async (action) => {
    setActiveAction(action.action);
    setLoading(true);
    setResult("");
    try {
      const prompt = action.prompt(resume);
      const response = await callAI(prompt);
      setResult(response);
    } catch {
      toast.error("AI request failed. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const runCustom = async () => {
    if (!customPrompt.trim()) return;
    setActiveAction("custom");
    setLoading(true);
    setResult("");
    try {
      const response = await callAI(customPrompt);
      setResult(response);
    } catch {
      toast.error("AI request failed.");
    } finally {
      setLoading(false);
    }
  };

  const applySummary = () => {
    updatePersonal({ summary: result });
    toast.success("Summary applied!");
    setResult("");
  };

  return (
    <div className="card p-4 sticky top-24 flex flex-col gap-3" style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">AI Assistant</span>
        </div>
        <button onClick={onClose} className="btn-ghost p-1"><X size={14} /></button>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        AI-powered suggestions for the <span className="font-medium text-brand-600 dark:text-brand-400">{activeSection}</span> section
      </p>

      {/* Quick actions */}
      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.action}
            onClick={() => runAction(action)}
            disabled={loading}
            className="w-full flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:border-brand-300 dark:hover:border-brand-700 text-left transition-all disabled:opacity-50"
          >
            <action.icon size={15} className="text-brand-600 dark:text-brand-400 flex-shrink-0" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Custom prompt */}
      <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
        <label className="label text-xs">Custom Prompt</label>
        <textarea
          className="input text-xs resize-none mb-2"
          rows={3}
          placeholder="Ask AI anything about your resume…"
          value={customPrompt}
          onChange={e => setCustomPrompt(e.target.value)}
        />
        <button onClick={runCustom} disabled={loading || !customPrompt.trim()}
          className="btn-primary w-full justify-center text-xs py-2">
          <Sparkles size={13} /> Generate
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {(loading || result) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border border-brand-200 dark:border-brand-800 rounded-xl p-3 bg-brand-50 dark:bg-brand-900/20"
          >
            {loading ? (
              <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400">
                <RefreshCw size={13} className="animate-spin" />
                Generating…
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed mb-3">{result}</p>
                <div className="flex gap-2">
                  {activeSection === "personal" && (
                    <button onClick={applySummary} className="btn-primary text-xs py-1.5 px-3">
                      Apply to Summary
                    </button>
                  )}
                  <button
                    onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }}
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    Copy
                  </button>
                  <button onClick={() => setResult("")} className="btn-ghost text-xs py-1.5 px-3">
                    Clear
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}