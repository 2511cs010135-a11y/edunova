import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to authenticate as Admin. Please check credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillDefaultAdmin = () => {
    setEmail('admin@edunova.com');
    setPassword('admin123');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-amber/30 bg-slate-900/90 p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(245,158,11,0.15)]">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber to-amber-neon text-3xl text-white shadow-lg shadow-amber/30">
            ⚡
          </div>
          <h2 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Admin Portal
          </h2>
          <p className="font-mono text-xs text-paper/60">
            Restricted System Administrator Access
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-center font-mono text-xs text-red-300">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-mono text-xs text-paper/80 mb-1">
              Administrator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@edunova.com"
              className="w-full rounded-xl border border-indigo-500/30 bg-slate-950/80 px-4 py-2.5 font-mono text-sm text-white placeholder-paper/40 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber transition-all"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-paper/80 mb-1">
              Admin Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-indigo-500/30 bg-slate-950/80 px-4 py-2.5 font-mono text-sm text-white placeholder-paper/40 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-amber to-amber-neon py-3 font-mono text-sm font-bold text-white shadow-lg shadow-amber/25 hover:opacity-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In as Administrator'}
          </button>
        </form>

        {/* Demo Helper Banner */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber">🔑 Default Admin Account</span>
            <button
              onClick={handleQuickFillDefaultAdmin}
              className="text-[10px] text-mint hover:underline"
            >
              Fill Credentials
            </button>
          </div>
          <p className="text-[11px] text-paper/70">
            Email: <code className="text-white">admin@edunova.com</code>
            <br />
            Password: <code className="text-white">admin123</code>
          </p>
        </div>

        <div className="text-center pt-2 border-t border-white/5">
          <Link to="/login" className="font-mono text-xs text-paper/50 hover:text-paper">
            ← Return to Student Login
          </Link>
        </div>
      </div>
    </div>
  );
}
