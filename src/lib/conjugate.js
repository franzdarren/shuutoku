/* Rule-based conjugation for the Conjugation Dojo. Every form is derived from
   the dictionary form and the word's class, the same way you'd do it on
   paper. Nothing is a lookup table of answers, so adding a word to
   data/dojo-words.json is all it takes to drill it.

   Word classes:
     v1   Group 1 / godan (書く, 話す, 帰る)
     v2   Group 2 / ichidan (食べる, 見る)
     vs   する and Noun+する (勉強する)
     vk   来る
     i    い-adjective (高い, いい)
     na   な-adjective, stored without な (静か)

   Since the conjugating part of a word is always kana, the same string
   operation produces both the kana answer and the kanji spelling: 書く and
   かく both end in く. 来る is the one exception (its stem's reading
   changes), handled separately. */

const ROW = {
  a: "わかがさたなばまら",
  i: "いきぎしちにびみり",
  u: "うくぐすつぬぶむる",
  e: "えけげせてねべめれ",
  o: "おこごそとのぼもろ",
};
const shift = (ch, row) => ROW[row][ROW.u.indexOf(ch)];

const TE = { う: "って", つ: "って", る: "って", く: "いて", ぐ: "いで", す: "して", ぬ: "んで", ぶ: "んで", む: "んで" };

export const FORMS = [
  { id: "masu", jp: "ます形", label: "Polite", hint: "does (polite)", verb: true, group: "basic" },
  { id: "masen", jp: "ません", label: "Polite negative", hint: "doesn't (polite)", verb: true, group: "basic" },
  { id: "mashita", jp: "ました", label: "Polite past", hint: "did (polite)", verb: true, group: "basic" },
  { id: "nai", jp: "ない形", label: "Negative", hint: "doesn't / isn't", verb: true, adj: true, group: "basic" },
  { id: "ta", jp: "た形", label: "Past", hint: "did / was", verb: true, adj: true, group: "basic" },
  { id: "nakatta", jp: "なかった", label: "Past negative", hint: "didn't / wasn't", verb: true, adj: true, group: "basic" },
  { id: "te", jp: "て形", label: "Te-form", hint: "and… / please…", verb: true, adj: true, group: "basic" },
  { id: "potential", jp: "可能形", label: "Potential", hint: "can do", verb: true, group: "n4" },
  { id: "volitional", jp: "意向形", label: "Volitional", hint: "let's / I'll", verb: true, group: "n4" },
  { id: "ba", jp: "ば形", label: "Ba-conditional", hint: "if (ば)", verb: true, adj: true, group: "n4" },
  { id: "tara", jp: "たら形", label: "Tara-conditional", hint: "if / when (たら)", verb: true, adj: true, group: "n4" },
  { id: "passive", jp: "受身形", label: "Passive", hint: "is done (to)", verb: true, group: "n4" },
  { id: "causative", jp: "使役形", label: "Causative", hint: "make / let do", verb: true, group: "n4" },
  { id: "causPassive", jp: "使役受身形", label: "Causative-passive", hint: "is made to do", verb: true, group: "n4" },
  { id: "imperative", jp: "命令形", label: "Imperative", hint: "do it! (command)", verb: true, group: "n4" },
  { id: "prohibitive", jp: "禁止形", label: "Prohibitive", hint: "don't! (command)", verb: true, group: "n4" },
  { id: "sou", jp: "そう（様態）", label: "Looks like", hint: "looks… / about to…", verb: true, adj: true, group: "n4" },
  { id: "adverb", jp: "副詞形", label: "Adverb", hint: "…-ly (to do it X-ly)", adj: true, group: "basic" },
];
export const FORM_BY_ID = Object.fromEntries(FORMS.map((f) => [f.id, f]));

export const isVerb = (w) => w.type === "v1" || w.type === "v2" || w.type === "vs" || w.type === "vk";
export const formApplies = (form, w) => (isVerb(w) ? !!form.verb : !!form.adj);

/* する and 来る: kana forms of the bare verb. */
const SURU = {
  masu: "します", masen: "しません", mashita: "しました", nai: "しない", nakatta: "しなかった",
  te: "して", ta: "した", tara: "したら", potential: "できる", volitional: "しよう", ba: "すれば",
  passive: "される", causative: "させる", causPassive: "させられる", imperative: "しろ",
  prohibitive: "するな", sou: "しそう",
};
const SURU_ALT = { imperative: ["せよ"] };
const KURU = {
  masu: "きます", masen: "きません", mashita: "きました", nai: "こない", nakatta: "こなかった",
  te: "きて", ta: "きた", tara: "きたら", potential: "こられる", volitional: "こよう", ba: "くれば",
  passive: "こられる", causative: "こさせる", causPassive: "こさせられる", imperative: "こい",
  prohibitive: "くるな", sou: "きそう",
};

/** One string through one form, for the classes whose conjugating part is
 *  plain kana at the end (v1, v2, i, na). Returns [primary, ...alternatives]. */
