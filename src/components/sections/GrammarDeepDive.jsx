import { useEffect, useReducer, useRef, useState } from "react";
import { grammarModules, moduleCheckPool } from "../../data/index.js";
import { useQuiz } from "../../context/QuizContext.jsx";
import { drawFreshSample } from "../../lib/quiz.js";
import JpText from "../JpText.jsx";
import Quiz from "../Quiz.jsx";
import Dialogue from "../Dialogue.jsx";
import FloatingNav from "../FloatingNav.jsx";

// Checkpoint questions carry a stable id (see data/index.js) so a redraw
// can tell which ones you've already been asked.
const getCheckId = (item) => item._cid;

// Module numbers are set as kanji numerals alongside their Japanese
// titles — 三 sits in a Mincho heading the way 3 never will. Display only;
// the data keeps plain integers.
const KANJI_NUM = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
const kanjiNum = (n) => KANJI_NUM[n] ?? String(n);

function GrammarCard({ mod, mi, pt, pi }) {
  const accent = "var(--" + mod.accent + ")";
  const pid = "g" + mi + "-" + pi;
  return (
    <div className="gcard" id={"gpt-" + mi + "-" + pi} style={{ "--accent": accent }}>
      <div className="gcard-head">
        <div className="gcard-title">
          <JpText tag="div" className="jp" html={pt.jp} />
          <div className="romaji">{pt.romaji}</div>
          <div className="fn" style={{ color: accent }}>{pt.fn}</div>
        </div>
        <div className="sourcetags">
          {pt.sources.map((s, i) => <span key={i} className="sourcetag">{s}</span>)}
        </div>
      </div>

      <JpText tag="div" className="explain" html={pt.explain} />

      {(pt.formation?.length > 0 || pt.conjugation?.length > 0) && (
        <div className="formation-box">
          <div className="flabel">FORMATION</div>
          {pt.formation?.map((f, i) => <JpText key={i} tag="div" className="fline" html={f} />)}
          {pt.conjugation?.length > 0 && (
            <div className="conjtable">
              {pt.conjugation.map((c, i) => (
                <div key={i} className="conjrow">
                  <span className="conj-label">{c.label}</span>
                  <JpText tag="span" className="conj-from" html={c.from} />
                  <span className="conj-arrow">→</span>
                  <JpText tag="span" className="conj-to" html={c.to} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {pt.examples?.length > 0 && (
        <div className="examples">
          {pt.examples.map((ex, i) => (
            <div key={i} className="ex-item">
              <JpText tag="div" className="ex-jp" html={ex.jp} />
              <div className="ex-en">{ex.en}</div>
            </div>
          ))}
        </div>
      )}

      <Dialogue lines={pt.dialogue} label="KAIWA SAMPLE" accent={accent} tip={pt.tip} />

      {pt.quiz?.length > 0 && <Quiz idPrefix={pid} items={pt.quiz} />}
    </div>
  );
}

/** A 10-question checkpoint drawn from this module's own question bank.
 *  80% is called a "pass", but it's purely a visual signal — there is no
 *  gate, you can move to any module regardless of the result. */
function ModuleCheck({ mi, sample, onNewSet, onResetModule }) {
  const { poolStats } = useQuiz();
  const total = sample.length;
  if (!total) return null;

  // Scored against the questions actually on screen rather than the
  // "modcheckN-qM" slots, which outlive a redraw — otherwise dealing a new
  // set would leave the previous set's verdict sitting above fresh questions.
  let correct = 0, answeredCount = 0;
  sample.forEach((item) => {
    const result = poolStats.get(getCheckId(item));
    if (result === undefined) return;
    answeredCount++;
    if (result) correct++;
  });
  const done = answeredCount === total;
  const pct = done ? correct / total : null;
  const passed = pct !== null && pct >= 0.8;

  return (
    <div className="modcheck">
      <div className="modcheck-head">
        <div>
          <div className="modcheck-title">Module Check</div>
          <div className="modcheck-sub">{total} questions drawn from this module's own checkpoint bank — separate from the quizzes in the cards above, so this tests the module rather than replaying what you just answered. 80% is a "pass", but it's just a checkpoint: move on whenever you like.</div>
        </div>
        <div className="modcheck-actions">
          <button className="qc-reset" onClick={onNewSet}>New random set</button>
          <button className="linkbtn" onClick={onResetModule}>Restart module</button>
        </div>
      </div>
      {done && (
        <div className={"modcheck-result " + (passed ? "pass" : "retry")}>
          {passed ? "✓ Pass" : "Below 80%"} — {correct} / {total} correct ({Math.round(pct * 100)}%)
        </div>
      )}
      <Quiz idPrefix={"modcheck" + mi} items={sample} label="MODULE CHECK" getContentId={getCheckId} />
    </div>
  );
}

/** How far through a module you are: every quiz in its cards plus its
 *  checkpoint bank. Card quizzes are tracked by their fixed slot id, bank
 *  questions by their own content id. */
function moduleProgress(mi, answered, poolStats) {
  const m = grammarModules[mi];
  let total = 0, done = 0, correct = 0;
  m.points.forEach((pt, pi) => (pt.quiz || []).forEach((_, qi) => {
    total++;
    const r = answered.get("g" + mi + "-" + pi + "-q" + qi);
    if (r === undefined) return;
    done++;
    if (r) correct++;
  }));
  (m.check || []).forEach((item) => {
    total++;
    const r = poolStats.get(getCheckId(item));
    if (r === undefined) return;
    done++;
    if (r) correct++;
  });
  return { total, done, correct, pct: total ? Math.round((done / total) * 100) : 0 };
}

/** The same number, shrunk to a bar on each module tab so you can see at a
 *  glance which modules are still untouched. */
function ModuleTabPct({ mi }) {
  const { answered, poolStats } = useQuiz();
  const { pct } = moduleProgress(mi, answered, poolStats);
  return (
    <span className="mj-progress" aria-label={pct + "% complete"}>
      <span className="mj-progress-track"><span className="mj-progress-fill" style={{ width: pct + "%" }} /></span>
      <span className="mj-progress-pct">{pct}%</span>
    </span>
  );
}

function ModuleProgress({ mi }) {
  const { answered, poolStats } = useQuiz();
  const { total, done, correct, pct } = moduleProgress(mi, answered, poolStats);
  return (
    <div className="modprogress" title={`${done} of ${total} questions answered`}>
      <div className="modprogress-pct">{pct}%</div>
      <div className="modprogress-track"><div className="modprogress-fill" style={{ width: pct + "%" }} /></div>
      <div className="modprogress-sub">{done} / {total} answered{done > 0 && ` · ${Math.round((correct / done) * 100)}% correct`}</div>
    </div>
  );
}

// Flat list of every individual grammar point ("lesson"), independent of
// module boundaries — this is what the floating nav jumps between. Each
// module still shows all its points together on one page (that grouping
// solves "too long to scroll"); the floating nav is a separate, finer-
// grained way to jump straight to one specific point/lesson by name.
const ALL_POINTS = grammarModules.flatMap((m, mi) =>
  m.points.map((pt, pi) => ({ mi, pi, jp: pt.jp, group: m.num + ". " + m.jpTitle }))
);
const NAV_ITEMS = ALL_POINTS.map((p) => ({ label: p.jp, group: p.group }));

function firstPointIndexOfModule(mi) {
  return ALL_POINTS.findIndex((p) => p.mi === mi);
}

export default function GrammarDeepDive({ jumpTarget, isActive }) {
  const [activePoint, setActivePoint] = useState(0);
  const activeMod = ALL_POINTS[activePoint].mi;
  const mod = grammarModules[activeMod];
  const { clearQuestions, clearPoolResults, poolStats } = useQuiz();
  const [, bump] = useReducer((c) => c + 1, 0);
  const sampleCache = useRef({});
  const pendingScrollId = useRef(null);

  function drawCheckSet(mi, seen = poolStats) {
    return drawFreshSample(moduleCheckPool(mi), 10, seen, getCheckId);
  }

  if (!sampleCache.current[activeMod]) {
    sampleCache.current[activeMod] = drawCheckSet(activeMod);
  }
  const moduleSample = sampleCache.current[activeMod];

  // Leaves your score alone and just deals a new hand, preferring
  // checkpoint questions you haven't been given yet.
  function newModuleSet() {
    sampleCache.current[activeMod] = drawCheckSet(activeMod);
    bump();
  }

  // Wipes this module's progress — both the card quizzes and the
  // checkpoint — so the whole module can be worked through from scratch.
  function resetModule() {
    const slotIds = [];
    mod.points.forEach((pt, pi) => (pt.quiz || []).forEach((_, qi) => slotIds.push("g" + activeMod + "-" + pi + "-q" + qi)));
    for (let i = 0; i < 10; i++) slotIds.push("modcheck" + activeMod + "-q" + i);
    clearQuestions(slotIds);
    clearPoolResults(moduleCheckPool(activeMod).map(getCheckId).filter(Boolean));
    // Draws against an empty seen-set: the clear above hasn't landed in
    // `poolStats` yet this render, and after it does nothing is "seen".
    sampleCache.current[activeMod] = drawCheckSet(activeMod, new Map());
    bump();
    document.getElementById("grammar-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Module-level navigation (top tabs, prev/next-module buttons): switches
  // to that module and scrolls to the module tabs, not the very top of the
  // page — jumping past the intro paragraph every time you switch modules
  // is what made this feel like it was "going to the top" on every click.
  function goToModule(i) {
    setActivePoint(firstPointIndexOfModule(i));
    document.getElementById("grammar-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Point-level navigation (the floating nav): jumps straight to one
  // specific lesson's card, switching module first if it's elsewhere.
  useEffect(() => {
    if (pendingScrollId.current) {
      const id = pendingScrollId.current;
      pendingScrollId.current = null;
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [activeMod]);

  function goToPoint(flatIdx) {
    const target = ALL_POINTS[flatIdx];
    const id = "gpt-" + target.mi + "-" + target.pi;
    const sameModule = target.mi === activeMod;
    setActivePoint(flatIdx);
    if (sameModule) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      pendingScrollId.current = id;
    }
  }

  // Scroll-spy: as you read down a module, the floating nav follows along
  // instead of only moving when you click it. The "current" lesson is the
  // last card whose top has passed a line a third of the way down the
  // viewport — that reads as the one you're actually looking at.
  useEffect(() => {
    if (!isActive) return;
    let queued = false;
    function sync() {
      queued = false;
      const line = window.innerHeight / 3;
      let best = null;
      mod.points.forEach((_, pi) => {
        const top = document.getElementById("gpt-" + activeMod + "-" + pi)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line) best = pi;
      });
      if (best === null) best = 0;
      const flatIdx = ALL_POINTS.findIndex((p) => p.mi === activeMod && p.pi === best);
      // Only ever moves the marker; never scrolls, or it would fight the user.
      if (flatIdx >= 0) setActivePoint((cur) => (cur === flatIdx ? cur : flatIdx));
    }
    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(sync);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    sync();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isActive, activeMod, mod]);

  // Search results land here as {mi, pi} — jump straight to that point,
  // same as clicking it in the floating nav.
  useEffect(() => {
    if (!jumpTarget) return;
    const flatIdx = ALL_POINTS.findIndex((p) => p.mi === jumpTarget.mi && p.pi === jumpTarget.pi);
    if (flatIdx >= 0) goToPoint(flatIdx);
  }, [jumpTarget]);

  return (
    <>
      <div className="section-head">
        <div className="eyebrow-jp">文法総復習</div>
        <h1>Grammar Deep-Dive</h1>
        <p>{grammarModules.reduce((n, m) => n + m.points.length, 0)} points across {grammarModules.length} modules, organized by function rather than by textbook chapter — because that's how the JLPT actually tests you: it mixes lessons together and checks whether you can tell similar patterns apart. Pick a module below; each one stays on its own tab so a study session never turns into one giant scroll. Source tags point back to roughly where each point lives in Minna no Nihongo (MNN), Genki, and Sou Matome N4 — lesson numbers are approximate cross-references, not exact page citations.</p>
      </div>

      <div className="modjump modjump-rich" id="grammar-tabs">
        {grammarModules.map((m, i) => (
          <button key={i} className={i === activeMod ? "active" : ""} onClick={() => goToModule(i)}>
            <span className="mj-jp"><span className="mj-num">{kanjiNum(m.num)}</span>{m.jpTitle}</span>
            {m.reading && m.reading !== m.jpTitle && <span className="mj-reading">{m.reading}</span>}
            <span className="mj-en">{m.enTitle}</span>
            <ModuleTabPct mi={i} />
          </button>
        ))}
      </div>

      <div className="modhead">
        <div className="modhead-titles">
          <h2 className="modtitle"><span className="modnum">{kanjiNum(mod.num)}</span> {mod.jpTitle}</h2>
          {mod.reading && mod.reading !== mod.jpTitle && <div className="modtitle-reading">{mod.reading}</div>}
          <div className="modtitle-en">{mod.enTitle}</div>
        </div>
        <ModuleProgress mi={activeMod} />
      </div>
      {mod.points.map((pt, pi) => (
        <GrammarCard key={pi} mod={mod} mi={activeMod} pt={pt} pi={pi} />
      ))}

      <ModuleCheck mi={activeMod} sample={moduleSample} onNewSet={newModuleSet} onResetModule={resetModule} />

      <div className="modjump" style={{ marginTop: 12, justifyContent: "space-between" }}>
        <button disabled={activeMod === 0} style={{ visibility: activeMod === 0 ? "hidden" : "visible" }} onClick={() => goToModule(activeMod - 1)}>← Previous module</button>
        <button disabled={activeMod === grammarModules.length - 1} style={{ visibility: activeMod === grammarModules.length - 1 ? "hidden" : "visible" }} onClick={() => goToModule(activeMod + 1)}>Next module →</button>
      </div>

      <FloatingNav items={NAV_ITEMS} activeIndex={activePoint} onGo={goToPoint} />
    </>
  );
}
