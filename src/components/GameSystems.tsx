'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameState from '@/hooks/useGameState';
import { ResourceType, UnitType, LeaderboardEntry } from '@/types/game';

interface ResourcePanelProps {
  className?: string;
}

export function ResourcePanel({ className = '' }: ResourcePanelProps) {
  const { daos } = useGameState();
  const playerDAO = daos.find(dao => dao.id === 'player_dao');
  
  if (!playerDAO) return null;

  const resourceTypes: ResourceType[] = ['computing', 'liquidity', 'community', 'governance'];
  
  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'computing': return '💻';
      case 'liquidity': return '💰';
      case 'community': return '👥';
      case 'governance': return '🏛️';
    }
  };

  const getResourceColor = (type: ResourceType) => {
    switch (type) {
      case 'computing': return 'text-blue-400';
      case 'liquidity': return 'text-green-400';
      case 'community': return 'text-orange-400';
      case 'governance': return 'text-purple-400';
    }
  };

  return (
    <div className={`bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4 ${className}`}>
      <h3 className="text-lg font-gaming text-blue-400 mb-3 flex items-center">
        <span className="mr-2">⚡</span>
        Resource Treasury
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {resourceTypes.map(type => {
          const amount = playerDAO.resources[type];
          const production = playerDAO.territories
            .filter(t => t.resourceType === type)
            .reduce((sum, t) => sum + t.productionRate, 0);
          
          return (
            <motion.div
              key={type}
              className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/30"
              whileHover={{ scale: 1.02, borderColor: 'rgba(59, 130, 246, 0.5)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 capitalize flex items-center">
                  {getResourceIcon(type)} {type}
                </span>
                <span className={`text-xs ${getResourceColor(type)} font-bold`}>
                  +{production}/min
                </span>
              </div>
              <div className={`text-xl font-bold ${getResourceColor(type)}`}>
                {Math.floor(amount).toLocaleString()}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/20">
        <div className="text-xs text-gray-300 mb-1">Total Production</div>
        <div className="text-lg font-bold text-blue-400">
          +{resourceTypes.reduce((total, type) => 
            total + playerDAO.territories
              .filter(t => t.resourceType === type)
              .reduce((sum, t) => sum + t.productionRate, 0), 0
          )}/min
        </div>
      </div>
    </div>
  );
}

interface UnitDeploymentProps {
  className?: string;
}

export function UnitDeployment({ className = '' }: UnitDeploymentProps) {
  const { deployUnit, daos } = useGameState();
  const [selectedUnit, setSelectedUnit] = useState<UnitType>('validator');
  const [deploymentMode, setDeploymentMode] = useState(false);
  
  const playerDAO = daos.find(dao => dao.id === 'player_dao');
  
  const unitTypes: { type: UnitType; cost: Record<ResourceType, number>; description: string }[] = [
    {
      type: 'validator',
      cost: { computing: 500, liquidity: 200, community: 100, governance: 50 },
      description: 'High defense, network security'
    },
    {
      type: 'developer',
      cost: { computing: 300, liquidity: 100, community: 300, governance: 100 },
      description: 'Resource generation boost'
    },
    {
      type: 'degen',
      cost: { computing: 200, liquidity: 400, community: 200, governance: 50 },
      description: 'High speed, low cost raids'
    },
    {
      type: 'whale',
      cost: { computing: 800, liquidity: 1000, community: 500, governance: 300 },
      description: 'Massive attack power'
    }
  ];

  const canAfford = (costs: Record<ResourceType, number>) => {
    if (!playerDAO) return false;
    return Object.entries(costs).every(([resource, cost]) => 
      playerDAO.resources[resource as ResourceType] >= cost
    );
  };

  const handleDeploy = (unitType: UnitType) => {
    const unit = unitTypes.find(u => u.type === unitType);
    if (!unit || !canAfford(unit.cost)) return;
    
    deployUnit(unitType, { q: 0, r: 0, s: 0 }); // Deploy at center for now
    setDeploymentMode(false);
  };

  const getUnitIcon = (type: UnitType) => {
    switch (type) {
      case 'validator': return '🛡️';
      case 'developer': return '👨‍💻';
      case 'degen': return '🚀';
      case 'whale': return '🐋';
    }
  };

  return (
    <div className={`bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-gaming text-purple-400 flex items-center">
          <span className="mr-2">⚔️</span>
          Unit Deployment
        </h3>
        <button
          onClick={() => setDeploymentMode(!deploymentMode)}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            deploymentMode 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {deploymentMode ? 'Cancel' : 'Deploy'}
        </button>
      </div>

      <div className="space-y-3">
        {unitTypes.map(unit => {
          const affordable = canAfford(unit.cost);
          
          return (
            <motion.div
              key={unit.type}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedUnit === unit.type
                  ? 'bg-purple-900/30 border-purple-500/50'
                  : affordable
                  ? 'bg-gray-800/50 border-gray-600/30 hover:border-purple-500/30'
                  : 'bg-gray-800/30 border-gray-700/20 opacity-50'
              }`}
              onClick={() => affordable && setSelectedUnit(unit.type)}
              whileHover={affordable ? { scale: 1.02 } : {}}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getUnitIcon(unit.type)}</span>
                  <span className="font-bold text-white capitalize">{unit.type}</span>
                </div>
                {deploymentMode && selectedUnit === unit.type && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeploy(unit.type);
                    }}
                    disabled={!affordable}
                    className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded disabled:opacity-50"
                  >
                    Deploy
                  </button>
                )}
              </div>
              
              <div className="text-xs text-gray-400 mb-2">{unit.description}</div>
              
              <div className="flex flex-wrap gap-1">
                {Object.entries(unit.cost).map(([resource, cost]) => (
                  <span
                    key={resource}
                    className={`text-xs px-2 py-1 rounded ${
                      playerDAO && playerDAO.resources[resource as ResourceType] >= cost
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-red-900/30 text-red-400'
                    }`}
                  >
                    {cost}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {playerDAO && (
        <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">Active Units</div>
          <div className="text-lg font-bold text-purple-400">
            {playerDAO.units.length}/10
          </div>
        </div>
      )}
    </div>
  );
}

interface BattleLogProps {
  className?: string;
}

export function BattleLog({ className = '' }: BattleLogProps) {
  const [battleEvents, setBattleEvents] = useState<Array<{
    id: string;
    type: 'attack' | 'defend' | 'capture' | 'deploy' | 'mission';
    message: string;
    timestamp: number;
    severity: 'info' | 'success' | 'warning' | 'error';
  }>>([]);

  useEffect(() => {
    // Simulate battle events for demo
    const events = [
      {
        id: '1',
        type: 'deploy' as const,
        message: 'Validator unit deployed to Hex_A7',
        timestamp: Date.now() - 30000,
        severity: 'info' as const
      },
      {
        id: '2',
        type: 'attack' as const,
        message: 'Degen squad initiated raid on enemy territory',
        timestamp: Date.now() - 45000,
        severity: 'warning' as const
      },
      {
        id: '3',
        type: 'capture' as const,
        message: 'Successfully captured Liquidity Hub #12',
        timestamp: Date.now() - 60000,
        severity: 'success' as const
      },
      {
        id: '4',
        type: 'mission' as const,
        message: 'Mission "Governance Raid" completed (+500 XP)',
        timestamp: Date.now() - 90000,
        severity: 'success' as const
      }
    ];
    setBattleEvents(events);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'attack': return '⚔️';
      case 'defend': return '🛡️';
      case 'capture': return '🏆';
      case 'deploy': return '🚀';
      case 'mission': return '📋';
      default: return '📡';
    }
  };

  return (
    <div className={`bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4 ${className}`}>
      <h3 className="text-lg font-gaming text-green-400 mb-3 flex items-center">
        <span className="mr-2">📊</span>
        Battle Log
      </h3>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {battleEvents.map(event => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-3 bg-gray-800/30 rounded-lg border border-gray-600/20"
            >
              <div className="flex items-start space-x-2">
                <span className="text-sm">{getEventIcon(event.type)}</span>
                <div className="flex-1">
                  <div className={`text-sm ${getSeverityColor(event.severity)}`}>
                    {event.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="mt-3 flex space-x-2">
        <button className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded">
          Clear Log
        </button>
        <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded">
          Export
        </button>
      </div>
    </div>
  );
}

interface LeaderboardPanelProps {
  className?: string;
}

export function LeaderboardPanel({ className = '' }: LeaderboardPanelProps) {
  const { leaderboard } = useGameState();
  const [viewMode, setViewMode] = useState<'global' | 'seasonal'>('global');

  return (
    <div className={`bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-gaming text-yellow-400 flex items-center">
          <span className="mr-2">🏆</span>
          Leaderboard
        </h3>
        <div className="flex bg-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('global')}
            className={`px-3 py-1 text-xs font-bold ${
              viewMode === 'global' 
                ? 'bg-yellow-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Global
          </button>
          <button
            onClick={() => setViewMode('seasonal')}
            className={`px-3 py-1 text-xs font-bold ${
              viewMode === 'seasonal' 
                ? 'bg-yellow-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Season
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {leaderboard.slice(0, 10).map((entry, index) => (
          <motion.div
            key={entry.daoId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-lg border ${
              index === 0 
                ? 'bg-yellow-900/20 border-yellow-500/30' 
                : index < 3 
                ? 'bg-gray-800/40 border-gray-500/30'
                : 'bg-gray-800/20 border-gray-600/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 
                    ? 'bg-yellow-500 text-black' 
                    : index === 1 
                    ? 'bg-gray-400 text-black'
                    : index === 2 
                    ? 'bg-orange-500 text-black'
                    : 'bg-gray-600 text-white'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-bold text-white">
                    {entry.daoId.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {entry.territoriesControlled} territories • {entry.battlesWon} wins
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-yellow-400">
                  {entry.score.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">points</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg border border-yellow-500/20">
        <div className="text-xs text-gray-300 mb-1">Season 1 Rewards</div>
        <div className="text-sm font-bold text-yellow-400">
          🥇 10,000 SOL • 🥈 5,000 SOL • 🥉 2,500 SOL
        </div>
      </div>
    </div>
  );
}