import { useEffect, useState } from 'react';
import api from '../api';
import RoadmapCard from '../components/RoadmapCard';
import { useAuth } from '../context/AuthContext';

export default function Roadmaps() {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    api.get('/roadmaps').then((res) => setRoadmaps(res.data));
  }, []);

  useEffect(() => {
    if (!user || roadmaps.length === 0) return;
    Promise.all(
      roadmaps.map((r) =>
        api.get(`/roadmaps/${r.id}/progress`).then((res) => ({ id: r.id, data: res.data }))
      )
    ).then((results) => {
      const map = {};
      results.forEach(({ id, data }) => {
        map[id] = data.completedItems;
      });
      setProgress(map);
    });
  }, [user, roadmaps]);

  const totalItems = (r) => r.milestones.reduce((sum, m) => sum + m.items.length, 0);
  const pct = (r) => {
    const done = progress[r.id]?.length || 0;
    const total = totalItems(r);
    return total ? Math.round((done / total) * 100) : 0;
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <span className="inline-block font-mono text-xs text-mint font-semibold uppercase tracking-wider">Guided Study Roadmaps</span>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-paper tracking-tight">
        Know exactly what to <span className="gradient-text">learn & ship next</span>
      </h1>
      <p className="mt-3 max-w-2xl text-slate-light text-sm leading-relaxed">
        Milestone-based learning paths with persistent checklist tracking. Check items off as you learn and pick up where you left off.
      </p>

      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {roadmaps.map((r) => (
          <RoadmapCard key={r.id} roadmap={r} progressPct={user ? pct(r) : undefined} />
        ))}
      </div>
    </div>
  );
}
