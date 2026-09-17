import { useMemo, useState } from "react";

// Same markers the sidebar nav uses, so a result's badge matches the section
// it will take you to.
const SR_MARK = { grammar: "文", kanji: "漢", kaiwa: "話", reading: "読" };

/* Building the index means loading every lesson file, so it waits until you
   actually type — the cache means the cost is paid at most once per session,
   and usually not at all. */
let indexPromise = null;
function loadIndex() {
  if (!indexPromise) indexPromise = import("../data/index.js").then((d) => d.buildSearchIndex());
  return indexPromise;
}

/** A quick jump-to search across grammar points and kanji — the two
 *  sections with the most content to scroll or paginate through. Picking a
 *  result calls `onJump` with the matched entry; the parent is responsible
 *  for switching sections and scrolling to it. */
export default function SearchBox({ onJump }) {
  const [q, setQ] = useState("");
  const [index, setIndex] = useState(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s || !index) return [];
    return index.filter((e) => e.haystack.includes(s)).slice(0, 8);
  }, [q, index]);

  function pick(entry) {
    onJump(entry);
    setQ("");
  }

  return (
    <div className="searchbox">
      <input
        className="search-input"
        placeholder="Search grammar, kanji, phrases…"
        value={q}
        onFocus={() => loadIndex().then(setIndex)}
        onChange={(e) => { setQ(e.target.value); loadIndex().then(setIndex); }}
      />
      {results.length > 0 && (
        <div className="search-results">
          {results.map((r, i) => (
            <button key={i} className="search-result" onClick={() => pick(r)}>
              <span className="sr-type">{SR_MARK[r.type]}</span>
              <span className="sr-title">{r.title}</span>
              <span className="sr-sub">{r.subtitle}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
