import React, { useState, useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import { supabase } from '../supabaseClient';
import confetti from 'canvas-confetti';
import { Gamepad2 } from 'lucide-react';

// Modular Component Imports from src/components/Games/
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

export default function GamesZone() {
  const { profile, setProfile } = useContext(ProfileContext);
  const [activeGame, setActiveGame] = useState('menu');

  const awardRewards = async (starsEarned, badgeName) => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    const unlocked = [...(profile?.unlocked_badges || [])];
    if (badgeName && !unlocked.includes(badgeName)) {
      unlocked.push(badgeName);
    }
    const newStars = (profile?.stars || 0) + starsEarned;

    const { data } = await supabase
      .from('profiles')
      .update({ stars: newStars, unlocked_badges: unlocked })
      .eq('device_id', profile?.device_id)
      .select()
      .single();

    if (data) setProfile(data);
  };

  // Modular Component Routing
  if (activeGame === 'dash') return <ToothDash onBack={() => setActiveGame('menu')} onComplete={awardRewards} />;
  if (activeGame === 'sort') return <SmileSort onBack={() => setActiveGame('menu')} onComplete={awardRewards} />;
  if (activeGame === 'memory') return <MemoryMatch onBack={() => setActiveGame('menu')} onComplete={awardRewards} />;
  if (activeGame === 'zap') return <SugarBugZap onBack={() => setActiveGame('menu')} onComplete={awardRewards} />;
  if (activeGame === 'quiz') return <SugarBugQuiz onBack={() => setActiveGame('menu')} onComplete={awardRewards} />;
  if (activeGame === 'cleaner') return <ClinicCleaner onBack={() => setActiveGame('menu')} onComplete={awardRewards} />;
  if (activeGame === 'scramble') return <WordScramble onBack={() => setActiveGame('menu')} onComplete={awardRewards} />;
  if (activeGame === 'beat') return <BrushingBeat onBack={() => setActiveGame('menu')} onComplete={awardRewards} />;
  if (activeGame === 'floss') return <FlossRunner onBack={() => setActiveGame('menu')} onComplete={awardRewards} />;
  if (activeGame === 'shield') return <EnamelDefender onBack={() => setActiveGame('menu')} onComplete={awardRewards} />;
  if (activeGame === 'dodge') return <CavityDodge onBack={() => setActiveGame('menu')} onComplete={awardRewards} />;
  if (activeGame === 'pattern') return <PlaquePattern onBack={() => setActiveGame('menu')} onComplete={awardRewards} />;
  if (activeGame === 'eraser') return <StainEraser onBack={() => setActiveGame('menu')} onComplete={awardRewards} />;

  const ARCADE_LIST = [
    { id: 'dash', name: 'Tooth Dash', emoji: '🏃‍♂️', cat: 'Action', desc: '60FPS Canvas runner with 3 hearts & speed curve!' },
    { id: 'zap', name: 'Sugar Bug Zap', emoji: '🔨', cat: 'Action', desc: 'Tap sugar bugs popping out of teeth!' },
    { id: 'sort', name: 'Smile Sort', emoji: '🥦', cat: 'Brain', desc: 'Sort healthy foods vs sugary treats!' },
    { id: 'memory', name: 'Memory Match', emoji: '🂠', cat: 'Brain', desc: 'Flip and match hidden dental hero pairs!' },
    { id: 'quiz', name: 'Sugar Bug Quiz', emoji: '🧠', cat: 'Brain', desc: 'Randomized dental superhero trivia!' },
    { id: 'cleaner', name: 'Clinic Cleaner', emoji: '🧼', cat: 'Simulation', desc: 'Use dental tools to wash away stains!' },
    { id: 'scramble', name: 'Word Scramble', emoji: '🔤', cat: 'Brain', desc: 'Unscramble secret superhero dental words!' },
    { id: 'beat', name: 'Brushing Beat', emoji: '🎵', cat: 'Rhythm', desc: 'Tap to the 2-minute brushing tune rhythm!' },
    { id: 'floss', name: 'Floss Runner', emoji: '🧵', cat: 'Action', desc: 'Slide floss between tight gaps to clear plaque!' },
    { id: 'shield', name: 'Enamel Defender', emoji: '🛡️', cat: 'Action', desc: 'Rotate fluoride barrier to deflect acid drops!' },
    { id: 'dodge', name: 'Cavity Dodge', emoji: '⚡', cat: 'Action', desc: 'Dodge sticky caramel drops while catching apples!' },
    { id: 'pattern', name: 'Plaque Pattern', emoji: '🧩', cat: 'Brain', desc: 'Repeat the 4-stage brushing sequence!' },
    { id: 'eraser', name: 'Stain Eraser', emoji: '✨', cat: 'Simulation', desc: 'Scrub dark marks with soft bristles!' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          Daily Game Arcade <Gamepad2 size={20} className="text-sky-600" />
        </div>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', marginTop: '2px' }}>
          Modular Pediatric Tooth Mini-Games!
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto', paddingRight: '4px' }}>
        {ARCADE_LIST.map(g => (
          <div key={g.id} className="bubbly-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '12px' }}>
            <span style={{ fontSize: '2rem', background: '#e0f2fe', padding: '8px', borderRadius: '14px' }}>{g.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: '900', color: '#1e293b' }}>
                {g.name} <span style={{ fontSize: '8px', background: '#fef08a', color: '#854d0e', padding: '2px 6px', borderRadius: '99px', marginLeft: '4px' }}>{g.cat}</span>
              </div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', marginTop: '2px' }}>{g.desc}</div>
            </div>
            <button
              className="bubbly-btn-primary"
              onClick={() => setActiveGame(g.id)}
              style={{ width: 'auto', padding: '8px 14px', fontSize: '10px' }}
            >
              PLAY
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}