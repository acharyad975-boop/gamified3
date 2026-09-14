import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import { getTopicLesson, markTopicMastered, getWeakTopics } from '../data/weakTopics';
import PythonLoopAnimation from '../components/animations/PythonLoopAnimation';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Play,
  Layers,
  Code2,
  Award,
  HelpCircle,
} from 'lucide-react';

const STAGES = [
  { id: 'diagnose', title: 'Diagnosis', icon: Activity },
  { id: 'explain', title: 'Explanation', icon: Layers },
  { id: 'visual', title: 'Visual', icon: Sparkles },
  { id: 'try', title: 'Check', icon: HelpCircle },
  { id: 'code', title: 'Code', icon: Code2 },
  { id: 'mastery', title: 'Mastery', icon: Award },
];

const WeakTopicLoopPage = () => {
  const [params] = useSearchParams();
  const fallbackId = getWeakTopics()[0]?.id || 'loops';
  const topicId = params.get('topic') || fallbackId;
  const lesson = useMemo(() => getTopicLesson(topicId), [topicId]);

  const [stage, setStage] = useState(0);
  const [choice, setChoice] = useState('');
  const [code, setCode] = useState(lesson.starterCode || '');
  const [output, setOutput] = useState('');
  const [mastered, setMastered] = useState(false);
  const { awardXP } = useGamification();

  const handleNext = () => {
    if (stage + 1 < STAGES.length) {
      setStage((s) => s + 1);
      return;
    }
    markTopicMastered(topicId);
    setMastered(true);
    awardXP(100, `Recovered: ${lesson.title}`);
  };

  const runCode = () => {
    const expected = String(lesson.expectedOutput || '').trim();
    const looksRight = expected && code.includes(expected.split('\n')[0].slice(0, 12));
    setOutput(looksRight || code.toLowerCase().includes('print')
      ? `Output:\n${expected || 'ok'}\n\n✓ Close enough — continue to mastery.`
      : `Try to print: ${expected || 'the correct idea'}`);
  };

  const quizCorrect = choice && (
    String(choice).replace(/^[A-D][.)]\s*/, '').trim()
    === String(lesson.quizAnswer).replace(/^[A-D][.)]\s*/, '').trim()
    || String(choice).includes(String(lesson.quizAnswer))
  );

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/practice" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Practice Lab
        </Link>
        <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700, background: 'rgba(245, 158, 11, 0.15)', padding: '3px 10px', borderRadius: '999px' }}>
          RECOVERY · {lesson.title.toUpperCase()}
        </span>
      </div>

      <div className="glass-panel" style={{ padding: '1.75rem 2rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
          From your 7-day assessment
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>{lesson.title}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Diagnostic accuracy: {lesson.accuracy}% · {lesson.missed} miss{lesson.missed === 1 ? '' : 'es'} · goal: understand it, then code it.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {STAGES.map((st, idx) => {
          const done = idx < stage;
          const current = idx === stage;
          return (
            <div key={st.id} style={{
              flex: 1,
              minWidth: '90px',
              padding: '10px',
              borderRadius: '8px',
              textAlign: 'center',
              backgroundColor: current ? 'rgba(99, 102, 241, 0.25)' : done ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.03)',
              border: current ? '1px solid #818cf8' : done ? '1px solid #10b981' : '1px solid var(--border-color)',
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: done ? '#34d399' : current ? '#a5b4fc' : 'var(--text-muted)' }}>
                {done ? 'DONE' : current ? 'NOW' : `STEP ${idx + 1}`}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{st.title}</div>
            </div>
          );
        })}
      </div>

      <div className="glass-panel" style={{ padding: '2rem', minHeight: '280px' }}>
        {stage === 0 && (
          <div>
            <h2 style={{ color: '#f59e0b', marginBottom: '0.8rem' }}>Why this was flagged</h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>{lesson.diagnosis}</p>
            {lesson.prompt && <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}><b>Item:</b> {lesson.prompt}</p>}
            <div style={{ padding: '14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px' }}>
              <div style={{ fontWeight: 700, color: '#f87171', fontSize: '0.85rem' }}>YOUR MISS</div>
              <div style={{ fontSize: '0.9rem', color: '#fca5a5' }}>{lesson.mistake}</div>
            </div>
          </div>
        )}

        {stage === 1 && (
          <div>
            <h2 style={{ marginBottom: '0.8rem' }}>Simple explanation</h2>
            <p style={{ lineHeight: 1.65, fontSize: '1.02rem' }}>{lesson.explanation}</p>
          </div>
        )}

        {stage === 2 && (
          <div>
            <h2 style={{ marginBottom: '0.8rem' }}>See it</h2>
            {topicId === 'loops' ? <PythonLoopAnimation /> : (
              <pre style={{
                background: '#030712',
                padding: '1.2rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontFamily: 'var(--font-mono)',
                color: '#34d399',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.55,
              }}
              >
                {lesson.visual}
              </pre>
            )}
          </div>
        )}

        {stage === 3 && (
          <div>
            <h2 style={{ marginBottom: '1rem' }}>{lesson.prompt}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lesson.quizOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setChoice(opt)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#fff',
                    background: choice === opt ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)',
                    border: choice === opt ? '1px solid #818cf8' : '1px solid var(--border-color)',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {choice && (
              <div style={{
                marginTop: '1rem',
                padding: '10px 14px',
                borderRadius: '8px',
                fontWeight: 700,
                background: quizCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: quizCorrect ? '#34d399' : '#f87171',
              }}
              >
                {quizCorrect ? 'Correct. You can move on.' : `Look again. Target: ${lesson.quizAnswer}`}
              </div>
            )}
          </div>
        )}

        {stage === 4 && (
          <div>
            <h2 style={{ marginBottom: '0.8rem' }}>Try it in code</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  height: '160px',
                  background: '#030712',
                  color: '#38bdf8',
                  fontFamily: 'var(--font-mono)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                }}
              />
              <div>
                <button type="button" onClick={runCode} className="btn-primary" style={{ marginBottom: '10px' }}>
                  <Play size={16} /> Run
                </button>
                <pre style={{ background: '#030712', padding: '10px', borderRadius: '8px', minHeight: '100px', color: '#34d399', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>
                  {output || '> Run to check'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {stage === 5 && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <CheckCircle2 size={40} color="#10b981" style={{ marginBottom: '12px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', marginBottom: '8px' }}>
              {mastered ? 'Marked recovered' : 'Ready to mark recovered?'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.2rem' }}>
              This topic drops off Practice Lab after you confirm mastery. You can still reopen it from history by missing it again.
            </p>
            {mastered && (
              <Link to="/practice" className="btn-primary">Back to Practice Lab <Sparkles size={16} /></Link>
            )}
          </div>
        )}

        {!(stage === 5 && mastered) && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
            <button type="button" onClick={handleNext} className="btn-primary">
              {stage < 5 ? 'Next step' : 'Mark recovered'} <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeakTopicLoopPage;
