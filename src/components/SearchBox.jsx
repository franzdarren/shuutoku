import { useMemo, useState } from "react";
import { buildSearchIndex } from "../data/index.js";

const INDEX = buildSearchIndex();

/** A quick jump-to search across grammar points and kanji — the two
 *  sections with the most content to scroll or paginate through. Picking a
 *  result calls `onJump` with the matched entry; the parent is responsible
 *  for switching sections and scrolling to it. */
export default function SearchBox({ onJump }) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return INDEX.filter((e) => e.haystack.includes(s)).slice(0, 8);
  }, [q]);

  function pick(entry) {
    onJump(entry);
    setQ("");
  }

  return (
    <div className="searchbox">
      <input
        className="search-input"
        placeholder="Search grammar or kanji…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {results.length > 0 && (
        <div className="search-results">
          {results.map((r, i) => (
            <button key={i} className="search-result" onClick={() => pick(r)}>
              <span className="sr-type">{r.type === "grammar" ? "文" : "漢"}</span>
              <span className="sr-title">{r.title}</span>
              <span className="sr-sub">{r.subtitle}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
