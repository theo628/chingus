import { useState, useEffect } from "react";
import { X, Lock, Volume2, Flame, Trophy, RefreshCw } from "lucide-react";
import { C } from "../theme";
import { LEARN_DECKS } from "../data";
import { store } from "../lib/store";
import { speakKr, stopSpeech } from "../lib/helpers";
import { SectionTitle, ConfirmDialog } from "../components/ui";

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

/* ─────────────────────────  Learn (gamified)  ───────────────────────── */
export default function Learn({ ns, deckId, onOpenDeck, onCloseDeck }) {
  const [data, setData] = useState({ xp: 0, done: {} });
  const [dataReady, setDataReady] = useState(false);
  const [view, setView] = useState("home"); // home | lesson | result
  const [deck, setDeck] = useState(null);
  const [seq, setSeq] = useState([]);
  const [si, setSi] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [combo, setCombo] = useState(0);
  const [gained, setGained] = useState(0);
  const [picked, setPicked] = useState(null);
  const [passed, setPassed] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const d = await store.get(ns + "learn");
      if (!active) return;
      if (d && typeof d.xp === "number" && d.done && typeof d.done === "object") setData(d);
      setDataReady(true);
    })();
    return () => { active = false; };
  }, [ns]);
  const save = (d) => { setData(d); store.set(ns + "learn", d); };

  // Stop any pronunciation when leaving the Learn tab.
  useEffect(() => () => stopSpeech(), []);

  useEffect(() => { window.scrollTo(0, 0); }, [view]);

  const isUnlocked = (i) => i === 0 || !!data.done[LEARN_DECKS[i - 1].id];

  // The open lesson lives in the URL (/app/learn/:deckId), so browser back leaves the lesson.
  useEffect(() => {
    if (!dataReady) return;
    if (!deckId) {
      if (view !== "home") { stopSpeech(); setConfirmQuit(false); setView("home"); }
      return;
    }
    const i = LEARN_DECKS.findIndex((d) => d.id === deckId);
    if (i < 0 || !isUnlocked(i)) { onCloseDeck(true); return; }
    if (!deck || deck.id !== deckId || view === "home") startLesson(LEARN_DECKS[i]);
  }, [deckId, dataReady]);

  const quit = () => {
    if (view === "lesson" && (si > 0 || picked)) { setConfirmQuit(true); return; }
    stopSpeech();
    onCloseDeck();
  };

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
      <div className="px-5 pt-5 lg:pt-8 pb-28 lg:pb-12 flex flex-col max-w-xl mx-auto w-full" style={{ minHeight: "82vh" }}>
        {/* Top bar: quit · progress · hearts */}
        <div className="flex items-center justify-between">
          <button onClick={quit} aria-label="Quit lesson" className="p-1 -m-1"><X size={20} style={{ color: C.sub }} /></button>
          <div className="flex-1 mx-3 h-3 rounded-full" style={{ backgroundColor: C.line }} role="progressbar" aria-valuemin={0} aria-valuemax={seq.length} aria-valuenow={si}>
            <div className="h-3 rounded-full" style={{ width: (si / seq.length) * 100 + "%", backgroundColor: C.mint, transition: "width .25s" }} />
          </div>
          <div className="text-sm font-semibold" style={{ color: C.pink }} aria-label={hearts + " hearts left"}>{"♥".repeat(hearts)}{"♡".repeat(3 - hearts)}</div>
        </div>

        {combo >= 2 && (
          <div className="mt-3 self-center flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: C.butterSoft, color: "#9A7A00" }}>
            <Flame size={13} /> {combo} in a row!
          </div>
        )}

        {/* ONE card at a time */}
        {step.type === "intro" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: bg, color: fg }}>New phrase</span>
            <button onClick={() => speakKr(step.item.kr)} className="mt-5 kc-display leading-tight break-words max-w-full" style={{ fontSize: 44, color: C.ink }}>
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
                  <button onClick={() => speakKr(step.item.kr)} className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: C.lilacSoft }} aria-label="Hear it">
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
            <div className="text-sm font-semibold mb-2" role="status" style={{ color: correct ? "#199A76" : C.pink }}>
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
        <ConfirmDialog
          open={confirmQuit}
          title="Quit this lesson?"
          body="Your progress in this lesson won't be saved."
          confirmLabel="Quit"
          cancelLabel="Keep learning"
          danger
          onCancel={() => setConfirmQuit(false)}
          onConfirm={() => { setConfirmQuit(false); stopSpeech(); onCloseDeck(); }}
        />
      </div>
    );
  }

  if (view === "result" && deck) {
    return (
      <div className="px-5 pt-16 pb-28 lg:pb-12 text-center space-y-4">
        <div className="text-5xl">{passed ? "🏆" : "💔"}</div>
        <div className="kc-display text-3xl" style={{ color: C.ink }}>
          {passed ? "Lesson complete!" : "Out of hearts!"}
        </div>
        <p className="text-sm" style={{ color: C.sub }}>
          {passed ? `You earned ${gained} XP in "${deck.title}".` : `You keep ${Math.floor(gained / 2)} XP — try again to finish the lesson.`}
        </p>
        <div className="flex flex-wrap gap-2 justify-center pt-2">
          <button onClick={() => startLesson(deck)} className="rounded-2xl px-5 py-3 text-sm font-semibold flex items-center gap-1.5" style={{ backgroundColor: C.lilacSoft, color: "#5D4BD1" }}>
            <RefreshCw size={15} /> {passed ? "Practice again" : "Retry"}
          </button>
          <button onClick={() => onCloseDeck()} className="rounded-2xl px-5 py-3 text-sm font-semibold" style={{ backgroundColor: C.pink, color: "#fff" }}>
            All lessons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-5 lg:pt-8 pb-28 lg:pb-12 space-y-4">
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {LEARN_DECKS.map((d, i) => {
          const [bg, fg] = toneMap[d.tone];
          const done = !!data.done[d.id];
          const unlocked = isUnlocked(i);
          return (
            <button key={d.id} onClick={() => unlocked && onOpenDeck(d.id)} disabled={!unlocked}
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
              <div className="flex-1 min-w-0">
                <div className="kc-display text-lg" style={{ color: C.ink }}>Chapter {i + 1} · {d.title}</div>
                <div className="text-xs" style={{ color: C.sub }}>
                  {unlocked
                    ? d.items.length + " phrases · earn up to " + d.items.length * 20 + " XP" + (done ? " · redo anytime" : "")
                    : "Finish \"" + LEARN_DECKS[i - 1].title + "\" to unlock"}
                </div>
              </div>
              {done && <span className="text-xs font-semibold px-2 py-1 rounded-full shrink-0" style={{ backgroundColor: C.mintSoft, color: "#199A76" }}>✓ Done</span>}
            </button>
          );
        })}
      </div>
      <p className="text-xs" style={{ color: C.sub }}>Pronunciation audio uses your device's Korean voice where available.</p>
    </div>
  );
}
