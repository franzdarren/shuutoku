import { createContext, useCallback, useContext, useMemo, useState } from "react";

const QuizContext = createContext(null);

/** Shared quiz-progress tracking for every quiz widget on the page, so the
 *  sidebar progress bar and the Quiz Center score cover the whole handbook,
 *  not just one section — mirrors the original single-page behaviour. */
export function QuizProvider({ total, children }) {
  const [answered, setAnswered] = useState(() => new Map()); // qid -> boolean(correct)

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
