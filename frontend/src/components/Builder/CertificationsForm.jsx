import { useState } from "react";
import { useResumeStore } from "../../store/ResumeStore";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

export default function CertificationsForm() {
  const { resume, addItem, removeItem } = useResumeStore();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => { addItem("certifications", data); reset({}); };

  return (
    <div>
      <h2 className="section-title mb-6">Certifications & Achievements</h2>
      <div className="space-y-3 mb-6">
        {resume.certifications.map(item => (
          <div key={item.id} className="card p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{item.name}</p>
              <p className="text-xs text-slate-500">{item.issuer} {item.year && `· ${item.year}`}</p>
            </div>
            <button onClick={() => removeItem("certifications", item.id)} className="btn-ghost py-1 px-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={13} /></button>
          </div>
        ))}
      </div>

      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 text-sm">Add Certification / Achievement</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Certificate / Achievement Name *</label>
            <input className="input" placeholder="AWS Certified Solutions Architect" {...register("name", { required: true })} />
          </div>
          <div>
            <label className="label">Issuer / Organization</label>
            <input className="input" placeholder="Amazon Web Services" {...register("issuer")} />
          </div>
          <div>
            <label className="label">Year</label>
            <input className="input" type="number" placeholder="2023" {...register("year")} />
          </div>
          <div>
            <label className="label">Credential ID (optional)</label>
            <input className="input" placeholder="ABC123XYZ" {...register("credentialId")} />
          </div>
          <div>
            <label className="label">Credential URL (optional)</label>
            <input className="input" placeholder="verify.aws.com/..." {...register("url")} />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary text-sm py-2">
              <Plus size={15} /> Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}