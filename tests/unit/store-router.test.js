import { describe, it, expect, beforeEach } from "vitest";
import { store, accountNs } from "../../src/lib/store";
import { navigate, goBack, currentPath, pathParts, lastNavigation } from "../../src/lib/router";

describe("store", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips JSON values", async () => {
    await store.set("kc:test", { a: [1, 2] });
    expect(await store.get("kc:test")).toEqual({ a: [1, 2] });
    expect(JSON.parse(localStorage.getItem("kc:test"))).toEqual({ a: [1, 2] });
  });

  it("returns null for missing or corrupted values", async () => {
    expect(await store.get("kc:missing")).toBeNull();
    localStorage.setItem("kc:broken", "{not json");
    expect(await store.get("kc:broken")).toBeNull();
  });

  it("deletes one key or a whole account prefix", async () => {
    const ns = accountNs("+91 9876543210");
    await store.set(ns + "profile", { name: "A" });
    await store.set(ns + "chats", {});
    await store.set("kc:acct:9000000000:profile", { name: "B" });
    await store.delPrefix(ns);
    expect(await store.get(ns + "profile")).toBeNull();
    expect(await store.get(ns + "chats")).toBeNull();
    expect(await store.get("kc:acct:9000000000:profile")).toEqual({ name: "B" });
    await store.del("kc:acct:9000000000:profile");
    expect(await store.get("kc:acct:9000000000:profile")).toBeNull();
  });

  it("namespaces accounts by the last 10 digits", () => {
    expect(accountNs("+91 98765 43210")).toBe("kc:acct:9876543210:");
    expect(accountNs("9876543210")).toBe("kc:acct:9876543210:");
  });
});

describe("router", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/#/");
  });

  it("parses and normalises hash paths", () => {
    window.history.replaceState(null, "", "/#/app/chats/u1/");
    expect(currentPath()).toBe("/app/chats/u1");
    expect(pathParts()).toEqual(["app", "chats", "u1"]);
    window.history.replaceState(null, "", "/");
    expect(currentPath()).toBe("/");
    window.history.replaceState(null, "", "/#/app/rooms/r-Stray%20Kids");
    expect(pathParts()).toEqual(["app", "rooms", "r-Stray Kids"]);
  });

  it("pushes and replaces history entries", () => {
    const start = window.history.length;
    navigate("/app/login");
    expect(currentPath()).toBe("/app/login");
    expect(lastNavigation()).toBe("push");
    expect(window.history.length).toBe(start + 1);
    navigate("/app/discover", { replace: true });
    expect(currentPath()).toBe("/app/discover");
    expect(lastNavigation()).toBe("replace");
    expect(window.history.length).toBe(start + 1);
  });

  it("ignores pushing the page you're already on", () => {
    navigate("/app/events");
    const len = window.history.length;
    navigate("/app/events");
    expect(window.history.length).toBe(len);
  });

  it("goBack falls back to a replace when there's no in-app history", () => {
    window.history.replaceState(null, "", "/#/app/chats/u1");
    goBack("/app/chats");
    expect(currentPath()).toBe("/app/chats");
  });
});
