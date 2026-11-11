import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BrushTimer from './components/BrushTimer';
import GamesZone from './components/GamesZone';
import HabitCalendar from './components/HabitCalendar';
import BadgeShelf from './components/BadgeShelf';
import DentalAIChat from './components/DentalAIChat';

import { Sparkles, Gamepad2, Calendar, Award, Bot } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('brush');
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #fef3c7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Container Frame */}
      <div style={{
        width: '100%',
        maxWidth: '430px',
        height: '820px',
        maxHeight: '94vh',
        background: '#ffffff',
        borderRadius: '32px',
        boxShadow: '0 20px 40px rgba(2, 132, 199, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        border: '4px solid #ffffff'
      }}>
        
        {/* Header Navbar */}
        <div style={{ padding: '16px 16px 0 16px', flexShrink: 0 }}>
          <Navbar />
        </div>

        {/* Scrollable Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 16px 85px 16px',
          scrollbarWidth: 'none'
        }}>
          {activeTab === 'brush' && <BrushTimer />}
          {activeTab === 'arcade' && <GamesZone />}
          {activeTab === 'streak' && <HabitCalendar />}
          {activeTab === 'badges' && <BadgeShelf />}
        </div>

        {/* Floating Dr. Tooth AI Button */}
        <button
          onClick={() => setShowAIChat(prev => !prev)}
          style={{
            position: 'absolute',
            bottom: '76px',
            right: '20px',
            background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
            color: '#ffffff',
            border: '2px solid #ffffff',
            borderRadius: '99px',
            padding: '8px 16px',
            fontWeight: '900',
            fontSize: '11px',
            boxShadow: '0 8px 16px rgba(2, 132, 199, 0.35)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 40
          }}
        >
          <Bot size={16} /> Dr. Tooth AI
        </button>

        {/* AI Assistant Overlay */}
        {showAIChat && (
          <div style={{
            position: 'absolute',
            bottom: '70px',
            left: '12px',
            right: '12px',
            maxHeight: '380px',
            zIndex: 50,
            boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
            borderRadius: '24px',
            overflow: 'hidden'
          }}>
            <DentalAIChat onClose={() => setShowAIChat(false)} />
          </div>
        )}

        {/* Permanent Bottom Tab Navigation */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '68px',
          background: '#ffffff',
          borderTop: '2px solid #f1f5f9',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          alignItems: 'center',
          padding: '0 8px',
          zIndex: 30
        }}>
          <button
            onClick={() => setActiveTab('brush')}
            style={{
              background: activeTab === 'brush' ? '#e0f2fe' : 'transparent',
              border: 'none',
              borderRadius: '16px',
              padding: '8px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={18} color={activeTab === 'brush' ? '#0284c7' : '#94a3b8'} />
            <span style={{ fontSize: '10px', fontWeight: '800', color: activeTab === 'brush' ? '#0284c7' : '#64748b' }}>
              Brush
            </span>
          </button>

          <button
            onClick={() => setActiveTab('arcade')}
            style={{
              background: activeTab === 'arcade' ? '#e0f2fe' : 'transparent',
              border: 'none',
              borderRadius: '16px',
              padding: '8px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              cursor: 'pointer'
            }}
          >
            <Gamepad2 size={18} color={activeTab === 'arcade' ? '#0284c7' : '#94a3b8'} />
            <span style={{ fontSize: '10px', fontWeight: '800', color: activeTab === 'arcade' ? '#0284c7' : '#64748b' }}>
              Arcade
            </span>
          </button>

          <button
            onClick={() => setActiveTab('streak')}
            style={{
              background: activeTab === 'streak' ? '#e0f2fe' : 'transparent',
              border: 'none',
              borderRadius: '16px',
              padding: '8px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              cursor: 'pointer'
            }}
          >
            <Calendar size={18} color={activeTab === 'streak' ? '#0284c7' : '#94a3b8'} />
            <span style={{ fontSize: '10px', fontWeight: '800', color: activeTab === 'streak' ? '#0284c7' : '#64748b' }}>
              Streak
            </span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            style={{
              background: activeTab === 'badges' ? '#e0f2fe' : 'transparent',
              border: 'none',
              borderRadius: '16px',
              padding: '8px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              cursor: 'pointer'
            }}
          >
            <Award size={18} color={activeTab === 'badges' ? '#0284c7' : '#94a3b8'} />
            <span style={{ fontSize: '10px', fontWeight: '800', color: activeTab === 'badges' ? '#0284c7' : '#64748b' }}>
              Badges
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}