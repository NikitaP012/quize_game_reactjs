import { colorAt } from '../utils/palette';

const DIFF = {
  1: { emoji: '🌱', label: 'Easy', color: '#34d399' },
  2: { emoji: '🔥', label: 'Medium', color: '#fb923c' },
  3: { emoji: '💎', label: 'Tricky', color: '#f87171' },
};

/**
 * Renders one question in PLAY mode and reports the chosen answer up via
 * onChange. Answer shapes: single_choice -> option_id | boolean -> 'True'|'False'
 * | text -> string | match -> { [leftKey]: rightItem }.
 */
export default function QuestionCard({ question: q, value, onChange }) {
  const diff = DIFF[q.difficulty.id] || DIFF[1];

  return (
    <div className="card border-4 border-white animate-pop">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="px-3 py-1 rounded-full font-bold text-sm text-white"
          style={{ backgroundColor: diff.color }}
        >
          {diff.emoji} {diff.label}
        </span>
        <span className="px-3 py-1 rounded-full font-bold text-sm bg-violet-100 text-violet-700">
          {q.type_name}
        </span>
      </div>

      <p className="text-2xl font-semibold leading-relaxed text-slate-800 mb-6">
        {q.question_text}
      </p>

      {q.answer_format === 'single_choice' && (
        <div className="grid gap-3">
          {q.options.map((o, i) => {
            const c = colorAt(i);
            const selected = value === o.option_id;
            return (
              <button
                key={o.option_id}
                className={`option flex items-center gap-3 ${
                  selected ? '!border-grape ring-4 ring-violet-200 -translate-y-0.5' : ''
                }`}
                onClick={() => onChange(o.option_id)}
              >
                <span
                  className="grid place-items-center w-9 h-9 rounded-full text-white font-bold shrink-0"
                  style={{ backgroundColor: c.bg }}
                >
                  {o.option_label}
                </span>
                <span className="flex-1">{o.option_text}</span>
                {selected && <span className="text-xl">✅</span>}
              </button>
            );
          })}
        </div>
      )}

      {q.answer_format === 'boolean' && (
        <div className="grid grid-cols-2 gap-4">
          {[
            { v: 'True', label: 'True', hint: 'सही', emoji: '👍', tone: 'bg-grass' },
            { v: 'False', label: 'False', hint: 'ग़लत', emoji: '👎', tone: 'bg-cherry' },
          ].map((opt) => {
            const selected = value === opt.v;
            return (
              <button
                key={opt.v}
                onClick={() => onChange(opt.v)}
                className={`rounded-2xl py-6 font-bold text-white text-xl shadow-toy transition
                  hover:-translate-y-0.5 active:translate-y-[5px] active:shadow-none ${opt.tone}
                  ${selected ? 'ring-4 ring-offset-2 ring-slate-300 -translate-y-0.5' : 'brightness-95'}`}
              >
                <div className="text-4xl mb-1">{opt.emoji}</div>
                {opt.label} <span className="opacity-90">/ {opt.hint}</span>
              </button>
            );
          })}
        </div>
      )}

      {q.answer_format === 'text' && (
        <input
          className="field text-xl"
          placeholder="✏️ Type your answer here…"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
        />
      )}

      {q.answer_format === 'match' && (
        <div className="grid gap-3">
          <p className="text-sm font-semibold text-violet-600">Match each one to its friend! 🧩</p>
          {q.match_left.map((left, i) => (
            <div key={left.key} className="grid grid-cols-2 gap-3 items-center">
              <div
                className="px-4 py-3.5 rounded-2xl font-bold text-white shadow-toy"
                style={{ backgroundColor: colorAt(i).bg }}
              >
                {left.text}
              </div>
              <select
                className="field py-3.5"
                value={value?.[left.key] || ''}
                onChange={(e) => onChange({ ...(value || {}), [left.key]: e.target.value })}
              >
                <option value="">Choose… 👇</option>
                {q.match_right.map((r, idx) => (
                  <option key={idx} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
