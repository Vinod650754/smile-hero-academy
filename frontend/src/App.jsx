import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeHub from './components/HomeHub';
import BrushTimer from './components/BrushTimer';
import GamesZone from './components/GamesZone';
import HabitCalendar from './components/HabitCalendar';
import BadgeShelf from './components/BadgeShelf';
import DentalAIChat from './components/DentalAIChat';
import Loader from './components/Loader';
import { Home, Sparkles, Gamepad2, Calendar, Award, MessageCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loaderText, setLoaderText] = useState('Loading BrushBuddy...');
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 950);
    return () => clearTimeout(timer);
  }, []);

  const navigateToTab = (tab, gameKey = null, customLabel = null) => {
    setLoaderText(customLabel || `Loading ${tab}...`);
    setIsLoading(true);
    setTimeout(() => {
      setSelectedGame(gameKey);
      setActiveTab(tab);
      setIsLoading(false);
    }, 550);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'brush', label: 'Brush', icon: Sparkles },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'streak', label: 'Streak', icon: Calendar },
    { id: 'badges', label: 'Rewards', icon: Award },
  ];

  return (
    <div className="bb-app-shell">
      {isLoading && <Loader label={loaderText} />}

      <Navbar activeTab={activeTab} onNavigate={navigateToTab} navItems={navItems} />

      <main>
        {activeTab === 'home' && (
          <HomeHub
            onOpenBrushTab={() => navigateToTab('brush', null, 'Preparing Brush Battle...')}
            onOpenBadgesTab={() => navigateToTab('badges', null, 'Opening Trophy Shelf...')}
            onOpenArcadeTab={() => navigateToTab('games', null, 'Entering Games Zone...')}
            onLaunchGame={(gameKey) => navigateToTab('games', gameKey, 'Starting Mission...')}
          />
        )}

        {activeTab === 'brush' && (
          <div className="bb-panel" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <BrushTimer />
          </div>
        )}

        {activeTab === 'games' && (
          <GamesZone
            initialGame={selectedGame}
            onClearInitialGame={() => setSelectedGame(null)}
          />
        )}

        {activeTab === 'streak' && (
          <div className="bb-panel" style={{ maxWidth: '680px', margin: '0 auto' }}>
            <HabitCalendar />
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="bb-panel" style={{ maxWidth: '780px', margin: '0 auto' }}>
            <BadgeShelf />
          </div>
        )}
      </main>

      {/* Floating Dr. Tooth AI Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        aria-label="Ask Dr. Tooth AI"
        style={{
          position: 'fixed',
          bottom: '82px',
          right: '22px',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: '#0d9488',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 8px 22px rgba(13, 148, 136, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 50,
        }}
      >
        <MessageCircle size={24} />
      </button>

      {chatOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(24, 50, 75, 0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '450px',
              background: '#ffffff',
              borderRadius: '24px',
              boxShadow: '0 20px 45px rgba(24, 50, 75, 0.18)',
              padding: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <strong style={{ fontSize: '1.1rem' }}>🦷 Ask Dr. Tooth AI</strong>
              <button
                className="bb-btn bb-btn--quiet"
                style={{ padding: '6px 12px' }}
                onClick={() => setChatOpen(false)}
              >
                ✕
              </button>
            </div>
            <DentalAIChat />
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="bb-mobile-bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateToTab(item.id)}
              style={{
                background: 'transparent',
                color: isActive ? '#0d9488' : '#60758a',
                border: 'none',
                padding: '4px 2px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                cursor: 'pointer',
                fontWeight: isActive ? 900 : 700,
                fontSize: '0.75rem',
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}