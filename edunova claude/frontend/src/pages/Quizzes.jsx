import { useState, useEffect } from 'react';
import api from '../api';
import QuizCard from '../components/QuizCard';
import { useAuth } from '../context/AuthContext';

const categories = ['All', 'Web Development', 'AI / ML', 'Data Structures'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Quizzes() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchQuizzes();
    if (user) {
      fetchUserResults();
    }
  }, [selectedCategory, selectedDifficulty, search, user]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
      if (search) params.search = search;

      const res = await api.get('/quizzes', { params });
      setQuizzes(res.data);
    } catch (err) {
      console.error('Failed to fetch quizzes', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserResults = async () => {
    try {
      const res = await api.get('/quizzes/mine/results');
      setUserResults(res.data);
    } catch (err) {
      console.error('Failed to fetch user quiz results', err);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="rounded-2xl glass-panel p-8 text-paper shadow-2xl border border-indigo-500/25">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="inline-block font-mono text-xs font-semibold uppercase tracking-wider text-mint">
              Smart Assessment Module
            </span>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Interactive Quizzes & <span className="gradient-text">Scorecards</span>
            </h1>
            <p className="mt-2 text-slate-light max-w-xl text-xs leading-relaxed">
              Validate your understanding of web development, AI algorithms, data structures, and system design with instant evaluation and detailed explanations.
            </p>
          </div>

          {user && (
            <div className="rounded-xl bg-ink-soft/80 p-4 border border-indigo-500/20 text-center md:text-right min-w-[200px]">
              <span className="font-mono text-xs text-slate-light">Your Scorecard</span>
              <div className="mt-1 text-2xl font-extrabold text-mint font-display">
                {userResults.length} Completed
              </div>
              <p className="text-xs text-paper/70 font-mono mt-0.5">
                Avg Score:{' '}
                {userResults.length > 0
                  ? Math.round(
                      userResults.reduce((acc, r) => acc + r.percentage, 0) / userResults.length
                    )
                  : 0}
                %
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mt-8 pt-6 border-t border-indigo-500/15 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn-interactive rounded-xl px-4 py-2 font-mono text-xs transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-amber via-amber-neon to-mint font-bold text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                    : 'bg-ink-soft/70 text-slate-light border border-indigo-500/20 hover:border-mint/40 hover:text-paper'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search quizzes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl bg-ink-soft/90 border border-indigo-500/25 px-3.5 py-2 text-xs text-paper placeholder-slate-light outline-none focus:border-mint focus:ring-1 focus:ring-mint"
            />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded-xl bg-ink-soft/90 border border-indigo-500/25 px-3.5 py-2 text-xs text-paper outline-none focus:border-mint focus:ring-1 focus:ring-mint"
            >
              {difficulties.map((d) => (
                <option key={d} value={d} className="bg-ink text-paper">
                  Level: {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="py-20 text-center font-mono text-sm text-mint flex items-center justify-center gap-2">
          <span className="h-3 w-3 rounded-full bg-mint animate-ping" />
          Loading quizzes...
        </div>
      ) : quizzes.length === 0 ? (
        <div className="py-20 text-center font-mono text-sm text-slate-light">
          No quizzes found matching filters.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}

      {/* User History Table */}
      {user && userResults.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-xl font-bold text-paper">Recent Quiz Scorecards</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-indigo-500/20 bg-ink-light/80 shadow-xl backdrop-blur-md">
            <table className="w-full text-left text-sm text-paper">
              <thead className="bg-ink-soft/90 font-mono text-xs text-slate-light uppercase border-b border-indigo-500/20">
                <tr>
                  <th className="px-6 py-3.5">Quiz Title</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Score</th>
                  <th className="px-6 py-3.5">Percentage</th>
                  <th className="px-6 py-3.5">Completed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-500/10 font-mono text-xs">
                {userResults.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-indigo-500/10 transition-colors">
                    <td className="px-6 py-4 font-semibold text-paper">{r.quizTitle}</td>
                    <td className="px-6 py-4 text-mint">{r.category}</td>
                    <td className="px-6 py-4 text-paper/80">
                      {r.score} / {r.total}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 font-bold ${
                          r.percentage >= 70
                            ? 'bg-mint/20 text-mint border border-mint/30'
                            : 'bg-amber/20 text-amber border border-amber/30'
                        }`}
                      >
                        {r.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-light">
                      {new Date(r.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
