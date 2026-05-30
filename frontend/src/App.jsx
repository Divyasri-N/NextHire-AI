import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import LandingPage from "./pages/LandingPage";

import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";

import DashboardPage from "./components/Dashboard/DashboardPage";

import BuilderPage from "./components/Builder/BuilderPage";

import ATSPage from "./components/ATS/ATSPage";

import InterviewPage from "./components/Interview/InterviewPage";

import AnalyticsPage from "./components/Dashboard/AnalyticsPage";

import ProfilePage from "./components/Profile/ProfilePage";

import Navbar from "./components/Navbar";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return user ? <Navigate to="/dashboard" /> : children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
          <Routes>

            {/* Public */}
            <Route path="/" element={<LandingPage />} />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* Protected */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <DashboardPage />
                  </>
                </PrivateRoute>
              }
            />

            <Route
              path="/builder"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <BuilderPage />
                  </>
                </PrivateRoute>
              }
            />

            <Route
              path="/builder/:id"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <BuilderPage />
                  </>
                </PrivateRoute>
              }
            />

            <Route
              path="/ats"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <ATSPage />
                  </>
                </PrivateRoute>
              }
            />

            <Route
              path="/interview"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <InterviewPage />
                  </>
                </PrivateRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <AnalyticsPage />
                  </>
                </PrivateRoute>
              }
            />

            {/* Profile — new */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <ProfilePage />
                  </>
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}