import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Heart, RotateCcw } from 'lucide-react';

export default function ToothDash({ onBack, onComplete }) {
  const canvasRef = useRef(null);
  
  // React state for HUD
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);

  // Mutable game state inside ref to avoid React render lag in 60FPS loop
  const gameState = useRef({
    lane: 1, // 0: Left, 1: Center, 2: Right
    targetX: 0,
    currentX: 0,
    score: 0,
    lives: 3,
    speed: 3.5, // Starts smooth & manageable
    obstacles: [],
    particles: [],
    spawnTimer: 0,
    gameOver: false,
  });

  // Track lanes (calculated on canvas resize)
  const lanePositions = useRef([0, 0, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle high-DPI crisp rendering
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Compute lane centers
    const laneWidth = width / 3;
    lanePositions.current = [
      laneWidth * 0.5,
      laneWidth * 1.5,
      laneWidth * 2.5
    ];

    // Initialize player position at center lane
    gameState.current.currentX = lanePositions.current[1];
    gameState.current.targetX = lanePositions.current[1];

    let animationFrameId;

    // --- MAIN 60 FPS CANVAS GAME LOOP ---
    const render = () => {
      const state = gameState.current;

      // Clear Canvas with Soft Sky Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#bae6fd');
      bgGrad.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Dashed Lane Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.setLineDash([12, 12]);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(laneWidth, 0);
      ctx.lineTo(laneWidth, height);
      ctx.moveTo(laneWidth * 2, 0);
      ctx.lineTo(laneWidth * 2, height);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line style

      if (!state.gameOver) {
        // 1. Smooth Player Position Interpolation (Lerp for fluid lane switching)
        state.currentX += (state.targetX - state.currentX) * 0.22;

        // 2. Spawn Falling Items (Candy 🍬 or Water 💧)
        state.spawnTimer++;
        if (state.spawnTimer > Math.max(30, 75 - Math.floor(state.score / 10))) {
          state.spawnTimer = 0;
          const randomLane = Math.floor(Math.random() * 3);
          const isWater = Math.random() < 0.45;
          state.obstacles.push({
            x: lanePositions.current[randomLane],
            y: -30,
            lane: randomLane,
            type: isWater ? 'water' : 'candy',
            emoji: isWater ? '💧' : '🍬',
            size: 32
          });
        }

        // 3. Update & Draw Falling Obstacles
        for (let i = state.obstacles.length - 1; i >= 0; i--) {
          const obs = state.obstacles[i];
          obs.y += state.speed;

          // Render Obstacle Emoji
          ctx.font = `${obs.size}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(obs.emoji, obs.x, obs.y);

          // Player Hitbox Radius Check (Bottom Collision Zone)
          const playerY = height - 50;
          const distanceX = Math.abs(obs.x - state.currentX);
          const distanceY = Math.abs(obs.y - playerY);

          if (distanceX < 28 && distanceY < 28) {
            if (obs.type === 'water') {
              // Collect Water Drop (+5 Stars, speed boost, particles)
              state.score += 5;
              setScore(state.score);
              state.speed = Math.min(8.5, 3.5 + state.score * 0.04); // Smooth gradual speed scale

              // Create Sparkle Particle Burst
              for (let p = 0; p < 8; p++) {
                state.particles.push({
                  x: obs.x,
                  y: obs.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  color: '#38bdf8',
                  life: 1.0
                });
              }
            } else {
              // Hit Candy -> Lose Heart
              state.lives -= 1;
              setLives(state.lives);

              // Explosion Particles
              for (let p = 0; p < 10; p++) {
                state.particles.push({
                  x: obs.x,
                  y: obs.y,
                  vx: (Math.random() - 0.5) * 8,
                  vy: (Math.random() - 0.5) * 8,
                  color: '#ef4444',
                  life: 1.0
                });
              }

              if (state.lives <= 0) {
                state.gameOver = true;
                setIsGameOver(true);
                onComplete(state.score + 5, 'Game Explorer');
              }
            }
            state.obstacles.splice(i, 1);
            continue;
          }

          // Remove Offscreen Obstacles
          if (obs.y > height + 40) {
            state.obstacles.splice(i, 1);
          }
        }

        // 4. Update & Draw Sparkle Particles
        for (let i = state.particles.length - 1; i >= 0; i--) {
          const p = state.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.04;

          if (p.life <= 0) {
            state.particles.splice(i, 1);
          } else {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }
        }

        // 5. Render Hero Tooth Mascot at Bottom
        const playerY = height - 48;

        // Soft Shadow
        ctx.fillStyle = 'rgba(2, 132, 199, 0.2)';
        ctx.beginPath();
        ctx.ellipse(state.currentX, playerY + 18, 22, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw Player Emoji
        ctx.font = '42px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🦷', state.currentX, playerY);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  // Touch & Key Event Handlers for Smooth Controls
  const moveLeft = () => {
    if (gameState.current.lane > 0) {
      gameState.current.lane -= 1;
      gameState.current.targetX = lanePositions.current[gameState.current.lane];
    }
  };

  const moveRight = () => {
    if (gameState.current.lane < 2) {
      gameState.current.lane += 1;
      gameState.current.targetX = lanePositions.current[gameState.current.lane];
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') moveLeft();
      if (e.key === 'ArrowRight' || e.key === 'd') moveRight();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const resetGame = () => {
    const state = gameState.current;
    state.lane = 1;
    state.score = 0;
    state.lives = 3;
    state.speed = 3.5;
    state.obstacles = [];
    state.particles = [];
    state.spawnTimer = 0;
    state.gameOver = false;
    state.targetX = lanePositions.current[1];
    state.currentX = lanePositions.current[1];

    setScore(0);
    setLives(3);
    setIsGameOver(false);
  };

  return (
    <div className="bubbly-card" style={{ textAlign: 'center', padding: '16px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontWeight: '900', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ fontWeight: '900', color: '#0284c7', fontSize: '13px' }}>🏃‍♂️ 60FPS Tooth Dash</div>
      </div>

      {!isGameOver ? (
        <div>
          {/* HUD Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: '900', marginBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[...Array(3)].map((_, i) => (
                <Heart key={i} size={18} fill={i < lives ? '#ef4444' : '#cbd5e1'} color={i < lives ? '#ef4444' : '#cbd5e1'} />
              ))}
            </div>
            <span style={{ fontSize: '13px', color: '#0284c7' }}>⭐ Score: {score}</span>
          </div>

          {/* Smooth HTML5 Canvas Track */}
          <div style={{ position: 'relative', width: '100%', height: '260px', borderRadius: '20px', overflow: 'hidden', border: '3px solid #0284c7', boxShadow: '0 8px 20px rgba(2, 132, 199, 0.15)' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
          </div>

          {/* Smooth Press Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
            <button className="bubbly-btn-primary" onClick={moveLeft} style={{ padding: '12px' }}>
              ◀ MOVE LEFT
            </button>
            <button className="bubbly-btn-primary" onClick={moveRight} style={{ padding: '12px' }}>
              MOVE RIGHT ▶
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px 0' }}>
          <div style={{ fontSize: '3.5rem' }}>🏆</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', marginTop: '6px' }}>Run Completed!</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#0284c7', margin: '6px 0 16px 0' }}>Final Score: {score} points!</div>
          <button className="bubbly-btn-primary" onClick={resetGame} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '12px 24px' }}>
            <RotateCcw size={16} /> Play Again
          </button>
        </div>
      )}
    </div>
  );
}