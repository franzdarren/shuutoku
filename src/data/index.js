import grammarBase from "./grammar.json";
import grammarExtra from "./grammar-extra.json";
import kanjiData from "./kanji.json";
import readingPassages from "./reading.json";
import kaiwaTips from "./kaiwa-tips.json";
import phraseBank from "./kaiwa-phrasebank.json";
import kaiwaScenarios from "./kaiwa-scenarios.json";
import quizGroups from "./quiz.json";

export const grammarModules = [...grammarBase, ...grammarExtra];
export const kanjiFocus = kanjiData.kanjiFocus;
export const kanjiQuiz = kanjiData.kanjiQuiz;
export { readingPassages, kaiwaTips, phraseBank, kaiwaScenarios };
export const finalQuizGroups = quizGroups;

// The Quiz Center draws a random sample from this pool every visit, so
// each item needs an id that's stable across draws (unlike the "final-qN"
// slot id Quiz.jsx assigns, which points at a different question each
// time) — used both for the wrong-answer SRS weighting and for the Review
// Mistakes page to find these items again later.
export const finalPool = quizGroups.flatMap((g, gi) =>
  g.items.map((item, ii) => Object.assign(item, { _pid: "pool-" + gi + "-" + ii }))
);

// Each module's Module Check draws from its own bank of questions, kept
// separate from the per-point quizzes shown in the cards above it so the
// checkpoint tests the module rather than replaying what you just answered.
// The stable id lets a redraw skip questions you've already been given.
grammarModules.forEach((m, mi) => {
  (m.check || []).forEach((item, ci) => { item._cid = "mcheck" + mi + "-" + ci; });
});

/** The pool a module's checkpoint draws from — its own bank, falling back
 *  to that module's point quizzes if no bank has been written for it. */
export function moduleCheckPool(mi) {
  const m = grammarModules[mi];
  return m.check?.length ? m.check : m.points.flatMap((p) => p.quiz || []);
}

function stripTags(html) {
  return (html || "").replace(/<[^>]+>/g, "");
}

/** Every quiz question in the whole handbook, each with a stable id and a
 *  human-readable label for where it lives — the shared lookup the Review
 *  Mistakes page uses to find your wrong answers regardless of section. */
export function getAllQuizEntries() {
  const entries = [];
  grammarModules.forEach((m, mi) => {
    m.points.forEach((pt, pi) => {
      (pt.quiz || []).forEach((item, qi) => {
        entries.push({ id: "g" + mi + "-" + pi + "-q" + qi, item, section: "grammar", sectionLabel: m.jpTitle + " — " + stripTags(pt.jp) });
      });
    });
    (m.check || []).forEach((item) => {
      entries.push({ id: item._cid, item, section: "quiz", sectionLabel: m.jpTitle + " — Module Check" });
    });
  });
  kanjiQuiz.forEach((item, qi) => {
    entries.push({ id: "kanji-q" + qi, item, section: "kanji", sectionLabel: "Kanji Focus" });
  });
  readingPassages.forEach((p, i) => {
    (p.quiz || []).forEach((item, qi) => {
      entries.push({ id: "read" + i + "-q" + qi, item, section: "reading", sectionLabel: stripTags(p.titleEn || p.title) });
    });
  });
  kaiwaScenarios.forEach((sc, i) => {
    (sc.quiz || []).forEach((item, qi) => {
      entries.push({ id: "kaiwa" + i + "-q" + qi, item, section: "kaiwa", sectionLabel: stripTags(sc.title || sc.titleEn || "Kaiwa scenario " + (i + 1)) });
    });
  });
  quizGroups.forEach((g) => {
    g.items.forEach((item) => {
      entries.push({ id: item._pid, item, section: "quiz", sectionLabel: "Quiz Center — " + stripTags(g.title) });
    });
  });
  return entries;
}

/** A flat, searchable index over grammar points and kanji — the two
 *  sections with the most content to scroll/paginate through. */
export function buildSearchIndex() {
  const idx = [];
  grammarModules.forEach((m, mi) => {
    m.points.forEach((pt, pi) => {
      const title = stripTags(pt.jp);
      const subtitle = pt.romaji || pt.fn || "";
      idx.push({
        type: "grammar",
        mi,
        pi,
        title,
        subtitle,
        haystack: [title, pt.romaji, pt.fn, stripTags(pt.explain)].join(" ").toLowerCase(),
      });
    });
  });
  kanjiFocus.forEach((k, index) => {
    idx.push({
      type: "kanji",
      index,
      title: k.kj,
      subtitle: k.meaning,
      haystack: [k.kj, k.on, k.kun, k.meaning].join(" ").toLowerCase(),
    });
  });
  return idx;
}

export function countGrammarPoints() {
  return grammarModules.reduce((n, m) => n + m.points.length, 0);
}
export function countPhrases() {
  return phraseBank.reduce((n, g) => n + g.items.length, 0);
}
export function countQuizPool() {
  return finalQuizGroups.reduce((n, g) => n + g.items.length, 0);
}

/** How many questions a module's "Module Check" draws — capped at 10, or
 *  the module's own quiz pool size if it has fewer than that. */
export function moduleCheckSize(mod) {
  const pool = mod.points.reduce((n, p) => n + (p.quiz?.length || 0), 0);
  return Math.min(10, pool);
}

/** Total number of quiz questions across the whole handbook — used for the
 *  sidebar progress bar. The Quiz Center's rotating sample is a fixed-size
 *  10-question slice (ids final-q0..9), so it contributes a flat 10; each
 *  grammar module's own 10-question "Module Check" (ids modcheck{i}-q0..9)
 *  works the same way. */
export function countAllQuizItems() {
  const grammarQ = grammarModules.reduce((n, m) => n + m.points.reduce((a, p) => a + (p.quiz?.length || 0), 0), 0);
  const moduleCheckQ = grammarModules.reduce((n, m) => n + moduleCheckSize(m), 0);
  const kanjiQ = kanjiQuiz.length;
  const readingQ = readingPassages.reduce((n, p) => n + (p.quiz?.length || 0), 0);
  const kaiwaQ = kaiwaScenarios.reduce((n, s) => n + (s.quiz?.length || 0), 0);
  const finalQ = Math.min(10, countQuizPool());
  return grammarQ + moduleCheckQ + kanjiQ + readingQ + kaiwaQ + finalQ;
}
