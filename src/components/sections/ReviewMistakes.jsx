import { useEffect, useRef, useState } from "react";
import { getAllQuizEntries } from "../../data/index.js";
import { useQuiz } from "../../context/QuizContext.jsx";
import Quiz from "../Quiz.jsx";

/** Gathers every question you've gotten wrong so far, from any section,
 *  into one page — grouped by where it came from, and re-answerable right
 *  here. Answering one correctly updates the same underlying progress
 *  record (grammar/kanji/reading/kaiwa entries reuse their real qid; Quiz
 *  Center pool entries reuse their stable pool id), so this page never
 *  drifts out of sync with the rest of the app.
 *
 *  The list itself is only recomputed each time this tab is opened, not
 *  live on every answer — every section in this app stays mounted all the
 *  time (just hidden), so a live filter would yank a question off the
 *  screen the instant you got it right, before you even saw it turn green. */
export default function ReviewMistakes({ isActive }) {
  const { answered, poolStats } = useQuiz();
  const stateRef = useRef({ answered, poolStats });
  stateRef.current = { answered, poolStats };

  function computeGroups() {
    const { answered, poolStats } = stateRef.current;
    const map = new Map();
    getAllQuizEntries().forEach((e) => {
      const wrong = e.section === "quiz" ? poolStats.get(e.id) === false : answered.get(e.id) === false;
      if (!wrong) return;
      if (!map.has(e.sectionLabel)) map.set(e.sectionLabel, []);
      map.get(e.sectionLabel).push(e);
    });
    return Array.from(map.entries());
  }

  const [groups, setGroups] = useState(() => computeGroups());

  useEffect(() => {
    if (isActive) setGroups(computeGroups());
  }, [isActive]);

  const totalWrong = groups.reduce((n, [, items]) => n + items.length, 0);

  return (
    <>
      <div className="section-head">
        <div className="eyebrow-jp">間違い直し</div>
        <h1>Review Mistakes</h1>
        <p>Every question you've answered incorrectly so far, from any section, gathered in one place so you can drill just your weak spots. Getting one right here updates your progress everywhere else too — this page re-shows the same questions, it doesn't duplicate them.</p>
      </div>

      {totalWrong === 0 && (
        <div className="gcard">No outstanding mistakes right now — nice. Anything you get wrong in any section will show up here automatically.</div>
      )}

      {groups.map(([label, items]) => (
        <div key={label}>
          <div className="qc-group-title">{label} — {items.length} to review</div>
          <div className="gcard" style={{ "--accent": "var(--shu)" }}>
            <Quiz idPrefix="mistakes" ids={items.map((e) => e.id)} items={items.map((e) => e.item)} label="RETRY" getContentId={(item) => item._pid} />
          </div>
        </div>
      ))}
    </>
  );
}
