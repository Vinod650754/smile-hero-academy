import React, { useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import { Flame, CheckCircle, Calendar as CalendarIcon, Star } from 'lucide-react';

export default function HabitCalendar() {
  const { profile } = useContext(ProfileContext);
  const streak = profile?.streak || 0;
  const stars = profile?.stars || 0;
  const lastBrushed = profile?.last_brushed_date;

  const todayStr = new Date().toISOString().split('T')[0];
  const brushedToday = lastBrushed === todayStr;

  // Generate last 7 days visual calendar bar
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const isDone = lastBrushed >= dateStr;

    return { dayName, dateStr, isDone };
  });

  return (
    <div className="bubbly-card" style={{ padding: '16px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Daily Habit Streak <Flame size={22} className="text-amber-500 fill-amber-500" />
          </div>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', marginTop: '2px' }}>
            Brush twice daily to keep your flame alive!
          </div>
        </div>

        <div style={{ background: '#fef3c7', border: '2px solid #f59e0b', padding: '6px 12px', borderRadius: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: '900', color: '#b45309' }}>🔥 {streak} Days</div>
          <div style={{ fontSize: '9px', fontWeight: '800', color: '#d97706' }}>STREAK</div>
        </div>
      </div>

      {/* 7-Day Visual Progress Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '16px' }}>
        {days.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: item.isDone ? '#dcfce7' : '#f1f5f9',
              border: item.isDone ? '2px solid #22c55e' : '2px solid #cbd5e1',
              borderRadius: '14px',
              padding: '10px 4px',
              textAlign: 'center',
              transition: 'transform 0.2s ease'
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b' }}>{item.dayName}</div>
            <div style={{ fontSize: '1.4rem', marginTop: '4px' }}>
              {item.isDone ? '🪥' : '⚪'}
            </div>
          </div>
        ))}
      </div>

      {/* Daily Status Banner */}
      <div style={{
        background: brushedToday ? '#f0fdf4' : '#f0f9ff',
        border: `2px solid ${brushedToday ? '#86efac' : '#bae6fd'}`,
        borderRadius: '16px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {brushedToday ? <CheckCircle size={22} color="#16a34a" /> : <CalendarIcon size={22} color="#0284c7" />}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '900', color: '#1e293b' }}>
              {brushedToday ? 'Brushing Complete Today!' : 'Ready for Today’s Brush?'}
            </div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b' }}>
              {brushedToday ? 'Great job! Come back tonight for your next session.' : 'Use the 2-minute timer to extend your streak!'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '900', color: '#0284c7', fontSize: '13px' }}>
          <Star size={16} fill="#0284c7" /> {stars}
        </div>
      </div>
    </div>
  );
}