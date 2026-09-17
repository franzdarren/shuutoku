import { useEffect, useRef, useState } from "react";
import JpText from "./JpText.jsx";
import SpeakButton from "./SpeakButton.jsx";
import { canSpeak, speakDialogue } from "../lib/speech.js";

/** A spoken exchange — used by both the grammar cards' KAIWA SAMPLE and the
 *  Kaiwa Lab scenarios. Each line has its own listen button, and the header
 *  carries a "Read all" that plays the whole thing straight through,
 *  alternating voices between speakers and highlighting the current line. */
/** The learner's own turn sits on the right, the way your own messages do
 *  in any chat — everyone else is on the left. Dialogues that use neutral
 *  A/B labels instead fall back to "whoever speaks first is on the left". */
const YOU = ["You", "わたし", "あなた"];

function sideResolver(lines) {
  const speakers = [...new Set(lines.map((d) => d.who))];
  const you = speakers.find((w) => YOU.includes(w));
  if (you) return (who) => (who === you ? "b" : "a");
  return (who) => (speakers.indexOf(who) === 0 ? "a" : "b");
}

export default function Dialogue({ lines, label, accent, tip, style }) {
  const [playingLine, setPlayingLine] = useState(-1);
  const cancelRef = useRef(null);

  // Never leave speech running after this dialogue disappears (switching
  // module or section unmounts the card mid-playback otherwise).
  useEffect(() => () => cancelRef.current?.(), []);

  function toggleReadAll() {
    if (playingLine >= 0) {
      cancelRef.current?.();
      cancelRef.current = null;
      return;
    }
    cancelRef.current = speakDialogue(
      lines.map((d) => ({ html: d.jp, who: d.who })),
      { onLine: setPlayingLine }
    );
  }

  if (!lines?.length) return null;
  const reading = playingLine >= 0;
  const sideOf = sideResolver(lines);

  return (
    <div className="dialogue-box" style={style}>
      <div className="dialogue-head">
        {label && <div className="dlabel">{label}</div>}
        {canSpeak() && (
          <button className={"readall-btn" + (reading ? " playing" : "")} onClick={toggleReadAll}>
            {reading ? "■ Stop" : "▶ Read all"}
          </button>
        )}
      </div>
      {lines.map((d, i) => (
        <div key={i} className={"dline side-" + sideOf(d.who) + (i === playingLine ? " speaking" : "")} style={accent ? { "--accent": accent } : undefined}>
          <div className="speaker">{d.who}</div>
          <div className="dtext">
            <div className="jp-row">
              <JpText tag="span" className="jp" html={d.jp} />
              <SpeakButton html={d.jp} who={d.who} />
            </div>
            <div className="en">{d.en}</div>
          </div>
        </div>
      ))}
      {tip && <div className="kaiwa-tip"><b>Tip —</b> {tip}</div>}
    </div>
  );
}
