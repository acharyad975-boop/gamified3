import React, { useState, useEffect } from 'react';
import AnimationPlayerWrapper from './AnimationPlayerWrapper';
import { Search, CheckCircle2 } from 'lucide-react';

const ARRAY_DATA = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const TARGET = 23;

const BINARY_SEARCH_STEPS = [
  {
    step: 0,
    low: 0,
    high: 9,
    mid: 4,
    explanation: 'Step 1: low = 0 (val: 2), high = 9 (val: 91). mid = (0 + 9) // 2 = 4 (val: 16). Target is 23.',
  },
  {
    step: 1,
    low: 0,
    high: 9,
    mid: 4,
    comparison: '16 < 23',
    explanation: 'Comparison: Array[mid] (16) < 23. Discard the entire left half! Set low = mid + 1 = 5.',
  },
  {
    step: 2,
    low: 5,
    high: 9,
    mid: 7,
    explanation: 'Step 2: Search interval is now [5..9]. mid = (5 + 9) // 2 = 7 (val: 56).',
  },
  {
    step: 3,
    low: 5,
    high: 9,
    mid: 7,
    comparison: '56 > 23',
    explanation: 'Comparison: Array[mid] (56) > 23. Discard the right half! Set high = mid - 1 = 6.',
  },
  {
    step: 4,
    low: 5,
    high: 6,
    mid: 5,
    explanation: 'Step 3: Search interval is now [5..6]. mid = (5 + 6) // 2 = 5 (val: 23).',
  },
  {
    step: 5,
    low: 5,
    high: 6,
    mid: 5,
    found: true,
    explanation: 'MATCH FOUND! Array[mid] (23) == 23. Binary search succeeds in 3 steps (O(log n))!',
  },
];

const BinarySearchAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= BINARY_SEARCH_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const activeData = BINARY_SEARCH_STEPS[currentStep];

  return (
    <AnimationPlayerWrapper
      title="Binary Search (Divide & Conquer) Visualization"
      subtitle={`Searching for target value ${TARGET} in sorted array of 10 elements.`}
      currentStep={currentStep}
      totalSteps={BINARY_SEARCH_STEPS.length}
      isPlaying={isPlaying}
      playbackSpeed={speed}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onNext={() => setCurrentStep((p) => Math.min(p + 1, BINARY_SEARCH_STEPS.length - 1))}
      onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
      onRestart={() => { setCurrentStep(0); setIsPlaying(false); }}
      onSpeedChange={(s) => setSpeed(s)}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        {/* Target Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '999px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
          <Search size={16} color="#06b6d4" />
          <span style={{ fontSize: '0.85rem', color: '#67e8f9', fontWeight: 700 }}>
            TARGET = {TARGET}
          </span>
        </div>

        {/* Array Cells */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {ARRAY_DATA.map((val, idx) => {
            const isInsideRange = idx >= activeData.low && idx <= activeData.high;
            const isMid = idx === activeData.mid;
            const isFound = activeData.found && isMid;

            let bgColor = isInsideRange ? '#1e293b' : 'rgba(15, 23, 42, 0.3)';
            let borderColor = isInsideRange ? 'var(--border-color)' : 'rgba(255, 255, 255, 0.04)';
            let textColor = isInsideRange ? '#ffffff' : '#475569';

            if (isFound) {
              bgColor = 'rgba(16, 185, 129, 0.3)';
              borderColor = '#10b981';
              textColor = '#34d399';
            } else if (isMid) {
              bgColor = 'rgba(245, 158, 11, 0.3)';
              borderColor = '#f59e0b';
              textColor = '#fbbf24';
            }

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: bgColor,
                    border: `2px solid ${borderColor}`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: textColor,
                    fontFamily: 'var(--font-mono)',
                    boxShadow: isMid ? '0 0 15px rgba(245, 158, 11, 0.4)' : isFound ? '0 0 20px rgba(16, 185, 129, 0.6)' : 'none',
                    transition: 'all 0.25s'
                  }}
                >
                  {val}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  [{idx}]
                </div>
                {idx === activeData.low && (
                  <span style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700 }}>LOW</span>
                )}
                {isMid && (
                  <span style={{ fontSize: '0.65rem', color: '#fbbf24', fontWeight: 700 }}>MID</span>
                )}
                {idx === activeData.high && (
                  <span style={{ fontSize: '0.65rem', color: '#c084fc', fontWeight: 700 }}>HIGH</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
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

export default BinarySearchAnimation;
