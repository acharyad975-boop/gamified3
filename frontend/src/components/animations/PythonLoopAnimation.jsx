import React, { useState, useEffect } from 'react';
import AnimationPlayerWrapper from './AnimationPlayerWrapper';
import { RefreshCw, Terminal } from 'lucide-react';

const LOOP_STEPS = [
  {
    step: 0,
    activeLine: 1,
    loopIndex: 0,
    rangeRemaining: [1, 2],
    explanation: 'Iteration 1: range(3) yields i = 0. The loop condition is checked and True.',
    stdout: [],
  },
  {
    step: 1,
    activeLine: 2,
    loopIndex: 0,
    rangeRemaining: [1, 2],
    explanation: 'print(i) executes with i = 0. "0" is flushed to stdout console.',
    stdout: ['0'],
  },
  {
    step: 2,
    activeLine: 1,
    loopIndex: 1,
    rangeRemaining: [2],
    explanation: 'Iteration 2: The loop variable advances: i changes from 0 → 1.',
    stdout: ['0'],
  },
  {
    step: 3,
    activeLine: 2,
    loopIndex: 1,
    rangeRemaining: [2],
    explanation: 'print(i) executes with i = 1. "1" is printed on a new line.',
    stdout: ['0', '1'],
  },
  {
    step: 4,
    activeLine: 1,
    loopIndex: 2,
    rangeRemaining: [],
    explanation: 'Iteration 3: The loop variable advances: i changes from 1 → 2.',
    stdout: ['0', '1'],
  },
  {
    step: 5,
    activeLine: 2,
    loopIndex: 2,
    rangeRemaining: [],
    explanation: 'print(i) executes with i = 2. "2" is printed to stdout.',
    stdout: ['0', '1', '2'],
  },
  {
    step: 6,
    activeLine: 3,
    loopIndex: 'Terminated',
    rangeRemaining: [],
    explanation: 'Loop Termination: range(3) iterator exhausted. Control flow exits the loop.',
    stdout: ['0', '1', '2'],
  },
];

const PythonLoopAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= LOOP_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const activeData = LOOP_STEPS[currentStep];

  return (
    <AnimationPlayerWrapper
      title="For Loop Step-by-Step Execution"
      subtitle="Visualizing iteration counter, range() exhaustion, and stdout stream."
      currentStep={currentStep}
      totalSteps={LOOP_STEPS.length}
      isPlaying={isPlaying}
      playbackSpeed={speed}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onNext={() => setCurrentStep((p) => Math.min(p + 1, LOOP_STEPS.length - 1))}
      onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
      onRestart={() => { setCurrentStep(0); setIsPlaying(false); }}
      onSpeedChange={(s) => setSpeed(s)}
    >
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left: Code Box with active highlight */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            backgroundColor: '#030712',
            padding: '1.2rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.95rem'
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '8px' }}># loop_demo.py</div>
            <div style={{
              padding: '6px 10px',
              borderRadius: '4px',
              backgroundColor: activeData.activeLine === 1 ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
              borderLeft: activeData.activeLine === 1 ? '3px solid #818cf8' : '3px solid transparent',
              color: activeData.activeLine === 1 ? '#ffffff' : '#94a3b8'
            }}>
              for i in range(3):
            </div>
            <div style={{
              padding: '6px 10px 6px 28px',
              borderRadius: '4px',
              backgroundColor: activeData.activeLine === 2 ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
              borderLeft: activeData.activeLine === 2 ? '3px solid #818cf8' : '3px solid transparent',
              color: activeData.activeLine === 2 ? '#ffffff' : '#94a3b8'
            }}>
              print(i)
            </div>
            <div style={{
              padding: '6px 10px',
              color: activeData.activeLine === 3 ? '#34d399' : 'var(--text-muted)',
              fontSize: '0.85rem'
            }}>
              # (End of loop block)
            </div>
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <p style={{ fontSize: '0.85rem', color: '#c7d2fe', lineHeight: 1.5 }}>
              {activeData.explanation}
            </p>
          </div>
        </div>

        {/* Right: Variable Tracking & Console Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Active Variable i Box */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              flex: 1,
              backgroundColor: '#111827',
              border: '2px solid #818cf8',
              borderRadius: '10px',
              padding: '14px',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.25)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>LOOP COUNTER (i)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                {activeData.loopIndex}
              </div>
            </div>

            <div style={{
              flex: 1,
              backgroundColor: '#111827',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '14px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>RANGE ITERATOR</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
                [{activeData.rangeRemaining.join(', ') || 'exhausted'}]
              </div>
            </div>
          </div>

          {/* Console Stream */}
          <div style={{
            backgroundColor: '#030712',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            minHeight: '110px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <Terminal size={14} /> STANDARD OUTPUT (STDOUT)
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#34d399', lineHeight: 1.6 }}>
              {activeData.stdout.map((line, idx) => (
                <div key={idx}>&gt; {line}</div>
              ))}
              {activeData.stdout.length === 0 && <span style={{ color: 'var(--text-muted)' }}>(Waiting for print output...)</span>}
            </div>
          </div>
        </div>
      </div>
    </AnimationPlayerWrapper>
  );
};

export default PythonLoopAnimation;
