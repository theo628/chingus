import { useEffect, useLayoutEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { C } from "./theme";
import { useRoute, pathParts, navigate, lastNavigation } from "./lib/router";
import Website from "./site/Website";
import App from "./app/App";

/* Routes:  #/ → website · #/app/… → the Chingus app (see app/App.jsx) */

const TITLES = {
  "": "Chingus — find your K-people",
  login: "Log in · Chingus",
  welcome: "Create your fan card · Chingus",
  discover: "Discover · Chingus",
  rooms: "Rooms · Chingus",
  learn: "Learn Korean · Chingus",
  events: "Events · Chingus",
  chats: "Chats · Chingus",
  profile: "Your card · Chingus",
};

export default function Root() {
  const path = useRoute();
  const parts = pathParts(path);
  const isApp = parts[0] === "app";
  const scrolls = useRef(new Map());
  const pathRef = useRef(path);

  // Unknown pages fall back to the website.
  useEffect(() => {
    if (parts.length && !isApp) navigate("/", { replace: true });
  }, [path]);

  useEffect(() => {
    document.title = isApp ? TITLES[parts[1] || "discover"] || "Chingus" : TITLES[""];
  }, [path]);

  // Remember scroll per page: back/forward restores it, new pages start at the top.
  useEffect(() => {
    const onScroll = () => scrolls.current.set(pathRef.current, window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useLayoutEffect(() => {
    pathRef.current = path;
    const y = lastNavigation() === "pop" ? scrolls.current.get(path) || 0 : 0;
    window.scrollTo(0, y);
  }, [path]);

  if (isApp) {
    return (
      <div className="kc-embedded">
        <button
          onClick={() => { const m = document.getElementById("main"); if (m) { m.setAttribute("tabindex", "-1"); m.focus(); } }}
          className="sr-only focus:not-sr-only focus:fixed focus:top-10 focus:left-2 focus:z-[80] focus:rounded-lg focus:px-3 focus:py-2 focus:bg-white"
        >
          Skip to content
        </button>
        <div className="fixed top-0 left-0 right-0 kc-safe-top" style={{ zIndex: 50, backgroundColor: C.ink }}>
          <div className="max-w-md md:max-w-2xl lg:max-w-none mx-auto px-4 lg:px-6 flex items-center justify-between" style={{ height: 30 }}>
            <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#CFC7E8" }}>
              <ArrowLeft size={13} /> Back to website
            </button>
            <span className="text-xs" style={{ color: "#8E82B5" }}>App v1.8</span>
          </div>
        </div>
        <div style={{ paddingTop: "var(--topbar-h)" }}>
          <App parts={parts.slice(1)} />
        </div>
      </div>
    );
  }

  return <Website onOpenApp={() => navigate("/app/login")} />;
}
