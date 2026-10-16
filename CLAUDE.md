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
    node scripts/render-films.mjs [id…] [--encode]   # Remotion → public/media/films (see Films)

`output: "export"`: plain files, GitHub Pages ready. `NEXT_BASE_PATH=/<repo>` for a sub-path host;
`asset()` in lib/paths adds it to /public files (Link adds it itself).

## Look

Luxury, quiet type (2026-10-15, after Dan found the first cut "too aggressive and boldy"): Cormorant
Garamond 300–500 with italic accents for display and all numbers (lining figures site-wide), Manrope for
text, IBM Plex Mono for the small uppercase labels; Arabic Alexandria 300 + IBM Plex Sans Arabic. No
weight above 500 for display. Champagne (`--champagne`, `--lux`) for emphasis and primary buttons; cyan
only for thin lines and the outlined 5. Keep it that way.

**Spacing (round 3, 10-16: Dan wanted it "symmetric" everywhere):** one system in globals.css —
`--sec` (equal space above and below every section's content; a hairline + diamond marks the exact
middle between sections), `--head`, `--stack`, `--gap`, `--card` (equal on all four sides), `--gutter`.
Every section is `<Section>` (`.s`) with a centred `<SectionHead>`; grids are equal columns
(`.grid-2/3/4`), cards centre their content, featured items sit in the centre column (Bundle pass, Gold
tier), the masterclass is a triptych with the film in the middle, the review mosaic mirrors itself. The
header is three zones with the nav exactly centred; the hero and footer are centred. Don't add one-off
paddings: use the tokens.

**Phone (round 4, 10-16: Dan called mobile "completely destroyed" and Beyond broken on phones):** a
layout of its own in the "Phone" block of globals.css (tighter --sec/--card/type scale). Every card list is a
`<Rail>` (components/Rail.tsx): even grid on desktop, swipe rail with snap + peek + live dots under 760px. The
pinned scenes (Statement, Beyond) only pin at ≥900px; Beyond is a swipe rail below that. Home on a phone went
18,800 → 13,500 px. Check phones with real emulation (isMobile, touch, DPR 2) and a touch swipe, not a resized window.

**Speed (round 3):** visitors never run Remotion or framer-motion on the content pages.
- Films are pre-rendered (`scripts/render-films.mjs`, compositions in `src/remotion/Root.tsx`, clips in
  `clips.ts`) to `public/media/films/{hero-ltr,hero-rtl,or-en,or-ar,sting-en,sting-ar}` as AV1 + H.264 +
  webp poster; the hero also has `-sm` for phones. `components/Film.tsx` plays them natively: poster
  first, loads only near the viewport, plays only on screen, hero waits for page load, none under reduced
  motion / Data Saver. Change a film → edit the composition, re-render, re-encode.
- Reveals, staggers, parallax, the word-lit statement, the editions line and the Beyond side-scroll are
  CSS scroll-driven animations (`lib/motion.tsx` + "Motion" in globals.css): compositor-run, no JS per
  frame, final state shown where unsupported. framer-motion is only in the form views (Apply/Register/Forms).
- The Statement and Beyond are pinned scenes: they hold the page until fully played (all words lit; the
  last card arrived, with a still beat at each end), then release.
- `main .s` has `content-visibility: auto` (dividers sit 4px inside the box because paint is clipped).
- Variable fonts; only Latin faces preload. No page-wide fade (it cost a full-page layer); the 5 draws
  itself on desktops only (mask redraw per frame was too heavy for phones).
- Measured 10-16 on a 4× throttled CPU vs the round-2 live site: main-thread work at load 6.5 s → 3.0 s,
  script 3.1 s → 0.5 s, scroll 26 → 65 fps. Tools in the session scratchpad (perf.cjs, cssexp.cjs).

## Directions (10-16, after Dan rejected the Claude Design round)

`public/directions/`: three standalone static concepts plus a board (`/directions/`), not part of the Next
app. A "Pulse" (white + electric blue, Archivo wide, video-in-letters fly-through hero), B "Premiere"
(black + gold Bodoni, full-screen film chapters, ticket passes), C "Atlas" (glass bento on a blue mesh,
Geist, programme filter/search, pass finder, phone tab bar). All read `shared/content.js` (EN/AR) and
`shared/dz.js` (lang/RTL, lazy video, reveals, countdown, rails, lightbox); each page defines
`window.render()`. Own media in `directions/media/`; site media via `../../media/`. Register/apply link
to the real site. A fixed element bigger than the viewport (C's mesh) widens the phone layout in RTL:
keep fixed backgrounds at `inset: 0` with `overflow: hidden`.

## Shape

- `src/content/site.ts`: **every word, EN + AR**. `// ours` = written by us, needs the organisers;
  `// TBC` = the deck's own open questions (masterclass € vs $, start time).
- `src/app/[locale]/…`: en + ar, each a static route. `/` picks a language by browser (tiny script).
  Pages: home, program, masterclass, faculty, gallery, films, partners, register, ticket, abstracts,
  certificate, check-in. Thin route files; the views live in `src/components/views/`.
- `src/components/sections.tsx`: the home sections, reused by inner pages (`head={false}` drops the
  section heading where the page hero already says it).
- `src/remotion/`: `films.tsx` (HeroReel full-bleed DZAC 4 footage; OrReel masterclass "live feed";
  Sting), `fx.tsx` (custom light-sweep transition, stage waves, grade), `Root.tsx` (compositions, fonts),
  `clips.ts`. Render-time only (dev dependencies).
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
