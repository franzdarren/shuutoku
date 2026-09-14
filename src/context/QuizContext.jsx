import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const QuizContext = createContext(null);
const STORAGE_KEY = "n4.quizAnswered";

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

/** Shared quiz-progress tracking for every quiz widget on the page, so the
 *  sidebar progress bar and the Quiz Center score cover the whole handbook,
 *  not just one section — mirrors the original single-page behaviour. */
export function QuizProvider({ total, children }) {
  const [answered, setAnswered] = useState(loadStored); // qid -> boolean(correct)

  useEffect(() => {
    try {
      const toSave = Array.from(answered).filter(([qid]) => isPersistable(qid));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch { /* ignore (private browsing, quota, etc.) */ }
  }, [answered]);

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

  const resetAll = useCallback(() => setAnswered(new Map()), []);

  const stats = useMemo(() => {
    let correct = 0;
    answered.forEach((v) => { if (v) correct++; });
    return { answeredCount: answered.size, correctCount: correct, total };
  }, [answered, total]);

  const value = { answered, answerQuestion, clearQuestions, resetAll, stats };
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}
