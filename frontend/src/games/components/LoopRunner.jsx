import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Repeat, Zap, Award } from 'lucide-react';

const LoopRunner = ({ level, speed, setSpeed, setGameAction, setHighlightLine, recordMistake, onComplete, sounds }) => {
  const init = level.initial_state || {};
  const totalCoins = init.coins || 5;
  const targetIterations = level.solution_criteria?.loop_count || totalCoins;

  const [repeatCount, setRepeatCount] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [collectedCoins, setCollectedCoins] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeIteration, setActiveIteration] = useState(-1);

  useEffect(() => {
    resetState();
  }, [level]);

  const resetState = () => {
    setRepeatCount(1);
    setCurrentStep(0);
    setCollectedCoins(0);
    setIsRunning(false);
    setActiveIteration(-1);
    setGameAction('Set loop repeat count to collect all coins.');
    setHighlightLine(1);
  };

  const runLoop = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep(0);
    setCollectedCoins(0);
    sounds.playStep();

    let coins = 0;
    for (let i = 0; i < repeatCount; i++) {
      setActiveIteration(i);
      setCurrentStep(i + 1);
      setHighlightLine(2);
      setGameAction(`Loop iteration i = ${i} (Step ${i + 1} of ${repeatCount})`);
      sounds.playStep();

      if (i < totalCoins) {
        coins += 1;
        setCollectedCoins(coins);
        sounds.playCoin();
      }

      const delay = speed === 4 ? 150 : speed === 2 ? 300 : 600;
      await new Promise(r => setTimeout(r, delay));
    }

    setIsRunning(false);
    setActiveIteration(-1);

    if (coins === totalCoins && repeatCount === targetIterations) {
      setGameAction('Perfect! All coins collected with exact iteration count.');
      onComplete({
        steps_executed: repeatCount,
        optimal_steps: targetIterations
      });
    } else if (coins < totalCoins) {
      recordMistake(`Loop terminated too early! Needed ${totalCoins} iterations, only ran ${repeatCount}.`);
      setGameAction(`Off-by-${totalCoins - coins} error! Increase repeat count.`);
    } else if (repeatCount > targetIterations) {
      recordMistake(`Over-iteration! Ran ${repeatCount} times, but only ${targetIterations} coins existed.`);
      setGameAction('Wasted iterations! Reduce loop repeat count.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Visual Track Arena */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '2rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            ITERATION TRACK ({collectedCoins} / {totalCoins} COINS)
          </span>
          <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 }}>
            {activeIteration >= 0 ? `Current i = ${activeIteration}` : 'Idle'}
          </span>
        </div>

        {/* Linear Track Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${totalCoins + 1}, 1fr)`,
          gap: '8px',
          alignItems: 'center'
        }}>
          {Array.from({ length: totalCoins + 1 }).map((_, idx) => {
            const isRobotHere = currentStep === idx;
            const isCoinHere = idx < totalCoins && idx >= collectedCoins;
            const isCollected = idx < collectedCoins;

            return (
              <div
                key={idx}
                style={{
                  aspectRatio: '1',
                  background: isRobotHere ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                  border: isRobotHere ? '2px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  position: 'relative'
                }}
              >
                {isRobotHere && <span>🏃</span>}
                {!isRobotHere && isCoinHere && <span>🪙</span>}
                {!isRobotHere && isCollected && <span style={{ opacity: 0.2 }}>✨</span>}
                {!isRobotHere && idx === totalCoins && <span>🏁</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Loop Programmer Block */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        padding: '1.5rem',
        borderRadius: '10px',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>
          <Repeat size={18} /> Visual Loop Builder:
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
            REPEAT ACTION
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <button
                key={num}
                onClick={() => { setRepeatCount(num); sounds.playClick(); }}
                disabled={isRunning}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: repeatCount === num ? '2px solid #34d399' : '1px solid var(--border-color)',
                  background: repeatCount === num ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  color: repeatCount === num ? '#34d399' : '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                {num}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
            TIMES (for i in range({repeatCount}))
          </span>
        </div>
      </div>

      {/* Execution Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={resetState} disabled={isRunning} className="btn-secondary" style={{ padding: '10px 18px' }}>
          <RotateCcw size={16} /> Reset
        </button>
        <button onClick={runLoop} disabled={isRunning} className="btn-primary" style={{ padding: '10px 24px' }}>
          <Play size={16} /> {isRunning ? 'Iterating...' : 'RUN LOOP ▶'}
        </button>
      </div>
    </div>
  );
};

export default LoopRunner;
