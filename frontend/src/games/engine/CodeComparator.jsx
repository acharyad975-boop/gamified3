import React from 'react';
import { Code2, Sparkles, Check, Copy } from 'lucide-react';

const CodeComparator = ({
  gameAction = 'Waiting for execution...',
  codeSnippets = {},
  language = 'python',
  setLanguage,
  highlightLine = 0
}) => {
  const [copied, setCopied] = React.useState(false);

  const codeText = codeSnippets[language] || codeSnippets.python || '# Real code will appear here';
  const lines = codeText.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.85)',
      border: '1px solid rgba(99, 102, 241, 0.25)',
      borderRadius: '12px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Header with Language Tabs */}
      <div style={{
        padding: '10px 16px',
        background: 'rgba(30, 41, 59, 0.7)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code2 size={16} color="#818cf8" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.04em' }}>
            GAME LOGIC ↔ REAL CODE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {['python', 'javascript', 'cpp'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage && setLanguage(lang)}
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '3px 8px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: language === lang ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.06)',
                color: language === lang ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              {lang === 'cpp' ? 'C++' : lang === 'python' ? 'Python' : 'JS'}
            </button>
          ))}
          <button
            onClick={handleCopy}
            title="Copy Code"
            style={{
              background: 'transparent',
              border: 'none',
              color: copied ? '#34d399' : 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Synchronized Game Action Banner */}
      <div style={{
        padding: '8px 16px',
        background: 'rgba(99, 102, 241, 0.1)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.8rem'
      }}>
        <Sparkles size={14} color="#38bdf8" />
        <span style={{ color: 'var(--text-secondary)' }}>Current Visual Action:</span>
        <span style={{ color: '#38bdf8', fontWeight: 600, fontFamily: 'monospace' }}>
          {gameAction}
        </span>
      </div>

      {/* Side by Side Code Display */}
      <div style={{
        padding: '12px 0',
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        fontSize: '0.85rem',
        overflowY: 'auto',
        maxHeight: '260px'
      }}>
        {lines.map((line, idx) => {
          const isHighlighted = highlightLine === idx + 1 || (highlightLine === 0 && idx === 0);
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                padding: '2px 16px',
                backgroundColor: isHighlighted ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                borderLeft: isHighlighted ? '3px solid #818cf8' : '3px solid transparent',
                color: isHighlighted ? '#ffffff' : '#94a3b8',
                lineHeight: 1.6
              }}
            >
              <span style={{
                width: '28px',
                color: 'rgba(255, 255, 255, 0.25)',
                userSelect: 'none',
                textAlign: 'right',
                paddingRight: '12px',
                fontSize: '0.75rem'
              }}>
                {idx + 1}
              </span>
              <span style={{ whiteSpace: 'pre-wrap' }}>
                {line}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CodeComparator;
