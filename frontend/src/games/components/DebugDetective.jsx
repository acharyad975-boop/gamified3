import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Bug, Search, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

const DebugDetective = ({ level, speed, setSpeed, setGameAction, setHighlightLine, recordMistake, onComplete, sounds }) => {
  const init = level.initial_state || {};
  const buggyCode = init.buggy_code || 'for i in range(5)\n    print(i)';
  const options = init.options || [
    { id: 'A', text: 'Missing colon (:) at the end of line 1', correct: true },
    { id: 'B', text: 'Wrong variable name (i)', correct: false },
    { id: 'C', text: 'print should be uppercase', correct: false }
  ];

  const [selectedOption, setSelectedOption] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);

  useEffect(() => {
    resetDetective();
  }, [level]);

  const resetDetective = () => {
    setSelectedOption(null);
    setAnalyzed(false);
    setGameAction('Inspect the crime scene code and identify the bug.');
    setHighlightLine(1);
  };

  const submitDiagnosis = () => {
    if (!selectedOption) return;
    setAnalyzed(true);

    const chosen = options.find(o => o.id === selectedOption);
    if (chosen && chosen.correct) {
      sounds.playCorrect();
      setGameAction(`Case solved! ${chosen.text}`);
      onComplete({ steps_executed: 1, optimal_steps: 1 });
    } else {
      sounds.playError();
      recordMistake(`Incorrect diagnosis! Option ${selectedOption} is not the root cause.`);
      setGameAction('Look closely at syntax and loop headers.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Crime Scene Buggy Code Window */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 700, fontSize: '0.85rem' }}>
          <Bug size={16} /> CRIME SCENE: BUGGY CODE SNIPPET
        </div>

        <pre style={{
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '14px 18px',
          borderRadius: '8px',
          color: '#f87171',
          fontFamily: 'monospace',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          margin: 0,
          border: '1px dashed rgba(239, 68, 68, 0.4)'
        }}>
          {buggyCode}
        </pre>
      </div>

      {/* Detective Suspect Diagnosis Options */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        padding: '1.5rem',
        borderRadius: '10px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={16} color="#818cf8" /> 🔎 Detective Diagnosis: What is causing the bug?
        </div>

        {options.map((opt) => (
          <label
            key={opt.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: selectedOption === opt.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedOption === opt.id ? '1px solid #818cf8' : '1px solid var(--border-color)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: selectedOption === opt.id ? 700 : 400
            }}
          >
            <input
              type="radio"
              name="detective_opt"
              checked={selectedOption === opt.id}
              onChange={() => { setSelectedOption(opt.id); sounds.playClick(); }}
              disabled={analyzed && opt.correct}
            />
            <span style={{ color: '#818cf8', fontWeight: 800 }}>[{opt.id}]</span>
            <span style={{ color: '#ffffff' }}>{opt.text}</span>
          </label>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={resetDetective} className="btn-secondary" style={{ padding: '10px 18px' }}>
          <RotateCcw size={16} /> Reset
        </button>
        <button onClick={submitDiagnosis} disabled={!selectedOption} className="btn-primary" style={{ padding: '10px 24px' }}>
          <CheckCircle2 size={16} /> SUBMIT DIAGNOSIS ▶
        </button>
      </div>
    </div>
  );
};

export default DebugDetective;
