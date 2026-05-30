import { useResumeStore } from "../../store/ResumeStore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function PersonalForm() {
  const { resume, updatePersonal } = useResumeStore();
  const { register, watch } = useForm({ defaultValues: resume.personal });

  // Live update on any change
  const values = watch();
  useEffect(() => {
    const sub = watch((data) => updatePersonal(data));
    return () => sub.unsubscribe();
  }, [watch]);

  const fields = [
    { name: "name",      label: "Full Name",        placeholder: "Jane Doe",                   full: true },
    { name: "email",     label: "Email",             placeholder: "jane@example.com" },
    { name: "phone",     label: "Phone",             placeholder: "+1 (555) 000-0000" },
    { name: "location",  label: "Location",          placeholder: "San Francisco, CA" },
    { name: "linkedin",  label: "LinkedIn URL",      placeholder: "linkedin.com/in/jane" },
    { name: "github",    label: "GitHub URL",        placeholder: "github.com/jane" },
    { name: "portfolio", label: "Portfolio/Website", placeholder: "jane.dev",                   full: true },
  ];

  return (
    <div>
      <h2 className="section-title mb-6">Personal Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ name, label, placeholder, full }) => (
          <div key={name} className={full ? "sm:col-span-2" : ""}>
            <label className="label">{label}</label>
            <input
              className="input"
              placeholder={placeholder}
              {...register(name)}
            />
          </div>
        ))}

        <div className="sm:col-span-2">
          <label className="label">Professional Summary</label>
          <textarea
            className="input resize-none"
            rows={4}
            placeholder="Brief overview of your professional background and key strengths…"
            {...register("summary")}
          />
          <p className="text-xs text-slate-400 mt-1">Tip: Use the AI Assistant to auto-generate a compelling summary</p>
        </div>
      </div>
    </div>
  );
}