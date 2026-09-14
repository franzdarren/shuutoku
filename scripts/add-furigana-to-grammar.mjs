// One-off enrichment: the original data only hand-wrote furigana for each
// grammar point's first 3 example sentences; the 5 "supplemental round"
// sentences merged in from the legacy data were plain text. This fills in
// furigana for every example sentence that doesn't have any yet, using
// kuroshiro (kuromoji IPADIC analyzer) — auto-generated, so it's worth a
// spot check afterward, but the granularity matches the hand-written style
// closely (only kanji runs get wrapped, same as the existing R() output).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import KuroshiroMod from "kuroshiro";
import KuromojiAnalyzerMod from "kuroshiro-analyzer-kuromoji";

const Kuroshiro = KuroshiroMod.default || KuroshiroMod;
const KuromojiAnalyzer = KuromojiAnalyzerMod.default || KuromojiAnalyzerMod;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const grammarPath = path.join(root, "src", "data", "grammar.json");

const kuroshiro = new Kuroshiro();
await kuroshiro.init(new KuromojiAnalyzer({ dictPath: path.join(root, "node_modules/kuromoji/dict") }));

async function addFurigana(text) {
  const html = await kuroshiro.convert(text, { to: "hiragana", mode: "furigana" });
  // kuroshiro emits <rp>(</rp>...<rp>)</rp> fallback parens around each
  // reading — strip them to match this app's plain <ruby><rt> convention.
  return html.replace(/<rp>[^<]*<\/rp>/g, "");
}

const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
let converted = 0;
const sample = [];

for (const mod of grammar) {
  for (const pt of mod.points) {
    for (const ex of pt.examples) {
      if (/<ruby>/.test(ex.jp)) continue; // already hand-annotated
      const before = ex.jp;
      ex.jp = await addFurigana(ex.jp);
      converted++;
      if (sample.length < 20) sample.push({ before, after: ex.jp });
    }
  }
}

fs.writeFileSync(grammarPath, JSON.stringify(grammar, null, 2), "utf8");
console.log(`Converted ${converted} example sentences.`);
console.log("\n--- sample (first 20) ---");
sample.forEach((s) => console.log(s.before, "\n ->", s.after, "\n"));
