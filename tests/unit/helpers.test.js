import { describe, it, expect } from "vitest";
import {
  matchScore, sharedTags, sanitizeProfile, sanitizeMessages, isSubmitKey, maskPhone, formatTime,
} from "../../src/lib/helpers";
import { MOCK_USERS } from "../../src/data";

const me = {
  name: "Theo", city: "Chennai", langs: ["Tamil", "English"],
  fandoms: ["BTS"], dramas: ["Queen of Tears"], vibes: ["Learning Korean"],
};

describe("matchScore", () => {
  it("is 0 without a profile", () => {
    expect(matchScore(null, MOCK_USERS[0])).toBe(0);
  });
  it("weights fandom, drama, vibe, city and language overlap", () => {
    // Priya: BTS (18) + Queen of Tears (12) + Learning Korean (10) + Chennai (20) + Tamil/English (8)
    expect(matchScore(me, MOCK_USERS[0])).toBe(68);
  });
  it("stays within 12–99", () => {
    const nobody = { ...me, city: "Nowhere", langs: [], fandoms: [], dramas: [], vibes: [] };
    expect(matchScore(nobody, MOCK_USERS[1])).toBe(12);
    const everything = { ...MOCK_USERS[6], langs: MOCK_USERS[6].langs };
    expect(matchScore(everything, MOCK_USERS[6])).toBe(99);
  });
});

describe("sharedTags", () => {
  it("lists the interests both people have", () => {
    expect(sharedTags(me, MOCK_USERS[0])).toEqual(["BTS", "Queen of Tears", "Learning Korean"]);
    expect(sharedTags(null, MOCK_USERS[0])).toEqual([]);
  });
});

describe("sanitizeProfile", () => {
  it("accepts a valid profile and drops unknown fields", () => {
    const p = sanitizeProfile({ ...me, hacked: true, photo: "javascript:alert(1)" });
    expect(p.name).toBe("Theo");
    expect(p.photo).toBeNull();
    expect(p).not.toHaveProperty("hacked");
  });
  it("keeps data-URL photos", () => {
    expect(sanitizeProfile({ ...me, photo: "data:image/jpeg;base64,AAAA" }).photo).toMatch(/^data:image\//);
  });
  it.each([null, "garbage", 42, {}, { ...me, name: "  " }, { ...me, fandoms: "BTS" }, { ...me, langs: [1] }])(
    "rejects corrupted data %#", (bad) => {
      expect(sanitizeProfile(bad)).toBeNull();
    }
  );
});

describe("sanitizeMessages", () => {
  it("keeps only arrays of valid messages", () => {
    const out = sanitizeMessages(
      { u1: [{ from: "me", text: "hi" }, { from: "x", text: "bad" }, null, { from: "them" }], u2: "nope" },
      (m) => m.from === "me" || m.from === "them"
    );
    expect(out).toEqual({ u1: [{ from: "me", text: "hi" }] });
  });
  it("handles non-objects", () => {
    expect(sanitizeMessages(null, () => true)).toEqual({});
    expect(sanitizeMessages([1, 2], () => true)).toEqual({});
  });
});

describe("isSubmitKey", () => {
  const ev = (over) => ({ key: "Enter", shiftKey: false, keyCode: 13, nativeEvent: { isComposing: false }, ...over });
  it("submits on plain Enter", () => expect(isSubmitKey(ev())).toBe(true));
  it("ignores Enter while an IME is composing (Korean/Hindi keyboards)", () => {
    expect(isSubmitKey(ev({ nativeEvent: { isComposing: true } }))).toBe(false);
    expect(isSubmitKey(ev({ keyCode: 229 }))).toBe(false);
  });
  it("ignores Shift+Enter and other keys", () => {
    expect(isSubmitKey(ev({ shiftKey: true }))).toBe(false);
    expect(isSubmitKey(ev({ key: "a" }))).toBe(false);
  });
});

describe("maskPhone / formatTime", () => {
  it("masks the middle of the number", () => {
    expect(maskPhone("+91 9876543210")).toBe("+91 98••• ••210");
    expect(maskPhone("")).toBe("");
  });
  it("formats timestamps and tolerates bad input", () => {
    expect(formatTime(Date.now())).not.toBe("");
    expect(formatTime(undefined)).toBe("");
  });
});
