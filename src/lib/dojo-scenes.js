/* Example scenes for the Conjugation Dojo: a short line or two of
   Japanese with a blank where the conjugated word goes, so each drill shows
   the form doing its actual job (〜させられるのが嫌でした, 〜ばいいですよ)
   rather than floating free.

   A scene is a frame (owned by the form: it supplies the grammar around the
   blank) plus a phrase from the word (its object or subject: 手紙を,
   電車に, 駅前のレストラン). Frames are written so that the frame decides
   the grammar and the word decides the meaning.

   Not every frame suits every word. "Tired, so I won't press the button"
   is grammatical nonsense. So a word can skip a frame, or replace it with a
   sentence of its own (`s`). The forms whose frames only make sense for some
   verbs (passive, causative, causative-passive, imperative, prohibitive)
   are opt-in per word through `ok`. When nothing fits, there's no scene,
   and the drill simply shows the word on its own.

   Text uses the same [漢字|かな] furigana shorthand as the content
   generators. ＿＿ marks the blank. */

const BLANK = "＿＿";

// Two-line frames are a quick exchange: 田中 asks, 山田 answers. A line
// with an empty speaker is narration.
const VERB = {
  masu: [["田中", "[明日|あした]は[何|なに]をしますか。"], ["山田", "{o}＿＿。"]],
  masen: [["山田", "[今日|きょう]は[疲|つか]れたので、{o}＿＿。"]],
  mashita: [["田中", "[昨日|きのう]は[何|なに]をしましたか。"], ["山田", "{o}＿＿。"]],
  nai: [["田中", "[今日|きょう]は{o}＿＿の？"], ["山田", "うん、ちょっと[疲|つか]れてて。"]],
  ta: [["田中", "[昨日|きのう]、[何|なに]してた？"], ["山田", "{o}＿＿よ。"]],
  nakatta: [["田中", "[昨日|きのう]、{o}＿＿の？"], ["山田", "うん、[時間|じかん]がなくて。"]],
  te: [["", "{o}＿＿ください。"]],
  potential: [["田中", "[明日|あした]、{o}＿＿？"], ["山田", "うん、たぶん[大丈夫|だいじょうぶ]。"]],
  volitional: [["田中", "{o}＿＿か。"], ["山田", "うん、そうしよう。"]],
  ba: [["田中", "どうすればいいですか。"], ["山田", "{o}＿＿いいですよ。"]],
  tara: [["山田", "{o}＿＿、[連絡|れんらく]してくださいね。"]],
  passive: [["山田", "[弟|おとうと]に[勝手|かって]に{o}＿＿のは[嫌|いや]です。"]],
  causative: [["", "[田中|たなか][先生|せんせい]は、[学生|がくせい]に{o}＿＿。"]],
  causPassive: [["山田", "[子|こ]どものころ、[母|はは]に{o}＿＿のが[嫌|いや]でした。"]],
  imperative: [["山田", "[父|ちち]に「[早|はや]く{o}＿＿！」と[言|い]われました。"]],
  prohibitive: [["山田", "[父|ちち]に「[勝手|かって]に{o}＿＿！」と[言|い]われました。"]],
};
// Things that happen rather than things you do (終わる, 止まる, 笑う).
const VERB_NV = {
  masu: [["田中", "{o}もうすぐ＿＿よ。"]],
  masen: [["田中", "{o}なかなか＿＿ね。"]],
  mashita: [["田中", "さっき{o}＿＿。"]],
  nai: [["田中", "{o}なかなか＿＿ね。"]],
  ta: [["田中", "さっき{o}＿＿よ。"]],
  nakatta: [["山田", "[結局|けっきょく]、{o}＿＿。"]],
  te: [["山田", "{o}＿＿しまいました。"]],
  tara: [["山田", "{o}＿＿、すぐ[教|おし]えてください。"]],
  sou: [["田中", "{o}＿＿ですね。"]],
};
const OPT_IN = new Set(["passive", "causative", "causPassive", "imperative", "prohibitive"]);

const ADJ = {
  nai: [["田中", "{s}、どう？"], ["山田", "うーん、あまり＿＿よ。"]],
  ta: [["田中", "{s}、どうだった？"], ["山田", "[思|おも]ったより＿＿よ。"]],
  nakatta: [["田中", "{s}、どうだった？"], ["山田", "それが、[全然|ぜんぜん]＿＿んだ。"]],
  te: [["山田", "{s}が＿＿{te}"]],
  sou: [["田中", "{s}は＿＿ですね。"]],
};
// "If…" sentences depend on whether the adjective is good news or bad:
// you worry about the hotel room being small, but hope the teacher is kind.
const ADJ_BAD = {
  ba: [["田中", "もし{s}が＿＿、どうしますか。"]],
  tara: [["山田", "{s}、＿＿どうしよう。"]],
};
const ADJ_GOOD = {
  ba: [["山田", "{s}が＿＿いいんですけどね。"]],
  tara: [["山田", "{s}が＿＿、うれしいな。"]],
};

const ruby = (s) => s.replace(/\[([^|\]]+)\|([^\]]+)\]/g, "<ruby>$1<rt>$2</rt></ruby>");
const asLines = (v) => (typeof v === "string" ? [["", v]] : v);

/** The scene for `word` in `formId`, or null when there isn't a natural
 *  one. Lines come back as { who, html } with the blank still in place
 *  (see fillScene). */
export function sceneFor(word, formId) {
  let frame = word.s?.[formId];
  if (!frame) {
    if (word.skip?.includes(formId)) return null;
    const verb = ["v1", "v2", "vs", "vk"].includes(word.type);
    if (verb) {
      if (OPT_IN.has(formId) && !word.ok?.includes(formId)) return null;
      frame = (word.nv ? VERB_NV : VERB)[formId];
    } else {
      frame = formId === "adverb" ? word.adv : word.subj && (ADJ[formId] || (word.neg ? ADJ_BAD : ADJ_GOOD)[formId]);
    }
  }
  if (!frame) return null;
  const fill = (t) => t.replace("{o}", word.o || "").replace("{s}", word.subj || "").replace("{te}", word.te || "。");
  return asLines(frame).map(([who, text]) => ({ who, html: ruby(fill(text)) }));
}

/** Swaps the blank for `inner` (an HTML string): an empty slot while you
 *  answer, the correct form once you have. */
export function fillScene(lines, inner) {
  return lines.map((l) => ({ ...l, html: l.html.replace(BLANK, inner) }));
}
