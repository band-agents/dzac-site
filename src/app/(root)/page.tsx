/**
 * "/" picks a language: Arabic for browsers that ask for it, English
 * otherwise. Static hosting has no server to redirect, so a tiny script does
 * it, with plain links for anyone without JavaScript.
 */
const base = process.env.NEXT_PUBLIC_BASE ?? "";

export default function Root() {
  const js = `(function(){var a=(navigator.languages||[navigator.language||""]).some(function(l){return /^ar/i.test(l)});location.replace(${JSON.stringify(base)}+(a?"/ar/":"/en/"));})();`;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: js }} />
      <noscript>
        <p style={{ padding: 40 }}><a href={`${base}/en/`} style={{ color: "#3BD8F2" }}>DZAC 5 · English</a> · <a href={`${base}/ar/`} style={{ color: "#3BD8F2" }}>العربية</a></p>
      </noscript>
    </>
  );
}
