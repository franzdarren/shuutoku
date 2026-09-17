import { useEffect } from "react";

/** KanjiVG (kanjivg.tagaini.net, CC BY-SA) publishes a numbered stroke-order
 *  SVG for almost every jōyō kanji, keyed by the character's Unicode code
 *  point. jsdelivr mirrors the project's GitHub repo as a public CDN, so
 *  this needs no key and no backend — same "fetch from a public service at
 *  the moment it's needed" shape as the Jisho lookup in VocabTooltip. */
function kanjiVgUrl(kj) {
  const cp = kj.codePointAt(0).toString(16).padStart(5, "0");
  return `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg/kanji/${cp}.svg`;
}

export default function KanjiStrokeModal({ entry, onClose }) {
  useEffect(() => {
    if (!entry) return;
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entry, onClose]);

  if (!entry) return null;
  const { kj, on, kun, meaning, examples } = entry;
  const sample = examples?.[0];

  return (
    <div className="kanji-modal-scrim" onClick={onClose}>
      <div className="kanji-modal" role="dialog" aria-modal="true" aria-label={"Stroke order and details for " + kj} onClick={(e) => e.stopPropagation()}>
        <button className="kanji-modal-close" onClick={onClose} aria-label="Close">✕</button>

        {/* KanjiVG strokes are plain black paths with no background — on
            dark paper they'd all but vanish, so the diagram always sits on
            its own fixed light card regardless of site theme. */}
        <div className="kanji-modal-stroke-wrap">
          {/* Not every character has a KanjiVG file (rare variants, some
              non-jōyō kanji) — if the image 404s, swap it for a plain link
              to Jisho's own stroke-order view instead of a broken image. */}
          <img
            className="kanji-modal-stroke"
            src={kanjiVgUrl(kj)}
            alt={"Numbered stroke-order diagram for " + kj}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling.style.display = "block";
            }}
          />
          <p className="kanji-modal-fallback" style={{ display: "none" }}>
            No stroke diagram on file for this character.{" "}
            <a href={"https://jisho.org/search/" + encodeURIComponent(kj) + "%23kanji"} target="_blank" rel="noopener noreferrer">Look it up on Jisho →</a>
          </p>
        </div>

        <div className="kanji-modal-kj">{kj}</div>
        <div className="kanji-modal-meaning">{meaning}</div>
        <div className="kanji-modal-readings"><span className="lbl">on—</span> {on} &nbsp; <span className="lbl">kun—</span> {kun}</div>

        {sample && (
          <div className="kanji-modal-sample">
            <span className="kanji-modal-sample-word">{sample.word}</span>
            <span className="kanji-modal-sample-reading">({sample.reading})</span>
            <span className="kanji-modal-sample-meaning">— {sample.meaning}</span>
          </div>
        )}

        <p className="kanji-modal-credit">Stroke order data from the KanjiVG project (CC BY-SA)</p>
      </div>
    </div>
  );
}
