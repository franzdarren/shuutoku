/* ============================================================
   DATA — KAIWA LAB
   ------------------------------------------------------------
   N4.kaiwaTips      {title, body}
   N4.phraseBank     {cat, catEn, items:[{jp, en}]}
   N4.kaiwaScenarios {jp, en, setup, lines:[{who, jp, en}],
                      keyPhrases:[{jp, en}], roleplay, quiz:[]}

   Use R("漢字","かんじ") for anything above roughly N5 level so
   the Furigana switch in the sidebar has something to hide.
   Keep every line sayable out loud — this file is for speaking
   practice, not for reading comprehension.
   ============================================================ */
(function(){
"use strict";

/* ------------------------------------------------------------
   TIPS — how to practise, not what to say
   ------------------------------------------------------------ */
var kaiwaTips = [
  {title:"Shadow, don't translate", body:"When you hear a native speaker, repeat what they said out loud right away, matching their rhythm, before you think about the English meaning. Translating in your head first is often the real bottleneck, not vocabulary."},
  {title:"Fillers buy you time", body:"あの、ええと、そうですね aren't filler for filler's sake — they give you half a second to build the next part of your sentence without an awkward silence. Native speakers use them constantly."},
  {title:"Reacting matters as much as answering", body:"そうですか、なるほど、へえ show you're following along. A conversation partner keeps talking to someone who reacts, and trails off with someone who just stares and answers minimally."},
  {title:"Short and natural beats long and correct", body:"A short, slightly imperfect sentence delivered smoothly sounds more fluent than a long, perfectly grammatical one delivered haltingly. Listeners forgive small grammar slips far more easily than long silences."},
  {title:"Recycle the question", body:"If you miss part of what someone said, echoing back the part you did catch with a rising tone (ホテルまで、ですか？) is completely natural and gets you a repeat without switching to English."},
  {title:"Learn the staff's lines too", body:"In shops, stations and restaurants the staff say a small set of fixed lines — 袋はご利用ですか、温めますか、ポイントカードはお持ちですか. You rarely need to produce them, but if you can't recognise them you freeze at the counter. Read both sides of every script below."},
  {title:"One sentence, then stop", body:"Learners often try to deliver a whole paragraph and run out of grammar halfway. Say one clean sentence, stop, and let the other person react. Conversation is a rally, not a speech."},
  {title:"Pre-load the phrases for tomorrow", body:"Before you go somewhere, rehearse the three or four lines you'll actually need there — ordering, asking the price, asking where something is. Ten seconds of rehearsal on the train turns a panic into a routine."},
  {title:"ちょっと is your safety valve", body:"ちょっと待ってください、ちょっとわかりません、ちょっと難しいです — ちょっと softens almost anything and buys you thinking room. It is by far the most useful four syllables at N4."},
  {title:"Ask about the word, not the meaning", body:"When you don't know a word, don't stop — ask in Japanese: これは日本語で何と言いますか。Staying inside Japanese keeps the conversation going, and you learn the word in context instead of looking it up later and forgetting it."},
  {title:"Mirror the politeness you receive", body:"If staff speak to you in keigo, ます／です back is plenty — you don't need to produce keigo yourself. If a friend speaks casually, drop to casual too. Matching the register matters more than choosing the fanciest form you know."},
  {title:"Record yourself once a week", body:"Read one scenario below out loud into your phone, then listen back. You will hear your own pauses, missing particles and flat intonation far more clearly than you can feel them while speaking."}
];

/* ------------------------------------------------------------
   PHRASE BANK — grouped by the job the phrase does, because
   that is how you retrieve them under pressure.
   ------------------------------------------------------------ */
var phraseBank = [
{cat:"あいさつ・出会い", catEn:"Greetings & first contact", items:[
  {jp:"はじめまして", en:"Nice to meet you (first time only)"},
  {jp:"よろしくお願いします", en:"Please treat me well / looking forward to it"},
  {jp:"お世話になります", en:"Thank you in advance for your help"},
  {jp:"お久しぶりです", en:"It's been a long time"},
  {jp:"お元気ですか", en:"How have you been?"},
  {jp:"おかげさまで元気です", en:"I'm well, thanks for asking"},
  {jp:"失礼します", en:"Excuse me (entering/leaving a room)"},
  {jp:"お邪魔します", en:"Sorry to intrude (entering someone's home)"},
  {jp:"お名前は何ですか", en:"What's your name?"},
  {jp:"どちらから来ましたか", en:"Where are you from?"}
]},
{cat:"つなぎ言葉", catEn:"Fillers & buying time", items:[
  {jp:"そうですね", en:"Well, let's see... / I agree"},
  {jp:"ええと…", en:"Um... (thinking)"},
  {jp:"あの…", en:"Um, excuse me... (getting attention)"},
  {jp:"まあ…", en:"Well... (softening a statement)"},
  {jp:"なんと言うか…", en:"How should I put it..."},
  {jp:"ちょっと考えさせてください", en:"Let me think for a second"},
  {jp:"つまり…", en:"In other words..."},
  {jp:"実は…", en:"Actually... (introducing the real point)"},
  {jp:"それで…", en:"And so... (continuing your own story)"},
  {jp:"何だっけ…", en:"What was it again... (casual, to yourself)"}
]},
{cat:"あいづち", catEn:"Reactions — showing you're listening", items:[
  {jp:"なるほど", en:"I see, that makes sense"},
  {jp:"たしかに", en:"That's true / indeed"},
  {jp:"やっぱり", en:"As I thought / after all"},
  {jp:"それで？", en:"And then? / so?"},
  {jp:"本当ですか", en:"Really?"},
  {jp:"すごいですね", en:"That's amazing"},
  {jp:"へえ、そうなんですか", en:"Huh, is that so"},
  {jp:"いいですね", en:"That sounds nice"},
  {jp:"わかります", en:"I know what you mean"},
  {jp:"大変でしたね", en:"That must have been rough"},
  {jp:"よかったですね", en:"I'm glad for you"},
  {jp:"ですよね", en:"Right? / exactly (agreeing warmly)"}
]},
{cat:"聞き返す", catEn:"When you didn't catch it", items:[
  {jp:"もう一度お願いします", en:"One more time, please"},
  {jp:"ゆっくり話してください", en:"Please speak slowly"},
  {jp:"すみません、聞こえませんでした", en:"Sorry, I couldn't hear you"},
  {jp:"どういう意味ですか", en:"What does that mean?"},
  {jp:"日本語で何と言いますか", en:"How do you say it in Japanese?"},
  {jp:"書いてもらえますか", en:"Could you write it down?"},
  {jp:"つまり、〜ということですか", en:"So you mean...?"},
  {jp:"すみません、まだ日本語が上手じゃないんです", en:"Sorry, my Japanese isn't good yet"},
  {jp:"英語でもいいですか", en:"Would English be okay? (last resort)"},
  {jp:"ゆっくりなら、わかります", en:"If it's slow, I understand"}
]},
{cat:"お願いする", catEn:"Making requests", items:[
  {jp:"お願いします", en:"Please (do it) / yes please"},
  {jp:"〜をください", en:"Please give me ~"},
  {jp:"〜てもいいですか", en:"Is it okay if I ~?"},
  {jp:"〜てくれませんか", en:"Could you ~ for me?"},
  {jp:"〜ていただけませんか", en:"Could you kindly ~? (politer)"},
  {jp:"手伝ってもらえますか", en:"Could you give me a hand?"},
  {jp:"ちょっと待ってください", en:"Please wait a moment"},
  {jp:"教えてください", en:"Please tell me / show me"},
  {jp:"すみません、お願いがあるんですが", en:"Excuse me, I have a favour to ask"},
  {jp:"もし よかったら…", en:"If you don't mind... / if it's okay with you"}
]},
{cat:"ことわる・やわらげる", catEn:"Refusing & softening", items:[
  {jp:"ちょっと…", en:"That's a bit... (soft refusal — leave it unfinished)"},
  {jp:"すみません、今日はちょっと", en:"Sorry, today is a little difficult"},
  {jp:"また今度お願いします", en:"Another time, please"},
  {jp:"ありがたいんですが…", en:"I appreciate it, but..."},
  {jp:"ちょっと難しいと思います", en:"I think that would be difficult"},
  {jp:"今はやめておきます", en:"I'll pass for now"},
  {jp:"けっこうです", en:"No thank you (declining an offer)"},
  {jp:"大丈夫です", en:"I'm fine / no need (very common polite decline)"},
  {jp:"考えておきます", en:"I'll think about it"},
  {jp:"残念ですが、行けません", en:"Unfortunately I can't go"}
]},
{cat:"店・レストランで", catEn:"Shops & restaurants", items:[
  {jp:"おすすめは何ですか", en:"What do you recommend?"},
  {jp:"これは何ですか", en:"What is this?"},
  {jp:"辛くないものはありますか", en:"Do you have anything not spicy?"},
  {jp:"これをお願いします", en:"I'll have this one, please"},
  {jp:"お会計をお願いします", en:"The bill, please"},
  {jp:"カードで払えますか", en:"Can I pay by card?"},
  {jp:"別々でお願いします", en:"Separate bills, please"},
  {jp:"持ち帰りでお願いします", en:"To take away, please"},
  {jp:"いくらですか", en:"How much is it?"},
  {jp:"試着してもいいですか", en:"May I try this on?"},
  {jp:"もっと安いのはありますか", en:"Do you have a cheaper one?"},
  {jp:"これで大丈夫です", en:"This is fine"}
]},
{cat:"移動・道", catEn:"Getting around", items:[
  {jp:"〜はどこですか", en:"Where is ~?"},
  {jp:"どうやって行きますか", en:"How do I get there?"},
  {jp:"ここから遠いですか", en:"Is it far from here?"},
  {jp:"歩いて何分ぐらいですか", en:"About how many minutes on foot?"},
  {jp:"乗り換えが必要ですか", en:"Do I need to change trains?"},
  {jp:"これは〜行きですか", en:"Does this go to ~?"},
  {jp:"次の駅で降ります", en:"I'm getting off at the next station"},
  {jp:"ここで降ります", en:"I'll get off here"},
  {jp:"道に迷いました", en:"I'm lost"},
  {jp:"地図で教えてもらえますか", en:"Could you show me on the map?"}
]},
{cat:"時間・予定", catEn:"Time & plans", items:[
  {jp:"何時からですか", en:"What time does it start?"},
  {jp:"何時までですか", en:"Until what time is it open?"},
  {jp:"いつがいいですか", en:"When works for you?"},
  {jp:"何時に会いましょうか", en:"What time shall we meet?"},
  {jp:"予定がありますか", en:"Do you have plans?"},
  {jp:"今週末は空いています", en:"I'm free this weekend"},
  {jp:"ちょっと遅れます", en:"I'll be a little late"},
  {jp:"間に合いますか", en:"Will we make it in time?"},
  {jp:"時間を変えてもいいですか", en:"Could we change the time?"},
  {jp:"楽しみにしています", en:"I'm looking forward to it"}
]},
{cat:"気持ちを伝える", catEn:"Feelings & opinions", items:[
  {jp:"うれしいです", en:"I'm happy"},
  {jp:"楽しかったです", en:"It was fun"},
  {jp:"おいしかったです", en:"It was delicious"},
  {jp:"疲れました", en:"I'm tired"},
  {jp:"びっくりしました", en:"I was surprised"},
  {jp:"心配しています", en:"I'm worried"},
  {jp:"〜と思います", en:"I think that ~ (softens any opinion)"},
  {jp:"〜かもしれません", en:"It might be ~"},
  {jp:"どちらでもいいです", en:"Either is fine"},
  {jp:"私も同じです", en:"Same for me"}
]},
{cat:"トラブル", catEn:"When something goes wrong", items:[
  {jp:"すみません、困っているんですが", en:"Excuse me, I'm having trouble"},
  {jp:"〜がこわれています", en:"The ~ is broken"},
  {jp:"〜が動きません", en:"The ~ won't work"},
  {jp:"お湯が出ません", en:"There's no hot water"},
  {jp:"Wi‑Fiがつながりません", en:"The wifi won't connect"},
  {jp:"財布をなくしました", en:"I lost my wallet"},
  {jp:"電車に忘れました", en:"I left it on the train"},
  {jp:"気分が悪いです", en:"I feel unwell"},
  {jp:"病院はどこですか", en:"Where is a hospital?"},
  {jp:"助けてください", en:"Please help me"}
]},
{cat:"あやまる・お礼", catEn:"Apologies & thanks", items:[
  {jp:"すみません", en:"Excuse me / sorry (also to get attention)"},
  {jp:"ごめんなさい", en:"I'm sorry (personal, warmer)"},
  {jp:"申し訳ありません", en:"I deeply apologise (formal)"},
  {jp:"お待たせしました", en:"Sorry to keep you waiting"},
  {jp:"ご迷惑をかけました", en:"I caused you trouble"},
  {jp:"ありがとうございます", en:"Thank you"},
  {jp:"どういたしまして", en:"You're welcome"},
  {jp:"助かりました", en:"That was a big help"},
  {jp:"おかげさまで", en:"Thanks to you"},
  {jp:"わざわざありがとうございます", en:"Thank you for going out of your way"}
]},
{cat:"別れのあいさつ", catEn:"Wrapping up & goodbyes", items:[
  {jp:"じゃあ、また", en:"See you then"},
  {jp:"また明日", en:"See you tomorrow"},
  {jp:"気をつけて", en:"Take care (on your way)"},
  {jp:"お大事に", en:"Take care (when someone is ill)"},
  {jp:"お先に失礼します", en:"Excuse me for leaving first (at work)"},
  {jp:"お疲れさまでした", en:"Thanks for your hard work (leaving work)"},
  {jp:"また連絡します", en:"I'll be in touch"},
  {jp:"今日はありがとうございました", en:"Thank you for today"},
  {jp:"よい一日を", en:"Have a good day"},
  {jp:"お先にどうぞ", en:"After you / go ahead"}
]},
{cat:"話を広げる", catEn:"Steering & extending the conversation", items:[
  {jp:"〜はどうですか", en:"How about ~? (turning it back to them)"},
  {jp:"〜と言えば…", en:"Speaking of ~..."},
  {jp:"そういえば…", en:"Now that you mention it... / by the way"},
  {jp:"ちなみに…", en:"Incidentally..."},
  {jp:"例えば？", en:"For example?"},
  {jp:"どうしてですか", en:"Why is that?"},
  {jp:"よく〜んですか", en:"Do you often ~?"},
  {jp:"かしこまりました", en:"Certainly (what staff say to you)"}
]}
];

/* ------------------------------------------------------------
   SCENARIO SCRIPTS
   ------------------------------------------------------------ */
var kaiwaScenarios = [
/* === 1 === */
{
  jp:"レストランで", en:"At a restaurant",
  setup:"You're at a small restaurant and want to order, ask about a dish, and pay.",
  lines:[
    {who:"Staff", jp:"いらっしゃいませ。"+R("何名様","なんめいさま")+"ですか。", en:"Welcome. How many people?"},
    {who:"You", jp:"二人です。", en:"Two people."},
    {who:"Staff", jp:"こちらへどうぞ。"+R("注文","ちゅうもん")+"がお"+R("決","き")+"まりになりましたら、お"+R("呼","よ")+"びください。", en:"This way please. When you've decided, please call us."},
    {who:"You", jp:"すみません、これはどんな"+R("料理","りょうり")+"ですか。", en:"Excuse me, what kind of dish is this?"},
    {who:"Staff", jp:"少し"+R("辛","から")+"い"+R("魚","さかな")+"料理です。", en:"It's a slightly spicy fish dish."},
    {who:"You", jp:"じゃあ、それを一つと、水をお願いします。", en:"Then I'll have one of that, and water please."},
    {who:"Staff", jp:"かしこまりました。"+R("少","しょう")+"々お"+R("待","ま")+"ちください。", en:"Certainly. One moment please."},
    {who:"You", jp:"（"+R("食後","しょくご")+"）すみません、お"+R("会計","かいけい")+"をお願いします。", en:"(after eating) Excuse me, could I get the bill please."},
    {who:"Staff", jp:"レジでお"+R("願","ねが")+"いします。カードもお"+R("使","つか")+"いいただけます。", en:"Please pay at the register. You can use a card as well."}
  ],
  keyPhrases:[
    {jp:"これはどんな料理ですか", en:"What kind of dish is this?"},
    {jp:"それを一つお願いします", en:"One of those, please"},
    {jp:"お会計をお願いします", en:"The bill, please"},
    {jp:"カードで払えますか", en:"Can I pay by card?"}
  ],
  roleplay:"Swap roles after reading through once — try being the staff member and improvise slightly different menu items.",
  quiz:[
    {q:"How do you ask for the bill?", choices:["お願いします","お会計をお願いします","いただきます","ごちそうさまでした"], a:1, ex:"お会計をお願いします directly asks for the check — お願いします alone is too vague on its own."},
    {q:"The staff say 少々お待ちください。What are they telling you?", choices:["Please order now","Please wait a moment","Please pay first","Please come again"], a:1, ex:"少々お待ちください is the keigo version of ちょっと待ってください — 'please wait a moment'. You hear it constantly from staff."}
  ]
},
/* === 2 === */
{
  jp:"道を"+R("尋","たず")+"ねる", en:"Asking for directions",
  setup:"You're looking for a temple and stop someone on the street.",
  lines:[
    {who:"You", jp:"すみません、"+R("清水寺","きよみずでら")+"はどう"+R("行","い")+"けばいいですか。", en:"Excuse me, how do I get to Kiyomizu-dera?"},
    {who:"Passerby", jp:"ああ、この"+R("道","みち")+"をまっすぐ"+R("行","い")+"くと、"+R("右側","みぎがわ")+"にありますよ。", en:"Ah, if you go straight down this street, it'll be on your right."},
    {who:"You", jp:"歩いてどのくらいかかりますか。", en:"About how long does it take on foot?"},
    {who:"Passerby", jp:"十分ぐらいだと思います。", en:"I think about ten minutes."},
    {who:"You", jp:R("途中","とちゅう")+"に"+R("目印","めじるし")+"はありますか。", en:"Is there a landmark on the way?"},
    {who:"Passerby", jp:R("大","おお")+"きいコンビニがあるので、その"+R("角","かど")+"を"+R("左","ひだり")+"に"+R("曲","ま")+"がってください。", en:"There's a big convenience store, so turn left at that corner."},
    {who:"You", jp:"わかりました。ありがとうございます。", en:"Got it. Thank you."},
    {who:"Passerby", jp:R("気","き")+"をつけて。", en:"Take care."}
  ],
  keyPhrases:[
    {jp:"〜はどう行けばいいですか", en:"How should I get to ~?"},
    {jp:"歩いてどのくらいかかりますか", en:"How long does it take on foot?"},
    {jp:"その角を左に曲がってください", en:"Turn left at that corner"},
    {jp:"目印はありますか", en:"Is there a landmark?"}
  ],
  roleplay:"Try substituting a different landmark and direction (左側、まっすぐ、この道の奥) each time you practise.",
  quiz:[
    {q:"「気をつけて」means roughly:", choices:["Hurry up","Take care / be careful","Come again","Never mind"], a:1, ex:"気をつけて is a common, warm way to say 'take care' as someone parts ways with you."},
    {q:"Which pattern is doing the work in 「まっすぐ行くと、右側にあります」?", choices:["〜たら (if/when, one-off)","〜と (whenever A, inevitably B)","〜ば (conditional emphasis)","〜なら (reacting to a topic)"], a:1, ex:"〜と is used for a reliable, automatic result — perfect for directions, where going straight always puts the place on your right."}
  ]
},
/* === 3 === */
{
  jp:"ホテルで", en:"Hotel check-in & a small problem",
  setup:"You arrive at your hotel, and the room's air conditioner doesn't seem to work.",
  lines:[
    {who:"You", jp:"こんにちは、"+R("予約","よやく")+"している"+R("田中","たなか")+"です。", en:"Hello, I have a reservation under Tanaka."},
    {who:"Staff", jp:"お待ちしておりました。こちらにご"+R("記入","きにゅう")+"をお願いします。", en:"We've been expecting you. Please fill this out."},
    {who:"You", jp:"これでいいですか。", en:"Is this okay?"},
    {who:"Staff", jp:"はい、ありがとうございます。お"+R("部屋","へや")+"は305"+R("号室","ごうしつ")+"です。", en:"Yes, thank you. Your room is 305."},
    {who:"You", jp:R("朝食","ちょうしょく")+"は"+R("何時","なんじ")+"からですか。", en:"What time is breakfast from?"},
    {who:"Staff", jp:"七時から九時半までです。二"+R("階","かい")+"の"+R("食堂","しょくどう")+"でどうぞ。", en:"From seven until nine thirty, in the dining room on the second floor."},
    {who:"You", jp:"（"+R("部屋","へや")+"で）すみません、エアコンがつかないんですが…", en:"(in the room) Excuse me, the air conditioner won't turn on..."},
    {who:"Staff", jp:R("申","もう")+"し"+R("訳","わけ")+"ございません、すぐに"+R("確認","かくにん")+"いたします。", en:"I'm very sorry, I'll check right away."},
    {who:"You", jp:"お願いします。"+R("直","なお")+"らなかったら、"+R("部屋","へや")+"を"+R("変","か")+"えてもらえますか。", en:"Please do. If it can't be fixed, could I change rooms?"}
  ],
  keyPhrases:[
    {jp:"予約している〜です", en:"I have a reservation under ~"},
    {jp:"朝食は何時からですか", en:"What time is breakfast from?"},
    {jp:"〜がつかないんですが", en:"The ~ won't turn on... (soft complaint)"},
    {jp:"部屋を変えてもらえますか", en:"Could I change rooms?"}
  ],
  roleplay:"Practise describing a different problem instead — Wi‑Fiがつながらない (wifi won't connect), お湯が出ない (no hot water), 鍵が開かない (the key won't open the door).",
  quiz:[
    {q:"んですが at the end of つかないんですが softens the sentence into:", choices:["a command","an explanation/complaint leading into a request","a question about the weather","a hearsay report"], a:1, ex:"んですが frames the problem as background/explanation, leaving room for the staff to respond and help — much softer than a flat statement."},
    {q:"「直らなかったら、部屋を変えてもらえますか」uses 〜てもらう to mean:", choices:["I'll change the room myself","having someone do something for me","I must change rooms","the room changed on its own"], a:1, ex:"〜てもらう marks receiving an action from someone else — here, asking them to do the room change for you (Module on giving & receiving)."}
  ]
},
/* === 4 === */
{
  jp:"買い物・"+R("試着","しちゃく"), en:"Shopping & trying something on",
  setup:"You're in a clothing shop and want to try on a jacket.",
  lines:[
    {who:"You", jp:"すみません、これ、"+R("試着","しちゃく")+"してもいいですか。", en:"Excuse me, may I try this on?"},
    {who:"Staff", jp:"はい、どうぞ。あちらの"+R("試着室","しちゃくしつ")+"をお使いください。", en:"Yes, go ahead. Please use the fitting room over there."},
    {who:"You", jp:"（"+R("試着","しちゃく")+"後）これとこれ、どちらのほうが"+R("似合","にあ")+"いますか。", en:"(after trying on) Which of these two suits me better?"},
    {who:"Staff", jp:"そうですね、こちらの"+R("色","いろ")+"のほうが"+R("似合","にあ")+"うと"+R("思","おも")+"いますよ。", en:"Let's see — I think this color suits you better."},
    {who:"You", jp:"もう"+R("少","すこ")+"し"+R("大","おお")+"きいサイズはありますか。", en:"Do you have it one size larger?"},
    {who:"Staff", jp:R("在庫","ざいこ")+"を"+R("見","み")+"てきますので、"+R("少","しょう")+"々お"+R("待","ま")+"ちください。", en:"I'll go check the stock, so one moment please."},
    {who:"You", jp:"じゃあ、これにします。", en:"Then I'll go with this one."},
    {who:"Staff", jp:"ありがとうございます。プレゼント"+R("用","よう")+"ですか。", en:"Thank you. Is it a gift?"}
  ],
  keyPhrases:[
    {jp:"試着してもいいですか", en:"May I try this on?"},
    {jp:"どちらのほうが似合いますか", en:"Which suits me better?"},
    {jp:"もう少し大きいサイズはありますか", en:"Do you have a larger size?"},
    {jp:"これにします", en:"I'll take this one"}
  ],
  roleplay:"Swap in different items — 靴 (くつ, shoes), 帽子 (ぼうし, hat) — and try もっと安いのはありますか (do you have a cheaper one?).",
  quiz:[
    {q:"これにします most naturally means:", choices:["I'll decide never","I'll take/choose this one","This is too expensive","I don't want this"], a:1, ex:"〜にする means 'to decide on/choose' — これにします = 'I'll go with this one.'"},
    {q:"どちらのほうが似合いますか is a comparison between:", choices:["three or more things","exactly two things","a thing and a person","past and present"], a:1, ex:"どちら＋のほうが is the two-way comparison. For three or more you'd need どれが一番〜 instead."}
  ]
},
/* === 5 === */
{
  jp:R("世間話","せけんばなし"), en:"Small talk with a new acquaintance",
  setup:"You've just met someone at a language exchange event.",
  lines:[
    {who:"A", jp:R("日本語","にほんご")+"、お"+R("上手","じょうず")+"ですね！どのくらい"+R("勉強","べんきょう")+"しているんですか。", en:"Your Japanese is great! How long have you been studying?"},
    {who:"B", jp:"ありがとうございます。まだ一"+R("年","ねん")+"ぐらいです。", en:"Thank you. About a year so far."},
    {who:"A", jp:"すごいですね！"+R("日本","にほん")+"に"+R("来","き")+"たことがありますか。", en:"That's impressive! Have you ever been to Japan?"},
    {who:"B", jp:"いいえ、まだないんです。"+R("今度","こんど")+"、"+R("行","い")+"くことになりました。", en:"No, not yet. It's actually just been decided that I'm going soon."},
    {who:"A", jp:"それはいいですね！いつ"+R("行","い")+"くんですか。", en:"That's great! When are you going?"},
    {who:"B", jp:"十"+R("二月","にがつ")+"に"+R("行","い")+"く"+R("予定","よてい")+"です。"+R("Aさん","エーさん")+"はどこに"+R("住","す")+"んでいるんですか。", en:"I'm planning to go in December. Where do you live?"},
    {who:"A", jp:R("大阪","おおさか")+"です。よかったら、おすすめの"+R("場所","ばしょ")+"を"+R("教","おし")+"えますよ。", en:"Osaka. If you like, I can tell you some places I recommend."},
    {who:"B", jp:"ぜひお"+R("願","ねが")+"いします！", en:"Yes please, I'd love that!"}
  ],
  keyPhrases:[
    {jp:"どのくらい勉強しているんですか", en:"How long have you been studying?"},
    {jp:"〜たことがあります", en:"I have ~ before (experience)"},
    {jp:"〜ことになりました", en:"It's been decided that ~"},
    {jp:"Aさんはどうですか", en:"How about you, A? (turn it back)"}
  ],
  roleplay:"Continue the conversation yourself — try asking A something back using 〜んですか to keep the explanatory, curious tone going.",
  quiz:[
    {q:"どのくらい勉強しているんですか is asking about:", choices:["Where you study","How long you've been studying","Why you study","What you're studying"], a:1, ex:"どのくらい asks 'how much/how long', and んですか adds the curious, explanatory nuance covered in Module 6."},
    {q:"Why is 行くことになりました better here than 行くつもりです?", choices:["It's more polite","It shows the trip got settled by circumstances, not just your own intent","It's past tense so the trip is over","つもり is ungrammatical here"], a:1, ex:"〜ことになる reports an arrangement that has come about; 〜つもり would stress your personal intention. The speaker is announcing that it's now settled."}
  ]
},
/* === 6 === */
{
  jp:R("電車","でんしゃ")+"の中で", en:"On the train",
  setup:"You are unsure whether you are on the right train and need to ask another passenger.",
  lines:[
    {who:"You", jp:"すみません、この"+R("電車","でんしゃ")+"は"+R("東京駅","とうきょうえき")+"に行きますか。", en:"Excuse me, does this train go to Tokyo Station?"},
    {who:"Passenger", jp:"はい、行きます。三つ"+R("目","め")+"の"+R("駅","えき")+"ですよ。", en:"Yes, it does. It is the third station."},
    {who:"You", jp:"ありがとうございます。"+R("何分","なんぷん")+"ぐらいかかりますか。", en:"Thank you. About how many minutes does it take?"},
    {who:"Passenger", jp:"二十分ぐらいだと思います。", en:"I think about twenty minutes."},
    {who:"You", jp:R("乗","の")+"り"+R("換","か")+"えなければなりませんか。", en:"Do I have to change trains?"},
    {who:"Passenger", jp:"いいえ、この"+R("電車","でんしゃ")+"のままで"+R("大丈夫","だいじょうぶ")+"ですよ。", en:"No, you can stay on this train."},
    {who:"You", jp:"わかりました。"+R("助","たす")+"かりました。", en:"I understand. That was a big help."}
  ],
  keyPhrases:[
    {jp:"この電車は〜に行きますか", en:"Does this train go to ~?"},
    {jp:"何分ぐらいかかりますか", en:"About how many minutes does it take?"},
    {jp:"乗り換えなければなりませんか", en:"Do I have to transfer?"},
    {jp:"助かりました", en:"That was a big help"}
  ],
  roleplay:"Change the destination, then practise the follow-up you'll really need: 何番線ですか (which platform?) and 次は何駅ですか (what's the next station?).",
  quiz:[
    {q:"How do you ask whether a train goes to a destination?", choices:["この電車は行きますか","この電車は行きますね","この電車に行きました","この電車を行きますか"], a:0, ex:"この電車は東京駅に行きますか uses は for the train as the topic and に for the destination."},
    {q:"乗り換えなければなりませんか is asking whether transferring is:", choices:["forbidden","required","optional","finished"], a:1, ex:"〜なければなりません expresses obligation, so the question asks whether you must transfer. 乗り換えなくてもいいですか would ask whether you can skip it."}
  ]
},
/* === 7 === */
{
  jp:R("病院","びょういん")+"で", en:"At a clinic",
  setup:"You have a sore throat and explain your symptoms at a clinic.",
  lines:[
    {who:"Reception", jp:"今日はどうしましたか。", en:"What brings you in today?"},
    {who:"You", jp:"昨日から"+R("喉","のど")+"が"+R("痛","いた")+"いんです。", en:"My throat has hurt since yesterday."},
    {who:"Reception", jp:R("熱","ねつ")+"がありますか。", en:"Do you have a fever?"},
    {who:"You", jp:"いいえ、"+R("熱","ねつ")+"はありません。でも、"+R("咳","せき")+"が出ます。", en:"No, I do not have a fever. But I have a cough."},
    {who:"Doctor", jp:"ちょっと"+R("口","くち")+"を"+R("開","あ")+"けてください。…"+R("風邪","かぜ")+"ですね。", en:"Please open your mouth a moment. ...It's a cold."},
    {who:"You", jp:R("薬","くすり")+"を"+R("飲","の")+"んだら、"+R("運動","うんどう")+"してもいいですか。", en:"After I take the medicine, is it okay to exercise?"},
    {who:"Doctor", jp:"今日はやめておいたほうがいいですね。"+R("薬","くすり")+"を出します。ゆっくり"+R("休","やす")+"んでください。", en:"You'd better skip it today. I'll prescribe medicine. Please rest."},
    {who:"You", jp:"わかりました。ありがとうございました。", en:"Understood. Thank you very much."}
  ],
  keyPhrases:[
    {jp:"昨日から〜が痛いんです", en:"My ~ has hurt since yesterday"},
    {jp:"熱はありません", en:"I don't have a fever"},
    {jp:"咳が出ます", en:"I have a cough"},
    {jp:"〜たほうがいいですね", en:"You'd better ~ (advice you'll hear)"}
  ],
  roleplay:"Swap in 頭が痛い (my head hurts), お腹が痛い (my stomach hurts), or 気分が悪い (I feel sick), and add 二日前から (since two days ago).",
  quiz:[
    {q:"「昨日から」shows that the symptom started:", choices:["tomorrow","yesterday and continues","only next week","because of medicine"], a:1, ex:"から after a time expression marks the starting point: since yesterday."},
    {q:"やめておいたほうがいいですね is the doctor:", choices:["forbidding it outright","recommending you not do it","asking if you want to","saying it's already stopped"], a:1, ex:"〜ないほうがいい／やめておいたほうがいい is advice, not prohibition — softer than 〜てはいけません."}
  ]
},
/* === 8 === */
{
  jp:"コンビニで", en:"At a convenience store",
  setup:"You buy a drink and a snack, answer the standard counter questions, and pay.",
  lines:[
    {who:"Staff", jp:"いらっしゃいませ。", en:"Welcome."},
    {who:"You", jp:"このお"+R("茶","ちゃ")+"とおにぎりをください。", en:"This tea and a rice ball, please."},
    {who:"Staff", jp:"おにぎりは"+R("温","あたた")+"めますか。", en:"Shall I warm up the rice ball?"},
    {who:"You", jp:"いえ、"+R("大丈夫","だいじょうぶ")+"です。", en:"No, it's fine as it is."},
    {who:"Staff", jp:R("袋","ふくろ")+"はご"+R("利用","りよう")+"ですか。", en:"Would you like a bag?"},
    {who:"You", jp:"はい、お願いします。", en:"Yes, please."},
    {who:"Staff", jp:"三"+R("百八十円","ひゃくはちじゅうえん")+"です。", en:"That will be 380 yen."},
    {who:"You", jp:"はい、どうぞ。", en:"Here you are."},
    {who:"Staff", jp:"ありがとうございました。またお"+R("越","こ")+"しください。", en:"Thank you very much. Please come again."}
  ],
  keyPhrases:[
    {jp:"〜をください", en:"~, please"},
    {jp:"温めますか", en:"Shall I heat it up? (staff line — recognise it)"},
    {jp:"袋はご利用ですか", en:"Do you need a bag? (staff line)"},
    {jp:"大丈夫です", en:"I'm fine / no need"}
  ],
  roleplay:"Try ordering a different drink and answer the counter questions the other way: 温めてください、袋はいりません、ポイントカードはありません.",
  quiz:[
    {q:"How do you politely say 'this tea and a rice ball, please'?", choices:["このお茶とおにぎりをください","このお茶がおにぎりです","このお茶でおにぎりをします","このお茶におにぎりがいます"], a:0, ex:"ください after the object is a direct, useful way to request something in a shop."},
    {q:"Staff ask 温めますか。You don't want it heated. The most natural reply is:", choices:["大丈夫です","温めます","おいしいです","わかりません"], a:0, ex:"大丈夫です works as a soft 'no thanks' all over Japan. そのままで大丈夫です ('as it is, it's fine') is the fuller version."}
  ]
},
/* === 9 === */
{
  jp:R("友達","ともだち")+"を"+R("誘","さそ")+"う", en:"Inviting a friend",
  setup:"You invite a friend to a movie and work out a time together.",
  lines:[
    {who:"A", jp:R("土曜日","どようび")+"、いっしょに"+R("映画","えいが")+"を見ませんか。", en:"Would you like to watch a movie together on Saturday?"},
    {who:"B", jp:"いいですね。"+R("何時","なんじ")+"に会いましょうか。", en:"Sounds good. What time shall we meet?"},
    {who:"A", jp:R("駅","えき")+"の"+R("前","まえ")+"で二時に会いましょう。", en:"Let's meet in front of the station at two."},
    {who:"B", jp:"すみません、二時はちょっと…。三時でもいいですか。", en:"Sorry, two is a little difficult... Is three okay?"},
    {who:"A", jp:"はい、三時で"+R("大丈夫","だいじょうぶ")+"です。", en:"Yes, three is fine."},
    {who:"B", jp:R("映画","えいが")+"のあとで、ごはんも"+R("食","た")+"べに行きませんか。", en:"After the movie, shall we go eat as well?"},
    {who:"A", jp:"いいですね。じゃあ、"+R("楽","たの")+"しみにしています。", en:"Nice. I'm looking forward to it, then."}
  ],
  keyPhrases:[
    {jp:"いっしょに〜ませんか", en:"Won't you ~ together? (invitation)"},
    {jp:"何時に会いましょうか", en:"What time shall we meet?"},
    {jp:"〜はちょっと…", en:"~ is a bit difficult (soft refusal)"},
    {jp:"楽しみにしています", en:"I'm looking forward to it"}
  ],
  roleplay:"Change the activity to lunch, shopping, or a museum visit and negotiate a new time. Then practise the harder version: decline the whole invitation politely.",
  quiz:[
    {q:"Which is a natural soft refusal or hesitation?", choices:["二時はちょっと…","二時をちょっと…","二時にちょっと…","二時がちょっとです"], a:0, ex:"二時はちょっと… leaves the reason unsaid and is a very common soft way to say the time is difficult."},
    {q:"〜ませんか as an invitation is:", choices:["a negative question expecting 'no'","a polite invitation, softer than 〜ましょう","a command","hearsay"], a:1, ex:"The negative question form is the standard polite invitation — it leaves the listener room to decline, which is why it feels softer than 〜ましょう."}
  ]
},
/* === 10 === */
{
  jp:R("写真","しゃしん")+"を"+R("撮","と")+"る", en:"Taking a photo",
  setup:"You ask someone to take your photo at a sightseeing spot.",
  lines:[
    {who:"You", jp:"すみません、"+R("写真","しゃしん")+"を"+R("撮","と")+"っていただけませんか。", en:"Excuse me, could you take a photo for me?"},
    {who:"Visitor", jp:"はい、もちろんです。", en:"Yes, of course."},
    {who:"You", jp:"このボタンを"+R("押","お")+"してください。", en:"Please press this button."},
    {who:"Visitor", jp:"わかりました。"+R("後","うし")+"ろの"+R("塔","とう")+"も"+R("入","い")+"れますか。", en:"Okay. Shall I get the tower behind you in as well?"},
    {who:"You", jp:"はい、お願いします。", en:"Yes, please."},
    {who:"Visitor", jp:"はい、"+R("撮","と")+"りますよ。もう一"+R("枚","まい")+R("撮","と")+"りましょうか。", en:"Okay, here goes. Shall I take one more?"},
    {who:"You", jp:"ありがとうございます。"+R("完璧","かんぺき")+"です！"+R("私","わたし")+"が"+R("撮","と")+"りましょうか。", en:"Thank you. It's perfect! Shall I take one of you?"}
  ],
  keyPhrases:[
    {jp:"写真を撮っていただけませんか", en:"Could you take a photo for me?"},
    {jp:"このボタンを押してください", en:"Please press this button"},
    {jp:"もう一枚お願いします", en:"One more, please"},
    {jp:"私が撮りましょうか", en:"Shall I take one for you?"}
  ],
  roleplay:"Practise asking for two photos and offering to take the other person's photo too: 私が撮りましょうか。",
  quiz:[
    {q:"写真を撮っていただけませんか is a polite way to ask someone to:", choices:["buy a camera","take a photo","look at a photo","delete a photo"], a:1, ex:"撮っていただけませんか is a respectful request meaning 'could you take it for me?'"},
    {q:"撮りましょうか (rather than 撮りますか) is used to:", choices:["ask what the other person will do","offer to do something for the other person","report hearsay","give a command"], a:1, ex:"〜ましょうか offers your own action for someone else's benefit — 'shall I ~ (for you)?'"}
  ]
}
,
/* === 11 === */
{
  jp:R("空港","くうこう")+"・"+R("入国審査","にゅうこくしんさ"), en:"Airport & immigration",
  setup:"You land in Japan and go through immigration, then collect your bag.",
  lines:[
    {who:"Officer", jp:"パスポートをお"+R("願","ねが")+"いします。"+R("旅行","りょこう")+"の"+R("目的","もくてき")+"は"+R("何","なん")+"ですか。", en:"Your passport, please. What is the purpose of your trip?"},
    {who:"You", jp:R("観光","かんこう")+"です。", en:"Sightseeing."},
    {who:"Officer", jp:"どのくらい"+R("滞在","たいざい")+"しますか。", en:"How long will you be staying?"},
    {who:"You", jp:"十"+R("日間","にちかん")+"の"+R("予定","よてい")+"です。", en:"Ten days, as planned."},
    {who:"Officer", jp:"どこに"+R("泊","と")+"まりますか。", en:"Where will you be staying?"},
    {who:"You", jp:R("大阪","おおさか")+"のホテルです。"+R("予約表","よやくひょう")+"を"+R("見","み")+"せましょうか。", en:"A hotel in Osaka. Shall I show you the booking?"},
    {who:"Officer", jp:"お願いします。…はい、"+R("結構","けっこう")+"です。"+R("次","つぎ")+"は"+R("荷物","にもつ")+"の"+R("受取所","うけとりじょ")+"へどうぞ。", en:"Please. ...Alright, that's fine. Please proceed to baggage claim."},
    {who:"You", jp:"すみません、"+R("荷物","にもつ")+"が"+R("出","で")+"てこないんですが…", en:"Excuse me, my luggage hasn't come out..."},
    {who:"Staff", jp:"こちらの"+R("紙","かみ")+"にご"+R("記入","きにゅう")+"ください。ホテルまでお"+R("届","とど")+"けします。", en:"Please fill in this form. We'll deliver it to your hotel."}
  ],
  keyPhrases:[
    {jp:"旅行の目的は観光です", en:"The purpose of my trip is sightseeing"},
    {jp:"十日間の予定です", en:"I'm planning to stay ten days"},
    {jp:"〜に泊まります", en:"I'm staying at ~"},
    {jp:"荷物が出てこないんですが", en:"My luggage hasn't come out..."}
  ],
  roleplay:"Answer the same three questions (目的・滞在・泊まる所) about a business trip instead: 仕事です／一週間です／東京の会社の近くです.",
  quiz:[
    {q:"The officer asks どのくらい滞在しますか。They want to know:", choices:["where you're staying","how long you're staying","who you're with","how much money you have"], a:1, ex:"滞在する = to stay; どのくらい asks about duration. Compare どこに泊まりますか, which asks about the place."},
    {q:"「見せましょうか」offers to:", choices:["look at something","show something to them","be shown something","stop showing"], a:1, ex:"見せる is 'to show (someone)' — 見る is 'to look'. 〜ましょうか then turns it into an offer: 'shall I show you?'"}
  ]
},
/* === 12 === */
{
  jp:R("駅","えき")+"で"+R("切符","きっぷ")+"を"+R("買","か")+"う", en:"Buying a ticket at the station",
  setup:"The ticket machine is confusing, so you ask at the window instead.",
  lines:[
    {who:"You", jp:"すみません、"+R("京都","きょうと")+"までの"+R("切符","きっぷ")+"を"+R("買","か")+"いたいんですが。", en:"Excuse me, I'd like to buy a ticket to Kyoto."},
    {who:"Staff", jp:R("片道","かたみち")+"ですか、"+R("往復","おうふく")+"ですか。", en:"One way, or round trip?"},
    {who:"You", jp:R("片道","かたみち")+"でお願いします。いくらですか。", en:"One way, please. How much is it?"},
    {who:"Staff", jp:"二"+R("千八百円","せんはっぴゃくえん")+"です。"+R("指定席","していせき")+"にしますか。", en:"2,800 yen. Would you like a reserved seat?"},
    {who:"You", jp:"はい、"+R("窓側","まどがわ")+"の"+R("席","せき")+"があれば、お願いします。", en:"Yes, a window seat if there is one, please."},
    {who:"Staff", jp:"ございます。"+R("次","つぎ")+"の"+R("電車","でんしゃ")+"は十"+R("時十五分発","じじゅうごふんはつ")+"、三"+R("番線","ばんせん")+"です。", en:"We have one. The next train is at 10:15 from platform 3."},
    {who:"You", jp:R("三番線","さんばんせん")+"ですね。ICカードもここで"+R("買","か")+"えますか。", en:"Platform 3, right? Can I buy an IC card here too?"},
    {who:"Staff", jp:"はい、こちらでお"+R("作","つく")+"りできます。", en:"Yes, we can make one for you here."}
  ],
  keyPhrases:[
    {jp:"〜までの切符を買いたいんですが", en:"I'd like a ticket to ~"},
    {jp:"片道／往復でお願いします", en:"One way / round trip, please"},
    {jp:"窓側の席があれば、お願いします", en:"A window seat if available, please"},
    {jp:"何番線ですか", en:"Which platform?"}
  ],
  roleplay:"Buy a round-trip ticket for two people instead: 二人分、往復でお願いします。Then ask 何時の電車がありますか.",
  quiz:[
    {q:"「窓側の席があれば、お願いします」uses 〜ば to mean:", choices:["because there is one","if there is one","even though there is one","after there is one"], a:1, ex:"〜ば is the conditional here — 'if there is a window seat'. It's a polite way to make the request contingent rather than demanding."},
    {q:"買いたいんですが is softer than 買いたいです because んですが:", choices:["makes it past tense","sets up your situation and invites the staff to respond","turns it into hearsay","makes it a command"], a:1, ex:"〜んですが trails off deliberately, presenting your need as context for them to act on. It's the standard shape for requests at a counter."}
  ]
},
/* === 13 === */
{
  jp:"タクシーで", en:"Taking a taxi",
  setup:"You take a taxi to your hotel and need to explain where you're going.",
  lines:[
    {who:"Driver", jp:"どちらまでですか。", en:"Where to?"},
    {who:"You", jp:"この"+R("住所","じゅうしょ")+"までお願いします。", en:"To this address, please."},
    {who:"Driver", jp:"はい、かしこまりました。"+R("道","みち")+"が"+R("混","こ")+"んでいるので、"+R("少","すこ")+"し時間がかかります。", en:"Certainly. The roads are busy, so it'll take a little while."},
    {who:"You", jp:"どのくらいかかりますか。", en:"About how long will it take?"},
    {who:"Driver", jp:"二十分ぐらいだと思います。", en:"About twenty minutes, I'd say."},
    {who:"You", jp:"すみません、"+R("急","いそ")+"いでいるので、"+R("近道","ちかみち")+"はありますか。", en:"Sorry — I'm in a hurry, is there a shortcut?"},
    {who:"Driver", jp:"では、"+R("別","べつ")+"の"+R("道","みち")+"で行きますね。", en:"Alright, I'll take a different route then."},
    {who:"You", jp:"（"+R("到着","とうちゃく")+"）ここで"+R("降","お")+"ります。"+R("領収書","りょうしゅうしょ")+"をお願いします。", en:"(on arrival) I'll get out here. May I have a receipt, please?"}
  ],
  keyPhrases:[
    {jp:"この住所までお願いします", en:"To this address, please"},
    {jp:"どのくらいかかりますか", en:"How long will it take?"},
    {jp:"急いでいるんですが", en:"I'm in a hurry..."},
    {jp:"ここで降ります／領収書をお願いします", en:"I'll get out here / receipt please"}
  ],
  roleplay:"Give the destination three ways: by address, by landmark (東京駅の北口まで), and by showing your phone (ここまでお願いします).",
  quiz:[
    {q:"「道が混んでいる」means:", choices:["the road is closed","the road is crowded","the road is narrow","the road is new"], a:1, ex:"混む (こむ) = to be crowded; 混んでいる is the resulting-state 〜ている. Extremely common for trains and roads."},
    {q:"You want the driver to stop where you are. Say:", choices:["ここで降ります","ここに乗ります","ここを行きます","ここが来ます"], a:0, ex:"降りる (to get off/out) with で marking the place of the action. 乗る would mean getting in."}
  ]
},
/* === 14 === */
{
  jp:"バスの"+R("乗","の")+"り"+R("方","かた"), en:"Working out how the bus works",
  setup:"Local buses often take payment on exit, which catches visitors out. You ask before boarding.",
  lines:[
    {who:"You", jp:"すみません、このバスは"+R("駅","えき")+"に行きますか。", en:"Excuse me, does this bus go to the station?"},
    {who:"Driver", jp:"はい、行きますよ。"+R("後","うし")+"ろから"+R("乗","の")+"ってください。", en:"Yes, it does. Please board from the rear."},
    {who:"You", jp:R("料金","りょうきん")+"はいつ"+R("払","はら")+"えばいいですか。", en:"When should I pay the fare?"},
    {who:"Driver", jp:R("降","お")+"りるときに"+R("払","はら")+"ってください。"+R("整理券","せいりけん")+"を"+R("取","と")+"ってくださいね。", en:"Please pay when you get off. Take a numbered ticket."},
    {who:"You", jp:"わかりました。"+R("駅","えき")+"に"+R("着","つ")+"いたら、"+R("教","おし")+"えてもらえますか。", en:"Understood. Could you let me know when we reach the station?"},
    {who:"Driver", jp:"はい、"+R("放送","ほうそう")+"もありますから、"+R("大丈夫","だいじょうぶ")+"ですよ。", en:"Sure — there's an announcement too, so you'll be fine."},
    {who:"You", jp:"ありがとうございます。"+R("助","たす")+"かりました。", en:"Thank you. That's a big help."}
  ],
  keyPhrases:[
    {jp:"料金はいつ払えばいいですか", en:"When should I pay the fare?"},
    {jp:"降りるときに払います", en:"You pay when you get off"},
    {jp:"整理券を取ってください", en:"Please take a numbered ticket"},
    {jp:"着いたら教えてもらえますか", en:"Could you tell me when we arrive?"}
  ],
  roleplay:"Practise the same exchange for a city bus with flat fare: 料金は先払いですか、後払いですか (do you pay before or after?).",
  quiz:[
    {q:"払えばいいですか is asking:", choices:["whether paying is forbidden","what the best/expected way to pay is","whether you already paid","how much it costs"], a:1, ex:"〜ばいいですか asks for guidance — 'what should I do?'. It's one of the single most useful question shapes for a traveller."},
    {q:"「駅に着いたら、教えてもらえますか」— the たら clause means:", choices:["because we arrived","when we arrive","even if we arrive","in order to arrive"], a:1, ex:"〜たら here is the 'when/once' conditional for a one-off future event — you arrive first, then they tell you."}
  ]
},
/* === 15 === */
{
  jp:"カフェで", en:"At a café",
  setup:"You order a coffee and have to answer size, hot/cold and eat-in questions.",
  lines:[
    {who:"Staff", jp:"いらっしゃいませ。ご"+R("注文","ちゅうもん")+"はお"+R("決","き")+"まりですか。", en:"Welcome. Are you ready to order?"},
    {who:"You", jp:"ホットコーヒーを一つお願いします。", en:"One hot coffee, please."},
    {who:"Staff", jp:"サイズはどうしますか。S、M、Lがございます。", en:"What size? We have small, medium and large."},
    {who:"You", jp:"Mでお願いします。それから、この"+R("甘","あま")+"いパンも一つください。", en:"Medium, please. And one of these sweet buns too."},
    {who:"Staff", jp:R("店内","てんない")+"でお"+R("召","め")+"し"+R("上","あ")+"がりですか、お"+R("持","も")+"ち"+R("帰","かえ")+"りですか。", en:"Will you eat in, or take away?"},
    {who:"You", jp:R("店内","てんない")+"でお願いします。", en:"Eat in, please."},
    {who:"Staff", jp:"かしこまりました。あちらの"+R("席","せき")+"でお"+R("待","ま")+"ちください。", en:"Certainly. Please wait at that seat over there."},
    {who:"You", jp:"すみません、"+R("電源","でんげん")+"はありますか。", en:"Excuse me, is there a power outlet?"},
    {who:"Staff", jp:R("窓側","まどがわ")+"の"+R("席","せき")+"にございます。Wi‑Fiも"+R("無料","むりょう")+"です。", en:"There are some at the window seats. The wifi is free too."}
  ],
  keyPhrases:[
    {jp:"〜を一つお願いします", en:"One ~, please"},
    {jp:"店内で／持ち帰りで", en:"Eat in / take away"},
    {jp:"電源はありますか", en:"Is there a power outlet?"},
    {jp:"Wi‑Fiは無料ですか", en:"Is the wifi free?"}
  ],
  roleplay:"Run it again as a takeaway order for two drinks, and add 氷を少なめでお願いします (less ice, please).",
  quiz:[
    {q:"お召し上がりですか is the polite equivalent of:", choices:["買いますか","食べますか","作りますか","帰りますか"], a:1, ex:"召し上がる is the honorific form of 食べる／飲む. Staff use it about you; you don't use it about yourself."},
    {q:"To say you're taking the drink away, the natural phrase is:", choices:["持ち帰りでお願いします","店内でお願いします","持っていきましょうか","帰ってもいいですか"], a:0, ex:"持ち帰りで(お願いします) is the standard counter phrase. テイクアウトで also works."}
  ]
},
/* === 16 === */
{
  jp:R("居酒屋","いざかや")+"で", en:"At an izakaya with coworkers",
  setup:"A casual after-work meal — ordering as a group, toasting, and splitting the bill.",
  lines:[
    {who:"Coworker", jp:"とりあえず、"+R("飲","の")+"み"+R("物","もの")+"を"+R("頼","たの")+"みましょうか。"+R("何","なに")+"にしますか。", en:"Shall we order drinks first? What'll you have?"},
    {who:"You", jp:"じゃあ、ウーロン"+R("茶","ちゃ")+"にします。お"+R("酒","さけ")+"はあまり"+R("飲","の")+"めないんです。", en:"I'll have oolong tea, then. I can't really drink alcohol."},
    {who:"Coworker", jp:"そうなんですね。じゃあ、"+R("食","た")+"べ"+R("物","もの")+"は"+R("何","なに")+"か"+R("苦手","にがて")+"なものはありますか。", en:"Ah, I see. Is there any food you'd rather avoid?"},
    {who:"You", jp:R("生","なま")+"の"+R("魚","さかな")+"はちょっと…。"+R("他","ほか")+"は"+R("何","なん")+"でも"+R("大丈夫","だいじょうぶ")+"です。", en:"Raw fish is a bit... Anything else is fine."},
    {who:"Coworker", jp:"わかりました。じゃあ、"+R("焼","や")+"き"+R("鳥","とり")+"と"+R("枝豆","えだまめ")+"を"+R("頼","たの")+"みますね。…かんぱい！", en:"Got it. I'll order yakitori and edamame then. ...Cheers!"},
    {who:"You", jp:"かんぱい！この"+R("店","みせ")+"、"+R("雰囲気","ふんいき")+"がいいですね。", en:"Cheers! This place has a nice atmosphere."},
    {who:"Coworker", jp:"でしょう？よく"+R("来","き")+"るんですよ。…そろそろ"+R("帰","かえ")+"りましょうか。", en:"Right? I come here a lot. ...Shall we head off soon?"},
    {who:"You", jp:"はい。お"+R("会計","かいけい")+"は"+R("別々","べつべつ")+"でお願いできますか。", en:"Yes. Could we have separate bills?"},
    {who:"Coworker", jp:"じゃあ、"+R("割","わ")+"り"+R("勘","かん")+"にしましょう。お"+R("疲","つか")+"れさまでした！", en:"Let's split it evenly then. Good work today!"}
  ],
  keyPhrases:[
    {jp:"とりあえず飲み物を頼みましょうか", en:"Shall we order drinks first?"},
    {jp:"お酒はあまり飲めないんです", en:"I can't really drink alcohol"},
    {jp:"〜はちょっと…", en:"~ is a bit much for me (polite avoidance)"},
    {jp:"別々でお願いできますか／割り勘にしましょう", en:"Separate bills? / let's split it"}
  ],
  roleplay:"Practise refusing a second drink without killing the mood: もう十分です、ありがとうございます／次はお茶にします。",
  quiz:[
    {q:"「飲めないんです」uses which form?", choices:["passive","potential (negative)","causative","volitional"], a:1, ex:"飲める is the potential form of 飲む, so 飲めない = 'cannot drink' — an ability statement, not a refusal."},
    {q:"割り勘 means:", choices:["paying separately by item","splitting the total evenly","the host pays","paying by card"], a:1, ex:"割り勘 is splitting the bill evenly. 別々 (separately) means each person pays for what they ordered — two different arrangements."}
  ]
},
/* === 17 === */
{
  jp:R("電話","でんわ")+"で"+R("予約","よやく")+"する", en:"Making a reservation by phone",
  setup:"Phone calls are the hardest kaiwa situation — no gestures, no lip reading. Rehearse this one out loud twice.",
  lines:[
    {who:"Shop", jp:"はい、レストラン"+R("さくら","さくら")+"でございます。", en:"Hello, this is Restaurant Sakura."},
    {who:"You", jp:"あの、"+R("予約","よやく")+"をお願いしたいんですが。", en:"Um, I'd like to make a reservation."},
    {who:"Shop", jp:"ありがとうございます。"+R("何日","なんにち")+"の"+R("何時","なんじ")+"ごろでしょうか。", en:"Thank you. For what date and time?"},
    {who:"You", jp:R("今週","こんしゅう")+"の"+R("金曜日","きんようび")+"、"+R("七時","しちじ")+"から二人でお願いします。", en:"This Friday at seven, for two people, please."},
    {who:"Shop", jp:R("少","しょう")+"々お"+R("待","ま")+"ちください。…はい、ご"+R("用意","ようい")+"できます。お"+R("名前","なまえ")+"をお願いします。", en:"One moment please. ...Yes, we can accommodate that. May I have your name?"},
    {who:"You", jp:"ダレンです。すみません、もう一"+R("度","ど")+R("確認","かくにん")+"させてください。"+R("金曜日","きんようび")+"の"+R("七時","しちじ")+"、二人ですね。", en:"It's Darren. Sorry, let me confirm once more — Friday at seven, two people, correct?"},
    {who:"Shop", jp:"はい、"+R("左様","さよう")+"でございます。お"+R("待","ま")+"ちしております。", en:"Yes, that's right. We look forward to seeing you."},
    {who:"You", jp:"よろしくお願いします。"+R("失礼","しつれい")+"します。", en:"Thank you very much. Goodbye."}
  ],
  keyPhrases:[
    {jp:"予約をお願いしたいんですが", en:"I'd like to make a reservation"},
    {jp:"金曜日の七時から二人でお願いします", en:"Friday at seven, for two, please"},
    {jp:"もう一度確認させてください", en:"Let me confirm once more"},
    {jp:"失礼します", en:"Goodbye (ending a call politely)"}
  ],
  roleplay:"Call to change the booking instead: すみません、予約の時間を変えたいんですが — then cancel it: キャンセルをお願いします。",
  quiz:[
    {q:"確認させてください uses the causative to mean:", choices:["make me confirm","please let me confirm","I was made to confirm","confirm it for me"], a:1, ex:"Causative + てください = 'please let me ~'. It's the polite way to claim a moment for yourself: 説明させてください、考えさせてください."},
    {q:"On the phone, 失礼します at the end functions as:", choices:["an apology for a mistake","a polite sign-off","a request to continue","a greeting"], a:1, ex:"失礼します is the standard polite way to close a phone call, and also to enter or leave a room."}
  ]
},
/* === 18 === */
{
  jp:R("遅","おく")+"れる"+R("連絡","れんらく"), en:"Telling someone you'll be late",
  setup:"You're stuck on a delayed train and need to message, then apologise in person.",
  lines:[
    {who:"You", jp:"もしもし、すみません、"+R("電車","でんしゃ")+"が"+R("遅","おく")+"れていて、十五分ぐらい"+R("遅","おく")+"れそうです。", en:"Hello, sorry — the train is delayed, so I'll probably be about fifteen minutes late."},
    {who:"Friend", jp:"あ、"+R("大丈夫","だいじょうぶ")+"ですよ。"+R("気","き")+"をつけて"+R("来","き")+"てください。", en:"Ah, no problem. Take care on the way."},
    {who:"You", jp:R("本当","ほんとう")+"にすみません。"+R("先","さき")+"に"+R("注文","ちゅうもん")+"していてください。", en:"I'm really sorry. Please go ahead and order without me."},
    {who:"Friend", jp:"わかりました。じゃあ、"+R("店","みせ")+"の"+R("中","なか")+"で"+R("待","ま")+"っています。", en:"Okay. I'll wait inside the restaurant then."},
    {who:"You", jp:"（"+R("到着","とうちゃく")+"）お"+R("待","ま")+"たせしました。"+R("遅","おく")+"くなって、すみません。", en:"(arriving) Sorry to keep you waiting. Apologies for being late."},
    {who:"Friend", jp:"いえいえ、"+R("私","わたし")+"もさっき"+R("着","つ")+"いたところです。", en:"Not at all, I only got here a moment ago myself."},
    {who:"You", jp:"よかった。"+R("次","つぎ")+"はもっと"+R("早","はや")+"く"+R("出","で")+"るようにします。", en:"Good. I'll make sure to leave earlier next time."}
  ],
  keyPhrases:[
    {jp:"十五分ぐらい遅れそうです", en:"I'll probably be about 15 minutes late"},
    {jp:"先に注文していてください", en:"Please go ahead and order"},
    {jp:"遅くなって、すみません", en:"Sorry for being late"},
    {jp:"〜ようにします", en:"I'll make an effort to ~"}
  ],
  roleplay:"Do the workplace version, one notch politer: 申し訳ありません、電車が遅れておりまして、三十分ほど遅れます。",
  quiz:[
    {q:"遅れそうです expresses:", choices:["hearsay from someone else","your own judgement from the situation that you'll be late","a firm decision","a past event"], a:1, ex:"〜そう attached to the verb stem is the 'looks like / about to' appearance meaning — you're judging from what you can see. Hearsay would be 遅れるそうです."},
    {q:"「着いたところです」means:", choices:["I'm about to arrive","I just arrived a moment ago","I arrived long ago","the place where I arrived"], a:1, ex:"〜たところ marks an action completed just now. A very natural way to tell a late friend not to worry."}
  ]
},
/* === 19 === */
{
  jp:R("道","みち")+"に"+R("迷","まよ")+"った", en:"Properly lost, phone in hand",
  setup:"Your map app is confusing you and you need real human help.",
  lines:[
    {who:"You", jp:"すみません、ちょっといいですか。"+R("道","みち")+"に"+R("迷","まよ")+"ってしまいました。", en:"Excuse me, do you have a second? I've got myself lost."},
    {who:"Passerby", jp:"どこへ行きたいんですか。", en:"Where are you trying to go?"},
    {who:"You", jp:"このホテルなんですが、"+R("地図","ちず")+"で"+R("教","おし")+"えてもらえますか。", en:"This hotel — could you show me on the map?"},
    {who:"Passerby", jp:"ああ、ここですね。今、"+R("反対","はんたい")+"の"+R("方向","ほうこう")+"に"+R("歩","ある")+"いていますよ。", en:"Ah, it's here. You're walking in the opposite direction right now."},
    {who:"You", jp:"えっ、"+R("本当","ほんとう")+"ですか。じゃあ、どう行けばいいですか。", en:"Oh no, really? So how should I go?"},
    {who:"Passerby", jp:"あの"+R("信号","しんごう")+"まで"+R("戻","もど")+"って、"+R("右","みぎ")+"に"+R("曲","ま")+"がってください。五分ぐらいです。", en:"Go back to that traffic light and turn right. It's about five minutes."},
    {who:"You", jp:R("信号","しんごう")+"まで"+R("戻","もど")+"って、"+R("右","みぎ")+"ですね。ありがとうございます、"+R("助","たす")+"かりました。", en:"Back to the light, then right. Thank you, that's a big help."},
    {who:"Passerby", jp:"いえいえ。"+R("気","き")+"をつけてくださいね。", en:"Not at all. Do take care."}
  ],
  keyPhrases:[
    {jp:"道に迷ってしまいました", en:"I've gotten lost"},
    {jp:"地図で教えてもらえますか", en:"Could you show me on the map?"},
    {jp:"どう行けばいいですか", en:"How should I go?"},
    {jp:"〜まで戻ってください", en:"Please go back as far as ~"}
  ],
  roleplay:"Practise the confirmation echo — repeat the directions back in your own words every time. That one habit prevents most lost-again situations.",
  quiz:[
    {q:"迷ってしまいました adds しまう to convey:", choices:["it was on purpose","regret about an unintended result","it's still happening","it happened to someone else"], a:1, ex:"〜てしまう marks an action as completed with a sense of 'oops' — perfect for getting lost, oversleeping, or deleting a file."},
    {q:"Echoing back 「信号まで戻って、右ですね」does what for you?", choices:["Nothing, it's redundant","Confirms you understood and invites correction","Sounds rude","Changes the meaning"], a:1, ex:"Repeating instructions back with ですね is a native habit — it confirms comprehension and gives the other person a chance to fix a misunderstanding immediately."}
  ]
},
/* === 20 === */
{
  jp:R("忘","わす")+"れ"+R("物","もの"), en:"Lost property",
  setup:"You left a bag on the train and go to the station office.",
  lines:[
    {who:"You", jp:"すみません、"+R("電車","でんしゃ")+"にかばんを"+R("忘","わす")+"れてしまったんですが。", en:"Excuse me, I left my bag on the train."},
    {who:"Staff", jp:"どの"+R("電車","でんしゃ")+"ですか。"+R("時間","じかん")+"はわかりますか。", en:"Which train? Do you know the time?"},
    {who:"You", jp:"三十分ぐらい"+R("前","まえ")+"の、"+R("大阪行","おおさかゆ")+"きの"+R("電車","でんしゃ")+"です。", en:"About thirty minutes ago, the train bound for Osaka."},
    {who:"Staff", jp:"どんなかばんですか。"+R("色","いろ")+"や"+R("大","おお")+"きさを"+R("教","おし")+"えてください。", en:"What kind of bag? Please tell me the colour and size."},
    {who:"You", jp:R("黒","くろ")+"くて、"+R("小","ちい")+"さいリュックです。"+R("中","なか")+"にパスポートが"+R("入","はい")+"っています。", en:"It's a small black backpack. My passport is inside."},
    {who:"Staff", jp:R("調","しら")+"べてみます。…"+R("届","とど")+"いていますね。こちらで"+R("確認","かくにん")+"してください。", en:"Let me check. ...Yes, it's been handed in. Please confirm it here."},
    {who:"You", jp:"あっ、これです！"+R("本当","ほんとう")+"にありがとうございます。", en:"Oh, that's it! Thank you so much."},
    {who:"Staff", jp:"よかったですね。こちらに"+R("名前","なまえ")+"をお"+R("書","か")+"きください。", en:"I'm glad. Please write your name here."}
  ],
  keyPhrases:[
    {jp:"〜を忘れてしまったんですが", en:"I left my ~ behind..."},
    {jp:"黒くて、小さいリュックです", en:"It's a small black backpack"},
    {jp:"中に〜が入っています", en:"My ~ is inside it"},
    {jp:"届いていますね", en:"It's been handed in (staff line)"}
  ],
  roleplay:"Describe three of your own belongings in one sentence each using 〜くて／〜で to link adjectives: 大きくて、青いスーツケースです。",
  quiz:[
    {q:"「黒くて、小さいリュック」— why 黒くて and not 黒いと?", choices:["黒い is a noun","い-adjectives link with 〜くて, not と","と is only for verbs","both are equally correct"], a:1, ex:"To stack adjectives you use the て-form: 黒い → 黒くて. と linking is for nouns/lists of things, not for chaining adjectives."},
    {q:"入っています here describes:", choices:["an action happening now","a continuing state — it's in there","a habit","a completed action with regret"], a:1, ex:"入る is a change-of-state verb, so 入っています = 'is (currently) inside' — the same state meaning as 住んでいます or 結婚しています."}
  ]
},
/* === 21 === */
{
  jp:R("郵便局","ゆうびんきょく")+"で", en:"At the post office",
  setup:"You send a parcel of souvenirs home and ask about cost and speed.",
  lines:[
    {who:"You", jp:"すみません、これをフィリピンまで"+R("送","おく")+"りたいんですが。", en:"Excuse me, I'd like to send this to the Philippines."},
    {who:"Staff", jp:R("中身","なかみ")+"は"+R("何","なん")+"ですか。", en:"What are the contents?"},
    {who:"You", jp:"お"+R("土産","みやげ")+"です。お"+R("菓子","かし")+"とTシャツが"+R("入","はい")+"っています。", en:"Souvenirs. There are sweets and a T-shirt inside."},
    {who:"Staff", jp:R("船便","ふなびん")+"と"+R("航空便","こうくうびん")+"がありますが、どちらにしますか。", en:"We have sea mail and air mail — which would you like?"},
    {who:"You", jp:R("値段","ねだん")+"と"+R("日数","にっすう")+"はどのくらい"+R("違","ちが")+"いますか。", en:"How much do they differ in price and number of days?"},
    {who:"Staff", jp:R("航空便","こうくうびん")+"は"+R("一週間","いっしゅうかん")+"ぐらいですが、"+R("船便","ふなびん")+"より"+R("高","たか")+"いです。", en:"Air mail takes about a week, but it's more expensive than sea mail."},
    {who:"You", jp:"じゃあ、"+R("航空便","こうくうびん")+"でお願いします。"+R("箱","はこ")+"も"+R("買","か")+"えますか。", en:"Air mail, then. Can I buy a box here too?"},
    {who:"Staff", jp:"はい、こちらにございます。この"+R("紙","かみ")+"にご"+R("記入","きにゅう")+"をお願いします。", en:"Yes, they're over here. Please fill in this form."}
  ],
  keyPhrases:[
    {jp:"これを〜まで送りたいんですが", en:"I'd like to send this to ~"},
    {jp:"中身はお土産です", en:"The contents are souvenirs"},
    {jp:"どのくらい違いますか", en:"How much difference is there?"},
    {jp:"航空便でお願いします", en:"Air mail, please"}
  ],
  roleplay:"Ask the two follow-ups a real sender needs: 追跡できますか (can it be tracked?) and いつ着きますか (when will it arrive?).",
  quiz:[
    {q:"「船便より高いです」means air mail is:", choices:["cheaper than sea mail","more expensive than sea mail","the same as sea mail","not available"], a:1, ex:"AよりB = B compared to A. Here 船便より高い = 'expensive compared to sea mail', i.e. air mail costs more."},
    {q:"送りたいんですが is a polite request shape because it:", choices:["states your wish and leaves the staff to guide you","is a command","reports what someone else wants","is past tense"], a:0, ex:"〜たいんですが states your goal and stops, inviting the staff to take over. Compare the blunter 送ってください."}
  ]
},
/* === 22 === */
{
  jp:R("薬局","やっきょく")+"で", en:"At the pharmacy",
  setup:"You need something for a cold and have to describe symptoms without a doctor.",
  lines:[
    {who:"You", jp:"すみません、"+R("風邪","かぜ")+"の"+R("薬","くすり")+"はありますか。", en:"Excuse me, do you have cold medicine?"},
    {who:"Pharmacist", jp:"どんな"+R("症状","しょうじょう")+"ですか。"+R("熱","ねつ")+"や"+R("咳","せき")+"はありますか。", en:"What are your symptoms? Do you have a fever or a cough?"},
    {who:"You", jp:R("熱","ねつ")+"はありませんが、"+R("喉","のど")+"が"+R("痛","いた")+"くて、"+R("鼻水","はなみず")+"も"+R("出","で")+"ます。", en:"No fever, but my throat hurts and I have a runny nose."},
    {who:"Pharmacist", jp:"では、こちらがいいと思います。一日三"+R("回","かい")+"、"+R("食後","しょくご")+"に"+R("飲","の")+"んでください。", en:"Then I'd recommend this one. Take it three times a day, after meals."},
    {who:"You", jp:R("眠","ねむ")+"くなりますか。"+R("明日","あした")+R("運転","うんてん")+"するんですが。", en:"Will it make me drowsy? I have to drive tomorrow."},
    {who:"Pharmacist", jp:"それなら、こちらのほうが"+R("安心","あんしん")+"です。"+R("眠","ねむ")+"くなりにくいですよ。", en:"In that case this one is safer — it's less likely to make you sleepy."},
    {who:"You", jp:"じゃあ、それをください。"+R("何日","なんにち")+"ぐらい"+R("飲","の")+"めばいいですか。", en:"I'll take that, then. How many days should I take it for?"},
    {who:"Pharmacist", jp:"三日"+R("飲","の")+"んでも"+R("良","よ")+"くならなかったら、"+R("病院","びょういん")+"へ行ってください。", en:"If it hasn't improved after three days, please see a doctor."}
  ],
  keyPhrases:[
    {jp:"風邪の薬はありますか", en:"Do you have cold medicine?"},
    {jp:"喉が痛くて、鼻水も出ます", en:"My throat hurts and I have a runny nose"},
    {jp:"一日三回、食後に飲んでください", en:"Three times a day, after meals"},
    {jp:"眠くなりますか", en:"Will it make me drowsy?"}
  ],
  roleplay:"Describe two symptoms linked with 〜くて for three different illnesses — 頭が痛くて、熱があります／お腹が痛くて、気分が悪いです。",
  quiz:[
    {q:"眠くなりにくいです means it is:", choices:["easy to fall asleep","hard to become sleepy","impossible to take","strong medicine"], a:1, ex:"Stem + にくい = hard to do / unlikely to happen. The opposite, 〜やすい, would mean it easily makes you sleepy."},
    {q:"「良くならなかったら」is built from:", choices:["potential + たら","negative past + たら (if it hasn't improved)","causative + たら","passive + たら"], a:1, ex:"良くなる → 良くならなかった → 良くならなかったら. Negative + たら is the standard 'if it doesn't / hasn't' conditional."}
  ]
}
,
/* === 23 === */
{
  jp:"お"+R("土産","みやげ")+"を"+R("選","えら")+"ぶ", en:"Choosing souvenirs",
  setup:"You're buying gifts for family and need wrapping and a bag that survives the flight.",
  lines:[
    {who:"You", jp:"すみません、"+R("家族","かぞく")+"へのお"+R("土産","みやげ")+"を"+R("探","さが")+"しているんですが。", en:"Excuse me, I'm looking for souvenirs for my family."},
    {who:"Staff", jp:"こちらのお"+R("菓子","かし")+"が"+R("人気","にんき")+"ですよ。"+R("味見","あじみ")+"もできます。", en:"These sweets are popular. You can try a sample too."},
    {who:"You", jp:"おいしいですね。これは"+R("日持","ひも")+"ちしますか。"+R("飛行機","ひこうき")+"で"+R("持","も")+"って"+R("帰","かえ")+"りたいんです。", en:"That's tasty. Does it keep well? I want to take it home on a plane."},
    {who:"Staff", jp:"二"+R("週間","しゅうかん")+"ぐらい"+R("大丈夫","だいじょうぶ")+"です。"+R("箱入","はこい")+"りなので、"+R("壊","こわ")+"れにくいですよ。", en:"It lasts about two weeks. It's boxed, so it's unlikely to get crushed."},
    {who:"You", jp:"じゃあ、これを三つください。"+R("別々","べつべつ")+"の"+R("袋","ふくろ")+"に"+R("入","い")+"れてもらえますか。", en:"I'll take three, then. Could you put them in separate bags?"},
    {who:"Staff", jp:"かしこまりました。プレゼント"+R("用","よう")+"にお"+R("包","つつ")+"みしますか。", en:"Certainly. Shall I gift-wrap them?"},
    {who:"You", jp:"はい、お願いします。"+R("紙袋","かみぶくろ")+"も"+R("一枚","いちまい")+"いただけますか。", en:"Yes please. Could I also have a paper bag?"},
    {who:"Staff", jp:"どうぞ。"+R("消費期限","しょうひきげん")+"は"+R("箱","はこ")+"の"+R("下","した")+"に"+R("書","か")+"いてあります。", en:"Here you are. The expiry date is written on the bottom of the box."}
  ],
  keyPhrases:[
    {jp:"お土産を探しているんですが", en:"I'm looking for souvenirs..."},
    {jp:"日持ちしますか", en:"Does it keep well?"},
    {jp:"別々の袋に入れてもらえますか", en:"Could you bag them separately?"},
    {jp:"プレゼント用にお包みしますか", en:"Shall I gift-wrap it? (staff line)"}
  ],
  roleplay:"Ask for three different quantities and wrappings in one go, then ask 一番人気なのはどれですか (which is the most popular?).",
  quiz:[
    {q:"「書いてあります」tells you the date is:", choices:["about to be written","written and still there (a state someone created)","being written now","not written"], a:1, ex:"〜てある describes a state resulting from someone's deliberate action — the writing is there because somebody wrote it. Compare 書いています (is writing)."},
    {q:"壊れにくい means:", choices:["breaks easily","unlikely to break","already broken","easy to fix"], a:1, ex:"にくい = hard/unlikely to. 壊れやすい would be the opposite: fragile."}
  ]
},
/* === 24 === */
{
  jp:R("温泉","おんせん")+"で", en:"At an onsen",
  setup:"The etiquette questions every first-timer needs, asked politely at reception.",
  lines:[
    {who:"You", jp:"すみません、"+R("初","はじ")+"めてなんですが、タオルは"+R("借","か")+"りられますか。", en:"Excuse me, it's my first time — can I rent a towel?"},
    {who:"Staff", jp:"はい、"+R("三百円","さんびゃくえん")+"で"+R("貸","か")+"し"+R("出","だ")+"ししています。", en:"Yes, we rent them for 300 yen."},
    {who:"You", jp:R("入","はい")+"る"+R("前","まえ")+"に、"+R("体","からだ")+"を"+R("洗","あら")+"わなければなりませんか。", en:"Do I have to wash my body before getting in?"},
    {who:"Staff", jp:"はい、まず"+R("体","からだ")+"を"+R("洗","あら")+"ってから、お"+R("湯","ゆ")+"に"+R("入","はい")+"ってください。", en:"Yes — please wash first, then enter the bath."},
    {who:"You", jp:"タオルはお"+R("湯","ゆ")+"の"+R("中","なか")+"に"+R("入","い")+"れてもいいですか。", en:"Is it okay to put the towel in the water?"},
    {who:"Staff", jp:"いえ、"+R("入","い")+"れてはいけません。"+R("頭","あたま")+"の"+R("上","うえ")+"か、"+R("外","そと")+"に"+R("置","お")+"いてください。", en:"No, that's not allowed. Please put it on your head or leave it outside."},
    {who:"You", jp:"わかりました。"+R("入","い")+"れ"+R("墨","ずみ")+"があるんですが、"+R("大丈夫","だいじょうぶ")+"ですか。", en:"Understood. I have a tattoo — is that okay?"},
    {who:"Staff", jp:R("小","ちい")+"さければ、シールで"+R("隠","かく")+"せば"+R("大丈夫","だいじょうぶ")+"です。"+R("受付","うけつけ")+"でお"+R("渡","わた")+"しします。", en:"If it's small, covering it with a patch is fine. We'll give you one at reception."}
  ],
  keyPhrases:[
    {jp:"初めてなんですが", en:"It's my first time..."},
    {jp:"〜なければなりませんか", en:"Do I have to ~?"},
    {jp:"〜てもいいですか", en:"Is it okay to ~?"},
    {jp:"〜てはいけません", en:"You must not ~ (what you'll hear)"}
  ],
  roleplay:"This scenario is a permission-and-prohibition drill in disguise. Ask five more questions using 〜てもいいですか and answer them yourself with either はい、どうぞ or いえ、〜てはいけません。",
  quiz:[
    {q:"「体を洗ってから、お湯に入ってください」makes the order clear because 〜てから means:", choices:["while doing","after doing (and only then)","before doing","instead of doing"], a:1, ex:"〜てから emphasises sequence: wash first, and only after that get in. Useful anywhere order matters."},
    {q:"「小さければ」is the conditional form of:", choices:["小さい (i-adjective)","小さな (na-adjective)","小さくない","小さくて"], a:0, ex:"い-adjectives form 〜ば by dropping い and adding ければ: 小さい → 小さければ."}
  ]
},
/* === 25 === */
{
  jp:R("美容院","びよういん")+"で", en:"At the hair salon",
  setup:"A high-stakes conversation where being vague costs you — practise the numbers.",
  lines:[
    {who:"Stylist", jp:"今日はどうなさいますか。", en:"What would you like done today?"},
    {who:"You", jp:R("短","みじか")+"くしてください。でも、"+R("短","みじか")+"くしすぎないでください。", en:"I'd like it shorter, please. But not too short."},
    {who:"Stylist", jp:"どのくらい"+R("切","き")+"りましょうか。", en:"How much shall I take off?"},
    {who:"You", jp:"三センチぐらいお願いします。"+R("横","よこ")+"はそのままで"+R("大丈夫","だいじょうぶ")+"です。", en:"About three centimetres, please. The sides can stay as they are."},
    {who:"Stylist", jp:R("前髪","まえがみ")+"はどうしますか。", en:"What about the fringe?"},
    {who:"You", jp:R("目","め")+"にかからないぐらいに"+R("切","き")+"ってもらえますか。", en:"Could you cut it so it doesn't reach my eyes?"},
    {who:"Stylist", jp:"わかりました。シャンプーもいたしますね。…こんな"+R("感","かん")+"じでいかがですか。", en:"Understood. I'll shampoo it as well. ...How does this look?"},
    {who:"You", jp:"いいですね、ありがとうございます。"+R("気","き")+"に"+R("入","い")+"りました。", en:"It looks great, thank you. I really like it."}
  ],
  keyPhrases:[
    {jp:"短くしてください", en:"Please make it shorter"},
    {jp:"三センチぐらいお願いします", en:"About three centimetres, please"},
    {jp:"そのままで大丈夫です", en:"Leave it as it is"},
    {jp:"気に入りました", en:"I like it"}
  ],
  roleplay:"Add one request you'd actually make — 色を変えたいです (I want to change the colour), パーマをかけたいです (I want a perm) — and always finish with a number or a comparison.",
  quiz:[
    {q:"短くしすぎないでください is asking them not to:", choices:["cut it at all","overdo the cutting","cut it slowly","wash it"], a:1, ex:"〜すぎる = to do too much; 〜ないでください = please don't. Together: 'please don't make it too short.'"},
    {q:"「目にかからないぐらいに」uses ぐらい to express:", choices:["approximately that amount/extent","a location","a reason","a comparison of two things"], a:0, ex:"〜ぐらいに sets the degree: 'to roughly the extent that it doesn't reach my eyes'. Handy whenever you need to describe 'about this much'."}
  ]
},
/* === 26 === */
{
  jp:"ポケットWi‑Fiを"+R("借","か")+"りる", en:"Renting pocket wifi / a SIM",
  setup:"A counter transaction with numbers, dates and a return process — high value, low risk.",
  lines:[
    {who:"You", jp:"すみません、ポケットWi‑Fiを"+R("借","か")+"りたいんですが。", en:"Excuse me, I'd like to rent a pocket wifi."},
    {who:"Staff", jp:R("何日間","なんにちかん")+"ご"+R("利用","りよう")+"ですか。", en:"How many days will you be using it?"},
    {who:"You", jp:"十"+R("日間","にちかん")+"です。"+R("一日","いちにち")+"いくらですか。", en:"Ten days. How much per day?"},
    {who:"Staff", jp:R("一日","いちにち")+R("五百円","ごひゃくえん")+"です。データは"+R("無制限","むせいげん")+"です。", en:"500 yen a day. The data is unlimited."},
    {who:"You", jp:R("返","かえ")+"すときは、どうすればいいですか。", en:"What should I do when I return it?"},
    {who:"Staff", jp:R("空港","くうこう")+"の"+R("郵便","ゆうびん")+"ポストに"+R("入","い")+"れていただければ"+R("結構","けっこう")+"です。", en:"Just dropping it in the postbox at the airport is fine."},
    {who:"You", jp:"わかりました。もし"+R("壊","こわ")+"れたら、どうなりますか。", en:"Understood. What happens if it breaks?"},
    {who:"Staff", jp:R("保険","ほけん")+"に"+R("入","はい")+"っていれば、お"+R("金","かね")+"はかかりません。", en:"If you've taken the insurance, there's no charge."},
    {who:"You", jp:"じゃあ、"+R("保険","ほけん")+"もお願いします。", en:"I'll take the insurance too, then."}
  ],
  keyPhrases:[
    {jp:"〜を借りたいんですが", en:"I'd like to rent ~"},
    {jp:"一日いくらですか", en:"How much per day?"},
    {jp:"返すときは、どうすればいいですか", en:"What do I do when returning it?"},
    {jp:"もし壊れたら、どうなりますか", en:"What happens if it breaks?"}
  ],
  roleplay:"Change the item to a bicycle, a suitcase locker, or a rental car and keep the same four questions — they transfer to any rental counter.",
  quiz:[
    {q:"「保険に入っていれば」means:", choices:["because you have insurance","if you have insurance","even though you have insurance","after you get insurance"], a:1, ex:"〜ていれば is the conditional of the 〜ている state: 'if you are in a state of having entered insurance', i.e. if you're covered."},
    {q:"「入れていただければ結構です」is the staff saying:", choices:["you must not put it in","it's enough if you just put it in","they will put it in","putting it in is forbidden"], a:1, ex:"〜ていただければ結構です is polite service language: 'if you would kindly do ~, that's all that's needed.' Recognising it saves you a lot of confusion at counters."}
  ]
},
/* === 27 === */
{
  jp:R("天気","てんき")+"・"+R("季節","きせつ")+"の"+R("話","はなし"), en:"Weather & season small talk",
  setup:"The safest conversation opener in Japan. Learn it well enough to run on autopilot.",
  lines:[
    {who:"A", jp:"今日は"+R("寒","さむ")+"いですね。", en:"It's cold today, isn't it."},
    {who:"B", jp:"そうですね。"+R("急","きゅう")+"に"+R("寒","さむ")+"くなりましたね。", en:"It really is. It got cold all of a sudden."},
    {who:"A", jp:R("天気予報","てんきよほう")+"によると、"+R("明日","あした")+"は"+R("雪","ゆき")+"が"+R("降","ふ")+"るそうですよ。", en:"According to the forecast, it's supposed to snow tomorrow."},
    {who:"B", jp:"えっ、"+R("本当","ほんとう")+"ですか。"+R("電車","でんしゃ")+"が"+R("止","と")+"まるかもしれませんね。", en:"Really? The trains might stop, then."},
    {who:"A", jp:R("困","こま")+"りますね。"+R("Bさん","ビーさん")+"はどの"+R("季節","きせつ")+"が"+R("一番","いちばん")+R("好","す")+"きですか。", en:"That'd be a nuisance. Which season do you like best?"},
    {who:"B", jp:R("秋","あき")+"が"+R("一番","いちばん")+R("好","す")+"きです。"+R("涼","すず")+"しいし、"+R("紅葉","こうよう")+"もきれいだし。", en:"Autumn is my favourite. It's cool, and the autumn leaves are beautiful."},
    {who:"A", jp:"わかります。"+R("私","わたし")+"は"+R("夏","なつ")+"のほうが"+R("好","す")+"きですが、"+R("暑","あつ")+"すぎるのはちょっと…", en:"I know what you mean. I prefer summer, though when it's too hot it's a bit much..."},
    {who:"B", jp:"ですよね。"+R("今年","ことし")+"の"+R("夏","なつ")+"は"+R("特","とく")+"に"+R("暑","あつ")+"かったですね。", en:"Right? This summer was especially hot."}
  ],
  keyPhrases:[
    {jp:"今日は寒いですね", en:"It's cold today, isn't it"},
    {jp:"急に〜くなりましたね", en:"It suddenly became ~"},
    {jp:"天気予報によると〜そうです", en:"According to the forecast, ~"},
    {jp:"〜し、〜し", en:"It's ~, and also ~ (stacking reasons)"}
  ],
  roleplay:"Open three conversations with a weather line and steer each one to a different topic within two turns — food, travel, work. That pivot is what small talk actually is.",
  quiz:[
    {q:"「雪が降るそうですよ」after 天気予報によると is:", choices:["appearance (looks like snow)","hearsay (I hear it will snow)","intention","obligation"], a:1, ex:"〜によると is the giveaway: it explicitly marks a source, so そうです is the hearsay そう, not the appearance そう."},
    {q:"「涼しいし、紅葉もきれいだし」uses 〜し to:", choices:["contrast two things","stack up reasons casually","express regret","give a command"], a:1, ex:"〜し lists reasons in a relaxed, spoken way, often trailing off — exactly the register you want in small talk."}
  ]
},
/* === 28 === */
{
  jp:R("趣味","しゅみ")+"の"+R("話","はなし"), en:"Talking about hobbies",
  setup:"Getting past 趣味は何ですか into an actual conversation — and an invitation.",
  lines:[
    {who:"A", jp:R("休","やす")+"みの"+R("日","ひ")+"は"+R("何","なに")+"をしていますか。", en:"What do you do on your days off?"},
    {who:"B", jp:R("映画","えいが")+"を"+R("見","み")+"たり、"+R("料理","りょうり")+"を"+R("作","つく")+"ったりしています。", en:"I do things like watch movies and cook."},
    {who:"A", jp:"へえ、"+R("料理","りょうり")+"ができるんですね。どんな"+R("料理","りょうり")+"を"+R("作","つく")+"るんですか。", en:"Oh, you can cook. What kind of food do you make?"},
    {who:"B", jp:R("最近","さいきん")+"、"+R("日本料理","にほんりょうり")+"を"+R("習","なら")+"っています。まだ"+R("下手","へた")+"なんですが、"+R("楽","たの")+"しいです。", en:"Lately I've been learning Japanese food. I'm still bad at it, but it's fun."},
    {who:"A", jp:"すごいですね。"+R("何","なに")+"が"+R("一番","いちばん")+R("上手","じょうず")+"にできますか。", en:"That's impressive. What can you make best?"},
    {who:"B", jp:R("肉","にく")+"じゃがです。"+R("簡単","かんたん")+"だし、"+R("失敗","しっぱい")+"しにくいので。", en:"Nikujaga. It's simple, and hard to get wrong."},
    {who:"A", jp:R("私","わたし")+"も"+R("習","なら")+"ってみたいです。"+R("今度","こんど")+"、"+R("教","おし")+"えてくれませんか。", en:"I'd like to try learning too. Could you teach me sometime?"},
    {who:"B", jp:"もちろんです！じゃあ、"+R("材料","ざいりょう")+"を"+R("買","か")+"いに行きましょう。", en:"Of course! Let's go buy the ingredients, then."}
  ],
  keyPhrases:[
    {jp:"休みの日は何をしていますか", en:"What do you do on your days off?"},
    {jp:"〜たり〜たりしています", en:"I do things like ~ and ~"},
    {jp:"まだ下手なんですが、楽しいです", en:"I'm still bad at it, but it's fun"},
    {jp:"今度、教えてくれませんか", en:"Could you teach me sometime?"}
  ],
  roleplay:"Answer 休みの日は何をしていますか three different ways using 〜たり〜たり, then end each answer with a question back. Never let the ball stop on your side.",
  quiz:[
    {q:"〜たり〜たりしています is used to:", choices:["list representative activities, not an exhaustive list","describe one action in progress","report hearsay","give two alternatives to choose from"], a:0, ex:"〜たり〜たり gives examples of the sort of thing you do — it implies 'among other things', which is exactly right for hobbies."},
    {q:"「教えてくれませんか」asks the other person to:", choices:["be taught by you","teach you, as a favour to you","teach someone else","stop teaching"], a:1, ex:"くれる marks the action as coming toward you for your benefit. 教えてあげませんか would offer to teach them instead."}
  ]
},
/* === 29 === */
{
  jp:R("家族","かぞく")+"と"+R("出身","しゅっしん")+"の"+R("話","はなし"), en:"Family & where you're from",
  setup:"The questions you will be asked in every first conversation in Japan. Have the answers ready.",
  lines:[
    {who:"A", jp:"ご"+R("出身","しゅっしん")+"はどちらですか。", en:"Where are you from?"},
    {who:"B", jp:"フィリピンのマニラです。"+R("大","おお")+"きくて、にぎやかな"+R("町","まち")+"です。", en:"Manila, in the Philippines. It's a big, lively city."},
    {who:"A", jp:R("日本","にほん")+"とどこが"+R("一番","いちばん")+R("違","ちが")+"いますか。", en:"What's the biggest difference from Japan?"},
    {who:"B", jp:R("電車","でんしゃ")+"ですね。"+R("日本","にほん")+"の"+R("電車","でんしゃ")+"は"+R("時間","じかん")+"に"+R("正確","せいかく")+"で、びっくりしました。", en:"The trains. Japanese trains are so punctual — it surprised me."},
    {who:"A", jp:"ああ、よく"+R("言","い")+"われます。ご"+R("家族","かぞく")+"は"+R("何人","なんにん")+"ですか。", en:"Ah, people often say that. How many are in your family?"},
    {who:"B", jp:"五人"+R("家族","かぞく")+"です。"+R("両親","りょうしん")+"と"+R("姉","あね")+"が二人います。", en:"Five. My parents and two older sisters."},
    {who:"A", jp:"にぎやかでしょうね。ご"+R("家族","かぞく")+"は"+R("日本","にほん")+"に"+R("来","き")+"たことがありますか。", en:"That must be lively. Has your family ever been to Japan?"},
    {who:"B", jp:"まだないんです。でも、"+R("来年","らいねん")+R("呼","よ")+"びたいと"+R("思","おも")+"っています。", en:"Not yet. But I'm hoping to invite them next year."}
  ],
  keyPhrases:[
    {jp:"ご出身はどちらですか", en:"Where are you from?"},
    {jp:"〜人家族です", en:"There are ~ of us in my family"},
    {jp:"びっくりしました", en:"It surprised me"},
    {jp:"〜たいと思っています", en:"I'm hoping to ~ (softer than 〜たいです)"}
  ],
  roleplay:"Write and memorise a four-sentence self-introduction: name, where you're from, family, and one thing you like about Japan. Say it until it needs no thinking.",
  quiz:[
    {q:"Why is 呼びたいと思っています softer than 呼びたいです?", choices:["It's past tense","と思っています frames it as a current thought rather than a flat demand","It's hearsay","It's more formal grammar only"], a:1, ex:"Wrapping a desire in と思っています presents it as something you're considering — Japanese speakers routinely soften wants this way."},
    {q:"「よく言われます」is:", choices:["passive — 'I'm often told that'","causative — 'I make people say that'","potential — 'I can say that'","volitional"], a:0, ex:"言われる is the passive of 言う. 'People often say that to me' — a very natural reaction line."}
  ]
},
/* === 30 === */
{
  jp:R("職場","しょくば")+"で"+R("頼","たの")+"む", en:"Asking a coworker for help",
  setup:"Work Japanese is mostly softening. Notice how much padding goes in front of the actual request.",
  lines:[
    {who:"You", jp:"すみません、"+R("今","いま")+"ちょっといいですか。", en:"Excuse me, do you have a moment?"},
    {who:"Coworker", jp:"はい、どうしましたか。", en:"Sure, what's up?"},
    {who:"You", jp:"この"+R("書類","しょるい")+"の"+R("書","か")+"き"+R("方","かた")+"が わからないんですが、"+R("教","おし")+"えていただけませんか。", en:"I don't know how to fill in this document — could you show me?"},
    {who:"Coworker", jp:"いいですよ。ここに"+R("名前","なまえ")+"と"+R("日付","ひづけ")+"を"+R("書","か")+"いてください。", en:"Sure. Write your name and the date here."},
    {who:"You", jp:"ここですね。ありがとうございます。それから、これはいつまでに"+R("出","だ")+"せばいいですか。", en:"Here, right? Thank you. Also, by when should I submit it?"},
    {who:"Coworker", jp:R("金曜日","きんようび")+"までにお願いします。"+R("急","いそ")+"がなくても"+R("大丈夫","だいじょうぶ")+"ですよ。", en:"By Friday, please. There's no need to rush."},
    {who:"You", jp:R("助","たす")+"かりました。お"+R("忙","いそが")+"しいところ、すみませんでした。", en:"That was a big help. Sorry to bother you while you're busy."},
    {who:"Coworker", jp:"いえいえ、"+R("何","なに")+"かあったら、また"+R("聞","き")+"いてください。", en:"Not at all — if anything comes up, just ask again."}
  ],
  keyPhrases:[
    {jp:"今ちょっといいですか", en:"Do you have a moment?"},
    {jp:"〜ていただけませんか", en:"Could you kindly ~?"},
    {jp:"いつまでに出せばいいですか", en:"By when should I submit it?"},
    {jp:"お忙しいところ、すみません", en:"Sorry to bother you while you're busy"}
  ],
  roleplay:"Make the same request three times at three politeness levels: 教えて／教えてくれる？／教えていただけませんか。Notice which one fits which listener.",
  quiz:[
    {q:"「金曜日までに」means:", choices:["until Friday (continuously)","by Friday (deadline)","from Friday","on Friday only"], a:1, ex:"までに marks a deadline; まで marks a continuous endpoint. 金曜日まで待ちます = I'll wait until Friday; 金曜日までに出します = I'll submit it by Friday."},
    {q:"急がなくても大丈夫です tells you rushing is:", choices:["required","not necessary","forbidden","already done"], a:1, ex:"〜なくてもいい／大丈夫 = you don't have to. Don't confuse it with 急いではいけません, which would forbid hurrying."}
  ]
},
/* === 31 === */
{
  jp:"アルバイトの"+R("面接","めんせつ"), en:"A part-time job interview",
  setup:"A short, predictable interview. The answers are mostly fixed — learn them as blocks.",
  lines:[
    {who:"Manager", jp:"では、"+R("自己紹介","じこしょうかい")+"をお願いします。", en:"Alright, please introduce yourself."},
    {who:"You", jp:"はじめまして、ダレンと"+R("申","もう")+"します。フィリピンから"+R("来","き")+"ました。よろしくお願いします。", en:"Nice to meet you, my name is Darren. I came from the Philippines. Pleased to meet you."},
    {who:"Manager", jp:R("日本語","にほんご")+"はどのくらい"+R("勉強","べんきょう")+"していますか。", en:"How long have you been studying Japanese?"},
    {who:"You", jp:"二"+R("年","ねん")+"ぐらいです。"+R("会話","かいわ")+"はまだ"+R("練習中","れんしゅうちゅう")+"ですが、"+R("頑張","がんば")+"ります。", en:"About two years. My conversation is still a work in progress, but I'll do my best."},
    {who:"Manager", jp:R("週","しゅう")+"に"+R("何日","なんにち")+R("働","はたら")+"けますか。", en:"How many days a week can you work?"},
    {who:"You", jp:R("週","しゅう")+"に三日、"+R("夕方","ゆうがた")+"から"+R("働","はたら")+"けます。"+R("土日","どにち")+"も"+R("大丈夫","だいじょうぶ")+"です。", en:"Three days a week, from the evening. Weekends are fine too."},
    {who:"Manager", jp:R("経験","けいけん")+"はありますか。", en:"Do you have any experience?"},
    {who:"You", jp:"レストランで"+R("働","はたら")+"いたことがあります。"+R("覚","おぼ")+"えるのは"+R("早","はや")+"いと"+R("思","おも")+"います。", en:"I've worked at a restaurant before. I think I learn quickly."},
    {who:"Manager", jp:"わかりました。"+R("来週","らいしゅう")+"、ご"+R("連絡","れんらく")+"します。", en:"Understood. We'll contact you next week."}
  ],
  keyPhrases:[
    {jp:"〜と申します", en:"My name is ~ (humble)"},
    {jp:"週に三日働けます", en:"I can work three days a week"},
    {jp:"〜たことがあります", en:"I have ~ before (experience)"},
    {jp:"頑張ります", en:"I'll do my best"}
  ],
  roleplay:"Rehearse the four fixed answers — name, how long you've studied, availability, experience — until each comes out in one breath.",
  quiz:[
    {q:"申します is:", choices:["the passive of 言う","the humble form of 言う, used about yourself","honorific, used about others","the potential form"], a:1, ex:"申す is 謙譲語 (humble) — you lower yourself. 〜とおっしゃいます would be the honorific you'd use about the other person."},
    {q:"働けます is which form of 働く?", choices:["passive","potential (can work)","causative","past"], a:1, ex:"働く → 働ける (potential). Saying 働けます answers the ability question directly, which is what the interviewer asked."}
  ]
},
/* === 32 === */
{
  jp:"ホストファミリーと", en:"With a host family",
  setup:"House rules, meals and the small polite noises that make living with a family work.",
  lines:[
    {who:"Host", jp:"どうぞ、"+R("入","はい")+"ってください。"+R("疲","つか")+"れましたか。", en:"Please come in. Are you tired?"},
    {who:"You", jp:"お"+R("邪魔","じゃま")+"します。"+R("少","すこ")+"し"+R("疲","つか")+"れましたが、"+R("大丈夫","だいじょうぶ")+"です。", en:"Thank you for having me. A little tired, but I'm fine."},
    {who:"Host", jp:"ご"+R("飯","はん")+"は七時ごろです。"+R("苦手","にがて")+"な"+R("物","もの")+"はありますか。", en:"Dinner is around seven. Is there anything you don't eat?"},
    {who:"You", jp:R("何","なん")+"でも"+R("食","た")+"べられます。でも、"+R("辛","から")+"いのはあまり"+R("得意","とくい")+"じゃないんです。", en:"I can eat anything. Though I'm not great with spicy food."},
    {who:"Host", jp:"わかりました。あ、お"+R("風呂","ふろ")+"は"+R("何時","なんじ")+"でもいいですが、十一時までにお願いします。", en:"Got it. Oh, the bath is fine any time, but please use it before eleven."},
    {who:"You", jp:"はい。"+R("洗濯","せんたく")+"は"+R("自分","じぶん")+"でしてもいいですか。", en:"Okay. Is it alright if I do my own laundry?"},
    {who:"Host", jp:"もちろん。"+R("機械","きかい")+"の"+R("使","つか")+"い"+R("方","かた")+"はあとで"+R("教","おし")+"えますね。", en:"Of course. I'll show you how to use the machine later."},
    {who:"You", jp:"ありがとうございます。…いただきます！これ、"+R("本当","ほんとう")+"においしいです。", en:"Thank you. ...Let's eat! This is really delicious."},
    {who:"Host", jp:"よかった。おかわりもありますよ。", en:"I'm glad. There are seconds, too."}
  ],
  keyPhrases:[
    {jp:"お邪魔します", en:"Sorry to intrude (entering a home)"},
    {jp:"苦手な物はありますか", en:"Is there anything you don't like? (host line)"},
    {jp:"〜てもいいですか", en:"Is it okay if I ~?"},
    {jp:"いただきます／ごちそうさまでした", en:"Before / after eating"}
  ],
  roleplay:"Practise the daily set: おはようございます、いってきます、ただいま、おやすみなさい, plus one question about a house rule each time.",
  quiz:[
    {q:"「十一時までにお願いします」sets:", choices:["a starting time","a deadline — before eleven","a duration","an appointment"], a:1, ex:"までに again — the deadline particle. Any bath before eleven is fine; eleven is the cut-off."},
    {q:"食べられます in 「何でも食べられます」is:", choices:["passive — 'I get eaten'","potential — 'I can eat'","causative","honorific"], a:1, ex:"For ru-verbs, potential and passive look identical (食べられる), and context decides. 何でも ('anything at all') makes the ability reading the only sensible one."}
  ]
},
/* === 33 === */
{
  jp:R("誘","さそ")+"いをことわる", en:"Declining an invitation gracefully",
  setup:"The hardest social skill at N4: saying no without sounding cold. Notice the four-part shape.",
  lines:[
    {who:"A", jp:R("今晩","こんばん")+"、みんなで"+R("飲","の")+"みに行くんですが、"+R("一緒","いっしょ")+"にどうですか。", en:"We're all going out for drinks tonight — how about joining us?"},
    {who:"You", jp:"あ、"+R("誘","さそ")+"ってくれてありがとうございます。"+R("行","い")+"きたいんですが…", en:"Ah, thank you for inviting me. I'd love to go, but..."},
    {who:"A", jp:"あ、"+R("都合","つごう")+"が"+R("悪","わる")+"いですか。", en:"Oh, is it a bad time?"},
    {who:"You", jp:R("明日","あした")+"の"+R("朝","あさ")+"、"+R("早","はや")+"く"+R("出","で")+"なければならないので、"+R("今日","きょう")+"はちょっと…", en:"I have to leave early tomorrow morning, so today is a bit difficult..."},
    {who:"A", jp:"そうですか、"+R("残念","ざんねん")+"です。じゃあ、また"+R("今度","こんど")+"ぜひ。", en:"I see, that's a shame. Next time for sure, then."},
    {who:"You", jp:"はい、ぜひ"+R("誘","さそ")+"ってください。"+R("来週","らいしゅう")+"なら"+R("大丈夫","だいじょうぶ")+"です。", en:"Yes, please do invite me again. Next week I'd be fine."},
    {who:"A", jp:"じゃあ、"+R("来週","らいしゅう")+R("計画","けいかく")+"しますね。", en:"I'll plan something for next week, then."},
    {who:"You", jp:R("楽","たの")+"しみにしています。"+R("皆","みな")+"さんによろしくお"+R("伝","つた")+"えください。", en:"I'm looking forward to it. Please say hello to everyone for me."}
  ],
  keyPhrases:[
    {jp:"誘ってくれてありがとうございます", en:"Thanks for inviting me"},
    {jp:"行きたいんですが…", en:"I'd like to go, but..."},
    {jp:"〜ので、今日はちょっと…", en:"Because ~, today is a bit difficult..."},
    {jp:"また今度ぜひ／来週なら大丈夫です", en:"Next time for sure / next week would be fine"}
  ],
  roleplay:"Memorise the four-part shape — thank, show willingness, give a light reason, offer an alternative — then run it for three different invitations. It works in every language, but in Japanese the reason stays deliberately vague.",
  quiz:[
    {q:"「来週なら大丈夫です」uses なら because the speaker is:", choices:["stating a general rule","reacting to the topic just raised and offering a condition","reporting hearsay","expressing obligation"], a:1, ex:"なら picks up the topic in play (going out) and sets a condition on it — 'if it's next week we're talking about, then I'm fine.' That's exactly what なら is for."},
    {q:"Why does the speaker leave 「今日はちょっと…」unfinished?", choices:["They forgot the word","Trailing off is the polite convention — the listener completes it","It's grammatically required","It means 'yes'"], a:1, ex:"Leaving the refusal unsaid is the politeness. Finishing the sentence with a blunt 行けません would be noticeably harder-edged."}
  ]
},
/* === 34 === */
{
  jp:"お"+R("祝","いわ")+"い・プレゼント", en:"Congratulations & giving a gift",
  setup:"Gift-giving has fixed phrases on both sides. Learn the giver's line and the receiver's line.",
  lines:[
    {who:"You", jp:R("合格","ごうかく")+"、おめでとうございます！", en:"Congratulations on passing!"},
    {who:"Friend", jp:"ありがとう！"+R("実","じつ")+"は、まだ"+R("信","しん")+"じられないんです。", en:"Thank you! Honestly, I still can't believe it."},
    {who:"You", jp:R("頑張","がんば")+"っていましたからね。これ、つまらない"+R("物","もの")+"ですが、どうぞ。", en:"You worked so hard for it. Here — it's nothing much, but please take it."},
    {who:"Friend", jp:"えっ、いいんですか。"+R("開","あ")+"けてもいいですか。", en:"Oh, really? May I open it?"},
    {who:"You", jp:"もちろん。"+R("気","き")+"に"+R("入","い")+"ってもらえるとうれしいです。", en:"Of course. I'd be happy if you like it."},
    {who:"Friend", jp:"わあ、"+R("前","まえ")+"から"+R("欲","ほ")+"しかったんです！"+R("本当","ほんとう")+"にありがとう。", en:"Wow, I've wanted this for ages! Thank you so much."},
    {who:"You", jp:"よかった。これからも"+R("応援","おうえん")+"しています。", en:"I'm glad. I'll keep cheering you on."},
    {who:"Friend", jp:"ありがとう。"+R("今度","こんど")+"、お"+R("礼","れい")+"にごはんをごちそうしますね。", en:"Thanks. I'll treat you to a meal to say thank you sometime."}
  ],
  keyPhrases:[
    {jp:"おめでとうございます", en:"Congratulations"},
    {jp:"つまらない物ですが、どうぞ", en:"It's nothing much, but please take it"},
    {jp:"気に入ってもらえるとうれしいです", en:"I hope you like it"},
    {jp:"お礼に〜します", en:"I'll ~ to thank you"}
  ],
  roleplay:"Practise both sides: give a gift with the humble formula, then receive one with 開けてもいいですか and a reaction. Swap roles.",
  quiz:[
    {q:"「つまらない物ですが」literally says the gift is boring. It actually functions as:", choices:["an insult","a set humble formula when giving","a complaint about the price","a question"], a:1, ex:"Downplaying your own gift is the polite convention. Taking it literally is the classic learner mistake — the giver doesn't think it's boring at all."},
    {q:"「気に入ってもらえるとうれしいです」combines:", choices:["potential + conditional と + feeling","passive + causative","hearsay + volitional","obligation + negative"], a:0, ex:"もらえる (potential of もらう) + と (if/when) + うれしい: 'if I can receive your liking it, I'm happy.' A very natural way to hand something over."}
  ]
}
];

N4.kaiwaTips      = kaiwaTips;
N4.phraseBank     = phraseBank;
N4.kaiwaScenarios = kaiwaScenarios;
})();
