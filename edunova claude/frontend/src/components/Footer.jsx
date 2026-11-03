export default function Footer() {
  return (
    <footer className="mt-24 border-t border-indigo-500/15 bg-ink/90 backdrop-blur-md text-paper/60">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5 font-display text-paper font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-tr from-amber to-mint font-mono text-xs font-bold text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]">
              EN
            </span>
            <span>Edu<span className="text-mint">Nova</span></span>
          </div>
          <p className="font-mono text-xs text-mint/80">Learn. Build. Compete.</p>
        </div>
        <p className="mt-6 text-xs text-slate-light">
          © {new Date().getFullYear()} EduNova. A next-gen smart education platform built for collaborative learning.
        </p>
      </div>
    </footer>
  );
}
