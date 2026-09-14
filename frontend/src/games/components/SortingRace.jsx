import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Zap, ArrowRight, ArrowLeft } from 'lucide-react';

const SortingRace = ({ level, speed, setSpeed, setGameAction, setHighlightLine, recordMistake, onComplete, sounds }) => {
  const init = level.initial_state || {};
  const initialArray = init.array || [5, 2, 8, 1, 3];
  const targetSorted = level.solution_criteria?.sorted_array || [1, 2, 3, 5, 8];

  const [array, setArray] = useState([...initialArray]);
  const [comparing, setComparing] = useState([]);
  const [isSorting, setIsSorting] = useState(false);

  useEffect(() => {
    resetSort();
  }, [level]);

  const resetSort = () => {
    setArray([...initialArray]);
    setComparing([]);
    setIsSorting(false);
    setGameAction('Bubble Sort race: Compare adjacent bars and swap if left > right.');
    setHighlightLine(1);
  };

  const runBubbleSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    sounds.playStep();

    let arr = [...array];
    let n = arr.length;
    let swapsCount = 0;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparing([j, j + 1]);
        setHighlightLine(3);
        setGameAction(`Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]})...`);
        sounds.playStep();

        const delay = speed === 4 ? 120 : speed === 2 ? 250 : 500;
        await new Promise(r => setTimeout(r, delay));

        if (arr[j] > arr[j + 1]) {
          setGameAction(`Swapping ${arr[j]} > ${arr[j + 1]}`);
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          swapsCount += 1;
          sounds.playCoin();
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }

    setComparing([]);
    setIsSorting(false);

    const isCorrect = arr.every((v, i) => v === targetSorted[i]);
    if (isCorrect) {
      setGameAction('Array successfully sorted in ascending order!');
      onComplete({ steps_executed: swapsCount, optimal_steps: swapsCount });
    } else {
      recordMistake('Sorting did not reach target ascending array order.');
    }
  };

  const maxHeight = Math.max(...initialArray);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Visual Bar Arena */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '2rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24' }}>
            BUBBLE SORT VISUALIZER
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Complexity: O(N²) Quadratic Comparisons
          </span>
        </div>

        {/* Dynamic Bars */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '16px',
          height: '180px',
          paddingBottom: '10px'
        }}>
          {array.map((val, idx) => {
            const isComparing = comparing.includes(idx);
            const heightPct = Math.round((val / maxHeight) * 100);

            return (
              <div
                key={idx}
                style={{
                  width: '50px',
                  height: `${heightPct}%`,
                  background: isComparing
                    ? 'linear-gradient(180deg, #f59e0b, #d97706)'
                    : 'linear-gradient(180deg, #6366f1, #4f46e5)',
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingTop: '6px',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  boxShadow: isComparing ? '0 0 15px #f59e0b' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {val}
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={resetSort} disabled={isSorting} className="btn-secondary" style={{ padding: '10px 18px' }}>
          <RotateCcw size={16} /> Reset
        </button>
        <button onClick={runBubbleSort} disabled={isSorting} className="btn-primary" style={{ padding: '10px 24px' }}>
          <Play size={16} /> {isSorting ? 'Sorting...' : 'RUN SORTING RACE ▶'}
        </button>
      </div>
    </div>
  );
};

export default SortingRace;
