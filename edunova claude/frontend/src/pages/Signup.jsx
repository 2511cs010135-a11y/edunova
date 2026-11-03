import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signup(form.name, form.email, form.password, form.college);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not create your account');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-2xl glass-panel p-8 text-paper shadow-2xl border border-indigo-500/25">
        <span className="inline-block font-mono text-xs font-semibold text-mint uppercase tracking-wider">Join EduNova</span>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-paper">Create your <span className="gradient-text">account</span></h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 font-mono text-xs">
          <div>
            <label className="text-slate-light">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Shashank"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1.5 w-full rounded-xl bg-ink-soft/90 border border-indigo-500/25 px-3.5 py-2.5 text-xs text-paper outline-none focus:border-mint focus:ring-1 focus:ring-mint"
            />
          </div>
          <div>
            <label className="text-slate-light">Email Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. shashank@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1.5 w-full rounded-xl bg-ink-soft/90 border border-indigo-500/25 px-3.5 py-2.5 text-xs text-paper outline-none focus:border-mint focus:ring-1 focus:ring-mint"
            />
          </div>
          <div>
            <label className="text-slate-light">College / University (optional)</label>
            <input
              type="text"
              placeholder="e.g. Malla Reddy University"
              value={form.college}
              onChange={(e) => setForm({ ...form, college: e.target.value })}
              className="mt-1.5 w-full rounded-xl bg-ink-soft/90 border border-indigo-500/25 px-3.5 py-2.5 text-xs text-paper outline-none focus:border-mint focus:ring-1 focus:ring-mint"
            />
          </div>
          <div>
            <label className="text-slate-light">Password *</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1.5 w-full rounded-xl bg-ink-soft/90 border border-indigo-500/25 px-3.5 py-2.5 text-xs text-paper outline-none focus:border-mint focus:ring-1 focus:ring-mint"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="btn-interactive w-full rounded-xl bg-gradient-to-r from-amber via-amber-neon to-mint px-4 py-3 font-mono text-xs font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:opacity-95 disabled:opacity-60"
          >
            {busy ? 'Creating account…' : 'Create Free Account →'}
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-light text-center font-mono">
          Already have an account?{' '}
          <Link to="/login" className="text-mint font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
