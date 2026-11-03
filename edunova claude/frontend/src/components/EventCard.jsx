import { useState } from 'react';
import { formatDate, daysUntil } from '../utils';

const typeLabel = {
  hackathon: 'Hackathon',
  contest: 'Contest',
  'tech-talk': 'Tech Talk'
};

export default function EventCard({ event, registered, onRegister, onCancel, canAct }) {
  const [teamName, setTeamName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const remaining = daysUntil(event.registrationDeadline);
  const seatsLeft = event.capacity - event.registeredCount;
  const closed = new Date(event.registrationDeadline) < new Date();

  const submitRegistration = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onRegister(event.id, { teamName });
      setShowForm(false);
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not register right now');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="trace-card flex flex-col justify-between rounded-2xl bg-ink-light/80 p-6 shadow-xl border border-indigo-500/20 backdrop-blur-md">
      <div>
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 font-mono text-xs uppercase tracking-wide text-indigo-300 font-semibold">
            {typeLabel[event.type] || event.type}
          </span>
          {registered && (
            <span className="flex items-center gap-1.5 rounded-full bg-mint/15 border border-mint/30 px-3 py-1 font-mono text-xs text-mint font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <span className="h-2 w-2 rounded-full bg-mint animate-pulse" />
              Registered
            </span>
          )}
        </div>

        <h3 className="mt-4 font-display text-xl font-bold text-paper group-hover:text-mint transition-colors">{event.title}</h3>
        <p className="mt-2.5 text-xs leading-relaxed text-slate-light">{event.description}</p>

        {event.prize && (
          <p className="mt-3 font-mono text-xs font-bold text-mint flex items-center gap-1">
            <span>🏆</span> {event.prize}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-ink-soft/80 border border-indigo-500/20 px-3 py-1 font-mono text-[11px] text-paper/80">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-1.5 border-t border-indigo-500/15 pt-4 font-mono text-xs text-slate-light">
        <p className="text-paper/90">
          {formatDate(event.startDate)} → {formatDate(event.endDate)} · <span className="text-mint font-semibold">{event.mode}</span>
        </p>
        <p>{event.location}</p>
        <p className="text-xs font-semibold">
          {seatsLeft > 0 ? <span className="text-mint">{seatsLeft} seats left</span> : <span className="text-red-400">Full</span>}
          {remaining !== null && !closed && ` · registration closes in ${remaining}d`}
          {closed && ' · registration closed'}
        </p>
      </div>

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      <div className="mt-5">
        {registered ? (
          <button
            onClick={() => onCancel(event.id)}
            className="btn-interactive w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 font-mono text-xs text-red-400 hover:bg-red-500/20 hover:border-red-400"
          >
            Cancel registration
          </button>
        ) : showForm ? (
          <form onSubmit={submitRegistration} className="space-y-2.5">
            <input
              type="text"
              placeholder="Team name (optional)"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full rounded-xl bg-ink-soft/80 border border-indigo-500/30 px-3.5 py-2 text-xs text-paper outline-none focus:border-mint focus:ring-1 focus:ring-mint"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={busy}
                className="btn-interactive flex-1 rounded-xl bg-gradient-to-r from-amber to-mint px-4 py-2 font-mono text-xs font-bold text-white shadow-md hover:opacity-95 disabled:opacity-60"
              >
                {busy ? 'Registering…' : 'Confirm'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-paper/20 px-3 py-2 font-mono text-xs text-paper/70 hover:text-paper"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            disabled={closed || seatsLeft <= 0 || !canAct}
            onClick={() => (canAct ? setShowForm(true) : onRegister(event.id))}
            className="btn-interactive w-full rounded-xl bg-gradient-to-r from-amber via-amber-neon to-mint px-4 py-2.5 font-mono text-xs font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {closed ? 'Registration closed' : seatsLeft <= 0 ? 'Full' : canAct ? 'Register Now' : 'Log in to register'}
          </button>
        )}
      </div>
    </div>
  );
}
