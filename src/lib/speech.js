// Pronunciation playback via the browser's built-in speech synthesis — free,
// no API key, works offline once the voice is downloaded by the OS. Quality
// and Japanese voice availability vary by browser/OS, but it degrades
// gracefully: canSpeak() lets callers hide the button entirely when the API
// (or a Japanese voice) isn't available.

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Strip this app's authored HTML (mainly <ruby>/<rt> furigana) down to
 *  the plain sentence a speech engine should actually read — otherwise it
 *  would read the kanji AND its furigana reading back to back. */
export function toPlainJapanese(html) {
  return html
    .replace(/<rt>.*?<\/rt>/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function speakJapanese(text) {
  if (!canSpeak() || !text) return false;
  window.speechSynthesis.cancel(); // don't stack multiple lines queued up
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP";
  utter.rate = 0.92;
  window.speechSynthesis.speak(utter);
  return true;
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}
