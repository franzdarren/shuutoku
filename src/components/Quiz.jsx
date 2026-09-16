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
  const { answered, poolStats, answerQuestion, recordPoolResult } = useQuiz();
  const [lastIdx, setLastIdx] = useState(null);
  const [showWhy, setShowWhy] = useState(false);
  // Slot ids like "final-qN" / "modcheckN-qM" get reused for a different
  // question on every resample, so the global `answered` map (keyed by
  // slot) can't tell us whether *this* question was answered. Pool items
  // carry a stable contentId instead — check that map for them so a fresh
  // question dropped into a previously-answered slot doesn't render as
  // already attempted.
  const attempted = (contentId ? poolStats.has(contentId) : answered.has(qid)) || lastIdx !== null;
  const hasWhy = Array.isArray(item.why) && item.why.some(Boolean);

  function pick(idx) {
    if (attempted) return; // one attempt per question — no changing your answer after seeing the result
    const isCorrect = idx === item.a;
    setLastIdx(idx);
    answerQuestion(qid, isCorrect);
    if (contentId) recordPoolResult(contentId, isCorrect);
  }

  return (
    <div className="qitem">
      {/* q/choices/ex are rendered as HTML — most are plain text (harmless
          either way), but some (e.g. Reading Lab) include <ruby> furigana. */}
      <div className="qprompt jp-lookup" dangerouslySetInnerHTML={{ __html: item.q }} />
      <div className="qchoices">
        {item.choices.map((c, idx) => {
          const isCorrectChoice = attempted && idx === item.a;
          const isWrongPick = attempted && idx === lastIdx && idx !== item.a;
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
                    {" — " + item.why[idx]}
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
