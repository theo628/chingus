import { useState, useEffect, useRef } from "react";
import { Sparkles, Users, Calendar, MessageCircle, CircleUser, GraduationCap } from "lucide-react";
import { C } from "../theme";
import { MOCK_USERS } from "../data";
import { store, accountNs } from "../lib/store";
import { navigate, goBack } from "../lib/router";
import { sanitizeProfile, sanitizeMessages } from "../lib/helpers";
import AuthScreen from "./AuthScreen";
import Landing from "./Landing";
import Onboarding from "./Onboarding";
import Discover from "./Discover";
import Rooms, { roomDefsFor } from "./Rooms";
import Learn from "./Learn";
import Events from "./Events";
import Chats from "./Chats";
import Profile from "./Profile";

export const TABS = [
  { id: "discover", icon: Sparkles, label: "Discover" },
  { id: "rooms", icon: Users, label: "Rooms" },
  { id: "learn", icon: GraduationCap, label: "Learn" },
  { id: "events", icon: Calendar, label: "Events" },
  { id: "chats", icon: MessageCircle, label: "Chats" },
  { id: "profile", icon: CircleUser, label: "You" },
];
const TAB_IDS = TABS.map((t) => t.id);
const USER_IDS = MOCK_USERS.map((u) => u.id);

const replyPoolFor = (user) => [
  "Omg yes!! Finally someone gets it 😭",
  "Wait, you too?? Okay we're going to be friends.",
  "Hahaha exactly! What's your top pick right now?",
  "That's so cool — I've been wanting to try that here in " + user.city + ".",
];

/* ─────────────────────────  App shell  ─────────────────────────
 * Routes (after #/app):
 *   (none)            landing            login              OTP login
 *   welcome           onboarding         discover | events
 *   rooms[/:roomId]   learn[/:deckId]    chats[/:userId]    profile[/edit] */
