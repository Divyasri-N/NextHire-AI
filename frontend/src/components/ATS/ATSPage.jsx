import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Upload, Zap, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react";
import { useResumeStore } from "../../store/ResumeStore";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function ScoreRing({ score }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
        <circle cx="72" cy="72" r={r} fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100 dark:text-slate-700" />
        <circle cx="72" cy="72" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900 dark:text-white">{score}%</span>
        <span className="text-xs text-slate-500">ATS Score</span>
      </div>
    </div>
  );
}

export default function ATSPage() {
  const { resume, atsScore, setATSScore } = useResumeStore();
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const resumeText = [
    resume.personal.summary,
    ...resume.experience.map(e => `${e.role} ${e.company} ${e.description}`),
    ...resume.skills.technical || [],
    ...resume.skills.tools || [],
    ...resume.projects.map(p => `${p.title} ${p.tech} ${p.description}`),
  ].filter(Boolean).join(" ").toLowerCase();

  const analyzeATS = async () => {
    if (!resumeText.trim()) {
      toast.error("Please fill in your resume first in the Builder");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/ai/ats-score`, {
        resumeText,
        jobDescription: jobDescription || null,
      });
      setAnalysis(res.data);
      setATSScore(res.data.score);
    } catch {
      // Fallback local analysis
      const result = localATSAnalysis(resumeText, jobDescription);
      setAnalysis(result);
      setATSScore(result.score);
    } finally {
      setLoading(false);
    }
  };

  const localATSAnalysis = (resumeText, jd) => {
    const keywords = jd
      ? jd.toLowerCase().split(/\W+/).filter(w => w.length > 3)
      : ["react", "javascript", "node", "python", "sql", "api", "git", "agile", "leadership"];

    const matched = keywords.filter(k => resumeText.includes(k));
    const missing = keywords.filter(k => !resumeText.includes(k)).slice(0, 8);

    const checks = {
      hasEmail: resume.personal.email?.length > 0,
      hasPhone: resume.personal.phone?.length > 0,
      hasSummary: resume.personal.summary?.length > 50,
      hasExperience: resume.experience.length > 0,
      hasSkills: (resume.skills.technical?.length || 0) > 3,
      hasEducation: resume.education.length > 0,
      hasProjects: resume.projects.length > 0,
      goodLength: resumeText.length > 300,
    };

    const checkScore = Object.values(checks).filter(Boolean).length / Object.keys(checks).length * 30;
    const keywordScore = keywords.length ? (matched.length / keywords.length) * 70 : 50;
    const score = Math.min(99, Math.round(checkScore + keywordScore));

    return {
      score,
      matched: matched.slice(0, 15),
      missing,
      checks,
      suggestions: [
        !checks.hasSummary && "Add a professional summary (use AI to generate one)",
        !checks.hasProjects && "Add project descriptions with measurable impact",
        missing.length > 0 && `Add these missing keywords: ${missing.slice(0, 5).join(", ")}`,
        !checks.goodLength && "Expand your resume with more details",
      ].filter(Boolean),
    };
  };

  const scoreLabel = (s) => s >= 80 ? "Excellent" : s >= 65 ? "Good" : s >= 50 ? "Needs Work" : "Poor";
  const scoreColor = (s) => s >= 80 ? "text-green-600" : s >= 65 ? "text-amber-600" : "text-red-600";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
            <Target size={22} className="text-brand-600 dark:text-brand-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">ATS Score Analyzer</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 ml-13 mb-8">Check how well your resume passes applicant tracking systems</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Job Description (Optional)</h2>
            <p className="text-sm text-slate-500">Paste a job description for a targeted match score</p>
            <textarea
              className="input resize-none"
              rows={8}
              placeholder="Paste the job description here to get a targeted match score…&#10;&#10;E.g.: We are looking for a React Developer with 2+ years experience in Node.js, REST APIs, MongoDB…"
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
            />
            <button onClick={analyzeATS} disabled={loading} className="btn-primary w-full justify-center">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing…
                </>
              ) : (
                <><Zap size={16} /> Analyze My Resume</>
              )}
            </button>

            {!resumeText && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <AlertCircle size={15} className="text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-400">Build your resume first in the Builder tab, then come back to score it.</p>
              </div>
            )}
          </div>

          {/* Score */}
          <div className="card p-6">
            {analysis ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <ScoreRing score={analysis.score} />
                <p className={`text-center font-bold text-lg mt-3 ${scoreColor(analysis.score)}`}>
                  {scoreLabel(analysis.score)}
                </p>

                {/* Checks */}
                <div className="mt-6 space-y-2">
                  {Object.entries(analysis.checks || {}).map(([key, pass]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      {pass
                        ? <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                        : <XCircle size={15} className="text-red-400 flex-shrink-0" />}
                      <span className={pass ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}>
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Target size={40} className="text-slate-200 dark:text-slate-700 mb-3" />
                <p className="text-slate-400 text-sm">Run the analysis to see your ATS score</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed results */}
        <AnimatePresence>
          {analysis && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 grid md:grid-cols-3 gap-4">
              {/* Matched keywords */}
              {analysis.matched?.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" /> Matched Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matched.map(k => (
                      <span key={k} className="badge bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">{k}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing keywords */}
              {analysis.missing?.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <XCircle size={16} className="text-red-400" /> Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing.map(k => (
                      <span key={k} className="badge bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">{k}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {analysis.suggestions?.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <AlertCircle size={16} className="text-amber-500" /> Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-amber-500 flex-shrink-0">→</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}