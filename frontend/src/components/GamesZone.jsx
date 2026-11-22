import React, { useState, useEffect, useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';

import ToothDash from './Games/ToothDash';
import FlossRunner from './Games/FlossRunner';
import EnamelDefender from './Games/EnamelDefender';
import PlaquePattern from './Games/PlaquePattern';
import SugarBugZap from './Games/SugarBugZap';
import SugarBugQuiz from './Games/SugarBugQuiz';
import SmileSort from './Games/SmileSort';
import WordScramble from './Games/WordScramble';
import MemoryMatch from './Games/MemoryMatch';

const GAMES_LIST = [
  {
    key: 'ToothDash',
    title: 'Tooth Dash',
    desc: 'Sprint through Smile City! Tap Left, Right, or Jump to dodge sticky sweets and collect toothbrushes and water.',
    icon: '🏃',
    bg: '#e6f6ff',
    btn: 'bb-btn--primary',
    label: 'Play Tooth Dash',
  },
  {
    key: 'FlossRunner',
    title: 'Floss Runner',
    desc: 'Guide the super-floss ribbon smoothly between teeth to clear hidden plaque and earn sparkle combos!',
    icon: '🧵',
    bg: '#dff8ef',
    btn: 'bb-btn--gold',
    label: 'Play Floss Runner',
  },
  {
    key: 'EnamelDefender',
    title: 'Enamel Defender',
    desc: 'Aim your glowing fluoride shield to block incoming acid waves and keep your tooth fortress strong!',
    icon: '🛡️',
    bg: '#eee8ff',
    btn: 'bb-btn--secondary',
    label: 'Defend Enamel',
  },
  {
    key: 'PlaquePattern',
    title: 'Plaque Pattern',
    desc: 'Watch the glowing tooth zones light up, then tap them back in the exact same order to clear plaque!',
    icon: '🔍',
    bg: '#fff1d4',
    btn: 'bb-btn--primary',
    label: 'Play Pattern',
  },
  {
    key: 'SugarBugZap',
    title: 'Sugar Bug Zap',
    desc: 'Tap the sneaky sugar bugs fast before they hide behind your pearly white molars!',
    icon: '👾',
    bg: '#ffe9e9',
    btn: 'bb-btn--gold',
    label: 'Zap Sugar Bugs',
  },
  {
    key: 'SugarBugQuiz',
    title: 'Sugar Bug Quiz',
    desc: 'Answer 5 fun questions about brushing, fluoride, and healthy snacks to defeat the Plaque Boss.',
    icon: '🦠',
    bg: '#fff1d4',
    btn: 'bb-btn--secondary',
    label: 'Play Quiz',
  },
  {
    key: 'SmileSort',
    title: 'Smile Sort',
    desc: 'Sort tooth-friendly snacks and drinks from sugary cavity treats to keep your smile healthy.',
    icon: '🥦',
    bg: '#dff8ef',
    btn: 'bb-btn--primary',
    label: 'Play Smile Sort',
  },
  {
    key: 'WordScramble',
    title: 'Word Scramble',
    desc: 'Unscramble hidden dental tools and healthy smile power-ups using helpful clues.',
    icon: '🔤',
    bg: '#eee8ff',
    btn: 'bb-btn--gold',
    label: 'Play Scramble',
  },
  {
    key: 'MemoryMatch',
    title: 'Memory Match',
    desc: 'Flip cards to match pairs of brushing heroes, fluoride shields, and healthy habits!',
    icon: '🃏',
    bg: '#e6f6ff',
    btn: 'bb-btn--secondary',
    label: 'Match Cards',
  },
];

export default function GamesZone({ initialGame = null, onClearInitialGame }) {
  const [activeGame, setActiveGame] = useState(initialGame);
  const context = useContext(ProfileContext);
  const recordGameComplete = context?.recordGameComplete;
  const addStars = context?.addStars;

  useEffect(() => {
    if (initialGame) setActiveGame(initialGame);
  }, [initialGame]);

  const handleBack = () => {
    setActiveGame(null);
    if (onClearInitialGame) onClearInitialGame();
  };

  const handleComplete = (starsEarned = 15, extra = {}) => {
    if (typeof recordGameComplete === 'function' && activeGame) {
      recordGameComplete(activeGame, starsEarned, extra);
    } else if (typeof addStars === 'function') {
      addStars(starsEarned);
    }
  };

  const renderGame = () => {
    const props = { onComplete: handleComplete, onBack: handleBack };
    switch (activeGame) {
      case 'ToothDash':
        return <ToothDash {...props} />;
      case 'FlossRunner':
        return <FlossRunner {...props} />;
      case 'EnamelDefender':
        return <EnamelDefender {...props} />;
      case 'PlaquePattern':
        return <PlaquePattern {...props} />;
      case 'SugarBugZap':
        return <SugarBugZap {...props} />;
      case 'SugarBugQuiz':
        return <SugarBugQuiz {...props} />;
      case 'SmileSort':
        return <SmileSort {...props} />;
      case 'WordScramble':
        return <WordScramble {...props} />;
      case 'MemoryMatch':
        return <MemoryMatch {...props} />;
      default:
        return null;
    }
  };

  if (activeGame) {
    const meta = GAMES_LIST.find((g) => g.key === activeGame);
    return (
      <section className="bb-panel" style={{ maxWidth: '740px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div className="bb-eyebrow">Fun Games Zone</div>
            <h2 style={{ margin: '4px 0 0' }}>
              {meta?.icon} {meta?.title}
            </h2>
          </div>
          <button className="bb-btn bb-btn--quiet" onClick={handleBack}>
            ← All Games
          </button>
        </div>
        {renderGame()}
      </section>
    );
  }

  return (
    <section className="bb-panel">
      <div>
        <div className="bb-eyebrow">Fun Games Zone • 9 Smile Adventures</div>
        <h2 style={{ margin: '6px 0' }}>🎮 Play, learn & earn stars!</h2>
        <p style={{ color: '#60758a', lineHeight: 1.6, margin: '6px 0 20px' }}>
          Pick any mini-game below to practice healthy smile habits, collect stars, and unlock
          your Arcade Explorer badge!
        </p>
      </div>

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