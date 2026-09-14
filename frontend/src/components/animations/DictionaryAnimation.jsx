import React, { useState, useEffect } from 'react';
import AnimationPlayerWrapper from './AnimationPlayerWrapper';
import { Database, Key, ArrowRight, Check } from 'lucide-react';

const DICT_STEPS = [
  {
    step: 0,
    title: 'Dictionary Hash Map Initialization',
    pairs: [
      { key: '"name"', val: '"John"', isAccess: false },
      { key: '"age"', val: '20', isAccess: false },
    ],
    codeSnippet: 'student = {"name": "John", "age": 20}',
    explanation: 'Step 1: In Python, a dictionary stores key-value associations where keys are hashed for O(1) lookup.',
  },
  {
    step: 1,
    title: 'Key-Value Access: student["name"]',
    pairs: [
      { key: '"name"', val: '"John"', isAccess: true },
      { key: '"age"', val: '20', isAccess: false },
    ],
    codeSnippet: 'print(student["name"])  # Returns "John"',
    explanation: 'Step 2: Accessing student["name"] hashes "name" to retrieve the value "John" instantly without scanning all entries.',
  },
  {
    step: 2,
    title: 'Mutate Value: student["age"] = 21',
    pairs: [
      { key: '"name"', val: '"John"', isAccess: false },
      { key: '"age"', val: '21', isAccess: true, isMutate: true },
    ],
    codeSnippet: 'student["age"] = 21',
    explanation: 'Step 3: Assigning student["age"] = 21 replaces the value stored at key "age" from 20 to 21.',
  },
  {
    step: 3,
    title: 'Sets: Unique Element Deduplication',
    isSetMode: true,
    setElements: [1, 2, 3],
    codeSnippet: 'numbers = {1, 2, 2, 3}  # Deduplicates to {1, 2, 3}',
    explanation: 'Step 4: Sets store distinct elements only. Adding duplicate values like 2 is discarded automatically by hash uniqueness.',
  },
];

const DictionaryAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= DICT_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const activeData = DICT_STEPS[currentStep];

  return (
    <AnimationPlayerWrapper
      title="Dictionaries (Key-Value Maps) & Sets (Deduplication)"
      subtitle="Visualizing O(1) hash lookups, key-value bindings, and mathematical set uniqueness."
      currentStep={currentStep}
      totalSteps={DICT_STEPS.length}
      isPlaying={isPlaying}
      playbackSpeed={speed}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onNext={() => setCurrentStep((p) => Math.min(p + 1, DICT_STEPS.length - 1))}
      onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
      onRestart={() => { setCurrentStep(0); setIsPlaying(false); }}
      onSpeedChange={(s) => setSpeed(s)}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        {/* Code Snippet */}
        <div style={{
          backgroundColor: '#030712',
          padding: '10px 18px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          fontFamily: 'var(--font-mono)',
          color: '#38bdf8',
          fontSize: '0.9rem'
        }}>
          {activeData.codeSnippet}
        </div>

        {/* Dictionary or Set Visual Card */}
        {!activeData.isSetMode ? (
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {activeData.pairs?.map((p, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 20px',
                  backgroundColor: p.isAccess ? 'rgba(99, 102, 241, 0.25)' : '#111827',
                  border: p.isAccess ? '2px solid #818cf8' : '1px solid var(--border-color)',
                  borderRadius: '10px',
                  boxShadow: p.isAccess ? '0 0 15px rgba(99, 102, 241, 0.35)' : 'none',
                  transition: 'all 0.25s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Key size={16} color="#fbbf24" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fde68a' }}>{p.key}</span>
                </div>
                <ArrowRight size={16} color="var(--text-muted)" />
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#34d399', fontSize: '1.1rem' }}>
                  {p.val}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '1.4rem' }}>{'{'}</span>
            {activeData.setElements?.map((val, idx) => (
              <div
                key={idx}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  border: '2px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: '#34d399',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {val}
              </div>
            ))}
            <span style={{ color: 'var(--text-muted)', fontSize: '1.4rem' }}>{'}'}</span>
          </div>
        )}

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

export default DictionaryAnimation;
