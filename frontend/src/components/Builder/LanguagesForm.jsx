import { useState } from "react";
import { useResumeStore } from "@store/ResumeStore";
import { Plus, Trash2, Globe } from "lucide-react";

const PROFICIENCY_LEVELS = ["Native", "Fluent", "Advanced", "Intermediate", "Beginner"];

const LEVEL_COLORS = {
  Native:       "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  Fluent:       "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300",
  Advanced:     "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  Intermediate: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  Beginner:     "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
};

const LEVEL_DOTS = {
  Native:       5,
  Fluent:       4,
  Advanced:     3,
  Intermediate: 2,
  Beginner:     1,
};

const COMMON_LANGUAGES = [
  "English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam",
  "French", "Spanish", "German", "Japanese", "Mandarin", "Arabic",
  "Portuguese", "Russian", "Korean", "Italian",
];

export default function LanguagesForm() {
  const { resume, addItem, removeItem } = useResumeStore();
  const languages = resume.languages || [];

  const [lang, setLang] = useState("");
  const [level, setLevel] = useState("Fluent");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = COMMON_LANGUAGES.filter(
    (l) =>
      l.toLowerCase().includes(lang.toLowerCase()) &&
      !languages.find((x) => x.language?.toLowerCase() === l.toLowerCase())
  );

  const addLanguage = (name = lang, proficiency = level) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (languages.find((l) => l.language?.toLowerCase() === trimmed.toLowerCase())) {
      return; // already added
    }
    addItem("languages", { language: trimmed, proficiency });
    setLang("");
    setShowSuggestions(false);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Globe size={20} className="text-brand-600 dark:text-brand-400" />
        <h2 className="section-title">Languages Known</h2>
      </div>

      {/* Current languages */}
      {languages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {languages.map((item) => (
            <div
              key={item.id}
              className="card p-4 flex items-center justify-between group hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <Globe size={16} className="text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                    {item.language}
                  </p>
                  <span className={`badge text-xs mt-0.5 ${LEVEL_COLORS[item.proficiency] || LEVEL_COLORS["Intermediate"]}`}>
                    {item.proficiency}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Dots indicator */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div
                      key={dot}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        dot <= (LEVEL_DOTS[item.proficiency] || 2)
                          ? "bg-brand-500"
                          : "bg-slate-200 dark:bg-slate-600"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => removeItem("languages", item.id)}
                  className="opacity-0 group-hover:opacity-100 btn-ghost p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 text-sm">
          Add a Language
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Language input with suggestions */}
          <div className="flex-1 relative">
            <label className="label">Language</label>
            <input
              className="input"
              placeholder="e.g. English, Tamil, French…"
              value={lang}
              onChange={(e) => { setLang(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onKeyDown={(e) => e.key === "Enter" && addLanguage()}
            />
            {/* Dropdown suggestions */}
            {showSuggestions && lang && filtered.length > 0 && (
              <div className="absolute z-10 top-full mt-1 left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
                {filtered.slice(0, 6).map((suggestion) => (
                  <button
                    key={suggestion}
                    onMouseDown={() => addLanguage(suggestion)}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Proficiency */}
          <div className="sm:w-44">
            <label className="label">Proficiency</label>
            <select
              className="input"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              {PROFICIENCY_LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div className="sm:self-end">
            <button
              onClick={() => addLanguage()}
              disabled={!lang.trim()}
              className="btn-primary w-full sm:w-auto py-2.5 px-5"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Quick add common languages */}
        <div className="mt-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_LANGUAGES.filter(
              (l) => !languages.find((x) => x.language?.toLowerCase() === l.toLowerCase())
            ).slice(0, 8).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => addLanguage(suggestion, level)}
                className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-300 transition-colors cursor-pointer text-xs"
              >
                <Plus size={10} /> {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {languages.length === 0 && (
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-4">
          No languages added yet. Add your first language above!
        </p>
      )}
    </div>
  );
}