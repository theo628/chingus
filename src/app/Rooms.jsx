import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { C } from "../theme";
import { isSubmitKey } from "../lib/helpers";
import { Tag, SectionTitle } from "../components/ui";

export function roomDefsFor(me) {
  return [
    ...me.fandoms.slice(0, 3).map((f) => ({ id: "r-" + f, name: f + " India", desc: "All things " + f + ", desi edition", tone: "pink", seed: [
      { who: "Priya", text: "Comeback teaser DROPPED. I am not okay." },
      { who: "Kevin", text: "Streaming party tonight 9pm IST — who's in?" },
    ]})),
    { id: "r-city", name: me.city + " K-fans", desc: "Meetups, cafés & events in " + me.city, tone: "lilac", seed: [
      { who: "Rohan", text: "Anyone tried the new Korean place near the metro? Rating pls" },
      { who: "Meera", text: "Planning a cup-sleeve event next month — need 2 volunteers!" },
    ]},
    { id: "r-lang", name: "Korean Study Circle", desc: "TTMIK buddies, TOPIK prep, daily Hangul", tone: "mint", seed: [
      { who: "Zoya", text: "오늘의 단어: 우정 (u-jeong) = friendship 🤝" },
      { who: "Lakshmi", text: "Batch 3 of the Hangul-in-90-mins workshop is open!" },
    ]},
    { id: "r-drama", name: "Drama Discussions", desc: "Spoiler-tagged, tissue-recommended", tone: "butter", seed: [
      { who: "Ananya", text: "Queen of Tears ep 14 destroyed me. That's it. That's the post." },
    ]},
  ];
}

/* ─────────────────────────  Rooms  ───────────────────────── */
export default function Rooms({ me, posts, openId, onOpen, onClose, onPost }) {
  const roomDefs = roomDefsFor(me);
  const [drafts, setDrafts] = useState({});
  const bottomRef = useRef(null);

  const room = roomDefs.find((r) => r.id === openId);
  const msgs = room ? [...room.seed, ...(posts[room.id] || [])] : [];
  const draft = (room && drafts[room.id]) || "";
  const setDraft = (text) => room && setDrafts((d) => ({ ...d, [room.id]: text }));

  useEffect(() => {
    if (room) bottomRef.current?.scrollIntoView({ block: "end" });
  }, [msgs.length, openId]);

  const post = () => {
    if (!draft.trim() || !room) return;
    onPost(room.id, draft.trim());
    setDraft("");
  };

  if (room) {
    return (
      <div className="flex flex-col kc-thread">
        <div className="sticky kc-sticky-top z-10 px-5 pt-5 pb-3 flex items-center gap-3" style={{ backgroundColor: C.bg, borderBottom: `1.5px solid ${C.line}` }}>
          <button onClick={onClose} aria-label="Back to rooms" className="p-1 -m-1"><ArrowLeft size={20} style={{ color: C.ink }} /></button>
          <div className="min-w-0">
            <h2 className="kc-display text-xl leading-tight truncate" style={{ color: C.ink }}>{room.name}</h2>
            <div className="text-xs truncate" style={{ color: C.sub }}>{room.desc}</div>
          </div>
        </div>
        <div className="flex-1 px-5 py-4 space-y-3" aria-live="polite">
          {msgs.map((m, i) => {
            const mine = m.mine || (typeof m.who === "string" && m.who.includes("(you)"));
            return (
              <div key={i} data-mine={mine ? "true" : undefined} className="rounded-2xl px-4 py-2.5 break-words" style={{ backgroundColor: mine ? C.pinkSoft : C.card, border: `1.5px solid ${C.line}` }}>
                <div className="text-xs font-semibold" style={{ color: C.pink }}>{mine ? me.name + " (you)" : m.who}</div>
                <div className="text-sm mt-0.5 whitespace-pre-wrap" style={{ color: C.ink }}>{m.text}</div>
              </div>
            );
          })}
          <div ref={bottomRef} style={{ scrollMarginBottom: 96 }} />
        </div>
        <div className="sticky kc-sticky-bottom z-10 px-5 pt-2 pb-3" style={{ backgroundColor: C.bg }}>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); post(); }}>
            <input
              value={draft} onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !isSubmitKey(e)) e.preventDefault(); }}
              placeholder={"Message " + room.name + "…"}
              aria-label={"Message " + room.name}
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

  return (
    <div className="px-5 pt-5 lg:pt-8 pb-28 lg:pb-12 space-y-3">
      <SectionTitle kr="모임" en="Rooms" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {roomDefs.map((r) => {
          const count = (posts[r.id] || []).length;
          return (
            <button
              key={r.id} onClick={() => onOpen(r.id)}
              className="w-full text-left rounded-3xl p-4 flex items-center justify-between gap-3"
              style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}` }}
            >
              <div className="min-w-0">
                <div className="kc-display text-lg" style={{ color: C.ink }}>{r.name}</div>
                <div className="text-xs mt-0.5" style={{ color: C.sub }}>
                  {r.desc}{count > 0 ? ` · ${count} ${count === 1 ? "post" : "posts"} from you` : ""}
                </div>
              </div>
              <span className="shrink-0"><Tag label="Open" tone={r.tone} /></span>
            </button>
          );
        })}
      </div>
      <p className="text-xs pt-1" style={{ color: C.sub }}>
        Rooms are created from your fandoms, city and study interests.
      </p>
    </div>
  );
}
