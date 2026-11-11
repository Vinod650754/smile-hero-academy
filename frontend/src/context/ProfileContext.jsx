import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const ProfileContext = createContext();

const DEFAULT_PROFILE = {
  stars: 10,
  streak: 1,
  last_brushed_date: new Date().toISOString().split('T')[0],
  unlocked_badges: ['First Smile']
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    device_id: 'local_device',
    ...DEFAULT_PROFILE
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrCreateProfile() {
      try {
        let deviceId = localStorage.getItem('smile_hero_device_id');
        if (!deviceId) {
          deviceId = 'device_' + Math.random().toString(36).substring(2, 11);
          localStorage.setItem('smile_hero_device_id', deviceId);
        }

        // Fetch existing profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('device_id', deviceId)
          .maybeSingle();

        if (data) {
          setProfile(data);
        } else {
          // Insert payload matching Supabase schema
          const payload = {
            device_id: deviceId,
            ...DEFAULT_PROFILE
          };

          const { data: insertedProfile, error: insertError } = await supabase
            .from('profiles')
            .upsert(payload, { onConflict: 'device_id' })
            .select()
            .maybeSingle();

          if (insertedProfile) {
            setProfile(insertedProfile);
          } else {
            console.warn("Operating with local profile state:", insertError?.message);
            setProfile(payload);
          }
        }
      } catch (err) {
        console.warn("Fallback to local profile state:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrCreateProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}