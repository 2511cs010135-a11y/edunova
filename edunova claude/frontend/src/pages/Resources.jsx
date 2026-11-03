import { useState, useEffect } from 'react';
import api from '../api';

export default function Resources() {
  const [activeTab, setActiveTab] = useState('flashcards'); // 'flashcards' | 'cheatsheets'
  
  // Flashcards state
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStats, setCardStats] = useState({}); // { cardId: 'Easy' | 'Good' | 'Hard' }

  // Cheatsheets state
  const [cheatsheets, setCheatsheets] = useState([]);
  const [cheatCategory, setCheatCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchFlashcards();
    fetchCheatsheets();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const res = await api.get('/resources/flashcards');
      setDecks(res.data);
      if (res.data.length > 0) {
        setSelectedDeck(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch flashcard decks', err);
    }
  };

  const fetchCheatsheets = async () => {
    try {
      const res = await api.get('/resources/cheatsheets');
      setCheatsheets(res.data);
    } catch (err) {
      console.error('Failed to fetch cheatsheets', err);
    }
  };

  const handleGrade = (grade) => {
    if (!selectedDeck) return;
    const currentCard = selectedDeck.cards[currentCardIndex];
    setCardStats((prev) => ({ ...prev, [currentCard.id]: grade }));
    setIsFlipped(false);
    if (currentCardIndex < selectedDeck.cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    }
  };

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSheets = cheatsheets.filter((sheet) => {
    const matchesCat = cheatCategory === 'All' || sheet.category === cheatCategory;
    const matchesSearch =
      !search ||
      sheet.title.toLowerCase().includes(search.toLowerCase()) ||
      sheet.description.toLowerCase().includes(search.toLowerCase()) ||
      (sheet.tags && sheet.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header Banner */}
      <div className="rounded-2xl glass-panel p-8 text-paper shadow-2xl border border-indigo-500/25">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="inline-block font-mono text-xs font-semibold uppercase tracking-wider text-mint">
              Active Recall & Revision Hub
            </span>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Smart Resources & <span className="gradient-text">Flashcards</span>
            </h1>
            <p className="mt-2 text-slate-light max-w-xl text-xs leading-relaxed">
              Master core concepts with interactive 3D flashcard decks and reference curated code cheat sheets.
            </p>
          </div>

          {/* Tab Controls */}
          <div className="flex rounded-xl bg-ink-soft p-1.5 border border-indigo-500/20 font-mono text-xs">
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`btn-interactive rounded-lg px-4 py-2 font-bold transition-all ${
                activeTab === 'flashcards'
                  ? 'bg-gradient-to-r from-amber to-mint text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                  : 'text-slate-light hover:text-paper'
              }`}
            >
              🎴 Flashcard Decks
            </button>
            <button
              onClick={() => setActiveTab('cheatsheets')}
              className={`btn-interactive rounded-lg px-4 py-2 font-bold transition-all ${
                activeTab === 'cheatsheets'
                  ? 'bg-gradient-to-r from-amber to-mint text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                  : 'text-slate-light hover:text-paper'
              }`}
            >
              ⚡ Code Cheat Sheets
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Deck Selector Sidebar */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-bold text-mint uppercase tracking-wider">
              Select Deck
            </h3>
            {decks.map((deck) => (
              <button
                key={deck.id}
                onClick={() => {
                  setSelectedDeck(deck);
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`btn-interactive w-full text-left p-5 rounded-2xl border transition-all ${
                  selectedDeck?.id === deck.id
                    ? 'border-mint bg-ink-light text-paper shadow-xl shadow-indigo-500/10'
                    : 'border-indigo-500/15 bg-ink-light/50 hover:border-mint/40 text-paper/90'
                }`}
              >
                <span className="font-mono text-[10px] uppercase font-bold text-mint">
                  {deck.category}
                </span>
                <h4 className="font-display font-bold text-base mt-0.5">{deck.title}</h4>
                <p className="mt-1 text-xs text-slate-light line-clamp-2">{deck.description}</p>
                <div className="mt-3 font-mono text-[11px] text-mint/80 font-semibold">
                  {deck.cards.length} Cards
                </div>
              </button>
            ))}
          </div>

          {/* Flashcard Active Player */}
          {selectedDeck && selectedDeck.cards.length > 0 ? (
            <div className="lg:col-span-2 flex flex-col justify-between">
              <div>
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-light mb-3">
                  <span>
                    Card {currentCardIndex + 1} of {selectedDeck.cards.length}
                  </span>
                  <span className="text-mint font-semibold">{selectedDeck.title}</span>
                </div>

                {/* 3D Flip Card Container */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="cursor-pointer relative h-80 w-full rounded-2xl bg-ink-light/90 text-paper shadow-2xl border border-indigo-500/30 p-8 flex flex-col items-center justify-center text-center transition-transform duration-500 trace-card backdrop-blur-md hover:border-mint/50"
                >
                  {!isFlipped ? (
                    <div className="animate-fade-in">
                      <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 font-mono text-xs text-indigo-300 font-semibold">
                        FRONT (Question / Prompt)
                      </span>
                      <h3 className="mt-6 font-display text-xl sm:text-2xl font-bold leading-snug">
                        {selectedDeck.cards[currentCardIndex].front}
                      </h3>
                      <p className="mt-6 font-mono text-xs text-mint">
                        Click card to flip ↺
                      </p>
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      <span className="rounded-full bg-mint/20 border border-mint/30 px-3 py-1 font-mono text-xs text-mint font-semibold">
                        BACK (Answer & Solution)
                      </span>
                      <p className="mt-6 font-body text-base sm:text-lg leading-relaxed text-paper/90 max-w-lg">
                        {selectedDeck.cards[currentCardIndex].back}
                      </p>
                      <p className="mt-6 font-mono text-xs text-amber font-semibold">
                        Rate your confidence below ↓
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation & Grading Bar */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink-light/80 p-4 border border-indigo-500/20 shadow-xl backdrop-blur-md">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                      setIsFlipped(false);
                    }}
                    disabled={currentCardIndex === 0}
                    className="btn-interactive rounded-xl border border-indigo-500/20 bg-ink-soft px-4 py-2 font-mono text-xs text-paper/80 disabled:opacity-40 hover:text-paper"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => {
                      setCurrentCardIndex((prev) =>
                        Math.min(selectedDeck.cards.length - 1, prev + 1)
                      );
                      setIsFlipped(false);
                    }}
                    disabled={currentCardIndex === selectedDeck.cards.length - 1}
                    className="btn-interactive rounded-xl border border-indigo-500/20 bg-ink-soft px-4 py-2 font-mono text-xs text-paper/80 disabled:opacity-40 hover:text-paper"
                  >
                    Next →
                  </button>
                </div>

                {isFlipped && (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-light font-semibold">Self Grade:</span>
                    <button
                      onClick={() => handleGrade('Hard')}
                      className="btn-interactive rounded-xl bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 font-mono text-xs font-bold text-rose-400 hover:bg-rose-500/30"
                    >
                      Hard 😓
                    </button>
                    <button
                      onClick={() => handleGrade('Good')}
                      className="btn-interactive rounded-xl bg-amber/20 border border-amber/30 px-3 py-1.5 font-mono text-xs font-bold text-amber hover:bg-amber/30"
                    >
                      Good 👍
                    </button>
                    <button
                      onClick={() => handleGrade('Easy')}
                      className="btn-interactive rounded-xl bg-mint/20 border border-mint/30 px-3 py-1.5 font-mono text-xs font-bold text-mint hover:bg-mint/30"
                    >
                      Easy 🚀
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 py-20 text-center font-mono text-sm text-slate-light">
              Select a deck to begin practice.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CODE CHEAT SHEETS */}
      {activeTab === 'cheatsheets' && (
        <div className="mt-8 space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-ink-light/80 p-4 rounded-2xl border border-indigo-500/20 shadow-xl backdrop-blur-md">
            <input
              type="text"
              placeholder="Search cheat sheets by topic or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-96 rounded-xl bg-ink-soft/90 px-3.5 py-2 text-xs text-paper placeholder-slate-light border border-indigo-500/25 focus:outline-none focus:border-mint"
            />

            <div className="flex flex-wrap gap-2">
              {['All', 'Web Development', 'AI / ML', 'DevOps & Tools', 'Databases'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCheatCategory(cat)}
                  className={`btn-interactive rounded-xl px-3.5 py-1.5 font-mono text-xs font-medium transition-all ${
                    cheatCategory === cat
                      ? 'bg-gradient-to-r from-amber via-amber-neon to-mint text-white font-bold shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                      : 'bg-ink-soft text-slate-light hover:text-paper'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cheat sheets grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredSheets.map((sheet) => (
              <div
                key={sheet.id}
                className="trace-card rounded-2xl bg-ink-light/90 p-6 text-paper border border-indigo-500/20 shadow-xl backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-mint uppercase tracking-wider">
                      {sheet.category}
                    </span>
                    <button
                      onClick={() => handleCopyCode(sheet.id, sheet.code)}
                      className="btn-interactive rounded-xl bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 font-mono text-xs text-mint font-semibold hover:bg-mint hover:text-ink transition-colors"
                    >
                      {copiedId === sheet.id ? 'Copied ✓' : 'Copy Code 📋'}
                    </button>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-bold">{sheet.title}</h3>
                  <p className="mt-1 text-xs text-slate-light">{sheet.description}</p>

                  <pre className="mt-4 rounded-xl bg-ink-soft p-4 font-mono text-xs text-mint overflow-x-auto border border-indigo-500/20 leading-relaxed shadow-inner">
                    <code>{sheet.code}</code>
                  </pre>
                </div>

                {sheet.tags && (
                  <div className="mt-4 pt-3 border-t border-indigo-500/15 flex flex-wrap gap-1.5">
                    {sheet.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-indigo-500/15 border border-indigo-500/20 px-2.5 py-0.5 font-mono text-[10px] text-paper/80"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
