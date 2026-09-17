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
/** One wrong answer, with the choice you actually made set against the
 *  right one, the question itself to retry, and a way to file it away
 *  once you've taken it in. */
function MistakeCard({ entry }) {
  const { wrongPicks, resetMistake } = useQuiz();
  const { item, id } = entry;
  const picked = wrongPicks.get(id);
  const yourAnswer = picked !== undefined ? item.choices[picked] : null;

  return (
    <div className="gcard mistake-card" style={{ "--accent": "var(--shu)" }}>
      <div className="mistake-recap">
        {yourAnswer != null && (
          <div className="mistake-row wrong">
            <span className="mistake-tag">You answered</span>
            <span className="jp-lookup" dangerouslySetInnerHTML={{ __html: yourAnswer }} />
          </div>
        )}
        <div className="mistake-row right">
          <span className="mistake-tag">Correct answer</span>
          <span className="jp-lookup" dangerouslySetInnerHTML={{ __html: item.choices[item.a] }} />
        </div>
      </div>

      <Quiz idPrefix="mistakes" ids={[id]} items={[item]} label="RETRY" getContentId={(it) => it._pid || it._cid} />

      <button className="mistake-got-it" onClick={() => resetMistake(id)}>
        はい、わかりました
      </button>
    </div>
  );
}

export default function ReviewMistakes({ isActive }) {
  const { answered, poolStats, dismissed } = useQuiz();
  const stateRef = useRef({ answered, poolStats, dismissed });
  stateRef.current = { answered, poolStats, dismissed };

  function computeGroups() {
    const { answered, poolStats, dismissed } = stateRef.current;
    const map = new Map();
    getAllQuizEntries().forEach((e) => {
      const wrong = e.section === "quiz" ? poolStats.get(e.id) === false : answered.get(e.id) === false;
      if (!wrong || dismissed.has(e.id)) return;
      if (!map.has(e.sectionLabel)) map.set(e.sectionLabel, []);
      map.get(e.sectionLabel).push(e);
    });
    return Array.from(map.entries());
  }

  const [groups, setGroups] = useState(() => computeGroups());

  useEffect(() => {
    if (isActive) setGroups(computeGroups());
  }, [isActive]);

  // The list itself only rebuilds when the tab is opened (so a correct retry
  // doesn't snatch the question away before you see it turn green), but
  // dismissing is an explicit "hide this", so that applies immediately.
  const visible = groups
    .map(([label, items]) => [label, items.filter((e) => !dismissed.has(e.id))])
    .filter(([, items]) => items.length);
  const totalWrong = visible.reduce((n, [, items]) => n + items.length, 0);

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

      {visible.map(([label, items]) => (
        <div key={label}>
          <div className="qc-group-title">{label} — {items.length} to review</div>
          {items.map((e) => (
            <MistakeCard key={e.id} entry={e} />
          ))}
        </div>
      ))}
    </>
  );
}
