import { MapPin, Calendar } from "lucide-react";
import { C } from "../theme";
import { EVENTS } from "../data";
import { Tag, SectionTitle } from "../components/ui";

/* ─────────────────────────  Events  ───────────────────────── */
export default function Events() {
  const toneFor = { Contest: "pink", Meetup: "butter", Language: "mint", "Watch party": "lilac" };
  return (
    <div className="px-5 pt-5 lg:pt-8 pb-28 lg:pb-12 space-y-3">
      <SectionTitle kr="행사" en="Events near you" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {EVENTS.map((e) => (
          <div key={e.id} className="rounded-3xl p-4" style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}` }}>
            <div className="flex items-start justify-between gap-2">
              <div className="kc-display text-lg leading-snug" style={{ color: C.ink }}>{e.title}</div>
              <span className="shrink-0"><Tag label={e.tag} tone={toneFor[e.tag] || "lilac"} /></span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-1.5" style={{ color: C.sub }}>
              <span className="flex items-center gap-1"><MapPin size={12} /> {e.where}</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {e.when}</span>
            </div>
            <p className="text-sm mt-2" style={{ color: C.ink }}>{e.note}</p>
          </div>
        ))}
      </div>
      <p className="text-xs pt-1" style={{ color: C.sub }}>
        Sample listings — a live version would pull fan-club and KCCI calendars.
      </p>
    </div>
  );
}
