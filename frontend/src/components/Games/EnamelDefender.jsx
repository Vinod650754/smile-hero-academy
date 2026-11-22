import React, { useState, useEffect, useRef } from 'react';

export default function EnamelDefender({ onComplete }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    running: false,
    shieldAngle: -Math.PI / 2,
    enemies: [],
    pulses: [],
    particles: [],
    blocked: 0,
    hp: 100,
    timeLeft: 45,
    spawnClock: 0,
    lastFrame: 0,
    toothHappyTimer: 0,
  });

  const [ui, setUi] = useState({
    running: false,
    finished: false,
    blocked: 0,
    hp: 100,
    timeLeft: 45,
    message: 'Move or tap around the Hero Tooth to aim your 360° Fluoride Shield!',
  });

  const aimAtPointer = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = e.clientX - rect.left - cx;
    const dy = e.clientY - rect.top - cy;
    stateRef.current.shieldAngle = Math.atan2(dy, dx);
  };

  const triggerMintPulse = () => {
    const s = stateRef.current;
    if (!s.running) return;
    // Allow 1 active expanding mint wave at a time
    if (s.pulses.length === 0) {
      s.pulses.push({ r: 58, maxR: 185, alpha: 0.9 });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId = 0;

    const angleDiff = (a, b) => {
      let d = a - b;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      return Math.abs(d);
    };

    const render = (now) => {
      const s = stateRef.current;
      const dt = Math.min(35, now - (s.lastFrame || now));
      s.lastFrame = now;

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      ctx.clearRect(0, 0, W, H);

      // 1. Deep Frosted Radial Arena Backdrop
      const bg = ctx.createRadialGradient(cx, cy, 30, cx, cy, 320);
      bg.addColorStop(0, '#ffffff');
      bg.addColorStop(0.55, '#e0f2fe');
      bg.addColorStop(1, '#dbeafe');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Concentric Radar Rings
      [92, 145, 195].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(2, 132, 199, 0.12)';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // 2. Expanding Mint Shockwave Pulses
      s.pulses.forEach((p) => {
        p.r += 5.2;
        p.alpha = Math.max(0, 1 - p.r / p.maxR);
        ctx.beginPath();
        ctx.arc(cx, cy, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(13, 148, 136, ${p.alpha})`;
        ctx.lineWidth = 6;
        ctx.stroke();
      });
      s.pulses = s.pulses.filter((p) => p.r < p.maxR);

      // 3. Center Hero Molar Tooth Core
      ctx.beginPath();
      ctx.arc(cx, cy, 52, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#bae6fd';
      ctx.stroke();

      ctx.font = '50px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🦷', cx, cy + 2);

      // 4. Curved 360° Fluoride Energy Shield Arc
      const shieldRadius = 78;
      const arcSpan = 1.15; // ~66 degrees wide
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, shieldRadius, s.shieldAngle - arcSpan / 2, s.shieldAngle + arcSpan / 2);
      ctx.strokeStyle = '#0d9488';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(13, 148, 136, 0.45)';
      ctx.shadowBlur = 14;
      ctx.stroke();

      // Inner Glass Specular Highlight on Shield
      ctx.beginPath();
      ctx.arc(cx, cy, shieldRadius, s.shieldAngle - arcSpan / 2 + 0.08, s.shieldAngle + arcSpan / 2 - 0.08);
      ctx.strokeStyle = '#a7f3d0';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      // 5. Spawn & Update 360° Incoming Acid Comets
      if (s.running) {
        s.spawnClock += dt;
        const spawnRate = Math.max(680, 1150 - s.blocked * 22);
        if (s.spawnClock >= spawnRate) {
          s.spawnClock = 0;
          const ang = Math.random() * Math.PI * 2;
          const dist = 285;
          const icons = ['🧪', '🥤', '🍭', '🦠'];
          s.enemies.push({
            x: cx + Math.cos(ang) * dist,
            y: cy + Math.sin(ang) * dist,
            angle: ang,
            speed: 1.45 + Math.min(1.3, s.blocked * 0.05),
            icon: icons[Math.floor(Math.random() * icons.length)],
            done: false,
          });
        }

        s.enemies.forEach((en) => {
          const dx = cx - en.x;
          const dy = cy - en.y;
          const dist = Math.hypot(dx, dy);
          en.x += (dx / dist) * en.speed;
          en.y += (dy / dist) * en.speed;

          // Comet Trail
          ctx.beginPath();
          ctx.moveTo(en.x, en.y);
          ctx.lineTo(en.x - (dx / dist) * 24, en.y - (dy / dist) * 24);
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.28)';
          ctx.lineWidth = 10;
          ctx.lineCap = 'round';
          ctx.stroke();

          ctx.font = '30px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(en.icon, en.x, en.y);

          // Check Mint Pulse Zap
          s.pulses.forEach((p) => {
            if (!en.done && Math.abs(dist - p.r) < 18) {
              en.done = true;
              s.blocked += 1;
              for (let k = 0; k < 10; k++) {
                s.particles.push({
                  x: en.x,
                  y: en.y,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  life: 1,
                  color: '#0d9488',
                });
              }
            }
          });

          // Check Curved Shield Deflection
          const incomingAngle = Math.atan2(en.y - cy, en.x - cx);
          if (
            !en.done &&
            dist <= shieldRadius + 14 &&
            dist >= shieldRadius - 14 &&
            angleDiff(incomingAngle, s.shieldAngle) <= arcSpan / 2 + 0.12
          ) {
            en.done = true;
            s.blocked += 1;
            for (let k = 0; k < 12; k++) {
              s.particles.push({
                x: en.x,
                y: en.y,
                vx: (Math.random() - 0.5) * 4.5,
                vy: (Math.random() - 0.5) * 4.5,
                life: 1,
                color: '#14b8a6',
              });
            }
            setUi((prev) => ({
              ...prev,
              blocked: s.blocked,
              message: '🛡️ Deflected! Fluoride shield neutralized the acid wave!',
            }));
          } else if (!en.done && dist <= 46) {
            en.done = true;
            s.hp = Math.max(0, s.hp - 20);
            for (let k = 0; k < 10; k++) {
              s.particles.push({
                x: en.x,
                y: en.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1,
                color: '#f43f5e',
              });
            }
            setUi((prev) => ({
              ...prev,
              hp: s.hp,
              message: '⚠️ Acid hit the enamel! Rotate your shield toward incoming comets!',
            }));
          }
        });

        s.enemies = s.enemies.filter((en) => !en.done);
        s.timeLeft -= dt / 1000;

        if (s.hp <= 0 || s.timeLeft <= 0) {
          s.running = false;
          const stars = Math.max(12, s.blocked * 2);
          if (typeof onComplete === 'function') onComplete(stars);
          setUi({
            running: false,
            finished: true,
            blocked: s.blocked,
            hp: s.hp,
            timeLeft: 0,
            message: `🏆 Enamel Protected! You blocked ${s.blocked} acid attacks and earned +${stars} stars!`,
          });
        } else {
          setUi((prev) => ({
            ...prev,
            timeLeft: Math.max(0, Math.ceil(s.timeLeft)),
          }));
        }
      }

      // 6. Sparkle Particles
      s.particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 0.04;
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      s.particles = s.particles.filter((pt) => pt.life > 0);

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  const startDefense = () => {
    stateRef.current = {
      running: true,
      shieldAngle: -Math.PI / 2,
      enemies: [],
      pulses: [],
      particles: [],
      blocked: 0,
      hp: 100,
      timeLeft: 45,
      spawnClock: 0,
      lastFrame: performance.now(),
      toothHappyTimer: 0,
    };
    setUi({
      running: true,
      finished: false,
      blocked: 0,
      hp: 100,
      timeLeft: 45,
      message: 'Slide finger or cursor around the tooth to rotate your 360° Fluoride Shield!',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Glass HUD */}
      <div
        className="bb-glass-hud"
        style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900 }}
      >
        <span>🛡️ Blocked: {ui.blocked}</span>
        <span>🦷 Enamel: {ui.hp}%</span>
        <span>⏱️ {ui.timeLeft}s</span>
      </div>

      <canvas
        ref={canvasRef}
        width={640}
        height={380}
        onPointerMove={aimAtPointer}
        onPointerDown={(e) => {
          aimAtPointer(e);
          triggerMintPulse();
        }}
        style={{
          width: '100%',
          borderRadius: '26px',
          border: '2px solid rgba(255,255,255,0.92)',
          boxShadow: '0 16px 36px rgba(16, 42, 67, 0.12)',
          cursor: 'crosshair',
          touchAction: 'none',
        }}
      />

      <button
        type="button"
        className="bb-btn bb-btn--gold"
        disabled={!ui.running}
        onClick={triggerMintPulse}
        style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
      >
        ✨ Trigger 360° Mint Shockwave
      </button>

      <div
        className="bb-glass-hud"
        style={{ borderRadius: '18px', textAlign: 'center', fontWeight: 800 }}
      >
        {ui.message}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="bb-btn bb-btn--primary" onClick={startDefense}>
          {ui.running ? '↻ Restart Orbit Defense' : ui.finished ? '▶ Defend Again' : '▶ Start 360° Defense'}
        </button>
      </div>
    </div>
  );
}