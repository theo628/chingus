import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { icebreakerHandler } from "./server/icebreaker.js";

// Serves POST /api/icebreaker during `npm run dev` and `npm run preview`,
// mirroring the serverless function in api/icebreaker.js.
function icebreakerApi() {
  return {
    name: "chingus-icebreaker-api",
    configureServer(server) {
      server.middlewares.use("/api/icebreaker", icebreakerHandler);
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api/icebreaker", icebreakerHandler);
    },
  };
}

/* Artifact builds are served from a sub-path with no server: asset URLs must be relative and
 * the installable/offline extras (manifest, icons, service worker) don't apply. */
function artifactHtml(enabled) {
  return {
    name: "chingus-artifact-html",
    transformIndexHtml(html) {
      if (!enabled) return html;
      return html
        .replace(/\s*<link rel="manifest"[^>]*>/g, "")
        .replace(/\s*<link rel="icon"[^>]*>/g, "")
        .replace(/\s*<link rel="apple-touch-icon"[^>]*>/g, "");
    },
  };
}

export default defineConfig(({ mode }) => {
  const artifact = process.env.VITE_ARTIFACT === "1";
  const env = loadEnv(mode, process.cwd(), "");
  if (env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
  }
  return {
    base: artifact ? "./" : "/",
    plugins: [react(), icebreakerApi(), artifactHtml(artifact)],
    build: {
      // Transpile down so older (2020+) Safari, Chrome, Edge and Firefox still run the app.
      target: ["es2019", "chrome79", "edge79", "firefox72", "safari13"],
    },
  };
});
