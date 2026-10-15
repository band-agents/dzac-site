"use client";

/**
 * One lightbox for the whole site: a film file, a Drive video, or a run of
 * photos with arrow keys. Opened through `useLightbox()`. It animates in
 * with CSS; nothing loads until it opens.
 */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { UI } from "@/content/site";
import { useLocale, useT } from "@/lib/locale";

type Item =
  | { kind: "file"; src: string; poster?: string; title: string }
  | { kind: "drive"; id: string; title: string; vertical?: boolean }
  | { kind: "photos"; list: { src: string; alt: string }[]; index: number };

const Ctx = createContext<(x: Item) => void>(() => {});
export const useLightbox = () => useContext(Ctx);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<Item | null>(null);
  const t = useT();
  const locale = useLocale();
  const close = useCallback(() => setItem(null), []);
  const move = useCallback((d: number) => setItem((x) => (x && x.kind === "photos" ? { ...x, index: (x.index + d + x.list.length) % x.list.length } : x)), []);

  useEffect(() => {
    if (!item) return;
    const fwd = locale === "ar" ? -1 : 1;
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(fwd);
      if (e.key === "ArrowLeft") move(-fwd);
    };
    window.addEventListener("keydown", on);
    document.documentElement.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", on); document.documentElement.style.overflow = ""; };
  }, [item, close, move, locale]);

  return (
    <Ctx.Provider value={setItem}>
      {children}
      {item && (
        <div className="lb" role="dialog" aria-modal="true" onClick={close}>
          <button type="button" className="lb-close" onClick={close} aria-label={t(UI.close)}><X size={22} /></button>
          <div className={`lb-body${item.kind === "drive" && item.vertical ? " is-vertical" : ""}`} onClick={(e) => e.stopPropagation()}>
            {item.kind === "file" && <video src={item.src} poster={item.poster} controls autoPlay playsInline aria-label={item.title} />}
            {item.kind === "drive" && (
              <iframe src={`https://drive.google.com/file/d/${item.id}/preview`} title={item.title} allow="autoplay; fullscreen" allowFullScreen />
            )}
            {item.kind === "photos" && (
              <>
                <img key={item.index} src={item.list[item.index].src} alt={item.list[item.index].alt} />
                <p className="lb-cap u-tnum">{item.index + 1} / {item.list.length}</p>
              </>
            )}
          </div>
          {item.kind === "photos" && (
            <>
              <button type="button" className="lb-nav lb-prev" onClick={(e) => { e.stopPropagation(); move(-1); }} aria-label={t({ en: "Previous", ar: "السابق" })}><ChevronLeft size={22} className="u-flip" /></button>
              <button type="button" className="lb-nav lb-next" onClick={(e) => { e.stopPropagation(); move(1); }} aria-label={t({ en: "Next", ar: "التالي" })}><ChevronRight size={22} className="u-flip" /></button>
            </>
          )}
        </div>
      )}
    </Ctx.Provider>
  );
}
