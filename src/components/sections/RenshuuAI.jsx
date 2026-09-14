export default function RenshuuAI() {
  return (
    <>
      <div className="section-head">
        <div className="eyebrow-jp">練習 with AI</div>
        <h1>Renshuu with AI</h1>
        <p>A planned feature: a free-form conversation practice partner — you type (or eventually speak) in Japanese, it replies in character for a scenario, and corrects you gently along the way. The mock-up below is just to show the shape of it; nothing here is wired up yet.</p>
      </div>

      <div className="soon-panel">
        <div className="soon-flag">🚧 COMING SOON — preview only, not functional yet</div>

        <div className="ai-mock">
          <div className="ai-mock-head">
            <span className="ai-mock-dot" />
            <span>Kaiwa Partner — <i>レストランで (at a restaurant)</i></span>
          </div>
          <div className="ai-mock-body">
            <div className="ai-bubble ai-bubble-bot">いらっしゃいませ。何名様ですか。</div>
            <div className="ai-bubble ai-bubble-me">二人です。</div>
            <div className="ai-bubble ai-bubble-bot">かしこまりました。こちらへどうぞ。<span className="ai-note">(nice — try asking for a menu next)</span></div>
          </div>
          <div className="ai-mock-input">
            <input disabled placeholder="Type your reply in Japanese… (disabled — preview only)" />
            <button disabled>Send</button>
          </div>
        </div>

        <p className="soon-note">Once this ships, it'll live right here — separate from the scripted Kaiwa Lab scenarios, for open-ended practice instead of a fixed script.</p>
      </div>
    </>
  );
}
