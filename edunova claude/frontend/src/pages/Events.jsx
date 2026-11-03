import { useEffect, useState } from 'react';
import api from '../api';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'hackathon', label: 'Hackathons' },
  { key: 'contest', label: 'Contests' },
  { key: 'tech-talk', label: 'Tech Talks' }
];

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [myRegs, setMyRegs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    setLoading(true);
    const res = await api.get('/events');
    setEvents(res.data);
    setLoading(false);
  };

  const loadMyRegs = async () => {
    if (!user) {
      setMyRegs([]);
      return;
    }
    const res = await api.get('/events/mine/registrations');
    setMyRegs(res.data.map((r) => r.eventId));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    loadMyRegs();
  }, [user]);

  const handleRegister = async (eventId, payload) => {
    await api.post(`/events/${eventId}/register`, payload);
    await Promise.all([loadEvents(), loadMyRegs()]);
  };

  const handleCancel = async (eventId) => {
    await api.delete(`/events/${eventId}/register`);
    await Promise.all([loadEvents(), loadMyRegs()]);
  };

  const visible = filter === 'all' ? events : events.filter((e) => e.type === filter);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <span className="inline-block font-mono text-xs text-mint font-semibold uppercase tracking-wider">Hackathons & Tech Events</span>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-paper tracking-tight">
        Find your next thing to <span className="gradient-text">build & pitch</span>
      </h1>
      <p className="mt-3 max-w-2xl text-slate-light text-sm leading-relaxed">
        EduNova-hosted hackathons, contests, and technical keynotes. Register with a single click and assemble your hackathon team.
      </p>

      <div className="mt-8 flex flex-wrap gap-2.5">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`btn-interactive rounded-full px-5 py-2 font-mono text-xs transition-all ${
              filter === f.key
                ? 'bg-gradient-to-r from-amber via-amber-neon to-mint font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                : 'bg-ink-light/80 text-slate-light border border-indigo-500/20 hover:border-mint/40 hover:text-paper'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-16 text-center font-mono text-sm text-mint flex items-center justify-center gap-2">
          <span className="h-3 w-3 rounded-full bg-mint animate-ping" />
          Loading events feed…
        </div>
      ) : visible.length === 0 ? (
        <p className="mt-12 font-mono text-sm text-slate-light">No events in this category yet.</p>
      ) : (
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              registered={myRegs.includes(event.id)}
              canAct={!!user}
              onRegister={handleRegister}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
