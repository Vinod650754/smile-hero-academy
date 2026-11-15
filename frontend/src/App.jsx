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
  const [loaderText, setLoaderText] = useState('LOADING BRUSHBUDDY...');
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const navigateToTab = (tab, gameKey = null, customLabel = null) => {
    setLoaderText(customLabel || `LOADING ${tab.toUpperCase()}...`);
    setIsLoading(true);
    setTimeout(() => {
      setSelectedGame(gameKey);
      setActiveTab(tab);
      setIsLoading(false);
    }, 600);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'brush', label: 'Brush', icon: Sparkles },
    { id: 'games', label: 'Arcade', icon: Gamepad2 },
    { id: 'streak', label: 'Streak', icon: Calendar },
    { id: 'badges', label: 'Badges', icon: Award },
  ];

  return (
    <div className="bb-app-shell">
      {isLoading && <Loader label={loaderText} />}

      <Navbar activeTab={activeTab} onNavigate={navigateToTab} navItems={navItems} />

      <main>
        {activeTab === 'home' && (
          <HomeHub
            onOpenBrushTab={() => navigateToTab('brush', null, 'PREPARING BRUSH GUIDE...')}
            onOpenBadgesTab={() => navigateToTab('badges', null, 'OPENING TROPHY SHELF...')}
            onOpenArcadeTab={() => navigateToTab('games', null, 'ENTERING ARCADE...')}
            onLaunchGame={(gameKey) =>
              navigateToTab('games', gameKey, 'LOADING MINI-QUEST...')
            }
          />
        )}

        {activeTab === 'brush' && (
          <div style={{ maxWidth: '540px', margin: '0 auto' }}>
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
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <HabitCalendar />
          </div>
        )}

        {activeTab === 'badges' && (
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
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
          bottom: '80px',
          right: '20px',
          width: '50px',
          height: '50px',
          background: '#0ea5e9',
          color: '#ffffff',
          border: '2px solid #161310',
          boxShadow: '4px 4px 0 #161310',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 50,
        }}
      >
        <MessageCircle size={22} />
      </button>

      {chatOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(22, 19, 16, 0.5)',
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
              maxWidth: '440px',
              background: '#ffffff',
              border: '3px solid #161310',
              boxShadow: '8px 8px 0 #161310',
              padding: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>
                DR. TOOTH AI
              </strong>
              <button
                className="bb-pixel-btn"
                style={{ padding: '4px 10px' }}
                onClick={() => setChatOpen(false)}
              >
                X
              </button>
            </div>
            <DentalAIChat />
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Hidden on >= 768px) */}
      <nav className="bb-mobile-bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateToTab(item.id)}
              style={{
                background: isActive ? '#1d4ed8' : 'transparent',
                color: isActive ? '#ffffff' : '#161310',
                border: isActive ? '2px solid #161310' : '2px solid transparent',
                boxShadow: isActive ? '2px 2px 0 #161310' : 'none',
                padding: '6px 2px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                cursor: 'pointer',
                fontFamily: 'var(--font-hud)',
                fontSize: '15px',
                textTransform: 'uppercase',
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}