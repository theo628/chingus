// Renders the app icon to PNGs for home screens: `node scripts/generate-icons.mjs`
import { chromium } from "@playwright/test";

const card = `
  <rect x="96" y="120" width="320" height="272" rx="56" fill="#FFFFFF" transform="rotate(-4 256 256)"/>
  <path d="M256 352c-8 0-15-3-21-8l-66-60c-26-24-28-64-4-89 22-23 58-24 82-3l9 8 9-8c24-21 60-20 82 3 24 25 22 65-4 89l-66 60c-6 5-13 8-21 8z" fill="#FF4D7D"/>`;

// Rounded icon for browsers/Android "any"; full-bleed squares for iOS and maskable icons
// (iOS paints transparent corners black; maskable icons need content inside the safe zone).
const rounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#FF4D7D"/>${card}</svg>`;
const square = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#FF4D7D"/>${card}</svg>`;
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#FF4D7D"/><g transform="translate(256 256) scale(0.72) translate(-256 -256)">${card}</g></svg>`;

const outputs = [
  ["public/icon-192.png", rounded, 192],
  ["public/icon-512.png", rounded, 512],
  ["public/apple-touch-icon.png", square, 180],
  ["public/icon-maskable-512.png", maskable, 512],
];

const browser = await chromium.launch();
for (const [file, svg, size] of outputs) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: file, omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  await page.close();
  console.log("wrote", file);
}
await browser.close();
