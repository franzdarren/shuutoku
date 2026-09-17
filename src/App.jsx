import { lazy, Suspense, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import VocabTooltip from "./components/VocabTooltip.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { QuizProvider } from "./context/QuizContext.jsx";
import { LookupProvider } from "./context/LookupContext.jsx";
import { buildLocalIndex } from "./lib/dictionary.js";

/* Sections load on first visit rather than all at once. Each one does real
   work at module scope — GrammarDeepDive flattens 63 points, KanjiFocus and
   KaiwaLab build their own lookup tables — and doing all of that before the
   first paint was work nobody had asked for yet. */
const SECTIONS = [
  { id: "overview", Comp: lazy(() => import("./components/sections/Overview.jsx")) },
  { id: "grammar", Comp: lazy(() => import("./components/sections/GrammarDeepDive.jsx")) },
  { id: "kanji", Comp: lazy(() => import("./components/sections/KanjiFocus.jsx")) },
  { id: "reading", Comp: lazy(() => import("./components/sections/ReadingLab.jsx")) },
  { id: "kaiwa", Comp: lazy(() => import("./components/sections/KaiwaLab.jsx")) },
  { id: "quiz", Comp: lazy(() => import("./components/sections/QuizCenter.jsx")) },
  { id: "exam", Comp: lazy(() => import("./components/sections/MockExam.jsx")) },
  { id: "mistakes", Comp: lazy(() => import("./components/sections/ReviewMistakes.jsx")) },
  { id: "ai", Comp: lazy(() => import("./components/sections/RenshuuAI.jsx")) },
];

export default function App() {
  const [active, setActive] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTarget, setSearchTarget] = useState(null);
  /* Once a section has been opened it stays mounted, so its scroll position,
     open module and filters survive tab switches — Review Mistakes in
     particular relies on siblings staying alive. Sections you've never
     opened simply aren't rendered yet. */
  const [visited, setVisited] = useState(() => new Set(["overview"]));
  const [totalQuizItems, setTotalQuizItems] = useState(0);

  /* The lesson content is ~570 kB, and nothing on the first screen needs it —
     so it's fetched after mount rather than blocking the first paint. The
     sidebar's progress denominator fills in when it lands; Sidebar already
     renders 0 safely. */
  useEffect(() => {
    let cancelled = false;
    import("./data/index.js").then((data) => {
      if (cancelled) return;
      buildLocalIndex({ readingPassages: data.readingPassages, kanjiFocus: data.kanjiFocus });
      setTotalQuizItems(data.countAllQuizItems());
    });
    return () => { cancelled = true; };
  }, []);

  function navigate(id) {
    setActive(id);
    setVisited((v) => (v.has(id) ? v : new Set(v).add(id)));
    window.scrollTo(0, 0);
  }

  // A search result's `type` ("grammar" | "kanji") happens to match the
  // section id it belongs to, so the same jump target can be handed to
  // whichever section is active — each one only acts on it if it's theirs.
  function handleSearchJump(entry) {
    navigate(entry.type);
    setSearchTarget({ ...entry, key: Date.now() });
  }

  return (
    <SettingsProvider>
      <QuizProvider total={totalQuizItems}>
        <LookupProvider>
          <header className="mobilebar">
            <button className="menubtn" onClick={() => setMobileOpen(true)} aria-label="Open menu" aria-expanded={mobileOpen}>☰</button>
            <span className="mobilebar-brand">習得</span>
          </header>
          <div className="shell">
            <Sidebar active={active} onNavigate={navigate} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} onSearchJump={handleSearchJump} />
            <main className="content">
              <div className="section-inner">
                {SECTIONS.filter(({ id }) => visited.has(id)).map(({ id, Comp }) => (
                  <section key={id} className={"section" + (active === id ? " active" : "")}>
                    <Suspense fallback={<div className="section-loading">読み込み中…</div>}>
                      <Comp jumpTarget={searchTarget && searchTarget.type === id ? searchTarget : null} isActive={active === id} onNavigate={navigate} />
                    </Suspense>
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
