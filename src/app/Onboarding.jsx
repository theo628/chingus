import { useState, useRef } from "react";
import { Sparkles, Music, Tv, ArrowLeft, ArrowRight, X } from "lucide-react";
import { C } from "../theme";
import { CITIES, LANGS, FANDOMS, DRAMAS, VIBES } from "../data";
import { resizePhoto } from "../lib/helpers";
import { Avatar, Chip, AddOwn, SectionTitle } from "../components/ui";

/* ─────────────────────────  Onboarding  ───────────────────────── */
// Adds a typed-in option, reusing the existing spelling when it matches case-insensitively ("bts" → "BTS").
function addOwn(list, setList, value, options) {
  const lower = value.toLowerCase();
  const existing = [...options, ...list].find((x) => x.toLowerCase() === lower) || value;
  if (!list.includes(existing)) setList([...list, existing]);
}

export default function Onboarding({ initial, onDone, onCancel, onLogout }) {
  const editing = !!initial;
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

  const goStep = (n) => { setStep(n); window.scrollTo(0, 0); };

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
    <div className="min-h-screen flex flex-col kc-body kc-safe-top" style={{ backgroundColor: C.bg }}>
      <div className="max-w-md md:max-w-xl w-full mx-auto flex-1 flex flex-col px-5 pt-10 pb-6">
        {editing && (
          <div className="flex items-center justify-between mb-6">
            {step > 0 ? (
              <button onClick={() => goStep(step - 1)} className="flex items-center gap-1 text-sm" style={{ color: C.sub }}>
                <ArrowLeft size={16} /> Back
              </button>
            ) : <span className="kc-display text-lg" style={{ color: C.pink }}>프로필 수정</span>}
            <button onClick={onCancel} className="flex items-center gap-1 text-sm font-semibold" style={{ color: C.sub }}>
              <X size={16} /> Cancel
            </button>
          </div>
        )}
        {editing && step === 0 && (
          <h1 className="kc-display text-3xl mb-6" style={{ color: C.ink }}>Edit your fan card</h1>
        )}
        {!editing && step === 0 && (
          <div className="mb-8">
            <div className="kc-display leading-none" style={{ fontSize: 64, color: C.pink }}>안녕!</div>
            <h1 className="kc-display text-3xl mt-1" style={{ color: C.ink }}>Find your K-people in India</h1>
            <p className="mt-2 text-sm" style={{ color: C.sub }}>
              Match with fans near you by fandom, drama taste, and language — from Chennai to Guwahati.
            </p>
            <span className="inline-block mt-3 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: C.lilacSoft, color: "#5D4BD1" }}>
              v1.8
            </span>
            {onLogout && (
              <button onClick={onLogout} className="block mt-2 text-xs underline underline-offset-2" style={{ color: C.sub }}>
                Not your number? Log in with another
              </button>
            )}
          </div>
        )}
        {!editing && step > 0 && (
          <button onClick={() => goStep(step - 1)} className="self-start flex items-center gap-1 text-sm mb-6" style={{ color: C.sub }}>
            <ArrowLeft size={16} /> Back
          </button>
        )}

        {step === 0 && (
          <div className="space-y-5">
            <div>
              <span className="text-sm font-medium block mb-1.5" style={{ color: C.ink }}>Profile picture <span style={{ color: C.sub }}>(optional)</span></span>
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
              <label htmlFor="kc-name" className="text-sm font-medium block mb-1.5" style={{ color: C.ink }}>Your name</label>
              <input
                id="kc-name"
                value={name} onChange={(e) => setName(e.target.value)} placeholder="What should friends call you?"
                autoComplete="given-name"
                maxLength={30}
                className="w-full rounded-2xl px-4 py-3 text-base outline-none"
                style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}`, color: C.ink }}
              />
            </div>
            <div>
              <span className="text-sm font-medium block mb-1.5" style={{ color: C.ink }}>Your city</span>
              <div className="flex flex-wrap gap-2">
                {[...CITIES, ...(city && !CITIES.includes(city) ? [city] : [])].map((c) => (
                  <Chip key={c} label={c} tone="lilac" active={city === c} onClick={() => setCity(c)} />
                ))}
                <AddOwn tone="lilac" placeholder="Type your city" onAdd={(v) => setCity(CITIES.find((c) => c.toLowerCase() === v.toLowerCase()) || v)} />
              </div>
            </div>
            <div>
              <span className="text-sm font-medium block mb-1.5" style={{ color: C.ink }}>Languages you're comfy in</span>
              <div className="flex flex-wrap gap-2">
                {[...LANGS, ...langs.filter((l) => !LANGS.includes(l))].map((l) => (
                  <Chip key={l} label={l} tone="mint" active={langs.includes(l)} onClick={() => toggle(langs, setLangs, l)} />
                ))}
                <AddOwn tone="mint" placeholder="Type your language" onAdd={(v) => addOwn(langs, setLangs, v, LANGS)} />
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
                <AddOwn placeholder="Add a group / artist" onAdd={(v) => addOwn(fandoms, setFandoms, v, FANDOMS)} />
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
                <AddOwn tone="lilac" placeholder="Add a drama / film" onAdd={(v) => addOwn(dramas, setDramas, v, DRAMAS)} />
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
              <AddOwn tone="butter" placeholder="Add your own" onAdd={(v) => addOwn(vibes, setVibes, v, VIBES)} />
            </div>
            <p className="text-xs" style={{ color: C.sub }}>
              This decides who you see first — pick at least one.
            </p>
          </div>
        )}

        <div className="mt-auto pt-8 kc-safe-bottom">
          <button
            disabled={!canNext}
            onClick={() => (step < 2 ? goStep(step + 1) : onDone({ name: name.trim(), city, langs, fandoms, dramas, vibes, emoji: "💜", photo }))}
            className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 text-base font-semibold transition-opacity"
            style={{ backgroundColor: C.pink, color: "#fff", opacity: canNext ? 1 : 0.35 }}
          >
            {step < 2 ? <>Continue <ArrowRight size={18} /></> : editing ? <>Save changes <Sparkles size={18} /></> : <>Show my matches <Sparkles size={18} /></>}
          </button>
          <div className="flex justify-center gap-1.5 mt-4" aria-label={`Step ${step + 1} of 3`}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-full" style={{ width: i === step ? 22 : 8, height: 8, backgroundColor: i === step ? C.pink : C.line, transition: "width .2s" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
