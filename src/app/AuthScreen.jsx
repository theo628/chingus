import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Smartphone, ShieldCheck } from "lucide-react";
import { C } from "../theme";
import { isSubmitKey } from "../lib/helpers";

/* ─────────────────────────  OTP Login  ───────────────────────── */
export default function AuthScreen({ onDone, onBack }) {
  const otpRef = useRef(null);
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

  useEffect(() => { if (stage === "otp") otpRef.current?.focus(); }, [stage]);

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
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col px-5 pt-6 pb-8 kc-safe-bottom">
        {onBack ? (
          <button onClick={onBack} className="self-start flex items-center gap-1 text-sm mb-4" style={{ color: C.sub }}>
            <ArrowLeft size={16} /> Back
          </button>
        ) : <div className="h-8" />}
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
              <label htmlFor="kc-phone" className="text-sm font-medium block mb-1.5" style={{ color: C.ink }}>Mobile number</label>
              <div className="flex items-center gap-2 rounded-2xl px-4 py-3" style={{ backgroundColor: C.card, border: `1.5px solid ${error ? C.pink : C.line}` }}>
                <Smartphone size={18} style={{ color: C.sub }} />
                <span className="text-base font-medium" style={{ color: C.ink }}>+91</span>
                <input
                  id="kc-phone"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                  onKeyDown={(e) => isSubmitKey(e) && sendOtp()}
                  enterKeyHint="send"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="98765 43210"
                  className="flex-1 min-w-0 text-base outline-none bg-transparent"
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
              Demo mode — no SMS is actually sent. Your code is <span data-testid="demo-otp" className="kc-display text-base tracking-widest">{code}</span>
            </div>
            <div>
              <label htmlFor="kc-otp" className="text-sm font-medium block mb-1.5" style={{ color: C.ink }}>6-digit code</label>
              <input
                id="kc-otp"
                ref={otpRef}
                value={entered}
                onChange={(e) => { setEntered(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                onKeyDown={(e) => isSubmitKey(e) && entered.length === 6 && verify()}
                enterKeyHint="done"
                inputMode="numeric"
                autoComplete="one-time-code"
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
