import React, { useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';

export default function BadgeShelf() {
  const context = useContext(ProfileContext);
  const profile = context?.profile || {};

  const stars = profile.stars || 0;
  const totalBrushes = profile.total_brushes || 0;
  const bestStreak = Math.max(profile.streak || 0, profile.longest_streak || 0);
  const gamesPlayedCount = (profile.games_played || []).length;
  const quizBest = profile.quiz_high_score || 0;

  const badges = [
    {
      id: 'first-brush',
      emoji: '🪥',
      title: 'Brush Buddy',
      desc: 'Complete your first full 2-minute brushing session.',
      earned: totalBrushes >= 1,
      progressLabel: `${Math.min(1, totalBrushes)} / 1 session`,
    },
    {
      id: 'quiz-buster',
      emoji: '🧠',
      title: 'Sugar Bug Buster',
      desc: 'Score 4 or more in the Sugar Bug Quiz challenge.',
      earned: quizBest >= 4,
      progressLabel: `${Math.min(4, quizBest)} / 4 score`,
    },
    {
      id: 'arcade-explorer',
      emoji: '🎮',
      title: 'Arcade Explorer',
      desc: 'Play and finish 3 different dental mini-games.',
      earned: gamesPlayedCount >= 3,
      progressLabel: `${Math.min(3, gamesPlayedCount)} / 3 games`,
    },
    {
      id: 'star-collector',
      emoji: '⭐',
      title: 'Star Collector',
      desc: 'Collect 100 stars across brushing missions and games.',
      earned: stars >= 100,
      progressLabel: `${Math.min(100, stars)} / 100 stars`,
    },
    {
      id: 'streak-3',
      emoji: '🔥',
      title: '3-Day Spark',
      desc: 'Keep your brushing habit alive for 3 days in a row.',
      earned: bestStreak >= 3,
      progressLabel: `${Math.min(3, bestStreak)} / 3 days`,
    },
    {
      id: 'streak-10',
      emoji: '🏅',
      title: '10-Day Smile Hero',
      desc: 'Brush every day for 10 consecutive days!',
      earned: bestStreak >= 10,
      progressLabel: `${Math.min(10, bestStreak)} / 10 days`,
    },
    {
      id: 'streak-50',
      emoji: '👑',
      title: '50-Day Enamel Master',
      desc: 'An extraordinary 50-day brushing streak!',
      earned: bestStreak >= 50,
      progressLabel: `${Math.min(50, bestStreak)} / 50 days`,
    },
    {
      id: 'streak-100',
      emoji: '🏆',
      title: '100-Day Champion',
      desc: 'Legendary status: 100 days of healthy smile care!',
      earned: bestStreak >= 100,
      progressLabel: `${Math.min(100, bestStreak)} / 100 days`,
    },
  ];

  const unlockedCount = badges.filter((b) => b.earned).length;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '6px',
        }}
      >
        <div>
          <div className="bb-eyebrow">Your Trophy Shelf</div>
          <h2 style={{ margin: '6px 0' }}>🏆 Smile Hero Rewards</h2>
        </div>
        <div className="bb-score-pill">
          🏅 {unlockedCount} of {badges.length} Unlocked
        </div>
      </div>

      <p style={{ color: '#60758a', lineHeight: 1.55, margin: '0 0 20px' }}>
        Every brushing session and mini-game brings you closer to new streak trophies and
        Smile Champion badges!
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
        }}
      >
        {badges.map((b) => (
          <div
            key={b.id}
            style={{
              background: b.earned ? '#fff8dc' : '#f6f9fc',
              border: b.earned ? '2px solid #f4d36a' : '2px dashed #dbe6ef',
              borderRadius: '20px',
              padding: '18px 16px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '8px',
              opacity: b.earned ? 1 : 0.85,
            }}
          >
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>
                {b.earned ? b.emoji : '🔒'}
              </div>
              <strong style={{ display: 'block', fontSize: '1.05rem', marginBottom: '4px' }}>
                {b.title}
              </strong>
              <p style={{ fontSize: '0.86rem', color: '#60758a', margin: 0, lineHeight: 1.45 }}>
                {b.desc}
              </p>
            </div>

            <div
              style={{
                marginTop: '8px',
                padding: '5px 10px',
                borderRadius: '99px',
                fontSize: '0.78rem',
                fontWeight: 800,
                background: b.earned ? '#0d9488' : '#e6eef5',
                color: b.earned ? '#ffffff' : '#60758a',
              }}
            >
              {b.earned ? '✓ UNLOCKED' : b.progressLabel}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '24px',
          background: 'linear-gradient(125deg, #e0f8f1, #e5f4ff)',
          borderRadius: '20px',
          padding: '18px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#60758a' }}>
          TOTAL STARS EARNED
        </div>
        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#18324b', marginTop: '4px' }}>
          ⭐ {stars} stars
        </div>
      </div>
    </div>
  );
}