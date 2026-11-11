import React, { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function ClinicCleaner({ onBack, onComplete }) {
  const [dirtSpots, setDirtSpots] = useState([true, true, true, true, true]);
  const [isDone, setIsDone] = useState(false);

  const cleanSpot = (idx) => {
    setDirtSpots(prev => {
      const next = [...prev];
      next[idx] = false;
      if (next.every(spot => !spot)) {
        setIsDone(true);
        onComplete(20, 'Game Explorer');
      }
      return next;
    });
  };

  const resetGame = () => {
    setDirtSpots([true, true, true, true, true]);
    setIsDone(false);
  };

  return (
    <div className="bubbly-card" style={{ textAlign: 'center', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontWeight: '900', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ fontWeight: '900', color: '#0284c7', fontSize: '14px' }}>🧼 Clinic Cleaner</div>
      </div>

      {!isDone ? (
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '12px' }}>
            Tap the germ spots to polish the tooth clean!
          </div>

          <div style={{
            position: 'relative',
            width: '160px',
            height: '160px',
            margin: '0 auto 16px auto',
            background: '#f0f9ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '5.5rem',
            border: '4px solid #bae6fd',
            boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
          }}>
            🦷
            {dirtSpots[0] && <button onClick={() => cleanSpot(0)} style={{ position: 'absolute', top: '15px', left: '30px', background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer' }}>🧫</button>}
            {dirtSpots[1] && <button onClick={() => cleanSpot(1)} style={{ position: 'absolute', top: '15px', right: '30px', background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer' }}>🧫</button>}
            {dirtSpots[2] && <button onClick={() => cleanSpot(2)} style={{ position: 'absolute', bottom: '20px', left: '25px', background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer' }}>🧫</button>}
            {dirtSpots[3] && <button onClick={() => cleanSpot(3)} style={{ position: 'absolute', bottom: '20px', right: '25px', background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer' }}>🧫</button>}
            {dirtSpots[4] && <button onClick={() => cleanSpot(4)} style={{ position: 'absolute', top: '70px', left: '68px', background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer' }}>🧫</button>}
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px 0' }}>
          <div style={{ fontSize: '3.5rem' }}>✨</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', marginTop: '6px' }}>Tooth Cleaned!</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#0284c7', margin: '6px 0 16px 0' }}>+20 ⭐ Stars Earned!</div>
          <button className="bubbly-btn-primary" onClick={resetGame} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '12px 24px' }}>
            <RotateCcw size={16} /> Clean Another
          </button>
        </div>
      )}
    </div>
  );
}