import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { 
  Gamepad2, 
  Sparkles, 
  Award, 
  Flame, 
  TrendingUp, 
  ArrowRight, 
  Code2, 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  Lock,
  Layers,
  BrainCircuit,
  Filter,
  Play
} from 'lucide-react';

const FALLBACK_GAMES = [
  { id: 1, slug: 'robot-programmer', title: 'Robot Programmer', category: 'LOGIC', concept: 'Sequential Execution & Commands', icon: '🤖', badge_color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', levels_count: 5, highest_level_unlocked: 5, stats: { total_xp: 150, average_accuracy: 100, adaptive_difficulty: 'BEGINNER' } },
  { id: 2, slug: 'loop-runner', title: 'Loop Runner', category: 'CONTROL_FLOW', concept: 'Loops, Bounds & Repetition', icon: '🔁', badge_color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)', levels_count: 5, highest_level_unlocked: 5, stats: { total_xp: 150, average_accuracy: 100, adaptive_difficulty: 'BEGINNER' } },
  { id: 3, slug: 'conditional-city', title: 'Conditional City', category: 'CONTROL_FLOW', concept: 'Boolean Logic & Branching', icon: '🚦', badge_color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)', levels_count: 5, highest_level_unlocked: 5, stats: { total_xp: 150, average_accuracy: 100, adaptive_difficulty: 'BEGINNER' } },
  { id: 4, slug: 'variable-factory', title: 'Variable Factory', category: 'STATE', concept: 'State, Accumulators & Swaps', icon: '📦', badge_color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', levels_count: 5, highest_level_unlocked: 5, stats: { total_xp: 150, average_accuracy: 100, adaptive_difficulty: 'BEGINNER' } },
  { id: 5, slug: 'function-machine', title: 'Function Machine', category: 'MODULARITY', concept: 'Parameters & Return Values', icon: '⚙️', badge_color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)', levels_count: 5, highest_level_unlocked: 5, stats: { total_xp: 150, average_accuracy: 100, adaptive_difficulty: 'BEGINNER' } },
  { id: 6, slug: 'array-adventure', title: 'Array Adventure', category: 'DATA_STRUCTURES', concept: 'Zero-Indexing & Slicing', icon: '🧱', badge_color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)', levels_count: 5, highest_level_unlocked: 5, stats: { total_xp: 150, average_accuracy: 100, adaptive_difficulty: 'BEGINNER' } },
  { id: 7, slug: 'algorithm-maze', title: 'Algorithm Maze', category: 'ALGORITHMS', concept: 'Search & Pathfinding', icon: '🧭', badge_color: '#14b8a6', gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)', levels_count: 5, highest_level_unlocked: 5, stats: { total_xp: 150, average_accuracy: 100, adaptive_difficulty: 'BEGINNER' } },
  { id: 8, slug: 'debug-detective', title: 'Debug Detective', category: 'DEBUGGING', concept: 'Syntax Traps & Logic Bugs', icon: '🔍', badge_color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', levels_count: 5, highest_level_unlocked: 5, stats: { total_xp: 150, average_accuracy: 100, adaptive_difficulty: 'BEGINNER' } },
  { id: 9, slug: 'sorting-race', title: 'Sorting Race', category: 'ALGORITHMS', concept: 'Bubble & Selection Sort', icon: '📊', badge_color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)', levels_count: 5, highest_level_unlocked: 5, stats: { total_xp: 150, average_accuracy: 100, adaptive_difficulty: 'BEGINNER' } },
  { id: 10, slug: 'recursion-tower', title: 'Recursion Tower', category: 'MODULARITY', concept: 'Call Stack & Base Cases', icon: '🗼', badge_color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7, #7e22ce)', levels_count: 5, highest_level_unlocked: 5, stats: { total_xp: 150, average_accuracy: 100, adaptive_difficulty: 'BEGINNER' } },
  { id: 11, slug: 'logic-builder', title: 'Logic Builder', category: 'LOGIC', concept: 'Boolean Logic Gates', icon: '⚡', badge_color: '#eab308', gradient: 'linear-gradient(135deg, #eab308, #ca8a04)', levels_count: 5, highest_level_unlocked: 5, stats: { total_xp: 150, average_accuracy: 100, adaptive_difficulty: 'BEGINNER' } },
  { id: 12, slug: 'data-structure-world', title: 'Data Structure World', category: 'DATA_STRUCTURES', concept: 'Stacks, Queues & Trees', icon: '🌳', badge_color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0284c7)', levels_count: 5, highest_level_unlocked: 5, stats: { total_xp: 150, average_accuracy: 100, adaptive_difficulty: 'BEGINNER' } },
  { id: 13, slug: 'snake-ai', title: 'Snake AI & 2D Queue', category: 'DATA_STRUCTURES', concept: '2D Coordinates, Vector Directions & Queue FIFO Memory', icon: '🐍', badge_color: '#34d399', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', levels_count: 5, highest_level_unlocked: 5, stats: { total_xp: 150, average_accuracy: 100, adaptive_difficulty: 'BEGINNER' } },
];

const GameHubPage = () => {
  const [hubData, setHubData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLang, setSelectedLang] = useState('python');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHub = async () => {
      try {
        const data = await api.get('/games/hub/');
        if (data && data.games && data.games.length > 0) {
          setHubData(data);
        } else {
          setHubData({ games: FALLBACK_GAMES });
        }
      } catch (e) {
        console.warn('Using local games fallback', e);
        setHubData({ games: FALLBACK_GAMES });
      } finally {
        setLoading(false);
      }
    };
    fetchHub();
  }, []);

  const games = (hubData?.games && hubData.games.length > 0) ? hubData.games : FALLBACK_GAMES;
  const daily = hubData?.daily_challenge;

  const filteredGames = games.filter(g => {
    if (selectedCategory === 'ALL') return true;
    return g.category === selectedCategory;
  });

  const categories = [
    { id: 'ALL', label: 'All Logic Games' },
    { id: 'LOGIC', label: '🧩 Core Logic' },
    { id: 'CONTROL_FLOW', label: '🔄 Loops & Conditions' },
    { id: 'STATE', label: '📦 Variables & State' },
    { id: 'MODULARITY', label: '🧠 Functions & Recursion' },
    { id: 'DATA_STRUCTURES', label: '🌳 Data Structures' },
    { id: 'ALGORITHMS', label: '⚡ Algorithms & Sorting' },
    { id: 'DEBUGGING', label: '🐞 Debug Detective' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1240px', margin: '0 auto' }}>
      {/* Premier Header Banner */}
      <div className="glass-panel" style={{
        padding: '2.5rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1))',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            padding: '4px 14px',
            borderRadius: '999px',
            marginBottom: '0.8rem'
          }}>
            <Sparkles size={16} color="#818cf8" />
            <span style={{ fontSize: '0.8rem', color: '#c7d2fe', fontWeight: 700, letterSpacing: '0.04em' }}>
              INTERACTIVE CODE LOGIC LEARNING SYSTEM
            </span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            🎮 CODE LOGIC LAB
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '720px', lineHeight: 1.6 }}>
            Understand programming fundamentals naturally through gameplay. Control execution flow, variables, loops, recursion, and algorithms.
          </p>
        </div>

        {/* Action Badges */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/games/leaderboard" className="btn-secondary" style={{ padding: '10px 18px' }}>
            <Trophy size={16} color="#fbbf24" /> Game Leaderboard
          </Link>
          <Link to="/practice" className="btn-secondary" style={{ padding: '10px 18px' }}>
            <BrainCircuit size={16} color="#06b6d4" /> AI Diagnostics
          </Link>
        </div>
      </div>

      {/* Gamified Metric Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div className="glass-panel" style={{ padding: '1.3rem', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={22} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>LOGIC GAME XP</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>
              {hubData?.total_game_xp || 0} XP
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.3rem', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>LEVELS MASTERED</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
              {hubData?.total_levels_completed || 0} Levels
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.3rem', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={22} color="#ef4444" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DAILY STREAK</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171' }}>
              {hubData?.student_streak || 1} Days
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.3rem', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Gamepad2 size={22} color="#818cf8" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL GAMES</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c7d2fe' }}>
              {games.length} Games Available
            </div>
          </div>
        </div>
      </div>

      {/* Daily Code Challenge Banner */}
      {daily && (
        <div className="glass-panel" style={{
          padding: '1.8rem 2rem',
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(245, 158, 11, 0.05))',
          border: '1px solid rgba(234, 179, 8, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #d97706, #fbbf24)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)'
            }}>
              {daily.game_icon || '🎮'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ⭐ TODAY'S DAILY CODE CHALLENGE
                </span>
                {daily.is_completed && (
                  <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                    ✓ COMPLETED (+{daily.xp_reward} XP)
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                {daily.title}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Target Concept: <span style={{ color: '#c7d2fe', fontWeight: 600 }}>{daily.target_concept}</span> • Difficulty: {daily.difficulty}
              </p>
            </div>
          </div>

          <Link
            to={`/games/${daily.game_slug}`}
            className="btn-primary"
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #d97706, #fbbf24)',
              color: '#000000',
              fontWeight: 800
            }}
          >
            {daily.is_completed ? 'Replay Challenge' : 'Play Today\'s Challenge (+100 XP)'} <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Language & Category Filtering Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '0 4px'
      }}>
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: selectedCategory === cat.id ? '1px solid #818cf8' : '1px solid var(--border-color)',
                background: selectedCategory === cat.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedCategory === cat.id ? '#c7d2fe' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Programming Language Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>LANGUAGE:</span>
          {['python', 'javascript', 'cpp'].map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: selectedLang === lang ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedLang === lang ? '#ffffff' : 'var(--text-secondary)'
              }}
            >
              {lang === 'cpp' ? 'C++' : lang === 'python' ? 'Python' : 'JS'}
            </button>
          ))}
        </div>
      </div>

      {/* 12 Game Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        {filteredGames.map((game) => {
          const prog = game.user_progress || {};
          const isMastered = prog.is_mastered;
          const currentTier = prog.adaptive_difficulty || 'BEGINNER';

          return (
            <div
              key={game.id}
              className="glass-panel"
              style={{
                padding: '1.8rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                border: isMastered ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)'
              }}
            >
              {/* Top Accent Gradient Line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: game.gradient || 'var(--primary-gradient)'
              }} />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem'
                  }}>
                    {game.icon}
                  </div>

                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    color: '#818cf8',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                  }}>
                    {currentTier}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                  {game.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '8px' }}>
                  {game.concept}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  {game.tagline || game.description}
                </p>
              </div>

              {/* Progress & Launch Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px', color: 'var(--text-muted)' }}>
                  <span>Levels: {prog.levels_completed || 0} / {game.total_levels || 5}</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>{prog.average_accuracy || 100}% Accuracy</span>
                </div>

                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  marginBottom: '1.2rem'
                }}>
                  <div style={{
                    width: `${Math.min(100, ((prog.levels_completed || 0) / (game.total_levels || 5)) * 100)}%`,
                    height: '100%',
                    background: game.gradient || 'var(--primary-gradient)',
                    transition: 'width 0.4s ease'
                  }} />
                </div>

                <Link
                  to={`/games/${game.slug}`}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '10px 0', fontSize: '0.9rem' }}
                >
                  <Play size={16} /> {prog.levels_completed > 0 ? 'Continue Game' : 'Play Game'}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameHubPage;
