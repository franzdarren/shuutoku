import { useSettings } from "../context/SettingsContext.jsx";
import { useQuiz } from "../context/QuizContext.jsx";

const NAV = [
  { id: "overview", mk: "概", label: "Overview" },
  { id: "grammar", mk: "文", label: "Grammar Deep-Dive" },
  { id: "kanji", mk: "漢", label: "Kanji Focus" },
  { id: "reading", mk: "読", label: "Reading Lab" },
  { id: "kaiwa", mk: "話", label: "Kaiwa Lab" },
  { id: "quiz", mk: "力", label: "Quiz Center" },
  { id: "ai", mk: "練", label: "Renshuu with AI", soon: true },
];

const SIZES = [
  { v: 0.9, label: "A-" },
  { v: 1, label: "A" },
  { v: 1.18, label: "A+" },
];

const JP_FONTS = [
  { v: "mincho", label: "明朝 Mincho" },
  { v: "gothic", label: "ゴシック Gothic" },
];

export default function Sidebar({ active, onNavigate, mobileOpen, onCloseMobile }) {
  const { furigana, setFurigana, dark, setDark, fontScale, setFontScale, jpFont, setJpFont } = useSettings();
  const { stats } = useQuiz();
  const pct = stats.total ? Math.round((stats.answeredCount / stats.total) * 100) : 0;

  return (
    <>
      <aside className={"sidebar" + (mobileOpen ? " open" : "")}>
        <div className="brand">
          <div className="jp">習得 Shuutoku</div>
          <div className="en">Your N4 Review Handbook</div>
        </div>
        <div className="sidebar-scroll">
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
            <span style={{ display: "block", marginBottom: 6 }}>Text size</span>
            <div className="fontsize-controls">
              {SIZES.map((s) => (
                <button key={s.v} className={fontScale === s.v ? "active" : ""} onClick={() => setFontScale(s.v)}>{s.label}</button>
              ))}
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
