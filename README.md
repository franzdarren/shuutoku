# 習得 Shuutoku

> # ⚠️ READ THIS FIRST
>
> ## **ABSOLUTELY ZERO TESTING HAS BEEN DONE ON THIS MATERIAL.**
>
> Nobody has sat the JLPT using this and reported back. None of the content has
> been reviewed by a teacher, a native speaker, or anyone qualified. The grammar
> explanations, the furigana, the kanji readings, the quiz answers and the mock
> exam scoring are all unverified. Some of it is definitely wrong. I just don't
> know which parts yet.
>
> ### **Use official materials as your primary source. Not this.**
>
> This is a supplement at best. If you are actually sitting N4, buy the real thing:
>
> - **[Official JLPT practice workbooks](https://www.jlpt.jp/e/reference/books.html)**
>   — 公式問題集, published by Bonjinsha, roughly ¥700 per level. Real past-style
>   papers written by the people who write the exam. Buy links are on that page.
> - **[Free official sample questions](https://www.jlpt.jp/e/samples/sampleindex.html)**
>   — every level, straight from the JLPT site, costs nothing.
> - **[jlpt.jp](https://www.jlpt.jp/e/)** — the actual test site. Registration
>   dates, format, scoring rules.
>
> Also worth owning: Minna no Nihongo, Genki II, Sou Matome N4, Shin Kanzen
> Master N4. Widely available from Amazon, Kinokuniya, OMG Japan and White Rabbit.
>
> JLPT publishes no official grammar or kanji list, so *every* third-party study
> list, this one included, is reverse-engineered guesswork. Treat it that way.

A JLPT N4 review handbook. Grammar deep-dive, the full N4 kanji set, reading
passages, a conversation lab, and a timed mock exam. No account, no backend,
no tracking.

Built because I was stuck in the 60s on N4 mocks and got tired of flipping
between Minna no Nihongo, Genki and Sou Matome to chase the same handful of
weak points.

**Stack:** Claude Pro, Monster Energy, React19.

**Contents:** 11 modules / 63 grammar points, 183 kanji, 6 reading passages,
34 conversation scenarios, 142 phrases, ~480 quiz questions.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # -> dist/
npm run preview   # serve the build locally
npm run lint      # oxlint
```

Needs a server. Opening `dist/index.html` over `file://` won't work: ES modules
and the service worker both require http.

## Layout

```
src/
  data/*.json        All content. Edit these to add material, no code needed.
  data/index.js      Merges the JSON, assigns stable quiz ids, derived helpers.
  components/
    sections/        One component per sidebar entry, lazy-loaded.
    Quiz.jsx         Shared multiple-choice widget. Scoring is global.
    JpText.jsx       Renders ruby furigana AND marks text as lookup-able.
    Dialogue.jsx     Chat-bubble conversation renderer.
  context/
    SettingsContext  Furigana, dark mode, text size, JP font. Persisted.
    QuizContext      Progress and scores across every section. Persisted.
    LookupContext    Text-selection listener behind the vocab tooltip.
  lib/
    dictionary.js    Local glossary first, then Jisho.
    speech.js        Web Speech API wrapper for the dialogues.
api/jisho.js         Vercel Edge function proxying Jisho in production.
scripts/             One-off data maintenance. See below.
```

### Content format

Everything lives in `src/data/*.json`. Copy the shape of an existing entry.
Furigana is inline: `<ruby>漢字<rt>かんじ</rt></ruby>`.

The one rule worth knowing: **some fields render as HTML and some as plain
text.** Ruby markup in a plain-text field shows up on screen as literal
`<ruby>` tags. Plain-text fields are `jpTitle`, `reading`, `enTitle`, `tip`,
`label`, `who`, `setup`, `roleplay`, `cat`, `catEn`. Everything else
(`explain`, `formation`, `examples[].jp`, `quiz[].q`, `choices`, `ex`, `why`)
is rendered as HTML and should carry furigana.

Quiz items are `{ q, choices[4], a, ex, why[] }` where `a` is the index of the
correct choice and `why[a]` must be `null`.

### Scripts

`scripts/fill-furigana.mjs` is the one you'll actually use. It adds missing
furigana without guessing: it harvests every reading already present in the
corpus, keeps only the ones that are unambiguous, and applies those. Run it
dry first.

```bash
node scripts/fill-furigana.mjs           # dry run + report
node scripts/fill-furigana.mjs --list    # every reading it would apply
node scripts/fill-furigana.mjs --write   # apply
```

It refuses to guess in three situations, all of which exist because guessing
produced wrong readings: a kanji with more than one reading in the corpus
(降 is both ふ and お), a kanji whose reading depends on what precedes it
(間 is ま in 間に合う but あいだ in この間), and any run it can't segment
completely. Those are left for a human. The other scripts are historical
one-offs.

## Deploy

Static build, host it anywhere. Vercel needs no config: it detects Vite and
picks up `api/jisho.js` automatically.

That function exists because Jisho's API sends no CORS headers, so the browser
can't call it directly. It runs on the Edge runtime specifically, because
Jisho's WAF 403s Vercel's regional Node IP ranges but not Edge. If lookups
break in production, check that first. Without the proxy the app still works;
the tooltip just falls back to the local glossary and a "search on Jisho" link.

## A caveat worth stating

This is a static site, so every quiz answer ships to the browser in plain
JSON. `"a": 1` next to a question is the correct choice. You cannot fix that
client-side, and obfuscating it would just bloat the bundle for no benefit.
If you fork this to run a class or produce scores anyone else relies on,
you need server-side grading. For solo study it doesn't matter, and the mock
exam certificate is labelled 模擬 for the same reason.

## Credits

Everything external this thing touches, and what it's used for:

- **[Jisho.org](https://jisho.org)** ([API](https://jisho.org/api/v1/search/words?keyword=%E6%97%A5%E6%9C%AC%E8%AA%9E))
  — the highlight-a-word-to-look-it-up tooltip, whenever the word isn't in the
  local glossary. Unofficial and undocumented but long-standing. Called through
  `api/jisho.js` because it sends no CORS headers. Please don't hammer it.
- **[KanjiVG](https://kanjivg.tagaini.net/)**
  ([repo](https://github.com/KanjiVG/kanjivg)) — the stroke-order diagrams in
  the kanji modal. Licensed **CC BY-SA 3.0**, which means attribution is
  required, not optional. Credit is shown in the modal itself as well as here.
  Copyright © Ulrich Apel.
  SVGs straight from GitHub.
- **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)**
  — read-aloud on the dialogues. Browser built-in, so voice quality depends
  entirely on the user's OS.

Reference lists used while deciding grammar coverage:
[jlptsensei.com](https://jlptsensei.com/jlpt-n4-grammar-list/) and
[game-gengo.com](https://www.game-gengo.com/pages/jlpt-n4-grammar-list). Lesson
cross-references point at Minna no Nihongo, Genki and Sou Matome; no text from
any of them is reproduced here.

No API keys anywhere. Nothing needs an account.

## License

Do whatever you want with it.
