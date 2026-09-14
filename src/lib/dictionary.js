// Vocabulary lookup used by the highlight-to-look-up tooltip.
//
// 1. Exact match against a local glossary built from this app's own data
//    (reading-passage vocab lists + the N4 kanji list) — instant, offline.
// 2. Otherwise, Jisho.org's public search API. Jisho sends no
//    Access-Control-Allow-Origin header, so a direct browser fetch from any
//    other origin is always blocked by CORS (confirmed by hand — this isn't
//    fixable from our side). Since this app is always served through Vite
//    (dev or preview, never a bare file://), vite.config.js proxies
//    /api/jisho to jisho.org server-side, where CORS doesn't apply at all —
//    that's the primary path and it's reliable. If this build is ever
//    hosted somewhere without that proxy, we fall back to a direct
//    cross-origin call (works if the host proxies it another way) and then
//    a public CORS relay as a last resort (best-effort — third-party
//    services like this rate-limit and go down).
// 3. If every network path fails, the caller shows a "search on Jisho"
//    link-out instead of an inline definition.

const SAME_ORIGIN_PROXY = "/api/jisho?keyword=";
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
  const encoded = encodeURIComponent(term);

  try {
    const res = await withTimeout(fetch(SAME_ORIGIN_PROXY + encoded), 4000);
    if (!res.ok) throw new Error("bad status");
    return await res.json();
  } catch {
    // No dev/preview proxy available (e.g. a bare static deploy) — fall
    // back to a direct cross-origin call, then a public relay. The browser
    // will log a CORS error in the console for the direct attempt when it
    // fails; that's expected and harmless — it's caught here regardless.
  }

  const url = JISHO_ENDPOINT + encoded;
  try {
    const res = await withTimeout(fetch(url), 3500);
    if (!res.ok) throw new Error("bad status");
    return await res.json();
  } catch {
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
