import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  dateEarned?: string;
};

type GamificationContextType = {
  badges: Badge[];
  points: number;
  level: number;
  unlockBadge: (badgeId: string) => void;
  addPoints: (amount: number) => void;
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const initialBadges: Badge[] = [
  {
    id: 'perfect-attendance',
    name: 'Perfect Attendance',
    description: 'Achieved for 30 consecutive days of attendance',
    icon: 'calendar-check',
    earned: false
  },
  {
    id: 'homework-champion',
    name: 'Homework Champion',
    description: 'Completed 50 homework assignments on time',
    icon: 'book-check',
    earned: false
  },
  {
    id: 'top-performer',
    name: 'Top Performer',
    description: 'Ranked in top 5% of class',
    icon: 'trophy',
    earned: false
  }
];

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>(initialBadges);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    // Load saved progress from localStorage
    const savedData = localStorage.getItem(`gamification-${user?.id}`);
    if (savedData) {
      const { badges: savedBadges, points: savedPoints, level: savedLevel } = JSON.parse(savedData);
      setBadges(savedBadges);
      setPoints(savedPoints);
      setLevel(savedLevel);
    }
  }, [user]);

  const unlockBadge = (badgeId: string) => {
    setBadges(prev => prev.map(badge => 
      badge.id === badgeId ? { ...badge, earned: true, dateEarned: new Date().toISOString() } : badge
    ));
  };

  const addPoints = (amount: number) => {
    setPoints(prev => {
      const newPoints = prev + amount;
      // Level up every 100 points
      setLevel(Math.floor(newPoints / 100) + 1);
      return newPoints;
    });
  };

  useEffect(() => {
    // Save progress to localStorage
    if (user) {
      localStorage.setItem(`gamification-${user.id}`, JSON.stringify({
        badges,
        points,
        level
      }));
    }
  }, [badges, points, level, user]);

  return (
    <GamificationContext.Provider value={{ badges, points, level, unlockBadge, addPoints }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) throw new Error('useGamification must be used within a GamificationProvider');
  return context;
};