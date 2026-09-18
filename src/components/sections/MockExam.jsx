import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { getAllQuizEntries, readingPassages, kaiwaScenarios } from "../../data/index.js";
import { useQuiz } from "../../context/QuizContext.jsx";
import JpText from "../JpText.jsx";


/* Shaped like the written half of a real N4 paper. Page 1 is 言語知識
 * (script/vocab then grammar), page 2 is 読解 — and reading questions are
 * only ever asked underneath the passage they're about. Drawing them loose
 * produced unanswerable items like "1日目、空港からホテルまで…" with no
 * itinerary in sight. */
const PLAN = { kanji: 9, grammar: 18, passages: 2, scripts: 1 };
const DURATION = 40 * 60;
const STORE_KEY = "n4.exam";

/* Real N4 reports 0–60 per section and passes at 90/180 with at least 19 in
 * every section. There's no listening here, so the same rules are applied to
 * the two sections that exist: 120 total, pass at 60, 19 minimum each. */
const SECTION_MAX = 60;
const PASS_TOTAL = 60;
const PASS_SECTION = 19;

const shuffle = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** The paper is stored as the *draw* — which question ids and which passages —
 *  rather than the assembled pages, so a refresh rebuilds an identical paper
 *  from a few hundred bytes instead of persisting every question's text. */
function buildDraw() {
  const all = getAllQuizEntries();
  const pick = (list, n) => shuffle(list).slice(0, n).map((e) => e.id);
  return {
    reg: String(Math.floor(Math.random() * 9e7) + 1e7),
    kanji: pick(all.filter((e) => e.section === "kanji"), PLAN.kanji),
    grammar: pick(
      all.filter((e) => e.section === "grammar" || (typeof e.id === "string" && e.id.startsWith("mcheck"))),
      PLAN.grammar
    ),
    passages: shuffle(readingPassages.map((p, i) => i).filter((i) => readingPassages[i].quiz?.length)).slice(0, PLAN.passages),
    scripts: shuffle(kaiwaScenarios.map((s, i) => i).filter((i) => kaiwaScenarios[i].quiz?.length)).slice(0, PLAN.scripts),
  };
}

function paperFromDraw(draw) {
  const byId = new Map(getAllQuizEntries().map((e) => [e.id, e]));
  const take = (ids) => ids.map((id) => byId.get(id)).filter(Boolean).map((e) => ({ id: e.id, item: e.item }));

  const passages = draw.passages.map((i) => ({
    kind: "passage", sourceIndex: i,
    title: readingPassages[i].title,
    titleEn: readingPassages[i].titleEn,
    text: readingPassages[i].text,
    entries: readingPassages[i].quiz.map((item, qi) => ({ id: "read" + i + "-q" + qi, item })),
  }));
  const scripts = draw.scripts.map((i) => ({
    kind: "script", sourceIndex: i,
    title: kaiwaScenarios[i].jp,
    titleEn: kaiwaScenarios[i].en,
    setup: kaiwaScenarios[i].setup,
    lines: kaiwaScenarios[i].lines || [],
    entries: kaiwaScenarios[i].quiz.map((item, qi) => ({ id: "kaiwa" + i + "-q" + qi, item })),
  }));

  const pages = [
    {
      label: "言語知識（文字・語彙・文法）", labelEn: "Language knowledge",
      blocks: [
        { kind: "plain", key: "moji", label: "文字・語彙", labelEn: "Script & vocabulary", entries: take(draw.kanji) },
        { kind: "plain", key: "bunpou", label: "文法", labelEn: "Grammar", entries: take(draw.grammar) },
      ],
    },
    { label: "読解", labelEn: "Reading", blocks: [...passages, ...scripts] },
  ];
  let n = 0;
  pages.forEach((pg) => pg.blocks.forEach((b) => b.entries.forEach((e) => { e.no = ++n; })));
  return pages;
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || s.v !== 1 || !s.draw) return null;
    // A running paper keeps counting on wall time, so its remaining time comes
    // from the deadline rather than whatever was last written.
    const left = s.paused || s.done ? s.left : Math.max(0, Math.round((s.endsAt - Date.now()) / 1000));
    return { ...s, left };
  } catch { return null; }
}

const clock = (s) => Math.floor(Math.max(0, s) / 60) + ":" + String(Math.max(0, s) % 60).padStart(2, "0");
/** Real N4 prints an A/B/C band per knowledge sub-section alongside the score. */
const band = (right, total) => (!total ? "—" : right / total >= 0.67 ? "A" : right / total >= 0.34 ? "B" : "C");

