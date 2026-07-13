import { Link } from 'react-router-dom';
import { useCallback } from 'react';
import { gameApi } from '../api/game';
import { useAsync } from '../hooks/useAsync';
import { Loader, ErrorState } from '../components/States';
import { colorAt } from '../utils/palette';

const SUBJECT_ICONS = { MATH: '🔢', ENG: '🔤', HIN: '📖', SCI: '🔬', EVS: '🌱' };

export default function SubjectsPage() {
  const fetcher = useCallback(() => gameApi.getSubjects(1), []);
  const { data, loading, error, reload } = useAsync(fetcher, []);

  if (loading) return <Loader label="Getting your subjects ready…" />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const subjects = data?.subjects || [];

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-violet-800">Pick a Subject! 🎯</h1>
        <p className="text-lg text-violet-500 mt-2 font-semibold">
          What do you want to play today?
        </p>
      </div>

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
