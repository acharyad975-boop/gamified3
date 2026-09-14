import React, { useState, useEffect } from 'react';
import AnimationPlayerWrapper from './AnimationPlayerWrapper';
import { ArrowLeftRight, Check } from 'lucide-react';

const SORT_STEPS = [
  {
    step: 0,
    array: [5, 2, 4, 1],
    comparing: [0, 1],
    swapped: false,
    explanation: 'Pass 1: Compare index 0 (5) and index 1 (2). Since 5 > 2, swap them.',
  },
  {
    step: 1,
    array: [2, 5, 4, 1],
    comparing: [1, 2],
    swapped: true,
    explanation: 'Swap executed! Now compare index 1 (5) and index 2 (4). Since 5 > 4, swap them.',
  },
  {
    step: 2,
    array: [2, 4, 5, 1],
    comparing: [2, 3],
    swapped: true,
    explanation: 'Swap executed! Now compare index 2 (5) and index 3 (1). Since 5 > 1, swap them.',
  },
  {
    step: 3,
    array: [2, 4, 1, 5],
    comparing: [0, 1],
    locked: [3],
    swapped: true,
    explanation: 'Pass 1 complete! Largest element (5) has bubbled to the final position (index 3).',
  },
  {
    step: 4,
    array: [2, 4, 1, 5],
    comparing: [1, 2],
    locked: [3],
    swapped: false,
    explanation: 'Pass 2: Compare index 1 (4) and index 2 (1). Since 4 > 1, swap them.',
  },
  {
    step: 5,
    array: [2, 1, 4, 5],
    comparing: [0, 1],
    locked: [2, 3],
    swapped: true,
    explanation: 'Pass 2 complete! Element 4 is locked in place. Now compare index 0 (2) and index 1 (1). Swap.',
  },
  {
    step: 6,
    array: [1, 2, 4, 5],
    comparing: [],
    locked: [0, 1, 2, 3],
    swapped: true,
    explanation: 'Sorting Complete! Array is completely sorted: [1, 2, 4, 5] in O(n²) time.',
  },
];

const SortingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= SORT_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const activeData = SORT_STEPS[currentStep];

  return (
    <AnimationPlayerWrapper
      title="Bubble Sort Step-by-Step Algorithm Visualization"
      subtitle="Watch adjacent element comparisons, pairwise swaps, and sorted boundary locks."
      currentStep={currentStep}
      totalSteps={SORT_STEPS.length}
      isPlaying={isPlaying}
      playbackSpeed={speed}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onNext={() => setCurrentStep((p) => Math.min(p + 1, SORT_STEPS.length - 1))}
      onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
      onRestart={() => { setCurrentStep(0); setIsPlaying(false); }}
      onSpeedChange={(s) => setSpeed(s)}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        {/* Array Bars Visualization */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', minHeight: '180px' }}>
          {activeData.array.map((val, idx) => {
            const isComparing = activeData.comparing?.includes(idx);
            const isLocked = activeData.locked?.includes(idx);

            let barColor = 'rgba(99, 102, 241, 0.4)';
            let borderColor = '#818cf8';

            if (isLocked) {
              barColor = 'rgba(16, 185, 129, 0.5)';
              borderColor = '#10b981';
            } else if (isComparing) {
              barColor = 'rgba(245, 158, 11, 0.6)';
              borderColor = '#f59e0b';
            }

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: `${val * 32}px`,
                    backgroundColor: barColor,
                    border: `2px solid ${borderColor}`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    boxShadow: isComparing ? '0 0 20px rgba(245, 158, 11, 0.5)' : isLocked ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {val}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Index {idx}
                </div>
                {isComparing && (
                  <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 700 }}>
                    COMPARING
                  </span>
                )}
                {isLocked && (
                  <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>
                    SORTED ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation Card */}
        <div style={{
          width: '100%',
          maxWidth: '650px',
          padding: '14px 20px',
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.9rem', color: '#c7d2fe', lineHeight: 1.5 }}>
            {activeData.explanation}
          </p>
        </div>
      </div>
    </AnimationPlayerWrapper>
  );
};

export default SortingAnimation;
