import { useEffect, useState } from "react";
import { kaiwaTips, phraseBank, kaiwaScenarios, countPhrases } from "../../data/index.js";
import JpText from "../JpText.jsx";
import Quiz from "../Quiz.jsx";
import SpeakButton from "../SpeakButton.jsx";
import Dialogue from "../Dialogue.jsx";
import FloatingNav from "../FloatingNav.jsx";

// Scenario titles carry inline <ruby> furigana; for a plain-text nav label,
// drop the reading (<rt>...</rt>) before stripping the remaining tags —
// otherwise the base kanji and its reading get concatenated together.
function plainTitle(html) {
  return html.replace(/<rt>.*?<\/rt>/g, "").replace(/<[^>]+>/g, "");
}

const CATEGORIES = [
  { id: "arrival", jp: "到着・交通", en: "Arrival & getting around" },
  { id: "food", jp: "食事", en: "Food & drink" },
  { id: "errands", jp: "買い物・用事", en: "Shopping & errands" },
  { id: "trouble", jp: "困った時", en: "Handling problems" },
  { id: "social", jp: "社交・雑談", en: "Socializing & small talk" },
  { id: "daily", jp: "生活・仕事", en: "Daily life & work" },
];

// Keep each scenario's original index (used for stable quiz ids and anchor
// ids) attached even after grouping/filtering by category.
const scenariosWithIndex = kaiwaScenarios.map((sc, i) => ({ sc, i }));

const NAV_ITEMS = CATEGORIES.map((c) => ({ label: c.jp }));
const PB_NAV_ITEMS = phraseBank.map((g) => ({ label: g.cat }));

