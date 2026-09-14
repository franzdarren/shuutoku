import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { lookupLocal, lookupWord } from "../lib/dictionary.js";

const LookupContext = createContext(null);

const JP_CHAR = /[぀-ヿ㐀-鿿ｦ-ﾟ]/;
const POP_WIDTH = 300;

export function LookupProvider({ children }) {
  const [state, setState] = useState(null); // {term, x, y, loading, result}

  const close = useCallback(() => setState(null), []);

  const runLookup = useCallback(async (term, x, y) => {
    const local = lookupLocal(term);
    setState({ term, x, y, loading: !local, result: local ? { status: "local", entry: local } : null });
    if (local) return;
    const result = await lookupWord(term);
    // only apply if the user hasn't since opened a different lookup
    setState((prev) => (prev && prev.term === term ? { ...prev, loading: false, result } : prev));
  }, []);

  useEffect(() => {
    function onUp(e) {
      if (e.target.closest && e.target.closest(".lookup-pop")) return; // interacting with the popup itself
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        return;
      }
      const anchor = sel.anchorNode;
      const el = anchor && (anchor.nodeType === 1 ? anchor : anchor.parentElement);
      const container = el && el.closest && el.closest(".jp-lookup");
      if (!container) return;

      const text = sel.toString().trim();
      if (!text || text.length > 40 || !JP_CHAR.test(text)) return;

      const rect = sel.getRangeAt(0).getBoundingClientRect();
      const x = Math.min(Math.max(rect.left + rect.width / 2, POP_WIDTH / 2 + 8), window.innerWidth - POP_WIDTH / 2 - 8);
      const y = rect.top;
      runLookup(text, x, y);
    }
    function onDown(e) {
      // clicking anywhere outside the popup closes it; native selection
      // behaviour (incl. double-click word select) is left untouched.
      if (e.target.closest && e.target.closest(".lookup-pop")) return;
      close();
    }
    function onKey(e) { if (e.key === "Escape") close(); }
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchend", onUp);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [runLookup, close]);

  return (
    <LookupContext.Provider value={{ state, close }}>
      {children}
    </LookupContext.Provider>
  );
}

export function useLookupState() {
  const ctx = useContext(LookupContext);
  if (!ctx) throw new Error("useLookupState must be used within LookupProvider");
  return ctx;
}
