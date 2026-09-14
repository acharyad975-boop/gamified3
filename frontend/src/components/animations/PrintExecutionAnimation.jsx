import React, { useState, useEffect } from 'react';
import AnimationPlayerWrapper from './AnimationPlayerWrapper';
import { Terminal, Cpu, ArrowRight } from 'lucide-react';

const PRINT_STEPS = [
  {
    step: 0,
    codeLine: 'print("Hello")',
    interpreterState: 'Reading Source Code',
    activeHighlight: 'source',
    output: '',
    explanation: 'Step 1: The Python interpreter parses the source line print("Hello") into abstract syntax tokens.',
  },
  {
    step: 1,
    codeLine: 'print("Hello")',
    interpreterState: 'Evaluating Built-in print() Function',
    activeHighlight: 'function',
    output: '',
    explanation: 'Step 2: Python resolves the built-in print function and prepares string argument "Hello".',
  },
  {
    step: 2,
    codeLine: 'print("Hello")',
    interpreterState: 'Flushing to STDOUT Stream',
    activeHighlight: 'stream',
    output: 'Hello',
    explanation: 'Step 3: The string "Hello" is written to the standard output buffer and displayed on the console screen.',
  },
];

const PrintExecutionAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= PRINT_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1900 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const activeData = PRINT_STEPS[currentStep];

  return (
    <AnimationPlayerWrapper
      title="Python Interpreter Execution: print('Hello')"
      subtitle="Watch Python read code, invoke the built-in function, and pipe output to the console."
      currentStep={currentStep}
      totalSteps={PRINT_STEPS.length}
      isPlaying={isPlaying}
      playbackSpeed={speed}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onNext={() => setCurrentStep((p) => Math.min(p + 1, PRINT_STEPS.length - 1))}
      onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
      onRestart={() => { setCurrentStep(0); setIsPlaying(false); }}
      onSpeedChange={(s) => setSpeed(s)}
    >
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', alignItems: 'center' }}>
        {/* Left: Code Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            backgroundColor: '#030712',
            padding: '1.2rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem'
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '8px' }}># hello.py</div>
            <div style={{
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: 'rgba(99, 102, 241, 0.25)',
              borderLeft: '4px solid #818cf8',
              color: '#ffffff'
            }}>
              <span style={{ color: '#c084fc' }}>print</span>(<span style={{ color: '#34d399' }}>"Hello"</span>)
            </div>
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <p style={{ fontSize: '0.85rem', color: '#c7d2fe', lineHeight: 1.5 }}>
              {activeData.explanation}
            </p>
          </div>
        </div>

        {/* Right: Interpreter Flow Pipeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Interpreter CPU Engine */}
          <div style={{
            padding: '14px',
            backgroundColor: '#111827',
            border: '2px solid #818cf8',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)'
          }}>
            <Cpu size={24} color="#818cf8" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PYTHON RUNTIME INTERPRETER</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8' }}>
                {activeData.interpreterState}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>↓</div>

          {/* Console Output Screen */}
          <div style={{
            backgroundColor: '#030712',
            padding: '14px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <Terminal size={14} /> STANDARD OUTPUT (STDOUT)
            </div>
            <div style={{ color: '#34d399', fontWeight: 700, minHeight: '24px' }}>
              {activeData.output ? `> ${activeData.output}` : <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Waiting for stream output...)</span>}
            </div>
          </div>
        </div>
      </div>
    </AnimationPlayerWrapper>
  );
};

export default PrintExecutionAnimation;
