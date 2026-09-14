import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Gauge } from 'lucide-react';

const AnimationPlayerWrapper = ({
  title,
  subtitle,
  currentStep,
  totalSteps,
  isPlaying,
  playbackSpeed,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onRestart,
  onSpeedChange,
  children,
}) => {
  return (
    <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <div style={{
        padding: '12px 20px',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
            {title || 'Interactive Step-by-Step Visualization'}
          </h3>
          {subtitle && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {subtitle}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--accent-cyan)',
            backgroundColor: 'rgba(6, 182, 212, 0.12)',
            padding: '3px 10px',
            borderRadius: '999px'
          }}>
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>
      </div>

      {/* Animation Canvas */}
      <div style={{
        padding: '2rem',
        backgroundColor: '#090d16',
        minHeight: '320px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {children}
      </div>

      {/* Playback Controls Footer */}
      <div style={{
        padding: '12px 20px',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Step Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onRestart}
            title="Restart Animation"
            className="btn-secondary"
            style={{ padding: '8px', borderRadius: '8px' }}
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={onPrev}
            disabled={currentStep <= 0}
            title="Previous Step"
            className="btn-secondary"
            style={{ padding: '8px 12px', borderRadius: '8px', opacity: currentStep <= 0 ? 0.4 : 1 }}
          >
            <SkipBack size={16} />
          </button>

          <button
            onClick={isPlaying ? onPause : onPlay}
            className="btn-primary"
            style={{ padding: '8px 18px', borderRadius: '8px' }}
          >
            {isPlaying ? (
              <><Pause size={16} /> Pause</>
            ) : (
              <><Play size={16} /> Play</>
            )}
          </button>

          <button
            onClick={onNext}
            disabled={currentStep >= totalSteps - 1}
            title="Next Step"
            className="btn-secondary"
            style={{ padding: '8px 12px', borderRadius: '8px', opacity: currentStep >= totalSteps - 1 ? 0.4 : 1 }}
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* Speed Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Gauge size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '4px' }}>Speed:</span>
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange && onSpeedChange(s)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid var(--border-color)',
                backgroundColor: playbackSpeed === s ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                color: playbackSpeed === s ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimationPlayerWrapper;
