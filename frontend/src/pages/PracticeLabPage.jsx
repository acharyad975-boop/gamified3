import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import { getWeakTopics, getMasteredCount, getTopicLesson } from '../data/weakTopics';
import { loadAssessmentProgress } from '../data/assessmentBank';
import {
  RefreshCw,
  Zap,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Clock,
  Code2,
  BrainCircuit,
  Play,
  Compass,
} from 'lucide-react';

const PracticeLabPage = () => {
  const { awardXP } = useGamification();
  const [tick, setTick] = useState(0);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [drillChoice, setDrillChoice] = useState('');
  const [drillResult, setDrillResult] = useState(null);

  const weakTopics = useMemo(() => getWeakTopics(), [tick]);
  const mastered = getMasteredCount();
  const top = weakTopics[0];
  const lesson = top ? getTopicLesson(top.id) : null;
  const progress = loadAssessmentProgress();

  const missions = top
    ? [
        { id: 'recover', title: `Recover: ${top.title}`, detail: 'Open the recovery loop for your weakest diagnostic topic.', xp: 100, minutes: 8, href: top.recoveryPath },
        { id: 'drill', title: 'Re-answer the missed idea', detail: lesson?.prompt || 'Do the quick drill on the right.', xp: 40, minutes: 5 },
        { id: 'code', title: 'Write it in code', detail: 'After recovery, try the same idea in the coding workspace.', xp: 60, minutes: 10, href: '/coding' },
      ]
    : [
        { id: 'assess', title: 'Complete more diagnostic days', detail: 'Missed answers here become recovery topics.', xp: 100, minutes: 8, href: `/assessment/day/${progress.currentDay || 1}` },
      ];

  const finishMission = (mission) => {
    if (completedMissions.includes(mission.id)) return;
    setCompletedMissions((prev) => [...prev, mission.id]);
    awardXP(mission.xp, mission.title);
  };

  const submitDrill = () => {
    if (!drillChoice || !lesson) return;
    const correct = String(drillChoice).replace(/^[A-D][.)]\s*/, '').trim()
      === String(lesson.quizAnswer).replace(/^[A-D][.)]\s*/, '').trim();
    setDrillResult(correct);
    if (correct) awardXP(25, `Drill: ${top.title}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div className="glass-panel" style={{
        padding: '2.25rem',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(99, 102, 241, 0.08))',
        border: '1px solid rgba(245, 158, 11, 0.25)',
      }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
          Adaptive practice
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Practice Lab</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.6 }}>
          Topics here come from answers you missed in the 7-day assessment. Recover one, then code it.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>OPEN GAPS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171' }}>{weakTopics.length}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>RECOVERED</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>{mastered}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>WEAKEST</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fbbf24' }}>{top ? `${top.accuracy}%` : '—'}</div>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="#f59e0b" /> Flagged from your diagnostic
        </h2>
        {weakTopics.length === 0 ? (
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              No open gaps yet. Miss a question in the 7-day assessment and it will show up here.
            </p>
            <Link to="/assessment" className="btn-primary"><Compass size={16} /> Open 7-day assessment</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {weakTopics.map((topic) => (
              <div key={topic.id} className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{topic.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{topic.missedNote}</div>
                  <div style={{ marginTop: '10px', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden', maxWidth: '280px' }}>
                    <div style={{ width: `${topic.accuracy}%`, height: '100%', background: topic.accuracy < 50 ? '#ef4444' : '#f59e0b' }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '6px', fontWeight: 700 }}>
                    {topic.accuracy}% · {topic.missed} miss{topic.missed === 1 ? '' : 'es'} / {topic.attempted} attempts
                  </div>
                </div>
                <Link to={topic.recoveryPath} className="btn-primary" style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
                  <RefreshCw size={16} /> Start recovery <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#818cf8" /> Today’s missions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {missions.map((mission) => {
              const done = completedMissions.includes(mission.id);
              return (
                <div key={mission.id} className="glass-panel" style={{ padding: '1.2rem 1.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{mission.title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{mission.detail}</div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> {mission.minutes} min</span>
                        <span style={{ color: '#fbbf24' }}>+{mission.xp} XP</span>
                      </div>
                    </div>
                    {mission.href ? (
                      <Link to={mission.href} className="btn-primary" style={{ padding: '8px 12px' }} onClick={() => finishMission(mission)}>
                        Open
                      </Link>
                    ) : (
                      <button type="button" onClick={() => finishMission(mission)} disabled={done} className={done ? 'btn-secondary' : 'btn-primary'} style={{ padding: '8px 12px' }}>
                        {done ? <><CheckCircle2 size={16} /> Done</> : <><Play size={16} /> Mark done</>}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BrainCircuit size={18} color="#06b6d4" /> Quick drill
          </h2>
          <div className="glass-panel" style={{ padding: '1.4rem' }}>
            {lesson ? (
              <>
                <p style={{ fontWeight: 700, marginBottom: '1rem' }}>{lesson.prompt}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
                  {lesson.quizOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => { setDrillChoice(option); setDrillResult(null); }}
                      style={{
                        textAlign: 'left',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: '#fff',
                        background: drillChoice === option ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.04)',
                        border: drillChoice === option ? '1px solid #818cf8' : '1px solid var(--border-color)',
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <button type="button" className="btn-primary" onClick={submitDrill} style={{ width: '100%', justifyContent: 'center' }}>
                  Check answer
                </button>
                {drillResult === true && <p style={{ color: '#34d399', marginTop: '12px', fontWeight: 700 }}>{lesson.explanation}</p>}
                {drillResult === false && <p style={{ color: '#f87171', marginTop: '12px', fontWeight: 700 }}>Not yet. Start the recovery loop.</p>}
              </>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Drills appear after you miss at least one diagnostic question.</p>
            )}
          </div>
          <div className="glass-panel" style={{ padding: '1.4rem', marginTop: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 size={16} color="#10b981" /> Then code it
            </h3>
            <Link to="/coding" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setTick((n) => n + 1)}>
              Open coding workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeLabPage;
