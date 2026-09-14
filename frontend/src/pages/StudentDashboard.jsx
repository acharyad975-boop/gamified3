import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { loadAssessmentProgress } from '../data/assessmentBank';
import { getWeakTopics } from '../data/weakTopics';
import { 
  Sparkles, 
  Compass, 
  Flame, 
  Award, 
  BookOpen, 
  Code2, 
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Clock,
  Target,
  Gamepad2
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [learningPath, setLearningPath] = useState(null);
  const [aiProfile, setAiProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, pathRes, profileRes] = await Promise.all([
          api.get('/progress/dashboard/').catch(() => null),
          api.get('/ai/learning-path/').catch(() => null),
          api.get('/ai/profile/').catch(() => null),
        ]);
        setOverview(dashRes);
        setLearningPath(pathRes);
        setAiProfile(profileRes);
      } catch (e) {
        console.error('Failed to load dashboard overview', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const profile = overview?.profile || user || {};
  const weakTopics = getWeakTopics();
  const assess = loadAssessmentProgress();
  const nextAction = weakTopics.length
    ? { to: weakTopics[0].recoveryPath, label: `Recover ${weakTopics[0].title}`, hint: `${weakTopics.length} diagnostic gap${weakTopics.length === 1 ? '' : 's'} open in Practice Lab.` }
    : !assess.isCompleted
      ? { to: `/assessment/day/${assess.currentDay || 1}`, label: `Continue Day ${assess.currentDay || 1}`, hint: 'Finish the 7-day diagnostic so the engine knows what to recover.' }
      : { to: '/practice', label: 'Open Practice Lab', hint: 'Diagnostic complete. Keep skills warm with short drills.' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '2.5rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.08))',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Welcome back, Scholar
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            {user?.full_name || user?.username || 'Student'} 🚀
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px' }}>
            {nextAction.hint}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to={nextAction.to} className="btn-primary" style={{ padding: '12px 24px' }}>
            {weakTopics.length ? <Target size={18} /> : <Compass size={18} />} {nextAction.label}
          </Link>
        </div>
      </div>

      {/* Gamification Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={24} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL XP</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24' }}>
              {profile.total_xp || 0} XP
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={24} color="#818cf8" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>CURRENT LEVEL</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#c7d2fe' }}>
              Level {profile.current_level || 1}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Flame size={24} color="#ef4444" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE STREAK</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171' }}>
              {profile.current_streak || 1} Days
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Code2 size={24} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>CHALLENGES SOLVED</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>
              {profile.challenges_completed || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Active Learning Path Card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BrainCircuit size={22} color="#818cf8" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Personalized Learning Path</h2>
            </div>
            <Link to="/ai-profile" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>
              View AI Analysis →
            </Link>
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#ffffff' }}>
                Recommended Track: <span style={{ color: '#818cf8' }}>{learningPath?.title || aiProfile?.recommended_starting_subject || 'Python Programming'}</span>
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {learningPath?.progress_percentage ? `${Math.round(learningPath.progress_percentage)}%` : '0%'} Completed
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '999px',
              overflow: 'hidden'
            }}>
              <div style={{ width: `${learningPath?.progress_percentage || 15}%`, height: '100%', background: 'var(--primary-gradient)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {learningPath?.items && learningPath.items.length > 0 ? (
              learningPath.items.map((item, idx) => (
                <div key={item.id || idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: item.is_unlocked ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  border: item.is_unlocked ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: item.is_completed ? '#10b981' : item.is_unlocked ? 'var(--primary-gradient)' : '#1f2937',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {item.order || idx + 1}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: item.is_unlocked ? 600 : 400, color: item.is_unlocked ? '#ffffff' : 'var(--text-secondary)' }}>
                      {item.title}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: item.is_completed ? '#34d399' : item.is_unlocked ? 'var(--accent-cyan)' : 'var(--text-muted)'
                  }}>
                    {item.is_completed ? 'Completed' : item.is_unlocked ? 'Current Lesson' : 'Locked'}
                  </span>
                </div>
              ))
            ) : (
              [
                { step: 1, title: 'Day 1–7 Assessment & Cognitive Profile', status: 'In Progress', active: true },
                { step: 2, title: 'Python Syntax & Algorithmic Control Flow', status: 'Locked', active: false },
                { step: 3, title: 'Data Structures & Problem Solving', status: 'Locked', active: false },
                { step: 4, title: 'Web Development & REST Architecture', status: 'Locked', active: false },
              ].map((item) => (
                <div key={item.step} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: item.active ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  border: item.active ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: item.active ? 'var(--primary-gradient)' : '#1f2937',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {item.step}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: item.active ? 600 : 400, color: item.active ? '#ffffff' : 'var(--text-secondary)' }}>
                      {item.title}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: item.active ? 'var(--accent-cyan)' : 'var(--text-muted)'
                  }}>
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action / Next Tasks Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.08))',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8' }}>
              <Gamepad2 size={20} color="#818cf8" />
              🎮 Code Logic Lab
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.2rem', lineHeight: 1.5 }}>
              Play interactive games to learn loops, conditionals, recursion & data structures.
            </p>
            <Link to="/games" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }}>
              Launch Games Hub <ArrowRight size={16} />
            </Link>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={18} color="#06b6d4" />
              Onboarding Checklist
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Complete the structured 7-day assessment to calibrate the adaptive engine.
            </p>
            <Link to="/assessment" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }}>
              Open Day Assessment <ArrowRight size={16} />
            </Link>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 size={18} color="#10b981" />
              Practice Lab
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Recover weak topics from your diagnostic and complete short daily drills.
            </p>
            <Link to="/practice" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }}>
              Open Practice Lab
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
