import { useState } from "react";
import { useSettings } from "../context/SettingsContext.jsx";
import { useQuiz } from "../context/QuizContext.jsx";
import SearchBox from "./SearchBox.jsx";

const NAV = [
  { id: "overview", mk: "概", label: "Overview" },
  { id: "grammar", mk: "文", label: "Grammar Deep-Dive" },
  { id: "kanji", mk: "漢", label: "Kanji Focus" },
  { id: "reading", mk: "読", label: "Reading Lab" },
  { id: "kaiwa", mk: "話", label: "Kaiwa Lab" },
  { id: "quiz", mk: "力", label: "Quiz Center" },
  { id: "mistakes", mk: "直", label: "Review Mistakes" },
  { id: "ai", mk: "練", label: "Renshuu with AI", soon: true },
];

const JP_FONTS = [
  { v: "mincho", label: "明朝 Mincho" },
  { v: "gothic", label: "ゴシック Gothic" },
];

const FONT_SCALE_MIN = 0.85;
const FONT_SCALE_MAX = 1.4;
const FONT_SCALE_STEP = 0.05;
const clampScale = (v) => Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, Math.round(v * 100) / 100));

export default function Sidebar({ active, onNavigate, mobileOpen, onCloseMobile, onSearchJump }) {
  const { furigana, setFurigana, dark, setDark, fontScale, setFontScale, jpFont, setJpFont } = useSettings();
  const { stats, resetAll } = useQuiz();
  const pct = stats.total ? Math.round((stats.answeredCount / stats.total) * 100) : 0;
  // Wiping every score is destructive and can't be undone, so the button
  // arms itself first rather than firing on a single stray click.
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <>
      <aside className={"sidebar" + (mobileOpen ? " open" : "")}>
        <div className="brand">
          <span className="brand-jp">習得</span>
          <span className="brand-latin">
            <span className="brand-name">Shuutoku</span>
            <span className="brand-sub">N4 Review Handbook</span>
          </span>
        </div>
        <div className="sidebar-scroll">
          <div className="searchbox-wrap">
            <SearchBox onJump={(entry) => { onSearchJump(entry); onCloseMobile(); }} />
          </div>
          <nav className="mainnav">
            <div className="navgroup-label">MENU</div>
            {NAV.map((n) => (
              <button
                key={n.id}
                className={"navlink" + (active === n.id ? " active" : "")}
                onClick={() => { onNavigate(n.id); onCloseMobile(); }}
              >
                <span className="mk">{n.mk}</span> {n.label}
                {n.soon && <span className="soon-badge">soon</span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="settings-panel">
          <div className="stitle">SETTINGS ・ 設定</div>
          <div className="setting-row">
            <span>Furigana ふりがな</span>
            <button className={"switch" + (furigana ? " on" : "")} onClick={() => setFurigana(!furigana)} aria-label="Toggle furigana" />
          </div>
          <div className="setting-row">
            <span>Dark mode</span>
            <button className={"switch" + (dark ? " on" : "")} onClick={() => setDark(!dark)} aria-label="Toggle dark mode" />
          </div>
          <div className="setting-row" style={{ display: "block" }}>
            <span style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              Text size <span className="setting-value">{Math.round(fontScale * 100)}%</span>
            </span>
            <div className="textsize-controls">
              <button
                onClick={() => setFontScale(clampScale(fontScale - FONT_SCALE_STEP))}
                disabled={fontScale <= FONT_SCALE_MIN}
                aria-label="Decrease text size"
              >−</button>
              <button className="ts-reset" onClick={() => setFontScale(1)} aria-label="Reset text size to 100%">Aa</button>
              <button
                onClick={() => setFontScale(clampScale(fontScale + FONT_SCALE_STEP))}
                disabled={fontScale >= FONT_SCALE_MAX}
                aria-label="Increase text size"
              >+</button>
            </div>
          </div>
          <div className="setting-row" style={{ display: "block" }}>
            <span style={{ display: "block", marginBottom: 6 }}>Japanese text style</span>
            <div className="fontsize-controls">
              {JP_FONTS.map((f) => (
                <button key={f.v} className={jpFont === f.v ? "active" : ""} onClick={() => setJpFont(f.v)}>{f.label}</button>
              ))}
            </div>
          </div>
          <div className="progress-mini">
            Quiz progress: <span>{stats.answeredCount} / {stats.total}</span>
            <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: pct + "%" }} /></div>
          </div>

          <button
            className={"reset-all" + (confirmReset ? " armed" : "")}
            onClick={() => {
              if (!confirmReset) { setConfirmReset(true); return; }
              resetAll();
              setConfirmReset(false);
            }}
            onBlur={() => setConfirmReset(false)}
          >
            {confirmReset ? "Tap again to erase everything" : "Reset all progress"}
          </button>
        </div>
        <div className="sidebar-footer">
          © 2026 Shuutoku ・{" "}
          <a href="https://github.com/franzdarren/shuutoku" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </aside>
      <div className={"scrim" + (mobileOpen ? " show" : "")} onClick={onCloseMobile} />
    </>
  );
}
