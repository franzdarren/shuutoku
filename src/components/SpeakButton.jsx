import { useState } from "react";
import { canSpeak, speakJapanese, toPlainJapanese } from "../lib/speech.js";

/** A small "listen" button next to a line of Japanese. `html` is the same
 *  ruby-annotated markup JpText renders — this strips it down to plain
 *  text before handing it to the browser's speech synthesis. Renders
 *  nothing if the browser has no speech synthesis support at all. */
export default function SpeakButton({ html, who, label = "Listen" }) {
  const [playing, setPlaying] = useState(false);
  if (!canSpeak()) return null;

  function handleClick(e) {
    e.stopPropagation();
    const text = toPlainJapanese(html);
    if (!text) return;
    speakJapanese(text, { who });
    setPlaying(true);
    // speechSynthesis has no reliable duration up-front; a short pulse on
    // the icon is enough feedback that the click registered.
    setTimeout(() => setPlaying(false), 600);
  }

  return (
    <button
      type="button"
      className={"speak-btn" + (playing ? " playing" : "")}
      onClick={handleClick}
      aria-label={label}
      title={label}
    >
      🔊
    </button>
  );
}
