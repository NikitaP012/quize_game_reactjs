/** Friendly loading / error / empty states for young learners. */

export function Loader({ label = 'Loading…' }) {
  return (
    <div className="grid place-items-center min-h-[45vh] gap-4">
      <div className="text-6xl animate-float">🎪</div>
      <div className="spinner" />
      <p className="text-lg font-semibold text-violet-700">{label}</p>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="grid place-items-center min-h-[45vh] gap-4 text-center">
      <div className="text-6xl animate-wiggle">🙈</div>
      <div className="card max-w-md border-4 border-cherry/40">
        <p className="text-xl font-bold text-cherry mb-1">Oops! Something went wrong</p>
        <p className="text-slate-500">{error?.message || 'Unknown error'}</p>
      </div>
      {onRetry && (
        <button className="btn btn-orange" onClick={onRetry}>
          🔄 Try Again
        </button>
      )}
      <p className="text-sm text-slate-500">
        Make sure the game server is running at <b>localhost:4000</b>.
      </p>
    </div>
  );
}

export function Empty({ children }) {
  return (
    <div className="grid place-items-center min-h-[30vh] text-lg font-semibold text-violet-700">
      <div className="text-5xl mb-2">🫧</div>
      {children}
    </div>
  );
}
