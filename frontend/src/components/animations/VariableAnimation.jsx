import React, { useState, useEffect } from 'react';
import AnimationPlayerWrapper from './AnimationPlayerWrapper';
import { ArrowRight, Database } from 'lucide-react';

const STEPS = [
  {
    stepNum: 0,
    codeLine: 'name = "John"',
    explanation: 'Step 1: The interpreter allocates a memory cell labeled "name" and stores the string "John".',
    variables: [{ name: 'name', value: '"John"', type: 'str', isNew: true }],
    output: '',
  },
  {
    stepNum: 1,
    codeLine: 'age = 20',
    explanation: 'Step 2: The interpreter allocates another memory cell labeled "age" and stores the integer 20.',
    variables: [
      { name: 'name', value: '"John"', type: 'str', isNew: false },
      { name: 'age', value: '20', type: 'int', isNew: true },
    ],
    output: '',
  },
  {
    stepNum: 2,
    codeLine: 'age = 21',
    explanation: 'Step 3: Reassigning age: the memory cell value updates from 20 to 21.',
    variables: [
      { name: 'name', value: '"John"', type: 'str', isNew: false },
      { name: 'age', value: '21', type: 'int', isUpdated: true },
    ],
    output: '',
  },
  {
    stepNum: 3,
    codeLine: 'print(f"{name} is {age}")',
    explanation: 'Step 4: The values from both memory boxes are formatted and sent to standard output.',
    variables: [
      { name: 'name', value: '"John"', type: 'str', isNew: false },
      { name: 'age', value: '21', type: 'int', isNew: false },
    ],
    output: 'John is 21',
  },
];

const VariableAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const activeData = STEPS[currentStep];

  return (
    <AnimationPlayerWrapper
      title="Variable Allocation & Memory Box Visualization"
      subtitle="Watch Python allocate names, store data types, and update values in memory."
      currentStep={currentStep}
      totalSteps={STEPS.length}
      isPlaying={isPlaying}
      playbackSpeed={speed}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onNext={() => setCurrentStep((p) => Math.min(p + 1, STEPS.length - 1))}
      onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
      onRestart={() => { setCurrentStep(0); setIsPlaying(false); }}
      onSpeedChange={(s) => setSpeed(s)}
    >
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left: Code Box & Explanation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            backgroundColor: '#030712',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem'
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '8px' }}># Python Source Code</div>
            {['name = "John"', 'age = 20', 'age = 21', 'print(f"{name} is {age}")'].map((line, idx) => (
              <div
                key={idx}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: currentStep === idx ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                  borderLeft: currentStep === idx ? '3px solid #818cf8' : '3px solid transparent',
                  color: currentStep === idx ? '#ffffff' : '#94a3b8',
                  transition: 'all 0.2s ease'
                }}
              >
                {line}
              </div>
            ))}
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <p style={{ fontSize: '0.85rem', color: '#c7d2fe', lineHeight: 1.5 }}>
              {activeData.explanation}
            </p>
          </div>
        </div>

        {/* Right: Simulated RAM Memory Boxes & Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
            <Database size={16} /> SYSTEM MEMORY (RAM ALLOCATION)
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {activeData.variables.map((v) => (
              <div
                key={v.name}
                style={{
                  minWidth: '130px',
                  backgroundColor: '#111827',
                  border: v.isUpdated ? '2px solid #f59e0b' : v.isNew ? '2px solid #10b981' : '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '12px',
                  boxShadow: v.isUpdated ? '0 0 15px rgba(245, 158, 11, 0.3)' : v.isNew ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  VARIABLE NAME
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  {v.name}
                </div>
                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '6px 0' }} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VALUE ({v.type})</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {v.value}
                </div>
              </div>
            ))}
          </div>

          {/* Console Output */}
          <div style={{
            backgroundColor: '#030712',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem'
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '4px' }}>CONSOLE STDOUT</div>
            <div style={{ color: '#34d399' }}>
              {activeData.output ? `> ${activeData.output}` : <span style={{ color: 'var(--text-muted)' }}>(No output yet)</span>}
            </div>
          </div>
        </div>
      </div>
    </AnimationPlayerWrapper>
  );
};

export default VariableAnimation;
