import React, { useState, useEffect, useRef } from 'react';

export default function ToothDash({ onComplete }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    running: false,
    lane: 1,
    visualX: 360,
    jumpTimer: 0,
    score: 0,
    lives: 3,
    timeLeft: 45,
    items: [],
    spawnClock: 0,
    lastFrame: 0,
    invulnMs: 0,
    roadOffset: 0,
  });

  const [ui, setUi] = useState({
    running: false,
    finished: false,
    score: 0,
    lives: 3,
    timeLeft: 45,
    message: 'Tap Start Race! Use the big buttons below, tap any lane, or use arrow keys.',
  });

  const moveLane = (delta) => {
    if (!stateRef.current.running) return;
    stateRef.current.lane = Math.max(0, Math.min(2, stateRef.current.lane + delta));
  };

  const setExactLane = (targetLane) => {
    if (!stateRef.current.running) return;
    stateRef.current.lane = Math.max(0, Math.min(2, targetLane));
  };

  const triggerJump = () => {
    if (!stateRef.current.running) return;
    if (stateRef.current.jumpTimer <= 0) {
      stateRef.current.jumpTimer = 24;
    }
  };

  const handleCanvasPointer = (e) => {
    if (!stateRef.current.running || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    if (relX < 0.36) setExactLane(0);
    else if (relX > 0.64) setExactLane(2);
    else triggerJump();
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (!stateRef.current.running) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'a', 'A', 'd', 'D', 'w', 'W'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') moveLane(-1);
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') moveLane(1);
      if (e.key === 'ArrowUp' || e.key === ' ' || e.key.toLowerCase() === 'w') triggerJump();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const s = stateRef.current;

    ctx.clearRect(0, 0, w, h);

    // Mint Grass & Sky Road
    ctx.fillStyle = '#bfe8d9';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#d9f2ff';
    ctx.fillRect(75, 0, 570, h);
    ctx.fillStyle = '#8cc9b1';
    ctx.fillRect(0, 0, 75, h);
    ctx.fillRect(645, 0, 75, h);

    // Lane Dividers & Animated Dashes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(265, 0, 6, h);
    ctx.fillRect(449, 0, 6, h);

    for (let y = (s.roadOffset % 80) - 80; y < h; y += 80) {
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.fillRect(168, y, 6, 34);
      ctx.fillRect(357, y, 6, 34);
      ctx.fillRect(546, y, 6, 34);
    }

    // Lane Labels
    ctx.font = '800 14px ui-rounded, system-ui, sans-serif';
    ctx.fillStyle = '#376b61';
    ctx.textAlign = 'center';
    ctx.fillText('LEFT LANE', 170, 28);
    ctx.fillText('CENTER', 360, 28);
    ctx.fillText('RIGHT LANE', 550, 28);

    // Falling Items
    const laneCenters = [170, 360, 550];
    s.items.forEach((it) => {
      const ix = laneCenters[it.lane];
      // Soft halo behind collectibles vs obstacles
      ctx.beginPath();
      ctx.arc(ix, it.y - 12, 26, 0, Math.PI * 2);
      ctx.fillStyle = it.bad ? 'rgba(255, 123, 123, 0.25)' : 'rgba(13, 148, 136, 0.22)';
      ctx.fill();

      ctx.font = '38px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(it.icon, ix, it.y);
    });

    // Smooth Glide Hero Tooth
    const targetX = laneCenters[s.lane];
    s.visualX += (targetX - s.visualX) * 0.28;
    const jumpArc = s.jumpTimer > 0 ? Math.sin((s.jumpTimer / 24) * Math.PI) * 95 : 0;
    const baseY = 365;
    const py = baseY - jumpArc;

    // Ground Shadow
    ctx.beginPath();
    ctx.ellipse(s.visualX, baseY + 12, Math.max(14, 30 - jumpArc * 0.16), 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(24, 50, 75, 0.16)';
    ctx.fill();

    // Blink effect during brief invulnerability
    if (s.invulnMs <= 0 || Math.floor(s.invulnMs / 90) % 2 === 0) {
      ctx.font = '58px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🦷', s.visualX, py);
    }
  };

  useEffect(() => {
    drawScene();
    let rafId = 0;

    const loop = (now) => {
      const s = stateRef.current;
      if (!s.running) return;

      const dt = Math.min(40, now - (s.lastFrame || now));
      s.lastFrame = now;
      s.spawnClock += dt;
      s.roadOffset += dt * 0.24;

      if (s.jumpTimer > 0) s.jumpTimer -= 1;
      if (s.invulnMs > 0) s.invulnMs -= dt;

      if (s.spawnClock >= 760) {
        s.spawnClock = 0;
        const isBad = Math.random() < 0.58;
        const badPool = ['🦠', '🍬', '🥤'];
        const goodPool = ['🪥', '💧', '🥕'];
        s.items.push({
          lane: Math.floor(Math.random() * 3),
          y: -30,
          bad: isBad,
          icon: isBad
            ? badPool[Math.floor(Math.random() * badPool.length)]
            : goodPool[Math.floor(Math.random() * goodPool.length)],
          hit: false,
        });
      }

      const speed = dt * 0.21;
      s.items.forEach((it) => {
        it.y += speed;
        if (!it.hit && it.lane === s.lane && it.y > 335 && it.y < 392) {
          if (it.bad) {
            if (s.jumpTimer <= 4 && s.invulnMs <= 0) {
              s.lives -= 1;
              s.invulnMs = 950;
              setUi((prev) => ({
                ...prev,
                lives: s.lives,
                message: 'Oops! Watch out for sticky sugar bugs—dodge or jump over them!',
              }));
            }
          } else {
            s.score += 1;
            setUi((prev) => ({
              ...prev,
              score: s.score,
              message: 'Awesome catch! Healthy helper collected! +2 stars',
            }));
          }
          it.hit = true;
        }
      });

      s.items = s.items.filter((it) => it.y < 475 && !it.hit);
      s.timeLeft -= dt / 1000;

      drawScene();

      if (s.lives <= 0 || s.timeLeft <= 0 || s.score >= 15) {
        s.running = false;
        const starsEarned = Math.max(10, s.score * 2);
        if (typeof onComplete === 'function') onComplete(starsEarned);
        setUi({
          running: false,
          finished: true,
          score: s.score,
          lives: Math.max(0, s.lives),
          timeLeft: Math.max(0, Math.ceil(s.timeLeft)),
          message:
            s.score >= 15
              ? `🎉 Amazing! You collected 15 healthy helpers and earned +${starsEarned} stars!`
              : `🏁 Race finished! You collected ${s.score} healthy helpers and earned +${starsEarned} stars!`,
        });
        return;
      }

      setUi((prev) => ({
        ...prev,
        score: s.score,
        lives: s.lives,
        timeLeft: Math.max(0, Math.ceil(s.timeLeft)),
      }));

      rafId = requestAnimationFrame(loop);
    };

    if (ui.running) {
      stateRef.current.lastFrame = performance.now();
      rafId = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(rafId);
  }, [ui.running]);

  const startRace = () => {
    stateRef.current = {
      running: true,
      lane: 1,
      visualX: 360,
      jumpTimer: 0,
      score: 0,
      lives: 3,
      timeLeft: 45,
      items: [],
      spawnClock: 0,
      lastFrame: performance.now(),
      invulnMs: 0,
      roadOffset: 0,
    };
    setUi({
      running: true,
      finished: false,
      score: 0,
      lives: 3,
      timeLeft: 45,
      message: 'Go Smile Hero! Grab 🪥 💧 🥕 and avoid 🦠 🍬 🥤!',
    });
  };

  return (
    <div style={{ background: '#eaf7ff', borderRadius: '20px', padding: '16px' }}>
      <p style={{ color: '#405a70', margin: '0 0 12px', lineHeight: 1.5 }}>
        Tap the big <strong>Left</strong>, <strong>Jump</strong>, or <strong>Right</strong>{' '}
        buttons—or tap directly on the track lanes—to collect toothbrushes, water, and carrots!
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 900,
          marginBottom: '10px',
          fontSize: '1rem',
        }}
      >
        <span>⭐ Helpers: {ui.score} / 15</span>
        <span>
          {'❤️'.repeat(ui.lives)}
          {'🤍'.repeat(Math.max(0, 3 - ui.lives))}
        </span>
        <span>⏱️ {ui.timeLeft}s</span>
      </div>

      <canvas
        ref={canvasRef}
        width={720}
        height={420}
        onClick={handleCanvasPointer}
        style={{
          display: 'block',
          width: '100%',
          borderRadius: '18px',
          border: '4px solid #b8ddec',
          background: '#bfe8d9',
          cursor: 'pointer',
          touchAction: 'manipulation',
        }}
      />

      {/* Big Easy-to-Press Action Buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '10px',
          margin: '14px 0',
        }}
      >
        <button
          className="bb-btn bb-btn--secondary"
          style={{ padding: '15px 10px', fontSize: '1.05rem' }}
          onClick={() => moveLane(-1)}
          disabled={!ui.running}
        >
          ⬅️ Left
        </button>
        <button
          className="bb-btn bb-btn--gold"
          style={{ padding: '15px 10px', fontSize: '1.05rem' }}
          onClick={triggerJump}
          disabled={!ui.running}
        >
          ⬆️ Jump
        </button>
        <button
          className="bb-btn bb-btn--secondary"
          style={{ padding: '15px 10px', fontSize: '1.05rem' }}
          onClick={() => moveLane(1)}
          disabled={!ui.running}
        >
          Right ➡️
        </button>
      </div>

      <div
        style={{
          background: '#e0f8ed',
          borderRadius: '14px',
          padding: '12px',
          textAlign: 'center',
          fontWeight: 800,
          marginBottom: '12px',
        }}
      >
        {ui.message}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="bb-btn bb-btn--primary" onClick={startRace}>
          {ui.running ? '↻ Restart Race' : ui.finished ? '▶ Race Again' : '▶ Start Race'}
        </button>
      </div>
    </div>
  );
}