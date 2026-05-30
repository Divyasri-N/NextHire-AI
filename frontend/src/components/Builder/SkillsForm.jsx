import { useState } from "react";
import { useResumeStore } from "../../store/ResumeStore";
import { X, Plus } from "lucide-react";

function TagInput({ title, items, onAdd, onRemove, placeholder, color }) {
  const [val, setVal] = useState("");

  const add = () => {
    const trimmed = val.trim();
    if (trimmed && !items.includes(trimmed)) {
      onAdd(trimmed);
      setVal("");
    }
  };

  return (
    <div>
      <label className="label">{title}</label>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[36px] p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
        {items.map(skill => (
          <span key={skill} className={`badge ${color} gap-1`}>
            {skill}
            <button onClick={() => onRemove(skill)} className="hover:opacity-70">
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="input flex-1 text-sm py-2"
          placeholder={placeholder}
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <button type="button" onClick={add} className="btn-secondary text-sm py-2 px-3">
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

export default function SkillsForm() {
  const { resume, updateSection } = useResumeStore();
  const skills = resume.skills;

  const addSkill = (category, skill) => {
    updateSection("skills", { ...skills, [category]: [...(skills[category] || []), skill] });
  };

  const removeSkill = (category, skill) => {
    updateSection("skills", { ...skills, [category]: skills[category].filter(s => s !== skill) });
  };

  const suggestedByRole = [
    "React.js", "Node.js", "TypeScript", "Python", "MongoDB", "PostgreSQL",
    "Docker", "Git", "REST APIs", "GraphQL", "AWS", "Tailwind CSS"
  ];

  const addSuggested = (skill) => {
    if (!skills.technical.includes(skill)) addSkill("technical", skill);
  };

  return (
    <div>
      <h2 className="section-title mb-6">Skills</h2>
      <div className="space-y-5">
        <TagInput
          title="Technical Skills"
          items={skills.technical || []}
          onAdd={s => addSkill("technical", s)}
          onRemove={s => removeSkill("technical", s)}
          placeholder="React, Node.js, Python… press Enter"
          color="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300"
        />
        <TagInput
          title="Tools & Technologies"
          items={skills.tools || []}
          onAdd={s => addSkill("tools", s)}
          onRemove={s => removeSkill("tools", s)}
          placeholder="Git, Docker, Figma… press Enter"
          color="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
        />
        <TagInput
          title="Soft Skills"
          items={skills.soft || []}
          onAdd={s => addSkill("soft", s)}
          onRemove={s => removeSkill("soft", s)}
          placeholder="Leadership, Communication… press Enter"
          color="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
        />
      </div>

      {/* Quick add suggestions */}
      <div className="mt-6">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Quick add popular skills:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedByRole
            .filter(s => !skills.technical.includes(s) && !skills.tools.includes(s))
            .map(skill => (
              <button key={skill} onClick={() => addSuggested(skill)}
                className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-300 transition-colors cursor-pointer">
                <Plus size={11} /> {skill}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}