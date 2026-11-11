import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StainEraser({ onBack, onComplete }) {
  const canvasRef = useRef(null);
  const [cleanPercent, setCleanPercent] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const isScrubbing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // 1. Draw Clean Tooth Surface
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Tooth Smile Art
    ctx.font = '5rem sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🦷', width / 2, height / 2);

    // 2. Draw Stain Layer over top
    const stainCanvas = document.createElement('canvas');
    stainCanvas.width = width;
    stainCanvas.height = height;
    const sCtx = stainCanvas.getContext('2d');

    // Create realistic food dark stain overlay
    sCtx.fillStyle = 'rgba(120, 53, 15, 0.85)';
    sCtx.beginPath();
    sCtx.arc(width * 0.35, height * 0.4, 35, 0, Math.PI * 2);
    sCtx.arc(width * 0.65, height * 0.55, 42, 0, Math.PI * 2);
    sCtx.arc(width * 0.5, height * 0.35, 30, 0, Math.PI * 2);
    sCtx.fill();

    // Render stain layer onto main canvas
    ctx.drawImage(stainCanvas, 0, 0);

    let clearedPixels = 0;
    const totalStainArea = width * height * 0.2;

    const scrubAtPoint = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Erase stain at pointer coordinates with soft bristle radius
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      // Draw bristle sparkle particle effect
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20, 3, 0, Math.PI * 2);
      ctx.fill();

      clearedPixels += 150;
      const progress = Math.min(100, Math.floor((clearedPixels / totalStainArea) * 100));
      setCleanPercent(progress);

      if (progress >= 100 && !isComplete) {
        setIsComplete(true);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        onComplete(20, 'Game Explorer');
      }
    };

    // Mouse & Touch scrub handlers
    const handleDown = (e) => {
      isScrubbing.current = true;
      const pos = e.touches ? e.touches[0] : e;
      scrubAtPoint(pos.clientX, pos.clientY);
    };

    const handleMove = (e) => {
      if (!isScrubbing.current) return;
      const pos = e.touches ? e.touches[0] : e;
      scrubAtPoint(pos.clientX, pos.clientY);
    };

    const handleUp = () => { isScrubbing.current = false; };

    canvas.addEventListener('mousedown', handleDown);
    canvas.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    canvas.addEventListener('touchstart', handleDown);
    canvas.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleUp);

    return () => {
      canvas.removeEventListener('mousedown', handleDown);
      canvas.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      canvas.removeEventListener('touchstart', handleDown);
      canvas.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isComplete, onComplete]);

  return (
    <div className="bubbly-card" style={{ textAlign: 'center', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontWeight: '900', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ fontWeight: '900', color: '#0284c7', fontSize: '14px' }}>✨ Stain Eraser</div>
      </div>

      {!isComplete ? (
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px' }}>
            Rub your finger or mouse over dark spots to scrub enamel clean!
          </div>

          <div style={{ fontSize: '12px', fontWeight: '900', color: '#0284c7', marginBottom: '10px' }}>
            Cleaned: {cleanPercent}%
          </div>

          {/* Interactive Scrubbing Canvas */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '220px',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '3px solid #0284c7',
            boxShadow: '0 6px 16px rgba(2, 132, 199, 0.15)',
            touchAction: 'none'
          }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer' }} />
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px 0' }}>
          <div style={{ fontSize: '3.5rem' }}>✨</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', marginTop: '6px' }}>Tooth Sparkling Clean!</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#15803d', margin: '6px 0 16px 0' }}>+20 ⭐ Stars Earned!</div>
          <button className="bubbly-btn-primary" onClick={() => window.location.reload()} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '12px 24px' }}>
            <RotateCcw size={16} /> Scrub Again 🔄
          </button>
        </div>
      )}
    </div>
  );
}