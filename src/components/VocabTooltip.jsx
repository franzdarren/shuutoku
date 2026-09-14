import { useLookupState } from "../context/LookupContext.jsx";
import { jishoSearchUrl } from "../lib/dictionary.js";

export default function VocabTooltip() {
  const { state, close } = useLookupState();
  if (!state) return null;

  const { term, x, y, loading, result } = state;
  const flipBelow = y < 160;
  const style = {
    left: x,
    top: flipBelow ? y + 26 : y - 10,
    transform: `translate(-50%, ${flipBelow ? "0" : "-100%"})`,
  };

  return (
    <div className="lookup-pop" style={style} role="dialog" aria-label={"Definition of " + term}>
      <button className="lp-close" onClick={close} aria-label="Close">✕</button>
      {loading && <div className="lp-loading">Looking up “{term}”…</div>}

      {!loading && result?.status === "local" && (
        <LocalEntry entry={result.entry} />
      )}

      {!loading && result?.status === "jisho" && (
        <JishoEntries term={term} entries={result.entries} />
      )}

      {!loading && (!result || result.status === "none") && (
        <div>
          <div className="lp-word">{term}</div>
          <div className="lp-empty">No definition found in the local glossary or via Jisho right now.</div>
          <a className="lp-jisho-link" href={jishoSearchUrl(term)} target="_blank" rel="noreferrer">Search on Jisho ↗</a>
        </div>
      )}
    </div>
  );
}

function LocalEntry({ entry }) {
  return (
    <div>
      <div className="lp-word">{entry.jp}</div>
      {entry.reading && <div className="lp-reading">{entry.reading}</div>}
      <div className="lp-sense">{entry.en}</div>
      <div className="lp-source">{entry.source}</div>
    </div>
  );
}

function JishoEntries({ term, entries }) {
  return (
    <div>
      {entries.map((e, i) => (
        <div key={i} className="lp-sense" style={{ marginTop: i ? undefined : 0, paddingTop: i ? undefined : 0, borderTop: i ? undefined : "none" }}>
          <div className="lp-word">{e.word}</div>
          {e.reading && <div className="lp-reading">{e.reading}</div>}
          {e.jlpt && <div className="lp-jlpt">{e.jlpt}</div>}
          {e.senses.map((s, j) => (
            <div key={j} style={{ marginTop: 6 }}>
              {s.pos && <div className="lp-pos">{s.pos}</div>}
              <div>{s.english}</div>
            </div>
          ))}
        </div>
      ))}
      <a className="lp-jisho-link" href={jishoSearchUrl(term)} target="_blank" rel="noreferrer">More on Jisho ↗</a>
    </div>
  );
}
