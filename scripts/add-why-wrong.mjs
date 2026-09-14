// One-off: adds a `why` array (same length as `choices`, null at the
// correct index) to every grammar-module quiz question — a short reason
// *specific to each wrong choice*, not just why the right one is right.
// Keyed "moduleIndex-pointIndex-quizIndex" against the combined
// grammar.json + grammar-extra.json module list.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..", "src", "data");
const grammarPath = path.join(root, "grammar.json");
const extraPath = path.join(root, "grammar-extra.json");

// why[i] entries align with choices[i]; the correct index is null.
const WHY = {
"0-0-0": ["持ちます sounds like a one-time act of acquiring it, not an ongoing state of owning it.", null, "持ちました (past) says he acquired it at some point — not that he currently owns one.", "持ちませんでした is negative past — the opposite of what we want to say."],
"0-0-1": ["〜たり〜たりする lists a few example actions — it doesn't handle the 'right now' progressive meaning at all.", null, "〜てから means 'after doing X' — sequencing, not describing an ongoing action or habit.", "〜そうだ is a guess/hearsay marker, unrelated to progressive or habitual meaning."],
"0-1-0": [null, "着てはいけません forbids trying it on — the opposite of asking permission.", "着なければなりません says you must wear it — not what you want to ask.", "着ています states you are currently wearing it, not a request."],
"0-1-1": ["てはいいです isn't natural here — 〜てもいいです (permission) needs も, not は, and even then it would mean the opposite (allowed).", null, "てはおきます isn't a standard construction — おく attaches after て, not after ては.", "てはしまいます has the same problem — しまう pairs with て, not ては."],
"0-2-0": ["行ってもいいです means it's optional — the opposite of 'have to'.", "行きます is a plain statement of fact, missing the 'have to/must' obligation.", null, "行ってはいけません forbids going — the opposite meaning entirely."],
"0-2-1": ["持ってはいけません forbids bringing one — much stronger than 'don't have to'.", "持たなければなりません means the opposite: you must bring one.", null, "持っています just states you currently have one — unrelated to obligation."],
"0-3-0": [null, "たまえ is an old-fashioned command form (professor-to-student in fiction) — not a sequencing pattern.", "ながら needs the ます-stem (浴びながら), not the て-form, and would mean 'while', not 'after'.", "ば is a conditional ('if you shower'), not a sequencing word for 'after'."],
"0-3-1": ["たあとで is correct too but reads more neutral/formal — てから is the more natural pick for casual step-by-step instructions.", null, "ている describes an ongoing action or state, not a sequence of steps.", "てもいい grants permission — unrelated to sequencing instructions."],
"1-0-0": ["あげました would mean YOU did the favor for your friend — backwards from what happened.", null, "もらいませんでした is negative — it says you did NOT receive the favor, the opposite of what happened.", "This is just a flat statement with no sense of gratitude or favor at all."],
"1-0-1": ["あげました would mean you did the teaching for your mother — backwards.", null, "くれました needs が for the giver (母がくれました), not に, and shifts away from your own 'I asked for it' viewpoint.", "いました isn't a valid completion of 教えて — it doesn't attach meaningfully here."],
"1-1-0": ["写真を撮ります just states you'll take a photo — it doesn't ask the stranger for anything.", null, "写真を撮りたいです states your own wish, not a request directed at them.", "てはいけません forbids taking photos — the opposite of what you want."],
"1-1-1": [null, "てもいいです would mean giving HIM permission to study more, not expressing your own wish about him.", "なければなりません would express an obligation on the SPEAKER, not a wish about someone else.", "てあげます means doing the studying as a favor FOR him, not wanting him to do it himself."],
"1-2-0": [null, "なさい must come from the verb stem directly (勉強しなさい), not stack after the dictionary form する — 勉強するなさいと isn't grammatical.", "てから means 'after doing' — unrelated to reporting a command.", "たら is a conditional, unrelated to reporting what was said."],
"1-2-1": ["なさい to your boss would be strikingly rude — it's a downward-register command form.", "Commanding a stranger with なさい would come across as bizarrely presumptuous.", null, "Hotel staff are addressed politely, not with a parent-to-child command form."],
"1-3-0": ["飲みる isn't a real conjugation — potential form replaces the u-sound with an e-sound plus る, giving 飲める.", null, "飲むことが is the start of a different pattern (〜ことができる), not the potential form itself.", "飲まれる is the passive form ('be drunk [by someone]'), not the potential."],
"1-3-1": ["読み (stem alone) doesn't attach directly before することができます — the pattern needs the dictionary form.", null, "読んで (て-form) doesn't combine with ことができる this way.", "読めば is already the potential+conditional — ことができる needs the plain dictionary form instead."],
"2-0-0": [null, "呼べる is the potential form ('can call'), not passive.", "呼ばせる is the causative ('make/let someone call'), not passive.", "呼んでいる is progressive/state ('is calling'), unrelated to passive."],
"2-0-1": ["踏みました (plain past, active) would mean YOU stepped on something, not that your foot got stepped on.", null, "踏ませました is causative — 'made someone step on it' — wrong voice entirely.", "踏んでいました means you were (actively) stepping on something — again the wrong direction."],
"2-1-0": ["飲まれる is passive, not causative.", null, "飲める is potential ('can drink').", "飲んでいる is progressive ('is drinking')."],
"2-1-1": [null, "行かれる (passive) doesn't fit — nobody is 'having the going done to them' here.", "行ける is potential ('can go') — the sentence is about letting/permission, not ability.", "行っている is progressive/state ('is going') — unrelated to letting someone do something."],
"2-2-0": ["させられる never means doing something happily by choice — it specifically marks unwilling coercion.", "The room, not the mother, is what got cleaned — させられる describes the SPEAKER's forced action.", null, "If the mother cleaned it herself, the causative-passive wouldn't be needed at all."],
"2-2-1": ["待ちました is just plain past ('I waited') — no sense of being forced.", "待たれました (passive) would mean someone else's waiting affects you somehow — not 'forced to wait'.", null, "待ってあげました means YOU did someone else the favor of waiting — the opposite direction."],
"2-3-0": ["Asking your name would be お名前は？— いらっしゃいませ carries no question content at all.", null, "An apology would be すみません or 申し訳ございません, not this greeting.", "いらっしゃいませ invites you IN — the opposite of asking you to leave."],
"2-3-1": ["If they didn't understand, they'd ask a follow-up question, not say かしこまりました.", "かしこまりました is agreement, not refusal — a refusal would sound like 申し訳ございませんが〜.", null, "'Please wait' is 少々お待ちください — a different, though often paired, phrase."],
"3-0-0": ["This is a natural automatic-result と sentence (spring → warm) — no request involved, so it's fine.", null, "Also a valid automatic-result と sentence (press button → sound) — no issue.", "Also fine — another natural, general cause-and-effect と sentence."],
"3-0-1": ["たら would sound like a specific one-off scenario, an odd fit for a general mathematical rule.", "ば could work loosely, but と is the standard textbook choice for an unfailing, automatic fact like this.", null, "なら would frame it as reacting to someone's topic, not stating a general truth."],
"3-1-0": [null, "と would need the plain non-past form directly (安いと) — it doesn't attach to this たform stem.", "ければ attaches to 安い directly (安ければ), not to this たform stem.", "なら attaches to 安い directly (安いなら) too — not to this stem."],
"3-1-1": ["と cannot be followed by a request, invitation, or command — a well-known restriction.", null, "ながら links two simultaneous actions — it isn't a conditional at all.", "し lists reasons — also not a conditional."],
"3-2-0": ["安いば keeps the plain い ending — the ば-form requires dropping い first.", null, "安くば isn't a recognized conjugation — you drop い entirely (not to く) before adding ければ.", "安えば isn't valid either — い-adjectives don't take an え-sound + ば."],
"3-2-1": ["'Either...or' would be か〜か, unrelated to this pattern.", null, "'Even if...still' is 〜ても, a different grammar point entirely.", "'Before...after' would use 前に／後で, not this ば〜ほど pattern."],
"3-3-0": ["買うと alone doesn't form a complete natural reply, and と can't easily lead into a recommendation like this.", "買ったら、買います just echoes their statement back oddly ('if you buy it, I'll buy it') — doesn't fit as advice.", null, "買えばよかった means 'I should have bought it' — regret about the past, not advice about their plan."],
"3-3-1": ["と describes automatic cause-and-effect, not reacting to a raised topic.", "たら is a specific hypothetical condition, not topic-based reaction.", "ば is a general/hypothetical conditional, also not about reacting to a topic.", null],
"4-0-0": [null, "そうな is the pre-noun modifying form (忙しそうな人) — not how you end a sentence.", "そうだ is the casual/plain equivalent — fine in casual speech, but です is what this polite sentence calls for.", "そうに is the adverbial form (used before a verb), not a sentence-ending form."],
"4-0-1": ["An opinion would use と思います, not によると.", null, "によると never introduces a command — that needs a different structure entirely.", "A hypothetical condition would use たら/ば/と/なら, not によると."],
"4-1-0": ["降るそうです (dictionary form + そう) is hearsay — 'I heard it'll rain' — not a visual guess.", null, "降ってそうです isn't the standard appearance-そう pattern — that attaches to the stem (降り), not the て-form.", "降ったそうです (past + そう) is hearsay about a past event — wrong tense and wrong そう."],
"4-1-1": ["いいそう is the classic learner mistake — いい is irregular and doesn't take そう directly.", null, "いそう drops too much — not a recognized form.", "よいそう isn't correct either; the irregular replacement is よさ, not よい, before そう."],
"4-2-0": ["ようです is the more neutral/written-feeling equivalent, not the casual one being asked for.", null, "そうです（伝聞）is hearsay, a different meaning (reported information) from inference.", "なければなりません is obligation — unrelated to this inference/comparison pattern."],
"4-2-1": ["伝聞そうです would mean you heard it from someone, not that you're guessing from their behavior.", null, "なさい is a command form, unrelated to making an inference.", "ことになる reports an arrangement/decision, unrelated to inferring from observation."],
"4-3-0": ["でしょう expresses a fairly confident guess — more certain than 'might, but not sure'.", null, "はずです expresses strong logical expectation — the MOST confident of the four, not the least.", "伝聞そうです reports something you heard as fact — no uncertainty built in at all."],
"4-3-1": [null, "なさい is a command, unrelated to reporting an impression.", "ことにする marks a personal decision, unrelated to 'apparently'.", "させられます is causative-passive ('was made to do'), unrelated to this meaning."],
"5-0-0": ["何をしますか is a flat, neutral question about future plans — no extra curiosity nuance.", null, "何をしましたか asks about the past — different tense, and still lacks the んです warmth.", "何をしていますか asks about a current action, without the curious/background-seeking んです feel."],
"5-0-1": ["A flat neutral question wouldn't use んですか — it would just be もう帰りますか。", null, "This is a question, not a command — nothing here is imperative.", "Nothing here reports something heard from someone else."],
"5-1-0": [null, "し just lists this as one of several reasons/facts — no sense of surprised complaint.", "だから claims cold is a CONSEQUENCE of it being spring — logically backwards for a complaint.", "なら would react to someone's mention of spring with a condition — not a personal complaint."],
"5-1-1": ["のに sets up a single contrast, not a chain of supporting reasons, and doesn't repeat naturally like this.", null, "たら／たら would stack two hypothetical conditions — not what's happening in a reason-listing sentence.", "ば／ば has the same issue — conditionals, not a reasons list."],
"5-2-0": ["ように is for non-volitional/potential goals — 合格する here is something you actively choose to pursue, calling for ために.", null, "のに signals contrast/complaint, unrelated to stating a purpose.", "なら reacts to a raised topic, unrelated to expressing purpose."],
"5-2-1": ["ために is for deliberately-chosen goals; not forgetting isn't something you directly perform as an action, so ように is correct instead.", null, "し lists reasons, unrelated to purpose.", "たら is a conditional, unrelated to purpose."],
"5-3-0": ["ことになりました implies it was decided by circumstances, not your own active choice.", null, "らしいです reports an impression/rumor, not a personal decision.", "させられました (causative-passive) means you were forced to — the opposite of choosing yourself."],
"5-3-1": ["ことにしました would say YOU personally decided — wrong here since the company decided.", null, "ことができました means 'was able to' — an ability statement, unrelated to a decision being made.", "てほしいです expresses a wish about someone else's action, unrelated to reporting a decision."],
"6-0-0": [null, "ことがある always pairs with the past/た-form, regardless of the overall question's tense — plain 食べる doesn't fit.", "食べて (て-form) isn't the form ことがある attaches to.", "食べます (polite non-past) also doesn't fit — the fixed pattern needs plain past."],
"6-1-0": ["読んで、料理して just chains two actions in sequence — it doesn't signal 'examples among other things'.", null, "読んだから料理します claims reading CAUSED the cooking — an unrelated cause-effect meaning.", "読むように料理します would mean cooking 'in the manner of' reading — nonsensical here."],
"6-2-0": ["難しいすぎる keeps the い that should be dropped before attaching すぎる.", null, "難くすぎる wrongly converts to the adverbial くform first — すぎる attaches to the stem directly.", "難しいますぎる isn't a real conjugation at all."],
"6-3-0": ["書くにくいです keeps the dictionary form — にくい attaches to the ます-stem (書き), not the dictionary form.", null, "書いてにくいです wrongly uses the て-form — にくい doesn't attach there.", "書かにくいです wrongly uses the ない-stem (書か) — that's for negative forms, not にくい."],
"6-4-0": ["書いてしまって emphasizes finishing/completion (possibly with relief or regret) rather than 'doing it now for later benefit' — おく better captures the deliberate advance-prep framing here.", null, "書かれて is passive ('having been written [by someone]') — wrong voice for 'I'll write it'.", "書かせて is causative ('let/make [someone] write') — wrong meaning entirely."],
"6-4-1": ["ておきます is forward-looking prep, with no regret nuance at all.", null, "てほしいです expresses a wish about someone else, unrelated to regret over your own completed action.", "ようになります describes a gradual change/new ability, unrelated to regret."],
"6-5-0": [null, "なかで ('among') doesn't fit the two-way comparison pattern with より.", "ように ('so that/like') doesn't fit a comparison sentence at all.", "のに (contrast) doesn't fit either — nothing here is being contrasted unexpectedly."],
"6-5-1": ["より alone just marks one side of a two-way comparison — it doesn't express a superlative by itself.", "のほうが is for comparing exactly two things, not picking a winner from three or more.", null, "てもいい grants permission — unrelated to comparisons."],
"7-0-0": ["電話します is a flat statement of intent, missing the 'try it and see' nuance.", null, "電話しています says you're currently on the phone — a different meaning (ongoing action).", "電話しました is past tense — something already done, not something you're about to try."],
"7-0-1": ["見る (the literal verb 'to see') is often written in kanji — it's specifically the grammatical-helper use that conventionally stays in hiragana.", null, "This convention isn't about formality/casualness — it's about literal vs. grammatical-helper meaning.", "There is a real, meaningful reason — it isn't free variation."],
"7-1-0": ["出した signals a sudden, often unexpected onset ('burst into talking') — not 'kept on'.", "始めた means 'started' — a single moment, not ongoing continuation.", null, "終わった means 'finished' — the opposite of 'kept on'."],
"7-1-1": ["A calm, gradual cry wouldn't use 出す, which signals suddenness.", null, "終わる, not 出す, would mark finishing — 泣き出す is about the START, not the end.", "出す means it DID happen (suddenly), not that it almost happened."],
"7-2-0": ["前に means 'before' — the phone didn't ring before you started watching.", null, "うちに typically pairs with a state you should act within before it changes — 間に is the direct match for 'during this activity, X happened once'.", "後で means 'afterward' — but the ringing happened DURING, not after, the TV-watching."],
"7-2-1": [null, "間に marks something happening inside a window, not a clear 'before' sequence.", "たら is a conditional ('if/when'), not a 'before' time marker.", "そう (appearance/hearsay) is unrelated to sequencing events in time."],
"7-3-0": [null, "まえに means 'before' — but the two actions here happen at the same time, not in sequence.", "あとで means 'after' — same issue, wrong relationship between the two actions.", "そうに is an adverbial form of appearance-そう, unrelated to simultaneous actions."],
"7-3-1": ["Listening is the backgrounded action (marked by ながら), not the main one.", null, "ながら specifically marks one action as secondary/backgrounded — they aren't treated equally.", "It's not just 'background info' — listening is a real simultaneous action, just the secondary one."],
"7-4-0": [null, "食べている is progressive ('is eating') — unrelated to 'let's eat'.", "食べれば is conditional ('if [we] eat') — a different meaning.", "食べさせる is causative ('make/let [someone] eat') — a different meaning."],
"7-4-1": ["たいです is just a wish/desire — the least firm of the four.", "予定です describes a scheduled plan, which can be set by circumstances rather than firm personal resolve.", null, "行こうかな ('maybe I'll go') is tentative, thinking-out-loud — the least decided, not the most."],
"7-5-0": ["This is positive advice TO go out — the opposite of what's needed.", "Also positive advice to go out (just using the fixed た-form pattern) — still the wrong direction.", null, "てもいい grants permission to go out — doesn't express advice against it."],
"7-5-1": ["It's not a mistake — it's the standard, correct grammatical shape.", null, "The advice is about a future action; the た-form here doesn't mean the action already happened.", "Politeness is handled separately (です/ます) — the た-form's role here is purely grammatical."],
"7-6-0": ["だれでも means 'anyone at all' — too broad/insistent for a simple general request.", null, "だれが would ask 'who [specifically]' — expecting a named answer, not making a request.", "だれに would mean 'to whom' — doesn't fit this sentence structure."],
"7-6-1": [null, "だれか means 'someone [unspecified]' — narrower than the all-inclusive meaning needed.", "だれと means 'with whom' — unrelated to who may enter.", "だれの means 'whose' — unrelated to permission to enter."],
"7-7-0": ["だれは would treat 'who' as a known topic, which conflicts with が being needed to introduce new, specific information.", null, "だれを would make 'who' the object being acted upon, not the one doing the coming.", "だれの ('whose') doesn't fit this sentence structure at all."],
"7-7-1": ["が here marks Tanaka as new/focused information (answering 'who came'), not as a topic being commented on.", null, "Same issue — が marks new information here, not a topic being introduced for comment.", "This is a question, not a statement introducing Tanaka as a topic."],
"7-8-0": ["てきた frames the change as building up TO NOW, not continuing onward into the future.", null, "そうだった (past appearance) reports a past guess, not an ongoing future trend.", "らしかった (past hearsay) reports something you'd heard, not a forward-looking trend."],
"7-8-1": ["ていく points forward from now — the sentence is about change building up TO the present, which needs てきた instead.", null, "なるところ means 'about to become' — a point right before the change, not a gradual build-up.", "なったばかり means 'just became' a moment ago — not a gradual trend over 'lately'."],
"7-9-0": ["にする + を means someone deliberately made it clean — the opposite of 'on its own'.", null, "にします (future/habitual にする) again implies deliberate action by someone.", "でした just states it WAS clean — no sense of change/becoming at all."],
"7-9-1": ["安になる drops too much — you need to keep く after removing い.", "安いくなる keeps the い that should be dropped before adding くなる.", null, "安くする is 'make cheap' (deliberate action by someone), not 'become cheap' on its own."],
"7-10-0": ["も + affirmative would flip the meaning to 'as many as three' — but the verb here is negative (いません), which needs しか.", null, "でも means 'even/any' (だれでも, 'anyone') — doesn't fit a quantity statement like this.", "とか is a casual listing particle ('or something like'), unrelated to quantity emphasis."],
"7-10-1": [null, "しか + negative verb means 'only' — the opposite emphasis from 'as long as'.", "ぐらい just means 'about/approximately' — no sense of 'surprisingly long'.", "This mixes in an English word and isn't valid Japanese."],
"7-11-0": ["と思います needs the plain form directly before と (降ると), not the て-form (降って).", null, "たら思います isn't a standard pattern — と is the particle that pairs with 思う here.", "し思います also isn't standard — し lists reasons and doesn't combine with 思う this way."],
"7-11-1": [null, "を would mark a direct object, but the particle that introduces quoted speech content before 言う is と, not を.", "が would mark who is speaking, not introduce the quoted content.", "は would mark a topic, not introduce quoted content before 言う."],
};

