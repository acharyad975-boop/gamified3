import React, { useState, useEffect } from 'react';
import AnimationPlayerWrapper from './AnimationPlayerWrapper';
import { Database, Filter, Table } from 'lucide-react';

const RAW_TABLE = [
  { id: 1, name: 'Ada', xp: 1200, status: 'Active' },
  { id: 2, name: 'Bob', xp: 300, status: 'Inactive' },
  { id: 3, name: 'Charlie', xp: 850, status: 'Active' },
  { id: 4, name: 'Diana', xp: 450, status: 'Active' },
];

const SQL_STEPS = [
  {
    step: 0,
    clause: 'FROM students',
    evaluatingRow: null,
    matchedRows: [0, 1, 2, 3],
    explanation: 'Step 1 [FROM students]: The SQL engine identifies and scans the entire "students" relational table (4 rows loaded into buffer).',
  },
  {
    step: 1,
    clause: 'WHERE xp > 500',
    evaluatingRow: 0,
    matchedRows: [0],
    explanation: 'Step 2: Checking Row 1 (Ada, xp: 1200). Condition 1200 > 500 is TRUE. Row retained.',
  },
  {
    step: 2,
    clause: 'WHERE xp > 500',
    evaluatingRow: 1,
    matchedRows: [0],
    explanation: 'Step 3: Checking Row 2 (Bob, xp: 300). Condition 300 > 500 is FALSE. Row excluded.',
  },
  {
    step: 3,
    clause: 'WHERE xp > 500',
    evaluatingRow: 2,
    matchedRows: [0, 2],
    explanation: 'Step 4: Checking Row 3 (Charlie, xp: 850). Condition 850 > 500 is TRUE. Row retained.',
  },
  {
    step: 4,
    clause: 'WHERE xp > 500',
    evaluatingRow: 3,
    matchedRows: [0, 2],
    explanation: 'Step 5: Checking Row 4 (Diana, xp: 450). Condition 450 > 500 is FALSE. Row excluded.',
  },
  {
    step: 5,
    clause: 'SELECT name, xp',
    evaluatingRow: null,
    matchedRows: [0, 2],
    projectedColumns: ['name', 'xp'],
    explanation: 'Step 6 [SELECT name, xp]: Projection step. Extracts only the requested columns (name, xp) for the 2 matching rows.',
  },
];

const SQLQueryAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= SQL_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1900 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const activeData = SQL_STEPS[currentStep];

  return (
    <AnimationPlayerWrapper
      title="SQL Query Execution Pipeline Visualization"
      subtitle="Query: SELECT name, xp FROM students WHERE xp > 500;"
      currentStep={currentStep}
      totalSteps={SQL_STEPS.length}
      isPlaying={isPlaying}
      playbackSpeed={speed}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onNext={() => setCurrentStep((p) => Math.min(p + 1, SQL_STEPS.length - 1))}
      onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
      onRestart={() => { setCurrentStep(0); setIsPlaying(false); }}
      onSpeedChange={(s) => setSpeed(s)}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        {/* SQL Active Clause Bar */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {['FROM students', 'WHERE xp > 500', 'SELECT name, xp'].map((clause, idx) => (
            <span
              key={idx}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                backgroundColor: activeData.clause.includes(clause.split(' ')[0]) ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                border: activeData.clause.includes(clause.split(' ')[0]) ? '1px solid #818cf8' : '1px solid var(--border-color)',
                color: activeData.clause.includes(clause.split(' ')[0]) ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {clause}
            </span>
          ))}
        </div>

        {/* Database Table Rendering */}
        <div style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#030712',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '10px 16px' }}>ID</th>
                <th style={{ padding: '10px 16px', color: activeData.projectedColumns ? '#38bdf8' : undefined }}>NAME</th>
                <th style={{ padding: '10px 16px', color: activeData.projectedColumns ? '#38bdf8' : undefined }}>XP</th>
                <th style={{ padding: '10px 16px', opacity: activeData.projectedColumns ? 0.3 : 1 }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {RAW_TABLE.map((row, idx) => {
                const isEvaluating = activeData.evaluatingRow === idx;
                const isMatched = activeData.matchedRows.includes(idx);
                const isFilteredOut = currentStep > 0 && !isMatched && (activeData.evaluatingRow === null || activeData.evaluatingRow >= idx);

                let rowBg = 'transparent';
                if (isEvaluating) rowBg = 'rgba(245, 158, 11, 0.2)';
                else if (isFilteredOut) rowBg = 'rgba(239, 68, 68, 0.08)';
                else if (isMatched && currentStep > 0) rowBg = 'rgba(16, 185, 129, 0.15)';

                return (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor: rowBg,
                      opacity: isFilteredOut ? 0.4 : 1,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'all 0.25s'
                    }}
                  >
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)' }}>{row.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#ffffff' }}>{row.name}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: '#fbbf24', fontWeight: 700 }}>{row.xp}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{row.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Explanation Card */}
        <div style={{
          width: '100%',
          maxWidth: '680px',
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

export default SQLQueryAnimation;
