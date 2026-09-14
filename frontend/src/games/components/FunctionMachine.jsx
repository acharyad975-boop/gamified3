import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

const FunctionMachine = ({ level, speed, setSpeed, setGameAction, setHighlightLine, recordMistake, onComplete, sounds }) => {
  const init = level.initial_state || {};
  const testCases = init.test_cases || [[5, 10], [7, 3], [12, 4]];
  const expectedOutputs = level.solution_criteria?.expected_outputs || [50, 21, 48];

  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [completedTests, setCompletedTests] = useState([]);
  const [selectedFuncBody, setSelectedFuncBody] = useState('MULT');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    resetMachine();
  }, [level]);

  const resetMachine = () => {
    setCurrentTestIndex(0);
    setCompletedTests([]);
    setSelectedFuncBody('MULT');
    setIsRunning(false);
    setGameAction('Configure function return logic and pass test arguments.');
    setHighlightLine(1);
  };

  const runAllTests = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCompletedTests([]);
    sounds.playStep();

    let passed = [];
    let hadFailure = false;

    for (let i = 0; i < testCases.length; i++) {
      setCurrentTestIndex(i);
      const [w, h] = testCases[i];
      setHighlightLine(2);
      setGameAction(`Calling calculate_area(${w}, ${h})...`);

      const delay = speed === 4 ? 200 : speed === 2 ? 400 : 700;
      await new Promise(r => setTimeout(r, delay));

      let result = 0;
      if (selectedFuncBody === 'MULT') result = w * h;
      else if (selectedFuncBody === 'ADD') result = w + h;
      else if (selectedFuncBody === 'PERIMETER') result = 2 * (w + h);

      if (result === expectedOutputs[i]) {
        passed.push({ input: [w, h], output: result, success: true });
        setCompletedTests([...passed]);
        sounds.playCoin();
      } else {
        recordMistake(`Expected return ${expectedOutputs[i]}, but function returned ${result}.`);
        passed.push({ input: [w, h], output: result, success: false });
        setCompletedTests([...passed]);
        hadFailure = true;
        break;
      }
    }

    setIsRunning(false);

    if (!hadFailure && passed.length === testCases.length) {
      setGameAction('All test argument assertions passed! Function verified.');
      onComplete({ steps_executed: testCases.length, optimal_steps: testCases.length });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Function Processor Chamber */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Input Parameters Slot */}
        <div style={{
          padding: '12px 16px',
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>INPUT ARGUMENTS</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c7d2fe', fontFamily: 'monospace' }}>
            w={testCases[currentTestIndex]?.[0]}, h={testCases[currentTestIndex]?.[1]}
          </div>
        </div>

        <ArrowRight size={20} color="#818cf8" />

        {/* Function Chamber Machine */}
        <div style={{
          padding: '14px 20px',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2))',
          border: '2px solid #ec4899',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#f472b6' }}>
            <Cpu size={14} /> FUNCTION CHAMBER
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace', marginTop: '4px' }}>
            def calculate_area(w, h):
          </div>
        </div>

        <ArrowRight size={20} color="#ec4899" />

        {/* Output Return Slot */}
        <div style={{
          padding: '12px 16px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>RETURN OUTPUT</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>
            {completedTests[currentTestIndex]?.output ?? '...'}
          </div>
        </div>
      </div>

      {/* Function Body Selection */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        padding: '1.5rem',
        borderRadius: '10px',
        border: '1px solid rgba(236, 72, 153, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ color: '#f472b6', fontWeight: 700, fontSize: '0.9rem' }}>
          Select Internal Return Algorithm:
        </div>

        {[
          { id: 'MULT', label: 'return width * height', desc: 'Computes area by multiplying width by height.' },
          { id: 'ADD', label: 'return width + height', desc: 'Incorrect: adds dimensions instead of multiplying.' },
          { id: 'PERIMETER', label: 'return 2 * (width + height)', desc: 'Computes boundary perimeter, not area.' }
        ].map((opt) => (
          <label
            key={opt.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '10px 14px',
              borderRadius: '8px',
              background: selectedFuncBody === opt.id ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedFuncBody === opt.id ? '1px solid #ec4899' : '1px solid var(--border-color)',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontFamily: 'monospace', color: '#ffffff' }}>
              <input
                type="radio"
                name="func_body"
                checked={selectedFuncBody === opt.id}
                onChange={() => { setSelectedFuncBody(opt.id); sounds.playClick(); }}
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

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={resetMachine} disabled={isRunning} className="btn-secondary" style={{ padding: '10px 18px' }}>
          <RotateCcw size={16} /> Reset
        </button>
        <button onClick={runAllTests} disabled={isRunning} className="btn-primary" style={{ padding: '10px 24px' }}>
          <Play size={16} /> {isRunning ? 'Testing...' : 'EXECUTE ALL TESTS ▶'}
        </button>
      </div>
    </div>
  );
};

export default FunctionMachine;
