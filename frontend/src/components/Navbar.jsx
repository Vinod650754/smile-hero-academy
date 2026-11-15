import React, { useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import { Star, Flame } from 'lucide-react';

export default function Navbar({ activeTab, onNavigate, navItems = [] }) {
  const context = useContext(ProfileContext);
  const profile = context?.profile;

  const avatarEmoji = profile?.avatar_emoji || '🦷';
  const starsCount = profile?.stars ?? 10;
  const streakCount = profile?.streak ?? 0;

  return (
    <header className="bb-navbar">
      {/* Brand Identity */}
      <div
        onClick={() => onNavigate && onNavigate('home')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            background: '#e0f2fe',
            border: '2px solid #161310',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.45rem',
          }}
        >
          {avatarEmoji}
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '14px',
              letterSpacing: '0.08em',
              color: '#0284c7',
              lineHeight: 1,
            }}
          >
            DENTAL QUEST v2
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: '700',
              color: '#161310',
              lineHeight: 1.1,
            }}
          >
            BrushBuddy
          </div>
        </div>
      </div>

      {/* Desktop / Tablet Top Navigation */}
      <nav className="bb-desktop-nav" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`bb-nav-pill ${isActive ? 'bb-nav-pill--active' : ''}`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Streak & Star Counters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#e0f2fe',
            border: '2px solid #161310',
            padding: '5px 9px',
            fontFamily: 'var(--font-hud)',
            fontSize: '17px',
            color: '#1d4ed8',
          }}
        >
          <Flame size={15} fill="#0284c7" color="#0284c7" />
          <span>{streakCount}D</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: '#fef08a',
            border: '2px solid #161310',
            padding: '5px 11px',
            fontFamily: 'var(--font-hud)',
            fontSize: '18px',
            color: '#161310',
          }}
        >
          <Star size={15} fill="#eab308" color="#161310" />
          <span>{starsCount}</span>
        </div>
      </div>
    </header>
  );
}