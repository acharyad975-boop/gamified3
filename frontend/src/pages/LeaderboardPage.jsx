import React from 'react';
import { Trophy, Medal, Flame, Award, Zap } from 'lucide-react';

const TOP_SCHOLARS = [
  { rank: 1, name: 'Ada Lovelace', level: 12, xp: 52400, streak: 45, badge: 'Grandmaster' },
  { rank: 2, name: 'Alan Turing', level: 11, xp: 48900, streak: 38, badge: 'Algorithmic Pioneer' },
  { rank: 3, name: 'Grace Hopper', level: 10, xp: 43200, streak: 31, badge: 'Compiler Architect' },
  { rank: 4, name: 'Linus Torvalds', level: 9, xp: 37500, streak: 24, badge: 'Kernel Wizard' },
  { rank: 5, name: 'Margaret Hamilton', level: 9, xp: 35100, streak: 20, badge: 'Mission Critical' },
];

const LeaderboardPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.8rem' }}>
          Gamified Arena & Leaderboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '780px' }}>
          Compete globally, maintain your active daily streak, and climb the ranks by completing lessons and solving coding challenges.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Rank</th>
              <th style={{ padding: '12px 16px' }}>Student</th>
              <th style={{ padding: '12px 16px' }}>Level</th>
              <th style={{ padding: '12px 16px' }}>Streak</th>
              <th style={{ padding: '12px 16px' }}>Badge</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Total XP</th>
            </tr>
          </thead>
          <tbody>
            {TOP_SCHOLARS.map((scholar) => (
              <tr key={scholar.rank} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '0.9rem' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                  {scholar.rank === 1 ? '🥇 #1' : scholar.rank === 2 ? '🥈 #2' : scholar.rank === 3 ? '🥉 #3' : `#${scholar.rank}`}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: '#ffffff' }}>
                  {scholar.name}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="level-badge">Lvl {scholar.level}</span>
                </td>
                <td style={{ padding: '14px 16px', color: '#f87171', fontWeight: 600 }}>
                  🔥 {scholar.streak} Days
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
                  {scholar.badge}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#fbbf24' }}>
                  {scholar.xp.toLocaleString()} XP
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
