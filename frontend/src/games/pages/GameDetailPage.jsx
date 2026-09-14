import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import GameRunner from '../engine/GameRunner';

import RobotProgrammer from '../components/RobotProgrammer';
import LoopRunner from '../components/LoopRunner';
import ConditionalCity from '../components/ConditionalCity';
import VariableFactory from '../components/VariableFactory';
import FunctionMachine from '../components/FunctionMachine';
import ArrayAdventure from '../components/ArrayAdventure';
import AlgorithmMaze from '../components/AlgorithmMaze';
import DebugDetective from '../components/DebugDetective';
import SortingRace from '../components/SortingRace';
import RecursionTower from '../components/RecursionTower';
import LogicBuilder from '../components/LogicBuilder';
import DataStructureWorld from '../components/DataStructureWorld';
import SnakeAI from '../components/SnakeAI';

import { GAME_CATALOG } from '../engine/GameCatalog';

const GameDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [levels, setLevels] = useState([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const data = await api.get(`/games/${slug}/`);
        if (data && data.levels && data.levels.length > 0) {
          setGame(data);
          setLevels(data.levels || []);
        } else if (GAME_CATALOG[slug]) {
          setGame(GAME_CATALOG[slug]);
          setLevels(GAME_CATALOG[slug].levels || []);
        }
      } catch (e) {
        console.warn('Using local fallback for game:', slug, e);
        if (GAME_CATALOG[slug]) {
          setGame(GAME_CATALOG[slug]);
          setLevels(GAME_CATALOG[slug].levels || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#818cf8', fontWeight: 600 }}>
        Loading Code Logic Lab...
      </div>
    );
  }

  if (!game) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', maxWidth: '500px', margin: '3rem auto' }}>
        <h2>Game Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>The requested logic game could not be loaded.</p>
        <button onClick={() => navigate('/games')} className="btn-primary">Return to Game Hub</button>
      </div>
    );
  }

  const renderGameArena = (props) => {
    switch (slug) {
      case 'robot-programmer':
        return <RobotProgrammer {...props} />;
      case 'loop-runner':
        return <LoopRunner {...props} />;
      case 'conditional-city':
        return <ConditionalCity {...props} />;
      case 'variable-factory':
        return <VariableFactory {...props} />;
      case 'function-machine':
        return <FunctionMachine {...props} />;
      case 'array-adventure':
        return <ArrayAdventure {...props} />;
      case 'algorithm-maze':
        return <AlgorithmMaze {...props} />;
      case 'debug-detective':
        return <DebugDetective {...props} />;
      case 'sorting-race':
        return <SortingRace {...props} />;
      case 'recursion-tower':
        return <RecursionTower {...props} />;
      case 'logic-builder':
        return <LogicBuilder {...props} />;
      case 'data-structure-world':
        return <DataStructureWorld {...props} />;
      case 'snake-ai':
        return <SnakeAI {...props} />;
      default:
        return <RobotProgrammer {...props} />;
    }
  };

  return (
    <GameRunner
      game={game}
      levels={levels}
      currentLevelIndex={currentLevelIndex}
      onLevelChange={(newIdx) => setCurrentLevelIndex(newIdx)}
      renderGameArena={renderGameArena}
    />
  );
};

export default GameDetailPage;
