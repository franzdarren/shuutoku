/* Fills in furigana that was missing from the data files.
 *
 * It does NOT guess readings. It harvests every <ruby>base<rt>reading</rt></ruby>
 * pair the data already contains, keeps only the ones that are unambiguous
 * across the whole corpus, and applies those to bare occurrences of the same
 * word elsewhere. So a word is only ever glossed with a reading this project
 * had already vetted by hand somewhere else.
 *
 * Three guards keep it honest:
 *   1. A base with more than one reading in the corpus is skipped entirely
 *      (降 is both ふ and お; 着 is both き and つ; 何 is both なに and なん).
 *   2. Single-character bases are skipped — they are nearly all verb stems
 *      whose reading depends on the okurigana that follows.
 *   3. A run of kanji is only glossed if the map covers the WHOLE run. Partly
 *      glossing a run is what produced 少<rt>すこ</rt>々 for 少々(しょうしょう),
 *      so a run with any unknown segment is left alone for a human.
 *
 * Usage: node scripts/fill-furigana.mjs [--write]   (default is a dry run)
 */
import fs from "node:fs";
import path from "node:path";

const DATA = "src/data";
const FILES = [
  "grammar.json", "grammar-extra.json", "reading.json",
  "kaiwa-scenarios.json", "kaiwa-phrasebank.json", "quiz.json",
];
const WRITE = process.argv.includes("--write");
const KANJI_RUN = /[一-鿿]+/g;
const RUN_WITH_OKURIGANA = /([一-鿿]+)([぀-ゟ]{0,2})/g;
const RUBY_BLOCK = /<ruby>[^<]*<rt>[^<]*<\/rt><\/ruby>/g;

const sources = FILES.map((f) => [f, fs.readFileSync(path.join(DATA, f), "utf8")]);

// 1 · harvest every reading the corpus already uses
const readings = new Map();
for (const [, text] of sources) {
  for (const m of text.matchAll(/<ruby>([^<]+)<rt>([^<]*)<\/rt><\/ruby>/g)) {
    if (!readings.has(m[1])) readings.set(m[1], new Set());
    readings.get(m[1]).add(m[2]);
  }
}

/* Hand-verified supplement: words the corpus uses constantly but happens never
 * to have glossed (or glossed only as a single character, which rule 2 skips).
 * Every entry here has exactly one reading as a standalone word, and any
 * compound built on it either already appears in the harvested map — where
 * longest-first matching claims it first — or contains a segment the map
 * doesn't know, which makes rule 3 skip the whole run. Nothing whose reading
 * shifts in compounds (人 ひと/にん/じん, 前 まえ/ぜん, 中 なか/ちゅう,
 * 間 ま/かん, 水 みず/すい, 本 ほん/もと) belongs here. */
const SUPPLEMENT = {
  "日本語": "にほんご",
  "日本": "にほん",
  "駅": "えき",
  "雨": "あめ",
  "傘": "かさ",
  "店": "みせ",
  "車": "くるま",
  "今": "いま",
  // Compounds whose trailing character takes an on-reading it never has
  // alone, so they must be claimed whole rather than segmented: 日本人 is
  // にほんじん, not にほん + ひと.
  "日本人": "にほんじん",
  "何日間": "なんにちかん",
  "電話中": "でんわちゅう",
};

// 2 · keep only unambiguous, multi-character, pure-kanji bases
const map = new Map();
for (const [base, reads] of readings) {
  if (reads.size !== 1) continue;
  if ([...base].length < 2) continue;
  if (!/^[一-鿿]+$/.test(base)) continue;
  map.set(base, [...reads][0]);
}
const harvested = new Set(map.keys());
for (const [base, reading] of Object.entries(SUPPLEMENT)) {
  if (!map.has(base)) map.set(base, reading);
}
const bases = [...map.keys()].sort((a, b) => b.length - a.length);

/* A single kanji's reading is decided by the okurigana after it — 食べます is
 * た, 食事 is しょく. So single characters get a second map keyed by the kana
 * that follow them, harvested the same way and held to the same one-reading
 * rule: 降りそ is ふ 9 times and お once, so it stays out. Keys are stored at
 * 0, 1 and 2 kana of context independently and matched longest-first. */
