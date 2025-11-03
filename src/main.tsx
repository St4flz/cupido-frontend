import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setAppStore } from "./features/auth/lib/authAPI";
import { useAppStore } from "./store/appStore";

// ✅ Inicializar el store de Zustand para authAPI
const store = useAppStore.getState();
setAppStore(store);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);