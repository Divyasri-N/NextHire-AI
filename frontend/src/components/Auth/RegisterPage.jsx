import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "@context/AuthContext";
import { User, Mail, Lock, Eye, EyeOff, FileText } from "lucide-react";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const pwd = watch("password");

  const onSubmit = async ({ name, email, password }) => {
    setLoading(true);
    try {
      await registerUser(name, email, password);
      toast.success("Account created! Let's build your resume.");
      navigate("/builder");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold"><span className="text-brand-600">NextHire</span><span className="text-slate-800 dark:text-slate-100"> AI</span></span>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create account</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Start building your career today</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" className="input pl-10" placeholder="Jane Doe"
                  {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 chars" } })} />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" className="input pl-10" placeholder="you@example.com"
                  {...register("email", { required: "Email required", pattern: { value: /^\S+@\S+$/, message: "Invalid email" } })} />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPwd ? "text" : "password"} className="input pl-10 pr-10" placeholder="Min. 8 characters"
                  {...register("password", { required: "Password required", minLength: { value: 8, message: "Min 8 chars" } })} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" className="input pl-10" placeholder="Repeat password"
                  {...register("confirm", { required: true, validate: v => v === pwd || "Passwords don't match" })} />
              </div>
              {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}