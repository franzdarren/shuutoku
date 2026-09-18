export default function RenshuuAI() {
  return (
    <>
      <div className="section-head section-head--bare">
        <h1>Renshuu with AI</h1>
        <p>A planned feature: a free-form conversation practice partner — you type (or eventually speak) in Japanese, it replies in character for a scenario, and corrects you gently along the way.</p>
      </div>

      <div className="soon-panel">
        <div className="soon-flag">Not built yet — this is the plan, not a demo</div>

        {/* A framed conversation surface — not a re-drawn app window. There's
            deliberately no mock input box or Send button: nothing is wired up,
            and a dead control that looks live is the exact thing that made the
            first version of this section read as a fake screenshot. The footer
            marks where input will go instead of pretending it already does. */}
        <div className="renshuu-stage">
          <div className="chatbox">
            <div className="chatbox-head">
              <div className="chatbox-scene">
                <span className="chatbox-scene-jp">レストランで</span>
                <span className="chatbox-scene-en">at a restaurant</span>
              </div>
              <span className="chatbox-tag">sketch</span>
            </div>

            <div className="chatbox-body">
          <div className="dline side-a">
            <div className="speaker">友達AI</div>
            <div className="dtext">
              <div className="jp-row"><span className="jp"><ruby>店員<rt>てんいん</rt></ruby>：いらっしゃいませ。<ruby>何名様<rt>なんめいさま</rt></ruby>ですか。</span></div>
              <div className="en">Staff: Welcome. How many people?</div>
            </div>
          </div>
          <div className="dline side-b">
            <div className="speaker">わたし</div>
            <div className="dtext">
              <div className="jp-row"><span className="jp"><ruby>二人<rt>ふたり</rt></ruby>です。<ruby>禁煙席<rt>きんえんせき</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。</span></div>
              <div className="en">Two people. A non-smoking table, please.</div>
            </div>
          </div>

          {/* Correction rides alongside the turn it's about rather than
              waiting for a score at the end — the point is to notice the
              fix while the sentence is still in your head. */}
          <div className="dline side-b fb">
            <div className="speaker">なおし · correction</div>
            <div className="dtext">
              <div className="fb-row">
                <span className="fb-mark fb-was">was</span>
                <span className="jp"><ruby>禁煙席<rt>きんえんせき</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします</span>
              </div>
              <div className="fb-row">
                <span className="fb-mark fb-try">try</span>
                <span className="jp"><ruby>禁煙席<rt>きんえんせき</rt></ruby>はありますか</span>
              </div>
              <div className="en">Both are correct. But asking <i>is there one?</i> is what people actually say on the way in — お願いします assumes the answer is yes.</div>
            </div>
          </div>

          <div className="dline side-a">
            <div className="speaker">友達AI</div>
            <div className="dtext">
              <div className="jp-row"><span className="jp"><ruby>店員<rt>てんいん</rt></ruby>：かしこまりました。こちらへどうぞ。</span></div>
              <div className="en">Staff: Certainly. This way, please.</div>
              <span className="ai-note">Nudge — try asking for a menu next.</span>
            </div>
          </div>
            </div>

            <div className="chatbox-foot">
              <span className="chatbox-foot-jp">入力欄</span>
              <span className="chatbox-foot-en">where you'll type your reply, once this is built</span>
            </div>
          </div>
        </div>

        <ul className="soon-list">
          <li><span className="sl-label">Scope</span><span className="sl-body">Open-ended practice, separate from the scripted Kaiwa Lab scenarios — you pick a situation, it stays in character.</span></li>
          <li><span className="sl-label">Input</span><span className="sl-body">Typed Japanese first; speech input later, reusing the speech support already in the dialogues.</span></li>
          <li><span className="sl-label">Correction</span><span className="sl-body">Gentle and inline, in the flow of the conversation, rather than a grade at the end.</span></li>
          <li><span className="sl-label">Status</span><span className="sl-body">Nothing is wired up — no model, no input, no history.</span></li>
        </ul>

        <p className="soon-note">Once it ships, it will live right here.</p>
      </div>
    </>
  );
}
