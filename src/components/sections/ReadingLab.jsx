import { useEffect, useMemo, useState } from "react";
import { readingPassages } from "../../data/index.js";
import JpText from "../JpText.jsx";
import Quiz from "../Quiz.jsx";
import FloatingNav from "../FloatingNav.jsx";

/** Passage titles carry ruby; the floating nav renders plain text, so the
 *  reading has to come out or the label shows "日記にっき — ...". */
const stripReadings = (html) =>
  String(html || "").replace(/<rt>.*?<\/rt>/g, "").replace(/<[^>]+>/g, "");

const NAV_ITEMS = readingPassages.map((p) => ({ label: stripReadings(p.title) }));

/* Four to a page. A passage plus its questions is a long block, and twelve of
   them in one scroll buries the later ones — the same reason Kanji Focus and
   the grammar modules paginate. */
const PAGE_SIZE = 4;

export default function ReadingLab({ jumpTarget }) {
  const [page, setPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const pageCount = Math.ceil(readingPassages.length / PAGE_SIZE);

  const pageItems = useMemo(() => {
    const start = page * PAGE_SIZE;
    // the real index is carried along so quiz ids stay tied to the passage,
    // not to its position on the current page
    return readingPassages.slice(start, start + PAGE_SIZE).map((p, i) => ({ p, index: start + i }));
  }, [page]);

  // A search result lands here as {index} into the whole passage list, which
  // may well be on another page — switch to it first, then scroll.
  useEffect(() => {
    if (!jumpTarget) return;
    const target = jumpTarget.index;
    if (typeof target === "number") { setPage(Math.floor(target / PAGE_SIZE)); setActiveIndex(target); }
    requestAnimationFrame(() => {
      document.getElementById("passage-" + target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [jumpTarget]);

  function goToPage(p) {
    setPage(p);
    setActiveIndex(p * PAGE_SIZE);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* Jumping to a passage may mean changing page first, so the scroll waits a
     frame for that passage to actually exist in the DOM. */
  function goToPassage(i) {
    const clamped = Math.max(0, Math.min(readingPassages.length - 1, i));
    setActiveIndex(clamped);
    setPage(Math.floor(clamped / PAGE_SIZE));
    requestAnimationFrame(() => {
      document.getElementById("passage-" + clamped)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const rangeStart = page * PAGE_SIZE + 1;
  const rangeEnd = Math.min((page + 1) * PAGE_SIZE, readingPassages.length);

  const pager = (
    <div className="kanji-pager">
      <span className="kanji-pager-range">Showing {rangeStart}–{rangeEnd} of {readingPassages.length}</span>
      <div className="kanji-pager-btns">
        <button disabled={page === 0} onClick={() => goToPage(page - 1)}>← Prev</button>
        {Array.from({ length: pageCount }, (_, p) => (
          <button key={p} className={p === page ? "active" : ""} onClick={() => goToPage(p)}>{p + 1}</button>
        ))}
        <button disabled={page === pageCount - 1} onClick={() => goToPage(page + 1)}>Next →</button>
      </div>
    </div>
  );

  return (
    <>
      <div className="section-head">
        <div className="eyebrow-jp">読解ラボ</div>
        <h1>Reading Lab</h1>
        <p>{readingPassages.length} short passages in the style of N4 短文 (short-passage) reading questions — diary entries, building and shop notices, emails between friends and to a boss, a class advertisement, and a blog post. Try reading each one before checking anything, then highlight any word you're unsure of — a small popup shows its reading and meaning, checking this app's own glossary first and Jisho.org if it isn't there. The notices repay extra attention: fixed service phrases like ご利用ください and 本日のみ turn up constantly in real life as well as in the exam.</p>
      </div>

      {pageCount > 1 && pager}

      {pageItems.map(({ p, index }) => (
        <div key={index} id={"passage-" + index} className="passage-card">
          <JpText tag="div" className="ptitle" html={p.title} />
          <div className="ptitle-en">{p.titleEn}</div>
          <JpText tag="div" className="passage-text" html={p.text} />
          <div className="passage-hint"><b>Tip —</b> highlight any word above to look up its meaning</div>
          <Quiz idPrefix={"read" + index} items={p.quiz} />
        </div>
      ))}

      {pageCount > 1 && pager}

      <FloatingNav items={NAV_ITEMS} activeIndex={activeIndex} onGo={goToPassage} />
    </>
  );
}
