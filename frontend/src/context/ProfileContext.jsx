import React, { createContext, useState, useEffect } from 'react';

export const ProfileContext = createContext(null);

const STORAGE_KEY = 'brushbuddy_profile_v4';

const DEFAULT_PROFILE = {
  name: 'Smile Hero',
  avatar_emoji: '🦷',
  stars: 0,
  streak: 0,
  longest_streak: 0,
  total_brushes: 0,
  last_brushed_date: null,
  brushed_dates: [], // ['2026-11-20', '2026-11-21', ...]
  games_played: [],  // ['ToothDash', 'SugarBugQuiz', ...]
  quiz_high_score: 0,
};

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function computeStreaks(datesArray) {
  if (!datesArray || datesArray.length === 0) {
    return { current: 0, longest: 0 };
  }
  const uniqueSorted = [...new Set(datesArray)].sort();

  // Longest streak across all recorded dates
  let longest = 1;
  let run = 1;
  for (let i = 1; i < uniqueSorted.length; i++) {
    const prev = new Date(uniqueSorted[i - 1] + 'T00:00:00');
    const curr = new Date(uniqueSorted[i] + 'T00:00:00');
    const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      run += 1;
      if (run > longest) longest = run;
    } else if (diffDays > 1) {
      run = 1;
    }
  }

  // Current active streak (must include today or yesterday)
  const today = getTodayStr();
  const yesterday = getYesterdayStr();
  const lastDate = uniqueSorted[uniqueSorted.length - 1];
  if (lastDate !== today && lastDate !== yesterday) {
    return { current: 0, longest };
  }

  let current = 1;
  for (let i = uniqueSorted.length - 1; i > 0; i--) {
    const prev = new Date(uniqueSorted[i - 1] + 'T00:00:00');
    const curr = new Date(uniqueSorted[i] + 'T00:00:00');
    const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      current += 1;
    } else {
      break;
    }
  }

  return { current, longest: Math.max(longest, current) };
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const streaks = computeStreaks(parsed.brushed_dates || []);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          streak: streaks.current,
          longest_streak: Math.max(parsed.longest_streak || 0, streaks.longest),
        };
      }
    } catch (err) {
      console.error('Failed to read BrushBuddy profile:', err);
    }
    return DEFAULT_PROFILE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to save BrushBuddy profile:', err);
    }
  }, [profile]);

  const addStars = (amount = 10) => {
    setProfile((prev) => ({
      ...prev,
      stars: (prev.stars || 0) + amount,
    }));
  };

  const recordBrushSession = (starsReward = 25) => {
    const today = getTodayStr();
    setProfile((prev) => {
      const updatedDates = prev.brushed_dates.includes(today)
        ? prev.brushed_dates
        : [...prev.brushed_dates, today];
      const streaks = computeStreaks(updatedDates);
      return {
        ...prev,
        stars: (prev.stars || 0) + starsReward,
        total_brushes: (prev.total_brushes || 0) + 1,
        last_brushed_date: today,
        brushed_dates: updatedDates,
        streak: streaks.current,
        longest_streak: Math.max(prev.longest_streak || 0, streaks.longest),
      };
    });
  };

  const recordGameComplete = (gameKey, starsReward = 15, extra = {}) => {
    setProfile((prev) => {
      const updatedGames = prev.games_played.includes(gameKey)
        ? prev.games_played
        : [...prev.games_played, gameKey];
      const nextQuizBest =
        typeof extra.quizScore === 'number'
          ? Math.max(prev.quiz_high_score || 0, extra.quizScore)
          : prev.quiz_high_score || 0;

      return {
        ...prev,
        stars: (prev.stars || 0) + starsReward,
        games_played: updatedGames,
        quiz_high_score: nextQuizBest,
      };
    });
  };

  const resetProgress = () => {
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        addStars,
        recordBrushSession,
        recordGameComplete,
        resetProgress,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}