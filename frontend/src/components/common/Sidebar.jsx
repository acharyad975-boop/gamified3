import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  BrainCircuit, 
  Code2, 
  BarChart3, 
  Trophy, 
  BookMarked,
  ShieldCheck,
  Users,
  GraduationCap,
  ClipboardList,
  FileSpreadsheet,
  Sparkles,
  Settings,
  HelpCircle,
  Activity,
  ShieldAlert,
  Target,
  Layers,
  Gamepad2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  // Role-specific navigation definitions matching RBAC requirements
  const getNavItems = () => {
    if (role === 'ADMIN') {
      return [
        { to: '/admin/dashboard', label: 'Admin Dashboard', icon: ShieldCheck, badge: 'Admin' },
        { to: '/games', label: 'Code Logic Games', icon: Gamepad2, badge: '🎮 LAB' },
        { to: '/admin/dashboard', label: 'User Management', icon: Users },
        { to: '/teacher', label: 'Faculty Hub', icon: GraduationCap },
        { to: '/curriculum', label: 'Curriculum Governance', icon: BookMarked },
        { to: '/coding', label: 'Coding Challenges', icon: Code2 },
        { to: '/analytics', label: 'Platform Analytics', icon: BarChart3 },
        { to: '/admin/dashboard', label: 'Master Data Export', icon: FileSpreadsheet },
      ];
    }

    if (role === 'TEACHER') {
      return [
        { to: '/teacher', label: 'Teacher Dashboard', icon: LayoutDashboard, badge: 'Faculty' },
        { to: '/games', label: 'Code Logic Games', icon: Gamepad2, badge: '🎮 LAB' },
        { to: '/teacher', label: 'Students Roster', icon: Users },
        { to: '/teacher', label: 'My Classes', icon: GraduationCap },
        { to: '/curriculum', label: 'Curriculum Syllabus', icon: BookMarked },
        { to: '/teacher', label: 'Assignments', icon: ClipboardList },
        { to: '/coding', label: 'Coding Workspace', icon: Code2 },
        { to: '/analytics', label: 'Cohort Analytics', icon: BarChart3 },
        { to: '/teacher', label: 'Download Student Data', icon: FileSpreadsheet },
      ];
    }

    // Default STUDENT navigation
    return [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/games', label: 'Code Logic Games', icon: Gamepad2, badge: '🎮 LAB' },
      { to: '/curriculum', label: 'My Learning Syllabus', icon: BookMarked },
      { to: '/assessment', label: '7-Day Assessment', icon: Compass, badge: 'Diagnostic' },
      { to: '/ai-profile', label: 'AI Learning Profile', icon: BrainCircuit },
      { to: '/coding', label: 'Coding Workspace', icon: Code2 },
      { to: '/roadmap', label: 'Adaptive Roadmap', icon: Layers },
      { to: '/practice', label: 'Practice Lab', icon: Target, badge: 'Recover' },
      { to: '/analytics', label: 'My Progress', icon: BarChart3 },
      { to: '/leaderboard', label: 'Achievements Arena', icon: Trophy },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'rgba(17, 24, 39, 0.65)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      gap: '8px'
    }}>
      <div style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)',
        padding: '0.5rem 0.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>{role} Navigation</span>
        <span style={{
          fontSize: '0.65rem',
          fontWeight: 800,
          padding: '2px 6px',
          borderRadius: '4px',
          backgroundColor: role === 'ADMIN' ? 'rgba(239, 68, 68, 0.2)' : role === 'TEACHER' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
          color: role === 'ADMIN' ? '#f87171' : role === 'TEACHER' ? '#34d399' : '#60a5fa'
        }}>
          {role}
        </span>
      </div>

      {navItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={idx}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent',
              textDecoration: 'none',
              fontWeight: isActive ? 600 : 500,
              fontSize: '0.9rem',
              transition: 'all 0.15s ease',
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span style={{
                background: role === 'ADMIN' ? 'linear-gradient(135deg, #dc2626, #ef4444)' : role === 'TEACHER' ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '999px',
                letterSpacing: '0.04em'
              }}>
                {item.badge}
              </span>
            )}
          </NavLink>
        );
      })}

      <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: role === 'ADMIN' ? '#f87171' : role === 'TEACHER' ? '#34d399' : 'var(--accent-cyan)', fontWeight: 700, marginBottom: '4px' }}>
            {role === 'ADMIN' ? 'Admin Portal' : role === 'TEACHER' ? 'Faculty Command' : 'Adaptive Engine'}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {role === 'ADMIN' ? 'Platform-wide security and governance.' : role === 'TEACHER' ? 'Managing authorized class cohorts.' : 'Personalized learning path active.'}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
