import { Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { rankFromXp } from '../utils/rank';

/** Bright, playful header with live XP / coins / rank badges. */
export default function TopBar() {
  const { totalXp, coins } = useProgress();
  const rank = rankFromXp(totalXp);

  return (
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b-4 border-white/60">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-1">
          <span className="text-grape">Q</span>
          <span className="text-bubblegum">u</span>
          <span className="text-tangerine">i</span>
          <span className="text-sky2">z</span>
          <span className="text-grass">e</span>
          <span className="ml-1 animate-float">🎈</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="chip bg-grape" title="Your rank">⭐ {rank.rank}</span>
          <span className="chip bg-sky2" title="Experience points">⚡ {totalXp}</span>
          <span className="chip bg-sun text-amber-900" title="Coins">🪙 {coins}</span>
        </div>
      </div>
    </header>
  );
}
