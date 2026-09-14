import React, { useState, useEffect } from 'react';
import AnimationPlayerWrapper from './AnimationPlayerWrapper';
import { Layers, ArrowDown, Check } from 'lucide-react';

const RETURN_STEPS = [
  {
    step: 0,
    activeLine: 1,
    callStack: ['<module> (Global)'],
    localScope: null,
    globalResult: 'unassigned',
    explanation: 'Step 1: def add(a, b) function is defined in memory.',
  },
  {
    step: 1,
    activeLine: 4,
    callStack: ['<module> (Global)', 'add(a=5, b=3)'],
    localScope: { a: 5, b: 3 },
    globalResult: 'evaluating...',
    explanation: 'Step 2: Caller invokes add(5, 3). Stack frame created with arguments a = 5, b = 3.',
  },
  {
    step: 2,
    activeLine: 2,
    callStack: ['<module> (Global)', 'add(a=5, b=3) [return 8]'],
    localScope: { a: 5, b: 3, sum: '5 + 3 = 8' },
    globalResult: 'evaluating...',
    explanation: 'Step 3: add() calculates a + b (5 + 3 = 8) and executes return 8.',
  },
  {
    step: 3,
    activeLine: 4,
    callStack: ['<module> (Global)'],
    localScope: null,
    globalResult: '8',
    explanation: 'Step 4: add() frame pops off the stack. The returned value 8 is stored in variable "result = 8" in global memory.',
  },
];

const ReturnCallStackAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= RETURN_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const activeData = RETURN_STEPS[currentStep];

  return (
    <AnimationPlayerWrapper
      title="Return Values & Stack Frame Resolution"
      subtitle="Visualizing function evaluation, return value transfer, and global variable assignment."
      currentStep={currentStep}
      totalSteps={RETURN_STEPS.length}
      isPlaying={isPlaying}
      playbackSpeed={speed}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onNext={() => setCurrentStep((p) => Math.min(p + 1, RETURN_STEPS.length - 1))}
      onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
      onRestart={() => { setCurrentStep(0); setIsPlaying(false); }}
      onSpeedChange={(s) => setSpeed(s)}
    >
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left: Code Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ backgroundColor: '#030712', padding: '1.2rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '8px' }}># return_demo.py</div>
            <div style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: activeData.activeLine === 1 ? 'rgba(99, 102, 241, 0.3)' : 'transparent', color: '#c084fc', fontWeight: 700 }}>
              def add(a, b):
            </div>
            <div style={{ padding: '4px 8px 4px 24px', borderRadius: '4px', backgroundColor: activeData.activeLine === 2 ? 'rgba(99, 102, 241, 0.3)' : 'transparent', color: '#34d399', fontWeight: 700 }}>
              return a + b
            </div>
            <div style={{ height: '8px' }} />
            <div style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: activeData.activeLine === 4 ? 'rgba(99, 102, 241, 0.3)' : 'transparent', color: '#38bdf8', fontWeight: 700 }}>
              result = add(5, 3)
            </div>
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <p style={{ fontSize: '0.85rem', color: '#c7d2fe', lineHeight: 1.5 }}>
              {activeData.explanation}
            </p>
          </div>
        </div>

        {/* Right: Call Stack & Result Variable in RAM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            border: '2px solid #818cf8',
            borderRadius: '10px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: '8px',
            minHeight: '110px'
          }}>
            {activeData.callStack.map((frame, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: idx === activeData.callStack.length - 1 ? 'var(--primary-gradient)' : '#1f2937',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {frame}
              </div>
            ))}
          </div>

          {/* Global Variable Box for result */}
          <div style={{
            backgroundColor: '#111827',
            border: activeData.globalResult === '8' ? '2px solid #10b981' : '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: activeData.globalResult === '8' ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>GLOBAL VARIABLE</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>result</div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: activeData.globalResult === '8' ? '#34d399' : '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              {activeData.globalResult}
            </div>
          </div>
        </div>
      </div>
    </AnimationPlayerWrapper>
  );
};

export default ReturnCallStackAnimation;