function inflect(s, type, form, special) {
  if (type === "v1") {
    const end = s.slice(-1);
    const stem = s.slice(0, -1);
    const a = stem + shift(end, "a");
    const i = stem + shift(end, "i");
    const e = stem + shift(end, "e");
    const te = special === "iku" ? stem + "って" : stem + TE[end];
    const ta = te.slice(0, -1) + (te.endsWith("で") ? "だ" : "た");
    switch (form) {
      case "masu": return [i + "ます"];
      case "masen": return [i + "ません"];
      case "mashita": return [i + "ました"];
      case "nai": return [a + "ない"];
      case "nakatta": return [a + "なかった"];
      case "te": return [te];
      case "ta": return [ta];
      case "tara": return [ta + "ら"];
      case "potential": return [e + "る"];
      case "volitional": return [stem + shift(end, "o") + "う"];
      case "ba": return [e + "ば"];
      case "passive": return [a + "れる"];
      case "causative": return [a + "せる"];
      // The short される form is the standard Group 1 one, except after す
      // (話させられる), where the short form would be さされる.
      case "causPassive": return end === "す" ? [a + "せられる"] : [a + "される", a + "せられる"];
      case "imperative": return [e];
      case "prohibitive": return [s + "な"];
      case "sou": return [i + "そう"];
    }
  }
  if (type === "v2") {
    const stem = s.slice(0, -1);
    const table = {
      masu: "ます", masen: "ません", mashita: "ました", nai: "ない", nakatta: "なかった", te: "て",
      ta: "た", tara: "たら", potential: "られる", volitional: "よう", ba: "れば", passive: "られる",
      causative: "させる", causPassive: "させられる", imperative: "ろ", sou: "そう",
    };
    if (form === "prohibitive") return [s + "な"];
    return [stem + table[form]];
  }
  if (type === "i") {
    // いい conjugates from its older form よい: よくない, よかった, よさそう.
    const base = special === "ii" ? s.slice(0, -2) + "よい" : s;
    const stem = base.slice(0, -1);
    const table = {
      nai: "くない", ta: "かった", nakatta: "くなかった", te: "くて", ba: "ければ",
      tara: "かったら", adverb: "く", sou: special === "ii" ? "さそう" : "そう",
    };
    return [stem + table[form]];
  }
  if (type === "na") {
    const table = {
      nai: ["じゃない", "ではない"], ta: ["だった"], nakatta: ["じゃなかった", "ではなかった"],
      te: ["で"], ba: ["なら", "ならば"], tara: ["だったら"], adverb: ["に"], sou: ["そう"],
    };
    return table[form].map((t) => s + t);
  }
  return [];
}

/** All accepted answers for `word` in `form`: { kana: [...], kj: [...] },
 *  primary first. */
export function conjugate(word, form) {
  if (word.type === "vs" || word.type === "vk") {
    const pk = word.kana.slice(0, -2);
    const pj = word.kj.slice(0, -2);
    if (word.type === "vs") {
      const forms = [SURU[form], ...(SURU_ALT[form] || [])];
      return { kana: forms.map((f) => pk + f), kj: forms.map((f) => pj + f) };
    }
    // 来る: the reading of 来 itself changes (こ/き/く), so the kanji answer
    // is 来 + whatever follows the first kana of the reading.
    const f = KURU[form];
    return { kana: [pk + f], kj: [pj + "来" + f.slice(1)] };
  }
  return { kana: inflect(word.kana, word.type, form, word.special), kj: inflect(word.kj, word.type, form, word.special) };
}

/** Group 1 verbs that end in -iru / -eru and so look like Group 2. */
const I_OR_E_ROW = new Set([...ROW.i, ...ROW.e, "じ", "ぜ", "ぢ", "で", "ぴ", "ぺ", "ひ", "へ", "み", "め"]);
export function isGroupTrap(w) {
  return w.type === "v1" && w.kana.endsWith("る") && I_OR_E_ROW.has(w.kana.slice(-2, -1));
}

export function classLabel(w) {
  return {
    v1: "Group 1 verb (う-verb / godan)",
    v2: "Group 2 verb (る-verb / ichidan)",
    vs: "Group 3 verb (irregular する)",
    vk: "Group 3 verb (irregular 来る)",
    i: "い-adjective",
    na: "な-adjective",
  }[w.type];
}

/** The rule that produced the answer, phrased for this particular word.
 *  HTML (only <b>), rendered as such. */
