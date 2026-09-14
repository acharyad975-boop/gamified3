import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import sounds from './SoundSystem';
import CodeComparator from './CodeComparator';
import { 
  Play, 
  RotateCcw, 
  Lightbulb, 
  Volume2, 
  VolumeX, 
  Award, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  BrainCircuit,
  Compass,
  Repeat,
  Target,
  Code2
} from 'lucide-react';

const GameRunner = ({
  game,
  levels = [],
  currentLevelIndex = 0,
  onLevelChange,
  renderGameArena,
  onSessionComplete
}) => {
  const navigate = useNavigate();
  const currentLevel = levels[currentLevelIndex] || {};

  // Gameplay state
  const [language, setLanguage] = useState('python');
  const [gameAction, setGameAction] = useState('Ready to run');
  const [highlightLine, setHighlightLine] = useState(1);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);
  const [speed, setSpeed] = useState(1); // 1x, 2x, 4x

  // Metrics telemetry
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);

  // Completion modal state
  const [completedResult, setCompletedResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (!showResultModal) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showResultModal]);

  // Reset metrics when level changes
  useEffect(() => {
    setTimerSeconds(0);
    setMistakes(0);
    setHintsUsed(0);
    setAttempts(1);
    setGameAction('Level loaded. Ready to program.');
    setHighlightLine(1);
    setShowResultModal(false);
    setCompletedResult(null);
  }, [currentLevelIndex]);

  const toggleSound = () => {
    const state = sounds.toggleSound();
    setSoundEnabled(state);
    if (state) sounds.playClick();
  };

  const recordMistake = (errorDetail = 'Logic condition mismatch') => {
    setMistakes((prev) => prev + 1);
    sounds.playError();
    setGameAction(`Error detected: ${errorDetail}`);
  };

  const useHint = (hintIdx = 0) => {
    if (!hintsOpen) {
      setHintsUsed((prev) => prev + 1);
      sounds.playTone(600, 'sine', 0.08);
      setHintsOpen(true);
    } else {
      setHintsOpen(false);
    }
  };

  // Called by child game component when goal is achieved
  const handleLevelFinished = async (finalTelemetry = {}) => {
    if (submitting || showResultModal) return;
    setSubmitting(true);
    sounds.playLevelComplete();

    const payload = {
      game_slug: game.slug,
      level_number: currentLevel.level_number || (currentLevelIndex + 1),
      attempts: attempts,
      mistakes: mistakes + (finalTelemetry.mistakes || 0),
      hints_used: hintsUsed,
      time_taken_seconds: timerSeconds,
      steps_executed: finalTelemetry.steps_executed || 5,
      optimal_steps: finalTelemetry.optimal_steps || 5,
      is_completed: true,
      concepts_tested: [game.concept],
      mistake_log: finalTelemetry.mistake_log || [],
      language_mode: language
    };

    try {
      const res = await api.post('/games/session/complete/', payload);
      setCompletedResult(res);
      setShowResultModal(true);
      if (onSessionComplete) {
        onSessionComplete(res);
      }
    } catch (e) {
      console.error('Failed to submit game session', e);
      // Fallback local result if network issue
      const fallbackResult = {
        game_title: game.title,
        level_number: currentLevel.level_number || 1,
        accuracy: Math.max(50, 100 - (mistakes * 15) - (hintsUsed * 10)),
        xp_earned: 50 + (mistakes === 0 ? 25 : 0) + (hintsUsed === 0 ? 20 : 0),
        is_perfect: mistakes === 0 && hintsUsed === 0,
        ai_feedback: `Great job completing ${game.title}! You demonstrated strong understanding of ${game.concept}.`,
        adaptive_difficulty: 'NEXT_TIER',
        recommended_actions: [
          { label: 'Advance to Next Level', type: 'NEXT_LEVEL', icon: 'ArrowRight' },
          { label: 'Try Real Code Challenge', type: 'CODING_CHALLENGE', icon: 'Code2' }
        ]
      };
      setCompletedResult(fallbackResult);
      setShowResultModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextLevel = () => {
    setShowResultModal(false);
    if (currentLevelIndex + 1 < levels.length) {
      onLevelChange(currentLevelIndex + 1);
    } else {
      navigate('/games');
    }
  };

  const handleRetry = () => {
    setShowResultModal(false);
    setAttempts((prev) => prev + 1);
    setMistakes(0);
    setTimerSeconds(0);
    setGameAction('Restarting level...');
    sounds.playClick();
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Top Game Navigation & Control HUD */}
      <div className="glass-panel" style={{
        padding: '1.2rem 1.8rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/games" className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
            <ArrowLeft size={16} /> Hub
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>{game.icon}</span>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                {game.title}
              </h1>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.4)'
              }}>
                LEVEL {currentLevel.level_number || 1} • {currentLevel.difficulty || 'BEGINNER'}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {currentLevel.title}: {currentLevel.objective}
            </p>
          </div>
        </div>

        {/* Status Metrics (Timer, Mistakes, XP, Sound) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Clock size={16} color="#06b6d4" />
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#ffffff' }}>
              {formatTime(timerSeconds)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Award size={16} color="#fbbf24" />
            <span style={{ fontWeight: 700, color: '#fbbf24' }}>
              +{currentLevel.xp_reward || 50} XP
            </span>
          </div>

          <button
            onClick={() => useHint(0)}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              backgroundColor: hintsOpen ? 'rgba(245, 158, 11, 0.2)' : undefined,
              borderColor: hintsOpen ? '#f59e0b' : undefined,
              color: hintsOpen ? '#fbbf24' : undefined
            }}
          >
            <Lightbulb size={14} color="#f59e0b" /> Hint {hintsUsed > 0 ? `(${hintsUsed})` : ''}
          </button>

          <button
            onClick={toggleSound}
            className="btn-secondary"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            style={{ padding: '8px' }}
          >
            {soundEnabled ? <Volume2 size={16} color="#34d399" /> : <VolumeX size={16} color="#ef4444" />}
          </button>
        </div>
      </div>

      {/* Interactive Level Progression Ribbon / Stage Map */}
      <div className="glass-panel" style={{
        padding: '0.85rem 1.4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'rgba(15, 23, 42, 0.65)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            CAMPAIGN LEVELS:
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {levels.map((lvl, idx) => {
            const isActive = idx === currentLevelIndex;
            const diffColors = {
              'BEGINNER': '#38bdf8',
              'EASY': '#34d399',
              'MEDIUM': '#fbbf24',
              'HARD': '#f97316',
              'EXPERT': '#ef4444'
            };
            const col = diffColors[lvl.difficulty] || '#818cf8';

            return (
              <button
                key={lvl.id || idx}
                onClick={() => onLevelChange && onLevelChange(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: isActive ? `2px solid ${col}` : '1px solid var(--border-color)',
                  background: isActive ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 800 : 500,
                  fontSize: '0.8rem',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? `0 0 14px ${col}44` : 'none'
                }}
              >
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: isActive ? col : 'rgba(255, 255, 255, 0.1)',
                  color: isActive ? '#000000' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 900
                }}>
                  {lvl.level_number || (idx + 1)}
                </span>
                <span>{lvl.title || `Level ${idx + 1}`}</span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  backgroundColor: `${col}22`,
                  color: col
                }}>
                  {lvl.difficulty || 'LVL'}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => currentLevelIndex > 0 && onLevelChange(currentLevelIndex - 1)}
            disabled={currentLevelIndex === 0}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.75rem', opacity: currentLevelIndex === 0 ? 0.4 : 1 }}
          >
            ◀ Prev Level
          </button>
          <button
            onClick={() => currentLevelIndex + 1 < levels.length && onLevelChange(currentLevelIndex + 1)}
            disabled={currentLevelIndex + 1 >= levels.length}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.75rem', opacity: currentLevelIndex + 1 >= levels.length ? 0.4 : 1 }}
          >
            Next Level ▶
          </button>
        </div>
      </div>

      {/* Hints Drawer if Open */}
      {hintsOpen && currentLevel.hints && currentLevel.hints.length > 0 && (
        <div className="glass-panel" style={{
          padding: '1.2rem 1.6rem',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 700, fontSize: '0.85rem' }}>
            <Lightbulb size={16} /> AI Pedagogical Hint Guide:
          </div>
          {currentLevel.hints.map((hint, idx) => (
            <p key={idx} style={{ fontSize: '0.85rem', color: '#fde68a', lineHeight: 1.5 }}>
              • {hint}
            </p>
          ))}
        </div>
      )}

      {/* Main Two-Column Layout: Game Arena & Real Code Side-by-Side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '20px', alignItems: 'stretch' }}>
        {/* Game Arena Column */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          {renderGameArena({
            level: currentLevel,
            speed,
            setSpeed,
            setGameAction,
            setHighlightLine,
            recordMistake,
            onComplete: handleLevelFinished,
            sounds
          })}
        </div>

        {/* Real Code Side-by-Side Column */}
        <div>
          <CodeComparator
            gameAction={gameAction}
            codeSnippets={currentLevel.code_snippets || {}}
            language={language}
            setLanguage={setLanguage}
            highlightLine={highlightLine}
          />
        </div>
      </div>

      {/* Level Selector Bar */}
      <div className="glass-panel" style={{
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          LEVEL PROGRESSION:
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {levels.map((lvl, idx) => {
            const isCurrent = idx === currentLevelIndex;
            const isUnlocked = lvl.is_unlocked || idx <= currentLevelIndex;
            return (
              <button
                key={lvl.id || idx}
                onClick={() => isUnlocked && onLevelChange(idx)}
                disabled={!isUnlocked}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  border: isCurrent ? '2px solid #818cf8' : '1px solid var(--border-color)',
                  background: isCurrent ? 'var(--primary-gradient)' : isUnlocked ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0,0,0,0.3)',
                  color: isUnlocked ? '#ffffff' : 'rgba(255,255,255,0.2)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s ease'
                }}
              >
                {lvl.level_number || idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Post-Level AI Diagnostic & XP Award Modal */}
      {showResultModal && completedResult && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '580px',
            width: '100%',
            padding: '2.5rem',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
            }}>
              <CheckCircle2 size={36} color="#ffffff" />
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                LEVEL COMPLETE • {game.title}
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                {completedResult.is_perfect ? '🌟 Flawless Mastery!' : '🎉 Logic Challenge Solved!'}
              </h2>
            </div>

            {/* XP and Accuracy Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.12)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>XP EARNED</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fbbf24' }}>
                  +{completedResult.xp_earned || 50} XP
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.12)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ACCURACY</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>
                  {Math.round(completedResult.accuracy || 100)}%
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.12)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DIFFICULTY</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c7d2fe' }}>
                  {completedResult.adaptive_difficulty || 'NEXT_TIER'}
                </div>
              </div>
            </div>

            {/* AI Diagnostic Synthesis */}
            <div style={{
              padding: '14px 18px',
              background: 'rgba(0, 0, 0, 0.35)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', marginBottom: '4px' }}>
                <BrainCircuit size={16} /> AI Cognitive Performance Analysis:
              </div>
              <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                {completedResult.ai_feedback}
              </p>
            </div>

            {/* Next Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleRetry} className="btn-secondary" style={{ padding: '10px 18px' }}>
                <RotateCcw size={16} /> Replay Level
              </button>
              <button onClick={handleNextLevel} className="btn-primary" style={{ padding: '10px 24px' }}>
                Continue Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameRunner;
