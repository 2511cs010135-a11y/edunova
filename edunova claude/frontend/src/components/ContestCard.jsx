import { formatDateTime, formatDuration, daysUntil } from '../utils';

export default function ContestCard({ contest }) {
  const remaining = daysUntil(contest.startTime);

  return (
    <a
      href={contest.url}
      target="_blank"
      rel="noreferrer"
      className="group trace-card block rounded-2xl bg-ink-light/80 p-6 shadow-xl border border-indigo-500/20 backdrop-blur-md hover:border-mint/50 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 font-mono text-xs uppercase tracking-wide text-mint font-semibold">
            {contest.platform}
          </span>
          {remaining !== null && remaining <= 3 ? (
            <span className="flex items-center gap-1.5 rounded-full bg-amber/20 border border-amber/40 px-3 py-1 font-mono text-xs text-amber font-bold animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" />
              in {remaining}d
            </span>
          ) : (
            <span className="text-xs text-slate-light font-mono">Upcoming</span>
          )}
        </div>
        <h4 className="mt-4 font-display text-lg font-bold leading-snug text-paper group-hover:text-mint transition-colors">
          {contest.name}
        </h4>
      </div>

      <div className="mt-5 pt-3 border-t border-indigo-500/15 flex items-center justify-between font-mono text-xs text-slate-light">
        <div>
          <p className="text-paper/80 font-medium">{formatDateTime(contest.startTime)}</p>
          <p className="text-mint/90 font-semibold">Duration: {formatDuration(contest.durationSeconds)}</p>
        </div>
        <span className="transform group-hover:translate-x-1.5 transition-transform text-mint font-bold text-base">→</span>
      </div>
    </a>
  );
}
