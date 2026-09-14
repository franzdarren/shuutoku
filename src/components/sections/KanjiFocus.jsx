import { useEffect, useMemo, useState } from "react";
import { kanjiFocus, kanjiQuiz } from "../../data/index.js";
import Quiz from "../Quiz.jsx";

const PAGE_SIZE = 30;

export default function KanjiFocus() {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return kanjiFocus;
    return kanjiFocus.filter((k) =>
      k.kj.includes(f) || k.on.toLowerCase().includes(f) || k.kun.toLowerCase().includes(f) || k.meaning.toLowerCase().includes(f)
    );
  }, [filter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Searching (or the result set shrinking below the current page) snaps
  // back to page 1 instead of silently showing an empty grid.
  useEffect(() => { setPage(0); }, [filter]);
  useEffect(() => { if (page >= pageCount) setPage(0); }, [pageCount, page]);

  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const rangeStart = filtered.length ? page * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(filtered.length, page * PAGE_SIZE + PAGE_SIZE);

  function goToPage(p) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <div className="section-head">
        <div className="eyebrow-jp">漢字フォーカス</div>
        <h1>Kanji Focus</h1>
        <p>The full N4-level kanji set — all {kanjiFocus.length} characters, nothing held back — with both readings, the core meaning, and example compounds for each. It won't match "official" N4 lists exactly (there is no official list — JLPT never publishes one), but it is grounded in the standard N4 study references. Search jumps straight to a character, reading, or meaning; browse a page at a time otherwise.</p>
      </div>

      <div className="kanji-toolbar">
        <input className="kanji-search" placeholder="Search by kanji, reading, or meaning…" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <span className="kanji-count">{filtered.length} / {kanjiFocus.length} shown</span>
      </div>

      {pageCount > 1 && (
        <div className="kanji-pager">
          <span className="kanji-pager-range">Showing {rangeStart}–{rangeEnd} of {filtered.length}</span>
          <div className="kanji-pager-btns">
            <button disabled={page === 0} onClick={() => goToPage(page - 1)}>← Prev</button>
            {Array.from({ length: pageCount }, (_, p) => (
              <button key={p} className={p === page ? "active" : ""} onClick={() => goToPage(p)}>{p + 1}</button>
            ))}
            <button disabled={page === pageCount - 1} onClick={() => goToPage(page + 1)}>Next →</button>
          </div>
        </div>
      )}

      <div className="kgrid">
        {pageItems.map((k, i) => (
          <div key={i} className="kcard">
            <div className="kj">{k.kj}</div>
            <div className="kmeta">
              <div className="kmeaning">{k.meaning}</div>
              <div className="kreading"><span className="lbl">on—</span> {k.on} &nbsp; <span className="lbl">kun—</span> {k.kun}</div>
              <div className="kexamples">
                {(k.examples || []).map((ex, ei) => (
                  <div key={ei} className="kexample">
                    <span className={"ktype ktype-" + ex.type}>{ex.type}</span>
                    <span className="kexample-word">{ex.word}</span>
                    <span className="kexample-reading">({ex.reading})</span>
                    <span className="kexample-meaning">— {ex.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="kanji-pager" style={{ marginTop: 4 }}>
          <div className="kanji-pager-btns">
            <button disabled={page === 0} onClick={() => goToPage(page - 1)}>← Prev</button>
            {Array.from({ length: pageCount }, (_, p) => (
              <button key={p} className={p === page ? "active" : ""} onClick={() => goToPage(p)}>{p + 1}</button>
            ))}
            <button disabled={page === pageCount - 1} onClick={() => goToPage(page + 1)}>Next →</button>
          </div>
        </div>
      )}

      <h2 className="modtitle" style={{ marginTop: 44 }}><span className="modnum">商</span> Kanji Check</h2>
      <div className="modtitle-en">Reading and meaning quiz built from your focus list</div>
      <div className="gcard" style={{ "--accent": "var(--gold)" }}>
        <Quiz idPrefix="kanji" items={kanjiQuiz} />
      </div>
    </>
  );
}
