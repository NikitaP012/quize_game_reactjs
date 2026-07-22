import { apiGet, apiPost } from './client';

/** Typed-ish wrappers around the game API endpoints. */
export const gameApi = {
  getConfig: () => apiGet('/config'),
  getSubjects: (gradeId = 1) => apiGet(`/subjects?gradeId=${gradeId}`),
  getChapters: (subjectId, gradeId = 1) =>
    apiGet(`/chapters?gradeId=${gradeId}&subjectId=${subjectId}`),
  getLevels: (chapterId) => apiGet(`/chapters/${chapterId}/levels`),
  getQuiz: (chapterId, levelIndex) =>
    apiGet(`/chapters/${chapterId}/levels/${levelIndex}/quiz`),
  submit: (chapterId, levelIndex, answers, isReplay, identity) =>
    apiPost(`/chapters/${chapterId}/levels/${levelIndex}/submit`, { answers, isReplay, identity }),
  getRank: (totalXp) => apiPost('/progress/rank', { totalXp }),
  getSchoolLeaderboard: (limit = 10) => apiGet(`/leaderboard/schools?limit=${limit}`),
};
