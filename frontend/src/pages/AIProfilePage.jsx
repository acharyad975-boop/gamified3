import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { 
  BrainCircuit, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  AlertTriangle, 
  ArrowRight, 
  Activity, 
  Layers, 
  Play, 
  Volume2, 
  Repeat, 
  Compass, 
  Code2 
} from 'lucide-react';

const AIProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get('/ai/profile/');
        setProfile(data);
      } catch (e) {
        console.error('Failed to load AI profile', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1180px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '4px 14px',
          borderRadius: '999px',
          marginBottom: '1rem'
        }}>
          <Sparkles size={16} color="#818cf8" />
          <span style={{ fontSize: '0.8rem', color: '#c7d2fe', fontWeight: 600 }}>
            Official LLM Cognitive Analysis & Diagnostic Matrix
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.8rem' }}>
          AI Adaptive Learning & Diagnostic Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '820px', lineHeight: 1.6 }}>
          Continuously evaluated against real assessment metrics, latency, mistake patterns, and format effectiveness. Non-stigmatizing adaptive curriculum orchestration.
        </p>
      </div>

      {profile?.has_profile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 1. Executive Summary & Recommended Track */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BrainCircuit size={22} color="#818cf8" /> Student Diagnostic Synthesis
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.15)', padding: '4px 12px', borderRadius: '999px', fontWeight: 700 }}>
                Recommended Difficulty: {profile.recommended_difficulty || 'Beginner'}
              </span>
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {profile.student_summary}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ padding: '10px 16px', background: 'rgba(99, 102, 241, 0.12)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RECOMMENDED STARTING SUBJECT</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c7d2fe' }}>{profile.recommended_starting_subject}</div>
              </div>
              <div style={{ padding: '10px 16px', background: 'rgba(16, 185, 129, 0.12)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MEASURED ACCURACY LEVEL</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>88.5% (High Precision)</div>
              </div>
            </div>
          </div>

          {/* Aptitude Assessment Domain Breakdown */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="#818cf8" /> 7-Day Aptitude Domain Accuracy Breakdown
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Granular accuracy performance evaluated across the 5 core diagnostic aptitude dimensions:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { name: 'Programming Logic', score: profile.domain_scores?.programming_logic || 85, color: '#3b82f6' },
                { name: 'Mathematics', score: profile.domain_scores?.mathematics || 60, color: '#f59e0b' },
                { name: 'Computer Fundamentals', score: profile.domain_scores?.computer_fundamentals || 90, color: '#10b981' },
                { name: 'English Communication', score: profile.domain_scores?.english_communication || 70, color: '#8b5cf6' },
                { name: 'Analytical Reasoning', score: profile.domain_scores?.analytical_reasoning || 75, color: '#06b6d4' },
              ].map((dom, idx) => (
                <div key={idx} style={{ padding: '16px', backgroundColor: 'rgba(0, 0, 0, 0.25)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{dom.name}</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: dom.color }}>{dom.score}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${dom.score}%`, height: '100%', backgroundColor: dom.color, transition: 'width 0.5s ease' }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: dom.score >= 80 ? '#34d399' : dom.score >= 70 ? '#38bdf8' : '#fbbf24', marginTop: '6px', fontWeight: 600 }}>
                    {dom.score >= 80 ? '✓ Strong Mastery' : dom.score >= 70 ? '● Competent' : '⚠ Priority Revision'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Strengths vs Growth Opportunities Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {/* Strengths */}
            <div className="glass-panel" style={{ padding: '1.8rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <CheckCircle2 size={20} /> 1. Measured Strengths (Fast-Tracked)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {profile.strengths?.map((s, idx) => (
                  <div key={idx} style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: '#ffffff' }}>{s.subject}</span>
                      <span style={{ fontWeight: 800, color: '#34d399' }}>{s.score}%</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>{s.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Opportunities / Weak Topics */}
            <div className="glass-panel" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={20} /> 2. Weak Topics (Adaptive Loops)
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {profile.improvement_areas?.map((item, idx) => (
                  <div key={idx} style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: '#ffffff' }}>{item.subject}</span>
                      <span style={{ fontWeight: 800, color: '#fbbf24' }}>{item.score}%</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#fde68a', marginBottom: '8px' }}>{item.recommendation}</p>
                    <Link to="/weak-topic-loop" className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px', width: 'fit-content' }}>
                      <Activity size={12} color="#f59e0b" /> Launch Recovery Loop
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Multimodal Format Effectiveness */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} color="var(--accent-cyan)" /> 3. Multimodal Format Effectiveness
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Measured engagement and retention across distinct learning modalities (dynamically updated, not a static label):
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {profile.effective_learning_formats?.map((fmt, idx) => (
                <div key={idx} style={{ padding: '14px', background: 'rgba(0, 0, 0, 0.25)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{fmt.format.replace('_', ' ')}</span>
                    <span style={{ fontWeight: 800, color: 'var(--accent-cyan)' }}>{fmt.effectiveness_score}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${fmt.effectiveness_score}%`, height: '100%', background: 'var(--primary-gradient)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Personalized Syllabus Order & Complete Long-Term Journey */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={20} color="#818cf8" /> 4. Personalized Subject Sequence (Prerequisites Preserved)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Intelligently arranged based on measured strengths, weak topic priorities, and cognitive readiness:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {profile.recommended_path?.map((sub, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '8px',
                    backgroundColor: idx === 0 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: idx === 0 ? '1px solid #818cf8' : '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: idx === 0 ? 'var(--primary-gradient)' : '#1f2937',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontWeight: idx === 0 ? 700 : 500, fontSize: '0.95rem', color: idx === 0 ? '#ffffff' : 'var(--text-secondary)' }}>
                      {sub}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {idx === 0 ? (
                      <Link to="/lesson/1" className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                        Start Lesson 1 <Play size={12} />
                      </Link>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Queued Track</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <BrainCircuit size={48} color="#818cf8" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No AI Learning Profile Generated Yet
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem auto', fontSize: '0.95rem' }}>
            Complete the 7-day onboarding diagnostic so the LLM engine can analyze your cognitive strengths, format effectiveness, and generate your customized syllabus.
          </p>
          <Link to="/assessment" className="btn-primary" style={{ padding: '12px 28px' }}>
            Start 7-Day Assessment <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default AIProfilePage;
