import React, { useState, useEffect } from 'react';
import AnimationPlayerWrapper from './AnimationPlayerWrapper';
import { Layers, ArrowDown, ArrowUp } from 'lucide-react';

const STACK_STEPS = [
  {
    step: 0,
    action: 'Initial Empty Stack',
    stack: [],
    explanation: 'Step 0: An empty stack is initialized with capacity 4. Stack pointer top = -1.',
    operationType: 'none',
  },
  {
    step: 1,
    action: 'push(10)',
    stack: [10],
    explanation: 'Step 1: push(10) pushes value 10 onto the stack. Top pointer points to index 0 (value 10).',
    operationType: 'push',
    activeVal: 10,
  },
  {
    step: 2,
    action: 'push(20)',
    stack: [10, 20],
    explanation: 'Step 2: push(20) places 20 on top of 10. Top pointer moves to index 1 (value 20).',
    operationType: 'push',
    activeVal: 20,
  },
  {
    step: 3,
    action: 'pop() → returns 20',
    stack: [10],
    explanation: 'Step 3: pop() removes the uppermost element (20) following LIFO order. Top pointer moves back to 10.',
    operationType: 'pop',
    activeVal: 20,
  },
  {
    step: 4,
    action: 'push(30)',
    stack: [10, 30],
    explanation: 'Step 4: push(30) pushes value 30 on top of 10. Top pointer now references index 1 (value 30).',
    operationType: 'push',
    activeVal: 30,
  },
];

const StackAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= STACK_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const activeData = STACK_STEPS[currentStep];

  return (
    <AnimationPlayerWrapper
      title="Stack (LIFO) Operations Visualization"
      subtitle="Last-In First-Out: Push elements to top, Pop elements from top."
      currentStep={currentStep}
      totalSteps={STACK_STEPS.length}
      isPlaying={isPlaying}
      playbackSpeed={speed}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onNext={() => setCurrentStep((p) => Math.min(p + 1, STACK_STEPS.length - 1))}
      onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
      onRestart={() => { setCurrentStep(0); setIsPlaying(false); }}
      onSpeedChange={(s) => setSpeed(s)}
    >
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'center' }}>
        {/* Left: Operations & Explanation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
            <Layers size={18} /> STACK OPERATION SEQUENCE
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {['Initial: []', 'Push(10)', 'Push(20)', 'Pop() -> 20', 'Push(30)'].map((op, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: currentStep === idx ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.02)',
                  border: currentStep === idx ? '1px solid #818cf8' : '1px solid var(--border-color)',
                  color: currentStep === idx ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: currentStep === idx ? 700 : 400,
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {op}
              </div>
            ))}
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <p style={{ fontSize: '0.85rem', color: '#c7d2fe', lineHeight: 1.5 }}>
              {activeData.explanation}
            </p>
          </div>
        </div>

        {/* Right: Vertical Stack Visualization */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '160px',
            minHeight: '220px',
            borderLeft: '4px solid #6366f1',
            borderRight: '4px solid #6366f1',
            borderBottom: '6px solid #6366f1',
            borderRadius: '0 0 12px 12px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column-reverse',
            padding: '8px',
            gap: '8px',
            position: 'relative'
          }}>
            {activeData.stack.map((val, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: idx === activeData.stack.length - 1 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#1e293b',
                  background: idx === activeData.stack.length - 1 ? 'var(--primary-gradient)' : '#1e293b',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  fontFamily: 'var(--font-mono)',
                  textAlign: 'center',
                  padding: '12px',
                  borderRadius: '6px',
                  boxShadow: idx === activeData.stack.length - 1 ? '0 0 15px rgba(99, 102, 241, 0.4)' : 'none',
                  animation: 'pulse-glow 2s infinite',
                  position: 'relative'
                }}
              >
                {val}
                {idx === activeData.stack.length - 1 && (
                  <span style={{
                    position: 'absolute',
                    right: '-75px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.75rem',
                    color: '#fbbf24',
                    fontWeight: 700
                  }}>
                    ← TOP
                  </span>
                )}
              </div>
            ))}
            {activeData.stack.length === 0 && (
              <div style={{ margin: 'auto', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                [ Stack Empty ]
              </div>
            )}
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Stack Base (Fixed)
          </div>
        </div>
      </div>
    </AnimationPlayerWrapper>
  );
};

export default StackAnimation;
