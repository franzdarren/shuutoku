import { useEffect, useRef, useState } from "react";
import JpText from "./JpText.jsx";
import SpeakButton from "./SpeakButton.jsx";
import { canSpeak, speakDialogue } from "../lib/speech.js";

/** A spoken exchange — used by both the grammar cards' KAIWA SAMPLE and the
 *  Kaiwa Lab scenarios. Each line has its own listen button, and the header
 *  carries a "Read all" that plays the whole thing straight through,
 *  alternating voices between speakers and highlighting the current line. */
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
        <div key={i} className={"dline" + (i === playingLine ? " speaking" : "")}>
          <div className="speaker" style={accent ? { background: accent } : undefined}>{d.who}</div>
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
