import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAllQuizEntries } from "../../data/index.js";
import { useQuiz } from "../../context/QuizContext.jsx";
import JpText from "../JpText.jsx";

/* Proportions follow the real N4's written sections, where grammar carries
 * roughly half the paper, vocabulary/kanji about a quarter, and reading the
 * rest. Listening isn't something this handbook can test, so its share is
 * given to the conversation scripts instead. */
const BLUEPRINT = [
  { key: "grammar", label: "文法 Grammar", count: 18 },
  { key: "kanji", label: "文字・語彙 Kanji & vocab", count: 9 },
  { key: "reading", label: "読解 Reading", count: 5 },
  { key: "kaiwa", label: "会話 Conversation", count: 3 },
];
const TOTAL = BLUEPRINT.reduce((n, s) => n + s.count, 0);
const DURATION = 40 * 60; // seconds

/** Module Check questions are grammar; the Quiz Center pool is mixed topic
 *  and is only used to top a section up when its own bank runs short. */
function bucketOf(entry) {
  if (entry.section === "grammar") return "grammar";
  if (entry.section === "kanji") return "kanji";
  if (entry.section === "reading") return "reading";
  if (entry.section === "kaiwa") return "kaiwa";
  if (typeof entry.id === "string" && entry.id.startsWith("mcheck")) return "grammar";
  return "mixed";
}

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawPaper() {
  const buckets = { grammar: [], kanji: [], reading: [], kaiwa: [], mixed: [] };
  getAllQuizEntries().forEach((e) => buckets[bucketOf(e)].push(e));
  const spare = shuffle(buckets.mixed);
  const paper = [];
  for (const section of BLUEPRINT) {
    const drawn = shuffle(buckets[section.key]).slice(0, section.count);
    // A short bank borrows from the mixed pool rather than shrinking the paper.
    while (drawn.length < section.count && spare.length) drawn.push(spare.pop());
    drawn.forEach((e) => paper.push({ ...e, sectionKey: section.key }));
  }
  return paper;
}

function clock(seconds) {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return m + ":" + String(s).padStart(2, "0");
}

