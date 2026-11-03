import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function QuizDetail() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State during quiz taking
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { q1: optionIndex }
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    let timer;
    if (quiz && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(); // Auto-submit when time expires
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quiz, isSubmitted, timeLeft]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/quizzes/${id}`);
      setQuiz(res.data);
      setTimeLeft(res.data.timeLimit ? res.data.timeLimit * 60 : 600);
    } catch (err) {
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    try {
      const res = await api.post(`/quizzes/${id}/submit`, {
        answers,
        timeTakenSec: (quiz.timeLimit * 60) - timeLeft
      });
      setResult(res.data);
      setIsSubmitted(true);
    } catch (err) {
      alert('Failed to submit quiz.');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return <div className="py-20 text-center font-mono text-sm text-slate">Loading quiz player...</div>;
  }

  if (error || !quiz) {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center">
        <h2 className="font-display text-xl font-bold text-ink">{error || 'Quiz not found'}</h2>
        <Link to="/quizzes" className="mt-4 inline-block font-mono text-xs text-amber-dark underline">
          ← Back to Quizzes
        </Link>
      </div>
    );
  }

  const currentQ = quiz.questions[currentIndex];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Back Link */}
      <Link to="/quizzes" className="font-mono text-xs text-slate hover:text-ink">
        ← Back to Quizzes
      </Link>

      {/* Quiz Header Bar */}
      <div className="mt-4 rounded-xl bg-ink p-6 text-paper shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-paper/10">
        <div>
          <span className="font-mono text-xs font-semibold text-amber uppercase tracking-wide">
            {quiz.category} • {quiz.difficulty}
          </span>
          <h1 className="mt-1 font-display text-2xl font-bold">{quiz.title}</h1>
        </div>

        {!isSubmitted ? (
          <div className="flex items-center gap-4 bg-ink-light px-4 py-2 rounded-lg border border-paper/10">
            <span className="font-mono text-xs text-slate-light">Time Remaining:</span>
            <span className={`font-mono text-lg font-bold ${timeLeft < 120 ? 'text-rose-400 animate-pulse' : 'text-mint'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        ) : (
          <div className="rounded-lg bg-mint/20 px-4 py-2 border border-mint/40 font-mono text-mint text-sm font-bold">
            Score: {result?.score} / {result?.total} ({result?.percentage}%)
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {!isSubmitted ? (
        <div className="mt-8 rounded-xl bg-white p-8 shadow-md border border-slate/10">
          {/* Progress dots */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-xs font-semibold text-slate">
              Question {currentIndex + 1} of {quiz.questions.length}
            </span>
            <div className="flex gap-1.5">
              {quiz.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 w-6 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-amber w-8'
                      : answers[q.id] !== undefined
                      ? 'bg-mint'
                      : 'bg-slate/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Text */}
          <h2 className="font-display text-xl font-bold text-ink leading-snug">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="mt-6 space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = answers[currentQ.id] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-amber bg-amber/10 font-semibold text-ink shadow-sm'
                      : 'border-slate/20 bg-paper/30 hover:border-slate/40 hover:bg-paper/60 text-ink'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-mono font-bold ${
                      isSelected ? 'bg-amber text-ink' : 'bg-slate/20 text-slate'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="text-sm">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Nav Controls */}
          <div className="mt-8 pt-6 border-t border-slate/10 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="rounded px-4 py-2 font-mono text-xs font-semibold text-slate border border-slate/20 disabled:opacity-40 hover:bg-paper"
            >
              ← Previous
            </button>

            {currentIndex < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
                className="rounded bg-ink px-5 py-2 font-mono text-xs font-semibold text-paper hover:bg-ink-light"
              >
                Next Question →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="rounded bg-amber px-6 py-2 font-mono text-xs font-bold text-ink hover:bg-amber-dark shadow-md"
              >
                Submit Quiz ✓
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Breakdown View */
        <div className="mt-8 space-y-6">
          <div className="rounded-xl bg-ink p-8 text-paper shadow-lg border border-paper/10 text-center">
            <h2 className="font-display text-2xl font-bold">Quiz Performance Summary</h2>
            <div className="mt-4 flex items-center justify-center gap-8">
              <div>
                <span className="block font-mono text-xs text-slate-light">Total Score</span>
                <span className="font-display text-4xl font-extrabold text-amber">
                  {result.score} / {result.total}
                </span>
              </div>
              <div className="h-12 w-px bg-paper/10" />
              <div>
                <span className="block font-mono text-xs text-slate-light">Percentage</span>
                <span className="font-display text-4xl font-extrabold text-mint">
                  {result.percentage}%
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setAnswers({});
                  setResult(null);
                  setCurrentIndex(0);
                  setTimeLeft(quiz.timeLimit * 60);
                }}
                className="rounded bg-amber px-5 py-2 font-mono text-xs font-bold text-ink hover:bg-amber-dark"
              >
                Retake Quiz
              </button>
              <Link
                to="/quizzes"
                className="rounded border border-paper/20 px-5 py-2 font-mono text-xs font-semibold text-paper hover:border-paper"
              >
                Explore Other Quizzes
              </Link>
            </div>
          </div>

          {/* Breakdown Per Question */}
          <div className="rounded-xl bg-white p-8 shadow-sm border border-slate/10">
            <h3 className="font-display text-lg font-bold text-ink mb-6">Detailed Answer Key & Explanations</h3>
            <div className="space-y-6">
              {result.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-5 border ${
                    item.isCorrect ? 'border-mint/50 bg-mint/5' : 'border-rose-300 bg-rose-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate">
                      Question {idx + 1}
                    </span>
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        item.isCorrect ? 'bg-mint text-ink' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                    </span>
                  </div>

                  <h4 className="mt-2 font-display font-semibold text-ink">{item.question}</h4>

                  <div className="mt-3 text-xs font-mono space-y-1">
                    <p className="text-slate">
                      Your answer:{' '}
                      <strong className={item.isCorrect ? 'text-mint-dark' : 'text-rose-600'}>
                        {item.userAnswer !== undefined
                          ? quiz.questions[idx].options[item.userAnswer]
                          : 'Not Answered'}
                      </strong>
                    </p>
                    {!item.isCorrect && (
                      <p className="text-mint-dark font-semibold">
                        Correct answer: {quiz.questions[idx].options[item.correctIndex]}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 rounded bg-white p-3 text-xs text-slate-dark border border-slate/10 leading-relaxed font-sans">
                    <strong className="font-mono text-amber-dark">Explanation:</strong> {item.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
