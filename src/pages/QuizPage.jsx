import { useParams, Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { gameApi } from '../api/game';
import { useAsync } from '../hooks/useAsync';
import { useProgress } from '../context/ProgressContext';
import { useIdentity } from '../context/IdentityContext';
import { Loader, ErrorState } from '../components/States';
import QuestionCard from '../components/QuestionCard';
import ResultView from './ResultView';

export default function QuizPage() {
  const { chapterId, levelIndex } = useParams();
  const li = parseInt(levelIndex, 10);
  const { recordResult, getLevelState } = useProgress();
  const { identity } = useIdentity();

  const fetcher = useCallback(() => gameApi.getQuiz(chapterId, li), [chapterId, li]);
  const { data: quiz, loading, error, reload } = useAsync(fetcher, [chapterId, li]);

  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setAnswers({});
    setIndex(0);
    setResult(null);
  }, [quiz]);

  if (loading) return <Loader label="Building your quiz…" />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  if (result) {
    return <ResultView result={result} quiz={quiz} chapterId={chapterId} onRetry={reload} />;
  }

  const questions = quiz.questions;
  const q = questions[index];
  const isLast = index === questions.length - 1;
  const pct = ((index + 1) / questions.length) * 100;
  const setAnswer = (val) => setAnswers((a) => ({ ...a, [q.question_id]: val }));
  const answeredCount = questions.filter((qq) => hasAnswer(answers[qq.question_id])).length;

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = questions.map((qq) => ({
        question_id: qq.question_id,
        answer: answers[qq.question_id] ?? null,
      }));
      const isReplay = Boolean(getLevelState(chapterId, li)?.cleared);
      const res = await gameApi.submit(chapterId, li, payload, isReplay, identity);
      recordResult(chapterId, li, res);
      setResult(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      alert(`Could not submit: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Link to={`/chapter/${chapterId}`} className="btn btn-ghost !py-2 !px-4 !text-base">
          ✋ Quit
        </Link>
        <div className="px-4 py-2 rounded-full bg-white font-bold text-violet-700 shadow">
          {quiz.level.title} · {index + 1}/{questions.length}
        </div>
      </div>

      {/* progress track with a rocket mascot */}
      <div className="relative h-5 rounded-full bg-white/70 shadow-inner mb-6">
        <div
          className="h-full rounded-full bg-gradient-to-r from-grape via-bubblegum to-tangerine transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute -top-1.5 text-2xl transition-all duration-300"
          style={{ left: `calc(${pct}% - 14px)` }}
        >
          🚀
        </div>
      </div>

      <QuestionCard question={q} value={answers[q.question_id]} onChange={setAnswer} />

      <div className="flex items-center justify-between mt-6 gap-3">
        <button
          className="btn btn-ghost"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          ← Back
        </button>

        {!isLast ? (
          <button className="btn" onClick={() => setIndex((i) => i + 1)}>
            Next →
          </button>
        ) : (
          <button className="btn btn-green" onClick={handleSubmit} disabled={submitting}>
            {submitting ? '⏳ Checking…' : `🎉 Finish (${answeredCount}/${questions.length})`}
          </button>
        )}
      </div>

      {/* answered dots */}
      <div className="flex justify-center flex-wrap gap-2 mt-6">
        {questions.map((qq, i) => (
          <button
            key={qq.question_id}
            onClick={() => setIndex(i)}
            className={`w-8 h-8 rounded-full font-bold text-sm transition ${
              i === index
                ? 'bg-grape text-white scale-110'
                : hasAnswer(answers[qq.question_id])
                  ? 'bg-grass text-white'
                  : 'bg-white text-slate-400'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function hasAnswer(v) {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim() !== '';
  if (typeof v === 'object') return Object.keys(v).length > 0;
  return true;
}
