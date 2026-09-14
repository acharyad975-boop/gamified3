import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  Flame, 
  Award, 
  LogOut, 
  User as UserIcon,
  BookOpen,
  Gamepad2
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.85rem 2rem',
      backgroundColor: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--glow-primary)'
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Gamified <span style={{ color: '#818cf8' }}>Environmental Education</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '0.05em' }}>
              AI GAMIFIED ACADEMY
            </span>
          </div>
        </Link>

        <Link 
          to="/games" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.25))',
            border: '1px solid rgba(99, 102, 241, 0.5)',
            color: '#c7d2fe',
            fontWeight: 700,
            fontSize: '0.85rem',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
        >
          <Gamepad2 size={16} color="#818cf8" />
          <span>🎮 Code Logic Lab</span>
        </Link>
      </div>

      {/* User Status Bar */}
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Streak */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)'
          }}>
            <Flame size={18} color="#f59e0b" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>
              {user.current_streak || 1} Day Streak
            </span>
          </div>

          {/* XP & Level */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)'
          }}>
            <Award size={18} color="#818cf8" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c7d2fe' }}>
              Level {user.current_level || 1}
            </span>
            <span style={{
              background: 'var(--primary-gradient)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              {user.total_xp || 0} XP
            </span>
          </div>

          {/* Profile & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#1e293b',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserIcon size={18} color="#94a3b8" />
              </div>
              <div>
                <span>{user.full_name || user.username}</span>
                <span style={{
                  display: 'block',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  color: user.role === 'ADMIN' ? '#f87171' : user.role === 'TEACHER' ? '#34d399' : '#60a5fa'
                }}>
                  {user.role || 'STUDENT'}
                </span>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              title="Logout"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '6px',
                borderRadius: '6px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/login" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Sign In
          </Link>
          <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            Get Started Free
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
