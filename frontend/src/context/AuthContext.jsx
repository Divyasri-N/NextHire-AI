import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Set axios base URL globally once
axios.defaults.baseURL = API;

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // start true — always wait

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false); // no token — stop loading immediately
      return;
    }

    // Set header before making request
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios.get("/auth/me")
      .then(res => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error("Auth restore failed:", err?.response?.data || err.message);
        // Only clear token on 401 Unauthorized
        if (!err.response || err.response.status === 401) {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        }
      })
      .finally(() => {
        setLoading(false); // always stop loading
      });
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("/auth/login", { email, password });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const register = async (name, email, password) => {
    const res = await axios.post("/auth/register", { name, email, password });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const googleLogin = async (credential) => {
    const res = await axios.post("/auth/google", { credential });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await axios.put("/auth/update-profile", data);
    setUser(res.data.user);
    return res.data.user;
  };

  // Don't render anything until auth check is complete
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading NextHire AI...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};