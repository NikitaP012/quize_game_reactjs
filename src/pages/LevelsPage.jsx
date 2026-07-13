import { Link, useParams } from 'react-router-dom';
import { useCallback } from 'react';
import { gameApi } from '../api/game';
import { useAsync } from '../hooks/useAsync';
import { useProgress } from '../context/ProgressContext';
import { Loader, ErrorState } from '../components/States';
import { colorAt } from '../utils/palette';

export default function LevelsPage() {
  const { chapterId } = useParams();
  const fetcher = useCallback(() => gameApi.getLevels(chapterId), [chapterId]);
  const { data, loading, error, reload } = useAsync(fetcher, [chapterId]);
  const { isLevelUnlocked, getLevelState } = useProgress();

  if (loading) return <Loader label="Building the level map…" />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const { chapter, levels = [] } = data || {};

  return (
    <div>
      <Link to={`/subject/${chapter?.subject_id}`} className="btn btn-ghost mb-5 !py-2 !px-4 !text-base">
        ← {chapter?.subject_name}
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-violet-800">{chapter?.chapter_name}</h1>
        <p className="text-lg text-violet-500 mt-1 font-semibold">
          Clear a level to unlock the next one! 🗺️
        </p>
      </div>

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3">
        {levels.map((lvl, i) => {
          const unlocked = lvl.available && isLevelUnlocked(chapterId, lvl.index);
          const st = getLevelState(chapterId, lvl.index);
          return (
            <LevelCard
              key={lvl.index}
              chapterId={chapterId}
              level={lvl}
              color={colorAt(i)}
              unlocked={unlocked}
              state={st}
            />
          );
        })}
      </div>
    </div>
  );
}

function LevelCard({ chapterId, level, color, unlocked, state }) {
  // Difficulty "flames" — how spicy this level is (1–3).
  const spicy = level.difficultyMix[3] > 0 ? 3 : level.difficultyMix[2] > 0 ? 2 : 1;

  const inner = (
    <div
      className={`card border-4 border-white text-center relative overflow-hidden ${
        unlocked ? 'card-click' : ''
      }`}
      style={{ backgroundColor: unlocked ? color.bg : '#cbd5e1' }}
    >
      {/* completion badge */}
      {state?.cleared && (
        <div className="absolute top-2 right-2 text-2xl animate-tada">
          {state.perfect ? '🌟' : '✅'}
        </div>
      )}
      {!unlocked && <div className="absolute top-2 right-2 text-2xl">🔒</div>}

      <div className="grid place-items-center w-20 h-20 mx-auto rounded-full bg-white/30 mb-2">
        <span className="text-4xl font-bold text-white">{level.index}</span>
      </div>
      <div className="text-lg font-bold text-white">{level.title}</div>
      <div className="text-white/80 text-sm font-semibold">{'🔥'.repeat(spicy)}</div>

      <div className="mt-3 flex justify-center gap-2 text-sm font-bold">
        <span className="px-2.5 py-1 rounded-full bg-white/30 text-white">⚡ {level.rewards.maxXp}</span>
        <span className="px-2.5 py-1 rounded-full bg-white/30 text-white">🪙 {level.rewards.maxCoins}</span>
      </div>

      {state?.cleared && (
        <div className="mt-2 text-xs font-bold text-white/90">Best score: {state.bestAccuracy}%</div>
      )}
      {!unlocked && (
        <div className="mt-2 text-xs font-bold text-slate-600">Clear the level before</div>
      )}
    </div>
  );

  if (!unlocked) return inner;
  return <Link to={`/chapter/${chapterId}/level/${level.index}`}>{inner}</Link>;
}
