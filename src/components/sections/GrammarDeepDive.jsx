import { useEffect, useReducer, useRef, useState } from "react";
import { grammarModules } from "../../data/index.js";
import { useQuiz } from "../../context/QuizContext.jsx";
import { drawSample } from "../../lib/quiz.js";
import JpText from "../JpText.jsx";
import Quiz from "../Quiz.jsx";
import SpeakButton from "../SpeakButton.jsx";
import FloatingNav from "../FloatingNav.jsx";

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

      {pt.formation?.length > 0 && (
        <div className="formation-box">
          <div className="flabel">FORMATION</div>
          {pt.formation.map((f, i) => <JpText key={i} tag="div" className="fline" html={f} />)}
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

      {pt.dialogue?.length > 0 && (
        <div className="dialogue-box">
          <div className="dlabel">KAIWA SAMPLE</div>
          {pt.dialogue.map((d, i) => (
            <div key={i} className="dline">
              <div className="speaker" style={{ background: accent }}>{d.who}</div>
              <div className="dtext">
                <div className="jp-row">
                  <JpText tag="span" className="jp" html={d.jp} />
                  <SpeakButton html={d.jp} />
                </div>
                <div className="en">{d.en}</div>
              </div>
            </div>
          ))}
          {pt.tip && <div className="kaiwa-tip"><b>Tip —</b> {pt.tip}</div>}
        </div>
      )}

      {pt.quiz?.length > 0 && <Quiz idPrefix={pid} items={pt.quiz} />}
    </div>
  );
}

/** A 10-question checkpoint drawn from this module's own point quizzes.
 *  80% is called a "pass", but it's purely a visual signal — there is no
 *  gate, you can move to any module regardless of the result. */
function ModuleCheck({ mi, mod, sample, onNewSet }) {
  const { answered } = useQuiz();
  const total = sample.length;
  if (!total) return null;

  let correct = 0, answeredCount = 0;
  for (let i = 0; i < total; i++) {
    const qid = "modcheck" + mi + "-q" + i;
    if (answered.has(qid)) {
      answeredCount++;
      if (answered.get(qid)) correct++;
    }
  }
  const done = answeredCount === total;
  const pct = done ? correct / total : null;
  const passed = pct !== null && pct >= 0.8;

  return (
    <div className="modcheck">
      <div className="modcheck-head">
        <div>
          <div className="modcheck-title">Module Check</div>
          <div className="modcheck-sub">{total} questions from this module — 80% is a "pass", but it's just a checkpoint. Move on to any module whenever you like, pass or not.</div>
        </div>
        <button className="qc-reset" onClick={onNewSet}>New random set</button>
      </div>
      {done && (
        <div className={"modcheck-result " + (passed ? "pass" : "retry")}>
          {passed ? "✓ Pass" : "Below 80%"} — {correct} / {total} correct ({Math.round(pct * 100)}%)
        </div>
      )}
      <Quiz idPrefix={"modcheck" + mi} items={sample} label="MODULE CHECK" />
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

export default function GrammarDeepDive() {
  const [activePoint, setActivePoint] = useState(0);
  const activeMod = ALL_POINTS[activePoint].mi;
  const mod = grammarModules[activeMod];
  const { clearQuestions } = useQuiz();
  const [, bump] = useReducer((c) => c + 1, 0);
  const sampleCache = useRef({});
  const pendingScrollId = useRef(null);

  if (!sampleCache.current[activeMod]) {
    sampleCache.current[activeMod] = drawSample(mod.points.flatMap((p) => p.quiz || []));
  }
  const moduleSample = sampleCache.current[activeMod];

  function newModuleSet() {
    const ids = Array.from({ length: moduleSample.length }, (_, i) => "modcheck" + activeMod + "-q" + i);
    clearQuestions(ids);
    sampleCache.current[activeMod] = drawSample(mod.points.flatMap((p) => p.quiz || []));
    bump();
  }

  // Module-level navigation (top tabs, prev/next-module buttons): switches
  // the whole page to that module and scrolls to its top.
  function goToModule(i) {
    setActivePoint(firstPointIndexOfModule(i));
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <>
      <div className="section-head">
        <div className="eyebrow-jp">文法総復習</div>
        <h1>Grammar Deep-Dive</h1>
        <p>{grammarModules.reduce((n, m) => n + m.points.length, 0)} points across {grammarModules.length} modules, organized by function rather than by textbook chapter — because that's how the JLPT actually tests you: it mixes lessons together and checks whether you can tell similar patterns apart. Pick a module below; each one stays on its own tab so a study session never turns into one giant scroll. Source tags point back to roughly where each point lives in Minna no Nihongo (MNN), Genki, and Sou Matome N4 — lesson numbers are approximate cross-references, not exact page citations.</p>
      </div>

      <div className="modjump modjump-rich">
        {grammarModules.map((m, i) => (
          <button key={i} className={i === activeMod ? "active" : ""} onClick={() => goToModule(i)}>
            <span className="mj-jp">{m.num}. {m.jpTitle}</span>
            {m.reading && m.reading !== m.jpTitle && <span className="mj-reading">{m.reading}</span>}
            <span className="mj-en">{m.enTitle}</span>
          </button>
        ))}
      </div>

      <h2 className="modtitle"><span className="modnum">{mod.num}</span> {mod.jpTitle}</h2>
      <div className="modtitle-en">{mod.enTitle}</div>
      {mod.points.map((pt, pi) => (
        <GrammarCard key={pi} mod={mod} mi={activeMod} pt={pt} pi={pi} />
      ))}

      <ModuleCheck mi={activeMod} mod={mod} sample={moduleSample} onNewSet={newModuleSet} />

      <div className="modjump" style={{ marginTop: 12, justifyContent: "space-between" }}>
        <button disabled={activeMod === 0} style={{ visibility: activeMod === 0 ? "hidden" : "visible" }} onClick={() => goToModule(activeMod - 1)}>← Previous module</button>
        <button disabled={activeMod === grammarModules.length - 1} style={{ visibility: activeMod === grammarModules.length - 1 ? "hidden" : "visible" }} onClick={() => goToModule(activeMod + 1)}>Next module →</button>
      </div>

      <FloatingNav items={NAV_ITEMS} activeIndex={activePoint} onGo={goToPoint} />
    </>
  );
}
