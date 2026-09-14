import { useMemo, useState } from "react";
import { kanjiFocus, kanjiQuiz } from "../../data/index.js";
import Quiz from "../Quiz.jsx";

export default function KanjiFocus() {
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return kanjiFocus;
    return kanjiFocus.filter((k) =>
      k.kj.includes(f) || k.on.toLowerCase().includes(f) || k.kun.toLowerCase().includes(f) || k.meaning.toLowerCase().includes(f)
    );
  }, [filter]);

  return (
    <>
      <div className="section-head">
        <div className="eyebrow-jp">漢字フォーカス</div>
        <h1>Kanji Focus</h1>
        <p>The full N4-level kanji set — all {kanjiFocus.length} characters, nothing held back — with both readings, the core meaning, and one common compound for each. It won't match "official" N4 lists exactly (there is no official list — JLPT never publishes one), but it is grounded in the standard N4 study references. Use the search box below to jump straight to a character, reading, or meaning.</p>
      </div>

      <div className="kanji-toolbar">
        <input className="kanji-search" placeholder="Search by kanji, reading, or meaning…" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <span className="kanji-count">{filtered.length} / {kanjiFocus.length} shown</span>
      </div>

      <div className="kgrid">
        {filtered.map((k, i) => (
          <div key={i} className="kcard">
            <div className="kj">{k.kj}</div>
            <div className="kmeta">
              <div className="kmeaning">{k.meaning}</div>
              <div className="kreading"><span className="lbl">on—</span> {k.on} &nbsp; <span className="lbl">kun—</span> {k.kun}</div>
              <div className="kword">{k.word}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="modtitle" style={{ marginTop: 44 }}><span className="modnum">商</span> Kanji Check</h2>
      <div className="modtitle-en">Reading and meaning quiz built from your focus list</div>
      <div className="gcard" style={{ "--accent": "var(--gold)" }}>
        <Quiz idPrefix="kanji" items={kanjiQuiz} />
      </div>
    </>
  );
}
