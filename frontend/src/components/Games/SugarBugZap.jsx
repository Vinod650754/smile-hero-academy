import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function SugarBugZap({ onBack, onComplete }) {
  const [grid, setGrid] = useState([false, false, false, false, false, false]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let spawnTimer = null;
    let clockTimer = null;

    if (isActive && timeLeft > 0) {
      spawnTimer = setInterval(() => {
        setGrid(prev => {
          const next = [false, false, false, false, false, false];
          const randomIdx = Math.floor(Math.random() * 6);
          next[randomIdx] = true;
          return next;
        });
      }, 650);

      clockTimer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      onComplete(score * 2, 'Game Explorer');
    }

    return () => {
      clearInterval(spawnTimer);
      clearInterval(clockTimer);
    };
  }, [isActive, timeLeft, score, onComplete]);

  const handleZap = (index) => {
    if (!grid[index] || !isActive) return;
    setGrid(prev => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
    setScore(s => s + 1);
  };

  const restartGame = () => {
    setGrid([false, false, false, false, false, false]);
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
        <div style={{ fontWeight: '900', color: '#ef4444', fontSize: '14px' }}>🔨 Sugar Bug Zap</div>
      </div>

      {isActive ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '900', color: '#1e293b', marginBottom: '10px' }}>
            <span>⏱️ Time: {timeLeft}s</span>
            <span>⭐ Zapped: {score}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
            {grid.map((hasGerm, i) => (
              <button
                key={i}
                onClick={() => handleZap(i)}
                style={{
                  height: '85px',
                  borderRadius: '20px',
                  background: hasGerm ? '#fee2e2' : '#ffffff',
                  border: hasGerm ? '3px solid #ef4444' : '3px solid #bae6fd',
                  fontSize: '2.4rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.06)',
                  transition: 'all 0.15s ease',
                  transform: hasGerm ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                {hasGerm ? '🦠' : '🦷'}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px 0' }}>
          <div style={{ fontSize: '3.5rem' }}>🏆</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', marginTop: '6px' }}>Zap Finished!</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#ef4444', margin: '6px 0 16px 0' }}>Zapped {score} Sugar Bugs! +{score * 2} ⭐ Stars!</div>
          <button className="bubbly-btn-primary" onClick={restartGame} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '12px 24px' }}>
            <RotateCcw size={16} /> Play Again
          </button>
        </div>
      )}
    </div>
  );
}