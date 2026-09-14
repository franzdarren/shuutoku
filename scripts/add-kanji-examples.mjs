// One-off enrichment: each kanji entry only had a single example compound.
// This adds a second example (covering the reading — on or kun — that the
// first example didn't already show, where practical) and restructures
// `word` (a single string) into `examples: [{word, reading, meaning, type}]`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const kanjiPath = path.join(__dirname, "..", "src", "data", "kanji.json");

// One extra [word, reading, meaning] triple per kanji, in kanjiFocus order.
const extra = [
  ["同時に","どうじに","at the same time"],["発表","はっぴょう","presentation, announcement"],
  ["地下鉄","ちかてつ","subway"],["主に","おもに","mainly, primarily"],
  ["話題","わだい","topic"],["用意","ようい","preparation"],
  ["不安","ふあん","anxiety, unease"],["用いる","もちいる","to use, employ"],
  ["度に","たびに","each time, on every occasion"],["公開","こうかい","making public"],
  ["以下","いか","below, less than"],["世の中","よのなか","the world, society"],
  ["正月","しょうがつ","New Year"],["心","こころ","heart, mind"],
  ["限界","げんかい","limit"],["集合","しゅうごう","gathering, assembly"],
  ["別れる","わかれる","to part ways"],
  ["食品","しょくひん","foodstuff"],["計る","はかる","to measure"],
  ["必死","ひっし","frantic, desperate"],["特に","とくに","especially, particularly"],
  ["私立","しりつ","private (institution)"],["朝食","ちょうしょく","breakfast"],
  ["無料","むりょう","free of charge"],["建設","けんせつ","construction"],
  ["急ぐ","いそぐ","to hurry"],["中止","ちゅうし","cancellation"],
  ["切る","きる","to cut"],["研ぐ","とぐ","to sharpen, polish"],
  ["追究","ついきゅう","pursuit (of truth), further study"],["着る","きる","to wear"],
  ["品質","ひんしつ","quality"],["産む","うむ","to give birth"],
  ["引く","ひく","to pull"],["音声","おんせい","audio, voice"],
  ["試す","ためす","to try, test"],["銀色","ぎんいろ","silver color"],
  ["経験","けいけん","experience"],["労働","ろうどう","labor"],
  ["英会話","えいかいわ","English conversation"],["夜間","やかん","nighttime"],
  ["注ぐ","そそぐ","to pour"],["日光","にっこう","sunlight"],
  ["最悪","さいあく","the worst"],["図る","はかる","to plan, scheme"],
  ["歩く","あるく","to walk"],["用紙","ようし","form, sheet"],
  ["黒板","こくばん","blackboard"],["赤道","せきどう","the equator"],
  ["青年","せいねん","young man, youth"],["屋上","おくじょう","rooftop"],
  ["特色","とくしょく","characteristic feature"],["走者","そうしゃ","runner"],
  ["習う","ならう","to learn (from someone)"],["便り","たより","news, correspondence"],
  ["服装","ふくそう","attire"],["夕日","ゆうひ","evening sun"],
  ["土曜日","どようび","Saturday"],["講堂","こうどう","auditorium, lecture hall"],
  ["説く","とく","to explain, preach"],["乗車","じょうしゃ","boarding (a vehicle)"],
  ["会う","あう","to meet"],["事故","じこ","accident"],
  ["自ら","みずから","oneself, personally"],["社会","しゃかい","society"],
  ["若者","わかもの","young person"],["卒業","そつぎょう","graduation"],
  ["方法","ほうほう","method"],["新しい","あたらしい","new"],
  ["会場","かいじょう","venue"],["店員","てんいん","shop clerk"],
  ["立派","りっぱ","splendid, admirable"],["開始","かいし","commencement, start"],
  ["選手","せんしゅ","athlete, player"],["努力","どりょく","effort"],
  ["問う","とう","to ask, question"],["代わりに","かわりに","instead of"],
  ["明るい","あかるい","bright"],["動く","うごく","to move"],
  ["京都","きょうと","Kyoto"],["目的","もくてき","purpose, goal"],
  ["通う","かよう","to commute"],["言語","げんご","language"],
  ["理由","りゆう","reason"],["体育","たいいく","physical education"],
  ["田園","でんえん","countryside, rural fields"],["作文","さくぶん","composition, essay"],
  ["勉強","べんきょう","study"],["支持","しじ","support"],
  ["野原","のはら","field, meadow"],["意思","いし","intention"],
  ["家","いえ","house, home"],["多分","たぶん","probably"],
  ["安全","あんぜん","safety"],["美容院","びよういん","beauty salon"],
  ["教室","きょうしつ","classroom"],["文章","ぶんしょう","sentence, writing"],
  ["元","もと","origin, basis"],["重要","じゅうよう","important"],
  ["近所","きんじょ","neighborhood"],["参考","さんこう","reference"],
  ["画面","がめん","screen"],["海外","かいがい","overseas"],
  ["販売","はんばい","sales"],["知識","ちしき","knowledge"],
  ["道路","どうろ","road"],["動物","どうぶつ","animal"],
  ["使用","しよう","use, usage"],["始発","しはつ","first train"],
  ["運転","うんてん","driving"],["最終","さいしゅう","final, last"],
  ["台所","だいどころ","kitchen"],["広告","こうこく","advertisement"],
  ["住所","じゅうしょ","address"],["真ん中","まんなか","the middle"],
  ["有る","ある","to exist, have (formal written form)"],["人口","じんこう","population"],
  ["少年","しょうねん","boy, youth"],["町内","ちょうない","in the neighborhood, town"],
  ["料金","りょうきん","fee, charge"],["工事","こうじ","construction"],
  ["空","そら","sky"],["送料","そうりょう","shipping fee"],
  ["転校","てんこう","changing schools"],["満足","まんぞく","satisfaction"],
  ["音楽","おんがく","music"],["起立","きりつ","standing up"],
  ["開店","かいてん","shop opening"],["病","やまい","illness (literary)"],
  ["所","ところ","place"],["期待","きたい","expectation"],
  ["民族","みんぞく","ethnic group"],["早退","そうたい","leaving early"],
  ["映る","うつる","to be reflected, projected"],["親しい","したしい","close, intimate (friend)"],
  ["好物","こうぶつ","favorite food"],["頭痛","ずつう","headache"],
  ["低下","ていか","decline, drop"],["医学","いがく","medicine (the study of)"],
  ["仕方","しかた","way of doing something"],["去る","さる","to leave, depart"],
  ["興味","きょうみ","interest"],["専門","せんもん","specialty, major"],
  ["写す","うつす","to copy, photograph"],["文字","もじ","character, letter"],
  ["回答","かいとう","response, answer"],["音","おと","sound"],
  ["帰国","きこく","returning to one's country"],["歌手","かしゅ","singer"],
  ["室内","しつない","indoor"],["太陽","たいよう","sun"],
  ["風","かぜ","wind"],["青春","せいしゅん","youth"],
  ["森林","しんりん","forest, woodland"],["大使館","たいしかん","embassy"],
  ["秋晴れ","あきばれ","clear autumn weather"],["林業","りんぎょう","forestry"],
  ["夏休み","なつやすみ","summer vacation"],["顔色","かおいろ","complexion"],
  ["短期","たんき","short-term"],["薬局","やっきょく","pharmacy"],
  ["洋食","ようしょく","Western food"],["旅","たび","journey, trip"],
  ["軽食","けいしょく","light meal"],["電池","でんち","battery"],
  ["遠慮","えんりょ","reservation, holding back"],["借金","しゃっきん","debt"],
  ["弱点","じゃくてん","weak point"],["牛肉","ぎゅうにく","beef"],
  ["賃貸","ちんたい","rental (property)"],["農村","のうそん","farming village"],
];