export default function App({ parts = [] }) {
  const [seg, sub] = parts;
  const tab = TAB_IDS.includes(seg) ? seg : null;

  const [loaded, setLoaded] = useState(false);
  const [session, setSession] = useState(null);
  const [readyNs, setReadyNs] = useState(null);
  const [me, setMe] = useState(null);
  const [connections, setConnections] = useState([]);
  const [chats, setChats] = useState({});
  const [roomPosts, setRoomPosts] = useState({});
  const [typing, setTyping] = useState({});
  const timers = useRef([]);

  const ns = session ? accountNs(session.phone) : null;
  // Only persist once the signed-in account's own data has been loaded into state.
  const ready = loaded && !!ns && readyNs === ns;

  const loadAccount = async (sess) => {
    const n = accountNs(sess.phone);
    const [p, c, ch, rp] = await Promise.all(["profile", "connections", "chats", "rooms"].map((k) => store.get(n + k)));
    setMe(sanitizeProfile(p));
    setConnections(Array.isArray(c) ? c.filter((id) => USER_IDS.includes(id)) : []);
    setChats(sanitizeMessages(ch, (m) => m.from === "me" || m.from === "them"));
    setRoomPosts(sanitizeMessages(rp, () => true));
    setTyping({});
    setReadyNs(n);
  };

  useEffect(() => {
    (async () => {
      const s = await store.get("kc:session");
      if (s && typeof s.phone === "string" && /^\+?91\s?[6-9]\d{9}$/.test(s.phone.replace(/\s/g, ""))) {
        await loadAccount(s);
        setSession(s);
      }
      setLoaded(true);
    })();
    return () => timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => { if (ready && me) store.set(ns + "profile", me); }, [me, ready]);
  useEffect(() => { if (ready) store.set(ns + "connections", connections); }, [connections, ready]);
  useEffect(() => { if (ready) store.set(ns + "chats", chats); }, [chats, ready]);
  useEffect(() => { if (ready) store.set(ns + "rooms", roomPosts); }, [roomPosts, ready]);

  // Keep the URL consistent with what the user is allowed to see.
  useEffect(() => {
    if (!loaded) return;
    const fix = (to) => navigate(to, { replace: true });
    if (!session) { if (seg && seg !== "login") fix("/app"); return; }
    if (!me) { if (seg !== "welcome") fix("/app/welcome"); return; }
    if (!tab) { fix("/app/discover"); return; }
    if (tab === "chats" && sub && !connections.includes(sub)) fix("/app/chats");
    else if (tab === "rooms" && sub && !roomDefsFor(me).some((r) => r.id === sub)) fix("/app/rooms");
    else if (tab === "profile" && sub && sub !== "edit") fix("/app/profile");
    else if ((tab === "discover" || tab === "events") && sub) fix("/app/" + tab);
  }, [loaded, session, me, seg, sub, connections]);

  const clearAccountState = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setReadyNs(null);
    setSession(null);
    setMe(null); setConnections([]); setChats({}); setRoomPosts({}); setTyping({});
  };

  const login = async ({ phone, verifiedAt }) => {
    const s = { phone, verifiedAt };
    await store.set("kc:session", s);
    await loadAccount(s);
    setSession(s);
  };

  const logout = async () => {
    clearAccountState();
    await store.del("kc:session");
    navigate("/app", { replace: true });
  };

  const deleteData = async () => {
    const n = ns;
    clearAccountState();
    await store.del("kc:session");
    if (n) await store.delPrefix(n);
    navigate("/app", { replace: true });
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center kc-body" style={{ backgroundColor: C.bg }}>
        <div className="kc-display text-2xl" style={{ color: C.pink }} role="status">안녕…</div>
      </div>
    );
  }

  if (!session) {
    if (seg === "login") return <AuthScreen onDone={login} onBack={() => goBack("/app")} />;
    return <Landing onStart={() => navigate("/app/login")} />;
  }

  if (!me) {
    return (
      <Onboarding
        key="new"
        onLogout={logout}
        onDone={(p) => { setMe(p); navigate("/app/discover", { replace: true }); }}
      />
    );
  }

  if (tab === "profile" && sub === "edit") {
    return (
      <Onboarding
        key="edit"
        initial={me}
        onCancel={() => goBack("/app/profile")}
        onDone={(p) => { setMe(p); goBack("/app/profile"); }}
      />
    );
  }

  const activeTab = tab || "discover";

  const wave = (id) => setConnections((c) => (c.includes(id) ? c : [...c, id]));
  const openChat = (id) => navigate("/app/chats/" + id);

  const sendChat = (id, text) => {
    const user = MOCK_USERS.find((u) => u.id === id);
    if (!user) return;
    setChats((c) => ({ ...c, [id]: [...(c[id] || []), { from: "me", text, at: Date.now() }] }));
    setTyping((t) => ({ ...t, [id]: (t[id] || 0) + 1 }));
    const timer = setTimeout(() => {
      timers.current = timers.current.filter((x) => x !== timer);
      setChats((c) => {
        const list = c[id] || [];
        const theirs = list.filter((m) => m.from === "them").length;
        const pool = replyPoolFor(user);
        return { ...c, [id]: [...list, { from: "them", text: pool[theirs % pool.length], at: Date.now() }] };
      });
      setTyping((t) => {
        const n = { ...t };
        if (n[id] > 1) n[id] -= 1; else delete n[id];
        return n;
      });
    }, 900 + Math.random() * 700);
    timers.current.push(timer);
  };

  const postRoom = (roomId, text) =>
    setRoomPosts((r) => ({ ...r, [roomId]: [...(r[roomId] || []), { mine: true, text, at: Date.now() }] }));

  const selectTab = (id) => {
    if (id === activeTab && !sub) window.scrollTo({ top: 0, behavior: "smooth" });
    else navigate("/app/" + id);
  };

  return (
    <div className="min-h-screen kc-body" style={{ backgroundColor: C.bg }}>
      <div className="lg:flex">
        {/* Desktop sidebar */}
        <aside
          className="hidden lg:flex lg:flex-col w-60 xl:w-64 shrink-0 sticky kc-sidebar px-4 py-6"
          style={{ backgroundColor: C.card, borderRight: `1.5px solid ${C.line}` }}
        >
          <button onClick={() => selectTab("discover")} className="flex items-center gap-2 px-3 text-left" aria-label="Chingus — Discover">
            <span className="kc-display text-2xl" style={{ color: C.pink }}>친구</span>
            <span className="kc-display text-2xl" style={{ color: C.ink }}>Chingus</span>
          </button>
          <nav className="mt-8 space-y-1" aria-label="App sections">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => selectTab(t.id)}
                  aria-current={active ? "page" : undefined}
                  className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors"
                  style={{ backgroundColor: active ? C.pinkSoft : "transparent", color: active ? C.pink : C.sub }}
                >
                  <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                  {t.label}
                  {t.id === "chats" && Object.keys(typing).length > 0 && (
                    <span className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: C.pink }} aria-label="New activity" />
                  )}
                </button>
              );
            })}
          </nav>
          <p className="mt-auto px-3 text-xs" style={{ color: C.sub }}>Chingus · v1.8</p>
        </aside>

        <main className="flex-1 min-w-0" id="main">
          <div className="max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
            {activeTab === "discover" && <Discover me={me} connections={connections} onWave={wave} onOpenChat={openChat} />}
            {activeTab === "rooms" && (
              <Rooms
                me={me} posts={roomPosts} openId={sub || null}
                onOpen={(id) => navigate("/app/rooms/" + encodeURIComponent(id))}
                onClose={() => goBack("/app/rooms")}
                onPost={postRoom}
              />
            )}
            {activeTab === "learn" && (
              <Learn
                ns={ns} deckId={sub || null}
                onOpenDeck={(id) => navigate("/app/learn/" + id)}
                onCloseDeck={(replace) => (replace ? navigate("/app/learn", { replace: true }) : goBack("/app/learn"))}
              />
            )}
            {activeTab === "events" && <Events />}
            {activeTab === "chats" && (
              <Chats
                me={me} connections={connections} chats={chats} typing={typing}
                openId={sub || null}
                onOpen={openChat}
                onClose={() => goBack("/app/chats")}
                onSend={sendChat}
                onGoDiscover={() => navigate("/app/discover")}
              />
            )}
            {activeTab === "profile" && (
              <Profile
                me={me} connections={connections} phone={session.phone}
                onEdit={() => navigate("/app/profile/edit")}
                onLogout={logout}
                onDeleteData={deleteData}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile / tablet bottom tab bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-20 kc-safe-bottom"
        aria-label="App sections"
        style={{ backgroundColor: C.card, borderTop: `1.5px solid ${C.line}` }}
      >
        <div className="max-w-md md:max-w-2xl mx-auto flex h-[58px]">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => selectTab(t.id)}
                aria-current={active ? "page" : undefined}
                className="relative flex-1 min-w-0 py-2.5 flex flex-col items-center justify-center gap-0.5"
                style={{ color: active ? C.pink : C.sub }}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                <span className="text-xs max-[359px]:text-[10px] font-medium truncate max-w-full">{t.label}</span>
                {t.id === "chats" && Object.keys(typing).length > 0 && (
                  <span className="absolute top-2 w-2 h-2 rounded-full" style={{ backgroundColor: C.pink, marginLeft: 22 }} aria-label="New activity" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
