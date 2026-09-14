import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import {
  ASSESSMENT_DAYS,
  ASSESSMENT_BANK,
  loadAssessmentProgress,
} from '../data/assessmentBank';
import {
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

const AssessmentDashboard = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const local = loadAssessmentProgress();
    setCurrentDay(local.currentDay || 1);
    setCompletedDays(local.completedDays || {});
    setIsCompleted(!!local.isCompleted);

    api.get('/assessments/session/').then((data) => {
      if (!data) return;
      const apiDay = data.current_day || 1;
      setCurrentDay((prev) => Math.max(prev, apiDay));
      if (data.is_completed) setIsCompleted(true);
    }).catch(() => {});
  }, []);

  const doneCount = Object.keys(completedDays).length;
  const progressPct = Math.round((doneCount / 7) * 100);
  const active = ASSESSMENT_DAYS.find((d) => d.day === currentDay) || ASSESSMENT_DAYS[0];
  const questionCount = (ASSESSMENT_BANK[currentDay] || []).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '920px' }}>
      <div className="glass-panel" style={{
        padding: '2rem 2.25rem',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(99, 102, 241, 0.1))',
        border: '1px solid rgba(6, 182, 212, 0.22)',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(6, 182, 212, 0.15)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          padding: '4px 12px',
          borderRadius: '999px',
          marginBottom: '1rem',
        }}>
          <Compass size={15} color="#06b6d4" />
          <span style={{ fontSize: '0.78rem', color: '#67e8f9', fontWeight: 700 }}>7-day diagnostic</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
          Map how you think in CS
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: '640px' }}>
          One short set per day. We use accuracy and pace to unlock your syllabus, AI profile, and practice recovery — not a final exam grade.
        </p>

        <div style={{ marginTop: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span>{doneCount} of 7 days complete</span>
            <span>{progressPct}%</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #818cf8)', transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {ASSESSMENT_DAYS.map((item) => {
          const done = !!completedDays[item.day];
          const current = item.day === currentDay && !isCompleted;
          return (
            <div
              key={item.day}
              style={{
                minWidth: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85rem',
                background: done ? 'rgba(16, 185, 129, 0.25)' : current ? item.color : 'rgba(255,255,255,0.06)',
                color: done || current ? '#fff' : 'var(--text-muted)',
                border: current ? `2px solid ${item.color}` : '1px solid var(--border-color)',
                boxShadow: current ? `0 0 16px ${item.color}55` : 'none',
              }}
            >
              {done ? '✓' : item.day}
            </div>
          );
        })}
      </div>

      {!isCompleted && (
        <div className="glass-panel" style={{ padding: '1.75rem 2rem', border: `1px solid ${active.color}55` }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', color: active.color, textTransform: 'uppercase', marginBottom: '6px' }}>
            Today · Day {active.day}
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '6px' }}>{active.title}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.1rem' }}>{active.subtitle}</p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> ~{active.minutes} min</span>
            <span>{questionCount} questions</span>
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>+100 XP</span>
          </div>
          <Link to={`/assessment/day/${active.day}`} className="btn-primary" style={{ padding: '12px 22px' }}>
            {completedDays[active.day] ? 'Retake day' : `Start day ${active.day}`} <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {isCompleted && (
        <div className="glass-panel" style={{ padding: '1.75rem 2rem', textAlign: 'center' }}>
          <Sparkles size={28} color="#818cf8" style={{ marginBottom: '8px' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '8px' }}>Diagnostic complete</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
            Your answers are ready for the AI learning profile and practice lab.
          </p>
          <Link to="/ai-profile" className="btn-primary">Open AI profile</Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {ASSESSMENT_DAYS.map((item) => {
          const done = !!completedDays[item.day];
          const current = item.day === currentDay && !isCompleted;
          const locked = item.day > currentDay;
          const count = (ASSESSMENT_BANK[item.day] || []).length;
          const result = completedDays[item.day];

          return (
            <div
              key={item.day}
              className="glass-panel"
              style={{
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                opacity: locked ? 0.55 : 1,
                borderColor: current ? `${item.color}66` : undefined,
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                flexShrink: 0,
                background: `${item.color}22`,
                color: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}>
                {done ? <CheckCircle2 size={20} color="#34d399" /> : locked ? <Lock size={16} /> : item.day}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700 }}>{item.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {item.subtitle} · {count} questions
                  {result?.percent != null ? ` · ${result.percent}%` : ''}
                </div>
              </div>
              {locked ? (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>LOCKED</span>
              ) : (
                <Link
                  to={`/assessment/day/${item.day}`}
                  className={current ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  {done ? 'Review' : 'Open'}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentDashboard;
