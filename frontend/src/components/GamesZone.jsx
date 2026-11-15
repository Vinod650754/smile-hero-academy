import React, { useState, useEffect, useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';

import ToothDash from './Games/ToothDash';
import SmileSort from './Games/SmileSort';
import MemoryMatch from './Games/MemoryMatch';
import SugarBugZap from './Games/SugarBugZap';
import SugarBugQuiz from './Games/SugarBugQuiz';
import ClinicCleaner from './Games/ClinicCleaner';
import WordScramble from './Games/WordScramble';
import BrushingBeat from './Games/BrushingBeat';
import FlossRunner from './Games/FlossRunner';
import EnamelDefender from './Games/EnamelDefender';
import CavityDodge from './Games/CavityDodge';
import PlaquePattern from './Games/PlaquePattern';
import StainEraser from './Games/StainEraser';

const GAMES_LIST = [
  { key: 'SmileSort', title: 'Smile Sort', desc: 'Choose the tooth-friendly everyday option.', icon: '🥦', bg: '#dff8ef', btn: 'bb-btn--primary', label: 'Play Smile Sort' },
  { key: 'SugarBugQuiz', title: 'Sugar Bug Quiz', desc: 'Answer quick questions about plaque, sugar, and fluoride.', icon: '🦠', bg: '#fff1d4', btn: 'bb-btn--gold', label: 'Play Quiz' },
  { key: 'SugarBugZap', title: 'Sugar Bug Zap', desc: 'Zap cavity bugs before they reach your pearly molars!', icon: '👾', bg: '#ffe9e9', btn: 'bb-btn--primary', label: 'Zap Bugs' },
  { key: 'WordScramble', title: 'Word Scramble', desc: 'Unscramble secret dental tools and healthy habits.', icon: '🔤', bg: '#eee8ff', btn: 'bb-btn--secondary', label: 'Play Scramble' },
  { key: 'ToothDash', title: 'Tooth Dash', desc: 'Race through Smile City, dodge sugar bugs and collect helpers!', icon: '🏃', bg: '#e6f6ff', btn: 'bb-btn--primary', label: 'Play Tooth Dash' },
  { key: 'MemoryMatch', title: 'Memory Match', desc: 'Flip and match pairs of dental heroes and brushing tools.', icon: '🃏', bg: '#fff1d4', btn: 'bb-btn--gold', label: 'Match Cards' },
  { key: 'ClinicCleaner', title: 'Clinic Cleaner', desc: 'Polish and sanitize the dental chair before the next patient.', icon: '✨', bg: '#dff8ef', btn: 'bb-btn--primary', label: 'Start Cleaning' },
  { key: 'BrushingBeat', title: 'Brushing Beat', desc: 'Brush to the beat and hit every sparkle note on time.', icon: '🎵', bg: '#eee8ff', btn: 'bb-btn--secondary', label: 'Play Rhythm' },
  { key: 'FlossRunner', title: 'Floss Runner', desc: 'Weave dental floss cleanly between tight tooth gaps.', icon: '🧵', bg: '#e6f6ff', btn: 'bb-btn--primary', label: 'Start Flossing' },
  { key: 'EnamelDefender', title: 'Enamel Defender', desc: 'Shield your enamel armor against incoming acid waves.', icon: '🛡️', bg: '#ffe9e9', btn: 'bb-btn--gold', label: 'Protect Smile' },
  { key: 'CavityDodge', title: 'Cavity Dodge', desc: 'Steer clear of falling soda drops and sticky caramels.', icon: '⚡', bg: '#fff1d4', btn: 'bb-btn--primary', label: 'Dodge Now' },
  { key: 'PlaquePattern', title: 'Plaque Pattern', desc: 'Repeat the flashing toothbrush sequence to clear plaque.', icon: '🔍', bg: '#dff8ef', btn: 'bb-btn--secondary', label: 'Investigate' },
  { key: 'StainEraser', title: 'Stain Eraser', desc: 'Rub away stubborn stains to reveal a dazzling smile.', icon: '🪥', bg: '#e6f6ff', btn: 'bb-btn--primary', label: 'Erase Stains' },
];

export default function GamesZone({ initialGame = null, onClearInitialGame }) {
  const [activeGame, setActiveGame] = useState(initialGame);
  const context = useContext(ProfileContext);
  const addStars = context?.addStars;

  useEffect(() => {
    if (initialGame) setActiveGame(initialGame);
  }, [initialGame]);

  const handleBack = () => {
    setActiveGame(null);
    if (onClearInitialGame) onClearInitialGame();
  };

  const handleComplete = (starsEarned = 15) => {
    if (typeof addStars === 'function') addStars(starsEarned);
  };

  const renderGame = () => {
    const props = { onComplete: handleComplete, onBack: handleBack };
    switch (activeGame) {
      case 'ToothDash': return <ToothDash {...props} />;
      case 'SmileSort': return <SmileSort {...props} />;
      case 'MemoryMatch': return <MemoryMatch {...props} />;
      case 'SugarBugZap': return <SugarBugZap {...props} />;
      case 'SugarBugQuiz': return <SugarBugQuiz {...props} />;
      case 'ClinicCleaner': return <ClinicCleaner {...props} />;
      case 'WordScramble': return <WordScramble {...props} />;
      case 'BrushingBeat': return <BrushingBeat {...props} />;
      case 'FlossRunner': return <FlossRunner {...props} />;
      case 'EnamelDefender': return <EnamelDefender {...props} />;
      case 'CavityDodge': return <CavityDodge {...props} />;
      case 'PlaquePattern': return <PlaquePattern {...props} />;
      case 'StainEraser': return <StainEraser {...props} />;
      default: return null;
    }
  };

  if (activeGame) {
    const meta = GAMES_LIST.find((g) => g.key === activeGame);
    return (
      <section className="bb-panel" style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
          }}
        >
          <div>
            <div className="bb-eyebrow">Fun Games Zone</div>
            <h2 style={{ margin: '4px 0 0' }}>
              {meta?.icon} {meta?.title}
            </h2>
          </div>
          <button className="bb-btn bb-btn--quiet" onClick={handleBack}>
            ← Games
          </button>
        </div>
        {renderGame()}
      </section>
    );
  }

  return (
    <section className="bb-panel">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div className="bb-eyebrow">Fun Games Zone</div>
          <h2 style={{ margin: '6px 0' }}>🎮 Play, learn & earn stars!</h2>
        </div>
      </div>
      <p style={{ color: '#60758a', lineHeight: 1.6, margin: '6px 0 20px' }}>
        Choose a mini-game. Read the feedback after each round to discover a new oral-health fact.
      </p>

      <div className="bb-cards-grid">
        {GAMES_LIST.map((g) => (
          <article key={g.key} className="bb-card">
            <div className="bb-card-icon" style={{ background: g.bg }}>
              {g.icon}
            </div>
            <h3>{g.title}</h3>
            <p>{g.desc}</p>
            <button className={`bb-btn ${g.btn}`} onClick={() => setActiveGame(g.key)}>
              {g.label}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}