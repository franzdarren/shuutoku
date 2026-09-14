import { useState } from "react";
import { finalPool, countQuizPool } from "../../data/index.js";
import { useQuiz } from "../../context/QuizContext.jsx";
import { drawSampleWeighted } from "../../lib/quiz.js";
import Quiz from "../Quiz.jsx";

const FINAL_IDS = Array.from({ length: 10 }, (_, i) => "final-q" + i);
const getPoolId = (item) => item._pid;

export default function QuizCenter() {
  const { stats, resetAll, clearQuestions, weakPoolIds } = useQuiz();
  const [sample, setSample] = useState(() => drawSampleWeighted(finalPool, 10, weakPoolIds, getPoolId));

  function newSet() {
    clearQuestions(FINAL_IDS);
    setSample(drawSampleWeighted(finalPool, 10, weakPoolIds, getPoolId));
  }

  return (
    <>
      <div className="section-head">
        <div className="eyebrow-jp">総復習クイズ</div>
        <h1>Quiz Center</h1>
        <p>A mixed-format mock review — fill-in-the-blank grammar, kanji reading, and short comprehension — modeled on how the actual N4 groups these together. Each visit draws 10 questions from a pool of {countQuizPool()}, leaning toward ones you've missed before so mistakes resurface more often, with the rest filled in at random. Your score below covers every quiz on this entire page, not just this section.</p>
      </div>

      <div className="qc-score">
        <div>
          <div className="num">{stats.correctCount} / {stats.answeredCount}</div>
          <div className="lbl">Correct / Answered — whole handbook</div>
        </div>
        <button className="qc-reset" onClick={newSet}>New random set</button>
        <button className="qc-reset" onClick={resetAll}>Reset all quiz progress</button>
      </div>

      <div className="qc-group-title">Random sample of 10</div>
      <div className="gcard" style={{ "--accent": "var(--gold)" }}>
        <Quiz idPrefix="final" items={sample} label="MIXED REVIEW SET" getContentId={getPoolId} />
      </div>

      <footer className="pagefoot">Built for your N4 review and travel prep. Lesson/chapter references are approximate cross-references between editions — use them to find more practice in your own books, not as exact page numbers. Kanji classification follows commonly used N4 study references; the JLPT itself does not publish an official kanji list.</footer>
    </>
  );
}
