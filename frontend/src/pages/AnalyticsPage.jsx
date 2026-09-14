import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, PieChart, Activity, Zap } from 'lucide-react';

const AnalyticsPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.8rem' }}>
          Adaptive Learning Analytics
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '780px' }}>
          Visualizing your subject mastery, content format outcomes, and XP acceleration trends over time.
        </p>
      </div>

      {/* Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Subject Mastery */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <Activity size={20} color="#06b6d4" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Subject Proficiency Breakdown</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'Python Programming', score: 92, color: '#3b82f6' },
              { name: 'Data Structures & Algorithms', score: 78, color: '#8b5cf6' },
              { name: 'Web Development (HTML/CSS/JS)', score: 85, color: '#06b6d4' },
              { name: 'SQL & Database Systems', score: 70, color: '#10b981' },
              { name: 'Mathematics & Logic', score: 65, color: '#f59e0b' },
            ].map((sub, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>{sub.name}</span>
                  <span style={{ fontWeight: 700, color: sub.color }}>{sub.score}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${sub.score}%`, height: '100%', backgroundColor: sub.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Format Outcomes */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <PieChart size={20} color="#a855f7" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Measured Format Effectiveness</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { format: 'Practical Coding Exercises', outcome: '94% Retention', score: 94 },
              { format: 'Interactive Visual Simulations', outcome: '88% Retention', score: 88 },
              { format: 'Visual Diagrams & Infographics', outcome: '82% Retention', score: 82 },
              { format: 'Text Explanations & References', outcome: '74% Retention', score: 74 },
              { format: 'Audio Guides & Explanations', outcome: '62% Retention', score: 62 },
            ].map((fmt, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>{fmt.format}</span>
                  <span style={{ fontWeight: 700, color: '#a855f7' }}>{fmt.outcome}</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${fmt.score}%`, height: '100%', background: 'linear-gradient(90deg, #a855f7, #ec4899)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
