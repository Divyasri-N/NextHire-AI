import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStore } from "../../store/ResumeStore";
import PersonalForm from "./PersonalForm";
import ExperienceForm from "./ExperienceForm";
import EducationForm from "./EducationForm";
import SkillsForm from "./SkillsForm";
import ProjectsForm from "./ProjectsForm";
import CertificationsForm from "./CertificationsForm";
import LanguagesForm from "./LanguagesForm";
import ResumePreview from "./ResumePreview";
import TemplateSelector from "../Templates/TemplateSelector";
import AIPanel from "../AI/AIPanel";
import { exportToPDF } from "../../utils/pdfExport";
import { User, GraduationCap, Briefcase, Code, FolderGit2, Award, Download, Save, Sparkles, Layout, Globe } from "lucide-react";
import toast from "react-hot-toast";

const sections = [
  { id: "personal",       label: "Personal",       icon: User },
  { id: "experience",     label: "Experience",     icon: Briefcase },
  { id: "education",      label: "Education",      icon: GraduationCap },
  { id: "skills",         label: "Skills",         icon: Code },
  { id: "projects",       label: "Projects",       icon: FolderGit2 },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "languages",      label: "Languages",      icon: Globe },
];

const FORMS = {
  personal:       PersonalForm,
  education:      EducationForm,
  experience:     ExperienceForm,
  skills:         SkillsForm,
  projects:       ProjectsForm,
  certifications: CertificationsForm,
  languages:      LanguagesForm,
};

export default function BuilderPage() {
  const { resume, saveToCloud } = useResumeStore();
  const [active, setActive] = useState("personal");
  const [showAI, setShowAI] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const ActiveForm = FORMS[active];

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveToCloud();
      toast.success("Resume saved!");
    } catch {
      toast.error("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    exportToPDF(resume);
    toast.success("PDF downloaded!");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resume Builder</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAI(!showAI)}
            className={`btn-secondary text-sm py-2 gap-2 ${showAI ? "bg-brand-50 border-brand-300 text-brand-600 dark:bg-brand-900/30 dark:border-brand-700" : ""}`}>
            <Sparkles size={15} /> AI Assistant
          </button>
          <button onClick={() => setShowTemplates(!showTemplates)} className="btn-secondary text-sm py-2 gap-2">
            <Layout size={15} /> Templates
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-secondary text-sm py-2">
            <Save size={15} /> {saving ? "Saving…" : "Save"}
          </button>
          <button onClick={handleExport} className="btn-primary text-sm py-2">
            <Download size={15} /> Export PDF
          </button>
        </div>
      </div>

      {/* Templates panel */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
            <TemplateSelector onClose={() => setShowTemplates(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0 hidden md:block">
          <div className="card p-2 space-y-1 sticky top-24">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left
                  ${active === id
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile section tabs */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-2 mb-4 -mt-2 w-full">
          {sections.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${active === id ? "bg-brand-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"}`}>
              <Icon size={14} />{label}
            </button>
          ))}
        </div>

        {/* Form area */}
        <div className={`flex-1 min-w-0 ${showAI ? "lg:max-w-[calc(100%-320px)]" : ""}`}>
          <div className="card p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ActiveForm />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* AI Panel */}
        <AnimatePresence>
          {showAI && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 300 }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              className="flex-shrink-0 hidden lg:block"
            >
              <AIPanel activeSection={active} onClose={() => setShowAI(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live Preview */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Live Preview</h2>
          <button onClick={() => setPreviewMode(!previewMode)} className="btn-ghost text-sm">
            {previewMode ? "Compact" : "Full Preview"}
          </button>
        </div>
        <div className={`overflow-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white ${previewMode ? "min-h-screen" : "max-h-[700px]"}`}>
          <div id="resume-preview" className="transform-gpu origin-top-left">
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
}