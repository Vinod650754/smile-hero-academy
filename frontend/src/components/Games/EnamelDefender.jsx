import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function EnamelDefender({ onBack, onComplete }) {
  const [shieldAngle, setShieldAngle] = useState(0); // 0: Top, 90: Right, 180: Bottom, 270: Left
  const [acidPos, setAcidPos] = useState({ angle: 0, distance: 100 });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    let loop = null;
    if (!isGameOver) {
      loop = setInterval(() => {
        setAcidPos(prev => {
          if (prev.distance <= 25) {
            // Check shield angle alignment
            if (prev.angle === shieldAngle) {
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
            // Spawn next drop from a random angle (0, 90, 180, 270)
            const angles = [0, 90, 180, 270];
            return { angle: angles[Math.floor(Math.random() * 4)], distance: 100 };
          }
          return { ...prev, distance: prev.distance - 8 };
        });
      }, 100);
    }
    return () => clearInterval(loop);
  }, [shieldAngle, isGameOver, score, onComplete]);

  const rotateShield = () => {
    setShieldAngle(prev => (prev + 90) % 360);
  };

  const restartGame = () => {
    setShieldAngle(0);
    setAcidPos({ angle: 0, distance: 100 });
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
        <div style={{ fontWeight: '900', color: '#0284c7', fontSize: '14px' }}>🛡️ Enamel Defender</div>
      </div>

      {!isGameOver ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '900', color: '#1e293b', marginBottom: '10px' }}>
            <span>❤️ Lives: {lives}</span>
            <span>⭐ Score: {score}</span>
          </div>

          {/* Defense Ring Area */}
          <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 14px auto', background: '#f0f9ff', borderRadius: '50%', border: '3px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Center Tooth */}
            <span style={{ fontSize: '3rem' }}>🦷</span>

            {/* Shield Position Indicator */}
            <div style={{
              position: 'absolute',
              width: '50px',
              height: '8px',
              background: '#0284c7',
              borderRadius: '4px',
              transform: `rotate(${shieldAngle}deg) translateY(-45px)`,
              transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }} />

            {/* Falling Acid Drop */}
            <div style={{
              position: 'absolute',
              fontSize: '1.4rem',
              transform: `rotate(${acidPos.angle}deg) translateY(-${acidPos.distance}px)`
            }}>
              🧪
            </div>
          </div>

          <button className="bubbly-btn-primary" onClick={rotateShield}>
            ↻ ROTATE SHIELD (90°)
          </button>
        </div>
      ) : (
        <div style={{ padding: '20px 0' }}>
          <div style={{ fontSize: '3.5rem' }}>🛡️</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', marginTop: '6px' }}>Defense Finished!</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#0284c7', margin: '6px 0 16px 0' }}>Final Score: {score} points!</div>
          <button className="bubbly-btn-primary" onClick={restartGame} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '12px 24px' }}>
            <RotateCcw size={16} /> Play Again
          </button>
        </div>
      )}
    </div>
  );
}