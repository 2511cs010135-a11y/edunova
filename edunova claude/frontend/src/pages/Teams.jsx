import { useState, useEffect } from 'react';
import api from '../api';
import TeamCard from '../components/TeamCard';
import { useAuth } from '../context/AuthContext';

export default function Teams() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedEvent, setSelectedEvent] = useState('All');
  const [search, setSearch] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTeamToApply, setSelectedTeamToApply] = useState(null);

  // Form states for creating a team post
  const [newTitle, setNewTitle] = useState('');
  const [newEventId, setNewEventId] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newContact, setNewContact] = useState('');

  // Form states for applying
  const [applyMessage, setApplyMessage] = useState('');
  const [applyContact, setApplyContact] = useState('');

  useEffect(() => {
    fetchTeams();
    fetchEvents();
  }, [selectedEvent, search]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedEvent !== 'All') params.eventId = selectedEvent;
      if (search) params.search = search;
      const res = await api.get('/teams', { params });
      setTeams(res.data);
    } catch (err) {
      console.error('Failed to fetch team posts', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to post a team recruitment listing.');
      return;
    }

    try {
      await api.post('/teams', {
        title: newTitle,
        eventId: newEventId || null,
        roleNeeded: newRole,
        skills: newSkills,
        description: newDescription,
        contact: newContact
      });

      setShowCreateModal(false);
      // Reset form
      setNewTitle('');
      setNewEventId('');
      setNewRole('');
      setNewSkills('');
      setNewDescription('');
      setNewContact('');

      fetchTeams();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create team post.');
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a join request.');
      return;
    }

    try {
      await api.post(`/teams/${selectedTeamToApply.id}/apply`, {
        message: applyMessage,
        contactInfo: applyContact || user.email
      });

      alert('Application sent successfully! The post owner can see your message.');
      setSelectedTeamToApply(null);
      setApplyMessage('');
      setApplyContact('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit application.');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header Banner */}
      <div className="rounded-2xl glass-panel p-8 text-paper shadow-2xl border border-indigo-500/25">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="inline-block font-mono text-xs font-semibold uppercase tracking-wider text-mint">
              Smart Networking & Peer Collaboration
            </span>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Team & Peer <span className="gradient-text">Finder</span>
            </h1>
            <p className="mt-2 text-slate-light max-w-xl text-xs leading-relaxed">
              Find teammates for upcoming hackathons, form competitive programming study squads, or collaborate on open-source projects.
            </p>
          </div>

          <button
            onClick={() => {
              if (!user) {
                alert('Please log in to post a team opening.');
                return;
              }
              setShowCreateModal(true);
            }}
            className="btn-interactive rounded-xl bg-gradient-to-r from-amber via-amber-neon to-mint px-5 py-3 font-mono text-xs font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:opacity-95 whitespace-nowrap"
          >
            + Post Team Opening
          </button>
        </div>

        {/* Filter Controls */}
        <div className="mt-8 pt-6 border-t border-indigo-500/15 flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search by skill, role, or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:flex-1 rounded-xl bg-ink-soft/90 px-4 py-2.5 text-xs text-paper placeholder-slate-light border border-indigo-500/25 focus:outline-none focus:border-mint font-mono"
          />

          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full sm:w-auto rounded-xl bg-ink-soft/90 px-4 py-2.5 text-xs text-paper border border-indigo-500/25 focus:outline-none focus:border-mint font-mono"
          >
            <option value="All" className="bg-ink text-paper">
              Filter by Event: All Events
            </option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id} className="bg-ink text-paper">
                {evt.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Team Listings */}
      {loading ? (
        <div className="py-20 text-center font-mono text-sm text-mint flex items-center justify-center gap-2">
          <span className="h-3 w-3 rounded-full bg-mint animate-ping" />
          Loading team posts...
        </div>
      ) : teams.length === 0 ? (
        <div className="py-20 text-center font-mono text-sm text-slate-light">
          No open team posts found. Be the first to post an opening!
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onApply={(t) => setSelectedTeamToApply(t)}
            />
          ))}
        </div>
      )}

      {/* Modal: Create Team Opening */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-ink-light p-6 text-paper border border-indigo-500/30 shadow-2xl">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
              <h3 className="font-display text-xl font-bold">Post a Team Recruitment</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-paper/60 hover:text-paper"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="mt-4 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-light mb-1">Post Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Looking for ML Engineer for EduNova Hackathon"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl bg-ink-soft/90 px-3.5 py-2 text-paper placeholder-slate-light border border-indigo-500/25 focus:outline-none focus:border-mint"
                />
              </div>

              <div>
                <label className="block text-slate-light mb-1">Target Event (Optional)</label>
                <select
                  value={newEventId}
                  onChange={(e) => setNewEventId(e.target.value)}
                  className="w-full rounded-xl bg-ink-soft/90 px-3.5 py-2 text-paper border border-indigo-500/25 focus:outline-none focus:border-mint"
                >
                  <option value="" className="bg-ink">None (General Project / Study Group)</option>
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id} className="bg-ink">
                      {evt.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-light mb-1">Roles Needed *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frontend Developer, UI Designer"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full rounded-xl bg-ink-soft/90 px-3.5 py-2 text-paper placeholder-slate-light border border-indigo-500/25 focus:outline-none focus:border-mint"
                />
              </div>

              <div>
                <label className="block text-slate-light mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, PyTorch"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full rounded-xl bg-ink-soft/90 px-3.5 py-2 text-paper placeholder-slate-light border border-indigo-500/25 focus:outline-none focus:border-mint"
                />
              </div>

              <div>
                <label className="block text-slate-light mb-1">Project Description & Goals *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your project idea and expectations..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded-xl bg-ink-soft/90 px-3.5 py-2 text-paper placeholder-slate-light border border-indigo-500/25 focus:outline-none focus:border-mint"
                />
              </div>

              <div>
                <label className="block text-slate-light mb-1">Contact Details *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Discord handle, Email, or Telegram"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="w-full rounded-xl bg-ink-soft/90 px-3.5 py-2 text-paper placeholder-slate-light border border-indigo-500/25 focus:outline-none focus:border-mint"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-indigo-500/20">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl px-4 py-2 text-paper/70 hover:text-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-interactive rounded-xl bg-gradient-to-r from-amber to-mint px-5 py-2 font-bold text-white shadow-lg"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Apply / Connect */}
      {selectedTeamToApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-ink-light p-6 text-paper border border-indigo-500/30 shadow-2xl">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <h3 className="font-display text-lg font-bold">Connect with {selectedTeamToApply.userName}</h3>
              <button
                onClick={() => setSelectedTeamToApply(null)}
                className="text-paper/60 hover:text-paper"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 rounded-xl bg-ink-soft p-3.5 text-xs font-mono border border-indigo-500/20">
              <p className="text-amber font-bold">{selectedTeamToApply.title}</p>
              <p className="text-slate-light mt-1">Direct Contact: {selectedTeamToApply.contact}</p>
            </div>

            <form onSubmit={handleApplySubmit} className="mt-4 space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-light mb-1">Your Pitch / Skills Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Introduce yourself and share why you'd be a great teammate..."
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  className="w-full rounded-xl bg-ink-soft/90 px-3.5 py-2 text-paper placeholder-slate-light border border-indigo-500/25 focus:outline-none focus:border-mint"
                />
              </div>

              <div>
                <label className="block text-slate-light mb-1">Your Preferred Contact Info</label>
                <input
                  type="text"
                  placeholder={user?.email || 'Email or Discord handle'}
                  value={applyContact}
                  onChange={(e) => setApplyContact(e.target.value)}
                  className="w-full rounded-xl bg-ink-soft/90 px-3.5 py-2 text-paper placeholder-slate-light border border-indigo-500/25 focus:outline-none focus:border-mint"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-indigo-500/20">
                <button
                  type="button"
                  onClick={() => setSelectedTeamToApply(null)}
                  className="rounded-xl px-3 py-1.5 text-paper/70 hover:text-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-interactive rounded-xl bg-gradient-to-r from-amber to-mint px-4 py-2 font-bold text-white shadow-lg"
                >
                  Send Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
