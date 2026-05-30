import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart2, TrendingUp, FileText, Target, Clock, Award } from "lucide-react";
import { useResumeStore } from "@store/ResumeStore";
import { useAuth } from "@context/AuthContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { savedResumes } = useResumeStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 400);
  }, []);

  // Derive analytics from saved resumes
  const totalResumes = savedResumes.length;
  const scoredResumes = savedResumes.filter((r) => r.atsScore);
  const avgATS = scoredResumes.length
    ? Math.round(scoredResumes.reduce((a, r) => a + r.atsScore, 0) / scoredResumes.length)
    : 0;

  const stats = [
    { label: "Total Resumes", value: totalResumes, icon: FileText, color: "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400" },
    { label: "Avg ATS Score", value: avgATS ? `${avgATS}%` : "N/A", icon: Target, color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
    { label: "Days Active", value: user?.createdAt ? Math.max(1, Math.floor((Date.now() - new Date(user.createdAt)) / 86400000)) : 1, icon: Clock, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
    { label: "Sections Filled", value: "8/8", icon: Award, color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" },
  ];

  // Mock chart data (replace with real data from backend later)
  const atsHistory = scoredResumes.length
    ? scoredResumes.slice(-6).map((r, i) => ({
        name: `Resume ${i + 1}`,
        score: r.atsScore || 0,
      }))
    : [
        { name: "Week 1", score: 48 },
        { name: "Week 2", score: 55 },
        { name: "Week 3", score: 63 },
        { name: "Week 4", score: 71 },
        { name: "Week 5", score: 78 },
        { name: "Week 6", score: avgATS || 82 },
      ];

  const sectionData = [
    { name: "Personal", filled: 95 },
    { name: "Experience", filled: 88 },
    { name: "Education", filled: 92 },
    { name: "Skills", filled: 85 },
    { name: "Projects", filled: 78 },
    { name: "Certs", filled: 60 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
            <BarChart2 size={22} className="text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
            <p className="text-slate-500 dark:text-slate-400">Track your resume progress</p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card p-5 flex items-center gap-4"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* ATS Score trend */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={18} className="text-brand-600 dark:text-brand-400" />
              <h2 className="font-semibold text-slate-800 dark:text-slate-100">ATS Score Trend</h2>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={atsHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--tw-bg-opacity, #fff)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ fill: "#6366f1", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Section completeness */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <BarChart2 size={18} className="text-brand-600 dark:text-brand-400" />
              <h2 className="font-semibold text-slate-800 dark:text-slate-100">Section Completeness</h2>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sectionData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(v) => [`${v}%`, "Filled"]}
                />
                <Bar dataKey="filled" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 card p-6"
        >
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">💡 Quick Tips to Boost Your Score</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { tip: "Add measurable achievements", eg: "Increased revenue by 30%" },
              { tip: "Use action verbs", eg: "Led, Built, Optimized, Designed" },
              { tip: "Match job keywords", eg: "Use the ATS Analyzer tool" },
              { tip: "Keep formatting clean", eg: "No tables, no images in ATS resume" },
              { tip: "Quantify everything", eg: "Managed 5 developers, $2M budget" },
              { tip: "Tailor for each role", eg: "Edit your summary per application" },
            ].map(({ tip, eg }) => (
              <div key={tip} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{tip}</p>
                <p className="text-xs text-slate-400 mt-0.5">e.g. {eg}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}