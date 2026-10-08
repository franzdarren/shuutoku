import { useEffect, useRef, useState } from "react";
import words from "../../data/dojo-words.json";
import {
  FORMS, FORM_BY_ID, conjugate, explain, formApplies, isVerb, isGroupTrap, classLabel, rubyFor,
} from "../../lib/conjugate.js";
import { romajiToKana, toHiragana } from "../../lib/kana.js";
import JpText from "../JpText.jsx";

const SETTINGS_KEY = "n4.dojoSettings";
const STATS_KEY = "n4.dojoStats";

const TYPES = [
  { id: "verb", label: "Verbs" },
  { id: "i", label: "い-adjectives" },
  { id: "na", label: "な-adjectives" },
];
const FORM_GROUPS = [
  { id: "basic", label: "Basics" },
  { id: "n4", label: "N4 forms" },
];

const typeOf = (w) => (isVerb(w) ? "verb" : w.type);

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode etc. */ }
}

const DEFAULT_SETTINGS = { types: TYPES.map((t) => t.id), forms: FORMS.map((f) => f.id) };
const DEFAULT_STATS = { forms: {}, best: 0 };

/** Forms you get wrong come up more often. Accuracy is smoothed (+1/+2) so
 *  an untried form starts at 50% rather than at 0% or 100%, and the weight
 *  runs from 1 (always right) to 3 (always wrong), never to zero, so a form
 *  you've mastered still turns up now and then. */
function formWeight(stats, id) {
  const [right, total] = stats.forms[id] || [0, 0];
  return 1 + 2 * (1 - (right + 1) / (total + 2));
}

function pickWeighted(items, weightOf) {
  const total = items.reduce((n, x) => n + weightOf(x), 0);
  let r = Math.random() * total;
  for (const x of items) {
    r -= weightOf(x);
    if (r <= 0) return x;
  }
  return items[items.length - 1];
}

function drawCard(settings, stats, prevWord) {
  const pool = words.filter((w) => settings.types.includes(typeOf(w)));
  const forms = FORMS.filter((f) => settings.forms.includes(f.id) && pool.some((w) => formApplies(f, w)));
  if (!forms.length) return null;
  const form = pickWeighted(forms, (f) => formWeight(stats, f.id));
  let candidates = pool.filter((w) => formApplies(form, w) && w !== prevWord);
  if (!candidates.length) candidates = pool.filter((w) => formApplies(form, w));
  const word = candidates[Math.floor(Math.random() * candidates.length)];
  return { word, form: form.id };
}

/** What you typed, reduced to plain hiragana: romaji converted, katakana
 *  folded, spaces and end punctuation dropped. Kanji (from an IME) passes
 *  through untouched and is compared against the kanji spelling. */
function normalize(s) {
  return toHiragana(romajiToKana(s.trim(), true)).replace(/[\s。．.!！?？]/g, "");
}

/** A wrong answer that's actually a real form of the same word (you gave
 *  the passive when it asked for the potential) is the most useful thing to
 *  point out, since it means the mechanics are fine and only the form name
 *  got crossed. */
function diagnose(word, formId, given) {
  if (word.type === "v2" && formId === "potential" && given === word.kana.slice(0, -1) + "れる") {
    return "That's the ら-less potential (ら抜き言葉). You'll hear it constantly in speech, but the test and written Japanese want the full られる.";
  }
  for (const f of FORMS) {
    if (f.id === formId || !formApplies(f, word)) continue;
    const other = conjugate(word, f.id);
    if (other.kana.includes(given) || other.kj.includes(given)) {
      return `That's the ${f.label.toLowerCase()} form (${f.jp}), not the ${FORM_BY_ID[formId].label.toLowerCase()}.`;
    }
  }
  // Crossing the two verb groups is the classic slip: 帰る as かえない,
  // or 食べる as たべらない.
  if (word.type === "v1" && word.kana.endsWith("る") && conjugate({ ...word, type: "v2" }, formId).kana.includes(given)) {
    return `That's how a Group 2 verb would conjugate, but ${word.kj} is Group 1.`;
  }
  if (word.type === "v2" && conjugate({ ...word, type: "v1" }, formId).kana.includes(given)) {
    return `That's how a Group 1 verb would conjugate, but ${word.kj} is Group 2.`;
  }
  return null;
}

