import React, { useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import { Star } from 'lucide-react';

export default function Navbar() {
  const { profile } = useContext(ProfileContext);

  // Safe fallback values to prevent reading from null
  const avatarEmoji = profile?.avatar_emoji || '🦷';
  const starsCount = profile?.stars ?? 0;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      background: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#e0f2fe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          {avatarEmoji}
        </div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>
            SMILE HERO
          </div>
          <div style={{ fontSize: '15px', fontWeight: '900', color: '#1e293b' }}>
            Smile Hero
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: '#fef3c7',
        border: '2px solid #fde047',
        padding: '6px 12px',
        borderRadius: '99px',
        fontWeight: '900',
        fontSize: '13px',
        color: '#b45309'
      }}>
        <Star size={16} fill="#f59e0b" color="#f59e0b" />
        <span>{starsCount}</span>
      </div>
    </div>
  );
}