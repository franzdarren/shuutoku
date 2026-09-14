import { useState } from "react";
import { finalQuizGroups, countQuizPool } from "../../data/index.js";
import { useQuiz } from "../../context/QuizContext.jsx";
import Quiz from "../Quiz.jsx";

function shuffled(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function drawSample() {
  const pool = [];
  finalQuizGroups.forEach((group) => group.items.forEach((item) => pool.push(item)));
  return shuffled(pool).slice(0, Math.min(10, pool.length));
}

const FINAL_IDS = Array.from({ length: 10 }, (_, i) => "final-q" + i);

export default function QuizCenter() {
  const { stats, resetAll, clearQuestions } = useQuiz();
  const [sample, setSample] = useState(() => drawSample());

  function newSet() {
    clearQuestions(FINAL_IDS);
    setSample(drawSample());
  }

  return (
    <>
      <div className="section-head">
        <div className="eyebrow-jp">総復習クイズ</div>
        <h1>Quiz Center</h1>
        <p>A mixed-format mock review — fill-in-the-blank grammar, kanji reading, and short comprehension — modeled on how the actual N4 groups these together. Each visit draws 10 questions at random from a pool of {countQuizPool()}, so the set is different every time you come back. Your score below covers every quiz on this entire page, not just this section.</p>
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
        <Quiz idPrefix="final" items={sample} label="MIXED REVIEW SET" />
      </div>

      <footer className="pagefoot">Built for your N4 review and travel prep. Lesson/chapter references are approximate cross-references between editions — use them to find more practice in your own books, not as exact page numbers. Kanji classification follows commonly used N4 study references; the JLPT itself does not publish an official kanji list.</footer>
    </>
  );
}
