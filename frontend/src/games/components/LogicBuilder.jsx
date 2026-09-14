import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Cpu, Lock, Unlock, Zap } from 'lucide-react';

const LogicBuilder = ({ level, speed, setSpeed, setGameAction, setHighlightLine, recordMistake, onComplete, sounds }) => {
  const init = level.initial_state || {};
  const [inputA, setInputA] = useState(init.inputs?.A ?? true);
  const [inputB, setInputB] = useState(init.inputs?.B ?? true);
  const [selectedGate, setSelectedGate] = useState('AND');
  const [doorUnlocked, setDoorUnlocked] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    resetLogic();
  }, [level]);

  const resetLogic = () => {
    setInputA(init.inputs?.A ?? true);
    setInputB(init.inputs?.B ?? true);
    setSelectedGate('AND');
    setDoorUnlocked(false);
    setIsEvaluating(false);
    setGameAction('Configure boolean inputs and logic gate to unlock the door.');
    setHighlightLine(1);
  };

  const evaluateCircuit = async () => {
    if (isEvaluating) return;
    setIsEvaluating(true);
    sounds.playStep();

    let output = false;
    if (selectedGate === 'AND') output = inputA && inputB;
    else if (selectedGate === 'OR') output = inputA || inputB;
    else if (selectedGate === 'NOT_A') output = !inputA;
    else if (selectedGate === 'XOR') output = Boolean(inputA !== inputB);

    setHighlightLine(3);
    setGameAction(`Evaluating ${inputA} ${selectedGate} ${inputB} -> Output is ${output}`);

    const delay = speed === 4 ? 150 : speed === 2 ? 300 : 600;
    await new Promise(r => setTimeout(r, delay));

    setDoorUnlocked(output);
    setIsEvaluating(false);

    if (output === true) {
      sounds.playCorrect();
      setGameAction('Circuit closed! Output is TRUE (1). Door unlocked.');
      onComplete({ steps_executed: 1, optimal_steps: 1 });
    } else {
      sounds.playError();
      recordMistake('Circuit output evaluated to FALSE (0). Door remains locked.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Interactive Circuit Board */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '2rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Inputs A & B Switches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => { setInputA(!inputA); sounds.playClick(); }}
            disabled={isEvaluating}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: inputA ? '2px solid #10b981' : '2px solid #ef4444',
              background: inputA ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            INPUT A: {inputA ? 'TRUE (1)' : 'FALSE (0)'}
          </button>

          <button
            onClick={() => { setInputB(!inputB); sounds.playClick(); }}
            disabled={isEvaluating}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: inputB ? '2px solid #10b981' : '2px solid #ef4444',
              background: inputB ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            INPUT B: {inputB ? 'TRUE (1)' : 'FALSE (0)'}
          </button>
        </div>

        {/* Logic Gate IC Chip */}
        <div style={{
          padding: '16px 22px',
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(99, 102, 241, 0.2))',
          border: '2px solid #0ea5e9',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <Cpu size={24} color="#38bdf8" />
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace', marginTop: '4px' }}>
            {selectedGate} GATE
          </div>
        </div>

        {/* Door Lock Output Indicator */}
        <div style={{
          padding: '16px 20px',
          background: doorUnlocked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.15)',
          border: doorUnlocked ? '2px solid #10b981' : '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          {doorUnlocked ? <Unlock size={28} color="#34d399" /> : <Lock size={28} color="#f87171" />}
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: doorUnlocked ? '#34d399' : '#f87171', marginTop: '4px' }}>
            {doorUnlocked ? 'DOOR OPEN' : 'LOCKED'}
          </div>
        </div>
      </div>

      {/* Logic Gate Selection */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        padding: '1.2rem 1.5rem',
        borderRadius: '10px',
        border: '1px solid rgba(14, 165, 233, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>SELECT GATE:</span>
          {['AND', 'OR', 'XOR', 'NOT_A'].map((gate) => (
            <button
              key={gate}
              onClick={() => { setSelectedGate(gate); sounds.playClick(); }}
              disabled={isEvaluating}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: selectedGate === gate ? '2px solid #0ea5e9' : '1px solid var(--border-color)',
                background: selectedGate === gate ? 'rgba(14, 165, 233, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                color: selectedGate === gate ? '#38bdf8' : '#ffffff',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {gate}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={resetLogic} disabled={isEvaluating} className="btn-secondary" style={{ padding: '8px 14px' }}>
            <RotateCcw size={16} /> Reset
          </button>
          <button onClick={evaluateCircuit} disabled={isEvaluating} className="btn-primary" style={{ padding: '8px 20px' }}>
            <Zap size={16} /> {isEvaluating ? 'Evaluating...' : 'TEST CIRCUIT ▶'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogicBuilder;
