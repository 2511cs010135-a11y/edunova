import { Link } from 'react-router-dom';

export default function RoadmapCard({ roadmap, progressPct }) {
  return (
    <Link
      to={`/roadmaps/${roadmap.id}`}
      className="group trace-card flex flex-col justify-between rounded-2xl bg-ink-light/80 p-6 shadow-xl border border-indigo-500/20 backdrop-blur-md hover:border-mint/50 transition-all duration-300"
    >
      <div>
        <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 font-mono text-[11px] text-mint font-semibold">
          {roadmap.level}
        </span>
        <h3 className="mt-4 font-display text-xl font-bold text-paper group-hover:text-mint transition-colors">
          {roadmap.title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-light">{roadmap.summary}</p>
      </div>

      <div className="mt-6 pt-3 border-t border-indigo-500/15">
        <div className="flex justify-between font-mono text-xs text-slate-light">
          <span>{roadmap.milestones.length} milestones</span>
          {typeof progressPct === 'number' && <span className="text-mint font-bold">{progressPct}% complete</span>}
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-soft border border-indigo-500/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber via-amber-neon to-mint shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-500"
            style={{ width: `${progressPct || 0}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
