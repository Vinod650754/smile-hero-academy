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
  const profile = context?.profile || {};
  const [tipIndex, setTipIndex] = useState(0);

  const todayStr = new Date().toISOString().split('T')[0];
  const brushedToday = profile.last_brushed_date === todayStr;
  const playedGame = (profile.games_played || []).length > 0;
  const hasQuiz = (profile.quiz_high_score || 0) >= 4;

  const completedCount = (brushedToday ? 1 : 0) + (playedGame ? 1 : 0) + (hasQuiz ? 1 : 0);
  const progressPercent = Math.round((completedCount / 3) * 100);

  const missions = [
    {
      id: 'brush-battle',
      icon: '🪥',
      iconBg: '#dff8ef',
      kicker: 'MISSION 01 • +25 STARS',
      title: '2-Minute Brush Battle',
      desc: 'Follow our guided 4-zone animation for two minutes to clean every tooth surface gently.',
      btnText: 'Start brushing',
      btnClass: 'bb-btn bb-btn--primary',
      onClick: onOpenBrushTab,
    },
    {
      id: 'tooth-dash',
      icon: '🏃',
      iconBg: '#e6f6ff',
      kicker: 'MISSION 02 • RUNNER',
      title: 'Tooth Dash',
      desc: 'Race through Smile City! Tap Left, Right, or Jump to dodge sticky sweets and collect toothbrushes.',
      btnText: 'Play Tooth Dash',
      btnClass: 'bb-btn bb-btn--gold',
      onClick: () => onLaunchGame('ToothDash'),
    },
    {
      id: 'defeat-sugar-bugs',
      icon: '🦠',
      iconBg: '#fff1d4',
      kicker: 'MISSION 03 • QUIZ',
      title: 'Sugar Bug Quiz',
      desc: 'Answer 5 quick questions about plaque, fluoride, and healthy snacks to defeat cavity monsters.',
      btnText: 'Play the quiz',
      btnClass: 'bb-btn bb-btn--secondary',
      onClick: () => onLaunchGame('SugarBugQuiz'),
    },
    {
      id: 'floss-runner',
      icon: '🧵',
      iconBg: '#dff8ef',
      kicker: 'SKILL ARCADE',
      title: 'Floss Runner',
      desc: 'Guide the super-floss ribbon smoothly between teeth to clear hidden plaque and build combos!',
      btnText: 'Play Floss Runner',
      btnClass: 'bb-btn bb-btn--primary',
      onClick: () => onLaunchGame('FlossRunner'),
    },
    {
      id: 'enamel-defender',
      icon: '🛡️',
      iconBg: '#eee8ff',
      kicker: 'SHIELD DEFENSE',
      title: 'Enamel Defender',
      desc: 'Aim your glowing fluoride shield to block incoming sugar-acid waves and protect your smile!',
      btnText: 'Defend Enamel',
      btnClass: 'bb-btn bb-btn--gold',
      onClick: () => onLaunchGame('EnamelDefender'),
    },
    {
      id: 'play-and-learn',
      icon: '🎮',
      iconBg: '#e6f6ff',
      kicker: 'FUN GAMES ZONE',
      title: 'All 9 Smile Games',
      desc: 'Explore Plaque Pattern, Sugar Bug Zap, Smile Sort, Word Scramble, Memory Match, and more!',
      btnText: 'Explore all games',
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
            Learn to brush, beat the sugar bugs, and build a daily streak to become a Smile
            Champion. Every mission makes your smile stronger!
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

        {/* Smiling Molar Tooth Mascot */}
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
              <ellipse cx="100" cy="198" rx="56" ry="11" fill="#b9e8df" />
              <path
                d="M42 78 L14 166 Q65 152 100 162 Q135 152 186 166 L158 78 Z"
                fill="#0d9488"
                stroke="#0b8178"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M52 28 C30 28 22 50 28 82 C33 110 42 138 48 176 C50 188 67 189 73 172 L88 130 C93 120 107 120 112 130 L127 172 C133 189 150 188 152 176 C158 138 167 110 172 82 C178 50 170 28 148 28 C127 28 114 40 100 40 C86 40 73 28 52 28 Z"
                fill="#ffffff"
                stroke="#cce6ee"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <path
                d="M46 46 C49 38 60 36 68 39"
                stroke="#b9e8df"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <ellipse cx="76" cy="82" rx="6.5" ry="9" fill="#18324b" />
              <ellipse cx="124" cy="82" rx="6.5" ry="9" fill="#18324b" />
              <circle cx="78" cy="79" r="2.2" fill="#ffffff" />
              <circle cx="126" cy="79" r="2.2" fill="#ffffff" />
              <ellipse cx="60" cy="95" rx="8" ry="5" fill="#ffd6dc" />
              <ellipse cx="140" cy="95" rx="8" ry="5" fill="#ffd6dc" />
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

      {/* Real Progress Bar */}
      <div className="bb-progress-wrap">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <strong>🏆 Today’s hero progress</strong>
          <span style={{ color: '#60758a', fontWeight: 700, fontSize: '0.92rem' }}>
            {completedCount} of 3 daily goals complete
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
          <p>Play in any order. Collect stars and streak trophies as you learn.</p>
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