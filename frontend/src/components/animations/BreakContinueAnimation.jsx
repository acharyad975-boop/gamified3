import React, { useState, useEffect } from 'react';
import AnimationPlayerWrapper from './AnimationPlayerWrapper';
import { Ban, FastForward, Terminal } from 'lucide-react';

const BREAK_STEPS = [
  { step: 0, i: 0, line: 1, action: 'i = 0: Check if i == 3 (False)', stdout: ['0'], explanation: 'i = 0: Condition i == 3 is False. Executes print(0).' },
  { step: 1, i: 1, line: 1, action: 'i = 1: Check if i == 3 (False)', stdout: ['0', '1'], explanation: 'i = 1: Condition i == 3 is False. Executes print(1).' },
  { step: 2, i: 2, line: 1, action: 'i = 2: Check if i == 3 (False)', stdout: ['0', '1', '2'], explanation: 'i = 2: Condition i == 3 is False. Executes print(2).' },
  { step: 3, i: 3, line: 2, action: 'i = 3: Condition i == 3 is TRUE -> BREAK!', stdout: ['0', '1', '2'], isBreak: true, explanation: 'i = 3: BREAK statement triggers! The loop terminates immediately. 3 and 4 are NEVER printed.' },
];

const CONTINUE_STEPS = [
  { step: 0, i: 0, line: 1, action: 'i = 0: Check if i == 2 (False)', stdout: ['0'], explanation: 'i = 0: Condition i == 2 is False. Executes print(0).' },
  { step: 1, i: 1, line: 1, action: 'i = 1: Check if i == 2 (False)', stdout: ['0', '1'], explanation: 'i = 1: Condition i == 2 is False. Executes print(1).' },
  { step: 2, i: 2, line: 2, action: 'i = 2: Condition i == 2 is TRUE -> CONTINUE (Skip print)', stdout: ['0', '1'], isContinue: true, explanation: 'i = 2: CONTINUE statement triggers! Remaining lines in this iteration are SKIPPED. Jumps directly to next loop step (i = 3).' },
  { step: 3, i: 3, line: 1, action: 'i = 3: Check if i == 2 (False)', stdout: ['0', '1', '3'], explanation: 'i = 3: Condition is False. Executes print(3).' },
  { step: 4, i: 4, line: 1, action: 'i = 4: Check if i == 2 (False)', stdout: ['0', '1', '3', '4'], explanation: 'i = 4: Condition is False. Executes print(4). Loop ends.' },
];

const BreakContinueAnimation = () => {
  const [mode, setMode] = useState('break'); // 'break' | 'continue'
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const steps = mode === 'break' ? BREAK_STEPS : CONTINUE_STEPS;

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1900 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, steps]);

  const activeData = steps[currentStep];

  return (
    <AnimationPlayerWrapper
      title={`Control Flow Jumps: ${mode.toUpperCase()} Statement`}
      subtitle={mode === 'break' ? 'Break terminates the entire loop immediately.' : 'Continue skips the rest of the current iteration and advances.'}
      currentStep={currentStep}
      totalSteps={steps.length}
      isPlaying={isPlaying}
      playbackSpeed={speed}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onNext={() => setCurrentStep((p) => Math.min(p + 1, steps.length - 1))}
      onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
      onRestart={() => { setCurrentStep(0); setIsPlaying(false); }}
      onSpeedChange={(s) => setSpeed(s)}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Mode Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button
            onClick={() => { setMode('break'); setCurrentStep(0); setIsPlaying(false); }}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              backgroundColor: mode === 'break' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              border: mode === 'break' ? '1px solid #ef4444' : '1px solid var(--border-color)',
              color: mode === 'break' ? '#f87171' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Ban size={16} /> Demonstrate BREAK
          </button>
          <button
            onClick={() => { setMode('continue'); setCurrentStep(0); setIsPlaying(false); }}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              backgroundColor: mode === 'continue' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              border: mode === 'continue' ? '1px solid #06b6d4' : '1px solid var(--border-color)',
              color: mode === 'continue' ? '#38bdf8' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FastForward size={16} /> Demonstrate CONTINUE
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Left: Code Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: '#030712', padding: '1.2rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '8px' }}># {mode}_demo.py</div>
              <div style={{ color: '#818cf8' }}>for i in range(5):</div>
              {mode === 'break' ? (
                <>
                  <div style={{ paddingLeft: '16px', color: activeData.isBreak ? '#ef4444' : '#e2e8f0', fontWeight: activeData.isBreak ? 800 : 400 }}>
                    if i == 3:
                  </div>
                  <div style={{ paddingLeft: '32px', color: activeData.isBreak ? '#f87171' : '#94a3b8', backgroundColor: activeData.isBreak ? 'rgba(239, 68, 68, 0.2)' : 'transparent', borderRadius: '4px' }}>
                    break  # &lt;-- Immediate loop exit!
                  </div>
                </>
              ) : (
                <>
                  <div style={{ paddingLeft: '16px', color: activeData.isContinue ? '#06b6d4' : '#e2e8f0', fontWeight: activeData.isContinue ? 800 : 400 }}>
                    if i == 2:
                  </div>
                  <div style={{ paddingLeft: '32px', color: activeData.isContinue ? '#38bdf8' : '#94a3b8', backgroundColor: activeData.isContinue ? 'rgba(6, 182, 212, 0.2)' : 'transparent', borderRadius: '4px' }}>
                    continue  # &lt;-- Skip print(i) & jump to next step
                  </div>
                </>
              )}
              <div style={{ paddingLeft: '16px', color: '#e2e8f0' }}>print(i)</div>
            </div>

            <div style={{ padding: '12px 16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <p style={{ fontSize: '0.85rem', color: '#c7d2fe', lineHeight: 1.5 }}>
                {activeData.explanation}
              </p>
            </div>
          </div>

          {/* Right: Counter & Console */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              backgroundColor: '#111827',
              border: activeData.isBreak ? '2px solid #ef4444' : activeData.isContinue ? '2px solid #06b6d4' : '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '14px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>LOOP INDEX i</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: activeData.isBreak ? '#f87171' : activeData.isContinue ? '#38bdf8' : '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                i = {activeData.i}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {activeData.action}
              </div>
            </div>

            <div style={{ backgroundColor: '#030712', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', minHeight: '100px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>CONSOLE STDOUT</div>
              <div style={{ fontFamily: 'var(--font-mono)', color: '#34d399', fontSize: '0.85rem' }}>
                {activeData.stdout.map((l, i) => (
                  <div key={i}>&gt; {l}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimationPlayerWrapper>
  );
};

export default BreakContinueAnimation;
