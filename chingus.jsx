import { useState, useEffect, useRef } from "react";
import {
  Sparkles, MapPin, Music, Tv, Heart, Send, ArrowLeft, ArrowRight,
  Users, Calendar, MessageCircle, UserCircle, Wand2, Check, X, Pencil,
  Smartphone, ShieldCheck, LogOut, Lock, GraduationCap, Volume2, Flame, Trophy, RefreshCw
} from "lucide-react";

/* ─────────────────────────  Design tokens  ───────────────────────── */
const C = {
  bg: "#FBF9FF",        // milk lilac
  ink: "#241B3A",       // deep plum ink
  sub: "#6E6488",       // muted plum
  pink: "#FF4D7D",      // hot photocard pink
  pinkSoft: "#FFE3EC",
  butter: "#FFCE3C",    // butter yellow
  butterSoft: "#FFF4CF",
  mint: "#4FD8B0",
  mintSoft: "#DFF8EF",
  lilac: "#8E7BFF",
  lilacSoft: "#ECE7FF",
  card: "#FFFFFF",
  line: "#E9E3F6",
};

const FONT = `
@import url('https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap');
.kc-display { font-family: 'Do Hyeon', system-ui, sans-serif; letter-spacing: 0.2px; }
.kc-body { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; }
.kc-scroll::-webkit-scrollbar { display: none; }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
`;

/* ─────────────────────────  Data  ───────────────────────── */
const CITIES = ["Chennai", "Coimbatore", "Bengaluru", "Delhi NCR", "Mumbai", "Hyderabad", "Kochi", "Guwahati", "Kolkata", "Pune"];
const LANGS = ["English", "Tamil", "Hindi", "Telugu", "Malayalam", "Kannada", "Bengali", "Marathi"];
const FANDOMS = ["BTS", "BLACKPINK", "Stray Kids", "SEVENTEEN", "TWICE", "NewJeans", "EXO", "ATEEZ", "TXT", "IVE", "aespa", "ENHYPEN"];
const DRAMAS = ["Crash Landing on You", "Goblin", "Queen of Tears", "Vincenzo", "Itaewon Class", "Hometown Cha-Cha-Cha", "Moving", "Squid Game", "Reply 1988", "True Beauty"];
const VIBES = ["Learning Korean", "K-food & cooking", "Dance covers", "Webtoons", "K-beauty", "Concert buddy", "Cup-sleeve events", "Fan art", "OST playlists", "Travel to Seoul"];

const MOCK_USERS = [
  { id: "u1", name: "Priya", age: 23, city: "Chennai", langs: ["Tamil", "English"], emoji: "🌸",
    fandoms: ["BTS", "SEVENTEEN"], dramas: ["Queen of Tears", "Reply 1988"], vibes: ["Learning Korean", "OST playlists", "Cup-sleeve events"],
    bio: "ARMY since 2018. Slowly working through TTMIK Level 3. Chennai cup-sleeve regular." },
  { id: "u2", name: "Aarav", age: 26, city: "Bengaluru", langs: ["Hindi", "English", "Kannada"], emoji: "🎧",
    fandoms: ["Stray Kids", "ATEEZ"], dramas: ["Vincenzo", "Moving"], vibes: ["Dance covers", "Concert buddy"],
    bio: "Dance cover crew lead. Will travel anywhere in India for a concert. STAY." },
  { id: "u3", name: "Meera", age: 21, city: "Coimbatore", langs: ["Tamil", "English"], emoji: "🧋",
    fandoms: ["NewJeans", "TWICE"], dramas: ["True Beauty", "Hometown Cha-Cha-Cha"], vibes: ["K-beauty", "Webtoons", "Learning Korean"],
    bio: "Webtoon binge-reader. Trying to find K-drama friends in Kovai — we exist!" },
  { id: "u4", name: "Rohan", age: 28, city: "Delhi NCR", langs: ["Hindi", "English"], emoji: "🍜",
    fandoms: ["EXO", "BTS"], dramas: ["Itaewon Class", "Squid Game"], vibes: ["K-food & cooking", "Travel to Seoul"],
    bio: "Home cook chasing the perfect budae-jjigae. KCCI event regular in Delhi." },
  { id: "u5", name: "Ananya", age: 24, city: "Mumbai", langs: ["Marathi", "Hindi", "English"], emoji: "🎨",
    fandoms: ["BLACKPINK", "IVE"], dramas: ["Goblin", "Crash Landing on You"], vibes: ["Fan art", "K-beauty", "OST playlists"],
    bio: "Fan artist — commissions open. Goblin is cinema, I will not be debating this." },
  { id: "u6", name: "Zoya", age: 22, city: "Hyderabad", langs: ["Telugu", "Hindi", "English"], emoji: "📚",
    fandoms: ["TXT", "ENHYPEN"], dramas: ["True Beauty", "Reply 1988"], vibes: ["Learning Korean", "Webtoons"],
    bio: "TOPIK I aspirant. Looking for a study buddy who won't ghost after week two." },
  { id: "u7", name: "Kevin", age: 25, city: "Guwahati", langs: ["English", "Bengali"], emoji: "🥁",
    fandoms: ["Stray Kids", "SEVENTEEN"], dramas: ["Moving", "Vincenzo"], vibes: ["Dance covers", "Concert buddy", "OST playlists"],
    bio: "Northeast has the best K-pop scene in India and I'm tired of pretending it doesn't." },
  { id: "u8", name: "Lakshmi", age: 27, city: "Kochi", langs: ["Malayalam", "English"], emoji: "☕",
    fandoms: ["BTS", "aespa"], dramas: ["Hometown Cha-Cha-Cha", "Crash Landing on You"], vibes: ["K-food & cooking", "Travel to Seoul", "Learning Korean"],
    bio: "Saving up for Seoul spring 2027. Meanwhile: dalgona attempts and drama re-watches." },
];

const EVENTS = [
  { id: "e1", title: "K-Pop India Contest — Regional Rounds", where: "Multiple cities", when: "Aug–Oct 2026", tag: "Contest", note: "KCCI's flagship contest, running since 2012. Regional rounds feed the Delhi finale." },
  { id: "e2", title: "Cup-sleeve Café Meetup", where: "Chennai · Besant Nagar", when: "Sat, Sep 26", tag: "Meetup", note: "Fan-run birthday café event. Freebies while stock lasts, playlist on loop." },
  { id: "e3", title: "Hangul Day Beginner Workshop", where: "Online · Zoom", when: "Oct 9", tag: "Language", note: "Learn to read Hangul in 90 minutes. Hosted by community volunteers." },
  { id: "e4", title: "K-Drama Watch Party — Moving Finale", where: "Bengaluru · Koramangala", when: "Sun, Oct 4", tag: "Watch party", note: "Projector, snacks, and absolutely no spoilers before 6pm." },
];

