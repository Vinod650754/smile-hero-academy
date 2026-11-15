import React, { useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';

export default function Navbar({ activeTab, onNavigate, navItems = [] }) {
  const context = useContext(ProfileContext);
  const profile = context?.profile;
  const starsCount = profile?.stars ?? 0;

  return (
    <header className="bb-navbar">
      <div className="bb-brand" onClick={() => onNavigate && onNavigate('home')}>
        <span className="bb-brand-badge">🦷</span>
        <span>BRUSHBUDDY</span>
      </div>

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

      <div className="bb-score-pill">
        <span>⭐</span>
        <span>{starsCount} stars</span>
      </div>
    </header>
  );
}