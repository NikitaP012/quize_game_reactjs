import { Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import SubjectsPage from './pages/SubjectsPage';
import ChaptersPage from './pages/ChaptersPage';
import LevelsPage from './pages/LevelsPage';
import QuizPage from './pages/QuizPage';

export default function App() {
  return (
    <>
      <TopBar />
      <main className="max-w-5xl mx-auto px-5 pb-24 pt-6">
        <Routes>
          <Route path="/" element={<SubjectsPage />} />
          <Route path="/subject/:subjectId" element={<ChaptersPage />} />
          <Route path="/chapter/:chapterId" element={<LevelsPage />} />
          <Route path="/chapter/:chapterId/level/:levelIndex" element={<QuizPage />} />
          <Route path="*" element={<p className="text-slate-400">Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