export function explain(w, form) {
  const t = w.type;
  if (t === "v1") {
    const end = w.kana.slice(-1);
    const a = shift(end, "a"), i = shift(end, "i"), e = shift(end, "e"), o = shift(end, "o");
    const g = "Group 1: ";
    const wa = end === "う" ? " Verbs ending in う use <b>わ</b>, not あ." : "";
    const teRule = w.special === "iku"
      ? "行く is the one exception: <b>いって</b>, not いいて"
      : ({
          う: "う, つ, る → <b>って</b>", つ: "う, つ, る → <b>って</b>", る: "う, つ, る → <b>って</b>",
          く: "く → <b>いて</b>", ぐ: "ぐ → <b>いで</b>", す: "す → <b>して</b>",
          ぬ: "ぬ, ぶ, む → <b>んで</b>", ぶ: "ぬ, ぶ, む → <b>んで</b>", む: "ぬ, ぶ, む → <b>んで</b>",
        })[end];
    switch (form) {
      case "masu": case "masen": case "mashita": case "sou":
        return g + `change the final ${end} to the い-row (<b>${i}</b>) to get the stem, then add ${{ masu: "ます", masen: "ません", mashita: "ました", sou: "そう" }[form]}.`;
      case "nai": case "nakatta":
        return g + `change ${end} to the あ-row (<b>${a}</b>) and add ${form === "nai" ? "ない" : "なかった"}.` + wa;
      case "te": return g + "the て-form depends on the last kana: " + teRule + ".";
      case "ta": return g + "same sound change as the て-form, with た／だ instead of て／で. " + teRule.replace(/って|いて|いで|して|んで/g, (m) => m.replace("て", "た").replace("で", "だ")) + ".";
      case "tara": return g + "take the た-form and add ら.";
      case "potential": return g + `change ${end} to the え-row (<b>${e}</b>) and add る.`;
      case "volitional": return g + `change ${end} to the お-row (<b>${o}</b>) and add う.`;
      case "ba": return g + `change ${end} to the え-row (<b>${e}</b>) and add ば.`;
      case "passive": return g + `change ${end} to the あ-row (<b>${a}</b>) and add れる.` + wa;
      case "causative": return g + `change ${end} to the あ-row (<b>${a}</b>) and add せる.` + wa;
      case "causPassive":
        return end === "す"
          ? g + `あ-row (<b>${a}</b>) + せられる. Verbs ending in す can't use the short される form (it would be さされる).`
          : g + `あ-row (<b>${a}</b>) + される, the usual short form. The long form ${a}せられる is also correct.` + wa;
      case "imperative": return g + `change ${end} to the え-row (<b>${e}</b>), and that's it.`;
      case "prohibitive": return "Any verb: dictionary form + <b>な</b>.";
    }
  }
  if (t === "v2") {
    const add = {
      masu: "ます", masen: "ません", mashita: "ました", nai: "ない", nakatta: "なかった", te: "て", ta: "た",
      tara: "たら", potential: "られる", volitional: "よう", ba: "れば", passive: "られる", causative: "させる",
      causPassive: "させられる", imperative: "ろ", sou: "そう",
    }[form];
    if (form === "prohibitive") return "Any verb: dictionary form + <b>な</b>.";
    let s = `Group 2: drop る and add <b>${add}</b>.`;
    if (form === "potential") s += " Potential and passive look the same for Group 2.";
    if (form === "ba") s += " (Not ～らば.)";
    return s;
  }
  if (t === "vs") return "する is irregular: <b>" + SURU[form] + "</b>." + (form === "potential" ? " The potential of する is a different verb, できる." : "") + (w.kana !== "する" ? " A Noun + する verb just conjugates the する part." : "");
  if (t === "vk") return "来る is irregular, and the reading of 来 changes with the form: <b>" + KURU[form] + "</b>.";
  if (t === "i") {
    const ii = w.special === "ii" ? " いい is irregular: it conjugates from よい, so よ- replaces い-." : "";
    const add = { nai: "くない", ta: "かった", nakatta: "くなかった", te: "くて", ba: "ければ", tara: "かったら", adverb: "く", sou: "そう" }[form];
    return `い-adjective: drop the final い and add <b>${add}</b>.` + ii + (form === "sou" && w.special === "ii" ? " Note よ<b>さ</b>そう." : "");
  }
  if (t === "na") {
    const add = { nai: "じゃない (or ではない)", ta: "だった", nakatta: "じゃなかった (or ではなかった)", te: "で", ba: "なら", tara: "だったら", adverb: "に", sou: "そう" }[form];
    const trap = w.kana.endsWith("い") ? ` ${w.kj} ends in い but is a な-adjective, so don't drop the い.` : "";
    return `な-adjective: add <b>${add}</b> to the stem.` + trap;
  }
  return "";
}

/** Splits kanji spelling against its reading into ruby markup by peeling off
 *  the shared kana ending (送り仮名): 書かない／かかない → 書(か)かない. */
export function rubyFor(kj, kana) {
  if (kj === kana) return kj;
  let n = 0;
  while (n < kj.length && n < kana.length && kj[kj.length - 1 - n] === kana[kana.length - 1 - n]) n++;
  const head = kj.slice(0, kj.length - n);
  const reading = kana.slice(0, kana.length - n);
  if (!head) return kj;
  return `<ruby>${head}<rt>${reading}</rt></ruby>${kj.slice(kj.length - n)}`;
}
