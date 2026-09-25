import { useState } from "react";
import { Sparkles, Users, ArrowRight, Smartphone, ChevronDown, Languages } from "lucide-react";
import { C } from "../theme";

/* ═════════════════════════  WEBSITE (W1.1)  ═════════════════════════ */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl" style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}` }}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="w-full flex items-center justify-between gap-3 text-left px-4 py-3.5">
        <span className="text-sm font-semibold" style={{ color: C.ink }}>{q}</span>
        <ChevronDown size={16} className="shrink-0" style={{ color: C.sub, transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
      </button>
      {open && <p className="px-4 pb-4 text-sm leading-relaxed" style={{ color: C.sub }}>{a}</p>}
    </div>
  );
}

// In-page links use scrolling rather than #anchors, because the hash holds the route.
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export default function Website({ onOpenApp }) {
  const steps = [
    { n: "1", title: "Make your fan card", text: "Name, city, languages, fandoms, dramas — under a minute, photo optional." },
    { n: "2", title: "Wave at your matches", text: "We sort fans by shared interests, city and language. Wave annyeong at anyone." },
    { n: "3", title: "Meet, chat, show up", text: "Chat with icebreakers written for you, join rooms, and catch events near you." },
  ];

  const faqs = [
    { q: "Is it free?", a: "Yes. The prototype is completely free — make your card, match, chat, and join rooms without paying anything." },
    { q: "Which cities are covered?", a: "Ten cities in the demo — Chennai, Coimbatore, Bengaluru, Delhi NCR, Mumbai, Hyderabad, Kochi, Guwahati, Kolkata and Pune — with fans chatting in eight Indian languages plus English." },
    { q: "Is this for talking to Koreans?", a: "No — apps like MEEFF and HelloTalk already do that well. Chingus is for finding fellow Indian fans: people in your city, in your language, in your fandom." },
    { q: "How is my data handled?", a: "In this prototype, your profile and chats are stored privately for your account and you can wipe everything with one tap from the Profile tab." },
  ];

  return (
    <div className="min-h-screen kc-body" style={{ backgroundColor: C.bg }}>
      {/* Nav */}
      <header className="sticky top-0 kc-safe-top" style={{ zIndex: 40, backgroundColor: C.bg, borderBottom: `1.5px solid ${C.line}` }}>
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 shrink-0" aria-label="Chingus — back to top">
            <span className="kc-display text-xl" style={{ color: C.pink }}>친구</span>
            <span className="kc-display text-xl" style={{ color: C.ink }}>Chingus</span>
          </button>
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Website">
            <button onClick={() => scrollToSection("how")} className="hidden sm:inline-block rounded-full px-3 py-2 text-sm font-medium" style={{ color: C.sub }}>
              How it works
            </button>
            <button onClick={() => scrollToSection("faq")} className="hidden sm:inline-block rounded-full px-3 py-2 text-sm font-medium" style={{ color: C.sub }}>
              FAQ
            </button>
            <button onClick={onOpenApp} className="rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap" style={{ backgroundColor: C.pink, color: "#fff" }}>
              Open the app
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5">
        {/* Hero */}
        <section className="pt-14 pb-12 text-center">
          <h1 className="kc-display leading-none font-normal" style={{ fontSize: "clamp(38px, 11vw, 96px)", color: C.ink }}>
            Your bias has fans<br /><span style={{ color: C.pink }}>in your pincode.</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed max-w-xl mx-auto" style={{ color: C.sub }}>
            Fifteen million Indians stream the comebacks, cry at the finales, and study Hangul —
            mostly alone. Chingus matches you with K-culture fans by fandom, city and language,
            from Chennai to Guwahati.
          </p>
          <div className="mt-7 flex flex-col items-center gap-2">
            <button
              onClick={onOpenApp}
              className="rounded-2xl px-8 py-4 text-base font-semibold flex items-center gap-2"
              style={{ backgroundColor: C.pink, color: "#fff", boxShadow: "0 4px 0 #D93A66" }}
            >
              Launch Chingus <ArrowRight size={18} />
            </button>
            <span className="text-xs" style={{ color: C.sub }}>Free · no download · runs in your browser</span>
          </div>
        </section>

        {/* Feature trio */}
        <section className="pb-12 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Sparkles, bg: C.pinkSoft, fg: C.pink, t: "Fandom-first matching", d: "Sorted by shared groups, dramas and plans — with a match score on every card." },
            { icon: Languages, bg: C.mintSoft, fg: "#199A76", t: "In your language", d: "Tamil, Hindi, Telugu, Malayalam and more — match with fans you can talk to comfortably." },
            { icon: Users, bg: C.lilacSoft, fg: "#5D4BD1", t: "Rooms & events", d: "Fandom rooms, city rooms, study circles, cup-sleeve meetups and watch parties." },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.t} className="rounded-3xl p-5" style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: f.bg }}>
                  <Icon size={19} style={{ color: f.fg }} />
                </div>
                <div className="kc-display text-lg mt-3" style={{ color: C.ink }}>{f.t}</div>
                <p className="text-sm mt-1" style={{ color: C.sub }}>{f.d}</p>
              </div>
            );
          })}
        </section>

        {/* How it works — a real sequence */}
        <section id="how" className="pb-12" style={{ scrollMarginTop: 80 }}>
          <h2 className="kc-display text-3xl text-center mb-6" style={{ color: C.ink }}>How it works</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-3xl p-5" style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}` }}>
                <div className="kc-display text-2xl w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.butterSoft, color: "#9A7A00" }}>{s.n}</div>
                <div className="kc-display text-lg mt-3" style={{ color: C.ink }}>{s.title}</div>
                <p className="text-sm mt-1" style={{ color: C.sub }}>{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Voice of the community */}
        <section className="pb-12">
          <div className="rounded-3xl p-6 sm:p-8" style={{ backgroundColor: C.ink }}>
            <p className="kc-display text-2xl sm:text-3xl leading-snug" style={{ color: C.butter }}>
              "I've been to three cup-sleeve events and knew nobody at any of them.
              I just want a friend who'll scream about the comeback with me."
            </p>
            <p className="text-sm mt-3" style={{ color: "#CFC7E8" }}>— every Indian fan, at some point. That's the whole reason this exists.</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="pb-12" style={{ scrollMarginTop: 80 }}>
          <h2 className="kc-display text-3xl text-center mb-6" style={{ color: C.ink }}>Questions, answered</h2>
          <div className="space-y-2.5 max-w-xl mx-auto">
            {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </section>

        {/* Final CTA */}
        <section className="pb-14 text-center">
          <div className="kc-display text-3xl" style={{ color: C.ink }}>Ready when you are.</div>
          <button
            onClick={onOpenApp}
            className="mt-4 rounded-2xl px-8 py-4 text-base font-semibold inline-flex items-center gap-2"
            style={{ backgroundColor: C.pink, color: "#fff", boxShadow: "0 4px 0 #D93A66" }}
          >
            <Smartphone size={18} /> Open Chingus
          </button>
        </section>
      </main>

      <footer className="kc-safe-bottom" style={{ borderTop: `1.5px solid ${C.line}` }}>
        <div className="max-w-3xl mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-xs text-center" style={{ color: C.sub }}>
          <span>Chingus — find your K-people · chingus.in</span>
          <span>Website W1.1 · App v1.8</span>
        </div>
      </footer>
    </div>
  );
}
