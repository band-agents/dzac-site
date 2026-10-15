/**
 * Build the site and publish it to GitHub Pages.
 *
 *   npm run deploy:pages
 *
 * Lands at https://band-agents.github.io/dzac-site/ ("/" picks Arabic or
 * English by browser language). Pages serves the site under /dzac-site, so
 * the build runs with NEXT_BASE_PATH=/dzac-site.
 *
 * The publish is a throwaway git repo inside the staging directory, force
 * pushed to gh-pages, so that branch only ever holds build output. git runs
 * WITHOUT a shell: on Windows `shell: true` re-parses the arguments and splits
 * a commit message into pathspecs. npm needs the shell there (npm.cmd).
 */

import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = resolve(ROOT, "out");
const REMOTE = "https://github.com/band-agents/dzac-site.git";
const BRANCH = "gh-pages";
const BASE = "/dzac-site";

rmSync(OUT, { recursive: true, force: true });
execFileSync("npm", ["run", "build"], {
  cwd: ROOT, stdio: "inherit", shell: process.platform === "win32",
  env: { ...process.env, NEXT_BASE_PATH: BASE },
});

const stage = mkdtempSync(join(tmpdir(), "dzac-pages-"));
cpSync(OUT, stage, { recursive: true });
/* Otherwise Pages runs Jekyll, which drops _next/ and every __next.* prefetch file. */
writeFileSync(join(stage, ".nojekyll"), "");

const git = (args) => execFileSync("git", args, { cwd: stage, stdio: "inherit", shell: false });
git(["init", "-q", "-b", BRANCH]);
git(["add", "-A"]);
git(["-c", "user.name=band-agents", "-c", "user.email=band.digi.tech@gmail.com", "commit", "-q", "-m", "Publish build"]);
git(["push", "-q", "-f", REMOTE, BRANCH]);
rmSync(stage, { recursive: true, force: true });

/* out/ is now built for /dzac-site; run `npm run build` again before serving it locally at the root. */
console.log(`\n✓ https://band-agents.github.io${BASE}/`);
console.log("If a change does not show, trigger a rebuild:");
console.log("  gh api -X POST repos/band-agents/dzac-site/pages/builds\n");