export default function KaiwaLab({ isActive }) {
  const [view, setView] = useState("phrases");
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [activeGroup, setActiveGroup] = useState(0);
  const activeCatIndex = CATEGORIES.findIndex((c) => c.id === activeCat);
  const cat = CATEGORIES[activeCatIndex];
  const scenariosInCat = scenariosWithIndex.filter(({ sc }) => sc.category === activeCat);

  // Scrolls to the tabs themselves, not the very top of the page — jumping
  // past the intro paragraph and tip cards on every click is what made
  // switching views feel like it snapped "all the way to the top".
  function switchView(v) {
    setView(v);
    document.getElementById("kaiwa-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goToCategory(id) {
    setActiveCat(id);
    document.getElementById("kaiwa-cat-nav")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goToCategoryIndex(i) {
    goToCategory(CATEGORIES[i].id);
  }

  function goToGroup(i) {
    setActiveGroup(i);
    document.getElementById("pb-" + i)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Keeps the floating nav in step with the phrase group you've scrolled to.
  useEffect(() => {
    if (!isActive || view !== "phrases") return;
    let queued = false;
    function sync() {
      queued = false;
      const line = window.innerHeight / 3;
      let best = 0;
      phraseBank.forEach((_, gi) => {
        const top = document.getElementById("pb-" + gi)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line) best = gi;
      });
      setActiveGroup((cur) => (cur === best ? cur : best));
    }
    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(sync);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    sync();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isActive, view]);

  return (
    <>
      <div className="section-head">
        <div className="eyebrow-jp">会話ラボ</div>
        <h1>Kaiwa Lab</h1>
        <p>Grammar accuracy and conversation fluency are genuinely different skills — it is completely normal to be strong in one and shaky in the other. This section is built around what you'll actually need in Japan: {kaiwaScenarios.length} real scenarios covering arrival, getting around, shops, food, health, work and small talk; {countPhrases()} phrases grouped by the job they do; and role-play notes for both sides of every conversation. Highlight any word in a script to look up its meaning and reading.</p>
      </div>

      <div className="tipgrid">
        {kaiwaTips.map((t, i) => (
          <div key={i} className="tipcard">
            <div className="ttitle">{t.title}</div>
            <p>{t.body}</p>
          </div>
        ))}
      </div>

      {/* Two big halves that were previously one very long scroll — the
          phrase reference and the scripted scenarios are used at different
          times, so they get their own views rather than stacking. */}
      <div className="viewtabs" role="tablist" id="kaiwa-tabs">
        <button role="tab" aria-selected={view === "phrases"} className={view === "phrases" ? "active" : ""} onClick={() => switchView("phrases")}>
          <span className="vt-jp">フレーズ集</span>
          <span className="vt-en">Phrase Bank · {countPhrases()}</span>
        </button>
        <button role="tab" aria-selected={view === "scenarios"} className={view === "scenarios" ? "active" : ""} onClick={() => switchView("scenarios")}>
          <span className="vt-jp">場面別スクリプト</span>
          <span className="vt-en">Scenario Scripts · {kaiwaScenarios.length}</span>
        </button>
      </div>

      {view === "phrases" && <>
      <div className="modtitle-en">{countPhrases()} phrases in {phraseBank.length} groups — grouped by what the phrase does, because that is how you retrieve it mid-conversation</div>

      <div className="pb-nav">
        {phraseBank.map((g, gi) => (
          <button key={gi} onClick={() => document.getElementById("pb-" + gi)?.scrollIntoView({ behavior: "smooth", block: "start" })}>
            <span className="pbn-jp">{g.cat}</span>
            <span className="pbn-en">{g.catEn}</span>
          </button>
        ))}
      </div>

      {phraseBank.map((g, gi) => (
        <div key={gi} className="pb-group" id={"pb-" + gi}>
          <div className="pb-cat"><span className="jp">{g.cat}</span><span className="en">{g.catEn}</span></div>
          <div className="phrasebank">
            {g.items.map((p, pi) => (
              <div key={pi} className="phrase">
                <div className="jp-row">
                  <JpText tag="span" className="pjp" html={p.jp} />
                  <SpeakButton html={p.jp} />
                </div>
                <div className="pen">{p.en}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      </>}

      {view === "scenarios" && <>
      <div className="modtitle-en">{kaiwaScenarios.length} scripts in {CATEGORIES.length} groups — pick a group below, then read both parts out loud and try to reconstruct the Japanese from the English</div>

      <div className="modjump modjump-rich" id="kaiwa-cat-nav">
        {CATEGORIES.map((c) => (
          <button key={c.id} className={c.id === activeCat ? "active" : ""} onClick={() => goToCategory(c.id)}>
            <span className="mj-jp">{c.jp}</span>
            <span className="mj-en">{c.en}</span>
          </button>
        ))}
      </div>

      <div className="modjump" style={{ marginBottom: 30 }}>
        {scenariosInCat.map(({ sc, i }) => (
          <button key={i} onClick={() => document.getElementById("sc-" + i)?.scrollIntoView({ behavior: "smooth", block: "start" })}>{plainTitle(sc.jp)}</button>
        ))}
      </div>

      <div className="modtitle-en" style={{ marginBottom: 12 }}>{cat.jp} — {cat.en} ({scenariosInCat.length} scenarios)</div>

      {scenariosInCat.map(({ sc, i }) => (
        <div key={i} className="scenario-card" id={"sc-" + i}>
          <div className="scenario-head">
            <JpText tag="span" className="sjp" html={(i + 1) + ". " + sc.jp} />
            <span className="sen">{sc.en}</span>
          </div>
          <div className="scenario-body">
            <div className="scenario-setup">{sc.setup}</div>
            <Dialogue lines={sc.lines} accent="var(--indigo)" style={{ marginBottom: 0 }} />

            {sc.keyPhrases?.length > 0 && (
              <div className="keyphrases">
                <div className="kplabel">TAKE THESE WITH YOU</div>
                {sc.keyPhrases.map((p, pi) => (
                  <div key={pi} className="kpline">
                    <JpText tag="span" className="kpjp" html={p.jp} />
                    <SpeakButton html={p.jp} />
                    <span className="kpen">{p.en}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="roleplay-note"><b>Role-play it —</b> {sc.roleplay}</div>
            <Quiz idPrefix={"kaiwa" + i} items={sc.quiz} />
          </div>
        </div>
      ))}
      </>}

      {/* The floating nav follows whichever half you're in: phrase groups
          while browsing the bank, scenario categories while reading scripts. */}
      {view === "phrases"
        ? <FloatingNav items={PB_NAV_ITEMS} activeIndex={activeGroup} onGo={goToGroup} />
        : <FloatingNav items={NAV_ITEMS} activeIndex={activeCatIndex} onGo={goToCategoryIndex} />}
    </>
  );
}
