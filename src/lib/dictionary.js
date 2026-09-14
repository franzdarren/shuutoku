// Vocabulary lookup used by the highlight-to-look-up tooltip.
//
// 1. Exact match against a local glossary built from this app's own data
//    (reading-passage vocab lists + the N4 kanji list) — instant, offline.
// 2. Otherwise, Jisho.org's public search API — but jisho.org sends no
//    Access-Control-Allow-Origin header, so a direct browser fetch from any
//    other origin is blocked by CORS (confirmed by hand). We try it anyway
//    first (in case this is ever hosted somewhere that proxies it), then
//    fall back to a public CORS relay (api.allorigins.win) which fetches it
//    server-side and hands the JSON back to us.
// 3. If both network paths fail, the caller shows a "search on Jisho"
//    link-out instead of an inline definition.

const JISHO_ENDPOINT = "https://jisho.org/api/v1/search/words?keyword=";
const CORS_RELAY = "https://api.allorigins.win/raw?url=";

let localIndex = null; // Map<string, {jp, reading, en, source}>
const cache = new Map(); // term -> result promise

export function buildLocalIndex({ readingPassages = [], kanjiFocus = [] } = {}) {
  const index = new Map();
  readingPassages.forEach((p) => {
    (p.vocab || []).forEach((v) => {
      if (v.jp && !index.has(v.jp)) {
        index.set(v.jp, { jp: v.jp, reading: v.reading, en: v.en, source: "Reading Lab glossary" });
      }
    });
  });
  kanjiFocus.forEach((k) => {
    if (k.kj && !index.has(k.kj)) {
      index.set(k.kj, {
        jp: k.kj,
        reading: [k.on, k.kun].filter(Boolean).join(" / "),
        en: k.meaning,
        source: "N4 kanji list",
      });
    }
    if (k.word) {
      const wordText = k.word.replace(/\s*\([^)]*\)\s*$/, "").trim();
      if (wordText && !index.has(wordText)) {
        index.set(wordText, { jp: wordText, reading: "", en: k.word, source: "N4 kanji list" });
      }
    }
  });
  localIndex = index;
  return index;
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

async function fetchJisho(term) {
  const url = JISHO_ENDPOINT + encodeURIComponent(term);
  try {
    const res = await withTimeout(fetch(url, { mode: "cors" }), 3500);
    if (!res.ok) throw new Error("bad status");
    return await res.json();
  } catch {
    // Direct call almost always fails here (no CORS header on jisho.org) —
    // fall back to a relay that fetches it server-side for us.
    const res = await withTimeout(fetch(CORS_RELAY + encodeURIComponent(url)), 5000);
    if (!res.ok) throw new Error("bad status");
    return await res.json();
  }
}

/** Look up `term` (whatever the user highlighted). Returns:
 *  { status: 'local', entry } | { status: 'jisho', entries } | { status: 'none' }
 */
export async function lookupWord(term) {
  const clean = term.trim();
  if (!clean) return { status: "none" };

  if (localIndex && localIndex.has(clean)) {
    return { status: "local", entry: localIndex.get(clean) };
  }

  if (cache.has(clean)) return cache.get(clean);

  const promise = (async () => {
    try {
      const json = await fetchJisho(clean);
      const entries = (json.data || []).slice(0, 3).map((d) => ({
        word: (d.japanese && d.japanese[0] && (d.japanese[0].word || d.japanese[0].reading)) || clean,
        reading: (d.japanese && d.japanese[0] && d.japanese[0].reading) || "",
        jlpt: (d.jlpt && d.jlpt[0]) ? d.jlpt[0].replace("jlpt-", "").toUpperCase() : null,
        senses: (d.senses || []).slice(0, 2).map((s) => ({
          pos: (s.parts_of_speech || []).join(", "),
          english: (s.english_definitions || []).join("; "),
        })),
      }));
      if (!entries.length) return { status: "none" };
      return { status: "jisho", entries };
    } catch {
      return { status: "none" };
    }
  })();

  cache.set(clean, promise);
  return promise;
}

/** Only look at the fast local glossary — used to decide whether it's worth
 *  showing a "looking up…" state before the network call resolves. */
export function lookupLocal(term) {
  const clean = term.trim();
  return localIndex && localIndex.has(clean) ? localIndex.get(clean) : null;
}

export function jishoSearchUrl(term) {
  return "https://jisho.org/search/" + encodeURIComponent(term);
}
