import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Trophy, ArrowLeft, Award, Flame, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const GameLeaderboardPage = () => {
  const [rankings, setRankings] = useState([]);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await api.get('/games/leaderboard/');
        setRankings(data.rankings || []);
      } catch (e) {
        console.error('Failed to load leaderboard', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div className="glass-panel" style={{
        padding: '2rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/games" className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Games Hub
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={24} color="#fbbf24" />
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                Code Logic Games Leaderboard
              </h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Weekly and all-time student rankings in logic problem solving & accuracy.
            </p>
          </div>
        </div>

        {/* Private Progress Mode Toggle */}
        <button
          onClick={() => setIsPrivateMode(!isPrivateMode)}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {isPrivateMode ? <EyeOff size={14} color="#f87171" /> : <Eye size={14} color="#34d399" />}
          {isPrivateMode ? 'Private Mode: ON' : 'Private Mode: OFF'}
        </button>
      </div>

      {/* Rankings Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Rank</th>
              <th style={{ padding: '12px 16px' }}>Student</th>
              <th style={{ padding: '12px 16px' }}>Game XP</th>
              <th style={{ padding: '12px 16px' }}>Levels Solved</th>
              <th style={{ padding: '12px 16px' }}>Accuracy</th>
              <th style={{ padding: '12px 16px' }}>Streak</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((item) => {
              const isTop3 = item.rank <= 3;
              const medal = item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`;

              return (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    backgroundColor: isTop3 ? 'rgba(99, 102, 241, 0.06)' : 'transparent',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 800, fontSize: isTop3 ? '1.2rem' : '0.9rem', color: isTop3 ? '#fbbf24' : 'var(--text-secondary)' }}>
                    {medal}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                      {isPrivateMode ? `Student #${item.id}` : item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Level {item.level} Scholar
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: '#fbbf24' }}>
                    {item.game_xp || 0} XP
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#c7d2fe' }}>
                    {item.levels_completed || 0}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#34d399' }}>
                    {item.average_accuracy || 100}%
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#f87171' }}>
                    🔥 {item.streak || 1}d
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameLeaderboardPage;
