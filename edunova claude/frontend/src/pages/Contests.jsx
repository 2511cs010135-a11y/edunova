import { useEffect, useState } from 'react';
import api from '../api';
import ContestCard from '../components/ContestCard';

export default function Contests() {
  const [contests, setContests] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | unavailable

  useEffect(() => {
    api
      .get('/contests')
      .then((res) => {
        setContests(res.data.contests || []);
        setStatus(res.data.error ? 'unavailable' : 'ok');
      })
      .catch(() => setStatus('unavailable'));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <span className="inline-block font-mono text-xs text-mint font-semibold uppercase tracking-wider">Live Contest Feed</span>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-paper tracking-tight">
        Upcoming coding contests, <span className="gradient-text">pulled live</span>
      </h1>
      <p className="mt-3 max-w-2xl text-slate-light text-sm leading-relaxed">
        Real-time feed aggregating upcoming algorithmic contests across Codeforces, CodeChef, LeetCode, AtCoder, HackerEarth, and more.
      </p>

      {status === 'loading' && (
        <div className="mt-16 text-center font-mono text-sm text-mint flex items-center justify-center gap-2">
          <span className="h-3 w-3 rounded-full bg-mint animate-ping" />
          Fetching live contest schedule…
        </div>
      )}

      {status === 'unavailable' && (
        <p className="mt-12 font-mono text-sm text-slate-light">
          The live contest feed is temporarily unavailable. Check back shortly.
        </p>
      )}

      {status === 'ok' && contests.length === 0 && (
        <p className="mt-12 font-mono text-sm text-slate-light">No upcoming contests right now.</p>
      )}

      {status === 'ok' && contests.length > 0 && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contests.map((c) => (
            <ContestCard key={`${c.platform}-${c.name}-${c.startTime}`} contest={c} />
          ))}
        </div>
      )}
    </div>
  );
}
