import { useState } from "react";
import { useQuiz } from "../context/QuizContext.jsx";

/** One shared quiz widget, used everywhere a grammar card, reading passage,
 *  kaiwa scenario, kanji check, or the Quiz Center needs a "check your
 *  understanding" block. Scoring/progress is tracked centrally so the
 *  sidebar progress bar and Quiz Center score cover the whole handbook. */
export default function Quiz({ idPrefix, items, label = "CHECK YOUR UNDERSTANDING", ids, getContentId }) {
  if (!items || !items.length) return null;
  return (
    <div className="quizbox">
      <div className="qlabel">{label}</div>
      {items.map((item, i) => {
        const qid = ids ? ids[i] : idPrefix + "-q" + i;
        const contentId = getContentId ? getContentId(item, i) : null;
        // Slots like "final-q0" / "modcheck2-q0" are reused across resamples
        // (same qid, different question). Fold the actual content into the
        // key so a "New random set" click remounts the item instead of
        // reusing a QuizItem whose local answered/selected state belongs to
        // the previous question that lived in this slot.
        const key = qid + "|" + (contentId ?? item.q ?? i);
        return (
          <QuizItem key={key} qid={qid} item={item} contentId={contentId} />
        );
      })}
    </div>
  );
}

function QuizItem({ qid, item, contentId }) {
  const { answered, poolStats, answerQuestion, recordPoolResult, recordPick, wrongPicks } = useQuiz();
  const [lastIdx, setLastIdx] = useState(null);
  const [showWhy, setShowWhy] = useState(false);
  // Slot ids like "final-qN" / "modcheckN-qM" get reused for a different
  // question on every resample, so the global `answered` map (keyed by
  // slot) can't tell us whether *this* question was answered. Pool items
  // carry a stable contentId instead — check that map for them so a fresh
  // question dropped into a previously-answered slot doesn't render as
  // already attempted.
  const pickKey = contentId || qid;
  // Driven only by the global record, not local `lastIdx` — a click inside
  // pick() always updates that global record in the same render pass, so
  // there's no gap where only local state would know it's attempted. That
  // matters because a QuizItem elsewhere on the page (e.g. the original
  // grammar card behind a Review Mistakes entry) never remounts; if this
  // were OR'd with `lastIdx !== null`, that instance's stale local state
  // would keep it looking "attempted" forever, even after resetMistake
  // wipes the global record clean.
  const attempted = contentId ? poolStats.has(contentId) : answered.has(qid);
  // Which choice you picked, for the red "wrong" highlight. `lastIdx` only
  // covers this page load (it resets on refresh); wrongPicks is the
  // persisted fallback, so a wrong answer still shows as wrong — not just
  // "here's the right one" — after reloading the page.
  const wrongIdx = lastIdx !== null ? lastIdx : wrongPicks.get(pickKey);
  const hasWhy = Array.isArray(item.why) && item.why.some(Boolean);

  function pick(idx) {
    if (attempted) return; // one attempt per question — no changing your answer after seeing the result
    const isCorrect = idx === item.a;
    setLastIdx(idx);
    answerQuestion(qid, isCorrect);
    if (contentId) recordPoolResult(contentId, isCorrect);
    recordPick(pickKey, idx, isCorrect);
  }

  return (
    <div className="qitem">
      {/* q/choices/ex are rendered as HTML — most are plain text (harmless
          either way), but some (e.g. Reading Lab) include <ruby> furigana. */}
      <div className="qprompt jp-lookup" dangerouslySetInnerHTML={{ __html: item.q }} />
      <div className="qchoices">
        {item.choices.map((c, idx) => {
          const isCorrectChoice = attempted && idx === item.a;
          const isWrongPick = attempted && idx === wrongIdx && idx !== item.a;
          const cls = ["qchoice", isCorrectChoice && "correct", isWrongPick && "incorrect", attempted && "disabled"]
            .filter(Boolean).join(" ");
          return (
            <button key={idx} className={cls} onClick={() => pick(idx)} dangerouslySetInnerHTML={{ __html: c }} />
          );
        })}
      </div>
      <div className={"qexplain jp-lookup" + (attempted ? " show" : "")} dangerouslySetInnerHTML={{ __html: item.ex }} />

      {attempted && hasWhy && (
        <div className="qwhy-wrap">
          <button className="qwhy-toggle" onClick={() => setShowWhy(!showWhy)}>
            {showWhy ? "Hide" : "Why are the others wrong?"} {showWhy ? "▾" : "▸"}
          </button>
          {showWhy && (
            <ul className="qwhy-list">
              {item.choices.map((c, idx) => {
                if (idx === item.a || !item.why[idx]) return null;
                return (
                  <li key={idx}>
                    <span className="jp-lookup" dangerouslySetInnerHTML={{ __html: c }} />
                    {" — "}
                    {/* why quotes Japanese inline, so it carries furigana
                        markup like every other explanation field here. */}
                    <span className="jp-lookup" dangerouslySetInnerHTML={{ __html: item.why[idx] }} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
