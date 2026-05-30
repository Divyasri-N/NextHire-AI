import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Zap, Target, Download, Star, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  { icon: Zap, title: "AI Resume Writer", desc: "Generate professional summaries, bullet points, and skill sets in seconds using GPT-4." },
  { icon: Target, title: "ATS Optimizer", desc: "Analyze your resume against job descriptions. Get a match score and keyword suggestions." },
  { icon: Download, title: "One-Click PDF", desc: "Export pixel-perfect PDFs with 5 professional templates optimized for recruiters." },
  { icon: Star, title: "Interview Prep", desc: "AI generates role-specific technical and HR questions based on your resume." },
];

const stats = [
  { value: "50K+", label: "Resumes Created" },
  { value: "93%", label: "Interview Rate" },
  { value: "4.9★", label: "User Rating" },
  { value: "5 min", label: "Avg. Build Time" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            <span className="text-brand-600">NextHire</span>
            <span className="text-slate-900 dark:text-white">AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Sign in</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started Free</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/60 dark:from-brand-950/20 to-transparent" />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-medium border border-brand-200 dark:border-brand-800 mb-6">
            <Zap size={14} /> Powered by GPT-4
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            Land your dream job<br />
            <span className="text-brand-600 dark:text-brand-400">10x faster</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered resume builder that writes, optimizes, and scores your resume for ATS systems. Built by engineers, for engineers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base py-3 px-8">
              Build my resume <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary text-base py-3 px-8">
              Sign in
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-20"
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">{value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Everything you need</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">From writing to landing the interview</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="card p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Ready to get hired?</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">Join thousands of job seekers who built winning resumes with NextHire AI.</p>
          <Link to="/register" className="btn-primary text-base py-3 px-10">
            Start for free <ArrowRight size={18} />
          </Link>
          <p className="text-sm text-slate-400 mt-4">No credit card required · Free forever plan</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 px-6 text-center text-sm text-slate-400">
        <p>© {new Date().getFullYear()} NextHire AI. Built with ❤️ for job seekers.</p>
      </footer>
    </div>
  );
}