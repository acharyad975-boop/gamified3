import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Cpu, Terminal, Sparkles, Layers } from 'lucide-react';

const CODE_STEPS = [
  {
    line: 1,
    code: 'x = 10',
    description: 'Allocated integer object 10 in RAM and bound variable identifier "x".',
    memory: { x: 10 },
    stdout: ''
  },
  {
    line: 2,
    code: 'y = 20',
    description: 'Allocated integer object 20 in RAM and bound variable identifier "y".',
    memory: { x: 10, y: 20 },
    stdout: ''
  },
  {
    line: 3,
    code: 'result = x + y',
    description: 'Evaluated arithmetic expression 10 + 20 = 30 and assigned to "result".',
    memory: { x: 10, y: 20, result: 30 },
    stdout: ''
  },
  {
    line: 4,
    code: 'print(f"Computed total: {result}")',
    description: 'Formatted string with value 30 and flushed output to stdout buffer.',
    memory: { x: 10, y: 20, result: 30 },
    stdout: 'Computed total: 30'
  }
];

const CodeExecutionVisualizer = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [speed, setSpeed] = useState(1);

  const step = CODE_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex + 1 < CODE_STEPS.length) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="xp-badge">INTERACTIVE VISUAL EXECUTION</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
              LINE-BY-LINE RAM MEMORY TRACER
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
            Step-by-Step Code Execution Visualizer
          </h2>
        </div>

        {/* Playback Controls */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={handleReset} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={handlePrev} disabled={currentStepIndex === 0} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            <ChevronLeft size={14} /> Prev Step
          </button>
          <button onClick={handleNext} disabled={currentStepIndex === CODE_STEPS.length - 1} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            Next Step <ChevronRight size={14} />
          </button>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
            Step {currentStepIndex + 1} of {CODE_STEPS.length}
          </span>
        </div>
      </div>

      {/* Main Grid: Code vs Memory Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
        {/* Left: Code Listing with Line Highlighter */}
        <div style={{ backgroundColor: '#090d16', borderRadius: '10px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', backgroundColor: '#0f172a', borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            execution_tracer.py
          </div>
          <div style={{ padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CODE_STEPS.map((s, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    backgroundColor: isActive ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                    borderLeft: isActive ? '3px solid #818cf8' : '3px solid transparent',
                    color: isActive ? '#ffffff' : isPast ? '#94a3b8' : '#475569',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', width: '20px', fontSize: '0.8rem' }}>{s.line}</span>
                  <span style={{ fontWeight: isActive ? 700 : 400 }}>{s.code}</span>
                  {isActive && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#818cf8', fontWeight: 700 }}>
                      ◀ EXECUTING
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Step Explanation Box */}
          <div style={{ padding: '12px 16px', backgroundColor: 'rgba(99, 102, 241, 0.08)', borderTop: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.85rem', color: '#c7d2fe', lineHeight: 1.5 }}>
            💡 <b>Step {step.line}:</b> {step.description}
          </div>
        </div>

        {/* Right: RAM Memory State & Stdout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* RAM Memory State */}
          <div style={{ backgroundColor: '#090d16', padding: '1.2rem', borderRadius: '10px', border: '1px solid var(--border-color)', flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={14} color="#34d399" /> RAM HEAP & VARIABLE BINDINGS
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {Object.entries(step.memory).map(([varName, varVal], idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid #818cf8',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    textAlign: 'center',
                    minWidth: '100px',
                    animation: 'pulse 0.4s ease-out'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase' }}>
                    {varName}
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
                    {varVal}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Console Output */}
          <div style={{ backgroundColor: '#030712', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={14} color="#38bdf8" /> STDOUT CONSOLE
            </div>
            <pre style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', margin: 0, minHeight: '32px' }}>
              {step.stdout ? `> ${step.stdout}` : '> (No output flushed yet)'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeExecutionVisualizer;