/* The official "認定結果及び成績に関する証明書" carries a パーセンタイル順位 — the share of
 * examinees who scored below you — so the mock sheet carries one too.
 *
 * There is no cohort here to rank against: one person sits this paper. So the
 * rank is read off a MODELLED distribution, not measured. It is a normal curve
 * placed so that the pass mark falls near the published real-world N4 pass rate
 * (which runs roughly 35–50% depending on the sitting); with mean 55 and sd 20,
 * P(score >= 60) ≈ 0.40. That makes the number a fair indication of how a score
 * sits against a realistic spread, and nothing more — the sheet says as much.
 *
 * Abramowitz & Stegun 7.1.26 for erf; plenty for two significant figures. */
function percentileFor(total, max) {
  const mean = max * 0.458, sd = max * 0.167; // 55 and 20 on the 120-point scale
  const z = (total - mean) / sd;
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t
    * Math.exp(-(z * z) / 2);
  const cdf = 0.5 * (1 + (z >= 0 ? y : -y));
  return Math.min(99, Math.max(1, Math.round(cdf * 100)));
}

export default function MockExam() {
  const { answerQuestion, recordPoolResult, recordPick } = useQuiz();
  const [saved] = useState(loadSaved);
  const [draw, setDraw] = useState(() => saved?.draw ?? null);
  const [page, setPage] = useState(() => saved?.page ?? 0);
  const [picks, setPicks] = useState(() => saved?.picks ?? {});
  const [left, setLeft] = useState(() => saved?.left ?? DURATION);
  const [paused, setPaused] = useState(() => saved?.paused ?? false);
  const [endsAt, setEndsAt] = useState(() => saved?.endsAt ?? null);
  const [done, setDone] = useState(() => saved?.done ?? false);
  const [showCert, setShowCert] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [copied, setCopied] = useState(false);

  const pages = useMemo(() => (draw ? paperFromDraw(draw) : null), [draw]);
  const flat = useMemo(() => (pages ? pages.flatMap((pg) => pg.blocks.flatMap((b) => b.entries)) : []), [pages]);

  /* Answers go to whichever record that question natively uses: a card quiz's
     id is its durable slot and counts toward the handbook total, while Quiz
     Center and Module Check items are keyed by content id because their slot
     ids are recycled on every redraw. */
  const submit = useCallback((current) => {
    setDone(true);
    setShowCert(true);
    setPaused(false);
    flat.forEach((entry) => {
      const picked = current[entry.id];
      if (picked === undefined) return;
      const isCorrect = picked === entry.item.a;
      const contentId = entry.item._pid || entry.item._cid || null;
      if (contentId) recordPoolResult(contentId, isCorrect);
      else answerQuestion(entry.id, isCorrect);
      recordPick(contentId || entry.id, picked, isCorrect);
    });
  }, [flat, answerQuestion, recordPoolResult, recordPick]);

  /* The clock runs on wall time against a deadline, not by decrementing a
     counter — so leaving the tab, or refreshing, doesn't quietly hand you
     extra minutes. Pausing is the supported way to stop it. */
  useEffect(() => {
    if (!draw || done || paused || endsAt == null) return;
    const tick = () => {
      const remaining = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining <= 0) submit(picks);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [draw, done, paused, endsAt, picks, submit]);

  /* Persisted on every meaningful change. `left` is deliberately NOT a
     dependency — it changes every second, and writing to localStorage once a
     second for 40 minutes is pointless when `endsAt` already implies it. It's
     only authoritative while paused or finished, and both of those arrive
     alongside a dependency that is listed, so the value written is current. */
  useEffect(() => {
    if (!draw) { localStorage.removeItem(STORE_KEY); return; }
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ v: 1, draw, page, picks, left, paused, endsAt, done }));
    } catch { /* quota or private mode — the exam still works, it just won't survive a refresh */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draw, page, picks, paused, endsAt, done]);

  function start() {
    setDraw(buildDraw());
    setPage(0);
    setPicks({});
    setLeft(DURATION);
    setPaused(false);
    setEndsAt(Date.now() + DURATION * 1000);
    setDone(false);
    setShowCert(false);
    setConfirmSubmit(false);
    setConfirmQuit(false);
  }

  function pause() {
    setLeft(Math.max(0, Math.round((endsAt - Date.now()) / 1000)));
    setPaused(true);
  }
  function resume() {
    setEndsAt(Date.now() + left * 1000);
    setPaused(false);
  }

  function goPage(i) {
    setPage(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function discard() {
    setConfirmQuit(false);
    setDraw(null);
    setDone(false);
    setPaused(false);
    setShowCert(false);
  }

  const result = useMemo(() => {
    if (!pages || !done) return null;
    const tally = (entries) => ({
      right: entries.filter((e) => picks[e.id] === e.item.a).length,
      total: entries.length,
    });
    const moji = tally(pages[0].blocks[0].entries);
    const bunpou = tally(pages[0].blocks[1].entries);
    const knowledge = tally(pages[0].blocks.flatMap((b) => b.entries));
    const reading = tally(pages[1].blocks.flatMap((b) => b.entries));
    const scale = (t) => (t.total ? Math.round((t.right / t.total) * SECTION_MAX) : 0);
    const kScore = scale(knowledge);
    const rScore = scale(reading);
    const total = kScore + rScore;
    return {
      moji, bunpou,
      knowledge: { ...knowledge, score: kScore },
      reading: { ...reading, score: rScore },
      total,
      passed: total >= PASS_TOTAL && kScore >= PASS_SECTION && rScore >= PASS_SECTION,
      rightCount: knowledge.right + reading.right,
      questionCount: knowledge.total + reading.total,
    };
  }, [pages, done, picks]);

  const answeredCount = Object.keys(picks).length;

  function copyResult() {
    if (!result) return;
    navigator.clipboard?.writeText([
      "日本語能力試験 N4 — 模擬試験 結果",
      result.passed ? "判定: 合格" : "判定: 不合格",
      `言語知識（文字・語彙・文法）: ${result.knowledge.score} / ${SECTION_MAX}`,
      `読解: ${result.reading.score} / ${SECTION_MAX}`,
      `総合得点: ${result.total} / ${SECTION_MAX * 2}  (合格点 ${PASS_TOTAL})`,
      `正答: ${result.rightCount} / ${result.questionCount}`,
      new Date().toLocaleDateString(),
    ].join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!pages) {
    return (
      <>
        <div className="section-head section-head--bare">
          <div className="eyebrow-jp">模擬試験</div>
          <h1>Mock Exam</h1>
        </div>
        <p className="section-note">
          A timed paper shaped like the written half of a real N4: 言語知識 first, then 読解 on its own page
          with the passages printed above their questions. {DURATION / 60} minutes, no feedback until you
          finish, and no dictionary lookup while the clock is running. You can pause at any point — the
          paper blurs and the clock stops, and it survives a refresh. Answers count toward your handbook
          progress, and anything you miss turns up in Review Mistakes.
        </p>
        <div className="exam-start">
          <ul className="exam-blueprint">
            <li><span className="eb-label">文字・語彙 Script &amp; vocabulary</span><span className="eb-count">{PLAN.kanji}</span></li>
            <li><span className="eb-label">文法 Grammar</span><span className="eb-count">{PLAN.grammar}</span></li>
            <li><span className="eb-label">読解 Reading passages</span><span className="eb-count">{PLAN.passages}</span></li>
            <li><span className="eb-label">会話 Conversation script</span><span className="eb-count">{PLAN.scripts}</span></li>
          </ul>
          <button className="exam-go" onClick={start}>Start the exam</button>
        </div>
      </>
    );
  }

  const current = pages[page];
  const isLast = page === pages.length - 1;

  return (
    <>
      <div className="section-head section-head--bare">
        <h1>Mock Exam</h1>
      </div>

      <div className={"exam-bar" + (done ? " finished" : "") + (left <= 300 && !done && !paused ? " urgent" : "")}>
        {done ? (
          <>
            <span className="exam-score">{result.total} / {SECTION_MAX * 2}</span>
            <span className={"exam-verdict " + (result.passed ? "pass" : "fail")}>{result.passed ? "合格" : "不合格"}</span>
            <button className="qc-reset" onClick={() => setShowCert(true)}>View result</button>
          </>
        ) : (
          <>
            <span className="exam-clock" aria-label="Time remaining">{clock(left)}</span>
            <span className="exam-count">{answeredCount} / {flat.length} answered</span>
            <button className="qc-reset" onClick={paused ? resume : pause}>{paused ? "▶ Resume" : "❚❚ Pause"}</button>
          </>
        )}
        {/* Quitting throws away a part-finished paper and the clock with it,
            so it arms first and acts on the second tap — the same gesture as
            "Finish and score" and "Reset all progress". "New paper" after
            you've been scored costs nothing, so it still goes on one tap. */}
        <button
          className={"qc-reset exam-restart" + (!done && confirmQuit ? " armed" : "")}
          onClick={() => {
            if (done) { start(); return; }
            if (!confirmQuit) { setConfirmQuit(true); return; }
            discard();
          }}
          onBlur={() => setConfirmQuit(false)}
        >
          {done ? "New paper" : confirmQuit ? "Tap again to quit" : "Quit"}
        </button>
      </div>

      {/* The paper itself is blurred while paused; the sidebar and every other
          section stay untouched, so you can go and look something up — the
          point is that stopping the clock is a deliberate, visible act. */}
      <div className={"exam-paper" + (paused ? " paused" : "")}>
        <div className="exam-pagehead">
          <span className="exam-pagenum">{page + 1} / {pages.length}</span>
          <span className="exam-pagetitle">{current.label}</span>
          <span className="exam-pagesub">{current.labelEn}</span>
        </div>

        {current.blocks.map((block, bi) => (
          <div key={bi} className="exam-block">
            {block.kind === "plain" ? (
              <div className="exam-block-head">{block.label} <span>{block.labelEn}</span></div>
            ) : (
              <div className="exam-source">
                <div className="exam-source-label">{block.kind === "passage" ? "次の文章を読んで、質問に答えてください。" : "次の会話を読んで、質問に答えてください。"}</div>
                {/* Rendered without JpText on purpose: JpText adds .jp-lookup,
                    which is what enables highlight-to-Jisho. */}
                <div className="exam-source-title" dangerouslySetInnerHTML={{ __html: block.title }} />
                {block.titleEn && <div className="exam-source-titleen">{block.titleEn}</div>}
                {block.setup && <div className="scenario-setup">{block.setup}</div>}
                {block.kind === "passage" ? (
                  <div className="passage-text" dangerouslySetInnerHTML={{ __html: block.text }} />
                ) : (
                  <div className="exam-script">
                    {block.lines.map((l, li) => (
                      <div key={li} className="exam-script-line">
                        <span className="exam-script-who">{l.who}</span>
                        <span className="exam-script-jp" dangerouslySetInnerHTML={{ __html: l.jp }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <ol className="exam-list">
              {block.entries.map((entry) => {
                const picked = picks[entry.id];
                return (
                  <li key={entry.id} className="exam-q">
                    <div className="exam-q-head"><span className="exam-q-num">{entry.no}</span></div>
                    <div className="qprompt" dangerouslySetInnerHTML={{ __html: entry.item.q }} />
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
                            disabled={done || paused}
                            onClick={() => setPicks((p) => ({ ...p, [entry.id]: idx }))}
                            dangerouslySetInnerHTML={{ __html: c }}
                          />
                        );
                      })}
                    </div>
                    {/* Lookup comes back once the paper is scored — at that
                        point it's review, not cheating. */}
                    {done && <JpText tag="div" className="qexplain show" html={entry.item.ex} />}
                  </li>
                );
              })}
            </ol>
          </div>
        ))}

        <div className="exam-pager">
          <button className="qc-reset" disabled={page === 0 || paused} onClick={() => goPage(page - 1)}>← Previous</button>
          {!isLast && <button className="exam-go" disabled={paused} onClick={() => goPage(page + 1)}>Next page →</button>}
          {isLast && !done && (
            <button
              className={"exam-go" + (confirmSubmit ? " armed" : "")}
              disabled={paused}
              onClick={() => { if (!confirmSubmit) { setConfirmSubmit(true); return; } submit(picks); }}
              onBlur={() => setConfirmSubmit(false)}
            >
              {/* The blank count goes on the button, not just in the note below
                  it — this is the moment you decide, and unanswered questions
                  are scored wrong. */}
              {confirmSubmit
                ? (flat.length - answeredCount > 0
                    ? `Tap again — ${flat.length - answeredCount} still blank`
                    : "Tap again to finish")
                : "Finish and score"}
            </button>
          )}
        </div>

        {!done && answeredCount < flat.length && isLast && (
          <p className="exam-warn">{flat.length - answeredCount} question{flat.length - answeredCount === 1 ? "" : "s"} still blank.</p>
        )}
      </div>

      {paused && (
        <div className="exam-pause-note">
          <div className="exam-pause-jp">一時停止中</div>
          <div className="exam-pause-en">Paused · {clock(left)} remaining</div>
          <button className="exam-go" onClick={resume}>▶ Resume exam</button>
        </div>
      )}

      {/* Portalled to <body> so the print stylesheet can hide the whole app
          shell and leave the certificate standing. */}
      {showCert && result && createPortal(
        <div className="cert-scrim" onClick={() => setShowCert(false)}>
          <div className="cert-wrap" onClick={(e) => e.stopPropagation()}>
            <div className="cert-sheet" role="document">
              {/* The faint repeated mark official documents carry. Drawn as
                  real DOM text rather than an SVG background so it renders
                  with the page's own CJK font instead of hoping one exists
                  inside the image. */}
              <div className="cert-watermark" aria-hidden="true">
                <div className="cert-watermark-seal">模擬</div>
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="cert-watermark-row">模擬試験　模擬試験　模擬試験　模擬試験</div>
                ))}
              </div>
              <div className="cert-body">
              <div className="cert-rule-top" />
              <div className="cert-head">
                <div className="cert-org">日 本 語 能 力 試 験</div>
                <div className="cert-title">合 否 結 果 通 知 書</div>
                <div className="cert-mockmark">模擬 · PRACTICE</div>
              </div>

              <div className="cert-meta">
                <div><span>受験番号 Registration No.</span><b>N4-{draw.reg}</b></div>
                <div><span>レベル Level</span><b>N4</b></div>
                <div><span>試験日 Test date</span><b>{new Date().toLocaleDateString("ja-JP")}</b></div>
              </div>

              {/* Scores and the 参考情報 bands share one table. Two separate
                  tables each with their own heading was a lot of vertical
                  space for five rows, and the sheet has to fit on one page. */}
              <table className="cert-table">
                <tbody>
                  <tr>
                    <td>言語知識（文字・語彙・文法）<span>Language knowledge</span></td>
                    <td className="cert-num">{result.knowledge.score}<i> / {SECTION_MAX}</i></td>
                  </tr>
                  <tr>
                    <td>読解<span>Reading</span></td>
                    <td className="cert-num">{result.reading.score}<i> / {SECTION_MAX}</i></td>
                  </tr>
                  <tr className="cert-total">
                    <td>総合得点<span>Total score</span></td>
                    <td className="cert-num">{result.total}<i> / {SECTION_MAX * 2}</i></td>
                  </tr>
                  <tr className="cert-refhead">
                    <td colSpan={2}>参考情報 · Reference information</td>
                  </tr>
                  <tr>
                    <td>パーセンタイル順位<span>Percentile rank (estimated)</span></td>
                    <td className="cert-band">{percentileFor(result.total, SECTION_MAX * 2)}</td>
                  </tr>
                  <tr>
                    <td>文字・語彙<span>Script &amp; vocabulary</span></td>
                    <td className="cert-band">{band(result.moji.right, result.moji.total)}</td>
                  </tr>
                  <tr>
                    <td>文法<span>Grammar</span></td>
                    <td className="cert-band">{band(result.bunpou.right, result.bunpou.total)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="cert-refnote">
                A … 正答率67%以上　B … 34%以上67%未満　C … 34%未満<br />
                パーセンタイル順位は実際の受験者データではなく、推定分布に基づく参考値です。
                Percentile is estimated against a modelled score distribution, not real examinee data.
              </div>

              <div className={"cert-verdict " + (result.passed ? "pass" : "fail")}>
                <div className="cert-verdict-label">判定 Result</div>
                <div className="cert-seal">{result.passed ? "合格" : "不合格"}</div>
                <div className="cert-verdict-en">{result.passed ? "Passed" : "Not passed"}</div>
              </div>

              <div className="cert-foot">
                <div>正答 {result.rightCount} / {result.questionCount}　·　合格点 {PASS_TOTAL} / {SECTION_MAX * 2}　·　各区分の基準点 {PASS_SECTION}</div>
                <div className="cert-disclaimer">
                  聴解は含まれません。A practice result from 習得 Shuutoku — not an official JLPT certificate,
                  and not issued by any testing body. Listening is not tested here.
                </div>
              </div>
              <div className="cert-rule-bottom" />
              </div>
            </div>

            <div className="cert-actions">
              <button className="exam-go" onClick={() => window.print()}>Save as PDF / print</button>
              <button className="qc-reset" onClick={copyResult}>{copied ? "Copied" : "Copy result"}</button>
              <button className="qc-reset" onClick={() => setShowCert(false)}>Close</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
