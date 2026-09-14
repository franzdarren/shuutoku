import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { lookupLocal, lookupWord } from "../lib/dictionary.js";

const LookupContext = createContext(null);

const JP_CHAR = /[぀-ヿ㐀-鿿ｦ-ﾟ]/;
const MARGIN = 12;
const MAX_POP_HEIGHT = 360;
const MAX_POP_WIDTH = 280;

/** Places the popup on whichever side of the selection (above/below) has
 *  more room, and caps its height to whatever actually fits there — so a
 *  long Jisho result never grows past the edge of the window (it scrolls
 *  internally instead), and the close button is never pushed off-screen. */
function computeBox(rect) {
  const popWidth = Math.min(MAX_POP_WIDTH, window.innerWidth - MARGIN * 2);
  const left = Math.min(
    Math.max(rect.left + rect.width / 2, popWidth / 2 + MARGIN),
    window.innerWidth - popWidth / 2 - MARGIN
  );
  const spaceBelow = window.innerHeight - rect.bottom - MARGIN;
  const spaceAbove = rect.top - MARGIN;
  const placeBelow = spaceBelow >= spaceAbove;
  const maxHeight = Math.max(120, Math.min(MAX_POP_HEIGHT, placeBelow ? spaceBelow : spaceAbove));
  return placeBelow
    ? { left, top: rect.bottom + 8, maxHeight }
    : { left, bottom: window.innerHeight - rect.top + 8, maxHeight };
}

export function LookupProvider({ children }) {
  const [state, setState] = useState(null); // {term, loading, result, box:{...}}

  const close = useCallback(() => setState(null), []);

  const runLookup = useCallback(async (term, box) => {
    const local = lookupLocal(term);
    setState({ term, box, loading: !local, result: local ? { status: "local", entry: local } : null });
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
      runLookup(text, computeBox(rect));
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
