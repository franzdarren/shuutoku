import { useEffect, useMemo, useRef, useState } from "react";
import { kanjiFocus, kanjiQuiz } from "../../data/index.js";
import Quiz from "../Quiz.jsx";
import KanjiStrokeModal from "../KanjiStrokeModal.jsx";

const PAGE_SIZE = 30;

export default function KanjiFocus({ jumpTarget }) {
  const [view, setView] = useState("cards");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [strokeEntry, setStrokeEntry] = useState(null);
  const skipNextFilterReset = useRef(false);

  function switchView(v) {
    setView(v);
    document.getElementById("kanji-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return kanjiFocus;
    return kanjiFocus.filter((k) =>
      k.kj.includes(f) || k.on.toLowerCase().includes(f) || k.kun.toLowerCase().includes(f) || k.meaning.toLowerCase().includes(f)
    );
  }, [filter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Searching (or the result set shrinking below the current page) snaps
  // back to page 1 instead of silently showing an empty grid — except right
  // after a search-jump clears the filter itself, which sets its own page.
  useEffect(() => {
    if (skipNextFilterReset.current) { skipNextFilterReset.current = false; return; }
    setPage(0);
  }, [filter]);
  useEffect(() => { if (page >= pageCount) setPage(0); }, [pageCount, page]);

  // A search result lands here as {index} into the full (unfiltered) kanji
  // list — clear any active filter so that index lines up, jump straight
  // to its page, and scroll it into view.
  useEffect(() => {
    if (!jumpTarget) return;
    setView("cards");
    skipNextFilterReset.current = true;
    setFilter("");
    setPage(Math.floor(jumpTarget.index / PAGE_SIZE));
    const id = "kcard-" + jumpTarget.index;
    requestAnimationFrame(() => {
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
    });
  }, [jumpTarget]);

  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const rangeStart = filtered.length ? page * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(filtered.length, page * PAGE_SIZE + PAGE_SIZE);

  function goToPage(p) {
    setPage(p);
    document.getElementById("kanji-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      {/* This section is a lookup tool, so it opens with the tool: title,
          search, then the standing description demoted to a note. */}
      <div className="section-head section-head--bare">
        <div className="eyebrow-jp">漢字フォーカス</div>
        <h1>Kanji Focus</h1>
      </div>

      {/* Browsing the character set and testing yourself on it are
          different activities at different points in a session — split
          into tabs, same pattern as Kaiwa Lab's phrase bank vs. scripts,
          rather than stacking the whole grid on top of a quiz. */}
      <div className="viewtabs" role="tablist" id="kanji-tabs">
        <button role="tab" aria-selected={view === "cards"} className={view === "cards" ? "active" : ""} onClick={() => switchView("cards")}>
          <span className="vt-jp">漢字カード</span>
          <span className="vt-en">Kanji Cards · {kanjiFocus.length}</span>
        </button>
        <button role="tab" aria-selected={view === "check"} className={view === "check" ? "active" : ""} onClick={() => switchView("check")}>
          <span className="vt-jp">漢字チェック</span>
          <span className="vt-en">Kanji Check · {kanjiQuiz.length}</span>
        </button>
      </div>

      {view === "cards" && <>
      <div className="kanji-toolbar">
        <input className="kanji-search" placeholder="Search by kanji, reading, or meaning…" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <span className="kanji-count">{filtered.length} / {kanjiFocus.length} shown</span>
      </div>

      <p className="section-note">All {kanjiFocus.length} N4-level characters, nothing held back — both readings, the core meaning, and example compounds for each. It won't match “official” N4 lists exactly (there is no official list — JLPT never publishes one), but it is grounded in the standard N4 study references.</p>

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
          <div
            key={i}
            id={filter ? undefined : "kcard-" + (page * PAGE_SIZE + i)}
            className="kcard"
            role="button"
            tabIndex={0}
            onClick={() => setStrokeEntry(k)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setStrokeEntry(k); } }}
            aria-label={"Kanji " + k.kj + ", " + k.meaning + " — show stroke order and details"}
          >
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
      </>}

      {view === "check" && <>
      <div className="modtitle-en" style={{ marginBottom: 12 }}>Reading and meaning quiz built from your focus list — {kanjiQuiz.length} questions</div>
      <div className="gcard" style={{ "--accent": "var(--gold)" }}>
        <Quiz idPrefix="kanji" items={kanjiQuiz} />
      </div>
      </>}

      <KanjiStrokeModal entry={strokeEntry} onClose={() => setStrokeEntry(null)} />
    </>
  );
}
