// Pronunciation playback via the browser's built-in speech synthesis — free,
// no API key, works offline once the voice is downloaded by the OS. Quality
// and Japanese voice availability vary by browser/OS, but it degrades
// gracefully: canSpeak() lets callers hide the button entirely when the API
// (or a Japanese voice) isn't available.

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Japanese voices the OS has actually installed. The list is populated
 *  asynchronously in most browsers, so this can legitimately return []
 *  on the first call and fill in a moment later. */
function japaneseVoices() {
  if (!canSpeak()) return [];
  return window.speechSynthesis.getVoices().filter((v) => /^ja(-|_|$)/i.test(v.lang));
}

// Chrome populates the voice list asynchronously and fires this once ready.
if (canSpeak() && typeof window.speechSynthesis.addEventListener === "function") {
  window.speechSynthesis.addEventListener("voiceschanged", () => { /* list refreshes on next read */ });
}

/** Gives each dialogue speaker a distinguishable sound. Two installed
 *  Japanese voices is the good case; with only one (the common case) the
 *  speakers are separated by pitch instead, which is still enough to tell
 *  them apart by ear. */
export function voiceStyleFor(who) {
  const voices = japaneseVoices();
  const isB = String(who).trim().toUpperCase() === "B";
  if (voices.length > 1) return { voice: voices[isB ? 1 : 0], pitch: 1 };
  return { voice: voices[0] || null, pitch: isB ? 0.78 : 1.12 };
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

export function speakJapanese(text, { who, onEnd } = {}) {
  if (!canSpeak() || !text) return false;
  window.speechSynthesis.cancel(); // don't stack multiple lines queued up
  const utter = buildUtterance(text, who);
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
  return true;
}

function buildUtterance(text, who) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP";
  utter.rate = 0.92;
  if (who != null) {
    const { voice, pitch } = voiceStyleFor(who);
    if (voice) utter.voice = voice;
    utter.pitch = pitch;
  }
  return utter;
}

/** Reads a whole dialogue straight through, one line after the next, each
 *  in its speaker's voice. Returns a cancel function. `lines` is
 *  [{ html, who }]; `onLine` reports the index currently being spoken
 *  (and -1 when the run finishes) so the UI can highlight along. */
export function speakDialogue(lines, { onLine } = {}) {
  if (!canSpeak() || !lines.length) return () => {};
  window.speechSynthesis.cancel();
  let cancelled = false;

  function next(i) {
    if (cancelled) return;
    if (i >= lines.length) { onLine?.(-1); return; }
    const text = toPlainJapanese(lines[i].html);
    if (!text) { next(i + 1); return; }
    onLine?.(i);
    const utter = buildUtterance(text, lines[i].who);
    utter.onend = () => next(i + 1);
    // If the engine errors on a line (voice missing, etc.) keep going
    // rather than leaving the run stuck half-way through.
    utter.onerror = () => next(i + 1);
    window.speechSynthesis.speak(utter);
  }
  next(0);

  return () => { cancelled = true; onLine?.(-1); window.speechSynthesis.cancel(); };
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}
