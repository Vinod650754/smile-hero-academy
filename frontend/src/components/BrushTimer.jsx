import React, { useState, useEffect, useRef, useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import { supabase } from '../supabaseClient';
import confetti from 'canvas-confetti';
import { Play, Pause, RotateCcw } from 'lucide-react';

const BRUSH_STAGES = [
  { id: 1, name: 'Top Outer Teeth', tip: 'Brush in gentle circles along top front teeth!', emoji: '🪥' },
  { id: 2, name: 'Bottom Outer Teeth', tip: 'Clean the front of bottom teeth in small circles!', emoji: '✨' },
  { id: 3, name: 'Top Inside Surface', tip: 'Tilt your toothbrush inward to clean inside top teeth!', emoji: '🧼' },
  { id: 4, name: 'Chewing Tops & Tongue', tip: 'Scrub flat molars back-and-forth & sweep your tongue!', emoji: '👅' }
];

export default function BrushTimer() {
  const { profile, setProfile } = useContext(ProfileContext);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const canvasRef = useRef(null);

  const elapsed = 120 - timeLeft;
  const currentStageIndex = Math.min(3, Math.floor(elapsed / 30));
  const currentStage = BRUSH_STAGES[currentStageIndex];

  const stageRef = useRef(currentStageIndex);
  useEffect(() => {
    stageRef.current = currentStageIndex;
  }, [currentStageIndex]);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setCompleted(true);
      awardBrushingReward();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // --- 60 FPS CLEAN VECTOR MOUTH RENDERER ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let animationFrameId;
    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      frame += 0.05;

      const cx = width / 2;
      const cy = height / 2 - 5;
      const activeStage = stageRef.current;

      // 1. Soft Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#f0f9ff');
      bgGrad.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Cute Face Profile Outer Frame (Cheeks & Chin)
      ctx.fillStyle = '#ffedd5'; // Soft skin tone
      ctx.strokeStyle = '#fdba74';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 95, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cheeks
      ctx.fillStyle = 'rgba(251, 113, 133, 0.35)';
      ctx.beginPath();
      ctx.arc(cx - 65, cy + 15, 16, 0, Math.PI * 2);
      ctx.arc(cx + 65, cy + 15, 16, 0, Math.PI * 2);
      ctx.fill();

      // 3. Open Mouth Cavity (Natural Smile Contour)
      ctx.fillStyle = '#450a0a'; // Dark Red Interior
      ctx.beginPath();
      ctx.ellipse(cx, cy, 55, 45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pink Tongue
      ctx.fillStyle = activeStage === 3 ? '#f472b6' : '#fb7185';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 22, 32, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // 4. Curved Upper Dental Arch & Gums
      ctx.fillStyle = '#f43f5e'; // Pink Gums
      ctx.beginPath();
      ctx.arc(cx, cy - 8, 48, Math.PI * 1.15, Math.PI * 1.85, false);
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#f43f5e';
      ctx.stroke();

      // Upper Teeth (Curved Arch)
      for (let i = 0; i < 8; i++) {
        const angle = Math.PI * 1.2 + (i * (Math.PI * 0.6 / 7));
        const tx = cx + Math.cos(angle) * 44;
        const ty = cy - 8 + Math.sin(angle) * 28;
        const isSelected = activeStage === 0 || activeStage === 2;

        ctx.fillStyle = isSelected ? '#fef08a' : '#ffffff';
        ctx.strokeStyle = isSelected ? '#eab308' : '#cbd5e1';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.roundRect(tx - 5, ty - 6, 10, 13, 3);
        ctx.fill();
        ctx.stroke();
      }

      // 5. Curved Lower Dental Arch & Gums
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(cx, cy + 8, 48, Math.PI * 0.15, Math.PI * 0.85, false);
      ctx.stroke();

      // Lower Teeth (Curved Arch)
      for (let i = 0; i < 8; i++) {
        const angle = Math.PI * 0.8 - (i * (Math.PI * 0.6 / 7));
        const tx = cx + Math.cos(angle) * 44;
        const ty = cy + 8 + Math.sin(angle) * 28;
        const isSelected = activeStage === 1;

        ctx.fillStyle = isSelected ? '#fef08a' : '#ffffff';
        ctx.strokeStyle = isSelected ? '#eab308' : '#cbd5e1';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.roundRect(tx - 5, ty - 6, 10, 13, 3);
        ctx.fill();
        ctx.stroke();
      }

      // 6. Lips Outline
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 57, 47, 0, 0, Math.PI * 2);
      ctx.stroke();

      // 7. Active Zone Highlight Ring
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      if (activeStage === 0) ctx.ellipse(cx, cy - 25, 48, 14, 0, 0, Math.PI * 2);
      else if (activeStage === 1) ctx.ellipse(cx, cy + 25, 48, 14, 0, 0, Math.PI * 2);
      else if (activeStage === 2) ctx.ellipse(cx, cy - 12, 38, 10, 0, 0, Math.PI * 2);
      else if (activeStage === 3) ctx.ellipse(cx, cy + 18, 30, 14, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 8. Animated Toothbrush Guide
      if (isRunning) {
        let bx = cx;
        let by = cy;
        let bAngle = 0;

        if (activeStage === 0) {
          const sweep = Math.sin(frame * 1.1) * 36;
          bx = cx + sweep;
          by = cy - 26 + Math.cos(frame * 3) * 5;
          bAngle = -0.15;
        } else if (activeStage === 1) {
          const sweep = Math.sin(frame * 1.1) * 36;
          bx = cx + sweep;
          by = cy + 26 + Math.sin(frame * 3) * 5;
          bAngle = 0.15;
        } else if (activeStage === 2) {
          const sweep = Math.cos(frame * 1.3) * 26;
          bx = cx + sweep;
          by = cy - 14;
          bAngle = -0.65;
        } else if (activeStage === 3) {
          const stroke = Math.sin(frame * 1.8) * 28;
          bx = cx + stroke;
          by = cy + 18;
          bAngle = 0;
        }

        // Foam Bubbles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        for (let b = 0; b < 3; b++) {
          ctx.beginPath();
          ctx.arc(bx + (Math.random() - 0.5) * 18, by + (Math.random() - 0.5) * 12, 3 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Toothbrush Wand
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(bAngle);

        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.roundRect(-4, 0, 8, 42, 4);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(-6, -16, 12, 16, 3);
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-4, -14, 3, 11);
        ctx.fillRect(1, -14, 3, 11);

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning]);

  const awardBrushingReward = async () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

    const todayStr = new Date().toISOString().split('T')[0];
    const newStreak = (profile?.streak || 0) + 1;
    const newStars = (profile?.stars || 0) + 10;
    const unlocked = [...(profile?.unlocked_badges || [])];

    if (!unlocked.includes('Master Brusher')) {
      unlocked.push('Master Brusher');
    }

    const { data } = await supabase
      .from('profiles')
      .update({
        stars: newStars,
        streak: newStreak,
        last_brushed_date: todayStr,
        unlocked_badges: unlocked
      })
      .eq('device_id', profile?.device_id)
      .select()
      .single();

    if (data) setProfile(data);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(120);
    setCompleted(false);
  };

  const progressPercent = ((120 - timeLeft) / 120) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="bubbly-card" style={{ textAlign: 'center', padding: '16px' }}>
      <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', marginBottom: '4px' }}>
        2-Minute Brushing Guide 🪥
      </div>
      <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '14px' }}>
        Follow the toothbrush position on the mouth guide!
      </div>

      {!completed ? (
        <div>
          <div style={{
            background: '#f0f9ff',
            border: '2px solid #bae6fd',
            borderRadius: '16px',
            padding: '10px 14px',
            marginBottom: '14px'
          }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#0284c7', textTransform: 'uppercase' }}>
              SECTION {currentStageIndex + 1} OF 4
            </div>
            <div style={{ fontSize: '15px', fontWeight: '900', color: '#1e293b', marginTop: '2px' }}>
              {currentStage.name}
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', marginTop: '2px' }}>
              💡 {currentStage.tip}
            </div>
          </div>

          <div style={{
            position: 'relative',
            width: '100%',
            height: '210px',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '3px solid #0284c7',
            boxShadow: '0 8px 20px rgba(2, 132, 199, 0.15)',
            marginBottom: '14px'
          }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '14px',
              fontSize: '22px',
              fontWeight: '900',
              color: '#0284c7',
              background: 'rgba(255,255,255,0.92)',
              padding: '4px 12px',
              borderRadius: '12px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
            }}>
              {formattedTime}
            </div>
          </div>

          <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #38bdf8 0%, #0284c7 100%)',
              transition: 'width 1s linear'
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {!isRunning ? (
              <button
                className="bubbly-btn-primary"
                onClick={() => setIsRunning(true)}
                style={{ width: 'auto', padding: '12px 28px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Play size={18} /> START BRUSHING
              </button>
            ) : (
              <button
                className="bubbly-btn-gold"
                onClick={() => setIsRunning(false)}
                style={{ width: 'auto', padding: '12px 28px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Pause size={18} /> PAUSE
              </button>
            )}

            <button
              onClick={handleReset}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '16px',
                padding: '12px',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px 0' }}>
          <div style={{ fontSize: '3.8rem' }}>🎉</div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#1e293b', marginTop: '6px' }}>
            Brushing Complete!
          </div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#15803d', margin: '6px 0 16px 0' }}>
            You earned +10 ⭐ Stars & increased your daily streak!
          </div>
          <button
            className="bubbly-btn-primary"
            onClick={handleReset}
            style={{ width: 'auto', padding: '12px 28px', fontSize: '12px' }}
          >
            Brush Again 🔄
          </button>
        </div>
      )}
    </div>
  );
}