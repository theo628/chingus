/* ─────────────────────────  Data  ───────────────────────── */
export const CITIES = ["Chennai", "Coimbatore", "Bengaluru", "Delhi NCR", "Mumbai", "Hyderabad", "Kochi", "Guwahati", "Kolkata", "Pune"];
export const LANGS = ["English", "Tamil", "Hindi", "Telugu", "Malayalam", "Kannada", "Bengali", "Marathi"];
export const FANDOMS = ["BTS", "BLACKPINK", "Stray Kids", "SEVENTEEN", "TWICE", "NewJeans", "EXO", "ATEEZ", "TXT", "IVE", "aespa", "ENHYPEN"];
export const DRAMAS = ["Crash Landing on You", "Goblin", "Queen of Tears", "Vincenzo", "Itaewon Class", "Hometown Cha-Cha-Cha", "Moving", "Squid Game", "Reply 1988", "True Beauty"];
export const VIBES = ["Learning Korean", "K-food & cooking", "Dance covers", "Webtoons", "K-beauty", "Concert buddy", "Cup-sleeve events", "Fan art", "OST playlists", "Travel to Seoul"];

export const MOCK_USERS = [
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

export const EVENTS = [
  { id: "e1", title: "K-Pop India Contest — Regional Rounds", where: "Multiple cities", when: "Aug–Oct 2026", tag: "Contest", note: "KCCI's flagship contest, running since 2012. Regional rounds feed the Delhi finale." },
  { id: "e2", title: "Cup-sleeve Café Meetup", where: "Chennai · Besant Nagar", when: "Sat, Sep 26", tag: "Meetup", note: "Fan-run birthday café event. Freebies while stock lasts, playlist on loop." },
  { id: "e3", title: "Hangul Day Beginner Workshop", where: "Online · Zoom", when: "Oct 9", tag: "Language", note: "Learn to read Hangul in 90 minutes. Hosted by community volunteers." },
  { id: "e4", title: "K-Drama Watch Party — Moving Finale", where: "Bengaluru · Koramangala", when: "Sun, Oct 4", tag: "Watch party", note: "Projector, snacks, and absolutely no spoilers before 6pm." },
];

export const CANNED_ICEBREAKERS = [
  "Annyeong! I saw we're both into {shared} — what got you into it first?",
  "Okay important question: bias ranking, go. I promise not to judge (much).",
  "If we planned one perfect K-day in {city} — food, playlist, drama — what's on it?",
];

/* ─────────────────────────  Learn decks  ───────────────────────── */
export const LEARN_DECKS = [
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
