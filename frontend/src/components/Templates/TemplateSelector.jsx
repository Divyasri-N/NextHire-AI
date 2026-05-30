import { useResumeStore } from "../../store/ResumeStore";
import { Check, X } from "lucide-react";

const templates = [
  { id: "minimal",   name: "Minimal",   desc: "Clean, ATS-friendly",      color: "bg-brand-600" },
  { id: "corporate", name: "Corporate", desc: "Professional, two-column",  color: "bg-slate-800" },
  { id: "modern",    name: "Developer", desc: "Dark theme, tech-focused",  color: "bg-slate-900" },
  {
    id: "ats",
    name: "ATS Pro",
    desc: "Maximum ATS compatibility",
    color: "bg-white border border-slate-300",
    preview: (
      <div style={{ padding: "6px 8px", background: "#fff", height: "80px", overflow: "hidden" }}>
        <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", borderBottom: "1.5px solid #000", paddingBottom: "4px", marginBottom: "4px" }}>
          <div style={{ fontWeight: 700, fontSize: "9px", letterSpacing: "0.5px" }}>YOUR NAME</div>
          <div style={{ fontSize: "6px", color: "#333" }}>email | phone | location</div>
        </div>
        <div style={{ borderBottom: "1px solid #000", marginBottom: "3px", paddingBottom: "1px" }}>
          <div style={{ fontWeight: 700, fontSize: "7px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Work Experience</div>
        </div>
        <div style={{ fontSize: "6px", color: "#000", marginBottom: "2px" }}>
          <span style={{ fontWeight: 700 }}>Software Engineer</span>, Company Name
        </div>
        <div style={{ borderBottom: "1px solid #000", marginBottom: "3px", paddingBottom: "1px" }}>
          <div style={{ fontWeight: 700, fontSize: "7px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Skills</div>
        </div>
        <div style={{ fontSize: "6px" }}><span style={{ fontWeight: 700 }}>Technical:</span> React, Node.js, Python</div>
      </div>
    ),
  },
];

export default function TemplateSelector({ onClose }) {
  const { activeTemplate, setTemplate } = useResumeStore();

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Choose Template</h3>
        <button onClick={onClose} className="btn-ghost p-1.5"><X size={16} /></button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {templates.map(t => (
          <button
            key={t.id}
            onClick={() => { setTemplate(t.id); onClose(); }}
            className={`relative rounded-xl border-2 overflow-hidden transition-all p-0
              ${activeTemplate === t.id
                ? "border-brand-500 shadow-md"
                : "border-transparent hover:border-slate-200 dark:hover:border-slate-600"}`}
          >
            {/* Template preview thumbnail */}
            {t.preview ? (
              <div className="h-20 w-full overflow-hidden">{t.preview}</div>
            ) : (
              <div className={`${t.color} h-20 w-full`} />
            )}
            <div className="p-2 bg-white dark:bg-slate-800 text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{t.name}</p>
              <p className="text-xs text-slate-400">{t.desc}</p>
            </div>
            {activeTemplate === t.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center">
                <Check size={11} className="text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* ATS tip */}
      <p className="text-xs text-slate-400 mt-4 text-center">
        💡 <span className="text-slate-500 dark:text-slate-300">ATS Pro</span> uses plain black & white formatting for maximum compatibility with applicant tracking systems.
      </p>
    </div>
  );
}