import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_ACCOUNTS, homePathForRole } from '../auth/roles';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck, GraduationCap, Users } from 'lucide-react';

const ROLE_TABS = [
  {
    id: 'STUDENT',
    label: 'Student',
    icon: GraduationCap,
    accent: 'var(--primary-gradient)',
    placeholder: 'student@example.com',
    fieldLabel: 'Student Email / Username',
  },
  {
    id: 'TEACHER',
    label: 'Teacher',
    icon: Users,
    accent: 'linear-gradient(135deg, #059669, #10b981)',
    placeholder: 'teacher@example.com',
    fieldLabel: 'Faculty Email / ID',
  },
  {
    id: 'ADMIN',
    label: 'Admin',
    icon: ShieldCheck,
    accent: 'linear-gradient(135deg, #dc2626, #ef4444)',
    placeholder: 'admin@example.com',
    fieldLabel: 'Admin Email / ID',
  },
];

const LoginPage = () => {
  const [roleTab, setRoleTab] = useState('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const activeTab = ROLE_TABS.find((tab) => tab.id === roleTab) || ROLE_TABS[0];

  const handleLoginSubmit = async (emailToUse, passToUse, roleToUse = roleTab) => {
    setError('');
    setLoading(true);
    try {
      const res = await login(emailToUse || email, passToUse || password, roleToUse);
      navigate(homePathForRole(res?.user?.role));
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginSubmit(email, password, roleTab);
  };

  const fillDemo = (account) => {
    setRoleTab(account.role);
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  return (
    <div style={{ maxWidth: '520px', margin: '2.5rem auto', padding: '0 1rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.4rem', textAlign: 'center' }}>
          Welcome to Gamified Environmental Education
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Sign in to the portal that matches your role: Admin, Teacher, or Student.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '6px',
          marginBottom: '1.5rem',
          background: '#090d16',
          padding: '4px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          {ROLE_TABS.map((tab) => {
            const Icon = tab.icon;
            const selected = roleTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setRoleTab(tab.id); setError(''); }}
                style={{
                  padding: '10px 6px',
                  borderRadius: '6px',
                  border: 'none',
                  background: selected ? tab.accent : 'transparent',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#f87171',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              {activeTab.fieldLabel}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab.placeholder}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <Mail size={18} color="#6b7280" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <Lock size={18} color="#6b7280" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px',
              marginTop: '0.5rem',
              background: activeTab.accent
            }}
          >
            {loading ? 'Authenticating...' : `Sign In as ${activeTab.label}`} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '1.4rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Demo accounts
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() => fillDemo(account)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  padding: '6px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {account.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
