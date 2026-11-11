import React, { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function BrushingBeat({ onBack, onComplete }) {
  const [tapCount, setTapCount] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const handleTap = () => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    if (nextCount >= 12) {
      setIsDone(true);
      onComplete(20, 'Game Explorer');
    }
  };

  const restartGame = () => {
    setTapCount(0);
    setIsDone(false);
  };

  return (
    <div className="bubbly-card" style={{ textAlign: 'center', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontWeight: '900', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ fontWeight: '900', color: '#0284c7', fontSize: '14px' }}>🎵 Brushing Beat</div>
      </div>

      {!isDone ? (
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '16px' }}>
            Tap the toothbrush to keep the 2-minute brushing beat! ({tapCount} / 12)
          </div>
          <button
            onClick={handleTap}
            style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
              border: '4px solid #ffffff',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.4)',
              fontSize: '3.2rem',
              cursor: 'pointer',
              transition: 'transform 0.08s active',
              transform: 'scale(1)'
            }}
          >
            🪥
          </button>
        </div>
      ) : (
        <div style={{ padding: '20px 0' }}>
          <div style={{ fontSize: '3.5rem' }}>🎵</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', marginTop: '6px' }}>Perfect Rhythm!</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#15803d', margin: '6px 0 16px 0' }}>+20 ⭐ Stars Earned!</div>
          <button className="bubbly-btn-primary" onClick={restartGame} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '12px 24px' }}>
            <RotateCcw size={16} /> Play Again
          </button>
        </div>
      )}
    </div>
  );
}