export default function MockExam({ isActive }) {
  const { answerQuestion, recordPoolResult, recordPick } = useQuiz();
  const [paper, setPaper] = useState(null);
  const [picks, setPicks] = useState({});     // index -> chosen option index
  const [left, setLeft] = useState(DURATION);
  const [done, setDone] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  /* The timer must not depend on `picks`, or every answer would tear the
     interval down and restart its one-second tick — answer quickly enough and
     the clock runs slow. The ref lets a timeout submit the current answers
     without the effect re-running when they change. */
  const picksRef = useRef(picks);
  picksRef.current = picks;

  /* Every answer lands in the same records a normal quiz would write to, so
     the handbook progress bar moves and wrong answers surface in Review
     Mistakes — the exam is a different way to meet the questions, not a
     separate scoreboard.
   *
   * Which record depends on the question. A card quiz's id IS its durable
   * slot id and is counted in the handbook total, so it goes to `answered`.
   * Quiz Center and Module Check items are keyed by content id instead —
   * their slot ids ("final-q3") are recycled on every redraw — so they go to
   * `poolStats`, which is also where Review Mistakes looks them up. Writing
   * those to `answered` too would add ids the total never counted and push
   * the sidebar progress bar past 100%. */
  const submit = useCallback((currentPicks) => {
    setDone(true);
    paper?.forEach((entry, i) => {
      const picked = currentPicks[i];
      if (picked === undefined) return;
      const isCorrect = picked === entry.item.a;
      const contentId = entry.item._pid || entry.item._cid || null;
      if (contentId) recordPoolResult(contentId, isCorrect);
      else answerQuestion(entry.id, isCorrect);
      recordPick(contentId || entry.id, picked, isCorrect);
    });
  }, [paper, answerQuestion, recordPoolResult, recordPick]);

  // The timer only runs while the exam is on screen and unfinished; running
  // out submits whatever has been answered so far.
  useEffect(() => {
    if (!paper || done || !isActive) return;
    const t = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) { clearInterval(t); submit(picksRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [paper, done, isActive, submit]);

  function start() {
    setPaper(drawPaper());
    setPicks({});
    setLeft(DURATION);
    setDone(false);
    setConfirmSubmit(false);
  }

  const score = useMemo(() => {
    if (!paper || !done) return null;
    const per = {};
    BLUEPRINT.forEach((s) => { per[s.key] = { right: 0, total: 0 }; });
    let right = 0;
    paper.forEach((entry, i) => {
      const bucket = per[entry.sectionKey];
      bucket.total++;
      if (picks[i] === entry.item.a) { bucket.right++; right++; }
    });
    return { right, total: paper.length, per };
  }, [paper, done, picks]);

  const answeredCount = Object.keys(picks).length;

  if (!paper) {
    return (
      <>
        <div className="section-head section-head--bare">
          <div className="eyebrow-jp">模擬試験</div>
          <h1>Mock Exam</h1>
        </div>
        <p className="section-note">
          A timed run shaped like the written half of a real N4 paper — {TOTAL} questions in {DURATION / 60} minutes,
          weighted the way the exam weights them. No feedback until you finish, so the score means something.
          Answers count toward your handbook progress, and anything you get wrong turns up in Review Mistakes.
        </p>
        <div className="exam-start">
          <ul className="exam-blueprint">
            {BLUEPRINT.map((s) => (
              <li key={s.key}><span className="eb-label">{s.label}</span><span className="eb-count">{s.count}</span></li>
            ))}
            <li className="eb-total"><span className="eb-label">Total</span><span className="eb-count">{TOTAL}</span></li>
          </ul>
          <button className="exam-go" onClick={start}>Start the exam</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="section-head section-head--bare">
        <h1>Mock Exam</h1>
      </div>

      <div className={"exam-bar" + (done ? " finished" : "") + (left <= 300 && !done ? " urgent" : "")}>
        {done ? (
          <>
            <span className="exam-score">{score.right} / {score.total}</span>
            <span className="exam-pct">{Math.round((score.right / score.total) * 100)}%</span>
          </>
        ) : (
          <>
            <span className="exam-clock" aria-label="Time remaining">{clock(left)}</span>
            <span className="exam-count">{answeredCount} / {paper.length} answered</span>
          </>
        )}
        <button className="qc-reset" onClick={start}>{done ? "New paper" : "Restart"}</button>
      </div>

      {done && (
        <div className="exam-result">
          <div className="exam-result-head">By section</div>
          {BLUEPRINT.map((s) => {
            const b = score.per[s.key];
            if (!b.total) return null;
            const pct = Math.round((b.right / b.total) * 100);
            return (
              <div key={s.key} className="exam-row">
                <span className="exam-row-label">{s.label}</span>
                <span className="exam-row-track"><span className="exam-row-fill" style={{ width: pct + "%" }} /></span>
                <span className="exam-row-num">{b.right}/{b.total}</span>
              </div>
            );
          })}
          <p className="exam-note">
            Everything here is recorded in your normal progress. The ones you missed are waiting in Review Mistakes.
          </p>
        </div>
      )}

      <ol className="exam-list">
        {paper.map((entry, i) => {
          const picked = picks[i];
          return (
            <li key={entry.id + "|" + i} className="exam-q">
              <div className="exam-q-head">
                <span className="exam-q-num">{i + 1}</span>
                <span className="exam-q-from">{entry.sectionLabel}</span>
              </div>
              <JpText tag="div" className="qprompt jp-lookup" html={entry.item.q} />
              <div className="qchoices">
                {entry.item.choices.map((c, idx) => {
                  let cls = "qchoice";
                  if (done) {
                    if (idx === entry.item.a) cls += " correct";
                    else if (idx === picked) cls += " incorrect";
                    else cls += " disabled";
                  } else if (idx === picked) cls += " picked";
                  return (
                    <button
                      key={idx}
                      className={cls}
                      disabled={done}
                      onClick={() => setPicks((p) => ({ ...p, [i]: idx }))}
                      dangerouslySetInnerHTML={{ __html: c }}
                    />
                  );
                })}
              </div>
              {done && <JpText tag="div" className="qexplain show jp-lookup" html={entry.item.ex} />}
            </li>
          );
        })}
      </ol>

      {!done && (
        <div className="exam-submit">
          {answeredCount < paper.length && (
            <p className="exam-warn">{paper.length - answeredCount} question{paper.length - answeredCount === 1 ? "" : "s"} still blank.</p>
          )}
          <button
            className={"exam-go" + (confirmSubmit ? " armed" : "")}
            onClick={() => { if (!confirmSubmit) { setConfirmSubmit(true); return; } submit(picks); }}
            onBlur={() => setConfirmSubmit(false)}
          >
            {confirmSubmit ? "Tap again to finish and see your score" : "Finish and score"}
          </button>
        </div>
      )}
    </>
  );
}
