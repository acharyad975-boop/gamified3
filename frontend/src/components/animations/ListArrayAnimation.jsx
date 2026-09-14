import React, { useState, useEffect } from 'react';
import AnimationPlayerWrapper from './AnimationPlayerWrapper';
import { Layers, Plus, Trash2, Search } from 'lucide-react';

const LIST_STEPS = [
  {
    step: 0,
    list: [10, 20, 30],
    highlightIndex: null,
    actionDesc: 'Initial List: numbers = [10, 20, 30] with 0-indexed positions [0, 1, 2].',
    explanation: 'Step 1: In Python, lists are contiguous references in memory with zero-based indexing.',
  },
  {
    step: 1,
    list: [10, 20, 30],
    highlightIndex: 1,
    actionDesc: 'Access Index: numbers[1] -> evaluates to 20.',
    explanation: 'Step 2: Accessing numbers[1] uses O(1) pointer arithmetic to directly fetch the second element (20).',
  },
  {
    step: 2,
    list: [10, 20, 30, 40],
    highlightIndex: 3,
    actionDesc: 'Append: numbers.append(40) -> inserts 40 at index 3.',
    explanation: 'Step 3: append(40) dynamically expands list capacity and appends 40 to the end in amortized O(1) time.',
  },
  {
    step: 3,
    list: [10, 30, 40],
    highlightIndex: 1,
    actionDesc: 'Remove: numbers.pop(1) -> removes element at index 1 (20).',
    explanation: 'Step 4: pop(1) removes the value 20. Remaining elements shift left to maintain contiguous indices.',
  },
];

const ListArrayAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= LIST_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const activeData = LIST_STEPS[currentStep];

  return (
    <AnimationPlayerWrapper
      title="List Indexing, Dynamic Append & Pop Operations"
      subtitle="Visualizing 0-indexed memory slots, O(1) index lookups, and dynamic element shifting."
      currentStep={currentStep}
      totalSteps={LIST_STEPS.length}
      isPlaying={isPlaying}
      playbackSpeed={speed}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onNext={() => setCurrentStep((p) => Math.min(p + 1, LIST_STEPS.length - 1))}
      onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
      onRestart={() => { setCurrentStep(0); setIsPlaying(false); }}
      onSpeedChange={(s) => setSpeed(s)}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {/* Active Action Banner */}
        <div style={{ padding: '8px 20px', backgroundColor: 'rgba(99, 102, 241, 0.15)', border: '1px solid #818cf8', borderRadius: '999px', fontSize: '0.9rem', color: '#c7d2fe', fontWeight: 700 }}>
          {activeData.actionDesc}
        </div>

        {/* Visual Indexed List Boxes */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {activeData.list.map((val, idx) => {
            const isHighlighted = activeData.highlightIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {/* Value Box */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: isHighlighted ? 'rgba(99, 102, 241, 0.4)' : '#111827',
                    border: isHighlighted ? '2px solid #818cf8' : '1px solid var(--border-color)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: isHighlighted ? '#ffffff' : '#e2e8f0',
                    fontFamily: 'var(--font-mono)',
                    boxShadow: isHighlighted ? '0 0 20px rgba(99, 102, 241, 0.5)' : 'none',
                    transition: 'all 0.25s'
                  }}
                >
                  {val}
                </div>

                {/* Index Indicator */}
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: isHighlighted ? '#38bdf8' : 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  Index [{idx}]
                </div>
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

export default ListArrayAnimation;
