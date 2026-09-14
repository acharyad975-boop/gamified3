import React, { useState, useEffect } from 'react';
import AnimationPlayerWrapper from './AnimationPlayerWrapper';
import { Layers, Terminal, ArrowRight } from 'lucide-react';

const FUNCTION_STEPS = [
  {
    step: 0,
    activeLine: 1,
    callStack: ['<module> (Global Scope)'],
    parameters: {},
    explanation: 'Step 1: Function definition def greet(name): is registered in memory. The body is NOT executed yet.',
    stdout: [],
  },
  {
    step: 1,
    activeLine: 4,
    callStack: ['<module> (Global)', 'greet(name="John")'],
    parameters: { name: '"John"' },
    explanation: 'Step 2: Caller executes greet("John"). A new Stack Frame is pushed onto the Call Stack! Parameter "name" binds to "John".',
    stdout: [],
  },
  {
    step: 2,
    activeLine: 2,
    callStack: ['<module> (Global)', 'greet(name="John")'],
    parameters: { name: '"John"' },
    explanation: 'Step 3: Inside greet(): print("Hello", name) executes using local scope variable name="John".',
    stdout: ['Hello John'],
  },
  {
    step: 3,
    activeLine: 5,
    callStack: ['<module> (Global Scope)'],
    parameters: {},
    explanation: 'Step 4: Function execution finishes. The greet() Stack Frame is POPPED from the Call Stack. Control returns to global scope.',
    stdout: ['Hello John'],
  },
];

const FunctionCallStackAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= FUNCTION_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const activeData = FUNCTION_STEPS[currentStep];

  return (
    <AnimationPlayerWrapper
      title="Function Definition, Parameters & Call Stack Frame"
      subtitle="Visualizing caller invocation, stack frame push, local parameter scope, and frame pop."
      currentStep={currentStep}
      totalSteps={FUNCTION_STEPS.length}
      isPlaying={isPlaying}
      playbackSpeed={speed}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onNext={() => setCurrentStep((p) => Math.min(p + 1, FUNCTION_STEPS.length - 1))}
      onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
      onRestart={() => { setCurrentStep(0); setIsPlaying(false); }}
      onSpeedChange={(s) => setSpeed(s)}
    >
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left: Code Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ backgroundColor: '#030712', padding: '1.2rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '8px' }}># functions_demo.py</div>
            <div style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: activeData.activeLine === 1 ? 'rgba(99, 102, 241, 0.3)' : 'transparent', color: '#c084fc', fontWeight: 700 }}>
              def greet(name):
            </div>
            <div style={{ padding: '4px 8px 4px 24px', borderRadius: '4px', backgroundColor: activeData.activeLine === 2 ? 'rgba(99, 102, 241, 0.3)' : 'transparent', color: '#e2e8f0' }}>
              print("Hello", name)
            </div>
            <div style={{ height: '8px' }} />
            <div style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: activeData.activeLine === 4 ? 'rgba(99, 102, 241, 0.3)' : 'transparent', color: '#38bdf8', fontWeight: 700 }}>
              greet("John")
            </div>
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <p style={{ fontSize: '0.85rem', color: '#c7d2fe', lineHeight: 1.5 }}>
              {activeData.explanation}
            </p>
          </div>
        </div>

        {/* Right: Simulated Call Stack & Local Scope */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
            <Layers size={16} /> CALL STACK (LIFO EXECUTION FRAMES)
          </div>

          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            border: '2px solid #818cf8',
            borderRadius: '10px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: '8px',
            minHeight: '140px'
          }}>
            {activeData.callStack.map((frame, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  backgroundColor: idx === activeData.callStack.length - 1 ? 'var(--primary-gradient)' : '#1f2937',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: idx === activeData.callStack.length - 1 ? '0 0 15px rgba(99, 102, 241, 0.4)' : 'none'
                }}
              >
                <span>{frame}</span>
                {idx === activeData.callStack.length - 1 && (
                  <span style={{ fontSize: '0.7rem', color: '#fbbf24', background: 'rgba(0, 0, 0, 0.4)', padding: '2px 6px', borderRadius: '4px' }}>
                    ACTIVE FRAME
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Console stdout */}
          <div style={{ backgroundColor: '#030712', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', minHeight: '60px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>CONSOLE STDOUT</div>
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

export default FunctionCallStackAnimation;
