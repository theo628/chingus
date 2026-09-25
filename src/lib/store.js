/* Async key/value store backed by localStorage.
 * Falls back to memory when storage is unavailable (private mode, blocked cookies, quota). */
const memory = new Map();

function ls() {
  try {
    const s = window.localStorage;
    const probe = "__kc_probe__";
    s.setItem(probe, probe);
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}
const storage = typeof window !== "undefined" ? ls() : null;

export const store = {
  async get(key) {
    try {
      const raw = memory.has(key) ? memory.get(key) : storage ? storage.getItem(key) : null;
      return raw == null ? null : JSON.parse(raw);
    } catch {
      return null;
    }
  },
  async set(key, val) {
    const raw = JSON.stringify(val);
    memory.set(key, raw);
    try { if (storage) storage.setItem(key, raw); } catch { /* quota — keep in memory */ }
  },
  async del(key) {
    memory.delete(key);
    try { if (storage) storage.removeItem(key); } catch { /* ignore */ }
  },
  /* Removes every key starting with `prefix`. */
  async delPrefix(prefix) {
    [...memory.keys()].filter((k) => k.startsWith(prefix)).forEach((k) => memory.delete(k));
    try {
      if (!storage) return;
      const keys = [];
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        if (k && k.startsWith(prefix)) keys.push(k);
      }
      keys.forEach((k) => storage.removeItem(k));
    } catch { /* ignore */ }
  },
};

/* Per-account key namespace (one account per verified mobile number). */
export const accountNs = (phone) => "kc:acct:" + String(phone || "").replace(/\D/g, "").slice(-10) + ":";
