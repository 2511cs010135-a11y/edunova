export default function TeamCard({ team, onApply }) {
  return (
    <div className="group trace-card flex flex-col justify-between rounded-2xl bg-ink-light/80 p-6 text-paper shadow-xl border border-indigo-500/20 backdrop-blur-md hover:border-mint/50 transition-all duration-300">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-mint/15 border border-mint/30 px-3 py-1 font-mono text-xs font-semibold text-mint">
            {team.eventTitle || 'General Project'}
          </span>
          <span className="font-mono text-xs text-slate-light">
            Posted by <strong className="text-paper">{team.userName}</strong>
          </span>
        </div>

        <h3 className="mt-4 font-display text-xl font-bold text-paper group-hover:text-mint transition-colors">{team.title}</h3>

        <div className="mt-3.5 rounded-xl bg-ink-soft/90 p-3.5 text-xs font-mono border border-indigo-500/20">
          <span className="text-amber font-bold">Roles Needed:</span> <span className="text-paper/90">{team.roleNeeded}</span>
        </div>

        <p className="mt-3.5 text-xs leading-relaxed text-slate-light whitespace-pre-line">{team.description}</p>

        {team.skills && team.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {team.skills.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-full bg-indigo-500/15 border border-indigo-500/20 px-3 py-1 font-mono text-[11px] text-indigo-300 font-semibold"
              >
                #{skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-indigo-500/15 pt-4 text-xs font-mono">
        <span className="text-slate-light">
          {new Date(team.createdAt).toLocaleDateString()}
        </span>

        <button
          onClick={() => onApply(team)}
          className="btn-interactive rounded-xl bg-gradient-to-r from-amber to-mint px-4 py-2 font-mono text-xs font-bold text-white shadow-[0_0_12px_rgba(99,102,241,0.4)] hover:opacity-95"
        >
          Connect / Join Team →
        </button>
      </div>
    </div>
  );
}
