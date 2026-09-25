/* ─────────────────────────  Helpers  ───────────────────────── */
export function matchScore(me, other) {
  if (!me) return 0;
  const overlap = (a = [], b = []) => a.filter((x) => b.includes(x)).length;
  let s = 0;
  s += overlap(me.fandoms, other.fandoms) * 18;
  s += overlap(me.dramas, other.dramas) * 12;
  s += overlap(me.vibes, other.vibes) * 10;
  if (me.city === other.city) s += 20;
  if (overlap(me.langs, other.langs) > 0) s += 8;
  return Math.min(99, Math.max(12, s));
}

export function sharedTags(me, other) {
  if (!me) return [];
  const all = [...(me.fandoms || []), ...(me.dramas || []), ...(me.vibes || [])];
  const theirs = [...other.fandoms, ...other.dramas, ...other.vibes];
  return all.filter((t) => theirs.includes(t));
}

export function resizePhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");
        const s = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => reject(new Error("bad image"));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

/* Enter-to-submit that ignores Enter while an IME (Korean, Hindi, Tamil keyboards…) is composing. */
export function isSubmitKey(e) {
  return e.key === "Enter" && !e.shiftKey && !(e.nativeEvent && e.nativeEvent.isComposing) && e.keyCode !== 229;
}

const isStrArr = (v) => Array.isArray(v) && v.every((x) => typeof x === "string");

/* Saved data can be edited, truncated or come from an older version — never trust its shape. */
export function sanitizeProfile(p) {
  if (!p || typeof p !== "object" || typeof p.name !== "string" || !p.name.trim() || typeof p.city !== "string") return null;
  const lists = ["langs", "fandoms", "dramas", "vibes"];
  if (!lists.every((k) => isStrArr(p[k]))) return null;
  return {
    name: p.name, city: p.city, langs: p.langs, fandoms: p.fandoms, dramas: p.dramas, vibes: p.vibes,
    emoji: typeof p.emoji === "string" ? p.emoji : "💜",
    photo: typeof p.photo === "string" && p.photo.startsWith("data:image/") ? p.photo : null,
  };
}

export function sanitizeMessages(obj, isValid) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return {};
  const out = {};
  for (const [k, list] of Object.entries(obj)) {
    if (Array.isArray(list)) out[k] = list.filter((m) => m && typeof m.text === "string" && isValid(m));
  }
  return out;
}

export function formatTime(ts) {
  if (typeof ts !== "number") return "";
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  try {
    return sameDay
      ? d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : d.toLocaleDateString([], { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}

export const maskPhone = (phone) => {
  const d = String(phone || "").replace(/\D/g, "").slice(-10);
  return d.length === 10 ? "+91 " + d.slice(0, 2) + "••• ••" + d.slice(7) : "";
};

/* ─────────────────────────  Speech  ───────────────────────── */
// Some browsers (Chrome) load voices asynchronously — warm the list up early.
try { window.speechSynthesis && window.speechSynthesis.getVoices(); } catch { /* no TTS */ }

export function speakKr(text) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ko-KR";
    const v = window.speechSynthesis.getVoices().find((x) => x.lang && x.lang.toLowerCase().startsWith("ko"));
    if (v) u.voice = v;
    u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch { /* no TTS available */ }
}

export function stopSpeech() {
  try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch { /* no TTS */ }
}
