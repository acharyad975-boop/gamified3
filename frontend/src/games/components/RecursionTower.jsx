import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Layers, ArrowUp, ArrowDown } from 'lucide-react';

const RecursionTower = ({ level, speed, setSpeed, setGameAction, setHighlightLine, recordMistake, onComplete, sounds }) => {
  const init = level.initial_state || {};
  const n = init.n || 4;
  const targetReturn = level.solution_criteria?.final_return || 24;

  const [callStack, setCallStack] = useState([]);
  const [phase, setPhase] = useState('IDLE'); // 'WINDING', 'BASE_CASE', 'UNWINDING', 'DONE'
  const [currentVal, setCurrentVal] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    resetTower();
  }, [level]);

  const resetTower = () => {
    setCallStack([]);
    setPhase('IDLE');
    setCurrentVal(1);
    setIsRunning(false);
    setGameAction(`Watch factorial(${n}) push stack frames until base case, then unwind.`);
    setHighlightLine(1);
  };

  const runRecursion = async () => {
    if (isRunning) return;
    setIsRunning(true);
    sounds.playStep();

    // 1. Recursive Winding (Push frames onto Call Stack)
    setPhase('WINDING');
    let stack = [];
    for (let k = n; k >= 1; k--) {
      setHighlightLine(4);
      setGameAction(`Pushing call stack frame: factorial(${k}) -> ${k} * factorial(${k - 1})`);
      stack = [...stack, { val: k, text: `factorial(${k})` }];
      setCallStack([...stack]);
      sounds.playStep();

      const delay = speed === 4 ? 150 : speed === 2 ? 300 : 600;
      await new Promise(r => setTimeout(r, delay));
    }

    // 2. Base Case Reached
    setPhase('BASE_CASE');
    setHighlightLine(2);
    setGameAction('Base case reached: factorial(1) returns 1.');
    sounds.playCoin();
    await new Promise(r => setTimeout(r, speed === 4 ? 200 : speed === 2 ? 400 : 700));

    // 3. Recursive Unwinding (Pop frames and multiply return values)
    setPhase('UNWINDING');
    let accumulated = 1;
    while (stack.length > 0) {
      const topFrame = stack[stack.length - 1];
      stack = stack.slice(0, stack.length - 1);
      setCallStack([...stack]);

      accumulated *= topFrame.val;
      setCurrentVal(accumulated);
      setHighlightLine(4);
      setGameAction(`Popping stack frame: returning ${topFrame.val} * previous = ${accumulated}`);
      sounds.playCoin();

      const delay = speed === 4 ? 150 : speed === 2 ? 300 : 600;
      await new Promise(r => setTimeout(r, delay));
    }

    setPhase('DONE');
    setIsRunning(false);

    if (accumulated === targetReturn) {
      setGameAction(`Recursion Complete! Final calculated result is ${accumulated}.`);
      onComplete({ steps_executed: n * 2, optimal_steps: n * 2 });
    } else {
      recordMistake('Recursion unwinding failed to calculate expected value.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Visual Call Stack Tower */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '2rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c084fc' }}>
            CALL STACK TOWER (Current Value = {currentVal})
          </span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '999px',
            background: phase === 'WINDING' ? 'rgba(99, 102, 241, 0.2)' : phase === 'BASE_CASE' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: phase === 'WINDING' ? '#818cf8' : phase === 'BASE_CASE' ? '#fbbf24' : '#34d399'
          }}>
            PHASE: {phase}
          </span>
        </div>

        {/* Stack Container */}
        <div style={{
          width: '240px',
          minHeight: '180px',
          border: '2px solid rgba(168, 85, 247, 0.4)',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.5)'
        }}>
          {callStack.length === 0 ? (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', margin: 'auto' }}>
              [Call Stack Empty]
            </span>
          ) : (
            callStack.map((frame, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 12px',
                  background: 'linear-gradient(135deg, #9333ea, #a855f7)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(147, 51, 234, 0.3)'
                }}
              >
                {frame.text}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={resetTower} disabled={isRunning} className="btn-secondary" style={{ padding: '10px 18px' }}>
          <RotateCcw size={16} /> Reset
        </button>
        <button onClick={runRecursion} disabled={isRunning} className="btn-primary" style={{ padding: '10px 24px' }}>
          <Play size={16} /> {isRunning ? 'Stacking...' : 'EXECUTE RECURSION ▶'}
        </button>
      </div>
    </div>
  );
};

export default RecursionTower;
