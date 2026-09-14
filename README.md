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
                            Jisho.org (via a CORS relay — see below).
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
   from this app's origin is blocked — confirmed by hand while building
   this. To make live lookups work anyway, failed direct requests fall
   back to a public CORS relay (`api.allorigins.win`), which fetches the
   Jisho response server-side and hands the JSON back to the browser. Only
   the highlighted Japanese text is sent, but it does pass through that
   third-party relay — swap `CORS_RELAY` in `src/lib/dictionary.js` for
   your own proxy if you'd rather not depend on it.
3. If both fail (offline, relay down, etc.), the popup shows a
   "Search on Jisho ↗" link instead of an inline definition.

## Where the original version went

The original single-file `index.html` + `data/*.js` version is kept in
`legacy/` for reference. `scripts/migrate-data.mjs` is the one-off script
that converted it into the JSON files under `src/data/` — re-run it if you
ever need to regenerate from `legacy/` again (it will overwrite
`grammar.json`, `kanji.json`, `reading.json`, `kaiwa-*.json`, and
`quiz.json`; `grammar-extra.json` is hand-written and untouched by it).
