import React, { useState, useEffect, useRef, useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';

const DEFAULT_SECONDS = 150; // 2 minutes 30 seconds

const ZONES = [
  {
    name: 'Zone 1: Top Right Teeth',
    tip: 'Brush the outside, inside, and chewing tops of your upper right teeth using gentle circles.',
    cx: 65,
    cy: 42,
  },
  {
    name: 'Zone 2: Top Left Teeth',
    tip: 'Move smoothly to your upper left teeth—keep your soft brush angled gently along the gumline.',
    cx: 135,
    cy: 42,
  },
  {
    name: 'Zone 3: Bottom Left Teeth',
    tip: 'Now brush the lower left teeth! Don’t forget the inside surfaces near your tongue.',
    cx: 135,
    cy: 98,
  },
  {
    name: 'Zone 4: Bottom Right & Tongue',
    tip: 'Finish strong on your lower right molars and give your tongue a gentle sweep!',
    cx: 65,
    cy: 98,
  },
];

export default function BrushTimer() {
  const context = useContext(ProfileContext);
  const recordBrushSession = context?.recordBrushSession;

  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_SECONDS);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoMissing, setVideoMissing] = useState(false);

  const videoRef = useRef(null);

  const elapsed = Math.max(0, totalSeconds - secondsLeft);
  const zoneDuration = totalSeconds / 4;
  const zoneIndex = Math.min(3, Math.floor(elapsed / zoneDuration));
  const currentZone = ZONES[zoneIndex];
  const progressPct = Math.min(100, Math.round((elapsed / totalSeconds) * 100));

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setIsComplete(true);
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
          if (typeof recordBrushSession === 'function') {
            recordBrushSession(25);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, recordBrushSession]);

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration && !isNaN(videoRef.current.duration)) {
      const exactDuration = Math.round(videoRef.current.duration);
      if (exactDuration > 0 && !isRunning) {
        setTotalSeconds(exactDuration);
        setSecondsLeft(exactDuration);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsRunning(false);
    setIsComplete(true);
    setSecondsLeft(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (typeof recordBrushSession === 'function') {
      recordBrushSession(25);
    }
  };

  const handleStart = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(totalSeconds);
      setIsComplete(false);
    }
    setIsRunning(true);
    if (videoRef.current && !videoMissing) {
      videoRef.current.play().catch(() => {
        // Fallback if browser blocks unmuted autoplay on first click
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    if (videoRef.current && !videoMissing) {
      videoRef.current.pause();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsComplete(false);
    setSecondsLeft(totalSeconds);
    if (videoRef.current && !videoMissing) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div>
      <div className="bb-eyebrow">Mission 01 • Guided 3D Brushing</div>
      <h2 style={{ margin: '6px 0 8px' }}>🪥 Guided Brush Battle</h2>
      <p style={{ color: '#60758a', lineHeight: 1.55, margin: '0 0 18px' }}>
        Press <strong>Start Brushing</strong> to play your 3D brushing animation! Follow along
        through all 4 mouth zones using gentle circular strokes.
      </p>

      {/* Video Player or Synced 4-Quadrant Animated Fallback */}
      <div
        style={{
          background: 'linear-gradient(135deg, #e0f8f1, #e6f6ff)',
          borderRadius: '22px',
          border: '2px solid #d4eaf0',
          overflow: 'hidden',
          marginBottom: '18px',
          position: 'relative',
        }}
      >
        {!videoMissing ? (
          <div style={{ position: 'relative', background: '#0f2438' }}>
            <video
              ref={videoRef}
              src="/videos/brush-guide.mp4"
              playsInline
              preload="metadata"
              muted={isMuted}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleVideoEnded}
              onError={() => setVideoMissing(true)}
              style={{
                width: '100%',
                maxHeight: '340px',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
              }}
            />

            {/* Quick Mute/Unmute Pill */}
            <button
              type="button"
              onClick={toggleMute}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(24, 50, 75, 0.78)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '99px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {isMuted ? '🔇 Muted' : '🔊 Sound On'}
            </button>
          </div>
        ) : (
          <div style={{ padding: '22px 16px', textAlign: 'center' }}>
            <svg
              width="210"
              height="140"
              viewBox="0 0 200 140"
              style={{ margin: '0 auto', display: 'block' }}
              aria-label="4-Quadrant Brushing Guide"
            >
              <rect
                x="20"
                y="14"
                width="160"
                height="112"
                rx="54"
                fill="#ffffff"
                stroke="#cce6ee"
                strokeWidth="5"
              />
              <line x1="100" y1="18" x2="100" y2="122" stroke="#e2eff5" strokeWidth="2.5" strokeDasharray="5 5" />
              <line x1="24" y1="70" x2="176" y2="70" stroke="#e2eff5" strokeWidth="2.5" strokeDasharray="5 5" />
              <rect x="42" y="30" width="116" height="24" rx="12" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="2" />
              <rect x="42" y="86" width="116" height="24" rx="12" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="2" />
              <circle
                cx={currentZone.cx}
                cy={currentZone.cy}
                r={isRunning ? '22' : '18'}
                fill="rgba(13, 148, 136, 0.22)"
                stroke="#0d9488"
                strokeWidth="3"
              >
                {isRunning && (
                  <animate
                    attributeName="r"
                    values="16;24;16"
                    dur="1.1s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>
              <text
                x={currentZone.cx}
                y={currentZone.cy + 6}
                textAnchor="middle"
                fontSize="20"
              >
                🪥
              </text>
            </svg>
            <div style={{ fontSize: '0.8rem', color: '#60758a', marginTop: '6px' }}>
              Video not found yet — place your file at{' '}
              <code>frontend/public/videos/brush-guide.mp4</code>
            </div>
          </div>
        )}

        {/* Active Zone Banner */}
        <div
          style={{
            background: '#18324b',
            color: '#ffffff',
            padding: '10px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.88rem',
            fontWeight: 800,
          }}
        >
          <span>{isComplete ? '🎉 All 4 Zones Sparkling Clean!' : currentZone.name}</span>
          <span style={{ color: '#ffd166' }}>Zone {zoneIndex + 1} of 4</span>
        </div>
      </div>

      {/* Countdown & Progress Bar */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div
          style={{
            fontSize: 'clamp(2.8rem, 8vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            color: '#18324b',
            lineHeight: 1,
          }}
        >
          {mins}:{secs}
        </div>
        <div className="bb-progress-line" style={{ maxWidth: '340px', margin: '12px auto 0' }}>
          <span style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Live Coaching Tip */}
      <div
        style={{
          background: isComplete ? '#fff8dc' : '#e9faf3',
          borderRadius: '16px',
          padding: '14px 16px',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '0.95rem',
          marginBottom: '18px',
        }}
      >
        {isComplete
          ? '🏆 Amazing job! You finished your full brushing mission and earned +25 stars!'
          : `💡 ${currentZone.tip}`}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {!isRunning ? (
          <button className="bb-btn bb-btn--primary" onClick={handleStart}>
            ▶ {secondsLeft < totalSeconds && secondsLeft > 0 ? 'Resume Brushing' : 'Start Brushing'}
          </button>
        ) : (
          <button className="bb-btn bb-btn--gold" onClick={handlePause}>
            ⏸ Pause
          </button>
        )}
        <button className="bb-btn bb-btn--quiet" onClick={handleReset}>
          ↺ Reset
        </button>
      </div>
    </div>
  );
}