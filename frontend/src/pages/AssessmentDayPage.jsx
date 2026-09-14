import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import api from '../api/client';
import {
  ASSESSMENT_DAYS,
  getLocalQuestions,
  normalizeQuestion,
  gradeAnswer,
  saveAssessmentDayComplete,
  formatClock,
} from '../data/assessmentBank';
import { recordAssessmentAttempt, getWeakTopics } from '../data/weakTopics';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Award,
} from 'lucide-react';

const LETTERS = ['A', 'B', 'C', 'D'];

const AssessmentDayPage = () => {
  const { day } = useParams();
  const dayNum = Math.min(7, Math.max(1, parseInt(day, 10) || 1));
  const navigate = useNavigate();
  const { awardXP } = useGamification();
  const meta = ASSESSMENT_DAYS.find((d) => d.day === dayNum) || ASSESSMENT_DAYS[0];

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionSeconds, setQuestionSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dayFinished, setDayFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const scoreRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      setLoading(true);
      setCurrentIndex(0);
      setSelectedOption('');
      setSubmitted(false);
      setFeedback(null);
      setScore(0);
      scoreRef.current = 0;
      setTimeSpent(0);
      setQuestionSeconds(0);
      setDayFinished(false);

      const local = getLocalQuestions(dayNum);
      try {
        const data = await api.get(`/assessments/day/${dayNum}/`);
        const remote = (data.questions || []).map((q, i) => normalizeQuestion(q, i));
        if (!cancelled) setQuestions(remote.length ? remote : local);
      } catch {
        if (!cancelled) setQuestions(local);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    boot();
    return () => { cancelled = true; };
  }, [dayNum]);

  useEffect(() => {
    if (dayFinished || loading) return undefined;
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
      setQuestionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [dayFinished, loading]);

  const currentQ = questions[currentIndex];

  const handleSubmitAnswer = async () => {
    if (!selectedOption || submitted || submitting) return;
    setSubmitting(true);
    let result = gradeAnswer(currentQ, selectedOption);
    try {
      const res = await api.post('/assessments/submit-answer/', {
        question_id: currentQ.id,
        selected_answer: selectedOption,
        time_spent_seconds: questionSeconds,
      });
      if (res && typeof res.is_correct === 'boolean') {
        result = {
          is_correct: res.is_correct,
          correct_answer: String(res.correct_answer || result.correct_answer).replace(/^[A-D][.)]\s*/, ''),
          explanation: res.explanation || result.explanation,
          points_earned: res.points_earned ?? result.points_earned,
        };
      }
    } catch {
      /* local grade already set */
    }

    setFeedback(result);
    setSubmitted(true);
    setSubmitting(false);
    recordAssessmentAttempt({
      question: { ...currentQ, correct_answer: result.correct_answer, explanation: result.explanation },
      selected: selectedOption,
      isCorrect: result.is_correct,
      day: dayNum,
    });
    if (result.is_correct) {
      const pts = currentQ.points || 10;
      scoreRef.current += pts;
      setScore(scoreRef.current);
    }
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption('');
      setSubmitted(false);
      setFeedback(null);
      setQuestionSeconds(0);
      return;
    }

    const totalPossible = questions.reduce((sum, q) => sum + (q.points || 10), 0) || 1;
    const percent = Math.round((scoreRef.current / totalPossible) * 100);
    saveAssessmentDayComplete(dayNum, { percent, score: scoreRef.current, timeSpent });

    try {
      await api.post(`/assessments/complete-day/${dayNum}/`, {
        score_percentage: percent,
        total_time_seconds: timeSpent,
      });
    } catch {
      /* local progress still saved */
    }

    setDayFinished(true);
    awardXP(100, `Completed Day ${dayNum} assessment`);
  };

  const weakAfterDay = dayFinished ? getWeakTopics() : [];

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading day {dayNum}…
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Could not load this day.</h2>
        <Link to="/assessment" className="btn-secondary"><ArrowLeft size={16} /> Back</Link>
      </div>
    );
  }

  if (dayFinished) {
    const totalPossible = questions.reduce((sum, q) => sum + (q.points || 10), 0) || 1;
    const finalPct = Math.round((scoreRef.current / totalPossible) * 100);

    return (
      <div style={{ maxWidth: '560px', margin: '1.5rem auto' }}>
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.2rem',
          }}>
            <Award size={32} color="#10b981" />
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: meta.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Day {dayNum} · {meta.title}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.45rem 0 1.4rem' }}>Nice work</h1>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
            <div style={{ padding: '12px', background: 'rgba(0,0,0,0.25)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACCURACY</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>{finalPct}%</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(0,0,0,0.25)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>TIME</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>{formatClock(timeSpent)}</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(0,0,0,0.25)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>XP</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>+100</div>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {weakAfterDay.length
              ? `${weakAfterDay.length} topic${weakAfterDay.length === 1 ? '' : 's'} need recovery in Practice Lab.`
              : 'This day is saved. Keep going — or recover any older misses in Practice Lab.'}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/assessment" className="btn-secondary">All 7 days</Link>
            {weakAfterDay.length > 0 && (
              <Link to="/practice" className="btn-secondary">Recover misses</Link>
            )}
            {dayNum < 7 ? (
              <button type="button" className="btn-primary" onClick={() => navigate(`/assessment/day/${dayNum + 1}`)}>
                Day {dayNum + 1} <ArrowRight size={16} />
              </button>
            ) : (
              <Link to="/ai-profile" className="btn-primary">AI profile <Sparkles size={16} /></Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <Link to="/assessment" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> 7-day map
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={15} /> {formatClock(timeSpent)}</span>
          <span className="xp-badge"><Sparkles size={13} /> {score} pts</span>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ color: meta.color, fontWeight: 800 }}>DAY {dayNum} · {meta.title.toUpperCase()}</span>
          <span>{currentIndex + 1} / {questions.length}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          {questions.map((_, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '999px',
                background: idx < currentIndex ? '#34d399' : idx === currentIndex ? meta.color : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#67e8f9',
            background: 'rgba(6, 182, 212, 0.12)',
            padding: '3px 10px',
            borderRadius: '999px',
          }}>
            {currentQ.subject_tag || 'CS'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {currentQ.difficulty || 'Beginner'}
          </span>
        </div>

        <h2 style={{ fontSize: '1.28rem', fontWeight: 750, lineHeight: 1.45, marginBottom: '1.1rem' }}>
          {currentQ.prompt}
        </h2>

        {currentQ.code_snippet ? (
          <pre style={{
            backgroundColor: '#070b14',
            padding: '1rem 1.1rem',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.86rem',
            color: '#7dd3fc',
            marginBottom: '1.35rem',
            overflowX: 'auto',
            lineHeight: 1.55,
          }}
          >
            {currentQ.code_snippet}
          </pre>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const correctText = String(feedback?.correct_answer || '').replace(/^[A-D][.)]\s*/, '');
            const isCorrectOpt = feedback && opt.replace(/^[A-D][.)]\s*/, '') === correctText;
            const isWrong = feedback && isSelected && !feedback.is_correct;

            let bg = 'rgba(255,255,255,0.03)';
            let border = 'var(--border-color)';
            let color = 'var(--text-primary)';
            if (submitted) {
              if (isCorrectOpt) {
                bg = 'rgba(16, 185, 129, 0.16)';
                border = '#10b981';
                color = '#34d399';
              } else if (isWrong) {
                bg = 'rgba(239, 68, 68, 0.14)';
                border = '#ef4444';
                color = '#f87171';
              }
            } else if (isSelected) {
              bg = 'rgba(99, 102, 241, 0.18)';
              border = '#818cf8';
            }

            return (
              <button
                key={`${opt}-${idx}`}
                type="button"
                disabled={submitted}
                onClick={() => setSelectedOption(opt)}
                style={{
                  padding: '13px 16px',
                  borderRadius: '12px',
                  backgroundColor: bg,
                  border: `1px solid ${border}`,
                  color,
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: submitted ? 'default' : 'pointer',
                }}
              >
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  background: isSelected && !submitted ? '#6366f1' : 'rgba(255,255,255,0.06)',
                }}
                >
                  {LETTERS[idx] || idx + 1}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
                {submitted && isCorrectOpt ? <CheckCircle2 size={18} color="#10b981" /> : null}
                {submitted && isWrong ? <XCircle size={18} color="#ef4444" /> : null}
              </button>
            );
          })}
        </div>

        {feedback ? (
          <div style={{
            marginTop: '1.2rem',
            padding: '1rem 1.1rem',
            borderRadius: '12px',
            backgroundColor: feedback.is_correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${feedback.is_correct ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          }}
          >
            <div style={{ fontWeight: 800, color: feedback.is_correct ? '#34d399' : '#f87171', marginBottom: '4px', display: 'flex', gap: '6px', alignItems: 'center' }}>
              {feedback.is_correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              {feedback.is_correct ? 'Correct' : 'Not this one'}
            </div>
            <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.55 }}>{feedback.explanation}</p>
          </div>
        ) : null}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          {!submitted ? (
            <button
              type="button"
              onClick={handleSubmitAnswer}
              disabled={!selectedOption || submitting}
              className="btn-primary"
              style={{ opacity: selectedOption ? 1 : 0.45 }}
            >
              Check answer
            </button>
          ) : (
            <button type="button" onClick={handleNextQuestion} className="btn-primary">
              {currentIndex + 1 < questions.length ? 'Next' : 'Finish day'} <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentDayPage;
