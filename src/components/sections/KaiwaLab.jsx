import { useState } from "react";
import { kaiwaTips, phraseBank, kaiwaScenarios, countPhrases } from "../../data/index.js";
import JpText from "../JpText.jsx";
import Quiz from "../Quiz.jsx";
import SpeakButton from "../SpeakButton.jsx";

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

export default function KaiwaLab() {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const cat = CATEGORIES.find((c) => c.id === activeCat);
  const scenariosInCat = scenariosWithIndex.filter(({ sc }) => sc.category === activeCat);

  function goToCategory(id) {
    setActiveCat(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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

      <h2 className="modtitle"><span className="modnum">フ</span> Phrase Bank</h2>
      <div className="modtitle-en">{countPhrases()} phrases in {phraseBank.length} groups — grouped by what the phrase does, because that is how you retrieve it mid-conversation</div>

      <div className="pb-nav">
        {phraseBank.map((g, gi) => (
          <button key={gi} onClick={() => document.getElementById("pb-" + gi)?.scrollIntoView({ behavior: "smooth", block: "start" })}>{g.cat}</button>
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

      <h2 className="modtitle"><span className="modnum">場</span> Scenario Scripts</h2>
      <div className="modtitle-en">{kaiwaScenarios.length} scripts in {CATEGORIES.length} groups — pick a group below, then read both parts out loud and try to reconstruct the Japanese from the English</div>

      <div className="modjump modjump-rich">
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
            <div className="dialogue-box" style={{ marginBottom: 0 }}>
              {sc.lines.map((d, li) => (
                <div key={li} className="dline">
                  <div className="speaker" style={{ background: "var(--indigo)" }}>{d.who}</div>
                  <div className="dtext">
                    <div className="jp-row">
                      <JpText tag="span" className="jp" html={d.jp} />
                      <SpeakButton html={d.jp} />
                    </div>
                    <div className="en">{d.en}</div>
                  </div>
                </div>
              ))}
            </div>

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
    </>
  );
}
