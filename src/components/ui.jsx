import { useState, useEffect, useRef } from "react";
import { C } from "../theme";
import { isSubmitKey } from "../lib/helpers";

export function Avatar({ photo, emoji, size = 56, radius = 16, rotate = 0 }) {
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
export function Chip({ label, active, onClick, tone = "pink" }) {
  const tones = {
    pink: { bg: C.pinkSoft, fg: C.pink, activeBg: C.pink },
    lilac: { bg: C.lilacSoft, fg: C.lilac, activeBg: C.lilac },
    mint: { bg: C.mintSoft, fg: "#199A76", activeBg: C.mint },
    butter: { bg: C.butterSoft, fg: "#9A7A00", activeBg: C.butter },
  }[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
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

export function AddOwn({ tone = "pink", placeholder, onAdd }) {
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
    <span className="inline-flex items-center gap-1 max-w-full">
      <input
        autoFocus value={val} onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (isSubmitKey(e)) commit(); if (e.key === "Escape") { setVal(""); setOpenInput(false); } }}
        onBlur={() => { if (!val.trim()) setOpenInput(false); }}
        placeholder={placeholder}
        aria-label={placeholder}
        maxLength={40}
        enterKeyHint="done"
        className="rounded-full px-3 py-1.5 text-sm outline-none min-w-0"
        style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}`, color: C.ink, width: 150 }}
      />
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={commit} className="rounded-full px-3 py-1.5 text-sm font-semibold shrink-0" style={{ backgroundColor: C.ink, color: "#fff" }}>Add</button>
    </span>
  );
}

export function Tag({ label, tone = "lilac" }) {
  const bg = { lilac: C.lilacSoft, pink: C.pinkSoft, mint: C.mintSoft, butter: C.butterSoft }[tone];
  const fg = { lilac: "#5D4BD1", pink: C.pink, mint: "#199A76", butter: "#9A7A00" }[tone];
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: bg, color: fg }}>
      {label}
    </span>
  );
}

/* Modal confirmation — used for destructive or progress-losing actions. */
export function ConfirmDialog({ open, title, body, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false, onConfirm, onCancel }) {
  const confirmRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    confirmRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (prev && prev.focus) prev.focus();
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center p-4 kc-body" style={{ zIndex: 70, backgroundColor: "rgba(36,27,58,0.45)" }} onClick={onCancel}>
      <div
        role="dialog" aria-modal="true" aria-labelledby="kc-dialog-title"
        className="w-full max-w-sm rounded-3xl p-5 kc-safe-bottom"
        style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="kc-dialog-title" className="kc-display text-2xl" style={{ color: C.ink }}>{title}</h2>
        {body && <p className="text-sm mt-1.5" style={{ color: C.sub }}>{body}</p>}
        <div className="mt-5 flex gap-2">
          <button onClick={onCancel} className="flex-1 rounded-2xl py-3 text-sm font-semibold" style={{ backgroundColor: C.lilacSoft, color: "#5D4BD1" }}>
            {cancelLabel}
          </button>
          <button ref={confirmRef} onClick={onConfirm} className="flex-1 rounded-2xl py-3 text-sm font-semibold" style={{ backgroundColor: danger ? C.pink : C.ink, color: "#fff" }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SectionTitle({ kr, en }) {
  return (
    <div className="mb-3">
      <div className="kc-display text-lg" style={{ color: C.pink }}>{kr}</div>
      <h2 className="kc-display text-2xl" style={{ color: C.ink }}>{en}</h2>
    </div>
  );
}
