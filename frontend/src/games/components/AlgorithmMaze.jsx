import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Search, Compass, Zap } from 'lucide-react';

const AlgorithmMaze = ({ level, speed, setSpeed, setGameAction, setHighlightLine, recordMistake, onComplete, sounds }) => {
  const init = level.initial_state || {};
  const list = init.list || [4, 2, 9, 7, 1, 5];
  const target = init.target || 7;
  const expectedIndex = level.solution_criteria?.found_index ?? 3;

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [found, setFound] = useState(false);

  useEffect(() => {
    resetSearch();
  }, [level]);

  const resetSearch = () => {
    setCurrentIndex(-1);
    setIsSearching(false);
    setFound(false);
    setGameAction(`Linear Search algorithm starting: Find target value ${target}.`);
    setHighlightLine(1);
  };

  const runSearch = async () => {
    if (isSearching) return;
    setIsSearching(true);
    setFound(false);
    sounds.playStep();

    let steps = 0;
    for (let i = 0; i < list.length; i++) {
      setCurrentIndex(i);
      steps += 1;
      setHighlightLine(3);
      setGameAction(`Comparing list[${i}] = ${list[i]} with target ${target}...`);
      sounds.playStep();

      const delay = speed === 4 ? 150 : speed === 2 ? 300 : 600;
      await new Promise(r => setTimeout(r, delay));

      if (list[i] === target) {
        setFound(true);
        sounds.playCoin();
        setGameAction(`Found target ${target} at index ${i} in ${steps} comparisons!`);
        break;
      }
    }

    setIsSearching(false);

    if (found || list[currentIndex] === target) {
      onComplete({ steps_executed: steps, optimal_steps: steps });
    } else {
      recordMistake('Target element was not found in array.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Search Grid Arena */}
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
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2dd4bf' }}>
            ALGORITHM SEARCH ARRAY (Target = {target})
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Complexity: O(N) Linear Time
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${list.length}, 1fr)`,
          gap: '10px'
        }}>
          {list.map((val, idx) => {
            const isInspecting = currentIndex === idx;
            const isMatch = isInspecting && val === target;

            return (
              <div
                key={idx}
                style={{
                  padding: '16px 8px',
                  background: isMatch
                    ? 'rgba(16, 185, 129, 0.25)'
                    : isInspecting
                    ? 'rgba(20, 184, 166, 0.2)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isMatch
                    ? '2px solid #10b981'
                    : isInspecting
                    ? '2px solid #14b8a6'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  [{idx}]
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: isMatch ? '#34d399' : '#ffffff' }}>
                  {val}
                </span>
                <span style={{ fontSize: '0.7rem', color: isMatch ? '#34d399' : isInspecting ? '#2dd4bf' : 'transparent' }}>
                  {isMatch ? 'MATCH!' : isInspecting ? 'CHECKING' : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={resetSearch} disabled={isSearching} className="btn-secondary" style={{ padding: '10px 18px' }}>
          <RotateCcw size={16} /> Reset
        </button>
        <button onClick={runSearch} disabled={isSearching} className="btn-primary" style={{ padding: '10px 24px' }}>
          <Search size={16} /> {isSearching ? 'Searching...' : 'RUN SEARCH ALGORITHM ▶'}
        </button>
      </div>
    </div>
  );
};

export default AlgorithmMaze;
