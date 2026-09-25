import { useState, useEffect, useRef } from "react";
import { MapPin, Send, Pencil, LogOut, Trash2, Smartphone } from "lucide-react";
import { C } from "../theme";
import { store } from "../lib/store";
import { maskPhone } from "../lib/helpers";
import { Avatar, Tag, SectionTitle, ConfirmDialog } from "../components/ui";

/* ─────────────────────────  Profile  ───────────────────────── */
export default function Profile({ me, connections, phone, onEdit, onLogout, onDeleteData }) {
  const [feedback, setFeedback] = useState("");
  const [sent, setSent] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const sendFeedback = async () => {
    if (!feedback.trim()) return;
    const saved = await store.get("kc:feedback");
    const prev = Array.isArray(saved) ? saved : [];
    await store.set("kc:feedback", [...prev, { text: feedback.trim(), at: new Date().toISOString() }]);
    setFeedback("");
    setSent(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="px-5 pt-5 lg:pt-8 pb-28 lg:pb-12">
      <SectionTitle kr="프로필" en="Your card" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <div className="rounded-3xl p-5 relative" style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}`, boxShadow: "0 4px 0 " + C.line }}>
            <div className="absolute -top-2 -right-2 kc-display text-sm px-2.5 py-1 rounded-full -rotate-3" style={{ backgroundColor: C.mint, color: "#fff" }}>
              {connections.length} waves
            </div>
            <div className="flex items-center gap-3">
              <Avatar photo={me.photo} emoji="💜" size={56} radius={16} rotate={3} />
              <div className="min-w-0">
                <div className="kc-display text-2xl break-words" style={{ color: C.ink }}>{me.name}</div>
                <div className="flex items-start gap-1 text-xs" style={{ color: C.sub }}>
                  <MapPin size={12} className="shrink-0 mt-0.5" /> <span>{me.city} · {me.langs.join(", ")}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              <div className="flex flex-wrap gap-1.5">{me.fandoms.map((f) => <Tag key={f} label={f} tone="pink" />)}</div>
              <div className="flex flex-wrap gap-1.5">{me.dramas.map((d) => <Tag key={d} label={d} tone="lilac" />)}</div>
              <div className="flex flex-wrap gap-1.5">{me.vibes.map((v) => <Tag key={v} label={v} tone="butter" />)}</div>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="w-full rounded-2xl py-3 flex items-center justify-center gap-2 text-sm font-semibold"
            style={{ backgroundColor: C.lilacSoft, color: "#5D4BD1" }}
          >
            <Pencil size={15} /> Edit my interests
          </button>
        </div>
        <div className="space-y-4">
        <div className="rounded-3xl p-4" style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}` }}>
          <div className="kc-display text-lg" style={{ color: C.ink }}>Tell us anything</div>
          <p className="text-xs mt-0.5 mb-2.5" style={{ color: C.sub }}>
            Ideas, bugs, missing fandoms, rants — it all helps shape the platform.
          </p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            placeholder="Write freely…"
            aria-label="Feedback"
            className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-y block"
            style={{ backgroundColor: C.bg, border: `1.5px solid ${C.line}`, color: C.ink, minHeight: 96 }}
          />
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
            <span className="text-xs" role="status" style={{ color: sent ? "#199A76" : C.sub }}>
              {sent ? "Sent — thank you! 💌" : feedback.trim() ? feedback.trim().length + " characters" : ""}
            </span>
            <button
              onClick={sendFeedback}
              disabled={!feedback.trim()}
              className="ml-auto rounded-xl px-4 py-2 flex items-center gap-1.5 text-sm font-semibold"
              style={{ backgroundColor: C.pink, color: "#fff", opacity: feedback.trim() ? 1 : 0.35 }}
            >
              <Send size={14} /> Send feedback
            </button>
          </div>
        </div>
        <div className="rounded-3xl p-4" style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}` }}>
          <div className="kc-display text-lg" style={{ color: C.ink }}>Account</div>
          <p className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: C.sub }}>
            <Smartphone size={13} className="shrink-0" /> Signed in as {maskPhone(phone)} · saved on this device
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={onLogout}
              className="rounded-2xl py-2.5 flex items-center justify-center gap-2 text-sm font-semibold"
              style={{ backgroundColor: C.lilacSoft, color: "#5D4BD1" }}
            >
              <LogOut size={15} /> Log out
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="rounded-2xl py-2.5 flex items-center justify-center gap-2 text-sm font-semibold"
              style={{ backgroundColor: C.pinkSoft, color: C.pink }}
            >
              <Trash2 size={15} /> Delete my data
            </button>
          </div>
        </div>
        </div>
      </div>
      <p className="text-center text-xs mt-4" style={{ color: C.sub }}>Chingus · v1.8</p>
      <ConfirmDialog
        open={confirmDelete}
        title="Delete everything?"
        body="Your fan card, waves, chats, room posts and Korean progress will be wiped from this device. This can't be undone."
        confirmLabel="Delete"
        danger
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => { setConfirmDelete(false); onDeleteData(); }}
      />
    </div>
  );
}
