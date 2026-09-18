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

/* Compounds with two common readings that the corpus only ever happens to
 * gloss one way — the same trap as 間, one level up. 十分 is じゅっぷん as a
 * duration but じゅうぶん as "enough", and this corpus contains both
 * (このバスは十分おきに… vs もう十分です、ありがとうございます). A compound
 * here is never auto-glossed; a human writes the ruby by hand. */
const AMBIGUOUS_COMPOUNDS = new Set(["十分"]);

// 2 · keep only unambiguous, multi-character, pure-kanji bases
const map = new Map();
for (const [base, reads] of readings) {
  if (reads.size !== 1) continue;
  if (AMBIGUOUS_COMPOUNDS.has(base)) continue;
  if ([...base].length < 2) continue;
  if (!/^[一-鿿]+$/.test(base)) continue;
  map.set(base, [...reads][0]);
}
for (const [base, reading] of Object.entries(SUPPLEMENT)) {
  if (!map.has(base)) map.set(base, reading);
}
const bases = [...map.keys()].sort((a, b) => b.length - a.length);

/* Kanji whose reading turns on what comes BEFORE them, which okurigana can't
 * see. 間 is the cautionary case: the corpus only ever glossed it inside
 * 間に合う(まにあう), so "one reading in the corpus" looked unambiguous and
 * spread ま across every 〜間に, where it is あいだ. Counters and bound nouns
 * have the same problem (人 ひと/にん/じん, 日 ひ/にち/か). None of these is
 * ever auto-glossed as a lone character; only as part of a known compound. */
const CONTEXT_BOUND = new Set([
  ..."間人日中方目分生気時年月上下元手口家物事者心力水火木金土空田本回先後前内外大小多少何",
  ..."一二三四五六七八九十百千万円個本冊枚台回番号点度才歳",
]);

/* A single kanji's reading is decided by the okurigana after it — 食べます is
 * た, 食事 is しょく. So single characters get a second map keyed by the kana
 * that follow them, held to the same one-reading rule: 降りそ is ふ 9 times
 * and お once, so it stays out. At least one kana of context is required —
 * a zero-context key is just "this kanji, anywhere", which is exactly the
 * blunt instrument that mis-read 間. */
