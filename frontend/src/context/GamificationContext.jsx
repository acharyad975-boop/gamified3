import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';

const GamificationContext = createContext(null);

export const GamificationProvider = ({ children }) => {
  const [recentXpEarned, setRecentXpEarned] = useState(null);

  const awardXP = (amount, reason) => {
    setRecentXpEarned({ amount, reason });
    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#f59e0b'],
      });
    } catch (e) {
      console.log('Confetti triggered', e);
    }
    setTimeout(() => {
      setRecentXpEarned(null);
    }, 3500);
  };

  return (
    <GamificationContext.Provider value={{ awardXP, recentXpEarned }}>
      {children}
      {recentXpEarned && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
          border: '1px solid #818cf8',
          borderRadius: '16px',
          padding: '16px 24px',
          boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999,
          animation: 'pulse-glow 1s infinite'
        }}>
          <span style={{ fontSize: '1.8rem' }}>⚡</span>
          <div>
            <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '1.1rem' }}>
              +{recentXpEarned.amount} XP Earned!
            </div>
            <div style={{ color: '#c7d2fe', fontSize: '0.85rem' }}>
              {recentXpEarned.reason}
            </div>
          </div>
        </div>
      )}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => useContext(GamificationContext);
