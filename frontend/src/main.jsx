import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "!bg-white !text-slate-900 dark:!bg-slate-800 dark:!text-slate-100 !shadow-lg !rounded-xl !border !border-slate-200 dark:!border-slate-700",
          duration: 3500,
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);