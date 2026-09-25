import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft, MessageCircle, WandSparkles, Sparkles } from "lucide-react";
import { C } from "../theme";
import { MOCK_USERS, CANNED_ICEBREAKERS } from "../data";
import { matchScore, sharedTags, isSubmitKey, formatTime } from "../lib/helpers";
import { SectionTitle } from "../components/ui";

async function fetchIcebreaker(payload) {
  const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), 20000) : null;
  try {
    const res = await fetch("/api/icebreaker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined,
    });
    if (!res.ok) throw new Error("http " + res.status);
    const data = await res.json();
    return String(data.text || "").trim();
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function TypingBubble({ name }) {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl px-4 py-2.5 text-sm italic" style={{ backgroundColor: C.card, color: C.sub, border: `1.5px solid ${C.line}`, borderBottomLeftRadius: 6 }}>
        {name} is typing…
      </div>
    </div>
  );
}

/* ─────────────────────────  Chats  ───────────────────────── */
export default function Chats({ me, connections, chats, typing, openId, onOpen, onClose, onSend, onGoDiscover }) {
  const [drafts, setDrafts] = useState({});
  const [loadingIce, setLoadingIce] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  const friends = MOCK_USERS.filter((u) => connections.includes(u.id));
  const open = friends.find((u) => u.id === openId);
  const msgs = (open && chats[open.id]) || [];
  const isTyping = !!(open && typing[open.id]);
  const draft = (open && drafts[open.id]) || "";
  const setDraft = (text) => open && setDrafts((d) => ({ ...d, [open.id]: text }));

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ block: "end" });
  }, [msgs.length, isTyping, openId]);

  const send = () => {
    if (!draft.trim() || !open) return;
    onSend(open.id, draft.trim());
    setDraft("");
  };

  const icebreak = async () => {
    if (!open || loadingIce) return;
    const target = open;
    setLoadingIce(true);
    const shared = sharedTags(me, target);
    let text = "";
    try {
      text = await fetchIcebreaker({ from: me.name, to: target.name, city: target.city, shared });
    } catch { /* fall back to canned below */ }
    if (!text) {
      text = CANNED_ICEBREAKERS[Math.floor(Math.random() * CANNED_ICEBREAKERS.length)]
        .replace("{shared}", shared[0] || "K-dramas")
        .replace("{city}", target.city);
    }
    if (!alive.current) return;
    setDrafts((d) => ({ ...d, [target.id]: text }));
    setLoadingIce(false);
    inputRef.current?.focus();
  };

  if (open) {
    return (
      <div className="flex flex-col kc-thread">
        <div className="sticky kc-sticky-top z-10 px-5 pt-5 pb-3 flex items-center gap-3" style={{ backgroundColor: C.bg, borderBottom: `1.5px solid ${C.line}` }}>
          <button onClick={onClose} aria-label="Back to chats" className="p-1 -m-1"><ArrowLeft size={20} style={{ color: C.ink }} /></button>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: C.lilacSoft }}>{open.emoji}</div>
          <div className="min-w-0">
            <h2 className="kc-display text-lg leading-tight" style={{ color: C.ink }}>{open.name}</h2>
            <div className="text-xs truncate" style={{ color: C.sub }}>{open.city} · {matchScore(me, open)}% match</div>
          </div>
        </div>
        <div className="flex-1 px-5 py-4 space-y-2" aria-live="polite">
          {msgs.length === 0 && (
            <div className="rounded-2xl p-4 text-sm text-center" style={{ backgroundColor: C.butterSoft, color: "#7A6100" }}>
              You waved at {open.name}! Say something — or let the app write your icebreaker.
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={"flex " + (m.from === "me" ? "justify-end" : "justify-start")}>
              <div
                data-from={m.from}
                className="max-w-[80%] sm:max-w-sm rounded-2xl px-4 py-2.5 text-sm break-words whitespace-pre-wrap"
                style={m.from === "me"
                  ? { backgroundColor: C.pink, color: "#fff", borderBottomRightRadius: 6 }
                  : { backgroundColor: C.card, color: C.ink, border: `1.5px solid ${C.line}`, borderBottomLeftRadius: 6 }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && <TypingBubble name={open.name} />}
          <div ref={bottomRef} style={{ scrollMarginBottom: 140 }} />
        </div>
        <div className="sticky kc-sticky-bottom z-10 px-5 pt-2 pb-3 space-y-2" style={{ backgroundColor: C.bg }}>
          <button
            onClick={icebreak} disabled={loadingIce}
            className="rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
            style={{ backgroundColor: C.lilacSoft, color: "#5D4BD1", opacity: loadingIce ? 0.6 : 1 }}
          >
            <WandSparkles size={13} /> {loadingIce ? "Writing…" : "Write an icebreaker for me"}
          </button>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <input
              ref={inputRef}
              value={draft} onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !isSubmitKey(e)) e.preventDefault(); }}
              placeholder={"Message " + open.name + "…"}
              aria-label={"Message " + open.name}
              enterKeyHint="send"
              maxLength={500}
              autoComplete="off"
              className="flex-1 min-w-0 rounded-2xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}`, color: C.ink }}
            />
            <button type="submit" disabled={!draft.trim()} aria-label="Send" className="rounded-2xl px-4 shrink-0" style={{ backgroundColor: C.pink, color: "#fff", opacity: draft.trim() ? 1 : 0.5 }}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  const lastAt = (u) => { const l = chats[u.id]; return (l && l.length && l[l.length - 1].at) || 0; };
  const sortedFriends = [...friends].sort((a, b) => lastAt(b) - lastAt(a) || connections.indexOf(b.id) - connections.indexOf(a.id));

  return (
    <div className="px-5 pt-5 lg:pt-8 pb-28 lg:pb-12 space-y-3">
      <SectionTitle kr="친구" en="Your chats" />
      {friends.length === 0 && (
        <div className="rounded-3xl p-6 text-center" style={{ backgroundColor: C.card, border: `1.5px dashed ${C.line}` }}>
          <div className="text-3xl">👋</div>
          <div className="kc-display text-lg mt-2" style={{ color: C.ink }}>No waves yet</div>
          <p className="text-sm mt-1" style={{ color: C.sub }}>Wave at someone in Discover to start a chat.</p>
          <button onClick={onGoDiscover} className="mt-4 rounded-2xl px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-1.5" style={{ backgroundColor: C.pink, color: "#fff" }}>
            <Sparkles size={15} /> Go to Discover
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {sortedFriends.map((u) => {
          const last = (chats[u.id] || []).slice(-1)[0];
          return (
            <button
              key={u.id} onClick={() => onOpen(u.id)}
              className="w-full text-left rounded-3xl p-4 flex items-center gap-3"
              style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}` }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: C.lilacSoft }}>{u.emoji}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="kc-display text-lg" style={{ color: C.ink }}>{u.name}</span>
                  {last && last.at && <span className="text-[11px] shrink-0" style={{ color: C.sub }}>{formatTime(last.at)}</span>}
                </div>
                <div className="text-xs truncate" style={{ color: typing[u.id] ? C.pink : C.sub }}>
                  {typing[u.id] ? "typing…" : last ? (last.from === "me" ? "You: " : "") + last.text : "Say annyeong 👋"}
                </div>
              </div>
              <MessageCircle size={18} className="shrink-0" style={{ color: C.pink }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
