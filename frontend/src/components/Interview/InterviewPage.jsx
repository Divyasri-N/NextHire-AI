import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Sparkles, ChevronDown, ChevronUp, RefreshCw,
  Timer, Mic, MicOff, Play, Square, Star, CheckCircle,
  AlertCircle, Clock, Award, RotateCcw, StopCircle
} from "lucide-react";
import { useResumeStore } from "../../store/ResumeStore";
import { callAI } from "../../utils/aiApi";
import toast from "react-hot-toast";

const CATEGORIES = [
  { id: "technical",   label: "Technical",      count: 8, color: "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300" },
  { id: "hr",          label: "HR & Behavioral", count: 5, color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" },
  { id: "project",     label: "Project-Based",   count: 3, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" },
  { id: "situational", label: "Situational",     count: 3, color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400" },
];

// ── Interview Timer ───────────────────────────────────────────────
function InterviewTimer({ isRunning, onToggle, onReset }) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleReset = () => { setSeconds(0); onReset(); };

  const fmt = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const color = seconds > 120 ? "text-red-500" : seconds > 60 ? "text-orange-500" : "text-brand-600 dark:text-brand-400";

  return (
    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-700">
      <Clock size={16} className={color} />
      <span className={`font-mono text-lg font-bold ${color}`}>{fmt(seconds)}</span>
      <div className="flex gap-1.5">
        <button
          onClick={onToggle}
          className={`p-1.5 rounded-lg transition-colors ${isRunning
            ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
            : "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"}`}
        >
          {isRunning ? <Square size={13} /> : <Play size={13} />}
        </button>
        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          <RotateCcw size={13} />
        </button>
      </div>
    </div>
  );
}

// ── Score Badge ───────────────────────────────────────────────────
function ScoreBadge({ score }) {
  const color =
    score >= 8 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800" :
    score >= 5 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" :
                 "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold border ${color}`}>
      <Star size={13} /> {score}/10
    </span>
  );
}

// ── Question Card ─────────────────────────────────────────────────
function QuestionCard({ q, index }) {
  const [open, setOpen]           = useState(false);
  const [thinking, setThinking]   = useState(false);
  const [answer, setAnswer]       = useState("");
  const [timerRunning, setTimerRunning] = useState(false);
  const [userAnswer, setUserAnswer]     = useState("");
  const [recording, setRecording]       = useState(false);
  const [transcript, setTranscript]     = useState("");
  const [score, setScore]               = useState(null);
  const [scoring, setScoring]           = useState(false);
  const [feedback, setFeedback]         = useState("");
  const [mode, setMode]                 = useState("view"); // view | practice
  const recognitionRef = useRef(null);

  // ── AI sample answer ────────────────────────────────────────────
  const generateAnswer = async () => {
    setThinking(true);
    setOpen(true);
    try {
      const res = await callAI(
        `Give a concise, impressive answer for this interview question: "${q.question}"\nFormat: 2-3 sentences using the STAR method where applicable.`
      );
      setAnswer(res);
    } catch {
      setAnswer("Unable to generate answer. Check your connection.");
    } finally {
      setThinking(false);
    }
  };

  // ── Voice recording ─────────────────────────────────────────────
  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser. Use Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join(" ");
      setTranscript(t);
      setUserAnswer(t);
    };
    recognition.onerror = () => { toast.error("Microphone error. Check permissions."); setRecording(false); };
    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
    setTimerRunning(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
    setTimerRunning(false);
  };

  // ── AI scoring ──────────────────────────────────────────────────
  const scoreAnswer = async () => {
    if (!userAnswer.trim()) { toast.error("Type or record your answer first"); return; }
    setScoring(true);
    try {
      const res = await callAI(
        `You are an interview coach. Score this interview answer and give feedback.

Question: "${q.question}"
Candidate's Answer: "${userAnswer}"

Respond ONLY with valid JSON in this exact format:
{
  "score": <number 1-10>,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "idealAnswer": "A brief ideal answer in 2-3 sentences"
}`
      );
      const cleaned = res.replace(/\`\`\`json|\`\`\`/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setScore(parsed.score);
      setFeedback(parsed);
    } catch {
      toast.error("Scoring failed. Try again.");
    } finally {
      setScoring(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="card overflow-hidden"
    >
      {/* Question header */}
      <div className="p-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 flex-1">{q.question}</p>
          <div className="flex items-center gap-2 flex-shrink-0">
            {score !== null && <ScoreBadge score={score} />}
            <button
              onClick={e => { e.stopPropagation(); generateAnswer(); }}
              className="badge bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 hover:bg-brand-200 transition-colors cursor-pointer"
            >
              <Sparkles size={11} /> AI Answer
            </button>
            <button
              onClick={e => { e.stopPropagation(); setMode(mode === "practice" ? "view" : "practice"); setOpen(true); }}
              className="badge bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 transition-colors cursor-pointer"
            >
              <Mic size={11} /> Practice
            </button>
            {open ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-700 pt-3 space-y-4">

              {/* AI sample answer */}
              {(thinking || answer) && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">AI Sample Answer</p>
                  {thinking ? (
                    <div className="flex items-center gap-2 text-sm text-brand-500">
                      <RefreshCw size={13} className="animate-spin" /> Generating answer…
                    </div>
                  ) : (
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                      {answer}
                    </div>
                  )}
                </div>
              )}

              {/* Practice mode */}
              {mode === "practice" && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Your Answer</p>
                    <InterviewTimer
                      isRunning={timerRunning}
                      onToggle={() => setTimerRunning(t => !t)}
                      onReset={() => setTimerRunning(false)}
                    />
                  </div>

                  {/* Voice recording */}
                  <div className="flex gap-2">
                    <button
                      onClick={recording ? stopRecording : startRecording}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        recording
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {recording ? <><MicOff size={14} /> Stop Recording</> : <><Mic size={14} /> Record Answer</>}
                    </button>
                    {recording && (
                      <span className="flex items-center gap-1.5 text-xs text-red-500">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" /> Listening…
                      </span>
                    )}
                  </div>

                  {/* Text answer */}
                  <textarea
                    className="input resize-none text-sm"
                    rows={4}
                    placeholder="Type your answer here, or use the microphone to record it…"
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                  />

                  {/* Score button */}
                  <button
                    onClick={scoreAnswer}
                    disabled={scoring || !userAnswer.trim()}
                    className="btn-primary w-full justify-center"
                  >
                    {scoring
                      ? <><RefreshCw size={14} className="animate-spin" /> Scoring…</>
                      : <><Star size={14} /> Score My Answer with AI</>}
                  </button>

                  {/* Feedback */}
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 border-t border-slate-100 dark:border-slate-700 pt-3"
                    >
                      <div className="flex items-center gap-3">
                        <ScoreBadge score={feedback.score} />
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {feedback.score >= 8 ? "Excellent answer!" : feedback.score >= 5 ? "Good, but can improve" : "Needs more work"}
                        </p>
                      </div>

                      {feedback.strengths?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1.5 flex items-center gap-1">
                            <CheckCircle size={12} /> Strengths
                          </p>
                          <ul className="space-y-1">
                            {feedback.strengths.map((s, i) => (
                              <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {feedback.improvements?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1.5 flex items-center gap-1">
                            <AlertCircle size={12} /> Improvements
                          </p>
                          <ul className="space-y-1">
                            {feedback.improvements.map((s, i) => (
                              <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                <span className="text-orange-500 mt-0.5">•</span> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {feedback.idealAnswer && (
                        <div className="bg-brand-50 dark:bg-brand-900/20 rounded-lg p-3 border border-brand-100 dark:border-brand-800">
                          <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mb-1 flex items-center gap-1">
                            <Award size={12} /> Ideal Answer
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{feedback.idealAnswer}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {mode === "view" && !answer && !thinking && (
                <p className="text-sm text-slate-400">Click "AI Answer" to generate a sample response, or "Practice" to record your own.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function InterviewPage() {
  const { resume } = useResumeStore();
  const [role, setRole]                   = useState("");
  const [activeCategory, setActiveCategory] = useState("technical");
  const [questions, setQuestions]         = useState({});
  const [loading, setLoading]             = useState(false);

  const skillsList     = [...(resume.skills.technical || []), ...(resume.skills.tools || [])].join(", ");
  const experienceList = resume.experience.map(e => `${e.role} at ${e.company}`).join(", ");

  const generateQuestions = async () => {
    if (!role.trim()) { toast.error("Enter a target role first"); return; }
    setLoading(true);

    const prompts = {
      technical:   `Generate 8 technical interview questions for a ${role} position. Skills relevant: ${skillsList}. Return as JSON array: [{"question": "..."}]`,
      hr:          `Generate 8 behavioral/HR interview questions for a ${role} role. Return as JSON array: [{"question": "..."}]`,
      project:     `Generate 6 project-based interview questions for a ${role} candidate with experience: ${experienceList || "software development"}. Return as JSON array: [{"question": "..."}]`,
      situational: `Generate 6 situational interview questions for a ${role} role. Return as JSON array: [{"question": "..."}]`,
    };

    const newQuestions = {};
    try {
      for (const [cat, prompt] of Object.entries(prompts)) {
        const raw     = await callAI(prompt + "\nReturn ONLY valid JSON, no explanation.");
        const cleaned = raw.replace(/```json|```/g, "").trim();
        newQuestions[cat] = JSON.parse(cleaned);
      }
      setQuestions(newQuestions);
      toast.success("Questions generated!");
    } catch {
      newQuestions.technical   = [
        { question: "Explain the difference between REST and GraphQL APIs." },
        { question: "How would you optimize a slow database query?" },
        { question: "What is the difference between synchronous and asynchronous code?" },
        { question: "Describe your experience with version control (Git)." },
        { question: "How do you handle state management in large applications?" },
      ];
      newQuestions.hr          = [
        { question: "Tell me about yourself and your background." },
        { question: "What's your greatest technical achievement?" },
        { question: "How do you handle conflicts in a team?" },
        { question: "Where do you see yourself in 5 years?" },
        { question: "Why do you want to work at our company?" },
      ];
      newQuestions.project     = [
        { question: "Walk me through your most challenging project." },
        { question: "How did you handle a failed project or missed deadline?" },
        { question: "Describe a time you had to learn a new technology quickly." },
      ];
      newQuestions.situational = [
        { question: "What would you do if you disagreed with your manager's technical decision?" },
        { question: "How would you handle an urgent bug in production?" },
        { question: "If you were given an unclear requirement, how would you proceed?" },
      ];
      setQuestions(newQuestions);
      toast.success("Sample questions loaded!");
    } finally {
      setLoading(false);
    }
  };

  const currentQuestions = questions[activeCategory] || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
            <MessageSquare size={22} className="text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Interview Prep</h1>
            <p className="text-slate-500 dark:text-slate-400">AI-generated questions · Timer · Voice practice · AI scoring</p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { icon: Timer,   label: "Interview Timer" },
            { icon: Mic,     label: "Voice Recording" },
            { icon: Star,    label: "AI Answer Scoring" },
            { icon: Sparkles,label: "Sample Answers" },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
              <Icon size={12} /> {label}
            </span>
          ))}
        </div>

        {/* Role input */}
        <div className="card p-6 mb-6">
          <label className="label">Target Role</label>
          <div className="flex gap-3">
            <input
              className="input flex-1"
              placeholder="e.g. Full Stack Developer, Data Scientist, Product Manager…"
              value={role}
              onChange={e => setRole(e.target.value)}
              onKeyDown={e => e.key === "Enter" && generateQuestions()}
            />
            <button onClick={generateQuestions} disabled={loading} className="btn-primary px-6">
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <><Sparkles size={16} /> Generate</>}
            </button>
          </div>
          {skillsList && (
            <p className="text-xs text-slate-400 mt-2">
              Based on your skills: <span className="text-slate-600 dark:text-slate-300">{skillsList.slice(0, 60)}{skillsList.length > 60 ? "…" : ""}</span>
            </p>
          )}
        </div>

        {/* How to use */}
        {Object.keys(questions).length === 0 && (
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: Sparkles, title: "Generate Questions",  desc: "Enter your target role and get AI-generated questions across 4 categories" },
              { icon: Mic,      title: "Practice Your Answer", desc: "Click Practice on any question, record your answer with the mic or type it" },
              { icon: Star,     title: "Get AI Score",         desc: "AI scores your answer 1-10 with strengths, improvements, and ideal answer" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-4 text-center">
                <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} className="text-brand-600 dark:text-brand-400" />
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Category tabs */}
        {Object.keys(questions).length > 0 && (
          <>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${activeCategory === cat.id
                      ? cat.color
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"}`}
                >
                  {cat.label}
                  {questions[cat.id] && (
                    <span className="ml-2 text-xs opacity-70">({questions[cat.id].length})</span>
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {currentQuestions.map((q, i) => (
                <QuestionCard key={i} q={q} index={i} />
              ))}
            </div>
          </>
        )}

        {Object.keys(questions).length === 0 && (
          <div className="card p-12 text-center">
            <MessageSquare size={40} className="text-slate-200 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 mb-2">Enter your target role and generate interview questions</p>
            <p className="text-sm text-slate-400">AI creates role-specific technical, HR, and behavioral questions</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}