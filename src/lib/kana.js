/* Romaji → hiragana, for typing answers without a Japanese IME. Follows the
   conventions people already know from phone and desktop IMEs (shi/si,
   tsu/tu, double consonant → っ, nn → ん) closely enough that someone who has
   typed Japanese before doesn't have to think about it. Anything that isn't
   ASCII passes straight through, so IME-typed kana and kanji are untouched. */

const TABLE = {};
function add(map) { Object.assign(TABLE, map); }

const VOWELS = { a: "あ", i: "い", u: "う", e: "え", o: "お" };
add(VOWELS);

// Plain consonant rows: [romaji onset, a, i, u, e, o].
const ROWS = [
  ["k", "か", "き", "く", "け", "こ"],
  ["g", "が", "ぎ", "ぐ", "げ", "ご"],
  ["s", "さ", "し", "す", "せ", "そ"],
  ["z", "ざ", "じ", "ず", "ぜ", "ぞ"],
  ["t", "た", "ち", "つ", "て", "と"],
  ["d", "だ", "ぢ", "づ", "で", "ど"],
  ["n", "な", "に", "ぬ", "ね", "の"],
  ["h", "は", "ひ", "ふ", "へ", "ほ"],
  ["b", "ば", "び", "ぶ", "べ", "ぼ"],
  ["p", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],
  ["m", "ま", "み", "む", "め", "も"],
  ["r", "ら", "り", "る", "れ", "ろ"],
];
for (const [c, a, i, u, e, o] of ROWS) add({ [c + "a"]: a, [c + "i"]: i, [c + "u"]: u, [c + "e"]: e, [c + "o"]: o });

add({
  ya: "や", yu: "ゆ", yo: "よ",
  wa: "わ", wo: "を", wi: "うぃ", we: "うぇ",
  shi: "し", chi: "ち", tsu: "つ", fu: "ふ", ji: "じ",
  fa: "ふぁ", fi: "ふぃ", fe: "ふぇ", fo: "ふぉ",
  she: "しぇ", je: "じぇ", che: "ちぇ",
  vu: "ゔ", "n'": "ん",
});

// Contracted sounds (きゃ etc.): onset + y + a/u/o, plus the sh/ch/j spellings.
const YOON = { k: "き", g: "ぎ", s: "し", z: "じ", t: "ち", c: "ち", d: "ぢ", n: "に", h: "ひ", b: "び", p: "ぴ", m: "み", r: "り", j: "じ" };
const SMALL = { a: "ゃ", u: "ゅ", o: "ょ" };
for (const [c, kana] of Object.entries(YOON)) {
  for (const [v, small] of Object.entries(SMALL)) TABLE[c + "y" + v] = kana + small;
}
for (const [v, small] of Object.entries(SMALL)) {
  TABLE["sh" + v] = "し" + small;
  TABLE["ch" + v] = "ち" + small;
  TABLE["j" + v] = "じ" + small;
}

// Explicit small kana: xa / la → ぁ, xtu / ltu → っ, xya → ゃ …
const SMALL_VOWELS = { a: "ぁ", i: "ぃ", u: "ぅ", e: "ぇ", o: "ぉ" };
for (const p of ["x", "l"]) {
  for (const [v, k] of Object.entries(SMALL_VOWELS)) TABLE[p + v] = k;
  for (const [v, k] of Object.entries(SMALL)) TABLE[p + "y" + v] = k;
  TABLE[p + "tu"] = "っ";
  TABLE[p + "tsu"] = "っ";
}

// Every proper prefix of a key ("k", "ky", "ts"…): a tail like that is a
// syllable still being typed, so live conversion leaves it as letters.
const PREFIXES = new Set();
for (const key of Object.keys(TABLE)) {
  for (let i = 1; i < key.length; i++) PREFIXES.add(key.slice(0, i));
}

const isVowel = (c) => c === "a" || c === "i" || c === "u" || c === "e" || c === "o";
const isConsonant = (c) => /[bcdfghjklmpqrstvwxyz]/.test(c);

/** Converts the romaji in `input` to hiragana. With `final: false` (while
 *  typing), a trailing half-typed syllable — "k", "sh", a lone "n" — is left
 *  as letters so the next keystroke can complete it; `final: true` (on
 *  submit) resolves a trailing n to ん. */
export function romajiToKana(input, final = false) {
  let out = "";
  let i = 0;
  while (i < input.length) {
    const raw = input[i];
    const c = raw.toLowerCase();
    if (!/[a-z'-]/.test(c)) { out += raw; i++; continue; }
    if (c === "-") { out += "ー"; i++; continue; }
    if (c === "'") { i++; continue; }

    const rest = input.slice(i).toLowerCase();
    const n1 = rest[1];

    if (c === "n") {
      if (n1 === "'") { out += "ん"; i += 2; continue; }
      if (n1 === "n") {
        const n2 = rest[2];
        // A trailing "nn" might still be the start of んな/んに…, so it
        // waits for the next key rather than committing to ん.
        if (n2 === undefined) { if (final) { out += "ん"; i += 2; continue; } out += input.slice(i); break; }
        // "konnichiha": first n is ん, the second starts に.
        if (isVowel(n2)) { out += "ん"; i += 1; continue; }
        out += "ん"; i += 2; continue;
      }
      if (n1 === undefined) { if (final) { out += "ん"; i++; continue; } out += input.slice(i); break; }
      if (!isVowel(n1) && n1 !== "y") { out += "ん"; i++; continue; }
    }

    // Doubled consonant → っ ("kitte", "matcha").
    if (isConsonant(c) && c !== "n" && (n1 === c || (c === "t" && n1 === "c" && rest[2] === "h"))) {
      out += "っ"; i++; continue;
    }

    let matched = false;
    for (let len = 4; len >= 1; len--) {
      const key = rest.slice(0, len);
      if (key.length === len && TABLE[key]) { out += TABLE[key]; i += len; matched = true; break; }
    }
    if (matched) continue;

    if (!final && PREFIXES.has(rest)) { out += input.slice(i); break; }
    out += raw;
    i++;
  }
  return out;
}

/** カタカナ → ひらがな, so an answer typed in katakana still matches. */
export function toHiragana(s) {
  return s.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}