const CANNED_ICEBREAKERS = [
  "Annyeong! I saw we're both into {shared} — what got you into it first?",
  "Okay important question: bias ranking, go. I promise not to judge (much).",
  "If we planned one perfect K-day in {city} — food, playlist, drama — what's on it?",
];

/* ─────────────────────────  Helpers  ───────────────────────── */
const store = {
  async get(key) {
    try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; }
    catch { return null; }
  },
  async set(key, val) {
    try { await window.storage.set(key, JSON.stringify(val)); } catch { /* in-memory only */ }
  },
  async del(key) {
    try { await window.storage.delete(key); } catch { /* ignore */ }
  },
};

function matchScore(me, other) {
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

function sharedTags(me, other) {
  if (!me) return [];
  const all = [...(me.fandoms || []), ...(me.dramas || []), ...(me.vibes || [])];
  const theirs = [...other.fandoms, ...other.dramas, ...other.vibes];
  return all.filter((t) => theirs.includes(t));
}

function resizePhoto(file) {
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

function Avatar({ photo, emoji, size = 56, radius = 16, rotate = 0 }) {
  const base = {
    width: size, height: size, borderRadius: radius, transform: `rotate(${rotate}deg)`,
    border: `1.5px solid ${C.line}`, flexShrink: 0,
  };
  if (photo) {
    return <img src={photo} alt="Profile" className="object-cover" style={base} />;
  }
  return (
    <div className="flex items-center justify-center" style={{ ...base, backgroundColor: C.lilacSoft, fontSize: size * 0.55 }}>
      {emoji || "💜"}
    </div>
  );
}

/* ─────────────────────────  Small UI pieces  ───────────────────────── */
function Chip({ label, active, onClick, tone = "pink" }) {
  const tones = {
    pink: { bg: C.pinkSoft, fg: C.pink, activeBg: C.pink },
    lilac: { bg: C.lilacSoft, fg: C.lilac, activeBg: C.lilac },
    mint: { bg: C.mintSoft, fg: "#199A76", activeBg: C.mint },
    butter: { bg: C.butterSoft, fg: "#9A7A00", activeBg: C.butter },
  }[tone];
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
      style={{
        backgroundColor: active ? tones.activeBg : tones.bg,
        color: active ? "#fff" : tones.fg,
        border: `1.5px solid ${active ? tones.activeBg : "transparent"}`,
      }}
    >
      {label}
    </button>
  );
}


function AddOwn({ tone = "pink", placeholder, onAdd }) {
  const [openInput, setOpenInput] = useState(false);
  const [val, setVal] = useState("");
  const commit = () => {
    const v = val.trim();
    if (v) onAdd(v);
    setVal(""); setOpenInput(false);
  };
  if (!openInput) {
    return <Chip label="＋ Other" tone={tone} active={false} onClick={() => setOpenInput(true)} />;
  }
  return (
    <span className="inline-flex items-center gap-1">
      <input
        autoFocus value={val} onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setVal(""); setOpenInput(false); } }}
        placeholder={placeholder}
        className="rounded-full px-3 py-1.5 text-sm outline-none"
        style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}`, color: C.ink, width: 150 }}
      />
      <button onClick={commit} className="rounded-full px-3 py-1.5 text-sm font-semibold" style={{ backgroundColor: C.ink, color: "#fff" }}>Add</button>
    </span>
  );
}

function Tag({ label, tone = "lilac" }) {
  const bg = { lilac: C.lilacSoft, pink: C.pinkSoft, mint: C.mintSoft, butter: C.butterSoft }[tone];
  const fg = { lilac: "#5D4BD1", pink: C.pink, mint: "#199A76", butter: "#9A7A00" }[tone];
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: bg, color: fg }}>
      {label}
    </span>
  );
}

function SectionTitle({ kr, en }) {
  return (
    <div className="mb-3">
      <div className="kc-display text-lg" style={{ color: C.pink }}>{kr}</div>
      <h2 className="kc-display text-2xl" style={{ color: C.ink }}>{en}</h2>
    </div>
  );
}

/* ─────────────────────────  OTP Login  ───────────────────────── */
function AuthScreen({ onDone }) {
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState("phone"); // phone | otp
  const [code, setCode] = useState("");
  const [entered, setEntered] = useState("");
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn(resendIn - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const validPhone = /^[6-9]\d{9}$/.test(phone);

  const sendOtp = () => {
    if (!validPhone) { setError("Enter a valid 10-digit Indian mobile number."); return; }
    const c = String(Math.floor(100000 + Math.random() * 900000));
    setCode(c);
    setEntered("");
    setError("");
    setStage("otp");
    setResendIn(30);
  };

  const verify = () => {
    if (entered === code) {
      onDone({ phone: "+91 " + phone, verifiedAt: new Date().toISOString() });
    } else {
      setError("That code doesn't match. Check and try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col kc-body" style={{ backgroundColor: C.bg }}>
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col px-5 pt-14 pb-8">
        <div className="kc-display leading-none" style={{ fontSize: 56, color: C.pink }}>안녕!</div>
        <h1 className="kc-display text-3xl mt-1" style={{ color: C.ink }}>
          {stage === "phone" ? "Log in with your mobile" : "Enter the code"}
        </h1>
        <p className="mt-2 text-sm" style={{ color: C.sub }}>
          {stage === "phone"
            ? "We use your number only to verify it's really you. No spam, promise."
            : "Sent to +91 " + phone + " · demo mode shows it below"}
        </p>

        {stage === "phone" && (
          <div className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: C.ink }}>Mobile number</label>
              <div className="flex items-center gap-2 rounded-2xl px-4 py-3" style={{ backgroundColor: C.card, border: `1.5px solid ${error ? C.pink : C.line}` }}>
                <Smartphone size={18} style={{ color: C.sub }} />
                <span className="text-base font-medium" style={{ color: C.ink }}>+91</span>
                <input
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                  inputMode="numeric"
                  placeholder="98765 43210"
                  className="flex-1 text-base outline-none bg-transparent"
                  style={{ color: C.ink }}
                />
              </div>
              {error && <p className="text-xs mt-1.5" style={{ color: C.pink }}>{error}</p>}
            </div>
            <button
              onClick={sendOtp}
              disabled={!validPhone}
              className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 text-base font-semibold"
              style={{ backgroundColor: C.pink, color: "#fff", opacity: validPhone ? 1 : 0.35 }}
            >
              Send OTP <ArrowRight size={18} />
            </button>
          </div>
        )}

        {stage === "otp" && (
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl p-3 text-sm text-center" style={{ backgroundColor: C.butterSoft, color: "#7A6100" }}>
              Demo mode — no SMS is actually sent. Your code is <span className="kc-display text-base tracking-widest">{code}</span>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: C.ink }}>6-digit code</label>
              <input
                value={entered}
                onChange={(e) => { setEntered(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && entered.length === 6 && verify()}
                inputMode="numeric"
                placeholder="••••••"
                className="w-full rounded-2xl px-4 py-3 text-center text-2xl tracking-widest outline-none kc-display"
                style={{ backgroundColor: C.card, border: `1.5px solid ${error ? C.pink : C.line}`, color: C.ink, letterSpacing: "0.4em" }}
              />
              {error && <p className="text-xs mt-1.5" style={{ color: C.pink }}>{error}</p>}
            </div>
            <button
              onClick={verify}
              disabled={entered.length !== 6}
              className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 text-base font-semibold"
              style={{ backgroundColor: C.mint, color: "#fff", opacity: entered.length === 6 ? 1 : 0.35 }}
            >
              <ShieldCheck size={18} /> Verify & continue
            </button>
            <div className="flex items-center justify-between text-sm">
              <button onClick={() => { setStage("phone"); setError(""); }} style={{ color: C.sub }}>
                Change number
              </button>
              <button
                onClick={sendOtp}
                disabled={resendIn > 0}
                style={{ color: resendIn > 0 ? C.sub : C.pink, fontWeight: 600 }}
              >
                {resendIn > 0 ? "Resend in " + resendIn + "s" : "Resend OTP"}
              </button>
            </div>
          </div>
        )}

        <p className="mt-auto pt-8 text-xs text-center" style={{ color: C.sub }}>
          By continuing you agree to be kind in rooms and chats. 🤝
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────  Landing  ───────────────────────── */
function Landing({ onStart }) {
  const feats = [
    { icon: Sparkles, tone: C.pink, bg: C.pinkSoft, title: "Match by what you love", text: "Fandom, drama taste, city and language — get sorted with fans you'd actually get along with, not random strangers." },
    { icon: Users, tone: "#5D4BD1", bg: C.lilacSoft, title: "Rooms for your people", text: "Your fandom's India room, your city's meetup room, and a Korean study circle — auto-created from your interests." },
    { icon: Calendar, tone: "#9A7A00", bg: C.butterSoft, title: "Never miss an event", text: "Cup-sleeve cafés, watch parties, Hangul workshops and contest rounds happening near you." },
    { icon: Wand2, tone: "#199A76", bg: C.mintSoft, title: "Icebreakers written for you", text: "Awkward at openers? One tap writes a friendly first message from your shared interests." },
  ];
  return (
    <div className="min-h-screen kc-body" style={{ backgroundColor: C.bg }}>
      <div className="max-w-md mx-auto px-5 pt-12 pb-10 flex flex-col min-h-screen">
        <div>
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

        <div className="mt-10 space-y-3">
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

/* ─────────────────────────  Onboarding  ───────────────────────── */
function Onboarding({ initial, onDone }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(initial?.name || "");
  const [city, setCity] = useState(initial?.city || "");
  const [langs, setLangs] = useState(initial?.langs || []);
  const [fandoms, setFandoms] = useState(initial?.fandoms || []);
  const [dramas, setDramas] = useState(initial?.dramas || []);
  const [vibes, setVibes] = useState(initial?.vibes || []);
  const [photo, setPhoto] = useState(initial?.photo || null);
  const [photoError, setPhotoError] = useState(false);
  const fileRef = useRef(null);

  const pickPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(false);
    try { setPhoto(await resizePhoto(file)); }
    catch { setPhotoError(true); }
    e.target.value = "";
  };

  const toggle = (list, setList, v) =>
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const canNext =
    step === 0 ? name.trim().length > 0 && city && langs.length > 0
    : step === 1 ? fandoms.length + dramas.length > 0
    : vibes.length > 0;

  return (
    <div className="min-h-screen flex flex-col kc-body" style={{ backgroundColor: C.bg }}>
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col px-5 pt-10 pb-6">
        {step === 0 && (
          <div className="mb-8">
            <div className="kc-display leading-none" style={{ fontSize: 64, color: C.pink }}>안녕!</div>
            <h1 className="kc-display text-3xl mt-1" style={{ color: C.ink }}>Find your K-people in India</h1>
            <p className="mt-2 text-sm" style={{ color: C.sub }}>
              Match with fans near you by fandom, drama taste, and language — from Chennai to Guwahati.
            </p>
            <span className="inline-block mt-3 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: C.lilacSoft, color: "#5D4BD1" }}>
              v1.8
            </span>
          </div>
        )}
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-sm mb-6" style={{ color: C.sub }}>
            <ArrowLeft size={16} /> Back
          </button>
        )}

        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: C.ink }}>Profile picture <span style={{ color: C.sub }}>(optional)</span></label>
              <div className="flex items-center gap-3">
                <button onClick={() => fileRef.current?.click()} aria-label="Upload profile picture">
                  <Avatar photo={photo} emoji="📷" size={72} radius={20} rotate={-2} />
                </button>
                <div className="space-y-1.5">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="block rounded-full px-3.5 py-1.5 text-xs font-semibold"
                    style={{ backgroundColor: C.pinkSoft, color: C.pink }}
                  >
                    {photo ? "Change photo" : "Upload photo"}
                  </button>
                  {photo && (
                    <button onClick={() => setPhoto(null)} className="block rounded-full px-3.5 py-1.5 text-xs font-semibold" style={{ backgroundColor: C.card, color: C.sub, border: `1.5px solid ${C.line}` }}>
                      Remove
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={pickPhoto} className="hidden" />
              </div>
              {photoError && (
                <p className="text-xs mt-1.5" style={{ color: C.pink }}>That file couldn't be read — try a JPG or PNG.</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: C.ink }}>Your name</label>
              <input
                value={name} onChange={(e) => setName(e.target.value)} placeholder="What should friends call you?"
                className="w-full rounded-2xl px-4 py-3 text-base outline-none"
                style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}`, color: C.ink }}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: C.ink }}>Your city</label>
              <div className="flex flex-wrap gap-2">
                {[...CITIES, ...(city && !CITIES.includes(city) ? [city] : [])].map((c) => (
                  <Chip key={c} label={c} tone="lilac" active={city === c} onClick={() => setCity(c)} />
                ))}
                <AddOwn tone="lilac" placeholder="Type your city" onAdd={(v) => setCity(v)} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: C.ink }}>Languages you're comfy in</label>
              <div className="flex flex-wrap gap-2">
                {[...LANGS, ...langs.filter((l) => !LANGS.includes(l))].map((l) => (
                  <Chip key={l} label={l} tone="mint" active={langs.includes(l)} onClick={() => toggle(langs, setLangs, l)} />
                ))}
                <AddOwn tone="mint" placeholder="Type your language" onAdd={(v) => { if (!langs.includes(v)) setLangs([...langs, v]); }} />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <SectionTitle kr="최애" en="Pick your fandoms & dramas" />
            <div>
              <div className="flex items-center gap-1.5 text-sm font-medium mb-2" style={{ color: C.ink }}>
                <Music size={15} style={{ color: C.pink }} /> K-pop
              </div>
              <div className="flex flex-wrap gap-2">
                {[...FANDOMS, ...fandoms.filter((f) => !FANDOMS.includes(f))].map((f) => (
                  <Chip key={f} label={f} active={fandoms.includes(f)} onClick={() => toggle(fandoms, setFandoms, f)} />
                ))}
                <AddOwn placeholder="Add a group / artist" onAdd={(v) => { if (!fandoms.includes(v)) setFandoms([...fandoms, v]); }} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-medium mb-2" style={{ color: C.ink }}>
                <Tv size={15} style={{ color: C.lilac }} /> K-dramas
              </div>
              <div className="flex flex-wrap gap-2">
                {[...DRAMAS, ...dramas.filter((d) => !DRAMAS.includes(d))].map((d) => (
                  <Chip key={d} label={d} tone="lilac" active={dramas.includes(d)} onClick={() => toggle(dramas, setDramas, d)} />
                ))}
                <AddOwn tone="lilac" placeholder="Add a drama / film" onAdd={(v) => { if (!dramas.includes(v)) setDramas([...dramas, v]); }} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <SectionTitle kr="느낌" en="What do you want to do together?" />
            <div className="flex flex-wrap gap-2">
              {[...VIBES, ...vibes.filter((x) => !VIBES.includes(x))].map((v) => (
                <Chip key={v} label={v} tone="butter" active={vibes.includes(v)} onClick={() => toggle(vibes, setVibes, v)} />
              ))}
              <AddOwn tone="butter" placeholder="Add your own" onAdd={(v) => { if (!vibes.includes(v)) setVibes([...vibes, v]); }} />
            </div>
            <p className="text-xs" style={{ color: C.sub }}>
              This decides who you see first — pick at least one.
            </p>
          </div>
        )}

        <div className="mt-auto pt-8">
          <button
            disabled={!canNext}
            onClick={() => (step < 2 ? setStep(step + 1) : onDone({ name: name.trim(), city, langs, fandoms, dramas, vibes, emoji: "💜", photo }))}
            className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 text-base font-semibold transition-opacity"
            style={{ backgroundColor: C.pink, color: "#fff", opacity: canNext ? 1 : 0.35 }}
          >
            {step < 2 ? <>Continue <ArrowRight size={18} /></> : <>Show my matches <Sparkles size={18} /></>}
          </button>
          <div className="flex justify-center gap-1.5 mt-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-full" style={{ width: i === step ? 22 : 8, height: 8, backgroundColor: i === step ? C.pink : C.line, transition: "width .2s" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────  Discover  ───────────────────────── */
function PhotoCard({ user, me, waved, onWave, onChat }) {
  const score = matchScore(me, user);
  const shared = sharedTags(me, user);
  return (
    <div className="rounded-3xl p-4 relative" style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}`, boxShadow: "0 4px 0 " + C.line }}>
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
          <div className="kc-display text-xl leading-tight" style={{ color: C.ink }}>
            {user.name}, {user.age}
          </div>
          <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: C.sub }}>
            <MapPin size={12} /> {user.city} · {user.langs.slice(0, 2).join(", ")}
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
      <div className="mt-4">
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

function Discover({ me, connections, onWave, onOpenChat }) {
  const sorted = [...MOCK_USERS].sort((a, b) => matchScore(me, b) - matchScore(me, a));
  return (
    <div className="px-5 pb-28 pt-5 space-y-4">
      <div>
        <div className="kc-display text-3xl" style={{ color: C.ink }}>
          Annyeong, {me.name} <span style={{ color: C.pink }}>💗</span>
        </div>
        <p className="text-sm mt-0.5" style={{ color: C.sub }}>
          {sorted.length} fans sorted by how much you'd get along
        </p>
      </div>
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
      <p className="text-center text-xs pt-2" style={{ color: C.sub }}>
        Demo profiles — in the real app this would be live fans near you.
      </p>
    </div>
  );
}

/* ─────────────────────────  Rooms  ───────────────────────── */
function Rooms({ me }) {
  const roomDefs = [
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
  const [open, setOpen] = useState(null);
  const [messages, setMessages] = useState({});
  const [draft, setDraft] = useState("");

  const room = roomDefs.find((r) => r.id === open);
  const msgs = room ? [...room.seed, ...(messages[room.id] || [])] : [];

  const post = () => {
    if (!draft.trim() || !room) return;
    setMessages((m) => ({ ...m, [room.id]: [...(m[room.id] || []), { who: me.name + " (you)", text: draft.trim() }] }));
    setDraft("");
  };

  if (room) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-5 pt-5 pb-3 flex items-center gap-3" style={{ borderBottom: `1.5px solid ${C.line}` }}>
          <button onClick={() => setOpen(null)}><ArrowLeft size={20} style={{ color: C.ink }} /></button>
          <div>
            <div className="kc-display text-xl leading-tight" style={{ color: C.ink }}>{room.name}</div>
            <div className="text-xs" style={{ color: C.sub }}>{room.desc}</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto kc-scroll px-5 py-4 space-y-3 pb-40">
          {msgs.map((m, i) => (
            <div key={i} className="rounded-2xl px-4 py-2.5" style={{ backgroundColor: m.who.includes("(you)") ? C.pinkSoft : C.card, border: `1.5px solid ${C.line}` }}>
              <div className="text-xs font-semibold" style={{ color: C.pink }}>{m.who}</div>
              <div className="text-sm mt-0.5" style={{ color: C.ink }}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="fixed bottom-20 left-0 right-0">
          <div className="max-w-md mx-auto px-5 flex gap-2">
            <input
              value={draft} onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && post()}
              placeholder={"Message " + room.name + "…"}
              className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}`, color: C.ink }}
            />
            <button onClick={post} className="rounded-2xl px-4" style={{ backgroundColor: C.pink, color: "#fff" }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-5 pb-28 space-y-3">
      <SectionTitle kr="모임" en="Rooms" />
      {roomDefs.map((r) => (
        <button
          key={r.id} onClick={() => setOpen(r.id)}
          className="w-full text-left rounded-3xl p-4 flex items-center justify-between"
          style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}` }}
        >
          <div>
            <div className="kc-display text-lg" style={{ color: C.ink }}>{r.name}</div>
            <div className="text-xs mt-0.5" style={{ color: C.sub }}>{r.desc}</div>
          </div>
          <Tag label="Open" tone={r.tone} />
        </button>
      ))}
      <p className="text-xs pt-1" style={{ color: C.sub }}>
        Rooms are created from your fandoms, city and study interests.
      </p>
    </div>
  );
}

/* ─────────────────────────  Events  ───────────────────────── */
function Events() {
  const toneFor = { Contest: "pink", Meetup: "butter", Language: "mint", "Watch party": "lilac" };
  return (
    <div className="px-5 pt-5 pb-28 space-y-3">
      <SectionTitle kr="행사" en="Events near you" />
      {EVENTS.map((e) => (
        <div key={e.id} className="rounded-3xl p-4" style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}` }}>
          <div className="flex items-start justify-between gap-2">
            <div className="kc-display text-lg leading-snug" style={{ color: C.ink }}>{e.title}</div>
            <Tag label={e.tag} tone={toneFor[e.tag] || "lilac"} />
          </div>
          <div className="flex items-center gap-3 text-xs mt-1.5" style={{ color: C.sub }}>
            <span className="flex items-center gap-1"><MapPin size={12} /> {e.where}</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> {e.when}</span>
          </div>
          <p className="text-sm mt-2" style={{ color: C.ink }}>{e.note}</p>
        </div>
      ))}
      <p className="text-xs pt-1" style={{ color: C.sub }}>
        Sample listings — a live version would pull fan-club and KCCI calendars.
      </p>
    </div>
  );
}

