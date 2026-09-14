import React, { useState, useEffect } from 'react';
import AnimationPlayerWrapper from './AnimationPlayerWrapper';
import { RefreshCw, Terminal, Check, X } from 'lucide-react';

const WHILE_STEPS = [
  {
    step: 0,
    activeLine: 1,
    countVal: 0,
    conditionResult: null,
    explanation: 'Step 1: Initialize variable count = 0 in memory.',
    stdout: [],
  },
  {
    step: 1,
    activeLine: 2,
    countVal: 0,
    conditionResult: 'True (0 < 3)',
    explanation: 'Step 2: Condition check: 0 < 3 is TRUE. Enter the while loop body.',
    stdout: [],
  },
  {
    step: 2,
    activeLine: 3,
    countVal: 0,
    conditionResult: 'True',
    explanation: 'Step 3: print(count) executes. 0 is flushed to stdout.',
    stdout: ['0'],
  },
  {
    step: 3,
    activeLine: 4,
    countVal: 1,
    conditionResult: null,
    explanation: 'Step 4: Increment count += 1. Value in memory updates from 0 → 1.',
    stdout: ['0'],
  },
  {
    step: 4,
    activeLine: 2,
    countVal: 1,
    conditionResult: 'True (1 < 3)',
    explanation: 'Step 5: Condition check: 1 < 3 is TRUE. Continue loop.',
    stdout: ['0'],
  },
  {
    step: 5,
    activeLine: 3,
    countVal: 1,
    conditionResult: 'True',
    explanation: 'Step 6: print(count) prints 1 to stdout.',
    stdout: ['0', '1'],
  },
  {
    step: 6,
    activeLine: 4,
    countVal: 2,
    conditionResult: null,
    explanation: 'Step 7: Increment count += 1. Value updates from 1 → 2.',
    stdout: ['0', '1'],
  },
  {
    step: 7,
    activeLine: 2,
    countVal: 2,
    conditionResult: 'True (2 < 3)',
    explanation: 'Step 8: Condition check: 2 < 3 is TRUE. Continue loop.',
    stdout: ['0', '1'],
  },
  {
    step: 8,
    activeLine: 3,
    countVal: 2,
    conditionResult: 'True',
    explanation: 'Step 9: print(count) prints 2 to stdout.',
    stdout: ['0', '1', '2'],
  },
  {
    step: 9,
    activeLine: 4,
    countVal: 3,
    conditionResult: null,
    explanation: 'Step 10: Increment count += 1. Value updates from 2 → 3.',
    stdout: ['0', '1', '2'],
  },
  {
    step: 10,
    activeLine: 2,
    countVal: 3,
    conditionResult: 'False (3 < 3 is False)',
    explanation: 'Step 11: Condition check: 3 < 3 is FALSE! The while loop terminates.',
    stdout: ['0', '1', '2'],
  },
];

const WhileLoopAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= WHILE_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1700 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const activeData = WHILE_STEPS[currentStep];

  return (
    <AnimationPlayerWrapper
      title="While Loop Condition Check & Accumulation"
      subtitle="Visualizing while condition branching (True/False), state increments, and loop termination."
      currentStep={currentStep}
      totalSteps={WHILE_STEPS.length}
      isPlaying={isPlaying}
      playbackSpeed={speed}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onNext={() => setCurrentStep((p) => Math.min(p + 1, WHILE_STEPS.length - 1))}
      onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
      onRestart={() => { setCurrentStep(0); setIsPlaying(false); }}
      onSpeedChange={(s) => setSpeed(s)}
    >
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left: Code Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            backgroundColor: '#030712',
            padding: '1.2rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem'
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '8px' }}># while_demo.py</div>
            {[
              { num: 1, text: 'count = 0' },
              { num: 2, text: 'while count < 3:' },
              { num: 3, text: '    print(count)' },
              { num: 4, text: '    count += 1' },
            ].map((line) => (
              <div
                key={line.num}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  backgroundColor: activeData.activeLine === line.num ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                  borderLeft: activeData.activeLine === line.num ? '3px solid #818cf8' : '3px solid transparent',
                  color: activeData.activeLine === line.num ? '#ffffff' : '#94a3b8'
                }}
              >
                {line.text}
              </div>
            ))}
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <p style={{ fontSize: '0.85rem', color: '#c7d2fe', lineHeight: 1.5 }}>
              {activeData.explanation}
            </p>
          </div>
        </div>

        {/* Right: Variable & Condition State */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Condition Evaluation Card */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#111827',
            border: activeData.conditionResult?.includes('False') ? '2px solid #ef4444' : activeData.conditionResult ? '2px solid #10b981' : '1px solid var(--border-color)',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>CONDITION EVALUATION (count &lt; 3)</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: activeData.conditionResult?.includes('False') ? '#f87171' : activeData.conditionResult ? '#34d399' : 'var(--text-muted)' }}>
                {activeData.conditionResult || 'Awaiting check...'}
              </div>
            </div>
            {activeData.conditionResult?.includes('False') ? (
              <X size={24} color="#ef4444" />
            ) : activeData.conditionResult ? (
              <Check size={24} color="#10b981" />
            ) : null}
          </div>

          {/* Memory Box for count */}
          <div style={{
            backgroundColor: '#111827',
            border: '2px solid #818cf8',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#c7d2fe', fontWeight: 600 }}>Variable in RAM: <b>count</b></span>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              {activeData.countVal}
            </span>
          </div>

          {/* Console Output */}
          <div style={{
            backgroundColor: '#030712',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            minHeight: '80px'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>CONSOLE STDOUT</div>
            <div style={{ fontFamily: 'var(--font-mono)', color: '#34d399', fontSize: '0.85rem' }}>
              {activeData.stdout.map((l, i) => (
                <div key={i}>&gt; {l}</div>
              ))}
              {activeData.stdout.length === 0 && <span style={{ color: 'var(--text-muted)' }}>(No output yet)</span>}
            </div>
          </div>
        </div>
      </div>
    </AnimationPlayerWrapper>
  );
};

export default WhileLoopAnimation;
