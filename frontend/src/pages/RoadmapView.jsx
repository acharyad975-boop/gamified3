import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  RotateCw, 
  Lock, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Play, 
  Code2, 
  Layers, 
  BookOpen,
  Calendar,
  Zap
} from 'lucide-react';

const ROADMAP_NODES = [
  {
    id: 'fundamentals',
    title: 'Computer Fundamentals',
    status: 'COMPLETED',
    score: '90%',
    lessonsCount: 4,
    link: '/curriculum',
    description: 'Binary logic, memory hierarchy, and CPU cache architectures.'
  },
  {
    id: 'python_basics',
    title: 'Python Basics & Variables',
    status: 'COMPLETED',
    score: '88%',
    lessonsCount: 5,
    link: '/lesson/python-variables-memory',
    description: 'Dynamic RAM allocation, variable identifiers, and data types.'
  },
  {
    id: 'python_loops',
    title: 'Python Loops & Control Flow',
    status: 'CURRENT',
    score: '45% (Needs Revision)',
    lessonsCount: 6,
    link: '/lesson/python-for-loops',
    description: 'For loops, range() iterators, while loops, and break/continue mechanics.',
    warning: '⚠ Prioritize this topic: Current accuracy is 45%. Complete Weak Topic Loop before advancing.'
  },
  {
    id: 'functions',
    title: 'Functions & Call Stack',
    status: 'LOCKED',
    score: '0%',
    lessonsCount: 5,
    link: '/lesson/python-functions-params',
    description: 'Stack frame push/pop, parameter scopes, and return resolution.',
    prereq: 'Requires passing Python Loops (>= 75% accuracy)'
  },
  {
    id: 'data_structures',
    title: 'Data Structures & Algorithms',
    status: 'LOCKED',
    score: '0%',
    lessonsCount: 8,
    link: '/lesson/ds-stacks',
    description: 'Stacks, Queues, Binary Search, and Bubble Sort animations.',
    prereq: 'Requires completing Functions & Call Stack'
  }
];

const RoadmapView = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="xp-badge">AI ADAPTIVE DEPENDENCY GRAPH</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
            PREREQUISITE-GOVERNED LEARNING TRACK
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.6rem' }}>
          Interactive Learning Roadmap
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '780px' }}>
          Your personalized curriculum map adapted to cognitive test results and real-time accuracy. Topics unlock as your measured comprehension reaches mastery threshold.
        </p>
      </div>

      {/* Spaced Repetition Smart Revision Notification Card */}
      <div className="glass-panel" style={{ padding: '1.8rem', backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RotateCw size={22} color="#fbbf24" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase' }}>
                📌 SPACED REPETITION REVISION RECOMMENDED
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                Python Loops & Range Bounds
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#fef08a' }}>
                You struggled with off-by-one loop boundary logic 10 days ago. Estimated revision time: <b>15 minutes</b>.
              </p>
            </div>
          </div>

          <Link to="/weak-topic-loop" className="btn-primary" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderColor: '#fbbf24' }}>
            <Zap size={16} /> Start 15-Min Recovery Loop
          </Link>
        </div>
      </div>

      {/* AI Daily Study Planner */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <Calendar size={20} color="#818cf8" /> Today's AI Personalized Study Schedule (60 Min Total)
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div style={{ padding: '14px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700 }}>STEP 1 • 20 MINS</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: '4px 0' }}>📚 Python Loops Study</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Review for loop iterator mechanics</div>
          </div>

          <div style={{ padding: '14px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 700 }}>STEP 2 • 10 MINS</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: '4px 0' }}>🎬 Interactive Animation</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Step through counter increment sim</div>
          </div>

          <div style={{ padding: '14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>STEP 3 • 20 MINS</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: '4px 0' }}>💻 Coding Practice</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Solve Accumulator Challenge</div>
          </div>

          <div style={{ padding: '14px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700 }}>STEP 4 • 10 MINS</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: '4px 0' }}>📝 Diagnostic Quiz</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Validate mastery score (&gt;=75%)</div>
          </div>
        </div>
      </div>

      {/* Visual Roadmap Sequence */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.8rem' }}>
          Visual Dependency Pathway
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {ROADMAP_NODES.map((node, idx) => {
            const isCompleted = node.status === 'COMPLETED';
            const isCurrent = node.status === 'CURRENT';
            const isLocked = node.status === 'LOCKED';

            return (
              <div key={node.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: isCurrent ? 'rgba(99, 102, 241, 0.12)' : isCompleted ? 'rgba(16, 185, 129, 0.06)' : 'rgba(0, 0, 0, 0.25)',
                  border: isCurrent ? '1px solid #818cf8' : isCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.2)' : isCurrent ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isCompleted && <CheckCircle2 size={24} color="#34d399" />}
                      {isCurrent && <RotateCw size={24} color="#818cf8" />}
                      {isLocked && <Lock size={22} color="var(--text-muted)" />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: isLocked ? 'var(--text-muted)' : '#ffffff' }}>
                          {node.title}
                        </h3>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.15)' : isCurrent ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          color: isCompleted ? '#34d399' : isCurrent ? '#c7d2fe' : 'var(--text-muted)'
                        }}>
                          {node.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: isLocked ? 'var(--text-muted)' : 'var(--text-secondary)', marginTop: '2px' }}>
                        {node.description}
                      </p>
                      {node.warning && (
                        <div style={{ fontSize: '0.8rem', color: '#fbbf24', marginTop: '4px', fontWeight: 600 }}>
                          {node.warning}
                        </div>
                      )}
                      {node.prereq && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          🔒 {node.prereq}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACCURACY</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isCompleted ? '#34d399' : isCurrent ? '#fbbf24' : 'var(--text-muted)' }}>
                        {node.score}
                      </div>
                    </div>

                    {!isLocked ? (
                      <Link to={node.link} className={isCurrent ? 'btn-primary' : 'btn-secondary'} style={{ fontSize: '0.85rem' }}>
                        {isCurrent ? 'Continue Topic' : 'Review'} <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <button disabled className="btn-secondary" style={{ opacity: 0.5, cursor: 'not-allowed', fontSize: '0.85rem' }}>
                        Locked
                      </button>
                    )}
                  </div>
                </div>

                {/* Arrow connector between steps */}
                {idx < ROADMAP_NODES.length - 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-muted)', margin: '-4px 0' }}>
                    ↓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;
