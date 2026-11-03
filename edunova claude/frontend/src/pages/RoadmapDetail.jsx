import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function RoadmapDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/roadmaps/${id}`).then((res) => setRoadmap(res.data));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    api.get(`/roadmaps/${id}/progress`).then((res) => setCompleted(res.data.completedItems));
  }, [id, user]);

  const toggle = async (item) => {
    if (!user) return;
    const next = completed.includes(item)
      ? completed.filter((i) => i !== item)
      : [...completed, item];
    setCompleted(next);
    setSaving(true);
    try {
      await api.put(`/roadmaps/${id}/progress`, { completedItems: next });
    } finally {
      setSaving(false);
    }
  };

  if (!roadmap) {
    return <p className="mx-auto max-w-3xl px-6 py-14 font-mono text-sm text-slate">Loading…</p>;
  }

  const totalItems = roadmap.milestones.reduce((sum, m) => sum + m.items.length, 0);
  const pct = totalItems ? Math.round((completed.length / totalItems) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <Link to="/roadmaps" className="font-mono text-xs text-slate hover:text-ink">
        ← All roadmaps
      </Link>
      <p className="mt-4 font-mono text-sm text-amber-dark">{roadmap.level}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">{roadmap.title}</h1>
      <p className="mt-2 text-slate">{roadmap.summary}</p>

      {user ? (
        <div className="mt-6">
          <div className="flex justify-between font-mono text-xs text-slate">
            <span>Your progress</span>
            <span>{pct}%{saving ? ' · saving…' : ''}</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-mint transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      ) : (
        <p className="mt-6 rounded-md bg-white p-3 font-mono text-xs text-slate">
          <Link to="/login" className="text-amber-dark">
            Log in
          </Link>{' '}
          to save your progress on this roadmap.
        </p>
      )}

      <div className="mt-10 space-y-8">
        {roadmap.milestones.map((m, idx) => (
          <div key={m.id} className="trace-card rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-amber-dark">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-lg font-semibold text-ink">{m.title}</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {m.items.map((item) => (
                <li key={item}>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-slate">
                    <input
                      type="checkbox"
                      checked={completed.includes(item)}
                      onChange={() => toggle(item)}
                      disabled={!user}
                      className="mt-0.5 h-4 w-4 rounded border-slate/40 text-mint focus:ring-mint"
                    />
                    <span className={completed.includes(item) ? 'text-ink line-through' : ''}>
                      {item}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