function kunRoots(kunStr) {
  if (!kunStr || kunStr === "—") return [];
  return kunStr.split("・").map((s) => s.replace(/\(.*?\)/g, ""));
}
function guessType(reading, kunStr) {
  const roots = kunRoots(kunStr);
  return roots.some((r) => r && reading.startsWith(r)) ? "kun" : "on";
}
function parseWord(wordStr) {
  const m = wordStr.match(/^(.+?)\s*\(([^)]+)\)\s*—\s*(.+)$/);
  if (!m) return { word: wordStr, reading: "", meaning: "" };
  return { word: m[1].trim(), reading: m[2].trim(), meaning: m[3].trim() };
}

const data = JSON.parse(fs.readFileSync(kanjiPath, "utf8"));
if (data.kanjiFocus.length !== extra.length) {
  throw new Error(`length mismatch: ${data.kanjiFocus.length} kanji vs ${extra.length} extra examples`);
}

data.kanjiFocus = data.kanjiFocus.map((k, i) => {
  const first = parseWord(k.word);
  const [word2, reading2, meaning2] = extra[i];
  const examples = [
    { ...first, type: guessType(first.reading, k.kun) },
    { word: word2, reading: reading2, meaning: meaning2, type: guessType(reading2, k.kun) },
  ];
  const { word, ...rest } = k;
  return { ...rest, examples };
});

fs.writeFileSync(kanjiPath, JSON.stringify(data, null, 2), "utf8");
console.log("Updated", data.kanjiFocus.length, "kanji entries with 2 examples each.");
