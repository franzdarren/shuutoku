import { useState } from "react";
import { grammarModules } from "../../data/index.js";
import JpText from "../JpText.jsx";
import Quiz from "../Quiz.jsx";

function GrammarCard({ mod, mi, pt, pi }) {
  const accent = "var(--" + mod.accent + ")";
  const pid = "g" + mi + "-" + pi;
  return (
    <div className="gcard" style={{ "--accent": accent }}>
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
                <JpText tag="div" className="jp" html={d.jp} />
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

export default function GrammarDeepDive() {
  const [activeMod, setActiveMod] = useState(0);
  const mod = grammarModules[activeMod];

  function goToModule(i) {
    setActiveMod(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <div className="section-head">
        <div className="eyebrow-jp">文法総復習</div>
        <h1>Grammar Deep-Dive</h1>
        <p>{grammarModules.reduce((n, m) => n + m.points.length, 0)} points across {grammarModules.length} modules, organized by function rather than by textbook chapter — because that's how the JLPT actually tests you: it mixes lessons together and checks whether you can tell similar patterns apart. Pick a module below; each one stays on its own tab so a study session never turns into one giant scroll. Source tags point back to roughly where each point lives in Minna no Nihongo (MNN), Genki, and Sou Matome N4 — lesson numbers are approximate cross-references, not exact page citations.</p>
      </div>

      <div className="modjump">
        {grammarModules.map((m, i) => (
          <button key={i} className={i === activeMod ? "active" : ""} onClick={() => goToModule(i)}>
            {m.num}. {m.jpTitle}
          </button>
        ))}
      </div>

      <h2 className="modtitle"><span className="modnum">{mod.num}</span> {mod.jpTitle}</h2>
      <div className="modtitle-en">{mod.enTitle}</div>
      {mod.points.map((pt, pi) => (
        <GrammarCard key={pi} mod={mod} mi={activeMod} pt={pt} pi={pi} />
      ))}

      <div className="modjump" style={{ marginTop: 12, justifyContent: "space-between" }}>
        <button disabled={activeMod === 0} style={{ visibility: activeMod === 0 ? "hidden" : "visible" }} onClick={() => goToModule(activeMod - 1)}>← Previous module</button>
        <button disabled={activeMod === grammarModules.length - 1} style={{ visibility: activeMod === grammarModules.length - 1 ? "hidden" : "visible" }} onClick={() => goToModule(activeMod + 1)}>Next module →</button>
      </div>
    </>
  );
}
