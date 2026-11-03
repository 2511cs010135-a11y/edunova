import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils';

export default function Dashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [progress, setProgress] = useState({});
  const [quizResults, setQuizResults] = useState([]);
  const [focusData, setFocusData] = useState({ totalMinutes: 0, totalSessions: 0 });
  const [myTeamPosts, setMyTeamPosts] = useState([]);

  useEffect(() => {
    api.get('/events/mine/registrations').then((res) => setRegistrations(res.data)).catch(() => {});
    api.get('/roadmaps').then((res) => setRoadmaps(res.data)).catch(() => {});
    api.get('/quizzes/mine/results').then((res) => setQuizResults(res.data)).catch(() => {});
    api.get('/focus/logs').then((res) => setFocusData(res.data)).catch(() => {});
    api.get('/teams/mine/posts').then((res) => setMyTeamPosts(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (roadmaps.length === 0) return;
    Promise.all(
      roadmaps.map((r) =>
        api.get(`/roadmaps/${r.id}/progress`).then((res) => ({ id: r.id, data: res.data }))
      )
    ).then((results) => {
      const map = {};
      results.forEach(({ id, data }) => (map[id] = data.completedItems));
      setProgress(map);
    });
  }, [roadmaps]);

  const cancelReg = async (eventId) => {
    await api.delete(`/events/${eventId}/register`);
    setRegistrations((prev) => prev.filter((r) => r.eventId !== eventId));
  };

  const totalItems = (r) => r.milestones.reduce((sum, m) => sum + m.items.length, 0);

  const avgQuizScore =
    quizResults.length > 0
      ? Math.round(quizResults.reduce((sum, q) => sum + q.percentage, 0) / quizResults.length)
      : 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Welcome Banner */}
      <div className="rounded-2xl glass-panel p-8 text-paper shadow-2xl border border-indigo-500/25">
        <span className="inline-block font-mono text-xs font-semibold text-mint uppercase tracking-wider">
          Student Learning Dashboard
        </span>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}</span> 👋
        </h1>
        <p className="mt-2 text-slate-light text-xs max-w-xl leading-relaxed">
          Track your hackathon registrations, quiz scores, peer team posts, and daily focus study metrics all in one place.
        </p>

        {/* Top Summary Stat Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 pt-6 border-t border-indigo-500/15 font-mono text-xs">
          <div className="rounded-xl bg-ink-soft/80 p-4 border border-indigo-500/20 shadow-md">
            <span className="text-slate-light block text-[11px]">Events Registered</span>
            <span className="mt-1 font-display text-2xl font-extrabold text-amber">
              {registrations.length}
            </span>
          </div>

          <div className="rounded-xl bg-ink-soft/80 p-4 border border-indigo-500/20 shadow-md">
            <span className="text-slate-light block text-[11px]">Quizzes Completed</span>
            <span className="mt-1 font-display text-2xl font-extrabold text-mint">
              {quizResults.length} <span className="text-xs text-slate-light font-mono">({avgQuizScore}%)</span>
            </span>
          </div>

          <div className="rounded-xl bg-ink-soft/80 p-4 border border-indigo-500/20 shadow-md">
            <span className="text-slate-light block text-[11px]">Focus Minutes</span>
            <span className="mt-1 font-display text-2xl font-extrabold text-paper">
              {focusData.totalMinutes}m
            </span>
          </div>

          <div className="rounded-xl bg-ink-soft/80 p-4 border border-indigo-500/20 shadow-md">
            <span className="text-slate-light block text-[11px]">My Team Posts</span>
            <span className="mt-1 font-display text-2xl font-extrabold text-amber">
              {myTeamPosts.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Sections */}
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {/* Left Column: Registered Events & Team Posts */}
        <div className="space-y-8">
          {/* Registered Events */}
          <section className="rounded-2xl bg-ink-light/80 p-6 shadow-xl border border-indigo-500/20 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-paper">Registered Hackathons</h2>
              <Link to="/events" className="font-mono text-xs text-mint font-semibold hover:underline">
                Browse Events →
              </Link>
            </div>

            {registrations.length === 0 ? (
              <p className="mt-4 font-mono text-xs text-slate-light">
                No active event registrations. Join a hackathon or tech contest!
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {registrations.map((r) =>
                  r.event ? (
                    <div
                      key={r.id}
                      className="flex flex-col justify-between gap-2 rounded-xl bg-ink-soft/90 p-4 border border-indigo-500/15 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-display font-bold text-paper">{r.event.title}</p>
                        <p className="font-mono text-xs text-slate-light mt-0.5">
                          {formatDate(r.event.startDate)} · <span className="text-mint">{r.event.mode}</span>
                          {r.teamName ? ` · Team: ${r.teamName}` : ''}
                        </p>
                      </div>
                      <button
                        onClick={() => cancelReg(r.eventId)}
                        className="btn-interactive rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-xs text-red-400 hover:bg-red-500/20"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </section>

          {/* My Team Recruitment Posts */}
          <section className="rounded-2xl bg-ink-light/80 p-6 shadow-xl border border-indigo-500/20 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-paper">My Team Posts</h2>
              <Link to="/teams" className="font-mono text-xs text-mint font-semibold hover:underline">
                Team Finder →
              </Link>
            </div>

            {myTeamPosts.length === 0 ? (
              <p className="mt-4 font-mono text-xs text-slate-light">
                You haven't posted any team openings yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {myTeamPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-xl bg-ink-soft/90 p-4 border border-indigo-500/15"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-paper">{post.title}</h4>
                      <span className="font-mono text-[10px] bg-mint/20 text-mint border border-mint/30 px-2.5 py-0.5 rounded-full font-bold">
                        {post.applicants?.length || 0} Applicants
                      </span>
                    </div>
                    <p className="mt-1.5 font-mono text-xs text-slate-light">
                      Roles: <span className="text-amber">{post.roleNeeded}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Roadmap Checklist & Quiz History */}
        <div className="space-y-8">
          {/* Study Roadmap Progress */}
          <section className="rounded-2xl bg-ink-light/80 p-6 shadow-xl border border-indigo-500/20 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-paper">Roadmap Progress</h2>
              <Link to="/roadmaps" className="font-mono text-xs text-mint font-semibold hover:underline">
                View All →
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {roadmaps.map((r) => {
                const done = progress[r.id]?.length || 0;
                const total = totalItems(r);
                const pct = total ? Math.round((done / total) * 100) : 0;
                return (
                  <Link
                    key={r.id}
                    to={`/roadmaps/${r.id}`}
                    className="block rounded-xl bg-ink-soft/90 p-4 border border-indigo-500/15 hover:border-mint/50 transition-colors"
                  >
                    <div className="flex justify-between font-display font-bold text-sm text-paper">
                      <span>{r.title}</span>
                      <span className="font-mono text-xs text-mint font-bold">{pct}%</span>
                    </div>
                    <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-ink-soft border border-indigo-500/20">
                      <div className="h-full rounded-full bg-gradient-to-r from-amber to-mint shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${pct}%` }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Quiz Performance Summary */}
          <section className="rounded-2xl bg-ink-light/80 p-6 shadow-xl border border-indigo-500/20 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-paper">Recent Quiz Scorecards</h2>
              <Link to="/quizzes" className="font-mono text-xs text-mint font-semibold hover:underline">
                Take Quiz →
              </Link>
            </div>

            {quizResults.length === 0 ? (
              <p className="mt-4 font-mono text-xs text-slate-light">
                No quiz attempts yet. Test your web, AI, or DSA knowledge!
              </p>
            ) : (
              <div className="mt-4 space-y-2.5">
                {quizResults.slice(0, 4).map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between rounded-xl bg-ink-soft/90 p-3.5 text-xs font-mono border border-indigo-500/15"
                  >
                    <div>
                      <span className="font-bold text-paper block">{q.quizTitle}</span>
                      <span className="text-slate-light text-[11px]">
                        {q.score}/{q.total} correct
                      </span>
                    </div>
                    <span
                      className={`font-bold px-3 py-1 rounded-full ${
                        q.percentage >= 70
                          ? 'bg-mint/20 text-mint border border-mint/30'
                          : 'bg-amber/20 text-amber border border-amber/30'
                      }`}
                    >
                      {q.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
