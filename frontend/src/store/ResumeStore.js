import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const defaultResume = {
  personal: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
  },
  education: [],
  experience: [],
  skills: { technical: [], soft: [], tools: [] },
  projects: [],
  certifications: [],
  languages: [],
  achievements: [],
};

export const useResumeStore = create(
  persist(
    (set, get) => ({
      resume: defaultResume,
      activeTemplate: "minimal",
      savedResumes: [],   // ✅ always an array
      atsScore: null,

      updatePersonal: (data) =>
        set(s => ({ resume: { ...s.resume, personal: { ...s.resume.personal, ...data } } })),

      updateSection: (section, data) =>
        set(s => ({ resume: { ...s.resume, [section]: data } })),

      addItem: (section, item) =>
        set(s => ({ resume: { ...s.resume, [section]: [...s.resume[section], { id: Date.now(), ...item }] } })),

      updateItem: (section, id, data) =>
        set(s => ({
          resume: {
            ...s.resume,
            [section]: s.resume[section].map(i => i.id === id ? { ...i, ...data } : i),
          },
        })),

      removeItem: (section, id) =>
        set(s => ({ resume: { ...s.resume, [section]: s.resume[section].filter(i => i.id !== id) } })),

      reorderItems: (section, items) =>
        set(s => ({ resume: { ...s.resume, [section]: items } })),

      setTemplate: (template) => set({ activeTemplate: template }),

      setATSScore: (score) => set({ atsScore: score }),

      resetResume: () => set({ resume: defaultResume, atsScore: null }),

      saveToCloud: async () => {
        const { resume } = get();
        const res = await axios.post(`${API}/resumes`, resume);
        // Fix 1: backend returns { success, resume } — extract resume object
        const saved = res.data.resume;
        set(s => ({ savedResumes: [saved, ...s.savedResumes] }));
        return saved;
      },

      loadResumes: async () => {
        const res = await axios.get(`${API}/resumes`);
        // Fix 2: backend returns { success, resumes: [] } — extract the array
        const resumes = res.data.resumes || [];
        set({ savedResumes: resumes });
        return resumes;
      },

      loadResume: async (id) => {
        const res = await axios.get(`${API}/resumes/${id}`);
        // Fix 3: backend returns { success, resume } — extract resume object
        const resume = res.data.resume;
        set({ resume });
        return resume;
      },

      deleteResume: async (id) => {
        await axios.delete(`${API}/resumes/${id}`);
        set(s => ({ savedResumes: s.savedResumes.filter(r => r._id !== id) }));
      },

      updateResume: async (id, data) => {
        const res = await axios.put(`${API}/resumes/${id}`, data);
        const updated = res.data.resume;
        set(s => ({
          savedResumes: s.savedResumes.map(r => r._id === id ? updated : r),
        }));
        return updated;
      },
    }),
    { name: "resume-store", partialize: (s) => ({ resume: s.resume, activeTemplate: s.activeTemplate }) }
  )
);