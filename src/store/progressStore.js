/**
 * Guest-mode progress persisted in localStorage. There is no login and no
 * server-side player state, so the browser is the source of truth for XP,
 * coins, and which levels a player has unlocked.
 *
 * Shape:
 * {
 *   totalXp: number,
 *   coins: number,
 *   chapters: {
 *     [chapterId]: {
 *       levels: { [levelIndex]: { cleared, perfect, bestAccuracy, plays } }
 *     }
 *   }
 * }
 */
const KEY = 'quize_progress_v1';

const emptyState = () => ({ totalXp: 0, coins: 0, chapters: {} });

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return { ...emptyState(), ...parsed };
  } catch {
    return emptyState();
  }
}

export function saveProgress(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full / disabled — progress simply won't persist */
  }
}

export function resetProgress() {
  localStorage.removeItem(KEY);
  return emptyState();
}

/** Level 0 is always open; level i unlocks once level i-1 is cleared. */
export function isLevelUnlocked(state, chapterId, levelIndex) {
  if (levelIndex <= 0) return true;
  const prev = state.chapters?.[chapterId]?.levels?.[levelIndex - 1];
  return Boolean(prev?.cleared);
}

export function getLevelState(state, chapterId, levelIndex) {
  return state.chapters?.[chapterId]?.levels?.[levelIndex] || null;
}

/** How far a player has progressed in a chapter (cleared level count). */
export function getChapterCompletion(state, chapterId, totalLevels) {
  const levels = state.chapters?.[chapterId]?.levels || {};
  const cleared = Object.values(levels).filter((l) => l.cleared).length;
  return { cleared, totalLevels, pct: totalLevels ? Math.round((cleared / totalLevels) * 100) : 0 };
}

/**
 * Apply a graded submission result to the progress state (immutably).
 * Returns the new state. XP/coins from the server result are added to totals.
 */
export function applyResult(state, chapterId, levelIndex, result) {
  const next = structuredClone(state);
  next.chapters[chapterId] = next.chapters[chapterId] || { levels: {} };
  const levels = next.chapters[chapterId].levels;
  const prev = levels[levelIndex] || { cleared: false, perfect: false, bestAccuracy: 0, plays: 0 };

  levels[levelIndex] = {
    cleared: prev.cleared || result.passed,
    perfect: prev.perfect || result.perfect,
    bestAccuracy: Math.max(prev.bestAccuracy, result.accuracy),
    plays: prev.plays + 1,
  };

  next.totalXp += result.rewards?.xp?.total || 0;
  next.coins += result.rewards?.coins || 0;
  return next;
}
