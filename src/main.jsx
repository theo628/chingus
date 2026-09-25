import React from "react";
import { createRoot } from "react-dom/client";
import Root from "./Root";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </React.StrictMode>
);

// Offline support + installability (production builds only, so dev reloads stay fresh).
if (import.meta.env.PROD && !import.meta.env.VITE_ARTIFACT && "serviceWorker" in navigator && window.isSecureContext) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + "sw.js").catch(() => { /* offline mode unavailable */ });
  });
}
