import { useState } from "react";
import { useResumeStore } from "../../store/ResumeStore";
import { useForm } from "react-hook-form";
import { Plus, Trash2, ChevronDown, ChevronUp, Edit3 } from "lucide-react";

function ExpItem({ item, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 cursor-pointer" onClick={() => setOpen(!open)}>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{item.role || "Untitled Role"}</p>
          <p className="text-xs text-slate-500">{item.company} {item.startDate && `· ${item.startDate} – ${item.current ? "Present" : item.endDate}`}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={e => { e.stopPropagation(); onEdit(item); }} className="btn-ghost py-1 px-2 text-xs"><Edit3 size={13} /></button>
          <button onClick={e => { e.stopPropagation(); onDelete(item.id); }} className="btn-ghost py-1 px-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={13} /></button>
          {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </div>
      {open && item.description && (
        <div className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line border-t border-slate-200 dark:border-slate-700">
          {item.description}
        </div>
      )}
    </div>
  );
}

export default function ExperienceForm() {
  const { resume, addItem, updateItem, removeItem } = useResumeStore();
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, watch } = useForm();
  const isCurrent = watch("current");

  const startEdit = (item) => {
    setEditing(item.id);
    reset(item);
  };

  const onSubmit = (data) => {
    const payload = { ...data, current: data.current || false };
    if (editing) {
      updateItem("experience", editing, payload);
      setEditing(null);
    } else {
      addItem("experience", payload);
    }
    reset({});
  };

  return (
    <div>
      <h2 className="section-title mb-6">Work Experience</h2>

      {/* List */}
      <div className="space-y-3 mb-6">
        {resume.experience.map(item => (
          <ExpItem key={item.id} item={item} onEdit={startEdit} onDelete={(id) => removeItem("experience", id)} />
        ))}
      </div>

      {/* Form */}
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 text-sm">
          {editing ? "Edit Experience" : "Add Experience"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Job Title *</label>
            <input className="input" placeholder="Software Engineer" {...register("role", { required: true })} />
          </div>
          <div>
            <label className="label">Company *</label>
            <input className="input" placeholder="Acme Corp" {...register("company", { required: true })} />
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" placeholder="San Francisco, CA" {...register("location")} />
          </div>
          <div>
            <label className="label">Start Date</label>
            <input className="input" type="month" {...register("startDate")} />
          </div>
          <div>
            <label className="label">End Date</label>
            <input className="input" type="month" disabled={isCurrent} {...register("endDate")} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="current" className="rounded" {...register("current")} />
            <label htmlFor="current" className="text-sm text-slate-600 dark:text-slate-400">Currently working here</label>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description & Achievements</label>
            <textarea
              className="input resize-none"
              rows={4}
              placeholder="• Led development of microservices reducing latency by 40%&#10;• Mentored 3 junior developers&#10;• Built REST APIs serving 1M+ requests/day"
              {...register("description")}
            />
            <p className="text-xs text-slate-400 mt-1">Use bullet points (•). AI Assistant can generate this for you!</p>
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" className="btn-primary text-sm py-2">
              <Plus size={15} /> {editing ? "Update" : "Add Experience"}
            </button>
            {editing && (
              <button type="button" className="btn-secondary text-sm py-2" onClick={() => { setEditing(null); reset({}); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}