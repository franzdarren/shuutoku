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

export function countGrammarPoints() {
  return grammarModules.reduce((n, m) => n + m.points.length, 0);
}
export function countPhrases() {
  return phraseBank.reduce((n, g) => n + g.items.length, 0);
}
export function countQuizPool() {
  return finalQuizGroups.reduce((n, g) => n + g.items.length, 0);
}

/** Total number of quiz questions across the whole handbook — used for the
 *  sidebar progress bar. The Quiz Center's rotating sample is a fixed-size
 *  10-question slice (ids final-q0..9), so it contributes a flat 10. */
export function countAllQuizItems() {
  const grammarQ = grammarModules.reduce((n, m) => n + m.points.reduce((a, p) => a + (p.quiz?.length || 0), 0), 0);
  const kanjiQ = kanjiQuiz.length;
  const readingQ = readingPassages.reduce((n, p) => n + (p.quiz?.length || 0), 0);
  const kaiwaQ = kaiwaScenarios.reduce((n, s) => n + (s.quiz?.length || 0), 0);
  const finalQ = Math.min(10, countQuizPool());
  return grammarQ + kanjiQ + readingQ + kaiwaQ + finalQ;
}
