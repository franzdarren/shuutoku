import { useEffect } from "react";
import { readingPassages } from "../../data/index.js";
import JpText from "../JpText.jsx";
import Quiz from "../Quiz.jsx";

export default function ReadingLab({ jumpTarget }) {
  // A search result lands here as {index} into the passage list.
  useEffect(() => {
    if (!jumpTarget) return;
    requestAnimationFrame(() => {
      document.getElementById("passage-" + jumpTarget.index)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [jumpTarget]);

  return (
    <>
      <div className="section-head">
        <div className="eyebrow-jp">読解ラボ</div>
        <h1>Reading Lab</h1>
        <p>{readingPassages.length} short passages in the style of N4 短文 (short-passage) reading questions — diary entries, shop and building notices, and emails between friends. Try reading each one before checking anything, then highlight any word you're unsure of — a small popup shows its reading and meaning, checking this app's own glossary first and Jisho.org if it isn't there. The notices repay extra attention: fixed service phrases like ご利用ください and 本日のみ turn up constantly in real life as well as in the exam.</p>
      </div>

      {readingPassages.map((p, i) => (
        <div key={i} id={"passage-" + i} className="passage-card">
          <JpText tag="div" className="ptitle" html={p.title} />
          <div className="ptitle-en">{p.titleEn}</div>
          <JpText tag="div" className="passage-text" html={p.text} />
          <div className="passage-hint"><b>Tip —</b> highlight any word above to look up its meaning</div>
          <Quiz idPrefix={"read" + i} items={p.quiz} />
        </div>
      ))}
    </>
  );
}
