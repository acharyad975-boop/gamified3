import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Layers, ArrowRight, ArrowDown } from 'lucide-react';

const DataStructureWorld = ({ level, speed, setSpeed, setGameAction, setHighlightLine, recordMistake, onComplete, sounds }) => {
  const [stack, setStack] = useState(['A', 'B', 'C']);
  const [poppedItems, setPoppedItems] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    resetDS();
  }, [level]);

  const resetDS = () => {
    setStack(['A', 'B', 'C']);
    setPoppedItems([]);
    setIsExecuting(false);
    setGameAction('Stack LIFO demo: Top element (C) will pop first.');
    setHighlightLine(1);
  };

  const handlePop = () => {
    if (stack.length === 0) return;
    sounds.playCoin();
    const item = stack[stack.length - 1];
    const newStack = stack.slice(0, stack.length - 1);
    const newPopped = [...poppedItems, item];

    setStack(newStack);
    setPoppedItems(newPopped);
    setGameAction(`Popped "${item}" from top of stack. Remaining stack size: ${newStack.length}`);

    if (newStack.length === 0) {
      sounds.playCorrect();
      setGameAction('All items popped in LIFO order (C -> B -> A)! Level Complete.');
      onComplete({ steps_executed: 3, optimal_steps: 3 });
    }
  };

  const handlePush = (val) => {
    if (stack.length >= 5) return;
    sounds.playClick();
    setStack([...stack, val]);
    setGameAction(`Pushed "${val}" onto stack.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Physical Stack Container */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '2rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Stack Physical Bin */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>
            STACK (LAST-IN, FIRST-OUT)
          </span>

          <div style={{
            width: '160px',
            minHeight: '160px',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: '6px',
            background: 'rgba(15, 23, 42, 0.5)'
          }}>
            {stack.length === 0 ? (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 'auto' }}>[Empty Stack]</span>
            ) : (
              stack.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px',
                    background: idx === stack.length - 1 ? 'linear-gradient(135deg, #059669, #10b981)' : 'rgba(16, 185, 129, 0.2)',
                    border: idx === stack.length - 1 ? '2px solid #34d399' : '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontWeight: 800,
                    textAlign: 'center',
                    fontSize: '0.95rem'
                  }}
                >
                  TRAY {item} {idx === stack.length - 1 ? '(TOP)' : ''}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Popped Output Tray */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24' }}>
            POPPED SEQUENCE (LIFO ORDER)
          </span>

          <div style={{ display: 'flex', gap: '8px', minHeight: '42px', alignItems: 'center' }}>
            {poppedItems.length === 0 ? (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click "POP TOP ELEMENT" to remove trays.</span>
            ) : (
              poppedItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.25)',
                    border: '1px solid #f59e0b',
                    color: '#fbbf24',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem'
                  }}
                >
                  {item}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => handlePush(String.fromCharCode(65 + stack.length))} disabled={stack.length >= 5} className="btn-secondary" style={{ padding: '8px 14px' }}>
            PUSH ELEMENT
          </button>
          <button onClick={handlePop} disabled={stack.length === 0} className="btn-primary" style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #059669, #10b981)' }}>
            POP TOP ELEMENT (LIFO) ▶
          </button>
        </div>

        <button onClick={resetDS} className="btn-secondary" style={{ padding: '8px 14px' }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>
    </div>
  );
};

export default DataStructureWorld;
