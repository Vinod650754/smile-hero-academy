import React, { useState, useEffect, useRef } from 'react';

const CANVAS_W = 680;
const CANVAS_H = 380;
const GRAVITY = 0.34;
const JUMP_IMPULSE = -6.8;
const PIPE_WIDTH = 64;
const PIPE_GAP = 148;
const PIPE_SPACING = 240;

export default function FlossRunner({ onComplete }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    status: 'idle', // 'idle' | 'playing' | 'gameover'
    toothY: CANVAS_H / 2 - 16,
    velY: 0,
    tilt: 0,
    pipes: [],
    particles: [],
    popups: [],
    clouds: [
      { x: 90, y: 58, r: 28, spd: 0.35 },
      { x: 310, y: 42, r: 34, spd: 0.25 },
      { x: 540, y: 74, r: 24, spd: 0.4 },
    ],
    trail: [],
    groundScroll: 0,
    score: 0,
    bestScore: 0,
    speed: 2.75,
    lastTime: 0,
  });

  const [ui, setUi] = useState({
    status: 'idle',
    score: 0,
    bestScore: 0,
    message: 'Tap the screen, press Space, or tap Hop! to guide Hero Tooth between the poles!',
  });

  const spawnPipePair = (startX) => {
    const minTop = 52;
    const maxTop = CANVAS_H - 54 - PIPE_GAP - 46;
    const topHeight = Math.floor(minTop + Math.random() * (maxTop - minTop));
    return {
      x: startX,
      topHeight,
      bottomY: topHeight + PIPE_GAP,
      scored: false,
      starCollected: false,
    };
  };

  const resetAndStart = () => {
    const s = stateRef.current;
    s.status = 'playing';
    s.toothY = CANVAS_H / 2 - 20;
    s.velY = JUMP_IMPULSE * 0.85;
    s.tilt = -0.35;
    s.score = 0;
    s.speed = 2.75;
    s.trail = [];
    s.particles = [];
    s.popups = [];
    s.pipes = [
      spawnPipePair(CANVAS_W + 90),
      spawnPipePair(CANVAS_W + 90 + PIPE_SPACING),
      spawnPipePair(CANVAS_W + 90 + PIPE_SPACING * 2),
    ];
    s.lastTime = performance.now();

    setUi((prev) => ({
      ...prev,
      status: 'playing',
      score: 0,
      message: 'Keep tapping to float right through the middle of each pole gap!',
    }));
  };

  const hopTooth = () => {
    const s = stateRef.current;
    if (s.status === 'idle') {
      resetAndStart();
      return;
    }
    if (s.status !== 'playing') return;

    s.velY = JUMP_IMPULSE;

    // Mint sparkle puffs under tooth on each hop
    for (let i = 0; i < 6; i++) {
      s.particles.push({
        x: 155 + (Math.random() - 0.5) * 18,
        y: s.toothY + 18,
        vx: -1.2 - Math.random() * 1.8,
        vy: 1.2 + Math.random() * 2.2,
        r: 3 + Math.random() * 3.5,
        color: i % 2 === 0 ? '#ffffff' : '#5eead4',
        life: 1,
      });
    }
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        if (stateRef.current.status === 'gameover') {
          resetAndStart();
        } else {
          hopTooth();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId = 0;

    const drawPillar = (x, y, w, h, isTop) => {
      if (h <= 0) return;

      // 3D Cylindrical Mint-Teal Gradient
      const grad = ctx.createLinearGradient(x, y, x + w, y);
      grad.addColorStop(0, '#0f766e');
      grad.addColorStop(0.28, '#2dd4bf');
      grad.addColorStop(0.55, '#99f6e4');
      grad.addColorStop(1, '#0d9488');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, isTop ? [0, 0, 14, 14] : [14, 14, 0, 0]);
      ctx.fill();

      // Glossy Specular Highlight Strip
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(x + 10, y + 4, 8, Math.max(0, h - 8));

      // Rounded Brush-Cap Rim at the Gap Edge
      const capH = 22;
      const capY = isTop ? y + h - capH : y;
      const capGrad = ctx.createLinearGradient(x - 5, capY, x + w + 5, capY);
      capGrad.addColorStop(0, '#0284c7');
      capGrad.addColorStop(0.35, '#38bdf8');
      capGrad.addColorStop(0.75, '#bae6fd');
      capGrad.addColorStop(1, '#0369a1');

      ctx.fillStyle = capGrad;
      ctx.beginPath();
      ctx.roundRect(x - 5, capY, w + 10, capH, 10);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const drawHeroTooth = (x, y, tilt) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tilt);

      // Soft Glow Aura
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fill();

      // Flowing Teal Hero Cape
      ctx.fillStyle = '#0d9488';
      ctx.beginPath();
      ctx.moveTo(-8, -6);
      ctx.quadraticCurveTo(-30, -2, -34, 14);
      ctx.quadraticCurveTo(-18, 12, -8, 8);
      ctx.closePath();
      ctx.fill();

      // 3D Rounded White Molar Body
      const bodyGrad = ctx.createLinearGradient(-18, -22, 18, 22);
      bodyGrad.addColorStop(0, '#ffffff');
      bodyGrad.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = bodyGrad;
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(-14, -18);
      ctx.quadraticCurveTo(0, -12, 14, -18);
      ctx.quadraticCurveTo(22, -18, 20, 0);
      ctx.quadraticCurveTo(18, 20, 9, 20);
      ctx.quadraticCurveTo(4, 20, 0, 10);
      ctx.quadraticCurveTo(-4, 20, -9, 20);
      ctx.quadraticCurveTo(-18, 20, -20, 0);
      ctx.quadraticCurveTo(-22, -18, -14, -18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cute Eyes & Happy Smile
      ctx.fillStyle = '#102a43';
      ctx.beginPath();
      ctx.arc(4, -4, 2.6, 0, Math.PI * 2);
      ctx.arc(13, -4, 2.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(8.5, 1, 4.5, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      ctx.restore();
    };

    const render = (now) => {
      const s = stateRef.current;
      const dt = Math.min(32, now - (s.lastTime || now));
      const step = dt / 16.67;
      s.lastTime = now;

      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // 1. Pastel Sky-to-Mint Gradient Backdrop
      const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      sky.addColorStop(0, '#bae6fd');
      sky.addColorStop(0.55, '#e0f2fe');
      sky.addColorStop(1, '#d1fae5');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // 2. Drifting Fluffy Clouds
      s.clouds.forEach((c) => {
        if (s.status === 'playing' || s.status === 'idle') {
          c.x -= c.spd * step;
          if (c.x < -60) c.x = CANVAS_W + 60;
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.arc(c.x + c.r * 0.75, c.y + 4, c.r * 0.78, 0, Math.PI * 2);
        ctx.arc(c.x - c.r * 0.75, c.y + 6, c.r * 0.7, 0, Math.PI * 2);
        ctx.fill();
      });

      const toothX = 165;
      const floorY = CANVAS_H - 42;

      if (s.status === 'idle') {
        // Gentle Hover Preview
        s.toothY = CANVAS_H / 2 - 18 + Math.sin(now * 0.005) * 10;
        s.tilt = Math.sin(now * 0.005) * 0.08;
      }

      if (s.status === 'playing') {
        s.groundScroll = (s.groundScroll + s.speed * step) % 48;
        s.speed = Math.min(4.5, 2.75 + s.score * 0.05);

        // Gravity & Smooth Tilt Interpolation
        s.velY += GRAVITY * step;
        s.toothY += s.velY * step;
        const targetTilt = Math.max(-0.42, Math.min(0.65, s.velY * 0.065));
        s.tilt += (targetTilt - s.tilt) * 0.18;

        // Floss Ribbon Trail
        s.trail.unshift({ x: toothX - 16, y: s.toothY + 4 });
        if (s.trail.length > 18) s.trail.pop();
        s.trail.forEach((pt) => {
          pt.x -= s.speed * step;
        });

        // Move & Recycle Top/Bottom Pole Pairs
        s.pipes.forEach((p) => {
          p.x -= s.speed * step;

          // Score +1 when passing center of gap
          if (!p.scored && p.x + PIPE_WIDTH / 2 < toothX) {
            p.scored = true;
            s.score += 1;
            s.bestScore = Math.max(s.bestScore, s.score);
            s.popups.push({
              x: toothX,
              y: s.toothY - 28,
              text: '+1 ⭐',
              life: 1,
            });
            for (let k = 0; k < 10; k++) {
              s.particles.push({
                x: p.x + PIPE_WIDTH / 2,
                y: p.topHeight + PIPE_GAP / 2,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                r: 3.5,
                color: '#fbbf24',
                life: 1,
              });
            }
            setUi((prev) => ({
              ...prev,
              score: s.score,
              bestScore: s.bestScore,
              message: `🎉 Clean jump! ${s.score} pole ${s.score === 1 ? 'gate' : 'gates'} cleared!`,
            }));
          }

          // Forgiving Circular Hitbox Check against Top & Bottom Poles
          const r = 15;
          const withinX = toothX + r > p.x + 4 && toothX - r < p.x + PIPE_WIDTH - 4;
          const hitsTop = s.toothY - r < p.topHeight;
          const hitsBottom = s.toothY + r > p.bottomY;

          if (withinX && (hitsTop || hitsBottom)) {
            s.status = 'gameover';
          }
        });

        // Spawn next pole pair when rightmost pipe moves in
        const lastPipe = s.pipes[s.pipes.length - 1];
        if (lastPipe && lastPipe.x < CANVAS_W - PIPE_SPACING + 90) {
          s.pipes.push(spawnPipePair(lastPipe.x + PIPE_SPACING));
        }
        s.pipes = s.pipes.filter((p) => p.x + PIPE_WIDTH > -30);

        // Ceiling & Floor Bounds
        if (s.toothY < 20) {
          s.toothY = 20;
          s.velY = 0;
        }
        if (s.toothY + 18 >= floorY) {
          s.toothY = floorY - 18;
          s.status = 'gameover';
        }

        if (s.status === 'gameover') {
          const starsEarned = Math.max(8, s.score * 3);
          if (typeof onComplete === 'function') onComplete(starsEarned);
          setUi({
            status: 'gameover',
            score: s.score,
            bestScore: Math.max(s.bestScore, s.score),
            message: `💫 Great jump run! You passed ${s.score} gates and earned +${starsEarned} stars!`,
          });
        }
      }

      // 3. Draw Top & Bottom Poles + Center Floating Star
      s.pipes.forEach((p) => {
        drawPillar(p.x, 0, PIPE_WIDTH, p.topHeight, true);
        drawPillar(p.x, p.bottomY, PIPE_WIDTH, floorY - p.bottomY, false);

        if (!p.scored) {
          const starY = p.topHeight + PIPE_GAP / 2 + Math.sin(now * 0.007 + p.x) * 5;
          ctx.font = '24px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⭐', p.x + PIPE_WIDTH / 2, starY);
        }
      });

      // 4. Scrolling Mint Platform Floor
      ctx.fillStyle = '#0d9488';
      ctx.fillRect(0, floorY, CANVAS_W, CANVAS_H - floorY);
      ctx.fillStyle = '#5eead4';
      for (let gx = -s.groundScroll; gx < CANVAS_W + 48; gx += 48) {
        ctx.beginPath();
        ctx.roundRect(gx, floorY + 4, 28, 8, 4);
        ctx.fill();
      }

      // 5. Glowing Floss Trail behind Tooth
      if (s.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(s.trail[0].x, s.trail[0].y);
        for (let i = 1; i < s.trail.length; i++) {
          ctx.lineTo(s.trail[i].x, s.trail[i].y);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // 6. Hero Tooth Character
      drawHeroTooth(toothX, s.toothY, s.tilt);

      // 7. Particles & Score Popups
      s.particles.forEach((pt) => {
        pt.x += pt.vx * step;
        pt.y += pt.vy * step;
        pt.life -= 0.035 * step;
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      s.particles = s.particles.filter((pt) => pt.life > 0);

      s.popups.forEach((pop) => {
        pop.y -= 1.2 * step;
        pop.life -= 0.03 * step;
        ctx.globalAlpha = Math.max(0, pop.life);
        ctx.font = '900 18px ui-rounded, system-ui';
        ctx.fillStyle = '#0f766e';
        ctx.textAlign = 'center';
        ctx.fillText(pop.text, pop.x, pop.y);
      });
      ctx.globalAlpha = 1;
      s.popups = s.popups.filter((pop) => pop.life > 0);

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Frosted Liquid Glass Score HUD */}
      <div
        className="bb-glass-hud"
        style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900 }}
      >
        <span>⭐ Gates Passed: {ui.score}</span>
        <span>🏆 Best Run: {ui.bestScore}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onPointerDown={(e) => {
          e.preventDefault();
          if (ui.status === 'gameover') {
            resetAndStart();
          } else {
            hopTooth();
          }
        }}
        style={{
          width: '100%',
          borderRadius: '26px',
          border: '2px solid rgba(255, 255, 255, 0.92)',
          boxShadow: '0 16px 36px rgba(16, 42, 67, 0.12)',
          cursor: 'pointer',
          touchAction: 'manipulation',
        }}
      />

      {/* Big Tactile Hop Button */}
      {ui.status === 'playing' ? (
        <button
          type="button"
          className="bb-btn bb-btn--gold"
          onPointerDown={(e) => {
            e.preventDefault();
            hopTooth();
          }}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '1.12rem',
            userSelect: 'none',
            touchAction: 'manipulation',
          }}
        >
          🦘 TAP TO HOP UP!
        </button>
      ) : (
        <button
          type="button"
          className="bb-btn bb-btn--primary"
          onClick={resetAndStart}
          style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
        >
          {ui.status === 'gameover' ? '▶ Jump Again' : '▶ Start Floss Jumper'}
        </button>
      )}

      <div
        className="bb-glass-hud"
        style={{ borderRadius: '18px', textAlign: 'center', fontWeight: 800 }}
      >
        {ui.message}
      </div>
    </div>
  );
}