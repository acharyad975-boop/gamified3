import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, ShieldCheck, AlertTriangle } from 'lucide-react';

const ConditionalCity = ({ level, speed, setSpeed, setGameAction, setHighlightLine, recordMistake, onComplete, sounds }) => {
  const init = level.initial_state || {};
  const lights = init.lights || ['green', 'red', 'green'];

  const [carPosition, setCarPosition] = useState(0);
  const [selectedRule, setSelectedRule] = useState('IF_GREEN_MOVE');
  const [isRunning, setIsRunning] = useState(false);
  const [currentLightIndex, setCurrentLightIndex] = useState(0);

  useEffect(() => {
    resetCity();
  }, [level]);

  const resetCity = () => {
    setCarPosition(0);
    setCurrentLightIndex(0);
    setIsRunning(false);
    setGameAction('Configure the conditional decision rule for the car.');
    setHighlightLine(1);
  };

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    sounds.playStep();

    let pos = 0;
    let hadError = false;

    for (let i = 0; i < lights.length; i++) {
      setCurrentLightIndex(i);
      const light = lights[i];
      setHighlightLine(light === 'green' ? 1 : 3);
      setGameAction(`Approaching Intersection ${i + 1}: Light is ${light.toUpperCase()}`);

      const delay = speed === 4 ? 200 : speed === 2 ? 400 : 800;
      await new Promise(r => setTimeout(r, delay));

      // Evaluate condition
      if (light === 'green') {
        if (selectedRule === 'ALWAYS_STOP') {
          recordMistake('Car stopped on green light causing traffic jam!');
          hadError = true;
          break;
        }
        pos += 1;
        setCarPosition(pos);
        sounds.playStep();
      } else if (light === 'red') {
        if (selectedRule === 'ALWAYS_MOVE') {
          recordMistake('Traffic violation! Car ran a RED light and crashed.');
          hadError = true;
          break;
        }
        // Car safely stops and waits for green
        setGameAction('Light is RED -> Car safely stops.');
        sounds.playCorrect();
      }
    }

    setIsRunning(false);

    if (!hadError && selectedRule === 'IF_GREEN_MOVE') {
      setGameAction('All intersections passed safely! Level complete.');
      onComplete({ steps_executed: lights.length, optimal_steps: lights.length });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* City Road Track */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '2rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24' }}>
          AUTONOMOUS TRAFFIC SIMULATION
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${lights.length + 1}, 1fr)`,
          gap: '12px',
          alignItems: 'center'
        }}>
          {lights.map((light, idx) => {
            const isCarHere = carPosition === idx;
            const isCurrent = currentLightIndex === idx;

            return (
              <div
                key={idx}
                style={{
                  padding: '16px 10px',
                  background: isCurrent ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: isCurrent ? '2px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: light === 'green' ? '#10b981' : '#ef4444',
                  boxShadow: light === 'green' ? '0 0 12px #10b981' : '0 0 12px #ef4444'
                }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: light === 'green' ? '#34d399' : '#f87171' }}>
                  {light}
                </span>
                <div style={{ fontSize: '1.4rem', height: '32px' }}>
                  {isCarHere ? '🚗' : '🛣️'}
                </div>
              </div>
            );
          })}
          <div style={{
            padding: '16px 10px',
            background: carPosition >= lights.length ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.02)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1.4rem' }}>🏁</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Goal</span>
            <div style={{ fontSize: '1.4rem', height: '32px' }}>
              {carPosition >= lights.length ? '🚗' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Decision Tree Radio Block */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        padding: '1.5rem',
        borderRadius: '10px',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem' }}>
          Select Autonomous Decision Rule:
        </div>

        {[
          { id: 'IF_GREEN_MOVE', label: 'IF light == "green" -> MOVE | ELSE -> STOP' },
          { id: 'ALWAYS_MOVE', label: 'ALWAYS MOVE (Ignore light color)' },
          { id: 'ALWAYS_STOP', label: 'ALWAYS STOP (Wait forever)' }
        ].map((opt) => (
          <label
            key={opt.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: selectedRule === opt.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedRule === opt.id ? '1px solid #818cf8' : '1px solid var(--border-color)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: selectedRule === opt.id ? 700 : 400,
              fontFamily: 'monospace'
            }}
          >
            <input
              type="radio"
              name="rule"
              checked={selectedRule === opt.id}
              onChange={() => { setSelectedRule(opt.id); sounds.playClick(); }}
              disabled={isRunning}
            />
            {opt.label}
          </label>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={resetCity} disabled={isRunning} className="btn-secondary" style={{ padding: '10px 18px' }}>
          <RotateCcw size={16} /> Reset
        </button>
        <button onClick={runSimulation} disabled={isRunning} className="btn-primary" style={{ padding: '10px 24px' }}>
          <Play size={16} /> {isRunning ? 'Driving...' : 'TEST DECISIONS ▶'}
        </button>
      </div>
    </div>
  );
};

export default ConditionalCity;
