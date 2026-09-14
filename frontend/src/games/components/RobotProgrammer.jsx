import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Star, Trash2, Zap } from 'lucide-react';

const RobotProgrammer = ({ level, speed, setSpeed, setGameAction, setHighlightLine, recordMistake, onComplete, sounds }) => {
  const init = level.initial_state || {};
  const gridSize = init.grid_size || [4, 4];
  const initialRobotPos = init.robot_pos || [0, 0];
  const targetPos = init.target_pos || [0, 3];
  const obstacles = init.obstacles || [];
  const initialItems = init.items || [];

  const [robotPos, setRobotPos] = useState(initialRobotPos);
  const [commands, setCommands] = useState([]);
  const [itemsLeft, setItemsLeft] = useState(initialItems);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);

  // Reset when level changes
  useEffect(() => {
    resetBoard();
  }, [level]);

  const resetBoard = () => {
    setRobotPos(initialRobotPos);
    setCommands([]);
    setItemsLeft(initialItems);
    setIsRunning(false);
    setActiveStep(-1);
    setGameAction('Assemble movement commands, then click RUN.');
    setHighlightLine(1);
  };

  const addCommand = (cmd) => {
    if (isRunning || commands.length >= 16) return;
    sounds.playClick();
    setCommands([...commands, cmd]);
    setGameAction(`Added ${cmd} to command queue.`);
  };

  const removeCommand = (idx) => {
    if (isRunning) return;
    sounds.playClick();
    setCommands(commands.filter((_, i) => i !== idx));
  };

  const clearCommands = () => {
    if (isRunning) return;
    sounds.playClick();
    setCommands([]);
  };

  const runProgram = async () => {
    if (isRunning || commands.length === 0) return;
    setIsRunning(true);
    setGameAction('Executing instructions...');
    sounds.playStep();

    let currPos = [...initialRobotPos];
    let collectedItems = [];
    let hadMistake = false;

    for (let i = 0; i < commands.length; i++) {
      setActiveStep(i);
      setHighlightLine(Math.min(i + 1, 6));
      const cmd = commands[i];

      if (cmd === 'MOVE_UP') currPos[0] -= 1;
      else if (cmd === 'MOVE_DOWN') currPos[0] += 1;
      else if (cmd === 'MOVE_LEFT') currPos[1] -= 1;
      else if (cmd === 'MOVE_RIGHT') currPos[1] += 1;

      // Bounds check
      if (currPos[0] < 0 || currPos[0] >= gridSize[0] || currPos[1] < 0 || currPos[1] >= gridSize[1]) {
        recordMistake('Robot went out of grid boundaries!');
        hadMistake = true;
        break;
      }

      // Obstacle collision check
      const hitObstacle = obstacles.some(obs => obs[0] === currPos[0] && obs[1] === currPos[1]);
      if (hitObstacle) {
        recordMistake('Collision with obstacle block!');
        hadMistake = true;
        break;
      }

      setRobotPos([...currPos]);
      sounds.playStep();

      // Check item collection
      itemsLeft.forEach((item) => {
        if (item[0] === currPos[0] && item[1] === currPos[1]) {
          sounds.playCoin();
          collectedItems.push(item);
        }
      });

      const delay = speed === 4 ? 120 : speed === 2 ? 250 : 500;
      await new Promise(r => setTimeout(r, delay));
    }

    setIsRunning(false);
    setActiveStep(-1);

    // Check goal condition
    if (!hadMistake && currPos[0] === targetPos[0] && currPos[1] === targetPos[1]) {
      setGameAction('Target reached successfully! Level Complete.');
      onComplete({
        steps_executed: commands.length,
        optimal_steps: level.solution_criteria?.min_moves || commands.length
      });
    } else if (!hadMistake) {
      recordMistake('Execution ended before reaching the goal star.');
      setGameAction('Robot stopped before reaching the ⭐ star. Add more commands.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', height: '100%' }}>
      {/* 2D Interactive Grid Arena */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize[1]}, 1fr)`,
        gap: '6px',
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        maxWidth: '440px',
        margin: '0 auto',
        width: '100%'
      }}>
        {Array.from({ length: gridSize[0] }).map((_, r) =>
          Array.from({ length: gridSize[1] }).map((_, c) => {
            const isRobot = robotPos[0] === r && robotPos[1] === c;
            const isTarget = targetPos[0] === r && targetPos[1] === c;
            const isObstacle = obstacles.some(o => o[0] === r && o[1] === c);
            const isItem = itemsLeft.some(item => item[0] === r && item[1] === c);

            return (
              <div
                key={`${r}-${c}`}
                style={{
                  aspectRatio: '1',
                  background: isObstacle
                    ? 'linear-gradient(135deg, #475569, #334155)'
                    : isTarget
                    ? 'rgba(234, 179, 8, 0.15)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isTarget ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
              >
                {isRobot && <span style={{ filter: 'drop-shadow(0 0 8px #60a5fa)' }}>🤖</span>}
                {!isRobot && isTarget && <span style={{ filter: 'drop-shadow(0 0 8px #fbbf24)' }}>⭐</span>}
                {!isRobot && isObstacle && <span>🧱</span>}
                {!isRobot && !isTarget && !isObstacle && isItem && <span>🔋</span>}
              </div>
            );
          })
        )}
      </div>

      {/* Command Queue Tray */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            COMMAND QUEUE ({commands.length} / 16)
          </span>
          <button
            onClick={clearCommands}
            disabled={isRunning || commands.length === 0}
            style={{ background: 'transparent', border: 'none', color: '#f87171', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Trash2 size={12} /> Clear
          </button>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', minHeight: '38px', alignItems: 'center' }}>
          {commands.length === 0 ? (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click direction buttons below to add steps.</span>
          ) : (
            commands.map((cmd, idx) => (
              <div
                key={idx}
                onClick={() => removeCommand(idx)}
                style={{
                  padding: '4px 8px',
                  background: activeStep === idx ? '#818cf8' : 'rgba(99, 102, 241, 0.2)',
                  border: activeStep === idx ? '1px solid #c7d2fe' : '1px solid rgba(99, 102, 241, 0.4)',
                  color: '#ffffff',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                {cmd.replace('MOVE_', '')}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Control Buttons & Command Palette */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => addCommand('MOVE_UP')} disabled={isRunning} className="btn-secondary" style={{ padding: '8px 12px' }}>
            <ArrowUp size={16} /> UP
          </button>
          <button onClick={() => addCommand('MOVE_DOWN')} disabled={isRunning} className="btn-secondary" style={{ padding: '8px 12px' }}>
            <ArrowDown size={16} /> DOWN
          </button>
          <button onClick={() => addCommand('MOVE_LEFT')} disabled={isRunning} className="btn-secondary" style={{ padding: '8px 12px' }}>
            <ArrowLeft size={16} /> LEFT
          </button>
          <button onClick={() => addCommand('MOVE_RIGHT')} disabled={isRunning} className="btn-secondary" style={{ padding: '8px 12px' }}>
            <ArrowRight size={16} /> RIGHT
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={resetBoard} disabled={isRunning} className="btn-secondary" style={{ padding: '8px 14px' }}>
            <RotateCcw size={16} /> Reset
          </button>
          <button onClick={runProgram} disabled={isRunning || commands.length === 0} className="btn-primary" style={{ padding: '8px 20px' }}>
            <Play size={16} /> {isRunning ? 'Running...' : 'RUN ▶'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RobotProgrammer;