const ctxReadings = new Map();
for (const [, text] of sources) {
  for (const m of text.matchAll(/<ruby>([一-鿿])<rt>([^<]*)<\/rt><\/ruby>([぀-ゟ]{0,2})/g)) {
    for (let n = 0; n <= m[3].length; n++) {
      const key = m[1] + "|" + m[3].slice(0, n);
      if (!ctxReadings.has(key)) ctxReadings.set(key, new Set());
      ctxReadings.get(key).add(m[2]);
    }
  }
}
const ctxMap = new Map();
for (const [key, reads] of ctxReadings) if (reads.size === 1) ctxMap.set(key, [...reads][0]);

/** Greedy longest-first segmentation of one kanji run, given the kana that
 *  follow it. Returns [{base, reading}] or null when any part can't be
 *  resolved — the caller then leaves the whole run alone. */
function segment(run, trailing = "") {
  const parts = [];
  let i = 0;
  outer: while (i < run.length) {
    for (const base of bases) {
      if (base.length <= run.length - i && run.startsWith(base, i)) {
        parts.push({ base, reading: map.get(base) });
        i += base.length;
        continue outer;
      }
    }
    // Only the run's last character is followed by the okurigana; anything
    // earlier butts against the next kanji, so it gets no context.
    const okuri = i === run.length - 1 ? trailing : "";
    let reading;
    for (let n = okuri.length; n >= 0 && reading === undefined; n--) {
      reading = ctxMap.get(run[i] + "|" + okuri.slice(0, n));
    }
    if (reading === undefined) return null;
    parts.push({ base: run[i], reading });
    i += 1;
  }
  return parts;
}

const skipped = new Map();
let glossed = 0;

function fillSegment(text) {
  return text.replace(RUN_WITH_OKURIGANA, (whole, run, trailing) => {
    const parts = segment(run, trailing);
    /* Single-part only. A run that splits into pieces is the one case where
     * every piece can be individually right and the whole still wrong —
     * 四人家族 is よにんかぞく, never ひと + かぞく — so those are left bare
     * for a human rather than guessed at. */
    if (!parts || parts.length > 1) {
      skipped.set(run, (skipped.get(run) || 0) + 1);
      return whole;
    }
    glossed += parts.length;
    return parts.map((p) => `<ruby>${p.base}<rt>${p.reading}</rt></ruby>`).join("") + trailing;
  });
}

// 3 · transform only the text between existing ruby blocks, so nothing
//     already glossed is touched and the file's formatting is preserved
let changedFiles = 0;
for (const [file, text] of sources) {
  const kept = text.match(RUBY_BLOCK) || [];
  const between = text.split(RUBY_BLOCK);
  const rebuilt = between.map(fillSegment).reduce((acc, part, i) => acc + part + (kept[i] ?? ""), "");
  if (rebuilt !== text) {
    changedFiles++;
    if (WRITE) fs.writeFileSync(path.join(DATA, file), rebuilt);
  }
}

/* Multi-part segmentations are the only place this can go wrong: each piece
 * may be individually right while the compound has its own reading (三人 is
 * さんにん, never さん + ひと). Every one is printed so a human can check. */
const multi = new Map();
for (const [, text] of sources) {
  for (const m of text.replace(RUBY_BLOCK, "").matchAll(RUN_WITH_OKURIGANA)) {
    if (multi.has(m[0])) continue;
    const parts = segment(m[1], m[2]);
    if (parts && parts.length > 1) multi.set(m[0], parts);
  }
}
console.log(`multi-part segmentations (${multi.size}) — verify each:`);
for (const [run, parts] of multi) {
  console.log(`   ${run.padEnd(10)} => ${parts.map((p) => p.base + "(" + p.reading + ")").join(" + ")}`);
}
console.log("");

const skippedList = [...skipped].sort((a, b) => b[1] - a[1]);
console.log(`map: ${map.size} unambiguous compounds harvested from existing ruby`);
console.log(`glossed: ${glossed} occurrences across ${changedFiles} files`);
console.log(`left alone: ${skippedList.length} distinct runs the map can't fully cover`);
console.log(`\ntop 30 left for a human:`);
skippedList.slice(0, 30).forEach(([run, n]) => console.log(`   ${run}  ×${n}`));
console.log(WRITE ? "\nWRITTEN" : "\nDry run — pass --write to apply");
