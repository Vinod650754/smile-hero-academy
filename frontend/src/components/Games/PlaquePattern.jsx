import React, { useState, useEffect } from 'react';

const ZONES = [
  { id: 0, label: 'Top Right', icon: '🦷', color: '#0d9488', soft: '#dff8ef' },
  { id: 1, label: 'Top Left', icon: '🪥', color: '#f59e0b', soft: '#fff1d4' },
  { id: 2, label: 'Bottom Left', icon: '💧', color: '#3b82f6', soft: '#e6f6ff' },
  { id: 3, label: 'Bottom Right', icon: '✨', color: '#8b5cf6', soft: '#eee8ff' },
];

export default function PlaquePattern({ onComplete }) {
  const [sequence, setSequence] = useState([]);
  const [userStep, setUserStep] = useState(0);
  const [activeTile, setActiveTile] = useState(null);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'showing' | 'input' | 'won' | 'over'
  const [round, setRound] = useState(0);

  const playSequence = (seq) => {
    setPhase('showing');
    setUserStep(0);
    seq.forEach((tileId, index) => {
      setTimeout(() => {
        setActiveTile(tileId);
        setTimeout(() => setActiveTile(null), 420);
      }, (index + 1) * 720);
    });
    setTimeout(() => {
      setPhase('input');
    }, (seq.length + 1) * 720);
  };

  const startNewGame = () => {
    const first = [Math.floor(Math.random() * 4)];
    setSequence(first);
    setRound(1);
    playSequence(first);
  };

  const handleTileTap = (id) => {
    if (phase !== 'input') return;

    setActiveTile(id);
    setTimeout(() => setActiveTile(null), 220);

    if (id !== sequence[userStep]) {
      setPhase('over');
      const earned = Math.max(5, (round - 1) * 5);
      if (typeof onComplete === 'function') onComplete(earned);
      return;
    }

    const nextStep = userStep + 1;
    if (nextStep === sequence.length) {
      if (round >= 5) {
        setPhase('won');
        if (typeof onComplete === 'function') onComplete(25);
      } else {
        const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(nextSeq);
        setRound((r) => r + 1);
        setTimeout(() => playSequence(nextSeq), 650);
      }
    } else {
      setUserStep(nextStep);
    }
  };

  useEffect(() => {
    return () => setActiveTile(null);
  }, []);

  return (
    <div style={{ background: '#f5fbff', borderRadius: '20px', padding: '18px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 900,
          marginBottom: '12px',
        }}
      >
        <span>🔍 Round: {round} / 5</span>
        <span
          style={{
            padding: '6px 12px',
            borderRadius: '99px',
            background: phase === 'input' ? '#dff8ef' : '#fff4d4',
            color: '#18324b',
            fontSize: '0.88rem',
          }}
        >
          {phase === 'idle' && 'Ready to Start'}
          {phase === 'showing' && '👀 Watch the Glowing Zones!'}
          {phase === 'input' && '👆 Your Turn — Tap in Order!'}
          {phase === 'won' && '🏆 Pattern Master!'}
          {phase === 'over' && '💡 Good Try!'}
        </span>
      </div>

      {/* 2x2 Animated Tooth Zone Pad */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '14px',
          maxWidth: '420px',
          margin: '16px auto',
        }}
      >
        {ZONES.map((z) => {
          const isLit = activeTile === z.id;
          return (
            <button
              key={z.id}
              onClick={() => handleTileTap(z.id)}
              disabled={phase !== 'input'}
              style={{
                height: '132px',
                borderRadius: '24px',
                border: `4px solid ${isLit ? z.color : '#dce9f2'}`,
                background: isLit ? z.color : z.soft,
                color: isLit ? '#ffffff' : '#18324b',
                transform: isLit ? 'scale(1.06)' : 'scale(1)',
                boxShadow: isLit
                  ? `0 12px 26px ${z.color}55`
                  : '0 6px 16px rgba(24, 50, 75, 0.05)',
                transition: 'all 0.16s ease',
                cursor: phase === 'input' ? 'pointer' : 'default',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontWeight: 900,
              }}
            >
              <span style={{ fontSize: '2.4rem' }}>{z.icon}</span>
              <span style={{ fontSize: '0.95rem' }}>{z.label}</span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '12px',
          textAlign: 'center',
          fontWeight: 800,
          marginBottom: '14px',
        }}
      >
        {phase === 'idle' &&
          'Watch which tooth zones light up, then repeat the sequence to clear hidden plaque!'}
        {phase === 'showing' && 'Pay close attention to the order the tooth zones glow...'}
        {phase === 'input' &&
          `Tap tile ${userStep + 1} of ${sequence.length} in the exact same order!`}
        {phase === 'won' &&
          '🎉 Amazing memory! You cleared all 5 plaque patterns and earned +25 stars!'}
        {phase === 'over' &&
          `You reached Round ${round} and earned +${Math.max(5, (round - 1) * 5)} stars! Try again to beat all 5 rounds!`}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="bb-btn bb-btn--primary" onClick={startNewGame}>
          {phase === 'idle' ? '▶ Start Pattern Game' : '↻ Play Again'}
        </button>
      </div>
    </div>
  );
}