import React, { useState, useEffect } from 'react';
import AnimationPlayerWrapper from './AnimationPlayerWrapper';
import { RefreshCw, Code2, Cpu } from 'lucide-react';

const REACT_STEPS = [
  {
    step: 0,
    stateVal: 0,
    action: 'Initial Render',
    vDomDiff: 'None',
    uiText: 'Count: 0',
    explanation: 'Step 1: Component mounts. useState(0) initializes state variable count = 0. Virtual DOM snapshot 1 created.',
  },
  {
    step: 1,
    stateVal: 1,
    action: 'onClick -> setCount(1)',
    vDomDiff: 'count 0 -> 1',
    uiText: 'Count: 0',
    explanation: 'Step 2: User clicks button. setCount(1) schedules a state update. React triggers re-render pass.',
  },
  {
    step: 2,
    stateVal: 1,
    action: 'Virtual DOM Diffing',
    vDomDiff: '<p>Count: 1</p>',
    uiText: 'Count: 0',
    explanation: 'Step 3: React executes component function, builds new Virtual DOM tree, and diffs against prior tree.',
  },
  {
    step: 3,
    stateVal: 1,
    action: 'Reconciliation & Real DOM Patch',
    vDomDiff: 'Patched',
    uiText: 'Count: 1',
    explanation: 'Step 4: Reconciliation! React commits the minimal DOM patch. The real browser DOM node text updates to "Count: 1".',
  },
];

const ReactStateAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= REACT_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1900 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const activeData = REACT_STEPS[currentStep];

  return (
    <AnimationPlayerWrapper
      title="React State Lifecycle & Virtual DOM Diffing"
      subtitle="Visualizing useState trigger, Virtual DOM comparison, and Real DOM patch."
      currentStep={currentStep}
      totalSteps={REACT_STEPS.length}
      isPlaying={isPlaying}
      playbackSpeed={speed}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onNext={() => setCurrentStep((p) => Math.min(p + 1, REACT_STEPS.length - 1))}
      onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
      onRestart={() => { setCurrentStep(0); setIsPlaying(false); }}
      onSpeedChange={(s) => setSpeed(s)}
    >
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center' }}>
        {/* Left: Component Code & State Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            backgroundColor: '#030712',
            padding: '1.2rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem'
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '6px' }}>CounterComponent.jsx</div>
            <div style={{ color: '#818cf8' }}>const [count, setCount] = useState({activeData.stateVal});</div>
            <div style={{ color: '#94a3b8', margin: '6px 0' }}>return (</div>
            <div style={{ color: currentStep === 3 ? '#34d399' : '#e2e8f0', paddingLeft: '16px' }}>
              &lt;p&gt;{activeData.uiText}&lt;/p&gt;
            </div>
            <div style={{ color: '#e2e8f0', paddingLeft: '16px' }}>
              &lt;button onClick=&#123;() =&gt; setCount(count + 1)&#125;&gt;+1&lt;/button&gt;
            </div>
            <div style={{ color: '#94a3b8' }}>);</div>
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <p style={{ fontSize: '0.85rem', color: '#c7d2fe', lineHeight: 1.5 }}>
              {activeData.explanation}
            </p>
          </div>
        </div>

        {/* Right: Virtual DOM Diffing vs Real Browser DOM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Virtual DOM representation */}
          <div style={{
            padding: '14px',
            backgroundColor: '#111827',
            border: currentStep === 2 ? '2px solid #a855f7' : '1px solid var(--border-color)',
            borderRadius: '10px',
            boxShadow: currentStep === 2 ? '0 0 15px rgba(168, 85, 247, 0.35)' : 'none'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
              VIRTUAL DOM TREE (IN-MEMORY)
            </div>
            <div style={{ fontSize: '0.9rem', color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
              Diff Status: <span style={{ fontWeight: 800, color: '#ffffff' }}>{activeData.vDomDiff}</span>
            </div>
          </div>

          {/* Real Browser DOM */}
          <div style={{
            padding: '14px',
            backgroundColor: '#0f172a',
            border: currentStep === 3 ? '2px solid #10b981' : '1px solid var(--border-color)',
            borderRadius: '10px',
            boxShadow: currentStep === 3 ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
              REAL BROWSER DOM RENDERED UI
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: '#030712',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: currentStep === 3 ? '#34d399' : '#ffffff' }}>
                {activeData.uiText}
              </span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                padding: '4px 10px',
                borderRadius: '6px'
              }}>
                +1 Click
              </span>
            </div>
          </div>
        </div>
      </div>
    </AnimationPlayerWrapper>
  );
};

export default ReactStateAnimation;
