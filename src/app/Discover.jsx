import { MapPin, Check } from "lucide-react";
import { C } from "../theme";
import { MOCK_USERS } from "../data";
import { matchScore, sharedTags } from "../lib/helpers";
import { Tag } from "../components/ui";

/* ─────────────────────────  Discover  ───────────────────────── */
function PhotoCard({ user, me, waved, onWave, onChat }) {
  const score = matchScore(me, user);
  const shared = sharedTags(me, user);
  return (
    <div className="rounded-3xl p-4 relative flex flex-col" style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}`, boxShadow: "0 4px 0 " + C.line }}>
      <div
        className="absolute -top-2 -right-2 kc-display text-sm px-2.5 py-1 rounded-full rotate-3"
        style={{ backgroundColor: C.butter, color: C.ink }}
      >
        {score}% match
      </div>
      <div className="flex items-start gap-3">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 -rotate-3"
          style={{ backgroundColor: C.lilacSoft, border: `1.5px solid ${C.line}` }}
        >
          {user.emoji}
        </div>
        <div className="min-w-0">
          <div className="kc-display text-xl leading-tight pr-14" style={{ color: C.ink }}>
            {user.name}, {user.age}
          </div>
          <div className="flex items-start gap-1 text-xs mt-0.5" style={{ color: C.sub }}>
            <MapPin size={12} className="shrink-0 mt-px" /> <span>{user.city} · {user.langs.slice(0, 2).join(", ")}</span>
          </div>
        </div>
      </div>
      <p className="text-sm mt-3 leading-relaxed" style={{ color: C.ink }}>{user.bio}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {user.fandoms.map((f) => <Tag key={f} label={f} tone={shared.includes(f) ? "pink" : "lilac"} />)}
        {user.dramas.slice(0, 2).map((d) => <Tag key={d} label={d} tone={shared.includes(d) ? "pink" : "mint"} />)}
        {user.vibes.slice(0, 2).map((v) => <Tag key={v} label={v} tone={shared.includes(v) ? "pink" : "butter"} />)}
      </div>
      {shared.length > 0 && (
        <div className="text-xs mt-2" style={{ color: C.pink }}>
          {shared.length} shared {shared.length === 1 ? "interest" : "interests"} — pink tags
        </div>
      )}
      <div className="mt-auto pt-4">
        {waved ? (
          <button
            onClick={onChat}
            className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm font-semibold"
            style={{ backgroundColor: C.mintSoft, color: "#199A76" }}
          >
            <Check size={16} /> Waved — open chat
          </button>
        ) : (
          <button
            onClick={onWave}
            className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm font-semibold"
            style={{ backgroundColor: C.pink, color: "#fff" }}
          >
            👋 Wave annyeong
          </button>
        )}
      </div>
    </div>
  );
}

export default function Discover({ me, connections, onWave, onOpenChat }) {
  const sorted = [...MOCK_USERS].sort((a, b) => matchScore(me, b) - matchScore(me, a));
  return (
    <div className="px-5 pb-28 lg:pb-12 pt-5 lg:pt-8 space-y-4">
      <div>
        <div className="kc-display text-3xl" style={{ color: C.ink }}>
          Annyeong, {me.name} <span style={{ color: C.pink }}>💗</span>
        </div>
        <p className="text-sm mt-0.5" style={{ color: C.sub }}>
          {sorted.length} fans sorted by how much you'd get along
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sorted.map((u) => (
          <PhotoCard
            key={u.id}
            user={u}
            me={me}
            waved={connections.includes(u.id)}
            onWave={() => onWave(u.id)}
            onChat={() => onOpenChat(u.id)}
          />
        ))}
      </div>
      <p className="text-center text-xs pt-2" style={{ color: C.sub }}>
        Demo profiles — in the real app this would be live fans near you.
      </p>
    </div>
  );
}
