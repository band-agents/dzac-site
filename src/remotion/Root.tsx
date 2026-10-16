/**
 * The films as Remotion compositions, rendered once to video files by
 * scripts/render-films.mjs. The site plays those files; it never runs
 * Remotion in the browser, which is what keeps the pages fast.
 *
 * Each film comes in a left-to-right and a right-to-left cut: transitions
 * sweep with the reading direction, and the captions change language.
 */

import { Fragment, type ComponentType, type ReactNode } from "react";
import { Composition, continueRender, delayRender, staticFile } from "remotion";
import { loadFont as loadAlex } from "@remotion/google-fonts/Alexandria";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansArabic";
import { BACKDROP_FRAMES, Backdrop, HeroReel, OrReel, STING_FRAMES, Sting, filmLength } from "./films";
import { HERO_CLIPS, OR_CLIPS, STING_TEXT } from "./clips";

/* The brand faces from the DZAC 5 design, served from public/fonts. */
const local: [string, string, string][] = [
  ["Host Grotesk", "HostGrotesk-Light.otf", "300"],
  ["Host Grotesk", "HostGrotesk-Regular.otf", "400"],
  ["Host Grotesk", "HostGrotesk-Medium.otf", "500"],
  ["Raftel", "Raftel.ttf", "400"],
];
if (typeof window !== "undefined" && typeof FontFace !== "undefined") {
  const h = delayRender("brand fonts");
  Promise.all(local.map(([family, file, weight]) => new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, { weight }).load()
    .then((ff) => { document.fonts.add(ff); })))
    .then(() => continueRender(h), () => continueRender(h));
}
const alex = loadAlex("normal", { weights: ["300"], subsets: ["arabic", "latin"] });
const plex = loadPlex("normal", { weights: ["400"], subsets: ["arabic"] });

/** The same CSS variables the site uses, so the film code reads like the page code. */
function Type({ rtl, children }: { rtl: boolean; children: ReactNode }) {
  const vars = {
    "--num": "Raftel, serif",
    "--mono": "\"Host Grotesk\", sans-serif",
    "--display": rtl ? `${alex.fontFamily}, sans-serif` : "\"Host Grotesk\", sans-serif",
    "--text": rtl ? `${plex.fontFamily}, sans-serif` : "\"Host Grotesk\", sans-serif",
  } as React.CSSProperties;
  return <div style={{ ...vars, position: "absolute", inset: 0 }}>{children}</div>;
}

function wrap<P extends object>(C: ComponentType<P>, rtl: boolean) {
  const W = (props: P) => <Type rtl={rtl}><C {...props} /></Type>;
  return W as unknown as ComponentType<Record<string, unknown>>;
}

const FPS = 30;

export function Root() {
  return (
    <>
      <Composition id="backdrop" component={wrap(Backdrop, false)} durationInFrames={BACKDROP_FRAMES} fps={FPS} width={1920} height={1080} defaultProps={{}} />
      {([false, true] as const).map((rtl) => {
        const dir = rtl ? "rtl" : "ltr";
        const lang = rtl ? "ar" : "en";
        const or = OR_CLIPS(rtl);
        return (
          <Fragment key={dir}>
            <Composition id={`hero-${dir}`} component={wrap(HeroReel, rtl)} durationInFrames={filmLength(HERO_CLIPS)} fps={FPS}
              width={1920} height={1080} defaultProps={{ clips: HERO_CLIPS, rtl }} />
            <Composition id={`or-${lang}`} component={wrap(OrReel, rtl)} durationInFrames={filmLength(or, 14)} fps={FPS}
              width={1080} height={1350} defaultProps={{ clips: or, rtl, live: "LIVE · OR 1" }} />
            <Composition id={`sting-${lang}`} component={wrap(Sting, rtl)} durationInFrames={STING_FRAMES} fps={FPS}
              width={1920} height={900} defaultProps={{ ...STING_TEXT[lang], rtl }} />
          </Fragment>
        );
      })}
    </>
  );
}