const ctxReadings = new Map();
for (const [, text] of sources) {
  for (const m of text.matchAll(/<ruby>([一-鿿])<rt>([^<]*)<\/rt><\/ruby>([぀-ゟ]{1,2})/g)) {
    if (CONTEXT_BOUND.has(m[1])) continue;
    for (let n = 1; n <= m[3].length; n++) {
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
    // earlier butts against the next kanji, so it has no context and can't
    // be resolved as a lone character at all.
    const okuri = i === run.length - 1 ? trailing : "";
    let reading;
    for (let n = okuri.length; n >= 1 && reading === undefined; n--) {
      reading = ctxMap.get(run[i] + "|" + okuri.slice(0, n));
    }
    if (reading === undefined) return null;
    parts.push({ base: run[i], reading });
    i += 1;
  }
  return parts;
}

const skipped = new Map();
const applied = new Map();
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
    const key = parts[0].base + "｜" + parts[0].reading + (trailing ? "  (+" + trailing + ")" : "");
    applied.set(key, (applied.get(key) || 0) + 1);
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

/* 4 · Some fields are rendered as plain text, never as HTML — a module title
 * in a tab, a tip line, a scenario's role-play note. Ruby markup in those
 * shows up verbatim on screen as "<ruby>...". The pass above works on raw
 * file text and can't see field boundaries, so the markup is stripped back
 * out here by field name. Without this step every run silently reintroduces
 * the bug. The four files touched all re-serialise byte-identically, so
 * nothing but these fields changes.
 *
 * Side effect worth knowing: because step 3 glosses those fields and step 4
 * undoes it, the "glossed" count is inflated on re-runs and never settles at
 * zero. The files themselves do converge — running twice in a row produces
 * identical bytes — so it's noise in the report, not churn in the data. */
/* `en` is the English gloss beside a phrase. It is rendered as plain text at
 * every one of its call sites, so a Japanese word quoted inside it — "casual
 * 大丈夫ですか" — gets glossed by step 3 and then shows the tags verbatim.
 * Same failure as the rest of this list, one field further in. */
const PLAIN_TEXT_FIELDS = new Set(["jpTitle", "reading", "enTitle", "tip", "label", "who", "setup", "roleplay", "cat", "catEn", "title", "body", "en"]);
const unruby = (s) => s.replace(/<ruby>([^<]*)<rt>[^<]*<\/rt><\/ruby>/g, "$1");

function stripPlainFields(node) {
  let n = 0;
  if (Array.isArray(node)) { node.forEach((v) => { n += stripPlainFields(v); }); return n; }
  if (!node || typeof node !== "object") return n;
  for (const [key, value] of Object.entries(node)) {
    if (typeof value === "string") {
      if (PLAIN_TEXT_FIELDS.has(key) && value.includes("<ruby>")) { node[key] = unruby(value); n++; }
    } else n += stripPlainFields(value);
  }
  return n;
}

if (WRITE) {
  let stripped = 0;
  // reading.json / quiz.json are excluded: they hold no plain-text fields and
  // are the two files that would reformat on re-serialisation.
  for (const file of ["grammar.json", "grammar-extra.json", "kaiwa-scenarios.json", "kaiwa-phrasebank.json"]) {
    const p = path.join(DATA, file);
    const data = JSON.parse(fs.readFileSync(p, "utf8"));
    const n = stripPlainFields(data);
    if (n) { fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n"); stripped += n; }
  }
  console.log(`plain-text fields un-rubied: ${stripped}`);
}

/* 5 · A question that ASKS for a reading must not print that reading above the
 * kanji it is asking about. Furigana is on by default, so "意味 is read:" with
 * ruby renders as "いみ is read:" and hands over the answer. Step 3 works on
 * raw file text and cannot tell a question stem from prose, so — exactly like
 * step 4 — the markup is taken back out here. Without this, every run silently
 * re-leaks six answers in quiz.json. kanjiQuiz asks the same kind of question
 * with bare kanji and is the model being matched.
 *
 * Only the STEM is cleared; choices and explanation keep their furigana. */
const ASKS_FOR_READING = /\bis read\b|\breading of\b|\bread\b\s*[,:]/i;

function stripReadingStems(node) {
  let n = 0;
  if (Array.isArray(node)) { for (const v of node) n += stripReadingStems(v); return n; }
  if (!node || typeof node !== "object") return 0;
  for (const [key, value] of Object.entries(node)) {
    if (key === "q" && typeof value === "string" && value.includes("<ruby>") && ASKS_FOR_READING.test(value)) {
      node[key] = unruby(value); n++;
    } else n += stripReadingStems(value);
  }
  return n;
}

if (WRITE) {
  let leaks = 0;
  for (const file of ["quiz.json", "kanji.json", "reading.json", "grammar.json", "grammar-extra.json", "kaiwa-scenarios.json"]) {
    const p = path.join(DATA, file);
    const raw = fs.readFileSync(p, "utf8");
    const data = JSON.parse(raw);
    const n = stripReadingStems(data);
    if (n) {
      let out = JSON.stringify(data, null, 2);
      if (/\n$/.test(raw)) out += "\n";
      if (raw.includes("\r\n")) out = out.replace(/\n/g, "\r\n");
      fs.writeFileSync(p, out);
      leaks += n;
    }
  }
  console.log(`reading-question stems un-rubied (answer would otherwise be visible): ${leaks}`);
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

/* Every distinct word→reading this pass applies, for eyeballing. The point
 * is that this list is short enough to actually read: the heuristic decides
 * what to propose, a human still decides whether it's right. */
if (process.argv.includes("--list")) {
  const singles = [...applied].filter(([k]) => [...k.split("｜")[0]].length === 1).sort();
  const compounds = [...applied].filter(([k]) => [...k.split("｜")[0]].length > 1).sort();
  console.log(`single characters resolved by okurigana (${singles.length}):`);
  singles.forEach(([k, n]) => console.log(`   ${k.padEnd(26)} ×${n}`));
  console.log(`\ncompounds (${compounds.length}):`);
  compounds.forEach(([k, n]) => console.log(`   ${k.padEnd(26)} ×${n}`));
  console.log("");
}

const skippedList = [...skipped].sort((a, b) => b[1] - a[1]);
console.log(`map: ${map.size} unambiguous compounds harvested from existing ruby`);
console.log(`glossed: ${glossed} occurrences across ${changedFiles} files`);
console.log(`left alone: ${skippedList.length} distinct runs the map can't fully cover`);
console.log(`\ntop 30 left for a human:`);
skippedList.slice(0, 30).forEach(([run, n]) => console.log(`   ${run}  ×${n}`));
console.log(WRITE ? "\nWRITTEN" : "\nDry run — pass --write to apply");
