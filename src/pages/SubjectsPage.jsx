import { Link } from 'react-router-dom';
import { useCallback } from 'react';
import { gameApi } from '../api/game';
import { useAsync } from '../hooks/useAsync';
import { useIdentity } from '../context/IdentityContext';
import { Loader, ErrorState } from '../components/States';
import { colorAt } from '../utils/palette';

const SUBJECT_ICONS = { MATH: '🔢', ENG: '🔤', HIN: '📖', SCI: '🔬', EVS: '🌱' };

export default function SubjectsPage() {
  const { gradeId } = useIdentity();
  const fetcher = useCallback(() => gameApi.getSubjects(gradeId), [gradeId]);
  const { data, loading, error, reload } = useAsync(fetcher, [gradeId]);

  if (loading) return <Loader label="Getting your subjects ready…" />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const subjects = data?.subjects || [];

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link to="/leaderboard" className="btn btn-green !py-2.5 !px-5 !text-base">
          🏆 View Leaderboard
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-violet-800">Pick a Subject! 🎯</h1>
        <p className="text-lg text-violet-500 mt-2 font-semibold">
          What do you want to play today?
        </p>
      </div>

      {subjects.length === 0 && (
        <div className="card text-center py-10 max-w-md mx-auto border-4 border-white">
          <div className="text-6xl mb-3">🚧</div>
          <h3 className="text-xl font-bold text-violet-800">
            No quizzes for Class {gradeId} yet
          </h3>
          <p className="text-slate-500 font-semibold mt-1">
            Questions are only ready for Class 1 right now. Please check back soon!
          </p>
        </div>
      )}

      <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
        {subjects.map((s, i) => {
          const c = colorAt(i);
          return (
            <Link
              key={s.subject_id}
              to={`/subject/${s.subject_id}`}
              className="card card-click text-center border-4 border-white"
              style={{ backgroundColor: c.bg }}
            >
              <div className="text-6xl mb-3 animate-float">{SUBJECT_ICONS[s.subject_code] || '📚'}</div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">{s.subject_name}</h3>
              <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-white/30 text-white font-bold text-sm">
                {s.chapter_count} chapters
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
