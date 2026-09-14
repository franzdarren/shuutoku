import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import VocabTooltip from "./components/VocabTooltip.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { QuizProvider } from "./context/QuizContext.jsx";
import { LookupProvider } from "./context/LookupContext.jsx";
import { buildLocalIndex } from "./lib/dictionary.js";
import { readingPassages, kanjiFocus, countAllQuizItems } from "./data/index.js";

import Overview from "./components/sections/Overview.jsx";
import GrammarDeepDive from "./components/sections/GrammarDeepDive.jsx";
import KanjiFocus from "./components/sections/KanjiFocus.jsx";
import ReadingLab from "./components/sections/ReadingLab.jsx";
import KaiwaLab from "./components/sections/KaiwaLab.jsx";
import QuizCenter from "./components/sections/QuizCenter.jsx";
import RenshuuAI from "./components/sections/RenshuuAI.jsx";

const SECTIONS = [
  { id: "overview", Comp: Overview },
  { id: "grammar", Comp: GrammarDeepDive },
  { id: "kanji", Comp: KanjiFocus },
  { id: "reading", Comp: ReadingLab },
  { id: "kaiwa", Comp: KaiwaLab },
  { id: "quiz", Comp: QuizCenter },
  { id: "ai", Comp: RenshuuAI },
];

const TOTAL_QUIZ_ITEMS = countAllQuizItems();

export default function App() {
  const [active, setActive] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    buildLocalIndex({ readingPassages, kanjiFocus });
  }, []);

  function navigate(id) {
    setActive(id);
    window.scrollTo(0, 0);
  }

  return (
    <SettingsProvider>
      <QuizProvider total={TOTAL_QUIZ_ITEMS}>
        <LookupProvider>
          <button className="menubtn" onClick={() => setMobileOpen(true)} aria-label="Menu">☰</button>
          <div className="shell">
            <Sidebar active={active} onNavigate={navigate} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
            <main className="content">
              <div className="section-inner">
                {SECTIONS.map(({ id, Comp }) => (
                  <section key={id} className={"section" + (active === id ? " active" : "")}>
                    <Comp />
                  </section>
                ))}
              </div>
            </main>
          </div>
          <VocabTooltip />
        </LookupProvider>
      </QuizProvider>
    </SettingsProvider>
  );
}
