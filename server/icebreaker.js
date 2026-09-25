/* Icebreaker generator — keeps the Anthropic API key on the server.
 * The browser sends only names, city and shared tags; the prompt is built here. */

const clean = (v, max) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);

export async function generateIcebreaker(input) {
  const from = clean(input?.from, 40) || "a fan";
  const to = clean(input?.to, 40) || "a new friend";
  const city = clean(input?.city, 40) || "India";
  const shared = (Array.isArray(input?.shared) ? input.shared : [])
    .slice(0, 12)
    .map((s) => clean(s, 60))
    .filter(Boolean);

  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();

  const response = await client.beta.messages.create({
    model: "claude-opus-5",
    max_tokens: 2000,
    output_config: { effort: "low" },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    messages: [{
      role: "user",
      content:
        `Write ONE short, friendly, casual icebreaker message (max 25 words) from an Indian K-culture fan named ${from} to a new friend named ${to} in ${city}. ` +
        `Shared interests: ${shared.join(", ") || "Korean culture"}. It should feel warm and specific, maybe one emoji, no hashtags. ` +
        `Respond with ONLY the message text, nothing else.`,
    }],
  });

  if (response.stop_reason === "refusal") return "";
  return response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join(" ")
    .trim();
}

function readJson(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 10_000) reject(new Error("payload too large"));
    });
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

/* Basic abuse protection: same-origin browser calls only, and a small per-IP budget.
 * (In-memory, so it's per server instance — put a shared limiter in front for real traffic.) */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const hits = new Map();

export function rateLimited(ip, now = Date.now()) {
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) { hits.set(ip, recent); return true; }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  return (typeof fwd === "string" && fwd.split(",")[0].trim()) || req.socket?.remoteAddress || "unknown";
}

export function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // non-browser clients send no Origin; the rate limit still applies
  try {
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// Node (req, res) handler — works as Vite middleware and as a Vercel function.
export async function icebreakerHandler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "method_not_allowed" });
  }
  if (!sameOrigin(req)) return sendJson(res, 403, { error: "forbidden" });
  if (rateLimited(clientIp(req))) {
    res.setHeader("Retry-After", "60");
    return sendJson(res, 429, { error: "rate_limited" });
  }
  let body;
  try { body = await readJson(req); }
  catch { return sendJson(res, 400, { error: "bad_request" }); }

  try {
    const text = await generateIcebreaker(body);
    return sendJson(res, text ? 200 : 502, { text });
  } catch (err) {
    const status = typeof err?.status === "number" && err.status === 429 ? 429 : 502;
    console.error("[icebreaker]", err?.status ?? "", err?.message ?? err);
    return sendJson(res, status, { error: "generation_failed" });
  }
}
