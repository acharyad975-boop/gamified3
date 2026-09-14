import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Box, ArrowDown, Sparkles } from 'lucide-react';

const ArrayAdventure = ({ level, speed, setSpeed, setGameAction, setHighlightLine, recordMistake, onComplete, sounds }) => {
  const init = level.initial_state || {};
  const fruits = init.fruits || ['Apple', 'Banana', 'Mango'];
  const targetIndex = init.target_index ?? 1;
  const expectedItem = level.solution_criteria?.selected_item || 'Banana';

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    resetAdventure();
  }, [level]);

  const resetAdventure = () => {
    setSelectedIndex(0);
    setIsVerifying(false);
    setGameAction(`Find and select fruits[${targetIndex}].`);
    setHighlightLine(1);
  };

  const verifySelection = async () => {
    if (isVerifying) return;
    setIsVerifying(true);
    sounds.playStep();

    setHighlightLine(2);
    setGameAction(`Accessing array element at index ${selectedIndex}: fruits[${selectedIndex}]`);

    const delay = speed === 4 ? 150 : speed === 2 ? 300 : 600;
    await new Promise(r => setTimeout(r, delay));

    const selectedItem = fruits[selectedIndex];
    setIsVerifying(false);

    if (selectedIndex === targetIndex && selectedItem === expectedItem) {
      sounds.playCoin();
      setGameAction(`Bingo! fruits[${targetIndex}] is "${expectedItem}".`);
      onComplete({ steps_executed: 1, optimal_steps: 1 });
    } else {
      recordMistake(`Wrong index! You picked index ${selectedIndex} ("${selectedItem}"), but goal was fruits[${targetIndex}].`);
      setGameAction('Remember: array indices start at 0, not 1.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* 0-Indexed Array Chests Arena */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '2rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem'
      }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22d3ee' }}>
          ARRAY INVENTORY: fruits = ["Apple", "Banana", "Mango"]
        </div>

        {/* 0-Based Index Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${fruits.length}, 1fr)`,
          gap: '12px'
        }}>
          {fruits.map((item, idx) => {
            const isSelected = selectedIndex === idx;

            return (
              <div
                key={idx}
                onClick={() => { setSelectedIndex(idx); sounds.playClick(); }}
                style={{
                  padding: '16px 12px',
                  background: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '2px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* 0-Based Index Indicator */}
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: isSelected ? '#22d3ee' : 'var(--text-muted)',
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  INDEX [{idx}]
                </span>

                <span style={{ fontSize: '1.8rem' }}>
                  {idx === 0 ? '🍎' : idx === 1 ? '🍌' : '🥭'}
                </span>

                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  "{item}"
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Challenge Prompt */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        padding: '1.2rem 1.5rem',
        borderRadius: '10px',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TARGET ELEMENT QUERY:</span>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#22d3ee', fontFamily: 'monospace' }}>
            Find fruits[{targetIndex}]
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={resetAdventure} disabled={isVerifying} className="btn-secondary" style={{ padding: '8px 14px' }}>
            <RotateCcw size={16} /> Reset
          </button>
          <button onClick={verifySelection} disabled={isVerifying} className="btn-primary" style={{ padding: '8px 20px' }}>
            <Play size={16} /> {isVerifying ? 'Checking...' : 'VERIFY INDEX ▶'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArrayAdventure;
