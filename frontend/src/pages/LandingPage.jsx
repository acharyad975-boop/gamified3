import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BrainCircuit, Code2, Award, ArrowRight, Zap, Target, Gamepad2 } from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', textAlign: 'center' }}>
      {/* Hero Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(99, 102, 241, 0.15)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        padding: '6px 16px',
        borderRadius: '999px',
        marginBottom: '2rem'
      }}>
        <Sparkles size={16} color="#818cf8" />
        <span style={{ color: '#c7d2fe', fontSize: '0.85rem', fontWeight: 600 }}>
          Next-Gen Gamified Environmental Education & Code Logic Lab
        </span>
      </div>

      {/* Main Title */}
      <h1 style={{
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        fontWeight: 900,
        lineHeight: 1.15,
        letterSpacing: '-0.03em',
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, #ffffff 30%, #a5b4fc 70%, #38bdf8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Master Environmental Education & Programming Logic Through Interactive Games
      </h1>

      <p style={{
        fontSize: '1.2rem',
        color: 'var(--text-secondary)',
        maxWidth: '780px',
        margin: '0 auto 2.5rem auto',
        lineHeight: 1.6
      }}>
        Play 12 visual coding games connecting visual logic to Python, JavaScript, and C++, or complete our intelligent 7-day multi-format assessment.
      </p>

      {/* Call to Action */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '4rem' }}>
        <Link to="/games" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <Gamepad2 size={20} /> Play Code Logic Games
        </Link>
        <Link to="/register" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
          Begin 7-Day Assessment <ArrowRight size={18} />
        </Link>
        <Link to="/login" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
          Sign In
        </Link>
      </div>

      {/* Feature Highlights Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        textAlign: 'left'
      }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.2rem'
          }}>
            <BrainCircuit size={26} color="#818cf8" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Multi-Format AI Diagnostics
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Measures format effectiveness across text, visual diagrams, animation, interactive code, and practical exercises without rigid labelling.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.2rem'
          }}>
            <Code2 size={26} color="#06b6d4" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Sandboxed Code Execution
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Run challenges with real-time test cases, AST syntax inspection, and algorithmic complexity estimations.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.2rem'
          }}>
            <Award size={26} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Gamified Growth Arena
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Earn deterministic XP rewards, maintain streaks, level up your profile, and unlock milestone badges as you master CS.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
