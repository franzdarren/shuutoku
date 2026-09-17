import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const QuizContext = createContext(null);
const STORAGE_KEY = "n4.quizAnswered";
const POOL_KEY = "n4.poolStats";
const PICKS_KEY = "n4.wrongPicks";
const DISMISSED_KEY = "n4.dismissed";

// The Quiz Center's 10-question sample and each grammar module's "Module
// Check" draw a fresh random set every time you visit (ids final-q0..9 /
// modcheck{i}-q0..9) — the same id can point at different question text
// from one visit to the next, so persisting those across reloads would
// show stale correct/incorrect marks against questions you haven't
// actually seen yet. Everything else (grammar cards, kanji check, reading
// passages, kaiwa scenarios) has fixed content, so it's safe — and useful
// — to remember.
function isPersistable(qid) {
  return !qid.startsWith("final-q") && !qid.startsWith("modcheck");
}

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Map();
    return new Map(JSON.parse(raw));
  } catch {
    return new Map();
  }
}

// Quiz Center's pool items have their own stable content id (see
// `finalPool` in data/index.js) separate from the rotating slot id Quiz.jsx
// assigns, so — unlike `answered` — this is safe to persist for every item,
// and doubles as the wrong-answer history the SRS sampling weights against.
function loadPoolStats() {
  try {
    const raw = localStorage.getItem(POOL_KEY);
    if (!raw) return new Map();
    return new Map(JSON.parse(raw));
  } catch {
    return new Map();
  }
}

/** Shared quiz-progress tracking for every quiz widget on the page, so the
 *  sidebar progress bar and the Quiz Center score cover the whole handbook,
 *  not just one section — mirrors the original single-page behaviour. */
function loadMap(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Map(JSON.parse(raw)) : new Map();
  } catch {
    return new Map();
  }
}

export function QuizProvider({ total, children }) {
  const [answered, setAnswered] = useState(loadStored); // qid -> boolean(correct)
  const [poolStats, setPoolStats] = useState(loadPoolStats); // pool content id -> boolean(correct)
  // Which choice you actually picked when you got something wrong, so the
  // Review Mistakes page can show it back to you rather than just "wrong".
  const [wrongPicks, setWrongPicks] = useState(() => loadMap(PICKS_KEY));
  // Mistakes cleared from the Review Mistakes list via "はい、わかりました".
  // The question itself is reset back to unanswered at the same time (see
  // resetMistake) — this set only exists so the card disappears from the
  // list immediately, without waiting for the list's next full recompute.
  const [dismissed, setDismissed] = useState(() => new Set(loadMap(DISMISSED_KEY).keys()));

  useEffect(() => {
    try {
      const toSave = Array.from(answered).filter(([qid]) => isPersistable(qid));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch { /* ignore (private browsing, quota, etc.) */ }
  }, [answered]);

  useEffect(() => {
    try {
      localStorage.setItem(POOL_KEY, JSON.stringify(Array.from(poolStats)));
    } catch { /* ignore (private browsing, quota, etc.) */ }
  }, [poolStats]);

  useEffect(() => {
    try {
      const toSave = Array.from(wrongPicks).filter(([id]) => isPersistable(id));
      localStorage.setItem(PICKS_KEY, JSON.stringify(toSave));
    } catch { /* ignore (private browsing, quota, etc.) */ }
  }, [wrongPicks]);

  useEffect(() => {
    try {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(Array.from(dismissed, (id) => [id, 1])));
    } catch { /* ignore (private browsing, quota, etc.) */ }
  }, [dismissed]);

  /** Remembers the wrong choice (and un-dismisses the question, so a repeat
   *  mistake resurfaces). Clears the record once you finally get it right. */
  const recordPick = useCallback((id, pickedIdx, isCorrect) => {
    if (!id) return;
    setWrongPicks((prev) => {
      const next = new Map(prev);
      if (isCorrect) next.delete(id); else next.set(id, pickedIdx);
      return next;
    });
    if (!isCorrect) {
      setDismissed((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, []);

  /** "はい、わかりました" on a Review Mistakes card: resets that specific
   *  question back to unanswered everywhere it appears (its card quiz,
   *  Quiz Center, Module Check — whichever it came from), not just off
   *  this list, so you get a genuine clean retry rather than a question
   *  that's still silently marked wrong in the background. */
  const resetMistake = useCallback((id) => {
    setAnswered((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    setPoolStats((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    setWrongPicks((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    setDismissed((prev) => new Set(prev).add(id));
  }, []);

  const answerQuestion = useCallback((qid, isCorrect) => {
    setAnswered((prev) => {
      const next = new Map(prev);
      next.set(qid, isCorrect);
      return next;
    });
  }, []);

  const clearQuestions = useCallback((qids) => {
    setAnswered((prev) => {
      const next = new Map(prev);
      qids.forEach((qid) => next.delete(qid));
      return next;
    });
  }, []);

  const clearPoolResults = useCallback((contentIds) => {
    setPoolStats((prev) => {
      const next = new Map(prev);
      contentIds.forEach((id) => next.delete(id));
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setAnswered(new Map());
    setPoolStats(new Map());
    setWrongPicks(new Map());
    setDismissed(new Set());
  }, []);

  const recordPoolResult = useCallback((contentId, isCorrect) => {
    setPoolStats((prev) => {
      const next = new Map(prev);
      next.set(contentId, isCorrect);
      return next;
    });
  }, []);

  const weakPoolIds = useMemo(() => {
    const s = new Set();
    poolStats.forEach((correct, id) => { if (!correct) s.add(id); });
    return s;
  }, [poolStats]);

  const stats = useMemo(() => {
    let correct = 0;
    answered.forEach((v) => { if (v) correct++; });
    return { answeredCount: answered.size, correctCount: correct, total };
  }, [answered, total]);

  const value = {
    answered, answerQuestion, clearQuestions, clearPoolResults, resetAll, stats,
    poolStats, recordPoolResult, weakPoolIds,
    wrongPicks, recordPick, dismissed, resetMistake,
  };
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}
