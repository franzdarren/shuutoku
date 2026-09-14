import { useState } from "react";
import { useQuiz } from "../context/QuizContext.jsx";

/** One shared quiz widget, used everywhere a grammar card, reading passage,
 *  kaiwa scenario, kanji check, or the Quiz Center needs a "check your
 *  understanding" block. Scoring/progress is tracked centrally so the
 *  sidebar progress bar and Quiz Center score cover the whole handbook. */
export default function Quiz({ idPrefix, items, label = "CHECK YOUR UNDERSTANDING" }) {
  if (!items || !items.length) return null;
  return (
    <div className="quizbox">
      <div className="qlabel">{label}</div>
      {items.map((item, i) => (
        <QuizItem key={idPrefix + "-q" + i} qid={idPrefix + "-q" + i} item={item} />
      ))}
    </div>
  );
}

function QuizItem({ qid, item }) {
  const { answered, answerQuestion } = useQuiz();
  const [lastIdx, setLastIdx] = useState(null);
  const [busy, setBusy] = useState(false);
  const attempted = answered.has(qid) || lastIdx !== null;

  function pick(idx) {
    if (busy) return;
    const isFirstAttempt = !answered.has(qid);
    const isCorrect = idx === item.a;
    setLastIdx(idx);
    if (isCorrect) {
      if (isFirstAttempt) answerQuestion(qid, true);
    } else {
      answerQuestion(qid, false);
    }
    setBusy(true);
    setTimeout(() => setBusy(false), 250);
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
          const cls = ["qchoice", isCorrectChoice && "correct", isWrongPick && "incorrect", busy && "disabled"]
            .filter(Boolean).join(" ");
          return (
            <button key={idx} className={cls} onClick={() => pick(idx)} dangerouslySetInnerHTML={{ __html: c }} />
          );
        })}
      </div>
      <div className={"qexplain jp-lookup" + (attempted ? " show" : "")} dangerouslySetInnerHTML={{ __html: item.ex }} />
    </div>
  );
}
