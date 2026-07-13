import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  loadProgress,
  saveProgress,
  resetProgress,
  applyResult,
  isLevelUnlocked,
  getLevelState,
  getChapterCompletion,
} from '../store/progressStore';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [state, setState] = useState(loadProgress);

  // Persist on every change.
  useEffect(() => {
    saveProgress(state);
  }, [state]);

  const recordResult = useCallback((chapterId, levelIndex, result) => {
    setState((s) => applyResult(s, chapterId, levelIndex, result));
  }, []);

  const reset = useCallback(() => setState(resetProgress()), []);

  const value = useMemo(
    () => ({
      state,
      totalXp: state.totalXp,
      coins: state.coins,
      recordResult,
      reset,
      isLevelUnlocked: (chapterId, i) => isLevelUnlocked(state, chapterId, i),
      getLevelState: (chapterId, i) => getLevelState(state, chapterId, i),
      getChapterCompletion: (chapterId, total) => getChapterCompletion(state, chapterId, total),
    }),
    [state, recordResult, reset]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
