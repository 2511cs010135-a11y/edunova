import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/events', label: 'Hackathons' },
  { to: '/contests', label: 'Live Contests' },
  { to: '/roadmaps', label: 'Roadmaps' },
  { to: '/quizzes', label: 'Quizzes' },
  { to: '/teams', label: 'Team Finder' },
  { to: '/resources', label: 'Resources' },
  { to: '/focus', label: 'Focus Studio' }
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-indigo-500/15 bg-ink/95 backdrop-blur-md text-paper transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-center gap-2.5 font-display text-xl font-bold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-tr from-amber via-amber-neon to-mint font-mono text-sm font-bold text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]">
            EN
          </span>
          <span className="tracking-tight transition-all group-hover:text-mint group-hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
            Edu<span className="text-mint font-extrabold">Nova</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link-hover flex items-center gap-1.5 font-mono text-sm tracking-tight transition-colors py-1 ${
                  isActive ? 'text-mint font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]' : 'text-paper/75 hover:text-mint'
                }`
              }
            >
              {item.label}
              {!user && (
                <span className="text-[10px] opacity-60 transition-transform group-hover:scale-110" title="Login Required">
                  🔒
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 rounded-lg border border-amber/40 bg-gradient-to-r from-amber/20 to-orange-500/20 px-3.5 py-1.5 font-mono text-sm font-bold text-amber hover:border-amber hover:text-white transition-all shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                >
                  <span>⚡</span>
                  <span>Admin Panel</span>
                </Link>
              )}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-lg bg-indigo-500/10 px-3.5 py-1.5 font-mono text-sm text-paper hover:bg-indigo-500/25 hover:text-mint border border-indigo-500/30 transition-all duration-200 shadow-sm"
              >
                <span className="h-2 w-2 rounded-full bg-mint animate-pulse"></span>
                <span>{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn-interactive rounded-lg border border-paper/20 px-3.5 py-1.5 text-sm hover:border-mint hover:text-mint"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-mono text-paper/80 hover:text-mint transition-colors px-2 py-1"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="btn-interactive rounded-lg bg-gradient-to-r from-amber to-amber-neon px-5 py-2 text-sm font-bold text-white hover:opacity-95 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
      <nav className="flex gap-4 overflow-x-auto border-t border-indigo-500/10 px-6 py-2 md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-1 whitespace-nowrap font-mono text-xs ${
                isActive ? 'text-mint font-bold' : 'text-paper/60 hover:text-paper'
              }`
            }
          >
            {item.label}
            {!user && <span className="text-[9px] opacity-60">🔒</span>}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
