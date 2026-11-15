import React, { useState, useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import { Trophy, Sparkles, ArrowRight } from 'lucide-react';

const MASCOT_TIPS = [
  'Tap me for a Smile Tip!',
  'Brush in gentle circles for 2 full minutes!',
  'Sugar bugs hate fluoride toothpaste!',
  'Don’t forget your back molars & tongue!',
  'You are a true Smile Champion!',
];

export default function HomeHub({
  onOpenBrushTab,
  onOpenBadgesTab,
  onOpenArcadeTab,
  onLaunchGame,
}) {
  const context = useContext(ProfileContext);
  const profile = context?.profile;
  const streak = profile?.streak ?? 0;

  const [tipIndex, setTipIndex] = useState(0);
  const [sparklePop, setSparklePop] = useState(false);

  // Calculate daily mission progress (out of 3)
  const todayStr = new Date().toISOString().split('T')[0];
  const brushedToday = profile?.last_brushed_date === todayStr;
  const completedCount = (brushedToday ? 1 : 0) + (streak > 0 ? 1 : 0);
  const progressPercent = Math.min(100, Math.round((completedCount / 3) * 100));

  const handleMascotTap = () => {
    setTipIndex((prev) => (prev + 1) % MASCOT_TIPS.length);
    setSparklePop(true);
    setTimeout(() => setSparklePop(false), 450);
  };

  const questCards = [
    {
      id: 'brush-timer',
      badge: 'MISSION #1 • 02:00',
      kicker: 'BRUSH BATTLE • +25 STARS',
      title: '2-Minute Brush Timer',
      copy: 'Follow the 4-quadrant anatomical mouth guide to clean every tooth surface gently.',
      metaLeft: '4 ZONES • 30S EACH',
      metaRight: 'START BRUSHING ▶',
      skyClass: '',
      sprite: '🪥',
      onClick: onOpenBrushTab,
    },
    {
      id: 'sugar-bug-zap',
      badge: 'MISSION #2 • ARCADE',
      kicker: 'DEFEAT SUGAR BUGS • +15 STARS',
      title: 'Sugar Bug Zap',
      copy: 'Zap invading cavity monsters before they reach your pearly white molars!',
      metaLeft: 'REFLEX ACTION',
      metaRight: 'ZAP BUGS ▶',
      skyClass: 'ow-quest-card__sky--cyan',
      sprite: '👾',
      onClick: () => onLaunchGame('SugarBugZap'),
    },
    {
      id: 'sugar-bug-quiz',
      badge: 'MISSION #3 • TRIVIA',
      kicker: 'BRAIN QUEST • +20 STARS',
      title: 'Sugar Bug Quiz',
      copy: 'Answer quick questions about plaque, fluoride, and healthy daily habits.',
      metaLeft: '5 ROUNDS',
      metaRight: 'PLAY THE QUIZ ▶',
      skyClass: 'ow-quest-card__sky--indigo',
      sprite: '🧠',
      onClick: () => onLaunchGame('SugarBugQuiz'),
    },
    {
      id: 'word-scramble',
      badge: 'MISSION #4 • PUZZLE',
      kicker: 'WORD HERO • +15 STARS',
      title: 'Word Scramble',
      copy: 'Unscramble secret dentist tools and healthy smile power-ups against the clock.',
      metaLeft: 'VOCAB CHALLENGE',
      metaRight: 'SOLVE NOW ▶',
      skyClass: 'ow-quest-card__sky--teal',
      sprite: '🔤',
      onClick: () => onLaunchGame('WordScramble'),
    },
    {
      id: 'all-arcade',
      badge: 'FUN GAMES ZONE',
      kicker: '13 MINI-GAMES • UNLIMITED',
      title: 'Play & Learn Arcade',
      copy: 'Explore all 13 dental mini-games including Tooth Dash, Smile Sort, and Stain Eraser.',
      metaLeft: 'FULL ARCADE',
      metaRight: 'EXPLORE GAMES ▶',
      skyClass: '',
      sprite: '🎮',
      onClick: onOpenArcadeTab,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* BIG INTERACTIVE HERO WIDGET */}
      <section className="bb-hero-banner">
        <div className="bb-hero-content">
          <div
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-hud)',
              fontSize: '16px',
              letterSpacing: '0.08em',
              background: '#1d4ed8',
              color: '#ffffff',
              border: '2px solid #161310',
              padding: '3px 10px',
            }}
          >
            TOOTH RESCUE MISSION
          </div>

          <h1 className="bb-hero-title">Ready to save your smile?</h1>

          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.5,
              color: '#334155',
              margin: 0,
            }}
          >
            Learn to brush, beat the sugar bugs, and become a Smile Champion. Every little
            mission makes your smile stronger!
          </p>

          <div className="bb-hero-actions">
            <button className="bb-pixel-btn" onClick={onOpenBrushTab}>
              <span>Start my adventure</span>
              <ArrowRight size={16} />
            </button>

            <button
              className="bb-pixel-btn bb-pixel-btn--secondary"
              onClick={onOpenBadgesTab}
            >
              <span>See my rewards</span>
            </button>
          </div>
        </div>

        {/* Interactive Clickable Tooth Mascot */}
        <div className="bb-mascot-stage" onClick={handleMascotTap} title="Click me!">
          <div className="bb-mascot-card">
            <Sparkles
              size={22}
              color="#eab308"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                transform: sparklePop ? 'scale(1.4) rotate(20deg)' : 'scale(1)',
                transition: 'transform 0.2s ease',
              }}
            />
            <div className="bb-mascot-float">
              <svg width="88" height="92" viewBox="0 0 64 68" aria-label="BrushBuddy Mascot">
                {/* Superhero Cape */}
                <path
                  d="M12 24 L4 54 L20 48 L44 48 L60 54 L52 24 Z"
                  fill="#2563eb"
                  stroke="#161310"
                  strokeWidth="2.5"
                />
                {/* Tooth Body */}
                <path
                  d="M14 8 C8 8 6 15 8 25 C10 34 13 44 15 58 C16 62 21 62 23 56 L28 41 C30 38 34 38 36 41 L41 56 C43 62 48 62 49 58 C51 44 54 34 56 25 C58 15 56 8 50 8 C43 8 38 12 32 12 C26 12 21 8 14 8 Z"
                  fill="#ffffff"
                  stroke="#161310"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {/* Cute Eyes & Smile */}
                <circle cx="24" cy="24" r="2.8" fill="#161310" />
                <circle cx="40" cy="24" r="2.8" fill="#161310" />
                <circle cx="19" cy="28" r="2.5" fill="#fda4af" />
                <circle cx="45" cy="28" r="2.5" fill="#fda4af" />
                <path
                  d="M26 30 Q32 36 38 30"
                  fill="none"
                  stroke="#161310"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '14px',
                background: '#fef08a',
                border: '1.5px solid #161310',
                padding: '1px 6px',
                marginTop: '4px',
              }}
            >
              TAP ME! ✨
            </span>
          </div>

          <div
            style={{
              marginTop: '8px',
              maxWidth: '210px',
              textAlign: 'center',
              fontFamily: 'var(--font-hud)',
              fontSize: '15px',
              background: '#ffffff',
              border: '2px solid #161310',
              padding: '4px 8px',
              boxShadow: '3px 3px 0 #161310',
            }}
          >
            {MASCOT_TIPS[tipIndex]}
          </div>
        </div>
      </section>

      {/* YOUR HERO PROGRESS BAR WIDGET */}
      <section
        style={{
          background: '#ffffff',
          border: '2px solid #161310',
          boxShadow: '5px 5px 0 #161310',
          padding: '12px 16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              fontSize: '16px',
            }}
          >
            <Trophy size={17} color="#eab308" />
            <span>Your hero progress</span>
          </span>
          <span style={{ fontFamily: 'var(--font-hud)', fontSize: '17px', color: '#1d4ed8' }}>
            {completedCount} of 3 daily missions complete
          </span>
        </div>

        <div
          style={{
            width: '100%',
            height: '14px',
            background: '#e0f2fe',
            border: '2px solid #161310',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.max(12, progressPercent)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #0ea5e9, #1d4ed8)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </section>

      {/* SECTION HEADER */}
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            fontSize: '24px',
            margin: '0 0 2px',
          }}
        >
          Choose your mission
        </h2>
        <p style={{ fontSize: '13.5px', color: '#475569', margin: 0 }}>
          Play in any order. Collect stars as you learn!
        </p>
      </div>

      {/* SIDE-BY-SIDE FIXED-SIZE QUEST CARD GRID */}
      <section className="bb-quest-grid">
        {questCards.map((quest) => (
          <article key={quest.id} className="ow-quest-card" onClick={quest.onClick}>
            <div className="ow-quest-card__art">
              <div className={`ow-quest-card__sky ${quest.skyClass}`} />
              <div className="ow-quest-card__sun" />
              <div className="ow-quest-card__cloud ow-quest-card__cloud--a" />
              <div className="ow-quest-card__cloud ow-quest-card__cloud--b" />
              <div className="ow-quest-card__mountain" />
              <div className="ow-quest-card__ground" />
              <div className="ow-quest-card__sprite">{quest.sprite}</div>
              <span className="ow-quest-card__badge">{quest.badge}</span>
            </div>

            <div className="ow-quest-card__body">
              <div>
                <p className="ow-quest-card__kicker">{quest.kicker}</p>
                <h3 className="ow-quest-card__title">{quest.title}</h3>
                <p className="ow-quest-card__copy">{quest.copy}</p>
              </div>

              <div className="ow-quest-card__meta">
                <span className="ow-quest-card__stamp">{quest.metaLeft}</span>
                <span className="ow-quest-card__stamp ow-quest-card__stamp--accent">
                  {quest.metaRight}
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}