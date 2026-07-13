// Mirrors gameConfig.rankThresholds on the backend. The authoritative copy comes
// from GET /config; kept here so the TopBar can render a rank synchronously.
export const RANK_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500];

export function rankFromXp(totalXp) {
  let rank = 0;
  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    if (totalXp >= RANK_THRESHOLDS[i]) rank = i;
  }
  const next = RANK_THRESHOLDS[rank + 1] ?? null;
  return {
    rank,
    next,
    xpToNext: next === null ? 0 : next - totalXp,
    isMax: next === null,
  };
}
