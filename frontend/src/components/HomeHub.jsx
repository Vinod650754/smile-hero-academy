import React, { useState, useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';

const TIPS = [
  'Tap Hero Tooth for a brushing tip!',
  'Brush gently for 2 full minutes twice a day!',
  'Fluoride toothpaste keeps enamel super strong!',
  'Remember outside, inside, and chewing surfaces!',
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

  const todayStr = new Date().toISOString().split('T')[0];
  const brushedToday = profile?.last_brushed_date === todayStr;
  const completedCount = (brushedToday ? 1 : 0) + (streak > 0 ? 1 : 0);
  const progressPercent = Math.min(100, Math.round((completedCount / 3) * 100));

  const missions = [
    {
      id: 'brush-battle',
      icon: '🪥',
      iconBg: '#dff8ef',
      kicker: 'MISSION 01',
      title: 'Brush Battle',
      desc: 'Follow a two-minute timer and learn to clean every tooth surface gently.',
      btnText: 'Start brushing',
      btnClass: 'bb-btn bb-btn--primary',
      onClick: onOpenBrushTab,
    },
    {
      id: 'defeat-sugar-bugs',
      icon: '🦠',
      iconBg: '#fff1d4',
      kicker: 'MISSION 02',
      title: 'Defeat Sugar Bugs',
      desc: 'Answer quick questions about plaque, sugar, fluoride, and healthy habits.',
      btnText: 'Play the quiz',
      btnClass: 'bb-btn bb-btn--gold',
      onClick: () => onLaunchGame('SugarBugQuiz'),
    },
    {
      id: 'smile-champion',
      icon: '🏅',
      iconBg: '#eee8ff',
      kicker: 'MISSION 03',
      title: 'Smile Champion',
      desc: "Check your achievements and celebrate the oral-health skills you've practised.",
      btnText: 'View rewards',
      btnClass: 'bb-btn bb-btn--secondary',
      onClick: onOpenBadgesTab,
    },
    {
      id: 'sugar-bug-zap',
      icon: '👾',
      iconBg: '#ffe9e9',
      kicker: 'ARCADE FAVORITE',
      title: 'Sugar Bug Zap',
      desc: 'Zap cavity bugs fast before they reach your pearly white molars!',
      btnText: 'Zap sugar bugs',
      btnClass: 'bb-btn bb-btn--primary',
      onClick: () => onLaunchGame('SugarBugZap'),
    },
    {
      id: 'word-scramble',
      icon: '🔤',
      iconBg: '#dff8ef',
      kicker: 'WORD CHALLENGE',
      title: 'Word Scramble',
      desc: 'Unscramble secret dental tools and healthy smile power-ups.',
      btnText: 'Play scramble',
      btnClass: 'bb-btn bb-btn--gold',
      onClick: () => onLaunchGame('WordScramble'),
    },
    {
      id: 'play-and-learn',
      icon: '🎮',
      iconBg: '#e6f6ff',
      kicker: 'FUN GAMES ZONE',
      title: 'Play & Learn',
      desc: 'Explore all 13 quick games about food, teeth, gums, and oral-health myths.',
      btnText: 'Explore games',
      btnClass: 'bb-btn bb-btn--secondary',
      onClick: onOpenArcadeTab,
    },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="bb-hero">
        <div>
          <div className="bb-eyebrow">Tooth Rescue Mission</div>
          <h1>
            Ready to save
            <br />
            your smile?
          </h1>
          <p>
            Learn to brush, beat the sugar bugs, and become a Smile Champion. Every little
            mission makes your smile stronger!
          </p>
          <div className="bb-hero-actions">
            <button className="bb-btn bb-btn--primary" onClick={onOpenBrushTab}>
              Start my adventure <span aria-hidden="true">→</span>
            </button>
            <button className="bb-btn bb-btn--secondary" onClick={onOpenBadgesTab}>
              See my rewards
            </button>
          </div>
        </div>

        {/* Clean Molar Tooth Hero SVG (No random man emoji!) */}
        <div
          className="bb-hero-art"
          onClick={() => setTipIndex((i) => (i + 1) % TIPS.length)}
        >
          <span className="bb-spark bb-spark--1">✨</span>
          <span className="bb-spark bb-spark--2">⭐</span>

          <div className="bb-tooth-svg-wrap">
            <svg
              width="195"
              height="210"
              viewBox="0 0 200 215"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Hero Tooth Mascot"
            >
              {/* Soft Mint Shadow Base */}
              <ellipse cx="100" cy="198" rx="56" ry="11" fill="#b9e8df" />

              {/* Flowing Superhero Cape Behind Tooth */}
              <path
                d="M42 78 L14 166 Q65 152 100 162 Q135 152 186 166 L158 78 Z"
                fill="#0d9488"
                stroke="#0b8178"
                strokeWidth="3"
                strokeLinejoin="round"
              />

              {/* Cute Molar Tooth Shape with Two Roots */}
              <path
                d="M52 28 C30 28 22 50 28 82 C33 110 42 138 48 176 C50 188 67 189 73 172 L88 130 C93 120 107 120 112 130 L127 172 C133 189 150 188 152 176 C158 138 167 110 172 82 C178 50 170 28 148 28 C127 28 114 40 100 40 C86 40 73 28 52 28 Z"
                fill="#ffffff"
                stroke="#cce6ee"
                strokeWidth="6"
                strokeLinejoin="round"
              />

              {/* Glossy Enamel Highlight */}
              <path
                d="M46 46 C49 38 60 36 68 39"
                stroke="#b9e8df"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Eyes */}
              <ellipse cx="76" cy="82" rx="6.5" ry="9" fill="#18324b" />
              <ellipse cx="124" cy="82" rx="6.5" ry="9" fill="#18324b" />
              <circle cx="78" cy="79" r="2.2" fill="#ffffff" />
              <circle cx="126" cy="79" r="2.2" fill="#ffffff" />

              {/* Rosy Cheeks */}
              <ellipse cx="60" cy="95" rx="8" ry="5" fill="#ffd6dc" />
              <ellipse cx="140" cy="95" rx="8" ry="5" fill="#ffd6dc" />

              {/* Happy Smile */}
              <path
                d="M82 100 Q100 118 118 100"
                stroke="#ff7b7b"
                strokeWidth="5.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          <div
            style={{
              marginTop: '8px',
              background: '#ffffff',
              padding: '7px 14px',
              borderRadius: '99px',
              fontSize: '0.84rem',
              fontWeight: 800,
              color: '#18324b',
              boxShadow: '0 4px 12px rgba(24,50,75,0.07)',
              textAlign: 'center',
            }}
          >
            {TIPS[tipIndex]}
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="bb-progress-wrap">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <strong>🏆 Your hero progress</strong>
          <span style={{ color: '#60758a', fontWeight: 700, fontSize: '0.92rem' }}>
            {completedCount} of 3 missions complete
          </span>
        </div>
        <div className="bb-progress-line">
          <span style={{ width: `${progressPercent}%` }}></span>
        </div>
      </div>

      {/* Mission Cards Grid */}
      <div className="bb-section-head">
        <div>
          <h2>Choose your mission</h2>
          <p>Play in any order. Collect stars as you learn.</p>
        </div>
      </div>

      <section className="bb-cards-grid">
        {missions.map((m) => (
          <article key={m.id} className="bb-card">
            <div className="bb-card-icon" style={{ background: m.iconBg }}>
              {m.icon}
            </div>
            <small>{m.kicker}</small>
            <h3>{m.title}</h3>
            <p>{m.desc}</p>
            <button className={m.btnClass} onClick={m.onClick}>
              {m.btnText}
            </button>
          </article>
        ))}
      </section>

      <footer
        style={{
          textAlign: 'center',
          color: '#7a8b9b',
          fontSize: '0.85rem',
          marginTop: '32px',
          lineHeight: 1.6,
        }}
      >
        BrushBuddy is an educational prototype. It does not replace advice from a dentist or
        caregiver.
        <br />
        Children should use age-appropriate fluoride toothpaste with adult supervision as needed.
      </footer>
    </div>
  );
}