import { Link } from 'react-router-dom';
import { useCallback } from 'react';
import { gameApi } from '../api/game';
import { useAsync } from '../hooks/useAsync';
import { Loader, ErrorState } from '../components/States';

const MEDAL = ['🥇', '🥈', '🥉'];

/** Top 10 schools by student performance — all figures come from the marks table. */
export default function LeaderboardPage() {
  const fetcher = useCallback(() => gameApi.getSchoolLeaderboard(10), []);
  const { data, loading, error, reload } = useAsync(fetcher, []);

  if (loading) return <Loader label="Counting up the scores…" />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const schools = data?.schools || [];

  return (
    <div>
      <Link to="/" className="btn btn-ghost mb-5 !py-2 !px-4 !text-base">← Home</Link>

      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-violet-800">🏆 Top Schools</h1>
        <p className="text-lg text-violet-500 mt-2 font-semibold">Which school is winning today?</p>
      </div>

      {schools.length === 0 ? (
        <div className="card text-center text-slate-400 font-semibold py-10">
          No quiz results yet — play a few levels to get on the board! 🎮
        </div>
      ) : (
        <div className="grid gap-3">
          {schools.map((s) => (
            <div
              key={s.school_id}
              className={`card flex items-center gap-4 border-4 ${
                s.rank <= 3 ? 'border-sun/70 shadow-toy-lg' : 'border-white'
              }`}
            >
              <div className="w-12 shrink-0 text-center text-2xl font-bold text-violet-700">
                {MEDAL[s.rank - 1] || `#${s.rank}`}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-800 truncate">{s.school_name}</h3>
                <p className="text-sm font-bold text-grape truncate" title="Top student">
                  🧒 {s.student_name}
                </p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-slate-500">
                  <span title="Quizzes completed">🎮 {s.quizzes_completed} quizzes</span>
                  <span title="Levels completed">🏁 {s.levels_completed} levels</span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-2xl font-bold text-grape">{s.total_score.toLocaleString()}</div>
                <div className="text-xs font-semibold text-slate-400">SCORE</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
