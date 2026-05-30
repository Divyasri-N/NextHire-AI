import { useState } from "react";
import { useResumeStore } from "../../store/ResumeStore";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Edit3 } from "lucide-react";

export default function EducationForm() {
  const { resume, addItem, updateItem, removeItem } = useResumeStore();
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const startEdit = (item) => { setEditing(item.id); reset(item); };

  const onSubmit = (data) => {
    if (editing) { updateItem("education", editing, data); setEditing(null); }
    else addItem("education", data);
    reset({});
  };

  return (
    <div>
      <h2 className="section-title mb-6">Education</h2>
      <div className="space-y-3 mb-6">
        {resume.education.map(item => (
          <div key={item.id} className="card p-4 flex items-start justify-between">
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{item.degree} {item.field && `in ${item.field}`}</p>
              <p className="text-xs text-slate-500">{item.school} · {item.startYear}–{item.endYear || "Present"}</p>
              {item.gpa && <p className="text-xs text-slate-400 mt-0.5">GPA: {item.gpa}</p>}
            </div>
            <div className="flex gap-1">
              <button onClick={() => startEdit(item)} className="btn-ghost py-1 px-2"><Edit3 size={13} /></button>
              <button onClick={() => removeItem("education", item.id)} className="btn-ghost py-1 px-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 text-sm">{editing ? "Edit Education" : "Add Education"}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "school",    label: "School/University", placeholder: "MIT", full: true },
            { name: "degree",    label: "Degree",            placeholder: "Bachelor of Science" },
            { name: "field",     label: "Field of Study",    placeholder: "Computer Science" },
            { name: "startYear", label: "Start Year",        placeholder: "2020", type: "number" },
            { name: "endYear",   label: "End Year",          placeholder: "2024", type: "number" },
            { name: "gpa",       label: "GPA (optional)",    placeholder: "3.8 / 4.0" },
          ].map(({ name, label, placeholder, full, type }) => (
            <div key={name} className={full ? "sm:col-span-2" : ""}>
              <label className="label">{label}</label>
              <input className="input" placeholder={placeholder} type={type || "text"} {...register(name)} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="label">Relevant Coursework / Activities (optional)</label>
            <input className="input" placeholder="Data Structures, Algorithms, Machine Learning, Hackathon Winner" {...register("activities")} />
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" className="btn-primary text-sm py-2">
              <Plus size={15} /> {editing ? "Update" : "Add Education"}
            </button>
            {editing && <button type="button" className="btn-secondary text-sm py-2" onClick={() => { setEditing(null); reset({}); }}>Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );
}