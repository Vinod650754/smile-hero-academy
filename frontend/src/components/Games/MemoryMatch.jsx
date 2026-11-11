import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const MEMORY_ICONS_POOL = [
  { name: 'Toothbrush', emoji: '🪥' },
  { name: 'Fresh Water', emoji: '💧' },
  { name: 'Superhero Tooth', emoji: '🦷' },
  { name: 'Crispy Apple', emoji: '🍎' },
  { name: 'Fluoride Shield', emoji: '🛡️' },
  { name: 'Floss String', emoji: '🧵' },
  { name: 'Tooth Paste', emoji: '🧴' },
  { name: 'Sparkle Star', emoji: '⭐' }
];

export default function MemoryMatch({ onBack, onComplete }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLocking, setIsLocking] = useState(false);

  // Initialize a fresh randomized 8-card (4-pair) grid
  const startNewGame = () => {
    const selectedPairs = [...MEMORY_ICONS_POOL]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    const duplicated = [...selectedPairs, ...selectedPairs]
      .map((item, index) => ({ ...item, uniqueId: index }))
      .sort(() => Math.random() - 0.5);

    setCards(duplicated);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsComplete(false);
    setIsLocking(false);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleCardClick = (uniqueId) => {
    if (isLocking || flipped.length === 2 || flipped.includes(uniqueId) || matched.includes(uniqueId)) {
      return;
    }

    const nextFlipped = [...flipped, uniqueId];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsLocking(true);

      const card1 = cards.find(c => c.uniqueId === nextFlipped[0]);
      const card2 = cards.find(c => c.uniqueId === nextFlipped[1]);

      if (card1.name === card2.name) {
        // Matched Pair!
        confetti({ particleCount: 25, spread: 40, origin: { y: 0.7 } });
        setMatched(prev => {
          const updated = [...prev, nextFlipped[0], nextFlipped[1]];
          if (updated.length === cards.length) {
            setIsComplete(true);
            onComplete(20, 'Game Explorer');
          }
          return updated;
        });
        setFlipped([]);
        setIsLocking(false);
      } else {
        // No match -> Flip back after delay
        setTimeout(() => {
          setFlipped([]);
          setIsLocking(false);
        }, 850);
      }
    }
  };

  return (
    <div className="bubbly-card" style={{ textAlign: 'center', padding: '16px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontWeight: '900', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ fontWeight: '900', color: '#b45309', fontSize: '14px' }}>🂠 Memory Match</div>
      </div>

      {!isComplete ? (
        <div>
          {/* Status HUD */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '12px' }}>
            <span>Pairs Found: {matched.length / 2} / {cards.length / 2}</span>
            <span style={{ color: '#b45309' }}>🎯 Moves: {moves}</span>
          </div>

          {/* 4x2 Card Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            marginBottom: '14px'
          }}>
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.uniqueId) || matched.includes(card.uniqueId);
              const isMatchedPair = matched.includes(card.uniqueId);

              return (
                <button
                  key={card.uniqueId}
                  onClick={() => handleCardClick(card.uniqueId)}
                  style={{
                    height: '75px',
                    borderRadius: '18px',
                    background: isMatchedPair
                      ? 'linear-gradient(180deg, #dcfce7 0%, #86efac 100%)'
                      : isFlipped
                      ? 'linear-gradient(180deg, #fef3c7 0%, #fde047 100%)'
                      : 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
                    border: isMatchedPair
                      ? '3px solid #22c55e'
                      : isFlipped
                      ? '3px solid #f59e0b'
                      : '3px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isFlipped ? '2.1rem' : '1.4rem',
                    cursor: 'pointer',
                    boxShadow: '0 6px 14px rgba(0,0,0,0.1)',
                    transition: 'all 0.25s ease',
                    transform: isFlipped ? 'rotateY(180deg) scale(1.03)' : 'rotateY(0deg)'
                  }}
                >
                  <span style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none' }}>
                    {isFlipped ? card.emoji : '❓'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px 0' }}>
          <div style={{ fontSize: '3.5rem' }}>🌟</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', marginTop: '6px' }}>All Pairs Matched!</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#15803d', margin: '6px 0 16px 0' }}>
            Completed in {moves} moves! +20 ⭐ Stars!
          </div>
          <button
            className="bubbly-btn-gold"
            onClick={startNewGame}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '12px 24px' }}
          >
            <RotateCcw size={16} /> Play Again 🔄
          </button>
        </div>
      )}
    </div>
  );
}