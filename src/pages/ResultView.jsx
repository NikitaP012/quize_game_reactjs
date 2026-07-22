import { useNavigate } from 'react-router-dom';

/** Celebratory results screen: stars, rewards, and a friendly review. */
export default function ResultView({ result, quiz, chapterId, onRetry }) {
  const navigate = useNavigate();
  const qById = new Map(quiz.questions.map((q) => [q.question_id, q]));

  // Prefer the server's trusted star rating; fall back for older responses.
  const stars =
    result.stars ?? (result.perfect ? 3 : result.passed ? 2 : result.accuracy >= 40 ? 1 : 0);
  const headline = result.perfect
    ? 'PERFECT! You are a star! 🌟'
    : result.passed
      ? 'Level Cleared! 🎉'
      : 'Good try! Play again 💪';

  return (
    <div>
      <div className="text-center py-6">
        <div className="text-6xl animate-tada mb-2">{result.passed ? '🏆' : '🎈'}</div>
        <div className="text-2xl sm:text-3xl font-bold text-violet-800">{headline}</div>

        {/* 3-star rating */}
        <div className="flex justify-center gap-2 my-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`text-5xl ${i < stars ? 'animate-bounceIn' : 'opacity-25 grayscale'}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              ⭐
            </span>
          ))}
        </div>

        <div className="inline-block px-6 py-2 rounded-full bg-white shadow font-bold text-xl text-violet-700">
          {result.correctCount} / {result.total} correct · {result.accuracy}%
        </div>
      </div>

      {/* rewards */}
      <div className="flex gap-4 justify-center flex-wrap mb-8">
        <RewardTile emoji="⚡" value={`+${result.rewards.xp.total}`} label="XP" bg="#38bdf8" />
        <RewardTile emoji="🪙" value={`+${result.rewards.coins}`} label="Coins" bg="#fbbf24" />
      </div>

      {/* actions */}
      <div className="flex gap-3 justify-center flex-wrap mb-10">
        {result.unlockedNextLevel && result.nextLevelIndex != null && (
          <button
            className="btn btn-green"
            onClick={() => navigate(`/chapter/${chapterId}/level/${result.nextLevelIndex}`)}
          >
            Next Level →
          </button>
        )}
        <button className="btn btn-orange" onClick={onRetry}>
          🔄 Play Again
        </button>
        <button className="btn btn-ghost" onClick={() => navigate(`/chapter/${chapterId}`)}>
          🗺️ Levels
        </button>
      </div>

      {/* review */}
      <h2 className="text-xl font-bold text-violet-800 mb-3 text-center">Let's Review! 🔍</h2>
      <div className="grid gap-3">
        {result.results.map((r, i) => {
          const q = qById.get(r.question_id);
          return (
            <div
              key={r.question_id}
              className={`card border-4 ${r.correct ? 'border-grass/50' : 'border-cherry/50'}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{r.correct ? '✅' : '❌'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800">
                    {i + 1}. {q?.question_text}
                  </p>
                  {!r.correct && (
                    <p className="text-sm font-bold text-grass mt-1">
                      ✔️ Answer: {renderCorrect(r.correct_answer)}
                    </p>
                  )}
                  {r.explanation && (
                    <p className="text-sm text-slate-500 mt-1">💡 {r.explanation}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RewardTile({ emoji, value, label, bg }) {
  return (
    <div
      className="rounded-3xl px-7 py-4 text-center text-white shadow-toy-lg animate-bounceIn border-4 border-white"
      style={{ backgroundColor: bg }}
    >
      <div className="text-3xl">{emoji}</div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm font-semibold opacity-90">{label}</div>
    </div>
  );
}

function renderCorrect(ca) {
  if (Array.isArray(ca)) {
    if (ca[0]?.option_text !== undefined) return ca.map((o) => o.option_text).join(', ');
    if (ca[0]?.left !== undefined) return ca.map((p) => `${p.left} → ${p.right}`).join('; ');
  }
  return String(ca ?? '');
}
