import { useState } from "react";
import { useResumeStore } from "../../store/ResumeStore";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Edit3, ExternalLink } from "lucide-react";

export default function ProjectsForm() {
  const { resume, addItem, updateItem, removeItem } = useResumeStore();
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const startEdit = (item) => { setEditing(item.id); reset(item); };

  const onSubmit = (data) => {
    if (editing) { updateItem("projects", editing, data); setEditing(null); }
    else addItem("projects", data);
    reset({});
  };

  return (
    <div>
      <h2 className="section-title mb-6">Projects</h2>
      <div className="space-y-3 mb-6">
        {resume.projects.map(item => (
          <div key={item.id} className="card p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{item.title}</p>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:text-brand-600">
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{item.tech}</p>
                {item.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>}
              </div>
              <div className="flex gap-1 ml-2 flex-shrink-0">
                <button onClick={() => startEdit(item)} className="btn-ghost py-1 px-2"><Edit3 size={13} /></button>
                <button onClick={() => removeItem("projects", item.id)} className="btn-ghost py-1 px-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 text-sm">{editing ? "Edit Project" : "Add Project"}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Project Title *</label>
            <input className="input" placeholder="E-Commerce Platform" {...register("title", { required: true })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Tech Stack</label>
            <input className="input" placeholder="React, Node.js, MongoDB, Stripe" {...register("tech")} />
          </div>
          <div>
            <label className="label">GitHub URL</label>
            <input className="input" placeholder="github.com/user/project" {...register("github")} />
          </div>
          <div>
            <label className="label">Live URL</label>
            <input className="input" placeholder="myproject.com" {...register("link")} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="• Built a full-stack e-commerce platform with 1000+ products&#10;• Implemented Stripe payments processing $10K+ monthly transactions"
              {...register("description")}
            />
            <p className="text-xs text-slate-400 mt-1">AI Assistant can generate a professional description from your title + tech stack!</p>
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" className="btn-primary text-sm py-2">
              <Plus size={15} /> {editing ? "Update" : "Add Project"}
            </button>
            {editing && <button type="button" className="btn-secondary text-sm py-2" onClick={() => { setEditing(null); reset({}); }}>Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );
}