/* DZAC 5 directions — shared behaviour.
   Language (EN/AR with RTL), lazy video, countdowns, reveals, the video
   lightbox and swipe-rail dots. Each direction defines window.render(). */
(function () {
  const C = window.DZC;
  const qs = new URLSearchParams(location.search);
  let lang = qs.get("lang") || (() => { try { return localStorage.getItem("dz.lang"); } catch { return null; } })() || "en";
  if (lang !== "ar") lang = "en";

  /* Paths: the directions live in /directions/<x>/, site media is two levels up. */
  const ROOT = "../../";
  const M = (p) => ROOT + p;                               // e.g. M("media/loops/review.mp4")
  const D = (p) => "../media/" + p;                        // directions' own media
  const photo = (id, size = "sm") => ROOT + `media/photos/${size === "lg" ? "" : "sm/"}${id}.webp`;
  const site = (path = "") => ROOT + `${lang}/${path ? path + "/" : ""}`;

  const t = (x) => (x && typeof x === "object" ? x[lang] ?? x.en : x ?? "");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function setLang(l) {
    lang = l;
    try { localStorage.setItem("dz.lang", l); } catch {}
    const u = new URL(location.href); u.searchParams.set("lang", l); history.replaceState(null, "", u);
    apply();
  }
  function apply() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    window.render && window.render();
    wire();
  }

  /* ── Lazy video: <video data-src="…" poster="…"> plays only on screen ── */
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  let vio;
  function videos() {
    vio && vio.disconnect();
    if (reduce || saveData) return;
    vio = new IntersectionObserver((es) => {
      for (const e of es) {
        const v = e.target;
        if (e.isIntersecting) {
          if (!v.src) { v.src = v.dataset.src; v.load(); }
          v.play().catch(() => {});
        } else if (v.src) v.pause();
      }
    }, { rootMargin: "300px 0px" });
    document.querySelectorAll("video[data-src]").forEach((v) => {
      v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute("playsinline", "");
      v.addEventListener("playing", () => v.classList.add("is-on"), { once: true });
      vio.observe(v);
    });
  }
  const vid = (src, poster, cls = "") => `<video class="dzv ${cls}" data-src="${src}" poster="${poster}" muted loop playsinline preload="none" aria-hidden="true"></video>`;

  /* ── Reveal: [data-r] gets .in when it scrolls into view ── */
  let rio;
  function reveals() {
    rio && rio.disconnect();
    rio = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    document.querySelectorAll("[data-r]").forEach((el) => (reduce ? el.classList.add("in") : rio.observe(el)));
  }

  /* ── Countdowns: [data-cd] with child [data-u="d|h|m|s"] ── */
  let cdTimer;
  function countdown() {
    clearInterval(cdTimer);
    const target = new Date(C.event.startsAt).getTime();
    const tick = () => {
      const left = Math.max(0, target - Date.now());
      const v = { d: Math.floor(left / 864e5), h: Math.floor(left / 36e5) % 24, m: Math.floor(left / 6e4) % 60, s: Math.floor(left / 1e3) % 60 };
      document.querySelectorAll("[data-u]").forEach((el) => { const k = el.dataset.u; el.textContent = k === "d" ? v.d : String(v[k]).padStart(2, "0"); });
    };
    tick(); cdTimer = setInterval(tick, 1000);
  }

  /* ── Count-up: [data-count="20"] counts once when seen ── */
  function counts() {
    const io = new IntersectionObserver((es) => {
      for (const e of es) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        const el = e.target, to = +el.dataset.count, t0 = performance.now(), dur = 1400;
        if (reduce) { el.textContent = to; continue; }
        const step = (now) => { const p = Math.min(1, (now - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    document.querySelectorAll("[data-count]").forEach((el) => io.observe(el));
  }

  /* ── Rails: [data-rail] gets dots in [data-dots] that follow the swipe ── */
  function rails() {
    document.querySelectorAll("[data-rail]").forEach((rail) => {
      const dots = rail.parentElement.querySelector("[data-dots]");
      if (!dots) return;
      const n = rail.children.length;
      dots.innerHTML = Array.from({ length: n }, (_, i) => `<button type="button" aria-label="${i + 1} / ${n}"></button>`).join("");
      const set = () => {
        const first = rail.children[0]; if (!first) return;
        const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap || 0);
        const i = Math.min(n - 1, Math.round(Math.abs(rail.scrollLeft) / step));
        [...dots.children].forEach((d, j) => d.classList.toggle("is-on", j === i));
      };
      rail.addEventListener("scroll", () => requestAnimationFrame(set), { passive: true });
      [...dots.children].forEach((d, j) => d.addEventListener("click", () => rail.children[j].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })));
      set();
    });
  }

  /* ── Lightbox: [data-play-drive] / [data-play-file] ── */
  function lightbox(html, vertical) {
    const lb = document.createElement("div");
    lb.className = "dz-lb" + (vertical ? " is-v" : "");
    lb.innerHTML = `<button class="dz-lb-x" aria-label="${t(C.ui.close)}">✕</button><div class="dz-lb-b">${html}</div>`;
    const close = () => { lb.remove(); document.documentElement.style.overflow = ""; removeEventListener("keydown", esc); };
    const esc = (e) => e.key === "Escape" && close();
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("dz-lb-x")) close(); });
    addEventListener("keydown", esc);
    document.documentElement.style.overflow = "hidden";
    document.body.appendChild(lb);
  }
  function players() {
    document.querySelectorAll("[data-play-drive]").forEach((b) => b.onclick = (e) => { e.preventDefault(); lightbox(`<iframe src="https://drive.google.com/file/d/${b.dataset.playDrive}/preview" allow="autoplay; fullscreen" allowfullscreen></iframe>`, b.dataset.vertical === "1"); });
    document.querySelectorAll("[data-play-file]").forEach((b) => b.onclick = (e) => { e.preventDefault(); lightbox(`<video src="${b.dataset.playFile}" controls autoplay playsinline></video>`); });
    document.querySelectorAll("[data-poster]").forEach((b) => b.onclick = (e) => { e.preventDefault(); lightbox(`<img src="${M(C.poster.src)}" alt="" style="width:100%;height:auto;max-height:88svh;object-fit:contain;border-radius:12px">`, true); });
    document.querySelectorAll("[data-img]").forEach((b) => b.onclick = (e) => { e.preventDefault(); lightbox(`<img src="${b.dataset.img}" alt="" style="display:block;margin-inline:auto;max-width:100%;width:auto;height:auto;max-height:88svh;border-radius:12px">`); });
    document.querySelectorAll("[data-lang]").forEach((b) => b.onclick = (e) => { e.preventDefault(); setLang(lang === "en" ? "ar" : "en"); });
  }

  function wire() { videos(); reveals(); countdown(); counts(); rails(); players(); }

  window.DZ = { C, t, esc, M, D, photo, site, vid, get lang() { return lang; }, setLang, apply, wire };
  document.addEventListener("DOMContentLoaded", apply);
})();
