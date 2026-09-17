import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);

function readStored(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
}

export function SettingsProvider({ children }) {
  const [furigana, setFurigana] = useState(() => readStored("n4.furigana", true));
  // First visit follows the OS setting; once you've used the toggle, your
  // stored choice wins and the OS is ignored from then on.
  const [dark, setDark] = useState(() =>
    readStored("n4.dark", window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false)
  );
  const [fontScale, setFontScale] = useState(() => readStored("n4.fontScale", 1));
  // Gothic is the default Japanese face everywhere — Mincho's thin strokes
  // are the harder of the two to read at small sizes, and this is a study
  // tool people will read on a phone.
  const [jpFont, setJpFont] = useState(() => readStored("n4.jpFont", "gothic"));

  useEffect(() => {
    document.body.classList.toggle("no-furigana", !furigana);
    try { localStorage.setItem("n4.furigana", JSON.stringify(furigana)); } catch { /* ignore */ }
  }, [furigana]);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    try { localStorage.setItem("n4.dark", JSON.stringify(dark)); } catch { /* ignore */ }
  }, [dark]);

  useEffect(() => {
    document.documentElement.style.setProperty("--fs-scale", String(fontScale));
    try { localStorage.setItem("n4.fontScale", JSON.stringify(fontScale)); } catch { /* ignore */ }
  }, [fontScale]);

  useEffect(() => {
    document.body.setAttribute("data-jpfont", jpFont);
    try { localStorage.setItem("n4.jpFont", JSON.stringify(jpFont)); } catch { /* ignore */ }
  }, [jpFont]);

  const value = { furigana, setFurigana, dark, setDark, fontScale, setFontScale, jpFont, setJpFont };
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
