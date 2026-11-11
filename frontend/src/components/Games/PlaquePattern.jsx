import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

const STAGES = [
  { id: 0, label: 'Outer Front', emoji: '🦷' },
  { id: 1, label: 'Inside Surface', emoji: '👅' },
  { id: 2, label: 'Chewing Top', emoji: '✨' },
  { id: 3, label: 'Gum Line', emoji: '💖' }
];

export default function PlaquePattern({ onBack, onComplete }) {
  const [sequence, setSequence] = useState([]);
  const [userStep, setUserStep] = useState(0);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Play sequence playback animation
  const playSequencePlayback = (seq) => {
    setIsPlayingBack(true);
    setUserStep(0);

    seq.forEach((stageId, index) => {
      setTimeout(() => {
        setActiveHighlight(stageId);
        setTimeout(() => setActiveHighlight(null), 400);
      }, (index + 1) * 700);
    });

    setTimeout(() => {
      setIsPlayingBack(false);
    }, (seq.length + 1) * 700);
  };

  const startNewGame = () => {
    const initialSeq = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
    setSequence(initialSeq);
    setScore(0);
    setIsDone(false);
    playSequencePlayback(initialSeq);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleStageClick = (stageId) => {
    if (isPlayingBack || isDone) return;

    if (stageId === sequence[userStep]) {
      // Correct Step!
      setActiveHighlight(stageId);
      setTimeout(() => setActiveHighlight(null), 200);

      if (userStep + 1 === sequence.length) {
        // Round Completed! Add next pattern item
        const nextScore = score + 5;
        setScore(nextScore);

        if (sequence.length >= 5) {
          setIsDone(true);
          confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
          onComplete(20, 'Game Explorer');
        } else {
          const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
          setSequence(nextSeq);
          setTimeout(() => playSequencePlayback(nextSeq), 600);
        }
      } else {
        setUserStep(u => u + 1);
      }
    } else {
      // Wrong Step -> Replay sequence
      alert('Wrong pattern! Listen carefully and try again, Smile Hero!');
      playSequencePlayback(sequence);
    }
  };

  return (
    <div className="bubbly-card" style={{ textAlign: 'center', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontWeight: '900', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ fontWeight: '900', color: '#0284c7', fontSize: '14px' }}>🧩 Plaque Pattern</div>
      </div>

      {!isDone ? (
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '12px' }}>
            {isPlayingBack ? '👀 Watch the flashing sequence carefully...' : `YOUR TURN: Step ${userStep + 1} of ${sequence.length}`}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            {STAGES.map(s => {
              const isLit = activeHighlight === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleStageClick(s.id)}
                  disabled={isPlayingBack}
                  style={{
                    height: '85px',
                    borderRadius: '20px',
                    background: isLit ? '#fef08a' : '#f0f9ff',
                    border: isLit ? '3px solid #eab308' : '3px solid #bae6fd',
                    fontSize: '12px',
                    fontWeight: '900',
                    color: '#1e293b',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isPlayingBack ? 'not-allowed' : 'pointer',
                    boxShadow: isLit ? '0 0 16px rgba(234, 179, 8, 0.6)' : '0 4px 10px rgba(0,0,0,0.05)',
                    transform: isLit ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{s.emoji}</span>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px 0' }}>
          <div style={{ fontSize: '3.5rem' }}>🧩</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', marginTop: '6px' }}>Pattern Mastered!</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#15803d', margin: '6px 0 16px 0' }}>+20 ⭐ Stars Earned!</div>
          <button className="bubbly-btn-primary" onClick={startNewGame} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '12px 24px' }}>
            <RotateCcw size={16} /> Play Again 🔄
          </button>
        </div>
      )}
    </div>
  );
}