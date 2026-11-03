import { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Focus() {
  const { user } = useAuth();
  
  // Timer preset modes (in minutes)
  const MODES = {
    pomodoro: { name: 'Focus Sprint', duration: 25 },
    shortBreak: { name: 'Short Refresh', duration: 5 },
    longBreak: { name: 'Deep Break', duration: 15 }
  };

  const [mode, setMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [studyTopic, setStudyTopic] = useState('');
  
  // Sound synthesizer state
  const [soundMode, setSoundMode] = useState('none'); // 'none' | 'rain' | 'focusTone' | 'whiteNoise'
  const [volume, setVolume] = useState(0.5);

  // Focus history logs
  const [focusStats, setFocusStats] = useState({ totalMinutes: 0, totalSessions: 0, logs: [] });

  // Web Audio Context refs
  const audioCtxRef = useRef(null);
  const soundNodesRef = useRef([]);

  useEffect(() => {
    if (user) {
      fetchFocusLogs();
    }
  }, [user]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    updateSoundscape();
    return () => stopSoundscape();
  }, [soundMode, volume]);

  const fetchFocusLogs = async () => {
    try {
      const res = await api.get('/focus/logs');
      setFocusStats(res.data);
    } catch (err) {
      console.error('Failed to fetch focus logs', err);
    }
  };

  const handleModeChange = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration * 60);
  };

  const handleSessionComplete = async () => {
    const minutesCompleted = MODES[mode].duration;
    alert(`🎉 Session Completed! You logged ${minutesCompleted} focus minutes.`);
    
    if (user) {
      try {
        await api.post('/focus/logs', {
          durationMinutes: minutesCompleted,
          topic: studyTopic || 'General Focus Session',
          mode: MODES[mode].name
        });
        fetchFocusLogs();
      } catch (err) {
        console.error('Failed to log focus session', err);
      }
    }
  };

  // Soundscape Synthesizer via Web Audio API
  const stopSoundscape = () => {
    soundNodesRef.current.forEach((node) => {
      try {
        node.stop && node.stop();
        node.disconnect && node.disconnect();
      } catch (e) {}
    });
    soundNodesRef.current = [];
  };

  const updateSoundscape = () => {
    stopSoundscape();
    if (soundMode === 'none') return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
      masterGain.connect(ctx.destination);

      if (soundMode === 'focusTone') {
        // Deep binaural sine wave (108Hz + 114Hz)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.frequency.setValueAtTime(108, ctx.currentTime);
        osc2.frequency.setValueAtTime(114, ctx.currentTime);
        osc1.connect(masterGain);
        osc2.connect(masterGain);
        osc1.start();
        osc2.start();
        soundNodesRef.current.push(osc1, osc2);
      } else if (soundMode === 'rain' || soundMode === 'whiteNoise') {
        // Noise buffer generator
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        if (soundMode === 'rain') {
          // Lowpass filter to emulate rain sound
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, ctx.currentTime);
          whiteNoise.connect(filter);
          filter.connect(masterGain);
        } else {
          whiteNoise.connect(masterGain);
        }

        whiteNoise.start();
        soundNodesRef.current.push(whiteNoise);
      }
    } catch (e) {
      console.warn('Audio Synthesis not supported or allowed', e);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const totalPossible = MODES[mode].duration * 60;
  const progressPercent = Math.round(((totalPossible - timeLeft) / totalPossible) * 100);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Header Banner */}
      <div className="rounded-2xl glass-panel p-8 text-paper shadow-2xl border border-indigo-500/25">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="inline-block font-mono text-xs font-semibold uppercase tracking-wider text-mint">
              Productivity & Focus Studio
            </span>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Focus Studio & <span className="gradient-text">Analytics</span>
            </h1>
            <p className="mt-2 text-slate-light max-w-xl text-xs leading-relaxed">
              Eliminate distractions with customizable Pomodoro sessions, offline ambient soundscapes, and study time tracking.
            </p>
          </div>

          {user && (
            <div className="rounded-xl bg-ink-soft/80 p-4 border border-indigo-500/20 text-center md:text-right min-w-[200px]">
              <span className="font-mono text-xs text-slate-light">Total Focused Study</span>
              <div className="mt-1 text-3xl font-extrabold text-amber font-display">
                {focusStats.totalMinutes} Mins
              </div>
              <p className="text-xs text-paper/70 font-mono mt-0.5">
                {focusStats.totalSessions} Sessions Logged
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Timer Section */}
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {/* Timer Box */}
        <div className="md:col-span-2 rounded-2xl bg-ink-light/80 p-8 border border-indigo-500/20 shadow-2xl backdrop-blur-md flex flex-col items-center justify-between text-center">
          {/* Mode Selector */}
          <div className="flex rounded-xl bg-ink-soft p-1.5 font-mono text-xs w-full max-w-md justify-between border border-indigo-500/20">
            {Object.keys(MODES).map((mKey) => (
              <button
                key={mKey}
                onClick={() => handleModeChange(mKey)}
                className={`btn-interactive flex-1 rounded-lg py-2 font-bold transition-all ${
                  mode === mKey ? 'bg-gradient-to-r from-amber to-mint text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]' : 'text-slate-light hover:text-paper'
                }`}
              >
                {MODES[mKey].name}
              </button>
            ))}
          </div>

          {/* Radial Clock Display */}
          <div className="my-10 relative grid place-items-center">
            <div className="font-mono text-6xl sm:text-7xl font-extrabold text-paper tracking-tight font-display drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              {formatTime(timeLeft)}
            </div>
            <span className="mt-3 font-mono text-xs font-semibold text-mint uppercase tracking-widest">
              {MODES[mode].name} • {progressPercent}% Progress
            </span>
          </div>

          {/* Topic Input */}
          <input
            type="text"
            placeholder="What topic are you studying right now?"
            value={studyTopic}
            onChange={(e) => setStudyTopic(e.target.value)}
            className="w-full max-w-md rounded-xl bg-ink-soft/90 px-4 py-2.5 text-xs text-paper placeholder-slate-light border border-indigo-500/25 focus:outline-none focus:border-mint font-mono text-center mb-6"
          />

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`btn-interactive rounded-xl px-8 py-3.5 font-mono text-xs font-bold shadow-xl transition-all ${
                isRunning
                  ? 'bg-rose-500/90 text-white hover:bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                  : 'bg-gradient-to-r from-amber via-amber-neon to-mint text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
              }`}
            >
              {isRunning ? 'Pause ⏸' : 'Start Focus Session ▶'}
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(MODES[mode].duration * 60);
              }}
              className="btn-interactive rounded-xl border border-indigo-500/20 bg-ink-soft px-5 py-3.5 font-mono text-xs text-slate-light hover:text-paper font-semibold"
            >
              Reset ↺
            </button>
          </div>
        </div>

        {/* Ambient Soundscapes & Controls */}
        <div className="rounded-2xl bg-ink-light/80 p-6 text-paper border border-indigo-500/20 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <span className="font-mono text-xs font-bold text-mint uppercase tracking-wide">
              Web Audio Soundscapes
            </span>
            <h3 className="mt-1 font-display text-xl font-bold">Ambient Focus Sounds</h3>
            <p className="mt-1 text-xs text-slate-light">
              Synthesized offline audio designed to improve deep work concentration.
            </p>

            <div className="mt-6 space-y-2.5">
              {[
                { id: 'none', label: '🔇 Silent Mode' },
                { id: 'rain', label: '🌧️ Focus Rain (Lowpass)' },
                { id: 'focusTone', label: '🎧 Deep Binaural Tone (108Hz)' },
                { id: 'whiteNoise', label: '📻 White Noise' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSoundMode(s.id)}
                  className={`btn-interactive w-full text-left p-3 rounded-xl font-mono text-xs font-semibold transition-all border ${
                    soundMode === s.id
                      ? 'border-mint bg-mint/15 text-mint shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'border-indigo-500/15 bg-ink-soft/50 text-slate-light hover:border-indigo-500/30'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Volume Slider */}
            {soundMode !== 'none' && (
              <div className="mt-6 pt-4 border-t border-indigo-500/15">
                <div className="flex items-center justify-between font-mono text-xs text-slate-light mb-2">
                  <span>Soundscape Volume</span>
                  <span className="text-mint font-bold">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-mint cursor-pointer"
                />
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-500/15 font-mono text-[11px] text-slate-light">
            💡 Tip: 25 min focus + 5 min break builds long-term mental stamina.
          </div>
        </div>
      </div>

      {/* Session History Log */}
      {user && focusStats.logs.length > 0 && (
        <div className="mt-12">
          <h3 className="font-display text-xl font-bold text-paper">Recent Study Logs</h3>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-indigo-500/20 bg-ink-light/80 shadow-xl backdrop-blur-md">
            <table className="w-full text-left text-sm text-paper">
              <thead className="bg-ink-soft/90 font-mono text-xs text-slate-light uppercase border-b border-indigo-500/20">
                <tr>
                  <th className="px-6 py-3.5">Topic Studied</th>
                  <th className="px-6 py-3.5">Mode</th>
                  <th className="px-6 py-3.5">Duration</th>
                  <th className="px-6 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-500/10 font-mono text-xs">
                {focusStats.logs.slice(0, 5).map((log) => (
                  <tr key={log.id} className="hover:bg-indigo-500/10 transition-colors">
                    <td className="px-6 py-4 font-semibold text-paper">{log.topic}</td>
                    <td className="px-6 py-4 text-mint">{log.mode}</td>
                    <td className="px-6 py-4 text-amber font-bold">{log.durationMinutes} Mins</td>
                    <td className="px-6 py-4 text-slate-light">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
