/**
 * Next 16's static export writes route-segment prefetch files into folders,
 *   ar/__next.$d$locale/__PAGE__.txt
 * but the client requests them dot-joined,
 *   ar/__next.$d$locale.__PAGE__.txt
 * so on a plain static host every prefetch 404s. This writes the dot-joined
 * copy next to each nested file. Run after `next build`.
 */

import { copyFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../out", import.meta.url));
let made = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) flatten(p, dir, name);
    else walk(p);
  }
}

function flatten(segDir, parent, segName) {
  const files = [];
  const collect = (d) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) collect(p);
      else files.push(p);
    }
  };
  collect(segDir);
  for (const f of files) {
    const rest = relative(segDir, f).split(sep).join(".");
    copyFileSync(f, join(parent, `${segName}.${rest}`));
    made++;
  }
}

walk(OUT);
console.log(`flatten-segments: wrote ${made} prefetch files`);
