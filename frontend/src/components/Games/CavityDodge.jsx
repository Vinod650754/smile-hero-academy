import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function CavityDodge({ onBack, onComplete }) {
  const [posX, setPosX] = useState(50); // Position percentage 0 - 100%
  const [item, setItem] = useState({ x: 50, y: 0, type: 'caramel' });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    let loop = null;
    if (!isGameOver) {
      loop = setInterval(() => {
        setItem(prev => {
          if (prev.y >= 85) {
            // Check collision with player tooth position
            if (Math.abs(prev.x - posX) < 20) {
              if (prev.type === 'apple') {
                setScore(s => s + 5);
              } else {
                setLives(l => {
                  const newLives = l - 1;
                  if (newLives <= 0) {
                    setIsGameOver(true);
                    onComplete(score + 5, 'Game Explorer');
                  }
                  return newLives;
                });
              }
            }
            return {
              x: Math.floor(Math.random() * 80) + 10,
              y: 0,
              type: Math.random() > 0.4 ? 'caramel' : 'apple'
            };
          }
          return { ...prev, y: prev.y + 10 };
        });
      }, 100);
    }
    return () => clearInterval(loop);
  }, [posX, isGameOver, score, onComplete]);

  const restartGame = () => {
    setPosX(50);
    setItem({ x: 50, y: 0, type: 'caramel' });
    setScore(0);
    setLives(3);
    setIsGameOver(false);
  };

  return (
    <div className="bubbly-card" style={{ textAlign: 'center', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontWeight: '900', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ fontWeight: '900', color: '#0284c7', fontSize: '14px' }}>⚡ Cavity Dodge</div>
      </div>

      {!isGameOver ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '900', color: '#1e293b', marginBottom: '8px' }}>
            <span>❤️ Lives: {lives}</span>
            <span>⭐ Score: {score}</span>
          </div>

          <div style={{ position: 'relative', height: '220px', background: 'linear-gradient(180deg, #bae6fd 0%, #e0f2fe 100%)', borderRadius: '20px', border: '3px solid #0284c7', overflow: 'hidden', marginBottom: '12px' }}>
            {/* Falling Item */}
            <div style={{ position: 'absolute', top: `${item.y}%`, left: `${item.x}%`, transform: 'translateX(-50%)', fontSize: '2rem' }}>
              {item.type === 'caramel' ? '🍬' : '🍎'}
            </div>

            {/* Player Tooth */}
            <div style={{ position: 'absolute', bottom: '10px', left: `${posX}%`, transform: 'translateX(-50%)', fontSize: '2.4rem', transition: 'left 0.1s linear' }}>
              🦷
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button className="bubbly-btn-primary" onClick={() => setPosX(p => Math.max(15, p - 25))}>◀ DODGE LEFT</button>
            <button className="bubbly-btn-primary" onClick={() => setPosX(p => Math.min(85, p + 25))}>DODGE RIGHT ▶</button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px 0' }}>
          <div style={{ fontSize: '3.5rem' }}>🏆</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', marginTop: '6px' }}>Run Finished!</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#0284c7', margin: '6px 0 16px 0' }}>Final Score: {score} points!</div>
          <button className="bubbly-btn-primary" onClick={restartGame} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '12px 24px' }}>
            <RotateCcw size={16} /> Play Again
          </button>
        </div>
      )}
    </div>
  );
}