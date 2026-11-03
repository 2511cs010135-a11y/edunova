import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { user, toggleAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Stats data
  const [stats, setStats] = useState(null);

  // Collections data
  const [events, setEvents] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [cheatsheets, setCheatsheets] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [teams, setTeams] = useState([]);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [modalType, setModalType] = useState(null); // 'event', 'roadmap', 'quiz', 'flashcard', 'cheatsheet', 'team'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const showNotification = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        eventsRes,
        roadmapsRes,
        quizzesRes,
        flashRes,
        cheatRes,
        usersRes,
        teamsRes
      ] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/events'),
        api.get('/roadmaps'),
        api.get('/quizzes'),
        api.get('/resources/flashcards'),
        api.get('/resources/cheatsheets'),
        api.get('/admin/users'),
        api.get('/admin/teams')
      ]);

      setStats(statsRes.data);
      setEvents(eventsRes.data);
      setRoadmaps(roadmapsRes.data);
      setQuizzes(quizzesRes.data);
      setFlashcards(flashRes.data);
      setCheatsheets(cheatRes.data);
      setUsersList(usersRes.data);
      setTeams(teamsRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showNotification('Failed to load some admin resources.', true);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // EVENT ACTIONS
  // ----------------------------------------------------
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await api.put(`/admin/events/${editingItem.id}`, formData);
        setEvents(events.map((evt) => (evt.id === editingItem.id ? res.data : evt)));
        showNotification('Event updated successfully!');
      } else {
        const res = await api.post('/admin/events', formData);
        setEvents([res.data, ...events]);
        showNotification('New Event created successfully!');
      }
      closeModal();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to save event', true);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/admin/events/${id}`);
      setEvents(events.filter((e) => e.id !== id));
      showNotification('Event deleted!');
    } catch (err) {
      showNotification('Failed to delete event', true);
    }
  };

  // ----------------------------------------------------
  // ROADMAP ACTIONS
  // ----------------------------------------------------
  const handleSaveRoadmap = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await api.put(`/admin/roadmaps/${editingItem.id}`, formData);
        setRoadmaps(roadmaps.map((rm) => (rm.id === editingItem.id ? res.data : rm)));
        showNotification('Roadmap updated successfully!');
      } else {
        const res = await api.post('/admin/roadmaps', formData);
        setRoadmaps([...roadmaps, res.data]);
        showNotification('New Roadmap created!');
      }
      closeModal();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to save roadmap', true);
    }
  };

  const handleDeleteRoadmap = async (id) => {
    if (!window.confirm('Delete this roadmap permanently?')) return;
    try {
      await api.delete(`/admin/roadmaps/${id}`);
      setRoadmaps(roadmaps.filter((rm) => rm.id !== id));
      showNotification('Roadmap deleted!');
    } catch (err) {
      showNotification('Failed to delete roadmap', true);
    }
  };

  // ----------------------------------------------------
  // QUIZ ACTIONS
  // ----------------------------------------------------
  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await api.put(`/admin/quizzes/${editingItem.id}`, formData);
        setQuizzes(quizzes.map((qz) => (qz.id === editingItem.id ? res.data : qz)));
        showNotification('Quiz updated successfully!');
      } else {
        const res = await api.post('/admin/quizzes', formData);
        setQuizzes([...quizzes, res.data]);
        showNotification('New Quiz created!');
      }
      closeModal();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to save quiz', true);
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await api.delete(`/admin/quizzes/${id}`);
      setQuizzes(quizzes.filter((qz) => qz.id !== id));
      showNotification('Quiz deleted!');
    } catch (err) {
      showNotification('Failed to delete quiz', true);
    }
  };

  // ----------------------------------------------------
  // RESOURCE ACTIONS (FLASHCARDS & CHEATSHEETS)
  // ----------------------------------------------------
  const handleSaveFlashcard = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await api.put(`/admin/flashcards/${editingItem.id}`, formData);
        setFlashcards(flashcards.map((fc) => (fc.id === editingItem.id ? res.data : fc)));
        showNotification('Flashcard deck updated!');
      } else {
        const res = await api.post('/admin/flashcards', formData);
        setFlashcards([...flashcards, res.data]);
        showNotification('Flashcard deck created!');
      }
      closeModal();
    } catch (err) {
      showNotification('Failed to save flashcard deck', true);
    }
  };

  const handleDeleteFlashcard = async (id) => {
    if (!window.confirm('Delete this flashcard deck?')) return;
    try {
      await api.delete(`/admin/flashcards/${id}`);
      setFlashcards(flashcards.filter((fc) => fc.id !== id));
      showNotification('Flashcard deck deleted!');
    } catch (err) {
      showNotification('Failed to delete deck', true);
    }
  };

  const handleSaveCheatsheet = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await api.put(`/admin/cheatsheets/${editingItem.id}`, formData);
        setCheatsheets(cheatsheets.map((cs) => (cs.id === editingItem.id ? res.data : cs)));
        showNotification('Cheatsheet updated!');
      } else {
        const res = await api.post('/admin/cheatsheets', formData);
        setCheatsheets([...cheatsheets, res.data]);
        showNotification('Cheatsheet created!');
      }
      closeModal();
    } catch (err) {
      showNotification('Failed to save cheatsheet', true);
    }
  };

  const handleDeleteCheatsheet = async (id) => {
    if (!window.confirm('Delete this cheatsheet?')) return;
    try {
      await api.delete(`/admin/cheatsheets/${id}`);
      setCheatsheets(cheatsheets.filter((cs) => cs.id !== id));
      showNotification('Cheatsheet deleted!');
    } catch (err) {
      showNotification('Failed to delete cheatsheet', true);
    }
  };

  // ----------------------------------------------------
  // USER ACTIONS
  // ----------------------------------------------------
  const handleToggleUserRole = async (targetUserId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/admin/users/${targetUserId}/role`, { role: newRole });
      setUsersList(
        usersList.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
      );
      showNotification(`User role updated to ${newRole.toUpperCase()}`);
    } catch (err) {
      showNotification('Failed to update user role', true);
    }
  };

  const handleDeleteUser = async (targetUserId) => {
    if (!window.confirm('Delete this user account?')) return;
    try {
      await api.delete(`/admin/users/${targetUserId}`);
      setUsersList(usersList.filter((u) => u.id !== targetUserId));
      showNotification('User deleted');
    } catch (err) {
      showNotification('Failed to delete user', true);
    }
  };

  // ----------------------------------------------------
  // TEAM POST ACTIONS
  // ----------------------------------------------------
  const handleDeleteTeam = async (id) => {
    if (!window.confirm('Delete this recruitment post?')) return;
    try {
      await api.delete(`/admin/teams/${id}`);
      setTeams(teams.filter((t) => t.id !== id));
      showNotification('Team post removed');
    } catch (err) {
      showNotification('Failed to delete team post', true);
    }
  };

  // MODAL HELPERS
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData({ ...item });
    } else {
      // Default blank templates
      if (type === 'event') {
        setFormData({
          title: '',
          type: 'hackathon',
          mode: 'Online',
          location: 'Online',
          capacity: 500,
          description: '',
          prize: '',
          tags: 'AI, Web3',
          organizer: 'EduNova Community'
        });
      } else if (type === 'roadmap') {
        setFormData({
          title: '',
          category: 'Web Development',
          target: 'Beginner to Advanced',
          timeCommitment: '8 Weeks',
          tags: 'React, Node, Frontend',
          overview: '',
          modules: []
        });
      } else if (type === 'quiz') {
        setFormData({
          title: '',
          category: 'System Architecture',
          difficulty: 'Intermediate',
          timeLimit: 15,
          description: '',
          questions: [
            {
              id: 'q1',
              question: 'Sample Question Title?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctIndex: 0,
              explanation: 'Explanation for correct choice'
            }
          ]
        });
      } else if (type === 'flashcard') {
        setFormData({
          title: '',
          category: 'Frontend Development',
          cards: [
            { id: 'c1', front: 'What is JSX?', back: 'Syntax extension for JavaScript used in React.' }
          ]
        });
      } else if (type === 'cheatsheet') {
        setFormData({
          title: '',
          category: 'JavaScript',
          description: '',
          tags: 'ES6, Async',
          snippets: [
            { title: 'Async/Await Example', code: 'async function fetchData() {\n  const res = await fetch(url);\n  return res.json();\n}' }
          ]
        });
      }
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingItem(null);
    setFormData({});
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="font-mono text-sm text-mint animate-pulse">Loading Admin Control Panel...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {message && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 font-mono text-sm shadow-xl backdrop-blur-lg border transition-all ${
            message.isError
              ? 'border-red-500/50 bg-red-950/80 text-red-200'
              : 'border-mint/50 bg-slate-900/90 text-mint'
          }`}
        >
          {message.isError ? '⚠️ ' : '✅ '}
          {message.text}
        </div>
      )}

      {/* Admin Header */}
      <div className="mb-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-ink/90 via-slate-900/90 to-ink/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber to-amber-neon font-mono font-bold text-white shadow-lg">
                ⚡
              </span>
              <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
                Admin Control Center
              </h1>
            </div>
            <p className="mt-2 text-sm text-paper/70 font-mono">
              Manage platform events, roadmaps, quizzes, flashcards, cheatsheets, and community users.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-amber/40 bg-amber/10 px-4 py-2 text-xs font-mono text-amber">
              🛡️ Admin Session: <span className="font-bold text-white">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-indigo-500/20 pb-2">
        {[
          { id: 'stats', label: '📊 System Stats' },
          { id: 'events', label: '📅 Events & Hackathons' },
          { id: 'roadmaps', label: '🗺️ Roadmaps' },
          { id: 'quizzes', label: '🧠 Quizzes' },
          { id: 'resources', label: '📚 Flashcards & Sheets' },
          { id: 'users', label: '👥 User Accounts' },
          { id: 'teams', label: '🤝 Team Finder' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchTerm('');
            }}
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 font-mono text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-amber to-amber-neon text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                : 'text-paper/70 hover:bg-indigo-500/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Add Action Header for lists */}
      {activeTab !== 'stats' && (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 rounded-xl border border-indigo-500/20 bg-slate-900/60 px-4 py-2 font-mono text-xs text-white placeholder-paper/40 focus:border-mint focus:outline-none"
          />

          {['events', 'roadmaps', 'quizzes', 'resources'].includes(activeTab) && (
            <div className="flex gap-2">
              {activeTab === 'events' && (
                <button
                  onClick={() => openModal('event')}
                  className="rounded-xl bg-gradient-to-r from-mint to-teal-400 px-4 py-2 font-mono text-xs font-bold text-slate-950 hover:opacity-90 shadow-md"
                >
                  + Add Event
                </button>
              )}
              {activeTab === 'roadmaps' && (
                <button
                  onClick={() => openModal('roadmap')}
                  className="rounded-xl bg-gradient-to-r from-mint to-teal-400 px-4 py-2 font-mono text-xs font-bold text-slate-950 hover:opacity-90 shadow-md"
                >
                  + Add Roadmap
                </button>
              )}
              {activeTab === 'quizzes' && (
                <button
                  onClick={() => openModal('quiz')}
                  className="rounded-xl bg-gradient-to-r from-mint to-teal-400 px-4 py-2 font-mono text-xs font-bold text-slate-950 hover:opacity-90 shadow-md"
                >
                  + Add Quiz
                </button>
              )}
              {activeTab === 'resources' && (
                <>
                  <button
                    onClick={() => openModal('flashcard')}
                    className="rounded-xl bg-indigo-600 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-indigo-500 shadow-md"
                  >
                    + Add Flashcard Deck
                  </button>
                  <button
                    onClick={() => openModal('cheatsheet')}
                    className="rounded-xl bg-gradient-to-r from-mint to-teal-400 px-4 py-2 font-mono text-xs font-bold text-slate-950 hover:opacity-90 shadow-md"
                  >
                    + Add Cheatsheet
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 1: SYSTEM STATS */}
      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Registered Users', val: stats.totalUsers, icon: '👥', color: 'from-blue-500/20 to-indigo-500/20' },
            { label: 'Platform Admins', val: stats.totalAdmins, icon: '🛡️', color: 'from-amber/20 to-orange-500/20' },
            { label: 'Hackathons & Events', val: stats.totalEvents, icon: '📅', color: 'from-mint/20 to-emerald-500/20' },
            { label: 'Learning Roadmaps', val: stats.totalRoadmaps, icon: '🗺️', color: 'from-purple-500/20 to-indigo-500/20' },
            { label: 'Skill Quizzes', val: stats.totalQuizzes, icon: '🧠', color: 'from-pink-500/20 to-rose-500/20' },
            { label: 'Flashcard Decks', val: stats.totalFlashcards, icon: '⚡', color: 'from-cyan-500/20 to-blue-500/20' },
            { label: 'Cheat Sheets', val: stats.totalCheatsheets, icon: '📜', color: 'from-teal-500/20 to-emerald-500/20' },
            { label: 'Event Registrations', val: stats.totalRegistrations, icon: '✍️', color: 'from-amber-neon/20 to-yellow-500/20' }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border border-white/10 bg-gradient-to-br ${item.color} p-6 backdrop-blur-md shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{item.icon}</span>
                <span className="font-mono text-3xl font-extrabold text-white">{item.val}</span>
              </div>
              <p className="mt-4 font-mono text-xs text-paper/75">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: EVENTS */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 gap-4">
          {events
            .filter((e) => e.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((evt) => (
              <div
                key={evt.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:flex-row sm:items-center sm:justify-between hover:border-indigo-500/30 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-indigo-500/20 px-2 py-0.5 font-mono text-[10px] uppercase text-indigo-300">
                      {evt.type}
                    </span>
                    <span className="rounded bg-mint/10 px-2 py-0.5 font-mono text-[10px] text-mint">
                      {evt.mode}
                    </span>
                    <span className="font-mono text-xs text-paper/50">ID: {evt.id}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">{evt.title}</h3>
                  <p className="text-xs text-paper/70 line-clamp-1">{evt.description}</p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => openModal('event', evt)}
                    className="rounded-lg border border-indigo-400/40 bg-indigo-500/10 px-3 py-1.5 font-mono text-xs text-indigo-300 hover:bg-indigo-500/20"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(evt.id)}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 font-mono text-xs text-red-300 hover:bg-red-500/20"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* TAB 3: ROADMAPS */}
      {activeTab === 'roadmaps' && (
        <div className="grid grid-cols-1 gap-4">
          {roadmaps
            .filter((r) => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((rm) => (
              <div
                key={rm.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:flex-row sm:items-center sm:justify-between hover:border-indigo-500/30 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-purple-500/20 px-2 py-0.5 font-mono text-[10px] text-purple-300">
                      {rm.category}
                    </span>
                    <span className="font-mono text-xs text-paper/50">Modules: {rm.modules?.length || 0}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">{rm.title}</h3>
                  <p className="text-xs text-paper/70 line-clamp-1">{rm.overview}</p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => openModal('roadmap', rm)}
                    className="rounded-lg border border-indigo-400/40 bg-indigo-500/10 px-3 py-1.5 font-mono text-xs text-indigo-300 hover:bg-indigo-500/20"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRoadmap(rm.id)}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 font-mono text-xs text-red-300 hover:bg-red-500/20"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* TAB 4: QUIZZES */}
      {activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 gap-4">
          {quizzes
            .filter((q) => q.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((qz) => (
              <div
                key={qz.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:flex-row sm:items-center sm:justify-between hover:border-indigo-500/30 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-pink-500/20 px-2 py-0.5 font-mono text-[10px] text-pink-300">
                      {qz.category}
                    </span>
                    <span className="rounded bg-indigo-500/20 px-2 py-0.5 font-mono text-[10px] text-indigo-300">
                      {qz.difficulty}
                    </span>
                    <span className="font-mono text-xs text-paper/50">Questions: {qz.questions?.length || qz.questionCount || 0}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">{qz.title}</h3>
                  <p className="text-xs text-paper/70 line-clamp-1">{qz.description}</p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => openModal('quiz', qz)}
                    className="rounded-lg border border-indigo-400/40 bg-indigo-500/10 px-3 py-1.5 font-mono text-xs text-indigo-300 hover:bg-indigo-500/20"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteQuiz(qz.id)}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 font-mono text-xs text-red-300 hover:bg-red-500/20"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* TAB 5: RESOURCES */}
      {activeTab === 'resources' && (
        <div className="space-y-8">
          <div>
            <h3 className="mb-4 font-mono text-sm font-bold text-mint">⚡ Flashcard Decks ({flashcards.length})</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {flashcards
                .filter((f) => f.title.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((fc) => (
                  <div key={fc.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="rounded bg-cyan-500/20 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                          {fc.category}
                        </span>
                        <h4 className="font-display font-bold text-white mt-1">{fc.title}</h4>
                      </div>
                      <span className="font-mono text-xs text-paper/50">{fc.cards?.length || 0} cards</span>
                    </div>
                    <div className="flex gap-2 justify-end pt-2 border-t border-white/5">
                      <button
                        onClick={() => openModal('flashcard', fc)}
                        className="rounded border border-indigo-400/30 px-2.5 py-1 font-mono text-[11px] text-indigo-300 hover:bg-indigo-500/20"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFlashcard(fc.id)}
                        className="rounded border border-red-500/30 px-2.5 py-1 font-mono text-[11px] text-red-300 hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-sm font-bold text-teal-400">📜 Cheatsheets ({cheatsheets.length})</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {cheatsheets
                .filter((c) => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((cs) => (
                  <div key={cs.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="rounded bg-teal-500/20 px-2 py-0.5 font-mono text-[10px] text-teal-300">
                          {cs.category}
                        </span>
                        <h4 className="font-display font-bold text-white mt-1">{cs.title}</h4>
                      </div>
                      <span className="font-mono text-xs text-paper/50">{cs.snippets?.length || 0} snippets</span>
                    </div>
                    <p className="text-xs text-paper/60 line-clamp-1">{cs.description}</p>
                    <div className="flex gap-2 justify-end pt-2 border-t border-white/5">
                      <button
                        onClick={() => openModal('cheatsheet', cs)}
                        className="rounded border border-indigo-400/30 px-2.5 py-1 font-mono text-[11px] text-indigo-300 hover:bg-indigo-500/20"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCheatsheet(cs.id)}
                        className="rounded border border-red-500/30 px-2.5 py-1 font-mono text-[11px] text-red-300 hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: USERS */}
      {activeTab === 'users' && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-white/10 bg-slate-950/80 text-paper/60">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">College</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-paper/90">
              {usersList
                .filter(
                  (u) =>
                    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((u) => (
                  <tr key={u.id} className="hover:bg-indigo-500/5">
                    <td className="p-4 font-bold text-white">{u.name}</td>
                    <td className="p-4 text-paper/70">{u.email}</td>
                    <td className="p-4 text-paper/60">{u.college || '—'}</td>
                    <td className="p-4">
                      <span
                        className={`rounded px-2 py-0.5 uppercase text-[10px] font-bold ${
                          u.role === 'admin'
                            ? 'bg-amber/20 text-amber border border-amber/40'
                            : 'bg-indigo-500/20 text-indigo-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleUserRole(u.id, u.role)}
                        className="rounded border border-indigo-400/40 bg-indigo-500/10 px-2.5 py-1 text-[11px] text-indigo-300 hover:bg-indigo-500/20"
                      >
                        {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="rounded border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-[11px] text-red-300 hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 7: TEAMS */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 gap-4">
          {teams
            .filter((t) => t.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((t) => (
              <div key={t.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="rounded bg-mint/10 px-2 py-0.5 font-mono text-[10px] text-mint">
                      Status: {t.status}
                    </span>
                    <h3 className="font-display text-base font-bold text-white mt-1">{t.title}</h3>
                    <p className="font-mono text-xs text-indigo-300">Roles Needed: {t.roleNeeded}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteTeam(t.id)}
                    className="rounded border border-red-500/40 bg-red-500/10 px-3 py-1 font-mono text-xs text-red-300 hover:bg-red-500/20"
                  >
                    🗑️ Remove Post
                  </button>
                </div>
                <p className="text-xs text-paper/70">{t.description}</p>
                <div className="font-mono text-[11px] text-paper/50">Posted by {t.userName} ({t.contact})</div>
              </div>
            ))}
        </div>
      )}

      {/* EDIT / CREATE MODAL OVERLAY */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-indigo-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-display text-xl font-bold text-white capitalize">
                {editingItem ? `Edit ${modalType}` : `Create New ${modalType}`}
              </h2>
              <button onClick={closeModal} className="text-paper/60 hover:text-white font-mono text-lg">
                ✕
              </button>
            </div>

            {/* EVENT FORM */}
            {modalType === 'event' && (
              <form onSubmit={handleSaveEvent} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-paper/70 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-paper/70 mb-1">Type</label>
                    <select
                      value={formData.type || 'hackathon'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                    >
                      <option value="hackathon">Hackathon</option>
                      <option value="contest">Contest</option>
                      <option value="tech-talk">Tech Talk</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-paper/70 mb-1">Mode</label>
                    <select
                      value={formData.mode || 'Online'}
                      onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-paper/70 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-paper/70 mb-1">Prize Info</label>
                    <input
                      type="text"
                      value={formData.prize || ''}
                      onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-paper/70 mb-1">Capacity</label>
                    <input
                      type="number"
                      value={formData.capacity || 500}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-paper/60 hover:text-white">
                    Cancel
                  </button>
                  <button type="submit" className="rounded-xl bg-mint px-5 py-2 font-bold text-slate-950 hover:opacity-90">
                    Save Event
                  </button>
                </div>
              </form>
            )}

            {/* ROADMAP FORM */}
            {modalType === 'roadmap' && (
              <form onSubmit={handleSaveRoadmap} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-paper/70 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-paper/70 mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-paper/70 mb-1">Time Commitment</label>
                    <input
                      type="text"
                      value={formData.timeCommitment || ''}
                      onChange={(e) => setFormData({ ...formData, timeCommitment: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-paper/70 mb-1">Overview</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.overview || ''}
                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-paper/60 hover:text-white">
                    Cancel
                  </button>
                  <button type="submit" className="rounded-xl bg-mint px-5 py-2 font-bold text-slate-950 hover:opacity-90">
                    Save Roadmap
                  </button>
                </div>
              </form>
            )}

            {/* QUIZ FORM */}
            {modalType === 'quiz' && (
              <form onSubmit={handleSaveQuiz} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-paper/70 mb-1">Quiz Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-paper/70 mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-paper/70 mb-1">Difficulty</label>
                    <select
                      value={formData.difficulty || 'Intermediate'}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-paper/70 mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                  />
                </div>

                {/* Question builder preview */}
                <div className="rounded-xl border border-white/10 p-3 bg-slate-950">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-mint font-bold">Questions ({formData.questions?.length || 0})</span>
                  </div>
                  {formData.questions?.map((q, qIdx) => (
                    <div key={qIdx} className="mb-3 p-2 border-b border-white/5 space-y-1">
                      <input
                        type="text"
                        placeholder="Question text..."
                        value={q.question}
                        onChange={(e) => {
                          const updatedQs = [...formData.questions];
                          updatedQs[qIdx].question = e.target.value;
                          setFormData({ ...formData, questions: updatedQs });
                        }}
                        className="w-full bg-transparent text-white font-bold"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-paper/60 hover:text-white">
                    Cancel
                  </button>
                  <button type="submit" className="rounded-xl bg-mint px-5 py-2 font-bold text-slate-950 hover:opacity-90">
                    Save Quiz
                  </button>
                </div>
              </form>
            )}

            {/* FLASHCARD FORM */}
            {modalType === 'flashcard' && (
              <form onSubmit={handleSaveFlashcard} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-paper/70 mb-1">Deck Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-paper/70 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-paper/60 hover:text-white">
                    Cancel
                  </button>
                  <button type="submit" className="rounded-xl bg-mint px-5 py-2 font-bold text-slate-950 hover:opacity-90">
                    Save Flashcard Deck
                  </button>
                </div>
              </form>
            )}

            {/* CHEATSHEET FORM */}
            {modalType === 'cheatsheet' && (
              <form onSubmit={handleSaveCheatsheet} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-paper/70 mb-1">Cheatsheet Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-paper/70 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-paper/70 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-paper/60 hover:text-white">
                    Cancel
                  </button>
                  <button type="submit" className="rounded-xl bg-mint px-5 py-2 font-bold text-slate-950 hover:opacity-90">
                    Save Cheatsheet
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
