import { useState } from "react";
import { finalPool, countQuizPool } from "../../data/index.js";
import { useQuiz } from "../../context/QuizContext.jsx";
import { drawFreshSample } from "../../lib/quiz.js";
import Quiz from "../Quiz.jsx";

const getPoolId = (item) => item._pid;

/** Draws 10 questions you haven't already answered in Quiz Center before,
 *  so "New random set" never repeats something you've seen (right or
 *  wrong) until you reset progress. */
function drawFreshSet(poolStats) {
  return drawFreshSample(finalPool, 10, poolStats, getPoolId);
}

export default function QuizCenter() {
  const { stats, resetAll, poolStats } = useQuiz();
  const [sample, setSample] = useState(() => drawFreshSet(poolStats));

  function newSet() {
    setSample(drawFreshSet(poolStats));
  }

  return (
    <>
      {/* Score first — it's what you come here to check. */}
      <div className="section-head section-head--bare">
        <h1>Quiz Center</h1>
      </div>

      <div className="qc-score">
        <div>
          <div className="num">{stats.correctCount} / {stats.answeredCount}</div>
          <div className="lbl">Correct / Answered — whole handbook</div>
        </div>
        <button className="qc-reset" onClick={newSet}>New random set</button>
        <button className="qc-reset" onClick={resetAll}>Reset all quiz progress</button>
      </div>

      <p className="section-note">A mixed-format mock review — fill-in-the-blank grammar, kanji reading, and short comprehension — modeled on how the actual N4 groups these together. Each visit draws 10 questions from a pool of {countQuizPool()}; once you've answered one it won't come up again until you reset. The score above covers every quiz in the handbook, not just this section.</p>

      <div className="qc-group-title">Random sample of 10</div>
      <div className="gcard" style={{ "--accent": "var(--gold)" }}>
        <Quiz idPrefix="final" items={sample} label="MIXED REVIEW SET" getContentId={getPoolId} />
      </div>

      <footer className="pagefoot">Built for N4 review and everyday practice in Japan. Lesson/chapter references are approximate cross-references between editions — use them to find more practice in your own books, not as exact page numbers. Kanji classification follows commonly used N4 study references; the JLPT itself does not publish an official kanji list.</footer>
    </>
  );
}