export default function ConjugationDojo({ isActive }) {
  const [settings, setSettings] = useState(() => load(SETTINGS_KEY, DEFAULT_SETTINGS));
  const [stats, setStats] = useState(() => load(STATS_KEY, DEFAULT_STATS));
  const [card, setCard] = useState(() => drawCard(settings, stats, null));
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [session, setSession] = useState({ right: 0, total: 0, streak: 0 });
  const inputRef = useRef(null);
  const composing = useRef(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => save(SETTINGS_KEY, settings), [settings]);
  useEffect(() => save(STATS_KEY, stats), [stats]);

  // Keep the cursor in the box between questions on a desktop. On a phone
  // that would pop the keyboard up over the card every time the section
  // opened, so only a fine pointer gets it.
  useEffect(() => {
    if (!isActive) return;
    if (window.matchMedia?.("(pointer: fine)").matches) inputRef.current?.focus({ preventScroll: true });
  }, [isActive, card]);

  function next(nextSettings = settings, nextStats = stats) {
    setCard(drawCard(nextSettings, nextStats, card?.word));
    setInput("");
    setResult(null);
  }

  function record(correct) {
    const [right, total] = stats.forms[card.form] || [0, 0];
    const streak = correct ? session.streak + 1 : 0;
    const nextStats = {
      forms: { ...stats.forms, [card.form]: [right + (correct ? 1 : 0), total + 1] },
      best: Math.max(stats.best, streak),
    };
    setStats(nextStats);
    setSession({ right: session.right + (correct ? 1 : 0), total: session.total + 1, streak });
  }

  function check() {
    const given = normalize(input);
    if (!given) return;
    const ans = conjugate(card.word, card.form);
    const correct = ans.kana.includes(given) || ans.kj.includes(given);
    setInput(given);
    setResult({ correct, given, note: correct ? null : diagnose(card.word, card.form, given) });
    record(correct);
  }

  function reveal() {
    setResult({ correct: false, given: "", revealed: true });
    record(false);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (result) next();
    else check();
  }

  function onChange(e) {
    const v = e.target.value;
    setInput(composing.current ? v : romajiToKana(v));
  }

  function updateSettings(patch) {
    const s = { ...settings, ...patch };
    setSettings(s);
    next(s);
  }
  const toggleIn = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  function resetStats() {
    if (!confirmReset) { setConfirmReset(true); return; }
    setStats(DEFAULT_STATS);
    setSession({ right: 0, total: 0, streak: 0 });
    setConfirmReset(false);
  }

  const form = card && FORM_BY_ID[card.form];
  const answer = card && conjugate(card.word, card.form);
  const activeForms = FORMS.filter((f) => settings.forms.includes(f.id));

  return (
    <>
      <div className="section-head section-head--bare">
        <div className="eyebrow-jp">活用道場</div>
        <h1>Conjugation Dojo</h1>
      </div>
      <p className="section-note">
        N4 doesn't ask you to conjugate in a vacuum, but almost every grammar question assumes you can produce 書かされる or 静かじゃなかった without stopping to think. Type the form in romaji or kana (it converts as you type) and press Enter. Every answer comes with the rule behind it. The forms you miss come up more often.
      </p>

      <div className="dojo-grid">
        <div className="dojo-card">
          {!card ? (
            <div className="dojo-empty">Pick at least one word type and one form below to start.</div>
          ) : (
            <>
              <div className="dojo-top">
                <div className="dojo-form">
                  <span className="dojo-form-jp">{form.jp}</span>
                  <span className="dojo-form-en">{form.label}</span>
                  <span className="dojo-form-hint">{form.hint}</span>
                </div>
                <div className="dojo-streak" aria-label={"Streak " + session.streak}>
                  <span className="dojo-streak-num">{session.streak}</span>
                  <span className="dojo-streak-lbl">連続</span>
                </div>
              </div>

              <div className="dojo-prompt">
                <JpText tag="div" className="dojo-word" html={rubyFor(card.word.kj, card.word.kana)} />
                <div className="dojo-en">{card.word.en}</div>
                <div className="dojo-class">
                  {result ? classLabel(card.word) : isVerb(card.word) ? "Verb · which group?" : "Adjective · い or な?"}
                </div>
              </div>

              <form className="dojo-answer" onSubmit={onSubmit}>
                <input
                  ref={inputRef}
                  className={"dojo-input" + (result ? (result.correct ? " ok" : " bad") : "")}
                  value={input}
                  onChange={onChange}
                  onCompositionStart={() => { composing.current = true; }}
                  onCompositionEnd={(e) => { composing.current = false; setInput(romajiToKana(e.target.value)); }}
                  readOnly={!!result}
                  placeholder="type in romaji or kana…"
                  aria-label={`${card.word.kj}, ${form.label} form`}
                  lang="ja"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                <button type="submit" className="dojo-go">{result ? "Next →" : "Check"}</button>
              </form>

              <div aria-live="polite">
                {result && (
                  <div className={"dojo-result " + (result.correct ? "ok" : "bad")}>
                    <div className="dojo-verdict">
                      {result.correct ? "✓ Correct" : result.revealed ? "Answer" : "✕ Not quite"}
                      {!result.correct && !result.revealed && <span className="dojo-given">you wrote {result.given}</span>}
                    </div>
                    <JpText tag="div" className="dojo-correct" html={rubyFor(answer.kj[0], answer.kana[0])} />
                    {answer.kana.length > 1 && (
                      <div className="dojo-alt">Also accepted: {answer.kj.slice(1).join("、")}</div>
                    )}
                    {result.note && <div className="dojo-note">{result.note}</div>}
                    <div className="dojo-rule" dangerouslySetInnerHTML={{ __html: explain(card.word, card.form) }} />
                    {isGroupTrap(card.word) && (
                      <div className="dojo-note">{card.word.kj} ends in -iru/-eru, so it looks like Group 2, but it's Group 1. It's one of the handful worth memorising.</div>
                    )}
                  </div>
                )}
              </div>

              <div className="dojo-actions">
                {!result && <button className="linkbtn" onClick={reveal}>I don't know, show me</button>}
                <span className="dojo-keyhint">Enter to {result ? "continue" : "check"}</span>
              </div>
            </>
          )}
        </div>

        <aside className="dojo-side">
          <div className="dojo-session">
            <div><span className="num">{session.right}</span>/{session.total}<div className="lbl">this session</div></div>
            <div><span className="num">{stats.best}</span><div className="lbl">best streak</div></div>
          </div>
          <div className="qlabel">Accuracy by form</div>
          <ul className="dojo-stats">
            {activeForms.map((f) => {
              const [right, total] = stats.forms[f.id] || [0, 0];
              const pct = total ? Math.round((right / total) * 100) : null;
              return (
                <li key={f.id} className={pct !== null && pct < 60 ? "weak" : ""}>
                  <span className="ds-name">{f.jp}</span>
                  <span className="ds-track"><span className="ds-fill" style={{ width: (pct ?? 0) + "%" }} /></span>
                  <span className="ds-pct">{pct === null ? "—" : pct + "%"}</span>
                </li>
              );
            })}
          </ul>
          <button className="linkbtn" onClick={resetStats} onBlur={() => setConfirmReset(false)}>
            {confirmReset ? "Click again to wipe dojo stats" : "Reset dojo stats"}
          </button>
        </aside>
      </div>

      <div className="dojo-settings">
        <div className="dojo-set-row">
          <span className="qlabel">Words</span>
          <div className="dojo-chips">
            {TYPES.map((t) => (
              <button
                key={t.id}
                className={"dojo-chip" + (settings.types.includes(t.id) ? " on" : "")}
                aria-pressed={settings.types.includes(t.id)}
                onClick={() => updateSettings({ types: toggleIn(settings.types, t.id) })}
              >{t.label}</button>
            ))}
          </div>
        </div>
        {FORM_GROUPS.map((g) => {
          const groupForms = FORMS.filter((f) => f.group === g.id);
          const allOn = groupForms.every((f) => settings.forms.includes(f.id));
          return (
            <div key={g.id} className="dojo-set-row">
              <span className="qlabel">
                {g.label}
                <button
                  className="dojo-all"
                  onClick={() => updateSettings({
                    forms: allOn
                      ? settings.forms.filter((id) => !groupForms.some((f) => f.id === id))
                      : [...new Set([...settings.forms, ...groupForms.map((f) => f.id)])],
                  })}
                >{allOn ? "none" : "all"}</button>
              </span>
              <div className="dojo-chips">
                {groupForms.map((f) => (
                  <button
                    key={f.id}
                    className={"dojo-chip" + (settings.forms.includes(f.id) ? " on" : "")}
                    aria-pressed={settings.forms.includes(f.id)}
                    onClick={() => updateSettings({ forms: toggleIn(settings.forms, f.id) })}
                    title={f.hint}
                  >
                    <span className="jp">{f.jp}</span> {f.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
