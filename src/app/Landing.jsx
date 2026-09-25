import { Sparkles, Users, Calendar, WandSparkles, ArrowRight } from "lucide-react";
import { C } from "../theme";

/* ─────────────────────────  Landing  ───────────────────────── */
export default function Landing({ onStart }) {
  const feats = [
    { icon: Sparkles, tone: C.pink, bg: C.pinkSoft, title: "Match by what you love", text: "Fandom, drama taste, city and language — get sorted with fans you'd actually get along with, not random strangers." },
    { icon: Users, tone: "#5D4BD1", bg: C.lilacSoft, title: "Rooms for your people", text: "Your fandom's India room, your city's meetup room, and a Korean study circle — auto-created from your interests." },
    { icon: Calendar, tone: "#9A7A00", bg: C.butterSoft, title: "Never miss an event", text: "Cup-sleeve cafés, watch parties, Hangul workshops and contest rounds happening near you." },
    { icon: WandSparkles, tone: "#199A76", bg: C.mintSoft, title: "Icebreakers written for you", text: "Awkward at openers? One tap writes a friendly first message from your shared interests." },
  ];
  return (
    <div className="min-h-screen kc-body kc-safe-top" style={{ backgroundColor: C.bg }}>
      <div className="max-w-md md:max-w-2xl mx-auto px-5 pt-12 pb-10 flex flex-col min-h-screen">
        <div className="md:max-w-md">
          <div className="kc-display leading-none" style={{ fontSize: 76, color: C.pink }}>안녕,<br />Chingus</div>
          <p className="mt-4 text-base leading-relaxed" style={{ color: C.ink }}>
            Fifteen million of us watch the dramas, stream the comebacks, and learn the language —
            mostly alone. This is where Indian K-culture fans find each other.
          </p>
          <button
            onClick={onStart}
            className="mt-6 w-full rounded-2xl py-4 flex items-center justify-center gap-2 text-base font-semibold"
            style={{ backgroundColor: C.pink, color: "#fff", boxShadow: "0 4px 0 #D93A66" }}
          >
            Find my K-people <ArrowRight size={18} />
          </button>
          <p className="text-center text-xs mt-2" style={{ color: C.sub }}>Free · takes under a minute</p>
        </div>

        <div className="mt-10 space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-3">
          {feats.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-3xl p-4 flex gap-3" style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: f.bg }}>
                  <Icon size={19} style={{ color: f.tone }} />
                </div>
                <div>
                  <div className="kc-display text-lg leading-tight" style={{ color: C.ink }}>{f.title}</div>
                  <p className="text-sm mt-0.5" style={{ color: C.sub }}>{f.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl p-5 text-center" style={{ backgroundColor: C.ink }}>
          <div className="kc-display text-2xl" style={{ color: C.butter }}>From Chennai to Guwahati</div>
          <p className="text-sm mt-1.5" style={{ color: "#CFC7E8" }}>
            Fans in 10+ cities, chatting in 8 languages. Your bias has fans in your pincode — go find them.
          </p>
          <button
            onClick={onStart}
            className="mt-4 rounded-2xl px-6 py-3 text-sm font-semibold"
            style={{ backgroundColor: C.butter, color: C.ink }}
          >
            Create my fan card
          </button>
        </div>

        <p className="text-center text-xs mt-8" style={{ color: C.sub }}>Chingus · v1.8</p>
      </div>
    </div>
  );
}
