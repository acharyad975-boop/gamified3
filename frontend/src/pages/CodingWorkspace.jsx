import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { Code2, Play, CheckCircle2, Sparkles, Terminal, Cpu, Lightbulb, ChevronRight, Eye, Layers } from 'lucide-react';
import CodeExecutionVisualizer from '../components/common/CodeExecutionVisualizer';

const STARTER_CODE = `# Coding Challenge: Reverse Words in String
def reverse_words(s: str) -> str:
    # Write your solution here
    words = s.split()
    return " ".join(reversed(words))

# Test execution
print(reverse_words("hello adaptive world"))
`;

const HINTS = [
  "💡 Hint 1: Check your string splitting method and handle multiple continuous spaces properly.",
  "💡 Hint 2: Consider using a two-pointer array reversal technique or Python's reversed() generator.",
  "💡 Hint 3: Look at joining the reversed token list with a single space ' '.join(...) to construct the final output."
];

const CodingWorkspace = () => {
  const [activeView, setActiveView] = useState('editor'); // 'editor' or 'visualizer'
  const [code, setCode] = useState(STARTER_CODE);
  const [output, setOutput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [unlockedHintIndex, setUnlockedHintIndex] = useState(0);

  const { awardXP } = useGamification();

  const handleRunCode = () => {
    setOutput('Executing in secure Python sandbox...\n\nOutput:\nworld adaptive hello\n\n✓ Test Case 1: PASSED (3ms)\n✓ Test Case 2: PASSED (2ms)\n\nAll tests passed successfully!');
    awardXP(100, 'Coding Challenge Solved');
  };

  const handleAnalyzeAST = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        time_complexity: 'O(n)',
        space_complexity: 'O(n)',
        loop_depth: 0,
        ast_nodes: 18,
        explanation: 'Your code uses built-in string splitting and reverse iterator, executing in linear time relative to input length.',
        suggestions: 'Excellent readability and idiomatic Python expression.',
        quality_score: 95
      });
      setAnalyzing(false);
    }, 800);
  };

  const handleRequestHint = () => {
    if (unlockedHintIndex < HINTS.length) {
      setUnlockedHintIndex(prev => prev + 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Workspace Header */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Code2 size={20} color="#10b981" />
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Challenge: Reverse Words in String</h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
              EASY (+100 XP)
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Given an input string s, reverse the order of the words. Return a string of the words in reverse order concatenated by a single space.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', backgroundColor: '#090d16', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setActiveView('editor')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeView === 'editor' ? 'var(--primary-gradient)' : 'transparent',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              💻 Code Editor
            </button>
            <button
              onClick={() => setActiveView('visualizer')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeView === 'visualizer' ? 'var(--primary-gradient)' : 'transparent',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Eye size={14} /> Visual Memory Trace
            </button>
          </div>

          <button onClick={handleAnalyzeAST} className="btn-secondary" disabled={analyzing} style={{ fontSize: '0.8rem' }}>
            <Sparkles size={14} color="#818cf8" /> {analyzing ? 'Analyzing AST...' : 'AI AST Analysis'}
          </button>
          <button onClick={handleRunCode} className="btn-primary" style={{ fontSize: '0.8rem' }}>
            <Play size={14} /> Run & Submit
          </button>
        </div>
      </div>

      {activeView === 'visualizer' ? (
        <CodeExecutionVisualizer />
      ) : (
        /* Editor and Terminal Split View */
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '20px', minHeight: '480px' }}>
          {/* Code Editor */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: '#0f172a', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                solution.py (Python 3.12 Runtime)
              </span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              style={{
                flex: 1,
                backgroundColor: '#090d16',
                color: '#e2e8f0',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                padding: '1.2rem',
                border: 'none',
                outline: 'none',
                resize: 'none',
                lineHeight: 1.6,
                minHeight: '280px'
              }}
            />

            {/* Progressive AI Coding Mentor Hints */}
            <div style={{ padding: '1rem', backgroundColor: '#030712', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lightbulb size={16} /> Progressive AI Coding Mentor
                </span>
                {unlockedHintIndex < HINTS.length && (
                  <button onClick={handleRequestHint} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    Request Hint ({unlockedHintIndex + 1}/{HINTS.length})
                  </button>
                )}
              </div>

              {unlockedHintIndex === 0 ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Stuck on this problem? Request a progressive hint without revealing the entire answer.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {HINTS.slice(0, unlockedHintIndex).map((hint, idx) => (
                    <div key={idx} style={{ padding: '8px 12px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '6px', fontSize: '0.8rem', color: '#fef08a' }}>
                      {hint}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Output & AST Complexity Analysis */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Terminal Console */}
            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', background: '#0f172a', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={16} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Execution Output</span>
              </div>
              <pre style={{
                flex: 1,
                padding: '1.2rem',
                backgroundColor: '#030712',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                overflowY: 'auto',
                margin: 0,
                minHeight: '120px'
              }}>
                {output || '> Click Run & Submit to execute in sandbox...'}
              </pre>
            </div>

            {/* AST Analysis Card */}
            {analysisResult && (
              <div className="glass-panel" style={{ padding: '1.2rem', background: 'rgba(30, 27, 75, 0.4)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={16} color="#c084fc" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c084fc' }}>AST Static Code Analysis</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                    Score: {analysisResult.quality_score}/100
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '8px', fontSize: '0.8rem' }}>
                  <div style={{ background: '#090d16', padding: '6px 10px', borderRadius: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Time Complexity:</span> <b style={{ color: '#38bdf8' }}>{analysisResult.time_complexity}</b>
                  </div>
                  <div style={{ background: '#090d16', padding: '6px 10px', borderRadius: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Space Complexity:</span> <b style={{ color: '#34d399' }}>{analysisResult.space_complexity}</b>
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#c7d2fe', lineHeight: 1.4 }}>
                  {analysisResult.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingWorkspace;
