// One-time migration: run the legacy data/*.js files (written as browser
// globals) in a Node vm context, then dump the resulting N4 object out as
// plain JSON files under src/data/. Not part of the app build — run once
// with `node scripts/migrate-data.mjs` if you ever need to regenerate from
// the legacy/ folder again.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const legacyDataDir = path.join(root, "legacy", "data");
const outDir = path.join(root, "src", "data");

const sandbox = {};
vm.createContext(sandbox);

const files = ["00-core.js", "grammar.js", "kanji.js", "reading.js", "kaiwa.js", "quiz.js"];
for (const file of files) {
  const code = fs.readFileSync(path.join(legacyDataDir, file), "utf8");
  vm.runInContext(code, sandbox, { filename: file });
}

const N4 = sandbox.N4;

// ---- merge grammar example rounds into each point, like index.html did ----
let i = 0;
N4.grammarModules.forEach((mod) => {
  mod.points.forEach((point) => {
    N4.grammarExampleRounds.forEach((round) => {
      const ex = round[i];
      if (ex) point.examples.push({ jp: ex[0], en: ex[1] });
    });
    i++;
  });
});

// ---- parse "word (reading) meaning ・ word2 (reading2) meaning2" gloss
//      strings into structured vocab entries for the tooltip lookup ----
function parseGloss(gloss) {
  if (!gloss) return [];
  return gloss.split("・").map((chunk) => {
    const m = chunk.trim().match(/^(.+?)\s*\(([^)]+)\)\s*(.+)$/);
    if (m) return { jp: m[1].trim(), reading: m[2].trim(), en: m[3].trim() };
    return { jp: chunk.trim(), reading: "", en: "" };
  }).filter((e) => e.jp);
}

const readingPassages = N4.readingPassages.map((p) => ({
  ...p,
  vocab: parseGloss(p.gloss),
}));

function writeJSON(name, data) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, name), JSON.stringify(data, null, 2), "utf8");
  console.log("wrote", name);
}

writeJSON("grammar.json", N4.grammarModules);
writeJSON("kanji.json", { kanjiFocus: N4.kanjiFocus, kanjiQuiz: N4.kanjiQuiz });
writeJSON("reading.json", readingPassages);
writeJSON("kaiwa-tips.json", N4.kaiwaTips);
writeJSON("kaiwa-phrasebank.json", N4.phraseBank);
writeJSON("kaiwa-scenarios.json", N4.kaiwaScenarios);
writeJSON("quiz.json", N4.finalQuizGroups);

console.log("done.");
