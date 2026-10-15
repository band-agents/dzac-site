# DZAC 5 — conference website

The site for DZAC 5, the 5th Dar El Zokora Annual Conference: 14 January 2027, Triumph Luxury Hotel,
Cairo, «The Future of Men's Health Starts Here». Quoted as BND·2026·DZAC·01 (30,000 EGP, 7 days).
Brief: the client's deck `Downloads/DZAC5_Presentation (1).pdf` (16 slides) plus the DZAC 4 Drive folder
(Interview / Photos 2,935 / Promo / Work Shop) and four films Dan linked.

## Run

    npm run dev        # http://localhost:3240 (launch.json: "dzac-site")
    npm run typecheck
    npm run build      # static export to out/, then scripts/flatten-segments.mjs
    npm run deploy:pages   # → https://band-agents.github.io/dzac-site/ (repo band-agents/dzac-site, public)

`output: "export"`: plain files, GitHub Pages ready. `NEXT_BASE_PATH=/<repo>` for a sub-path host;
`asset()` in lib/paths adds it to /public files (Link adds it itself).

## Look

Luxury, quiet type (2026-10-15, after Dan found the first cut "too aggressive and boldy"): Cormorant
Garamond 300–500 with italic accents for display and all numbers (lining figures site-wide), Manrope for
text, IBM Plex Mono for the small uppercase labels; Arabic Alexandria 300 + IBM Plex Sans Arabic. No
weight above 500 for display. Champagne (`--champagne`, `--lux`) for emphasis and primary buttons; cyan
only for thin lines and the outlined 5. Keep it that way.

## Shape

- `src/content/site.ts`: **every word, EN + AR**. `// ours` = written by us, needs the organisers;
  `// TBC` = the deck's own open questions (masterclass € vs $, start time).
- `src/app/[locale]/…`: en + ar, each a static route. `/` picks a language by browser (tiny script).
  Pages: home, program, masterclass, faculty, gallery, films, partners, register, ticket, abstracts,
  certificate, check-in. Thin route files; the views live in `src/components/views/`.
- `src/components/sections.tsx`: the home sections, reused by inner pages (`head={false}` drops the
  section heading where the page hero already says it).
- `src/remotion/`: `films.tsx` (HeroReel full-bleed DZAC 4 footage; OrReel masterclass "live feed";
  Sting) and `fx.tsx` (custom light-sweep transition, stage waves, grade). `LiveFilm` shows a poster
  first, mounts the Player after hydration, plays only on screen, never under reduced motion.
- `/apply` (`views/Apply.tsx`, copy in `content/apply.ts`): the adaptive application form. Steps are
  rebuilt from the answers (attend / masterclass / speak / partner / media); a live sidebar shows the
  answers, a progress ring and a recommendation (`outcome()`); number keys + Enter; email typo fix;
  country fills the dial code; draft auto-saves and offers to resume; `?intent=` presets the path; the
  result hands its answers to register/abstracts via `setPrefill` (device storage, never the URL).
- `src/lib/store.ts`: registrations, abstracts, partner enquiries **in localStorage for the preview**.
  QR tickets encode `/{locale}/ticket/?c=DZ5-XXXXXX`; check-in accepts the code or the scanned URL.
- Media in `public/media/` (≈56 MB built): photos are DZAC 4 shots with the bottom brand strip cropped
  off (`crop=iw:ih-iw*0.08`), webp at 1920/1200 + 720 for grids. Reel clips are cut from the Drive films.

## Traps hit

- **Clip cutting:** `-ss` before `-i` lands on a keyframe, so a clip opened on the previous shot or a
  burned-in subtitle. Seek early, then `trim=` after decode; find cuts with `scdet`. Workshop footage has
  a brand strip: `crop=iw*0.87:ih*0.87:iw*0.065:0`. Each film slot must be ≤ its clip's frame count.
- **Next 16 static export** writes prefetch segments as `__next.$d$locale/__PAGE__.txt` but the client
  asks for `__next.$d$locale.__PAGE__.txt` → 404s; `scripts/flatten-segments.mjs` writes the copies.
- Remotion Player inside RTL must sit in `dir="ltr"`. Mixed presentation types in one list need a cast.
- `.mc-count span` caught the CountUp's own span; scope label rules with `>`.
- Bash heredocs strip backslashes in regexes: write such files with the Write tool.
- RTL: a translated-off-left shine counts as scroll overflow; mirror it for `[dir=rtl]`.

## Open

Payment (Paymob) and a real backend for registration/check-in/emails; masterclass currency; conference
fees per category; start time; photos for Dr. Gomha and Dr. Mohsen; Arabic spellings of faculty names;
whether the "Interview" clips (two presenters) are the Men's Lounge material; DZAC 1 details;
Remotion company licence (`acknowledgeRemotionLicense` is set).
