import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function FlossRunner({ onBack, onComplete }) {
  const [flossPos, setFlossPos] = useState(0); // 0: Top, 1: Middle, 2: Bottom
  const [plaqueGaps, setPlaqueGaps] = useState([true, true, true]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let timer = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      onComplete(score * 4, 'Game Explorer');
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, score, onComplete]);

  const moveFloss = (direction) => {
    if (!isActive) return;
    const nextPos = direction === 'up' ? Math.max(0, flossPos - 1) : Math.min(2, flossPos + 1);
    setFlossPos(nextPos);

    if (plaqueGaps[nextPos]) {
      setPlaqueGaps(prev => {
        const next = [...prev];
        next[nextPos] = false;
        return next;
      });
      setScore(s => s + 5);

      // Respawn plaque if all cleared
      setTimeout(() => {
        setPlaqueGaps([Math.random() > 0.3, Math.random() > 0.3, Math.random() > 0.3]);
      }, 400);
    }
  };

  const restartGame = () => {
    setFlossPos(0);
    setPlaqueGaps([true, true, true]);
    setScore(0);
    setTimeLeft(15);
    setIsActive(true);
  };

  return (
    <div className="bubbly-card" style={{ textAlign: 'center', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontWeight: '900', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ fontWeight: '900', color: '#0284c7', fontSize: '14px' }}>🧵 Floss Runner</div>
      </div>

      {isActive ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '900', color: '#1e293b', marginBottom: '8px' }}>
            <span>⏱️ Time: {timeLeft}s</span>
            <span>⭐ Score: {score}</span>
          </div>

          {/* Tooth Gaps Visualization */}
          <div style={{ position: 'relative', height: '210px', background: '#f0f9ff', borderRadius: '20px', border: '3px solid #bae6fd', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: '10px 20px', marginBottom: '12px' }}>
            {[0, 1, 2].map(idx => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px', borderBottom: idx < 2 ? '2px dashed #bae6fd' : 'none' }}>
                <span style={{ fontSize: '2rem' }}>🦷</span>
                <span style={{ fontSize: '1.4rem', visibility: plaqueGaps[idx] ? 'visible' : 'hidden', transition: 'opacity 0.2s' }}>🦠</span>
                <span style={{ fontSize: '2rem' }}>🦷</span>

                {/* Floss String Cursor */}
                {flossPos === idx && (
                  <div style={{ position: 'absolute', left: '15%', right: '15%', height: '6px', background: '#0284c7', borderRadius: '4px', boxShadow: '0 0 10px #38bdf8' }} />
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button className="bubbly-btn-primary" onClick={() => moveFloss('up')}>▲ SLIDE UP</button>
            <button className="bubbly-btn-primary" onClick={() => moveFloss('down')}>▼ SLIDE DOWN</button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px 0' }}>
          <div style={{ fontSize: '3.5rem' }}>🧵</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', marginTop: '6px' }}>Flossing Complete!</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#0284c7', margin: '6px 0 16px 0' }}>Score: {score} points!</div>
          <button className="bubbly-btn-primary" onClick={restartGame} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '12px 24px' }}>
            <RotateCcw size={16} /> Play Again
          </button>
        </div>
      )}
    </div>
  );
}