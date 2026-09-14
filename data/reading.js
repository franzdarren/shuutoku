/* ============================================================
   DATA — READING LAB
   {title, titleEn, text, gloss, quiz[]}
   text uses \n for paragraph breaks (CSS white-space:pre-line)
   and inline <ruby> for furigana.
   ============================================================ */
(function(){
"use strict";

var readingPassages = [
{
  title:"日記 — 週末の旅行", titleEn:"Diary — a weekend trip",
  text:"土曜日に友達と一緒に<ruby>京都<rt>きょうと</rt></ruby>に旅行に行った。朝早く起きて、電車に乗った。<ruby>京都<rt>きょうと</rt></ruby>駅に<ruby>着<rt>つ</rt></ruby>いたら、すごく人が多かった。まず<ruby>清水寺<rt>きよみずでら</rt></ruby>に行くことにした。坂を歩いていたら、小さいお店がたくさんあって、お<ruby>土産<rt>みやげ</rt></ruby>を買った。\n\nお昼はうどんを食べた。とてもおいしかったので、また来たいと思う。午後は雨が降りそうだったので、早めにホテルに戻った。友達は「今度は<ruby>紅葉<rt>こうよう</rt></ruby>の<ruby>季節<rt>きせつ</rt></ruby>に行ってみたい」と言っていた。わたしも本当にそう思う。",
  gloss:"旅行 (りょこう) trip ・ 着く (つく) to arrive ・ 清水寺 (きよみずでら) Kiyomizu Temple ・ 坂 (さか) slope ・ お土産 (おみやげ) souvenir ・ 早めに (はやめに) ahead of time, early ・ 戻る (もどる) to return ・ 紅葉 (こうよう) autumn leaves ・ 季節 (きせつ) season",
  quiz:[
    {q:"なぜ早めにホテルに戻りましたか。", choices:["疲れたから","雨が降りそうだったから","お店が閉まるから","友達が呼んだから"], a:1, ex:"Text: 午後は雨が降りそうだったので、早めにホテルに戻った — 'since it looked like it would rain in the afternoon, we returned to the hotel early.'"},
    {q:"お昼に何を食べましたか。", choices:["すし","うどん","ラーメン","お好み焼き"], a:1, ex:"Text: お昼はうどんを食べた — 'we ate udon for lunch.'"},
    {q:"友達は次、いつ京都に行きたいと言っていましたか。", choices:["来年の夏","紅葉の季節","お正月","来週"], a:1, ex:"Text: 「今度は紅葉の季節に行ってみたい」— the friend wants to visit during the autumn-leaves season."}
  ]
},
{
  title:"お知らせ — エレベーター点検", titleEn:"Notice — elevator inspection",
  text:"エレベーター<ruby>点検<rt>てんけん</rt></ruby>のお知らせ\n\nいつも当マンションをご利用いただき、ありがとうございます。下記の<ruby>日程<rt>にってい</rt></ruby>でエレベーターの<ruby>点検<rt>てんけん</rt></ruby>を行うことになりました。<ruby>点検<rt>てんけん</rt></ruby>中はエレベーターが使えませんので、ご注意ください。\n\n日時：11月20日（金）午前9時〜午後3時\n場所：Aとうエレベーター\n\n<ruby>点検<rt>てんけん</rt></ruby>中、上の階にお住まいの方は<ruby>階段<rt>かいだん</rt></ruby>をご利用ください。ご<ruby>不便<rt>ふべん</rt></ruby>をおかけしますが、ご<ruby>協力<rt>きょうりょく</rt></ruby>をお願いいたします。ご質問がある方は、<ruby>管理事務所<rt>かんりじむしょ</rt></ruby>までご連絡ください。",
  gloss:"点検 (てんけん) inspection ・ 日程 (にってい) schedule ・ 階段 (かいだん) stairs ・ 不便 (ふべん) inconvenient ・ 協力 (きょうりょく) cooperation ・ 管理事務所 (かんりじむしょ) management office",
  quiz:[
    {q:"点検中、エレベーターはどうなりますか。", choices:["遅くなる","使えなくなる","安くなる","きれいになる"], a:1, ex:"Text: 点検中はエレベーターが使えません — during the inspection, the elevator can't be used."},
    {q:"上の階に住んでいる人は、点検中どうすればいいですか。", choices:["エレベーターを待つ","階段を使う","引っ越す","管理事務所に行く"], a:1, ex:"Text: 上の階にお住まいの方は階段をご利用ください — residents on upper floors should use the stairs."},
    {q:"質問がある人はどうすればいいですか。", choices:["メールを送る","管理事務所に連絡する","エレベーターの中で待つ","何もしなくていい"], a:1, ex:"Text: ご質問がある方は、管理事務所までご連絡ください — contact the management office with questions."}
  ]
},
{
  title:"メール — 週末の予定", titleEn:"Email — weekend plans",
  text:"ゆきちゃんへ\n\n元気？今週末、時間があったら、一緒に映画を見に行かない？新しい映画がとても面白いらしいよ。もしゆきちゃんが忙しいなら、来週でもいいよ。\n\nあ、それから、前に話していたラーメン屋、行ってみたい。友達が「あそこのラーメンはすごくおいしい」と言っていた。ゆきちゃんが好きなら、映画のあとで一緒に行こう。\n\n返事、待ってるね！\n\nみほ",
  gloss:"らしい apparently, I heard ・ なら if (reacting to a topic) ・ 前に (まえに) previously, before ・ 返事 (へんじ) reply",
  quiz:[
    {q:"新しい映画について、みほさんは何と言っていますか。", choices:["つまらないらしい","面白いらしい","もう終わったらしい","高いらしい"], a:1, ex:"Text: 新しい映画がとても面白いらしいよ — 'apparently the new movie is really interesting.'"},
    {q:"ゆきちゃんが今週忙しかったら、どうする予定ですか。", choices:["映画をあきらめる","来週行く","一人で行く","電話する"], a:1, ex:"Text: もしゆきちゃんが忙しいなら、来週でもいいよ — 'if you're busy, next week is fine too.'"},
    {q:"ラーメン屋について、みほさんはどう思っていますか。", choices:["あまり行きたくない","前から行ってみたい","もう行ったことがある","高そうだから行かない"], a:1, ex:"Text: 前に話していたラーメン屋、行ってみたい — she wants to try the ramen shop they'd talked about before."}
  ]
},
{
  title:"お知らせ — 店の休みと<ruby>割引<rt>わりびき</rt></ruby>", titleEn:"Notice — shop closure & discount",
  text:"お客様へ\n\nいつもご<ruby>利用<rt>りよう</rt></ruby>ありがとうございます。<ruby>店内<rt>てんない</rt></ruby>の<ruby>工事<rt>こうじ</rt></ruby>のため、下記の<ruby>期間<rt>きかん</rt></ruby>はお<ruby>休<rt>やす</rt></ruby>みさせていただきます。\n\n休み：12月3日（水）〜12月5日（金）\n\n12月6日（土）から、<ruby>新<rt>あたら</rt></ruby>しくなった店でまたお<ruby>待<rt>ま</rt></ruby>ちしております。なお、<ruby>再開<rt>さいかい</rt></ruby>の日から一<ruby>週間<rt>しゅうかん</rt></ruby>、すべての<ruby>商品<rt>しょうひん</rt></ruby>が10％<ruby>割引<rt>わりびき</rt></ruby>になります。カードをお<ruby>持<rt>も</rt></ruby>ちの方は、さらに5％お<ruby>安<rt>やす</rt></ruby>くなります。\n\nご<ruby>不便<rt>ふべん</rt></ruby>をおかけしますが、よろしくお<ruby>願<rt>ねが</rt></ruby>いいたします。",
  gloss:"工事 (こうじ) construction ・ 期間 (きかん) period ・ 再開 (さいかい) reopening ・ 商品 (しょうひん) goods ・ 割引 (わりびき) discount ・ なお moreover, in addition ・ さらに further, even more ・ 不便 (ふべん) inconvenience",
  quiz:[
    {q:"店はいつ休みますか。", choices:["12月3日から5日まで","12月5日だけ","12月6日から","一週間ずっと"], a:0, ex:"The notice lists 休み：12月3日（水）〜12月5日（金） — closed from the 3rd through the 5th."},
    {q:"12月8日に行ったら、商品はどうなりますか。", choices:["普通の値段","10％安い","15％安い","買えない"], a:1, ex:"The discount runs one week from 12/6, so the 8th is inside it: everything is 10% off. The extra 5% only applies to cardholders."},
    {q:"カードを持っている人は、全部で何％安くなりますか。", choices:["5％","10％","15％","割引なし"], a:2, ex:"10% for everyone, plus さらに5％ for cardholders — 15% in total. さらに ('further') is the key word."},
    {q:"なぜ店は休みますか。", choices:["店員が少ないから","店内の工事のため","お正月だから","商品がないから"], a:1, ex:"店内の工事のため — 'due to construction inside the shop'. 〜のため here marks a reason, not a purpose."}
  ]
},
{
  title:"メール — <ruby>旅行<rt>りょこう</rt></ruby>の<ruby>予定<rt>よてい</rt></ruby>", titleEn:"Email — trip itinerary",
  text:"ダレンさん\n\nこんにちは。<ruby>来月<rt>らいげつ</rt></ruby>の<ruby>旅行<rt>りょこう</rt></ruby>の<ruby>予定<rt>よてい</rt></ruby>を<ruby>送<rt>おく</rt></ruby>ります。\n\n1<ruby>日目<rt>にちめ</rt></ruby>：<ruby>空港<rt>くうこう</rt></ruby>に<ruby>着<rt>つ</rt></ruby>いたら、<ruby>電車<rt>でんしゃ</rt></ruby>でホテルまで<ruby>来<rt>き</rt></ruby>てください。<ruby>夕方<rt>ゆうがた</rt></ruby>、<ruby>駅<rt>えき</rt></ruby>の<ruby>前<rt>まえ</rt></ruby>で<ruby>会<rt>あ</rt></ruby>いましょう。\n2<ruby>日目<rt>にちめ</rt></ruby>：<ruby>朝<rt>あさ</rt></ruby>から<ruby>京都<rt>きょうと</rt></ruby>へ行きます。<ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>ったら、<ruby>美術館<rt>びじゅつかん</rt></ruby>に<ruby>変<rt>か</rt></ruby>えます。\n3<ruby>日目<rt>にちめ</rt></ruby>：<ruby>自由<rt>じゆう</rt></ruby><ruby>行動<rt>こうどう</rt></ruby>です。<ruby>買<rt>か</rt></ruby>い<ruby>物<rt>もの</rt></ruby>がしたいなら、<ruby>案内<rt>あんない</rt></ruby>しますよ。\n\n<ruby>歩<rt>ある</rt></ruby>く日が<ruby>多<rt>おお</rt></ruby>いので、<ruby>歩<rt>ある</rt></ruby>きやすい<ruby>靴<rt>くつ</rt></ruby>を<ruby>持<rt>も</rt></ruby>ってきたほうがいいです。それから、<ruby>寒<rt>さむ</rt></ruby>くなるそうなので、<ruby>上着<rt>うわぎ</rt></ruby>も<ruby>忘<rt>わす</rt></ruby>れないようにしてください。\n\n<ruby>楽<rt>たの</rt></ruby>しみにしています！\n\nゆか",
  gloss:"〜日目 (にちめ) the ~th day ・ 自由行動 (じゆうこうどう) free time, own schedule ・ 案内する (あんないする) to show around ・ 上着 (うわぎ) jacket ・ 〜たほうがいい had better ・ 〜ないようにする make sure not to",
  quiz:[
    {q:"1日目、空港からホテルまでどうやって行きますか。", choices:["バス","電車","タクシー","歩いて"], a:1, ex:"電車でホテルまで来てください — she asks him to come by train."},
    {q:"2日目に雨が降ったら、どうしますか。", choices:["京都へ行く","美術館へ行く","ホテルで休む","買い物をする"], a:1, ex:"雨が降ったら、美術館に変えます — the plan switches to the art museum if it rains."},
    {q:"ゆかさんは何を持ってきたほうがいいと言っていますか。", choices:["傘と地図","歩きやすい靴と上着","カメラ","お土産"], a:1, ex:"歩きやすい靴 plus 上着 — comfortable shoes because of all the walking, and a jacket because it's supposed to get cold."},
    {q:"3日目はどんな日ですか。", choices:["朝から京都へ行く日","自由に行動する日","空港に行く日","仕事の日"], a:1, ex:"3日目：自由行動です — it's a free day. 買い物がしたいなら案内します offers to show him around if he wants to shop."},
    {q:"「寒くなるそうなので」の「そう」は、どんな意味ですか。", choices:["ゆかさんが見て思った","だれかから聞いた情報","ゆかさんの命令","過去のこと"], a:1, ex:"Plain form + そう is hearsay — she heard/read that it's going to get cold, rather than judging it from what she can see."}
  ]
},
{
  title:"<ruby>日記<rt>にっき</rt></ruby> — <ruby>初<rt>はじ</rt></ruby>めての<ruby>面接<rt>めんせつ</rt></ruby>", titleEn:"Diary — a first interview",
  text:"<ruby>今日<rt>きょう</rt></ruby>はアルバイトの<ruby>面接<rt>めんせつ</rt></ruby>だった。<ruby>朝<rt>あさ</rt></ruby>から<ruby>緊張<rt>きんちょう</rt></ruby>していて、ご<ruby>飯<rt>はん</rt></ruby>があまり<ruby>食<rt>た</rt></ruby>べられなかった。<ruby>早<rt>はや</rt></ruby>く<ruby>家<rt>いえ</rt></ruby>を<ruby>出<rt>で</rt></ruby>たのに、<ruby>電車<rt>でんしゃ</rt></ruby>が<ruby>遅<rt>おく</rt></ruby>れて、ぎりぎり<ruby>間<rt>ま</rt></ruby>に<ruby>合<rt>あ</rt></ruby>った。\n\n<ruby>店長<rt>てんちょう</rt></ruby>は<ruby>優<rt>やさ</rt></ruby>しい<ruby>人<rt>ひと</rt></ruby>で、ゆっくり<ruby>話<rt>はな</rt></ruby>してくれた。<ruby>週<rt>しゅう</rt></ruby>に<ruby>何日<rt>なんにち</rt></ruby><ruby>働<rt>はたら</rt></ruby>けるか<ruby>聞<rt>き</rt></ruby>かれたので、三日と<ruby>答<rt>こた</rt></ruby>えた。<ruby>敬語<rt>けいご</rt></ruby>を<ruby>使<rt>つか</rt></ruby>うのは<ruby>難<rt>むずか</rt></ruby>しかったが、<ruby>言<rt>い</rt></ruby>いたいことは<ruby>全部<rt>ぜんぶ</rt></ruby><ruby>言<rt>い</rt></ruby>えたと<ruby>思<rt>おも</rt></ruby>う。\n\n<ruby>来週<rt>らいしゅう</rt></ruby><ruby>連絡<rt>れんらく</rt></ruby>をくれるそうだ。だめだったら<ruby>残念<rt>ざんねん</rt></ruby>だけど、<ruby>今日<rt>きょう</rt></ruby>は<ruby>練習<rt>れんしゅう</rt></ruby>になったから、それだけでもよかったと<ruby>思<rt>おも</rt></ruby>う。",
  gloss:"面接 (めんせつ) interview ・ 緊張する (きんちょうする) to be nervous ・ ぎりぎり just barely ・ 間に合う (まにあう) to make it in time ・ 店長 (てんちょう) shop manager ・ 敬語 (けいご) polite/honorific language ・ だめ no good ・ 残念 (ざんねん) a shame",
  quiz:[
    {q:"なぜ朝ご飯があまり食べられませんでしたか。", choices:["時間がなかったから","緊張していたから","おいしくなかったから","お金がなかったから"], a:1, ex:"朝から緊張していて、ご飯があまり食べられなかった — nerves, not time. Note 食べられなかった is the potential, 'couldn't eat'."},
    {q:"面接に遅れましたか。", choices:["遅れた","ぎりぎり間に合った","行かなかった","早く着いた"], a:1, ex:"早く家を出たのに、電車が遅れて、ぎりぎり間に合った — they only just made it. のに signals the unexpected contrast."},
    {q:"店長について、この人はどう思いましたか。", choices:["こわい人だ","優しい人だ","いそがしい人だ","若い人だ"], a:1, ex:"店長は優しい人で、ゆっくり話してくれた — kind, and spoke slowly for them (〜てくれた marks the favour)."},
    {q:"何が難しかったですか。", choices:["電車に乗ること","敬語を使うこと","店に行くこと","答えを聞くこと"], a:1, ex:"敬語を使うのは難しかった — using polite language was the hard part, though they still said everything they wanted to."},
    {q:"最後に、この人はどう考えていますか。", choices:["もう面接をしたくない","だめでも練習になったからよかった","絶対に合格すると思う","来週まで心配で眠れない"], a:1, ex:"だめだったら残念だけど、今日は練習になったから、それだけでもよかった — even if it doesn't work out, the practice was worth it."}
  ]
}
];

N4.readingPassages = readingPassages;
})();