/* ─────────────────────────  Chats  ───────────────────────── */
function Chats({ me, connections, chats, setChats, openId, setOpenId }) {
  const [draft, setDraft] = useState("");
  const [loadingIce, setLoadingIce] = useState(false);
  const bottomRef = useRef(null);

  const friends = MOCK_USERS.filter((u) => connections.includes(u.id));
  const open = friends.find((u) => u.id === openId);
  const msgs = (open && chats[open.id]) || [];

  useEffect(() => { bottomRef.current?.scrollIntoView({ block: "end" }); }, [msgs.length, openId]);

  const send = (text) => {
    if (!text.trim() || !open) return;
    const mine = { from: "me", text: text.trim() };
    const replyPool = [
      "Omg yes!! Finally someone gets it 😭",
      "Wait, you too?? Okay we're going to be friends.",
      "Hahaha exactly! What's your top pick right now?",
      "That's so cool — I've been wanting to try that here in " + open.city + ".",
    ];
    const reply = { from: "them", text: replyPool[msgs.length % replyPool.length] };
    setChats((c) => ({ ...c, [open.id]: [...(c[open.id] || []), mine, reply] }));
    setDraft("");
  };

  const icebreak = async () => {
    if (!open) return;
    setLoadingIce(true);
    const shared = sharedTags(me, open);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content:
              `Write ONE short, friendly, casual icebreaker message (max 25 words) from an Indian K-culture fan named ${me.name} to a new friend named ${open.name} in ${open.city}. ` +
              `Shared interests: ${shared.join(", ") || "Korean culture"}. It should feel warm and specific, maybe one emoji, no hashtags. ` +
              `Respond with ONLY the message text, nothing else.`,
          }],
        }),
      });
      const data = await res.json();
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join(" ").trim();
      if (text) setDraft(text);
      else throw new Error("empty");
    } catch {
      const t = CANNED_ICEBREAKERS[Math.floor(Math.random() * CANNED_ICEBREAKERS.length)]
        .replace("{shared}", sharedTags(me, open)[0] || "K-dramas")
        .replace("{city}", open.city);
      setDraft(t);
    }
    setLoadingIce(false);
  };

  if (open) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-5 pt-5 pb-3 flex items-center gap-3" style={{ borderBottom: `1.5px solid ${C.line}` }}>
          <button onClick={() => setOpenId(null)}><ArrowLeft size={20} style={{ color: C.ink }} /></button>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: C.lilacSoft }}>{open.emoji}</div>
          <div>
            <div className="kc-display text-lg leading-tight" style={{ color: C.ink }}>{open.name}</div>
            <div className="text-xs" style={{ color: C.sub }}>{open.city} · {matchScore(me, open)}% match</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto kc-scroll px-5 py-4 space-y-2 pb-44">
          {msgs.length === 0 && (
            <div className="rounded-2xl p-4 text-sm text-center" style={{ backgroundColor: C.butterSoft, color: "#7A6100" }}>
              You waved at {open.name}! Say something — or let the app write your icebreaker.
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={"flex " + (m.from === "me" ? "justify-end" : "justify-start")}>
              <div
                className="max-w-xs rounded-2xl px-4 py-2.5 text-sm"
                style={m.from === "me"
                  ? { backgroundColor: C.pink, color: "#fff", borderBottomRightRadius: 6 }
                  : { backgroundColor: C.card, color: C.ink, border: `1.5px solid ${C.line}`, borderBottomLeftRadius: 6 }}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="fixed bottom-20 left-0 right-0">
          <div className="max-w-md mx-auto px-5 space-y-2">
            <button
              onClick={icebreak} disabled={loadingIce}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
              style={{ backgroundColor: C.lilacSoft, color: "#5D4BD1", opacity: loadingIce ? 0.6 : 1 }}
            >
              <Wand2 size={13} /> {loadingIce ? "Writing…" : "Write an icebreaker for me"}
            </button>
            <div className="flex gap-2">
              <input
                value={draft} onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(draft)}
                placeholder={"Message " + open.name + "…"}
                className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none"
                style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}`, color: C.ink }}
              />
              <button onClick={() => send(draft)} className="rounded-2xl px-4" style={{ backgroundColor: C.pink, color: "#fff" }}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-5 pb-28 space-y-3">
      <SectionTitle kr="친구" en="Your chats" />
      {friends.length === 0 && (
        <div className="rounded-3xl p-6 text-center" style={{ backgroundColor: C.card, border: `1.5px dashed ${C.line}` }}>
          <div className="text-3xl">👋</div>
          <div className="kc-display text-lg mt-2" style={{ color: C.ink }}>No waves yet</div>
          <p className="text-sm mt-1" style={{ color: C.sub }}>Wave at someone in Discover to start a chat.</p>
        </div>
      )}
      {friends.map((u) => {
        const last = (chats[u.id] || []).slice(-1)[0];
        return (
          <button
            key={u.id} onClick={() => setOpenId(u.id)}
            className="w-full text-left rounded-3xl p-4 flex items-center gap-3"
            style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}` }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: C.lilacSoft }}>{u.emoji}</div>
            <div className="min-w-0 flex-1">
              <div className="kc-display text-lg" style={{ color: C.ink }}>{u.name}</div>
              <div className="text-xs truncate" style={{ color: C.sub }}>
                {last ? (last.from === "me" ? "You: " : "") + last.text : "Say annyeong 👋"}
              </div>
            </div>
            <MessageCircle size={18} style={{ color: C.pink }} />
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────  Profile  ───────────────────────── */
function Profile({ me, connections, onEdit }) {
  const [feedback, setFeedback] = useState("");
  const [sent, setSent] = useState(false);

  const sendFeedback = async () => {
    if (!feedback.trim()) return;
    const prev = (await store.get("kc:feedback")) || [];
    await store.set("kc:feedback", [...prev, { text: feedback.trim(), at: new Date().toISOString() }]);
    setFeedback("");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="px-5 pt-5 pb-28 space-y-4">
      <SectionTitle kr="프로필" en="Your card" />
      <div className="rounded-3xl p-5 relative" style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}`, boxShadow: "0 4px 0 " + C.line }}>
        <div className="absolute -top-2 -right-2 kc-display text-sm px-2.5 py-1 rounded-full -rotate-3" style={{ backgroundColor: C.mint, color: "#fff" }}>
          {connections.length} waves
        </div>
        <div className="flex items-center gap-3">
          <Avatar photo={me.photo} emoji="💜" size={56} radius={16} rotate={3} />
          <div>
            <div className="kc-display text-2xl" style={{ color: C.ink }}>{me.name}</div>
            <div className="flex items-center gap-1 text-xs" style={{ color: C.sub }}>
              <MapPin size={12} /> {me.city} · {me.langs.join(", ")}
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
          className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-y"
          style={{ backgroundColor: C.bg, border: `1.5px solid ${C.line}`, color: C.ink, minHeight: 96 }}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs" style={{ color: sent ? "#199A76" : C.sub }}>
            {sent ? "Sent — thank you! 💌" : feedback.trim() ? feedback.trim().length + " characters" : ""}
          </span>
          <button
            onClick={sendFeedback}
            disabled={!feedback.trim()}
            className="rounded-xl px-4 py-2 flex items-center gap-1.5 text-sm font-semibold"
            style={{ backgroundColor: C.pink, color: "#fff", opacity: feedback.trim() ? 1 : 0.35 }}
          >
            <Send size={14} /> Send feedback
          </button>
        </div>
      </div>
      <p className="text-center text-xs" style={{ color: C.sub }}>Chingus · v1.8</p>
    </div>
  );
}


/* ─────────────────────────  Learn (gamified)  ───────────────────────── */
const LEARN_DECKS = [
  { id: "greet", title: "Greetings", kr: "인사", tone: "pink", items: [
    { en: "Hello", kr: "안녕하세요", ro: "annyeong-haseyo" },
    { en: "Hi / Bye (casual)", kr: "안녕", ro: "annyeong" },
    { en: "Nice to meet you", kr: "반갑습니다", ro: "bangapseumnida" },
    { en: "Goodbye (you're leaving)", kr: "안녕히 계세요", ro: "annyeonghi gyeseyo" },
    { en: "How are you?", kr: "잘 지냈어요?", ro: "jal jinaesseoyo" },
    { en: "See you later", kr: "또 봐요", ro: "tto bwayo" },
  ]},
  { id: "polite", title: "Politeness", kr: "예의", tone: "mint", items: [
    { en: "Thank you", kr: "감사합니다", ro: "gamsahamnida" },
    { en: "Thanks (casual)", kr: "고마워요", ro: "gomawoyo" },
    { en: "Sorry", kr: "죄송합니다", ro: "joesong-hamnida" },
    { en: "Excuse me", kr: "저기요", ro: "jeogiyo" },
    { en: "It's okay", kr: "괜찮아요", ro: "gwaenchanayo" },
    { en: "Please (give me)", kr: "주세요", ro: "juseyo" },
  ]},
  { id: "fan", title: "Fan essentials", kr: "덕질", tone: "lilac", items: [
    { en: "Wow / amazing", kr: "대박", ro: "daebak" },
    { en: "Fighting! (good luck)", kr: "화이팅", ro: "hwaiting" },
    { en: "I love you", kr: "사랑해요", ro: "saranghaeyo" },
    { en: "Really?", kr: "진짜요?", ro: "jinjjayo" },
    { en: "Cute", kr: "귀여워요", ro: "gwiyeowoyo" },
    { en: "Cool / awesome", kr: "멋있어요", ro: "meosisseoyo" },
  ]},
  { id: "food", title: "Food & café", kr: "음식", tone: "butter", items: [
    { en: "Delicious", kr: "맛있어요", ro: "masisseoyo" },
    { en: "Water", kr: "물", ro: "mul" },
    { en: "Coffee", kr: "커피", ro: "keopi" },
    { en: "How much is it?", kr: "얼마예요?", ro: "eolmayeyo" },
    { en: "Not spicy, please", kr: "안 맵게 해 주세요", ro: "an maepge hae juseyo" },
    { en: "I will eat well", kr: "잘 먹겠습니다", ro: "jal meokgetseumnida" },
  ]},
];

function speakKr(text) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ko-KR";
    const v = window.speechSynthesis.getVoices().find((x) => x.lang && x.lang.startsWith("ko"));
    if (v) u.voice = v;
    u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch { /* no TTS available */ }
}

function makeQ(deck, item, type) {
  const others = deck.items.filter((x) => x.kr !== item.kr).sort(() => Math.random() - 0.5).slice(0, 3);
  return { type, item, opts: [...others, item].sort(() => Math.random() - 0.5) };
}

// Duolingo-style sequence: teach 2 phrases, drill them, teach the next 2…
function buildLesson(deck) {
  const seq = [];
  for (let i = 0; i < deck.items.length; i += 2) {
    const grp = deck.items.slice(i, i + 2);
    grp.forEach((it) => seq.push({ type: "intro", item: it }));
    grp.forEach((it) => seq.push(makeQ(deck, it, "en2kr")));
    grp.forEach((it) => seq.push(makeQ(deck, it, Math.random() < 0.5 ? "kr2en" : "listen")));
  }
  return seq;
}

function Learn() {
  const [data, setData] = useState({ xp: 0, done: {} });
  const [view, setView] = useState("home"); // home | lesson | result
  const [deck, setDeck] = useState(null);
  const [seq, setSeq] = useState([]);
  const [si, setSi] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [combo, setCombo] = useState(0);
  const [gained, setGained] = useState(0);
  const [picked, setPicked] = useState(null);
  const [passed, setPassed] = useState(false);

  useEffect(() => { (async () => { const d = await store.get("kc:learn"); if (d) setData(d); })(); }, []);
  const save = (d) => { setData(d); store.set("kc:learn", d); };

  const step = seq[si];
  // Auto-pronounce when a new phrase is introduced or a listening exercise appears
  useEffect(() => {
    if (view === "lesson" && step && (step.type === "intro" || step.type === "listen") && !picked) {
      const t = setTimeout(() => speakKr(step.item.kr), 250);
      return () => clearTimeout(t);
    }
  }, [si, view]);

  const level = Math.floor(data.xp / 100) + 1;
  const toneMap = { pink: [C.pinkSoft, C.pink], mint: [C.mintSoft, "#199A76"], lilac: [C.lilacSoft, "#5D4BD1"], butter: [C.butterSoft, "#9A7A00"] };

  const startLesson = (d) => {
    setDeck(d); setSeq(buildLesson(d)); setSi(0); setHearts(3); setCombo(0); setGained(0); setPicked(null); setView("lesson");
  };

  const answer = (opt) => {
    if (picked) return;
    setPicked(opt);
    if (opt.kr === step.item.kr) { setGained((g) => g + 10); setCombo((c) => c + 1); speakKr(step.item.kr); }
    else { setHearts((h) => h - 1); setCombo(0); }
  };

  const finish = (ok) => {
    setPassed(ok);
    if (ok) save({ xp: data.xp + gained, done: { ...data.done, [deck.id]: true } });
    else if (gained > 0) save({ ...data, xp: data.xp + Math.floor(gained / 2) });
    setView("result");
  };

  const next = () => {
    const wasWrong = picked && picked.kr !== step.item.kr;
    if (wasWrong && hearts <= 0) { finish(false); return; }
    if (si + 1 >= seq.length) { finish(true); return; }
    setSi(si + 1); setPicked(null);
  };

  if (view === "lesson" && deck && step) {
    const [bg, fg] = toneMap[deck.tone];
    const correct = picked && picked.kr === step.item.kr;
    const isQuiz = step.type !== "intro";
    return (
      <div className="px-5 pt-5 pb-28 flex flex-col" style={{ minHeight: "82vh" }}>
        {/* Top bar: quit · progress · hearts */}
        <div className="flex items-center justify-between">
          <button onClick={() => setView("home")} aria-label="Quit lesson"><X size={20} style={{ color: C.sub }} /></button>
          <div className="flex-1 mx-3 h-3 rounded-full" style={{ backgroundColor: C.line }}>
            <div className="h-3 rounded-full" style={{ width: (si / seq.length) * 100 + "%", backgroundColor: C.mint, transition: "width .25s" }} />
          </div>
          <div className="text-sm font-semibold" style={{ color: C.pink }}>{"♥".repeat(hearts)}{"♡".repeat(3 - hearts)}</div>
        </div>

        {combo >= 2 && (
          <div className="mt-3 self-center flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: C.butterSoft, color: "#9A7A00" }}>
            <Flame size={13} /> {combo} in a row!
          </div>
        )}

        {/* ONE card at a time */}
        {step.type === "intro" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: bg, color: fg }}>New phrase</span>
            <button onClick={() => speakKr(step.item.kr)} className="mt-5 kc-display leading-tight" style={{ fontSize: 44, color: C.ink }}>
              {step.item.kr}
            </button>
            <div className="mt-1 text-base font-medium" style={{ color: fg }}>{step.item.ro}</div>
            <div className="mt-3 text-lg" style={{ color: C.sub }}>"{step.item.en}"</div>
            <button onClick={() => speakKr(step.item.kr)} className="mt-5 w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: bg }} aria-label="Hear it again">
              <Volume2 size={22} style={{ color: fg }} />
            </button>
            <p className="text-xs mt-2" style={{ color: C.sub }}>Tap to hear it again</p>
          </div>
        )}

        {isQuiz && (
          <>
            <div className="mt-7">
              <div className="text-sm" style={{ color: C.sub }}>
                {step.type === "en2kr" && "How do you say…"}
                {step.type === "kr2en" && "What does this mean?"}
                {step.type === "listen" && "What do you hear?"}
              </div>
              {step.type === "en2kr" && (
                <div className="kc-display text-3xl mt-1" style={{ color: C.ink }}>"{step.item.en}"</div>
              )}
              {step.type === "kr2en" && (
                <div className="flex items-center gap-3 mt-1">
                  <div className="kc-display text-3xl" style={{ color: C.ink }}>{step.item.kr}</div>
                  <button onClick={() => speakKr(step.item.kr)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.lilacSoft }} aria-label="Hear it">
                    <Volume2 size={16} style={{ color: "#5D4BD1" }} />
                  </button>
                </div>
              )}
              {step.type === "listen" && (
                <button onClick={() => speakKr(step.item.kr)} className="mt-2 w-16 h-16 rounded-3xl flex items-center justify-center" style={{ backgroundColor: C.lilacSoft }} aria-label="Play audio">
                  <Volume2 size={28} style={{ color: "#5D4BD1" }} />
                </button>
              )}
            </div>
            <div className="mt-5 space-y-2.5">
              {step.opts.map((o) => {
                const isRight = picked && o.kr === step.item.kr;
                const isWrongPick = picked && picked.kr === o.kr && !correct;
                let bgc = C.card, brd = C.line, fgc = C.ink;
                if (isRight) { bgc = C.mintSoft; brd = C.mint; fgc = "#199A76"; }
                if (isWrongPick) { bgc = C.pinkSoft; brd = C.pink; fgc = C.pink; }
                return (
                  <button key={o.kr} onClick={() => answer(o)} disabled={!!picked}
                    className="w-full text-left rounded-2xl px-4 py-3.5"
                    style={{ backgroundColor: bgc, border: `1.5px solid ${brd}`, color: fgc }}>
                    {step.type === "kr2en"
                      ? <span className="text-base font-medium">{o.en}</span>
                      : <span><span className="kc-display text-lg">{o.kr}</span> <span className="text-xs ml-1" style={{ color: C.sub }}>{o.ro}</span></span>}
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-auto pt-5">
          {isQuiz && picked && (
            <div className="text-sm font-semibold mb-2" style={{ color: correct ? "#199A76" : C.pink }}>
              {correct ? "정답! Correct — +10 XP" : `Answer: ${step.item.kr} (${step.item.ro})`}
            </div>
          )}
          {(!isQuiz || picked) && (
            <button onClick={next} className="w-full rounded-2xl py-3.5 text-base font-semibold"
              style={{ backgroundColor: !isQuiz ? C.pink : correct ? C.mint : C.pink, color: "#fff", boxShadow: "0 4px 0 " + (!isQuiz || !correct ? "#D93A66" : "#2FA98A") }}>
              {step.type === "intro" ? "Got it" : "Continue"}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (view === "result" && deck) {
    return (
      <div className="px-5 pt-16 pb-28 text-center space-y-4">
        <div className="text-5xl">{passed ? "🏆" : "💔"}</div>
        <div className="kc-display text-3xl" style={{ color: C.ink }}>
          {passed ? "Lesson complete!" : "Out of hearts!"}
        </div>
        <p className="text-sm" style={{ color: C.sub }}>
          {passed ? `You earned ${gained} XP in "${deck.title}".` : `You keep ${Math.floor(gained / 2)} XP — try again to finish the lesson.`}
        </p>
        <div className="flex gap-2 justify-center pt-2">
          <button onClick={() => startLesson(deck)} className="rounded-2xl px-5 py-3 text-sm font-semibold flex items-center gap-1.5" style={{ backgroundColor: C.lilacSoft, color: "#5D4BD1" }}>
            <RefreshCw size={15} /> {passed ? "Practice again" : "Retry"}
          </button>
          <button onClick={() => setView("home")} className="rounded-2xl px-5 py-3 text-sm font-semibold" style={{ backgroundColor: C.pink, color: "#fff" }}>
            All lessons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-5 pb-28 space-y-4">
      <SectionTitle kr="한국어" en="Learn Korean" />
      <div className="rounded-3xl p-4" style={{ backgroundColor: C.ink }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={18} style={{ color: C.butter }} />
            <span className="kc-display text-xl" style={{ color: "#fff" }}>Level {level}</span>
          </div>
          <span className="text-sm font-semibold" style={{ color: C.butter }}>{data.xp} XP</span>
        </div>
        <div className="mt-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#3A2F5C" }}>
          <div className="h-2.5 rounded-full" style={{ width: (data.xp % 100) + "%", backgroundColor: C.butter }} />
        </div>
        <div className="text-xs mt-1.5" style={{ color: "#CFC7E8" }}>{100 - (data.xp % 100)} XP to level {level + 1}</div>
      </div>
      {LEARN_DECKS.map((d, i) => {
        const [bg, fg] = toneMap[d.tone];
        const done = !!data.done[d.id];
        const unlocked = i === 0 || !!data.done[LEARN_DECKS[i - 1].id];
        return (
          <button key={d.id} onClick={() => unlocked && startLesson(d)} disabled={!unlocked}
            aria-label={unlocked ? "Start chapter " + (i + 1) + ": " + d.title : "Chapter " + (i + 1) + " locked"}
            className="w-full text-left rounded-3xl p-4 flex items-center gap-3"
            style={{
              backgroundColor: C.card,
              border: `1.5px solid ${done ? C.mint : C.line}`,
              opacity: unlocked ? 1 : 0.55,
              cursor: unlocked ? "pointer" : "not-allowed",
            }}>
            <span className="kc-display text-xl w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: unlocked ? bg : C.line, color: unlocked ? fg : C.sub }}>
              {unlocked ? d.kr : <Lock size={18} />}
            </span>
            <div className="flex-1">
              <div className="kc-display text-lg" style={{ color: C.ink }}>Chapter {i + 1} · {d.title}</div>
              <div className="text-xs" style={{ color: C.sub }}>
                {unlocked
                  ? d.items.length + " phrases · earn up to " + d.items.length * 20 + " XP" + (done ? " · redo anytime" : "")
                  : "Finish \"" + LEARN_DECKS[i - 1].title + "\" to unlock"}
              </div>
            </div>
            {done && <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: C.mintSoft, color: "#199A76" }}>✓ Done</span>}
          </button>
        );
      })}
      <p className="text-xs" style={{ color: C.sub }}>Pronunciation audio uses your device's Korean voice where available.</p>
    </div>
  );
}

/* ─────────────────────────  App shell  ───────────────────────── */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [me, setMe] = useState(null);
  const [editing, setEditing] = useState(false);
  const [started, setStarted] = useState(false);
  const [tab, setTab] = useState("discover");
  const [connections, setConnections] = useState([]);
  const [chats, setChats] = useState({});
  const [openChatId, setOpenChatId] = useState(null);

  useEffect(() => {
    (async () => {
      const p = await store.get("kc:profile");
      const c = await store.get("kc:connections");
      const ch = await store.get("kc:chats");
      if (p) setMe(p);
      if (c) setConnections(c);
      if (ch) setChats(ch);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => { if (loaded && me) store.set("kc:profile", me); }, [me, loaded]);
  useEffect(() => { if (loaded) store.set("kc:connections", connections); }, [connections, loaded]);
  useEffect(() => { if (loaded) store.set("kc:chats", chats); }, [chats, loaded]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center kc-body" style={{ backgroundColor: C.bg }}>
        <style>{FONT}</style>
        <div className="kc-display text-2xl" style={{ color: C.pink }}>안녕…</div>
      </div>
    );
  }

  if (!me || editing) {
    if (!me && !editing && !started) {
      return (
        <>
          <style>{FONT}</style>
          <Landing onStart={() => setStarted(true)} />
        </>
      );
    }
    return (
      <>
        <style>{FONT}</style>
        <Onboarding
          initial={editing ? me : null}
          onDone={(p) => { setMe(p); setEditing(false); setStarted(false); setTab("discover"); }}
        />
      </>
    );
  }

  const wave = (id) => setConnections((c) => (c.includes(id) ? c : [...c, id]));
  const goChat = (id) => { setTab("chats"); setOpenChatId(id); };
  const reset = async () => {
    await store.del("kc:profile"); await store.del("kc:connections"); await store.del("kc:chats");
    setMe(null); setConnections([]); setChats({}); setOpenChatId(null); setStarted(false); setTab("discover");
  };

  const tabs = [
    { id: "discover", icon: Sparkles, label: "Discover" },
    { id: "rooms", icon: Users, label: "Rooms" },
    { id: "learn", icon: GraduationCap, label: "Learn" },
    { id: "events", icon: Calendar, label: "Events" },
    { id: "chats", icon: MessageCircle, label: "Chats" },
    { id: "profile", icon: UserCircle, label: "You" },
  ];

  return (
    <div className="min-h-screen kc-body" style={{ backgroundColor: C.bg }}>
      <style>{FONT}</style>
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
        <div className="flex-1">
          {tab === "discover" && <Discover me={me} connections={connections} onWave={wave} onOpenChat={goChat} />}
          {tab === "rooms" && <Rooms me={me} />}
          {tab === "learn" && <Learn />}
          {tab === "events" && <Events />}
          {tab === "chats" && (
            <Chats me={me} connections={connections} chats={chats} setChats={setChats} openId={openChatId} setOpenId={setOpenChatId} />
          )}
          {tab === "profile" && <Profile me={me} connections={connections} onEdit={() => setEditing(true)} />}
        </div>

        <nav className="fixed bottom-0 left-0 right-0" style={{ backgroundColor: C.card, borderTop: `1.5px solid ${C.line}` }}>
          <div className="max-w-md mx-auto flex">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); if (t.id !== "chats") setOpenChatId(null); }}
                  className="flex-1 py-2.5 flex flex-col items-center gap-0.5"
                  style={{ color: active ? C.pink : C.sub }}
                >
                  <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
