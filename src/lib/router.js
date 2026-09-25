/* Tiny hash router.
 * Uses history.pushState so every screen is a real history entry: the browser / Android back
 * button closes a chat, room or lesson instead of leaving the app, and screens survive reloads.
 * Hash URLs (#/app/chats/u1) work on any static host with no server rewrites. */
import { useEffect, useState } from "react";

const listeners = new Set();
let lastNav = "pop"; // "push" | "replace" | "pop" (browser back/forward, reload, typed URL)

export const lastNavigation = () => lastNav;

export function currentPath() {
  const raw = decodeURI(window.location.hash.replace(/^#/, "")).split("?")[0];
  const path = ("/" + raw).replace(/\/{2,}/g, "/").replace(/\/+$/, "");
  return path || "/";
}

export function pathParts(path = currentPath()) {
  return path.split("/").filter(Boolean).map((p) => {
    try { return decodeURIComponent(p); } catch { return p; }
  });
}

function notify() {
  const p = currentPath();
  listeners.forEach((fn) => fn(p));
}

function onBrowserNav() {
  lastNav = "pop";
  notify();
}

if (typeof window !== "undefined") {
  window.addEventListener("hashchange", onBrowserNav);
  window.addEventListener("popstate", onBrowserNav);
  try { window.history.scrollRestoration = "manual"; } catch { /* unsupported */ }
}

const depth = () => (window.history.state && window.history.state.kcDepth) || 0;

export function navigate(path, { replace = false } = {}) {
  if (!replace && path === currentPath()) return;
  const url = "#" + path;
  lastNav = replace ? "replace" : "push";
  try {
    if (replace) window.history.replaceState({ kcDepth: depth() }, "", url);
    else window.history.pushState({ kcDepth: depth() + 1 }, "", url);
  } catch {
    // Sandboxed frames can block the History API — fall back to plain hash changes.
    if (replace) window.location.replace(url);
    else window.location.hash = path;
    return;
  }
  notify();
}

/* Go back if the previous entry belongs to this app, otherwise replace with `fallback`
 * (e.g. when a screen was opened from a bookmark or after a reload in a new tab). */
export function goBack(fallback) {
  if (depth() > 0) window.history.back();
  else navigate(fallback, { replace: true });
}

export function useRoute() {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    listeners.add(setPath);
    setPath(currentPath());
    return () => { listeners.delete(setPath); };
  }, []);
  return path;
}
