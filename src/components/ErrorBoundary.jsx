import React from "react";
import { C } from "../theme";
import { store } from "../lib/store";

/* Shows a friendly recovery screen instead of a blank page if anything crashes. */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[Chingus] crashed:", error, info && info.componentStack);
  }

  reload = () => {
    window.location.hash = "#/";
    window.location.reload();
  };

  reset = async () => {
    await store.delPrefix("kc:");
    this.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center px-5 kc-body" style={{ backgroundColor: C.bg }}>
        <div role="alert" className="max-w-sm w-full rounded-3xl p-6 text-center" style={{ backgroundColor: C.card, border: `1.5px solid ${C.line}` }}>
          <div className="text-4xl">😵‍💫</div>
          <h1 className="kc-display text-2xl mt-2" style={{ color: C.ink }}>Something went wrong</h1>
          <p className="text-sm mt-1.5" style={{ color: C.sub }}>
            Try reloading. If it keeps happening, resetting clears the data saved on this device.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <button onClick={this.reload} className="rounded-2xl py-3 text-sm font-semibold" style={{ backgroundColor: C.pink, color: "#fff" }}>
              Reload
            </button>
            <button onClick={this.reset} className="rounded-2xl py-3 text-sm font-semibold" style={{ backgroundColor: C.lilacSoft, color: "#5D4BD1" }}>
              Reset app data
            </button>
          </div>
        </div>
      </div>
    );
  }
}
