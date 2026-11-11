import React, { useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import { Trophy, Shield, Lock, Award, Star } from 'lucide-react';

const BADGE_DEFINITIONS = [
  { id: 'First Smile', name: 'First Smile', emoji: '🌟', desc: 'Started your journey at Smile Hero Academy!' },
  { id: 'Master Brusher', name: 'Master Brusher', emoji: '🪥', desc: 'Completed a 2-minute brushing session.' },
  { id: 'Sugar Bug Buster', name: 'Sugar Bug Buster', emoji: '🦠', desc: 'Answered trivia questions in Sugar Bug Quiz.' },
  { id: 'Game Explorer', name: 'Game Explorer', emoji: '🎮', desc: 'Played & completed mini-games in the arcade.' },
  { id: 'Enamel Defender', name: 'Enamel Defender', emoji: '🛡️', desc: 'Maintained a 3-day brushing streak.' },
  { id: 'Superhero Tooth', name: 'Superhero Tooth', emoji: '🦸‍♂️', desc: 'Collected over 100 total stars!' }
];

export default function BadgeShelf() {
  const { profile } = useContext(ProfileContext);
  const unlockedBadges = profile?.unlocked_badges || ['First Smile'];

  return (
    <div className="bubbly-card" style={{ padding: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          Superhero Badge Trophy Room <Trophy size={20} className="text-amber-500 fill-amber-500" />
        </div>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', marginTop: '2px' }}>
          Unlocked {unlockedBadges.length} of {BADGE_DEFINITIONS.length} Achievement Trophies!
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {BADGE_DEFINITIONS.map(badge => {
          const isUnlocked = unlockedBadges.includes(badge.id);

          return (
            <div
              key={badge.id}
              style={{
                background: isUnlocked ? 'linear-gradient(180deg, #fff8dc 0%, #ffffff 100%)' : '#f8fafc',
                border: isUnlocked ? '3px solid #fbbf24' : '2px dashed #cbd5e1',
                borderRadius: '18px',
                padding: '14px 10px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: isUnlocked ? '0 6px 14px rgba(251, 191, 36, 0.2)' : 'none',
                opacity: isUnlocked ? 1 : 0.6
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>
                {isUnlocked ? badge.emoji : '🔒'}
              </div>

              <div style={{ fontSize: '12px', fontWeight: '900', color: isUnlocked ? '#b45309' : '#64748b' }}>
                {badge.name}
              </div>

              <div style={{ fontSize: '9px', fontWeight: '700', color: '#64748b', marginTop: '4px', minHeight: '24px' }}>
                {badge.desc}
              </div>

              {isUnlocked && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#22c55e',
                  color: 'white',
                  borderRadius: '99px',
                  padding: '2px 6px',
                  fontSize: '8px',
                  fontWeight: '900'
                }}>
                  UNLOCKED
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}