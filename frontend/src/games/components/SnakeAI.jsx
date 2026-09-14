import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, Sparkles, Award } from 'lucide-react';

const GRID_SIZE = 10;

const SnakeAI = ({
  level,
  speed = 1,
  setSpeed,
  setGameAction,
  setHighlightLine,
  recordMistake,
  onComplete,
  sounds
}) => {
  const [snake, setSnake] = useState([[2, 4], [2, 3], [2, 2]]);
  const [food, setFood] = useState([6, 7]);
  const [direction, setDirection] = useState('RIGHT');
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const [aiMode, setAiMode] = useState(false);

  // Initialize from level state
  useEffect(() => {
    resetGame();
  }, [level]);

  const resetGame = () => {
    const initSnake = level?.initial_state?.snake || [[2, 4], [2, 3], [2, 2]];
    const initFood = level?.initial_state?.food || [5, 6];
    const initObs = level?.initial_state?.obstacles || [];
    const goal = level?.initial_state?.target_score || 3;

    setSnake(initSnake);
    setFood(initFood);
    setObstacles(initObs);
    setTargetScore(goal);
    setDirection('RIGHT');
    setScore(0);
    setStepCount(0);
    setIsGameOver(false);
    setIsRunning(false);
    if (setGameAction) {
      setTimeout(() => setGameAction('Snake initialized. Choose direction or RUN AI.'), 0);
    }
  };

  const changeDirection = (newDir) => {
    if (
      (direction === 'UP' && newDir === 'DOWN') ||
      (direction === 'DOWN' && newDir === 'UP') ||
      (direction === 'LEFT' && newDir === 'RIGHT') ||
      (direction === 'RIGHT' && newDir === 'LEFT')
    ) {
      if (sounds) sounds.playTone(300, 'sawtooth', 0.05);
      return; // Prevent immediate 180 self-reversal
    }
    setDirection(newDir);
    if (sounds) sounds.playClick();
  };

  // Automated step forward
  const stepForward = () => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      let newHead = [...head];

      let chosenDir = direction;

      // In AI Mode, calculate next greedy step towards food
      if (aiMode) {
        const [hx, hy] = head;
        const [fx, fy] = food;
        if (hx < fx && direction !== 'UP') chosenDir = 'DOWN';
        else if (hx > fx && direction !== 'DOWN') chosenDir = 'UP';
        else if (hy < fy && direction !== 'LEFT') chosenDir = 'RIGHT';
        else if (hy > fy && direction !== 'RIGHT') chosenDir = 'LEFT';
        setDirection(chosenDir);
      }

      if (chosenDir === 'UP') newHead[0] -= 1;
      else if (chosenDir === 'DOWN') newHead[0] += 1;
      else if (chosenDir === 'LEFT') newHead[1] -= 1;
      else if (chosenDir === 'RIGHT') newHead[1] += 1;

      // Check wall collision (Wrap or Solid based on level)
      if (
        newHead[0] < 0 ||
        newHead[0] >= GRID_SIZE ||
        newHead[1] < 0 ||
        newHead[1] >= GRID_SIZE
      ) {
        handleCollision('Wall Boundary Collision');
        return prevSnake;
      }

      // Check obstacle collision
      if (obstacles.some(([ox, oy]) => ox === newHead[0] && oy === newHead[1])) {
        handleCollision('Obstacle Collision');
        return prevSnake;
      }

      // Check self-collision
      if (prevSnake.some(([sx, sy]) => sx === newHead[0] && sy === newHead[1])) {
        handleCollision('Self Body Collision');
        return prevSnake;
      }

      // Check food ingestion
      const isEating = newHead[0] === food[0] && newHead[1] === food[1];
      const newSnake = [newHead, ...prevSnake];

      if (isEating) {
        if (sounds) sounds.playCoin();
        const newScore = score + 1;
        setScore(newScore);

        if (setHighlightLine) setHighlightLine(2);
        if (setGameAction) setGameAction(`Food ingested! Queue length expanded to ${newSnake.length}.`);

        // Check level completion
        if (newScore >= targetScore) {
          setIsRunning(false);
          if (onComplete) {
            onComplete({
              steps_executed: stepCount + 1,
              optimal_steps: targetScore * 5,
              mistakes: 0
            });
          }
          return newSnake;
        }

        // Spawn new food position not in snake or obstacles
        let nextFood = [
          Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
          Math.floor(Math.random() * (GRID_SIZE - 2)) + 1
        ];
        setFood(nextFood);
      } else {
        newSnake.pop(); // Remove tail
        if (sounds) sounds.playStep();
        if (setHighlightLine) setHighlightLine(3);
        if (setGameAction) setGameAction(`Head at (${newHead[0]}, ${newHead[1]}). Tail popped from queue.`);
      }

      setStepCount((prev) => prev + 1);
      return newSnake;
    });
  };

  const handleCollision = (reason) => {
    setIsRunning(false);
    setIsGameOver(true);
    if (recordMistake) recordMistake(reason);
    if (setGameAction) setGameAction(`Game Over: ${reason}. Reset to retry.`);
  };

  // Game loop interval
  useEffect(() => {
    let timer = null;
    if (isRunning && !isGameOver) {
      const delay = Math.max(120, Math.floor(450 / speed));
      timer = setInterval(() => {
        stepForward();
      }, delay);
    }
    return () => clearInterval(timer);
  }, [isRunning, isGameOver, direction, food, score, speed, aiMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) changeDirection('UP');
      else if (['ArrowDown', 'KeyS'].includes(e.code)) changeDirection('DOWN');
      else if (['ArrowLeft', 'KeyA'].includes(e.code)) changeDirection('LEFT');
      else if (['ArrowRight', 'KeyD'].includes(e.code)) changeDirection('RIGHT');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center' }}>
      {/* Game HUD Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '460px',
        padding: '0.6rem 1.2rem',
        background: 'rgba(15, 23, 42, 0.75)',
        borderRadius: '10px',
        border: '1px solid var(--border-color)',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#38bdf8', fontWeight: 800 }}>🐍 SNAKE QUEUE:</span>
          <span style={{ color: '#fff', fontWeight: 700 }}>{snake.length} segments</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Award size={16} color="#fbbf24" />
          <span style={{ color: '#fbbf24', fontWeight: 800 }}>
            Apples: {score} / {targetScore}
          </span>
        </div>
      </div>

      {/* 2D Retro Neon Grid Canvas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        gap: '2px',
        width: '360px',
        height: '360px',
        backgroundColor: '#050b14',
        padding: '8px',
        borderRadius: '14px',
        border: '2px solid rgba(56, 189, 248, 0.4)',
        boxShadow: '0 0 25px rgba(56, 189, 248, 0.2)'
      }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const r = Math.floor(index / GRID_SIZE);
          const c = index % GRID_SIZE;

          const isHead = snake[0][0] === r && snake[0][1] === c;
          const isBody = snake.slice(1).some(([sr, sc]) => sr === r && sc === c);
          const isFoodCell = food[0] === r && food[1] === c;
          const isObs = obstacles.some(([ox, oy]) => ox === r && oy === c);

          let cellBg = 'rgba(255, 255, 255, 0.02)';
          let cellContent = null;

          if (isHead) {
            cellBg = 'linear-gradient(135deg, #34d399, #10b981)';
            cellContent = (
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#000' }} />
            );
          } else if (isBody) {
            cellBg = 'rgba(52, 211, 153, 0.65)';
          } else if (isFoodCell) {
            cellBg = 'radial-gradient(circle, #f87171 40%, #ef4444 90%)';
            cellContent = <span style={{ fontSize: '1rem', lineHeight: 1 }}>🍎</span>;
          } else if (isObs) {
            cellBg = '#475569';
            cellContent = <span style={{ fontSize: '0.8rem' }}>🧱</span>;
          }

          return (
            <div
              key={index}
              style={{
                borderRadius: isHead ? '6px' : isBody ? '4px' : '3px',
                background: cellBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.08s ease'
              }}
            >
              {cellContent}
            </div>
          );
        })}
      </div>

      {/* Interactive Controller & AI Runner Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%', maxWidth: '420px' }}>
        {/* D-Pad Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 44px)', gap: '6px', justifyContent: 'center' }}>
          <div />
          <button
            onClick={() => changeDirection('UP')}
            className="btn-secondary"
            style={{ padding: '8px', background: direction === 'UP' ? 'rgba(56, 189, 248, 0.3)' : undefined }}
          >
            <ArrowUp size={18} />
          </button>
          <div />
          <button
            onClick={() => changeDirection('LEFT')}
            className="btn-secondary"
            style={{ padding: '8px', background: direction === 'LEFT' ? 'rgba(56, 189, 248, 0.3)' : undefined }}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => changeDirection('DOWN')}
            className="btn-secondary"
            style={{ padding: '8px', background: direction === 'DOWN' ? 'rgba(56, 189, 248, 0.3)' : undefined }}
          >
            <ArrowDown size={18} />
          </button>
          <button
            onClick={() => changeDirection('RIGHT')}
            className="btn-secondary"
            style={{ padding: '8px', background: direction === 'RIGHT' ? 'rgba(56, 189, 248, 0.3)' : undefined }}
          >
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Execution & Automation Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
          <button
            onClick={() => {
              setAiMode(false);
              setIsRunning(!isRunning);
              if (sounds) sounds.playClick();
            }}
            className="btn-primary"
            style={{
              padding: '10px 18px',
              background: isRunning && !aiMode ? '#ef4444' : 'linear-gradient(135deg, #10b981, #059669)',
              fontWeight: 800
            }}
          >
            {isRunning && !aiMode ? 'PAUSE ⏸' : <><Play size={16} /> MANUAL PLAY ▶</>}
          </button>

          <button
            onClick={() => {
              setAiMode(true);
              setIsRunning(true);
              if (sounds) sounds.playClick();
            }}
            className="btn-secondary"
            style={{
              padding: '10px 16px',
              borderColor: aiMode && isRunning ? '#38bdf8' : undefined,
              color: aiMode && isRunning ? '#38bdf8' : '#c7d2fe',
              fontWeight: 700
            }}
          >
            <Sparkles size={16} /> {aiMode && isRunning ? 'AI RUNNING...' : 'EXECUTE AI SCRIPT ▶'}
          </button>

          <button
            onClick={resetGame}
            className="btn-secondary"
            style={{ padding: '10px 14px' }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnakeAI;
