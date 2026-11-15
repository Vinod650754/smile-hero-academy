import React, { useState, useEffect, useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import { ArrowLeft, Gamepad2, Star } from 'lucide-react';

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
  { key: 'SugarBugZap', title: 'Sugar Bug Zap', kicker: 'REFLEX • +15 STARS', desc: 'Zap cavity bugs before they attack your pearly white molars!', sprite: '👾', tag: 'FEATURED' },
  { key: 'SugarBugQuiz', title: 'Sugar Bug Quiz', kicker: 'TRIVIA • +20 STARS', desc: 'Outsmart the Plaque Boss with fast dental health trivia.', sprite: '🧠', tag: 'FEATURED' },
  { key: 'WordScramble', title: 'Word Scramble', kicker: 'VOCAB • +15 STARS', desc: 'Unscramble secret dentist tools and healthy smile power-ups.', sprite: '🔤', tag: 'FEATURED' },
  { key: 'ToothDash', title: 'Tooth Dash', kicker: 'RUNNER • +15 STARS', desc: 'Dodge sticky candy and grab fluoride shields at top speed.', sprite: '🦷', tag: 'ACTION' },
  { key: 'SmileSort', title: 'Smile Sort', kicker: 'SORTING • +15 STARS', desc: 'Sort tooth-friendly snacks from cavity-causing sugar bombs.', sprite: '🍎', tag: 'PUZZLE' },
  { key: 'MemoryMatch', title: 'Memory Match', kicker: 'MEMORY • +15 STARS', desc: 'Flip and match pairs of dental heroes and brushing tools.', sprite: '🃏', tag: 'BRAIN' },
  { key: 'ClinicCleaner', title: 'Clinic Cleaner', kicker: 'SCRUB • +15 STARS', desc: 'Polish and sanitize the dental chair before the next patient.', sprite: '✨', tag: 'ARCADE' },
  { key: 'BrushingBeat', title: 'Brushing Beat', kicker: 'RHYTHM • +20 STARS', desc: 'Brush to the beat and hit every sparkle note on time.', sprite: '🎵', tag: 'RHYTHM' },
  { key: 'FlossRunner', title: 'Floss Runner', kicker: 'SKILL • +15 STARS', desc: 'Weave dental floss cleanly between tight tooth gaps.', sprite: '🧵', tag: 'ACTION' },
  { key: 'EnamelDefender', title: 'Enamel Defender', kicker: 'DEFENSE • +20 STARS', desc: 'Shield your enamel armor against incoming acid waves.', sprite: '🛡️', tag: 'DEFENSE' },
  { key: 'CavityDodge', title: 'Cavity Dodge', kicker: 'DODGE • +15 STARS', desc: 'Steer clear of falling soda drops and sticky caramels.', sprite: '⚡', tag: 'ARCADE' },
  { key: 'PlaquePattern', title: 'Plaque Pattern', kicker: 'LOGIC • +15 STARS', desc: 'Repeat the flashing toothbrush sequence to clear plaque.', sprite: '🔢', tag: 'BRAIN' },
  { key: 'StainEraser', title: 'Stain Eraser', kicker: 'SCRUB • +15 STARS', desc: 'Rub away stubborn stains to reveal a dazzling smile.', sprite: '🪥', tag: 'SKILL' },
];

export default function GamesZone({ initialGame = null, onClearInitialGame }) {
  const [activeGame, setActiveGame] = useState(initialGame);
  const context = useContext(ProfileContext);
  const addStars = context?.addStars;

  useEffect(() => {
    if (initialGame) {
      setActiveGame(initialGame);
    }
  }, [initialGame]);

  const handleBackToArcade = () => {
    setActiveGame(null);
    if (onClearInitialGame) onClearInitialGame();
  };

  const handleGameComplete = (starsEarned = 15) => {
    if (typeof addStars === 'function') addStars(starsEarned);
  };

  const renderActiveGame = () => {
    const commonProps = { onComplete: handleGameComplete, onBack: handleBackToArcade };
    switch (activeGame) {
      case 'ToothDash': return <ToothDash {...commonProps} />;
      case 'SmileSort': return <SmileSort {...commonProps} />;
      case 'MemoryMatch': return <MemoryMatch {...commonProps} />;
      case 'SugarBugZap': return <SugarBugZap {...commonProps} />;
      case 'SugarBugQuiz': return <SugarBugQuiz {...commonProps} />;
      case 'ClinicCleaner': return <ClinicCleaner {...commonProps} />;
      case 'WordScramble': return <WordScramble {...commonProps} />;
      case 'BrushingBeat': return <BrushingBeat {...commonProps} />;
      case 'FlossRunner': return <FlossRunner {...commonProps} />;
      case 'EnamelDefender': return <EnamelDefender {...commonProps} />;
      case 'CavityDodge': return <CavityDodge {...commonProps} />;
      case 'PlaquePattern': return <PlaquePattern {...commonProps} />;
      case 'StainEraser': return <StainEraser {...commonProps} />;
      default: return null;
    }
  };

  if (activeGame) {
    const currentMeta = GAMES_LIST.find((g) => g.key === activeGame);
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
            border: '2px solid #161310',
            boxShadow: '4px 4px 0 #161310',
            padding: '8px 12px',
          }}
        >
          <button
            onClick={handleBackToArcade}
            className="bb-pixel-btn"
            style={{ padding: '6px 10px', fontSize: '13px' }}
          >
            <ArrowLeft size={15} />
            <span>ARCADE</span>
          </button>

          <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '19px' }}>
            {currentMeta?.title || 'MINI-QUEST'}
          </span>

          <span style={{ fontSize: '20px' }}>{currentMeta?.sprite}</span>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '2px solid #161310',
            boxShadow: '6px 6px 0 #161310',
            padding: '14px',
          }}
        >
          {renderActiveGame()}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#1d4ed8',
          color: '#ffffff',
          border: '2px solid #161310',
          boxShadow: '4px 4px 0 #161310',
          padding: '10px 14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gamepad2 size={20} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '20px' }}>
            BRUSHBUDDY ARCADE
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-hud)', fontSize: '17px', color: '#bae6fd' }}>
          {GAMES_LIST.length} QUESTS AVAILABLE
        </span>
      </div>

      <div className="bb-quest-grid">
        {GAMES_LIST.map((game) => (
          <div
            key={game.key}
            onClick={() => setActiveGame(game.key)}
            className="ow-quest-card"
            style={{ padding: '14px' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  flexShrink: 0,
                  background: '#2563eb',
                  border: '2px solid #161310',
                  boxShadow: '3px 3px 0 #161310',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                }}
              >
                {game.sprite}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                    marginBottom: '2px',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-hud)', fontSize: '15px', color: '#0284c7' }}>
                    {game.kicker}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-hud)',
                      fontSize: '13px',
                      background: game.tag === 'FEATURED' ? '#fef08a' : '#e0f2fe',
                      border: '1.5px solid #161310',
                      padding: '1px 6px',
                    }}
                  >
                    {game.tag}
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: '700',
                    fontSize: '20px',
                    lineHeight: 1.1,
                    marginBottom: '4px',
                  }}
                >
                  {game.title}
                </div>

                <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.35 }}>
                  {game.desc}
                </div>
              </div>
            </div>

            <div className="ow-quest-card__meta" style={{ marginTop: '12px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-hud)', fontSize: '15px', color: '#1d4ed8' }}>
                <Star size={13} fill="#eab308" color="#161310" /> WIN REWARD
              </span>
              <span className="ow-quest-card__stamp ow-quest-card__stamp--accent">
                PLAY QUEST ▶
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}