function apply(modules, moduleOffset) {
  modules.forEach((mod, mi) => {
    mod.points.forEach((pt, pi) => {
      (pt.quiz || []).forEach((q, qi) => {
        const key = (mi + moduleOffset) + "-" + pi + "-" + qi;
        const why = WHY[key];
        if (!why) throw new Error("missing why for " + key + ": " + q.q);
        if (why.length !== q.choices.length) throw new Error("length mismatch at " + key);
        q.why = why;
      });
    });
  });
}

const grammarPath2 = grammarPath;
const grammar = JSON.parse(fs.readFileSync(grammarPath2, "utf8"));
const extra = JSON.parse(fs.readFileSync(extraPath, "utf8"));

apply(grammar, 0);
apply(extra, grammar.length);

// Incidental fix noticed while authoring: 4-0-0's hint didn't specify
// register, but そうだ (plain) is also genuinely valid Japanese for the
// English gloss given — only そうです is wrong to exclude without a cue.
const item400 = grammar[4].points[0].quiz[0];
if (item400.q.includes("彼は忙しい")) {
  item400.q = item400.q.replace("'I heard he's busy'", "'I heard he's busy' (polite ですform)");
}

fs.writeFileSync(grammarPath2, JSON.stringify(grammar, null, 2), "utf8");
fs.writeFileSync(extraPath, JSON.stringify(extra, null, 2), "utf8");
console.log("Added why[] to all grammar quiz items.");
