import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pillars = [
  {
    label: '01',
    title: 'Hackathons & Tech Events',
    body: 'Browse EduNova-hosted hackathons, contests, and talks with 1-click registration and team matching.',
    link: '/events',
    badge: 'Events'
  },
  {
    label: '02',
    title: 'Live Contest Feed',
    body: 'Real-time feed of upcoming coding contests across Codeforces, CodeChef, LeetCode, and AtCoder.',
    link: '/contests',
    badge: 'Real-Time'
  },
  {
    label: '03',
    title: 'Guided Study Roadmaps',
    body: 'Milestone-based learning paths for Web Dev, AI/ML, DSA, and Mobile Apps with persistent checklist tracking.',
    link: '/roadmaps',
    badge: 'Roadmaps'
  },
  {
    label: '04',
    title: 'Smart Quizzes & Self-Assessment',
    body: 'Interactive timed quizzes with instant answer evaluation, detailed explanations, and score tracking.',
    link: '/quizzes',
    badge: 'Interactive'
  },
  {
    label: '05',
    title: 'Team & Peer Finder',
    body: 'Find hackathon teammates, join study sprint groups, and pitch projects to peer developers.',
    link: '/teams',
    badge: 'Networking'
  },
  {
    label: '06',
    title: 'Smart Revision & Flashcards',
    body: '3D active recall flashcards with self-grading and curated 1-click code cheat sheets.',
    link: '/resources',
    badge: 'Active Recall'
  },
  {
    label: '07',
    title: 'Focus Studio & Analytics',
    body: 'Pomodoro focus timer with Web Audio synthesized rain/binaural soundscapes and study streak logging.',
    link: '/focus',
    badge: 'Productivity'
  }
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-ink text-paper min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="bg-dot-grid absolute inset-0 opacity-30 pointer-events-none" />
        
        {/* Floating Glowing Ambient Circles */}
        <div className="absolute top-10 left-1/4 h-72 w-72 rounded-full bg-amber/20 blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-mint/15 blur-3xl pointer-events-none animate-float" />

        <div className="relative mx-auto max-w-6xl px-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-4 py-1.5 font-mono text-xs text-mint font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <span className="h-2 w-2 rounded-full bg-mint animate-ping" />
            EduNova · Next-Gen Smart Education System
          </span>

          <h1 className="mt-6 max-w-4xl font-display text-4xl font-extrabold leading-tight sm:text-6xl lg:text-7xl tracking-tight">
            Learn with structure. <br />
            <span className="gradient-text drop-shadow-[0_0_25px_rgba(99,102,241,0.4)]">
              Collaborate & Compete with purpose.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-paper/85 text-base sm:text-xl leading-relaxed font-body">
            The all-in-one Smart Education hub: structured study roadmaps, live coding contest feeds, hackathons with team finder, interactive quizzes, active recall flashcards, and focus soundscapes.
          </p>

          {!user ? (
            <div className="mt-10 rounded-2xl glass-panel p-6 max-w-xl shadow-2xl border border-indigo-500/30 transition-all hover:border-mint/50 hover:shadow-[0_0_35px_rgba(6,182,212,0.2)]">
              <p className="font-mono text-xs text-mint flex items-center gap-2.5 font-semibold">
                <span className="animate-pulse">🔒</span> Authentication required to unlock full interactive access to all 7 modules.
              </p>
              <div className="mt-5 flex flex-wrap gap-4 font-mono text-sm">
                <Link
                  to="/login"
                  className="btn-interactive rounded-xl bg-gradient-to-r from-amber via-amber-neon to-mint px-7 py-3 font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:opacity-95"
                >
                  Log In to Access →
                </Link>
                <Link
                  to="/signup"
                  className="btn-interactive rounded-xl border border-indigo-400/30 bg-ink-light/50 px-7 py-3 text-paper hover:border-mint hover:text-mint"
                >
                  Create Account
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-10 flex flex-wrap gap-4 font-mono text-sm">
              <Link
                to="/dashboard"
                className="btn-interactive rounded-xl bg-gradient-to-r from-amber via-amber-neon to-mint px-7 py-3.5 font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]"
              >
                Go to Dashboard →
              </Link>
              <Link
                to="/quizzes"
                className="btn-interactive rounded-xl bg-mint/15 border border-mint/40 px-7 py-3.5 font-semibold text-mint hover:bg-mint hover:text-ink"
              >
                Start Smart Quiz
              </Link>
              <Link
                to="/roadmaps"
                className="btn-interactive rounded-xl border border-paper/20 bg-ink-light/40 px-7 py-3.5 text-paper hover:border-indigo-400 hover:text-indigo-400"
              >
                Study Roadmaps
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="ruled-divider pb-6 flex items-center justify-between border-b border-indigo-500/20">
          <div>
            <h2 className="font-display text-3xl font-bold text-paper tracking-tight">
              Smart Education <span className="gradient-text">Ecosystem</span>
            </h2>
            <p className="text-xs text-slate-light font-mono mt-1.5">
              7 integrated modules · {user ? 'All modules unlocked' : 'Login required to access'}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <Link
              key={p.label}
              to={p.link}
              className="group trace-card rounded-2xl bg-ink-light/80 p-7 shadow-lg border border-indigo-500/20 hover:border-indigo-400/60 hover:shadow-[0_12px_30px_rgba(99,102,241,0.25)] transition-all duration-300 flex flex-col justify-between backdrop-blur-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-mint group-hover:scale-110 transition-transform">{p.label}</span>
                  <span className="font-mono text-[10px] bg-indigo-500/15 border border-indigo-500/30 px-3 py-0.5 rounded-full font-bold text-indigo-300 group-hover:border-mint/50 group-hover:text-mint transition-colors">
                    {p.badge}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-paper group-hover:text-mint transition-colors flex items-center justify-between">
                  <span>{p.title}</span>
                  {!user && <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity" title="Login Required">🔒</span>}
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-light group-hover:text-paper/90 transition-colors">{p.body}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-indigo-500/15 font-mono text-xs font-semibold text-mint flex items-center justify-between">
                <span className="group-hover:translate-x-0.5 transition-transform">{user ? 'Explore Module' : 'Login to Access'}</span>
                <span className="transform group-hover:translate-x-2 transition-transform font-bold">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
