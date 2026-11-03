import { Link } from 'react-router-dom';

export default function QuizCard({ quiz }) {
  const difficultyColors = {
    Beginner: 'border-mint/40 text-mint bg-mint/10',
    Intermediate: 'border-amber/40 text-amber bg-amber/10',
    Advanced: 'border-rose-400/40 text-rose-400 bg-rose-400/10'
  };

  return (
    <div className="group trace-card flex flex-col justify-between rounded-2xl bg-ink-light/80 p-6 text-paper shadow-xl border border-indigo-500/20 backdrop-blur-md hover:border-mint/50 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 font-mono text-xs font-semibold text-indigo-300">
            {quiz.category}
          </span>
          <span
            className={`rounded-full border px-3 py-0.5 font-mono text-xs font-semibold ${
              difficultyColors[quiz.difficulty] || 'border-paper/20 text-paper/70'
            }`}
          >
            {quiz.difficulty}
          </span>
        </div>

        <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-paper group-hover:text-mint transition-colors">
          {quiz.title}
        </h3>

        <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-light">{quiz.description}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-indigo-500/15 flex items-center justify-between text-xs text-slate-light font-mono">
        <div className="flex items-center gap-2.5">
          <span className="text-paper/80 font-medium">{quiz.questionCount} Qs</span>
          <span>•</span>
          <span className="text-mint font-semibold">⏱ {quiz.timeLimit} Mins</span>
        </div>

        <Link
          to={`/quizzes/${quiz.id}`}
          className="btn-interactive rounded-xl bg-gradient-to-r from-amber to-mint px-4 py-2 font-mono text-xs font-bold text-white shadow-[0_0_12px_rgba(99,102,241,0.4)] hover:opacity-95"
        >
          Start Quiz →
        </Link>
      </div>
    </div>
  );
}
