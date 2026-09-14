import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Box, ArrowDown, Plus, Sparkles } from 'lucide-react';

const VariableFactory = ({ level, speed, setSpeed, setGameAction, setHighlightLine, recordMistake, onComplete, sounds }) => {
  const init = level.initial_state || {};
  const initialRegisters = init.registers || { score: 0 };
  const addAmount = init.add_amount || 5;
  const targetScore = level.solution_criteria?.score || 15;

  const [registers, setRegisters] = useState(initialRegisters);
  const [selectedOp, setSelectedOp] = useState('ADD_5');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    resetFactory();
  }, [level]);

  const resetFactory = () => {
    setRegisters(initialRegisters);
    setSelectedOp('ADD_5');
    setIsRunning(false);
    setGameAction('Select variable assignment expression to update score register.');
    setHighlightLine(1);
  };

  const runOperation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    sounds.playStep();

    setHighlightLine(2);
    setGameAction(`Evaluating expression: score = score + ${addAmount}`);

    const delay = speed === 4 ? 200 : speed === 2 ? 400 : 800;
    await new Promise(r => setTimeout(r, delay));

    let newScore = registers.score;
    if (selectedOp === 'ADD_5') {
      newScore = registers.score + addAmount;
    } else if (selectedOp === 'SET_10') {
      newScore = 10;
    } else if (selectedOp === 'SUB_5') {
      newScore = Math.max(0, registers.score - addAmount);
    }

    setRegisters({ ...registers, score: newScore });
    sounds.playCoin();

    await new Promise(r => setTimeout(r, delay));
    setIsRunning(false);

    if (newScore === targetScore) {
      setGameAction(`Success! Register score holds target value ${targetScore}.`);
      onComplete({ steps_executed: 1, optimal_steps: 1 });
    } else {
      recordMistake(`Expected score ${targetScore}, but register ended with ${newScore}.`);
      setGameAction('Incorrect mutation! Choose the correct assignment operation.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Factory Conveyor & Memory Slot */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
          MEMORY REGISTER STORAGE
        </div>

        {/* Visual Memory Box */}
        <div style={{
          width: '180px',
          height: '140px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.15))',
          border: '2px solid #818cf8',
          borderRadius: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 25px rgba(99, 102, 241, 0.3)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            background: '#818cf8',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '2px 10px',
            borderRadius: '999px'
          }}>
            VARIABLE: score
          </div>
          <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>
            {registers.score}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#c7d2fe', fontWeight: 600 }}>
            Type: Integer (int)
          </span>
        </div>
      </div>

      {/* Operation Selection Palette */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        padding: '1.5rem',
        borderRadius: '10px',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ color: '#c084fc', fontWeight: 700, fontSize: '0.9rem' }}>
          Select Variable Assignment Operation:
        </div>

        {[
          { id: 'ADD_5', label: 'score = score + 5 (or score += 5)', desc: 'Reads current value (10) and adds 5 -> stores 15.' },
          { id: 'SET_10', label: 'score = 10', desc: 'Overwrites variable directly with literal 10.' },
          { id: 'SUB_5', label: 'score = score - 5', desc: 'Decrements variable by 5.' }
        ].map((opt) => (
          <label
            key={opt.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '10px 14px',
              borderRadius: '8px',
              background: selectedOp === opt.id ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedOp === opt.id ? '1px solid #a855f7' : '1px solid var(--border-color)',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontFamily: 'monospace', color: '#ffffff' }}>
              <input
                type="radio"
                name="var_op"
                checked={selectedOp === opt.id}
                onChange={() => { setSelectedOp(opt.id); sounds.playClick(); }}
                disabled={isRunning}
              />
              {opt.label}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '22px' }}>
              {opt.desc}
            </span>
          </label>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={resetFactory} disabled={isRunning} className="btn-secondary" style={{ padding: '10px 18px' }}>
          <RotateCcw size={16} /> Reset
        </button>
        <button onClick={runOperation} disabled={isRunning} className="btn-primary" style={{ padding: '10px 24px' }}>
          <Play size={16} /> {isRunning ? 'Updating...' : 'EXECUTE ASSIGNMENT ▶'}
        </button>
      </div>
    </div>
  );
};

export default VariableFactory;
