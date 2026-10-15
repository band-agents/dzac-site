/**
 * Render the Remotion films to video files the site plays natively.
 *
 *   node scripts/render-films.mjs              # all six cuts
 *   node scripts/render-films.mjs or-en        # just one
 *   node scripts/render-films.mjs --encode     # re-encode existing masters only
 *
 * 1. Bundle src/remotion (index.ts registers the compositions).
 * 2. Render each composition to a high-quality master (renders/, git-ignored).
 * 3. Encode web versions into public/media/films/: AV1 first (smallest), H.264
 *    for browsers without AV1, plus a poster still. The hero sits under a dark
 *    shade, so it takes stronger compression, and gets a lighter cut ("-sm")
 *    for phones.
 *
 * Needs ffmpeg with libsvtav1 + libx264 on the PATH. The first run downloads
 * Remotion's headless Chrome.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { ensureBrowser, renderMedia, selectComposition } from "@remotion/renderer";

const ROOT = resolve(import.meta.dirname, "..");
const MASTERS = join(ROOT, "renders");
const WEB = join(ROOT, "public", "media", "films");
mkdirSync(MASTERS, { recursive: true });
mkdirSync(WEB, { recursive: true });

/** Web sizes: [width, height, file suffix, AV1 crf, H.264 crf]; the poster frame and its width. */
const HERO = { sizes: [[1280, 720, "", 50, 31], [960, 540, "-sm", 48, 31]], poster: 300, posterW: 1600 };
const FILMS = {
  "hero-ltr": HERO,
  "hero-rtl": HERO,
  "or-en": { sizes: [[720, 900, "", 40, 27]], poster: 40, posterW: 720 },
  "or-ar": { sizes: [[720, 900, "", 40, 27]], poster: 40, posterW: 720 },
  "sting-en": { sizes: [[1600, 750, "", 40, 27]], poster: 150, posterW: 1600 },
  "sting-ar": { sizes: [[1600, 750, "", 40, 27]], poster: 150, posterW: 1600 },
};

const encodeOnly = process.argv.includes("--encode");
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const ids = Object.keys(FILMS).filter((id) => !only.length || only.includes(id));

let serveUrl = "";
if (!encodeOnly) {
  await ensureBrowser();
  serveUrl = await bundle({
    entryPoint: join(ROOT, "src", "remotion", "index.ts"),
    publicDir: join(ROOT, "public"),
    webpackOverride: (c) => ({ ...c, resolve: { ...c.resolve, alias: { ...(c.resolve?.alias ?? {}), "@": join(ROOT, "src") } } }),
  });
}

const ff = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: ["ignore", "ignore", "inherit"] });
const kb = (p) => Math.round(statSync(p).size / 1024);

for (const id of ids) {
  const master = join(MASTERS, `${id}.mp4`);
  if (!encodeOnly) {
    const t0 = Date.now();
    const composition = await selectComposition({ serveUrl, id });
    await renderMedia({
      serveUrl, composition, codec: "h264", crf: 14, outputLocation: master, muted: true,
      concurrency: 6, jpegQuality: 92, logLevel: "warn",
      onProgress: ({ progress }) => process.stdout.write(`\r${id} ${Math.round(progress * 100)}%   `),
    });
    process.stdout.write(`\r${id} rendered in ${Math.round((Date.now() - t0) / 1000)}s\n`);
  } else if (!existsSync(master)) {
    console.log(`${id}: no master in renders/, skipped`);
    continue;
  }

  const { sizes, poster, posterW } = FILMS[id];
  for (const [w, h, suffix, crfAv1, crfH264] of sizes) {
    const scale = `scale=${w}:${h}:flags=lanczos`;
    const h264 = join(WEB, `${id}${suffix}.mp4`);
    const av1 = join(WEB, `${id}${suffix}.av1.mp4`);
    ff(["-i", master, "-an", "-vf", scale, "-c:v", "libx264", "-preset", "slow", "-crf", String(crfH264), "-profile:v", "high",
      "-pix_fmt", "yuv420p", "-g", "90", "-movflags", "+faststart", h264]);
    ff(["-i", master, "-an", "-vf", scale, "-c:v", "libsvtav1", "-preset", "6", "-crf", String(crfAv1), "-g", "90",
      "-pix_fmt", "yuv420p", "-svtav1-params", "tune=0", "-movflags", "+faststart", av1]);
    console.log(`${id}${suffix} ${w}x${h}: h264 ${kb(h264)} KB, av1 ${kb(av1)} KB`);
  }
  const still = join(WEB, `${id}.webp`);
  ff(["-i", master, "-vf", `select=eq(n\\,${poster}),scale=${posterW}:-2`, "-frames:v", "1", "-c:v", "libwebp", "-quality", "74", still]);
  console.log(`${id} poster ${kb(still)} KB`);
}
