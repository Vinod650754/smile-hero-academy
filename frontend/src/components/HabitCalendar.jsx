import React, { useState, useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';

export default function HabitCalendar() {
  const context = useContext(ProfileContext);
  const profile = context?.profile || {};

  const currentStreak = profile.streak || 0;
  const longestStreak = profile.longest_streak || 0;
  const totalBrushes = profile.total_brushes || 0;
  const brushedSet = new Set(profile.brushed_dates || []);

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const firstDayWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayStr = now.toISOString().split('T')[0];

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Next streak milestone helper
  const nextMilestone =
    currentStreak < 3 ? 3 : currentStreak < 10 ? 10 : currentStreak < 50 ? 50 : 100;
  const daysToNext = Math.max(0, nextMilestone - currentStreak);

  const cells = [];
  for (let i = 0; i < firstDayWeekday; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    cells.push({ day: d, dateStr: `${viewYear}-${mm}-${dd}` });
  }

  return (
    <div>
      <div className="bb-eyebrow">Daily Habit Tracker</div>
      <h2 style={{ margin: '6px 0 6px' }}>🔥 Your Brushing Streak</h2>
      <p style={{ color: '#60758a', lineHeight: 1.55, margin: '0 0 20px' }}>
        Every day you complete your 2-minute Brush Battle, your streak grows and lights up on
        your Smile Calendar!
      </p>

      {/* Real Stats Summary Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            background: '#dff8ef',
            borderRadius: '20px',
            padding: '16px 12px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.6rem' }}>🔥</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0b8178' }}>
            {currentStreak}
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#18324b' }}>
            Current Streak
          </div>
        </div>

        <div
          style={{
            background: '#fff4d4',
            borderRadius: '20px',
            padding: '16px 12px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.6rem' }}>👑</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#b45309' }}>
            {longestStreak}
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#18324b' }}>
            Longest Streak
          </div>
        </div>

        <div
          style={{
            background: '#e6f6ff',
            borderRadius: '20px',
            padding: '16px 12px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.6rem' }}>🪥</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#18324b' }}>
            {totalBrushes}
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#18324b' }}>
            Total Sessions
          </div>
        </div>
      </div>

      {/* Milestone Progress Banner */}
      <div
        style={{
          background: '#f5fbff',
          border: '1px solid #d9ecf8',
          borderRadius: '16px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>
          🎯 Next Trophy: <strong>{nextMilestone}-Day Streak Badge</strong>
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0d9488' }}>
          {daysToNext === 0
            ? 'Unlocked!'
            : `${daysToNext} more ${daysToNext === 1 ? 'day' : 'days'} to go!`}
        </span>
      </div>

      {/* Monthly Calendar */}
      <div
        style={{
          background: '#f8fcff',
          border: '1px solid #e3edf5',
          borderRadius: '22px',
          padding: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
          }}
        >
          <button
            className="bb-btn bb-btn--quiet"
            style={{ padding: '6px 12px' }}
            onClick={prevMonth}
          >
            ←
          </button>
          <strong style={{ fontSize: '1.05rem' }}>
            {monthNames[viewMonth]} {viewYear}
          </strong>
          <button
            className="bb-btn bb-btn--quiet"
            style={{ padding: '6px 12px' }}
            onClick={nextMonth}
          >
            →
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '6px',
            textAlign: 'center',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#60758a',
            marginBottom: '8px',
          }}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {cells.map((cell, idx) => {
            if (!cell) return <div key={`empty-${idx}`} />;
            const isBrushed = brushedSet.has(cell.dateStr);
            const isToday = cell.dateStr === todayStr;

            return (
              <div
                key={cell.dateStr}
                style={{
                  aspectRatio: '1',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  background: isBrushed ? '#0d9488' : isToday ? '#fff4d4' : '#ffffff',
                  color: isBrushed ? '#ffffff' : '#18324b',
                  border: isToday ? '2px solid #ffd166' : '1px solid #e5eef5',
                }}
              >
                <span>{cell.day}</span>
                {isBrushed && <span style={{ fontSize: '0.72rem', lineHeight: 1 }}>🦷</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}