import { Link, useParams } from 'react-router-dom';
import { useCallback } from 'react';
import { gameApi } from '../api/game';
import { useAsync } from '../hooks/useAsync';
import { useIdentity } from '../context/IdentityContext';
import { Loader, ErrorState } from '../components/States';
import { colorAt } from '../utils/palette';

export default function ChaptersPage() {
  const { subjectId } = useParams();
  const { gradeId } = useIdentity();
  const fetcher = useCallback(() => gameApi.getChapters(subjectId, gradeId), [subjectId, gradeId]);
  const { data, loading, error, reload } = useAsync(fetcher, [subjectId, gradeId]);

  if (loading) return <Loader label="Opening the book…" />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const { subject, chapters = [] } = data || {};

  return (
    <div>
      <Link to="/" className="btn btn-ghost mb-5 !py-2 !px-4 !text-base">← Subjects</Link>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-violet-800">{subject?.subject_name} 📚</h1>
        <p className="text-lg text-violet-500 mt-1 font-semibold">Choose a chapter to play!</p>
      </div>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        {chapters.map((c, i) => {
          const playable = Number(c.playable_questions) > 0;
          const col = colorAt(i);
          return (
            <Link
              key={c.chapter_id}
              to={playable ? `/chapter/${c.chapter_id}` : '#'}
              className={`card border-4 border-white flex items-center gap-4 ${
                playable ? 'card-click' : 'opacity-50 grayscale pointer-events-none'
              }`}
            >
              <div
                className="grid place-items-center w-16 h-16 rounded-2xl text-white text-2xl font-bold shrink-0 shadow-toy"
                style={{ backgroundColor: col.bg }}
              >
                {c.chapter_number}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-800 leading-snug">{c.chapter_name}</h3>
                {c.chapter_subtitle && (
                  <p className="text-sm text-slate-400 font-medium truncate">{c.chapter_subtitle}</p>
                )}
                <span className="inline-block mt-1.5 text-sm font-bold text-violet-500">
                  ⭐ {c.playable_questions} questions
                </span>
              </div>
              <div className="text-2xl">{playable ? '▶️' : '🔒'}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
