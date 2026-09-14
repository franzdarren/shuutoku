# N4総復習 — N4 Review Handbook

A React rewrite of the original single-file HTML study handbook: grammar
deep-dive, kanji focus, reading lab, kaiwa (conversation) lab, and a mixed
quiz center for N4-level Japanese review.

## Running it

Requires [Node.js](https://nodejs.org) (any recent LTS).

```bash
npm install
npm run dev      # starts a local dev server, prints a URL like http://localhost:5173
```

Open the printed URL in a browser. There is no way to just double-click
`index.html` — the app needs a real dev/preview server so it can load its
JSON data files (browsers block that over `file://` for security reasons).

To build a static, deployable version:

```bash
npm run build     # outputs to dist/
npm run preview   # serves that build locally so you can check it
```

## Project layout

```
src/
  data/                   All content, as plain JSON — edit these to add
    grammar.json          material, no code changes needed.
    grammar-extra.json    (an extra "N4 essentials" module, kept separate
                           from the migrated original set)
    kanji.json
    reading.json
    kaiwa-tips.json
    kaiwa-phrasebank.json
    kaiwa-scenarios.json
    quiz.json
    index.js              Loads + merges the JSON files, small helpers.

  components/
    sections/             One component per sidebar section.
    Quiz.jsx               Shared multiple-choice quiz widget.
    JpText.jsx              Renders Japanese text (with <ruby> furigana)
                            and marks it as a highlight-to-look-up zone.
    VocabTooltip.jsx        The floating definition popup.
    Sidebar.jsx

  context/
    SettingsContext.jsx    Furigana / dark mode / text size (persisted).
    QuizContext.jsx        Shared quiz progress + score, across all sections.
    LookupContext.jsx      Global text-selection listener + tooltip state.

  lib/
    dictionary.js          Vocab lookup: local glossary first, then
                            Jisho.org (via our own dev-server proxy — see below).

vite.config.js             Proxies /api/jisho -> jisho.org (see below).
```

### Adding content

Every grammar point, kanji entry, reading passage, kaiwa scenario, and quiz
question lives in `src/data/*.json`. Open the relevant file, copy an
existing entry's shape, and edit it — no JavaScript required. Furigana is
written inline as `<ruby>漢字<rt>かんじ</rt></ruby>`.

### The highlight-to-look-up tooltip

In Reading Lab and Kaiwa Lab, highlighting any Japanese text shows a
floating popup with its reading and meaning:

1. First it checks this app's own glossary (built from the reading
   passages' vocab lists and the N4 kanji list) — instant, offline.
2. Otherwise it queries [Jisho.org](https://jisho.org)'s public API.
   Jisho's API does **not** send CORS headers, so a direct browser request
   from this app's origin is always blocked (confirmed by hand — you'll
   see a CORS error logged in the browser console the first time this path
   is hit; it's expected and harmless, not a sign anything is broken).
   Since this app is always served through Vite, `vite.config.js` proxies
   `/api/jisho` to `jisho.org` server-side, where CORS doesn't apply — that
   same-origin request is the primary, reliable path (works in both
   `npm run dev` and `npm run preview`). If this build is ever hosted
   somewhere without that proxy (e.g. deployed as a bare static site), it
   falls back to a direct cross-origin call and then a public CORS relay
   (`api.allorigins.win`) as a last resort — best-effort only, since that's
   a third-party service outside our control.
3. If every path fails (offline, etc.), the popup shows a
   "Search on Jisho ↗" link instead of an inline definition.

## Deploying (Vercel, free)

`api/jisho.js` is the production equivalent of the dev-only Vite proxy —
same `/api/jisho` path, same job (fetch Jisho.org server-side so CORS
doesn't apply), just running as a Vercel function instead of a Vite
dev-server proxy. `src/lib/dictionary.js` calls that same path either way,
so nothing else needs to change between dev and production.

It specifically runs on Vercel's **Edge Runtime** (`export const config =
{ runtime: "edge" }`), not the default regional Node.js runtime — found by
hand while deploying this: Jisho.org's own WAF returns a 403 to Vercel's
regional Node function IP ranges (consistently reproducible), but not to
the Edge Runtime's network. If lookups ever start failing again in
production, that block resurfacing (on a different IP range) is the first
thing to check.

Vercel auto-detects this as a Vite project (build command `npm run build`,
output `dist/`) and auto-detects `api/*.js` as serverless functions — no
`vercel.json` needed. Two ways to ship it, both free for a personal
project:

- **Dashboard (no CLI):** push this repo to GitHub, go to
  [vercel.com/new](https://vercel.com/new), sign in with GitHub, and import
  the repo. Deploys automatically on every push after that.
- **CLI:** `npx vercel --prod` from this folder (prompts a one-time login
  the first time).

## Where the original version went

The original single-file `index.html` + `data/*.js` version is kept in
`legacy/` for reference. `scripts/migrate-data.mjs` is the one-off script
that converted it into the JSON files under `src/data/` — re-run it if you
ever need to regenerate from `legacy/` again (it will overwrite
`grammar.json`, `kanji.json`, `reading.json`, `kaiwa-*.json`, and
`quiz.json`; `grammar-extra.json` is hand-written and untouched by it).

`scripts/add-furigana-to-grammar.mjs` is another one-off: it auto-generates
`<ruby>` furigana (via `kuroshiro` + `kuroshiro-analyzer-kuromoji`, a
morphological analyzer) for any grammar example sentence that doesn't have
any yet. It's already been run once — most examples now have furigana
throughout, not just the first few per point — but if you add new example
sentences without furigana, install those two packages
(`npm install --no-save kuroshiro kuroshiro-analyzer-kuromoji`) and re-run
it. Auto-generated readings are usually right but not guaranteed — spot
check anything added this way.
