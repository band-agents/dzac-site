/**
 * The films as Remotion compositions, rendered once to video files by
 * scripts/render-films.mjs. The site plays those files; it never runs
 * Remotion in the browser, which is what keeps the pages fast.
 *
 * Each film comes in a left-to-right and a right-to-left cut: transitions
 * sweep with the reading direction, and the captions change language.
 */

import { Fragment, type ComponentType, type ReactNode } from "react";
import { Composition } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadAlex } from "@remotion/google-fonts/Alexandria";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansArabic";
import { HeroReel, OrReel, STING_FRAMES, Sting, filmLength } from "./films";
import { HERO_CLIPS, OR_CLIPS, STING_TEXT } from "./clips";

const serif = loadSerif("normal", { weights: ["300", "400"], subsets: ["latin"] });
loadSerif("italic", { weights: ["300"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400"], subsets: ["latin"] });
const alex = loadAlex("normal", { weights: ["300"], subsets: ["arabic", "latin"] });
const plex = loadPlex("normal", { weights: ["400"], subsets: ["arabic"] });

/** The same CSS variables the site uses, so the film code reads like the page code. */
function Type({ rtl, children }: { rtl: boolean; children: ReactNode }) {
  const vars = {
    "--f-serif": serif.fontFamily,
    "--mono": `${mono.fontFamily}, monospace`,
    "--display": rtl ? `${alex.fontFamily}, sans-serif` : `${serif.fontFamily}, serif`,
    "--text": rtl ? `${plex.fontFamily}, sans-serif` : `${mono.fontFamily}, sans-serif`,
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
