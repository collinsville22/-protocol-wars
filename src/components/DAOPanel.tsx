'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import useGameState from '@/hooks/useGameState';
import { DAO, UnitType, ResourceType } from '@/types/game';
import { HoneycombService } from '@/lib/honeycomb';

export default function DAOPanel() {
  const wallet = useWallet();
  const { daos, addDAO, updateDAO } = useGameState();
  const [selectedDAO, setSelectedDAO] = useState<DAO | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newDAOName, setNewDAOName] = useState('');
  const [honeycomb] = useState(() => new HoneycombService());

  // Find player's DAO
  const playerDAO = daos.find(dao => dao.leader === wallet.publicKey?.toString());

  useEffect(() => {
    if (playerDAO) {
      setSelectedDAO(playerDAO);
    }
  }, [playerDAO]);

  const handleCreateDAO = async () => {
    if (!wallet.publicKey || !newDAOName.trim()) return;
    
    setIsCreating(true);
    try {
      // Create DAO profile via Honeycomb
      const { profileAddress } = await honeycomb.createDAO(newDAOName, wallet.publicKey);
      
      const newDAO: DAO = {
        id: profileAddress.toString(),
        name: newDAOName,
        treasury: wallet.publicKey.toString(),
        level: 1,
        territories: [],
        units: [],
        resources: {
          computing: 1000,
          liquidity: 1000,
          community: 1000,
          governance: 100,
        },
        alliances: [],
        color: getRandomDAOColor(),
        leader: wallet.publicKey.toString(),
      };
      
      addDAO(newDAO);
      setSelectedDAO(newDAO);
      setNewDAOName('');
    } catch (error) {
      console.error('Failed to create DAO:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateUnit = async (unitType: UnitType) => {
    if (!wallet.publicKey || !selectedDAO) return;
    
    try {
      const { unitAddress } = await honeycomb.createUnit(
        selectedDAO.id, 
        unitType, 
        wallet.publicKey
      );
      
      const newUnit = {
        id: unitAddress.toString(),
        type: unitType,
        owner: selectedDAO.id,
        traits: [],
        experience: 0,
        level: 1,
      };
      
      const updatedDAO = {
        ...selectedDAO,
        units: [...selectedDAO.units, newUnit],
      };
      
      updateDAO(updatedDAO);
    } catch (error) {
      console.error('Failed to create unit:', error);
    }
  };

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'computing': return '⚡';
      case 'liquidity': return '💧';
      case 'community': return '👥';
      case 'governance': return '🗳️';
    }
  };

  const getUnitIcon = (type: UnitType) => {
    switch (type) {
      case 'validator': return '🛡️';
      case 'developer': return '👨‍💻';
      case 'degen': return '🎲';
      case 'whale': return '🐋';
    }
  };

  const getRandomDAOColor = () => {
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (!wallet.connected) {
    return (
      <div className="bg-gray-900/50 rounded-lg border border-blue-500/30 p-4">
        <h3 className="text-lg font-gaming text-blue-400 mb-3">Connect Wallet</h3>
        <p className="text-gray-400 text-sm">
          Connect your Solana wallet to create or join a DAO and start battling for blockchain supremacy!
        </p>
      </div>
    );
  }

  if (!playerDAO && !isCreating) {
    return (
      <div className="bg-gray-900/50 rounded-lg border border-blue-500/30 p-4">
        <h3 className="text-lg font-gaming text-blue-400 mb-3">Create Your DAO</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter DAO name..."
            value={newDAOName}
            onChange={(e) => setNewDAOName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleCreateDAO}
            disabled={!newDAOName.trim()}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-gaming rounded transition-all"
          >
            Create DAO
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-blue-500/10 rounded border border-blue-500/30">
          <h4 className="text-blue-400 font-bold mb-2">🏆 What you get:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• On-chain DAO identity via Honeycomb</li>
            <li>• Starting resources and treasury</li>
            <li>• Ability to recruit units</li>
            <li>• Territory conquest capabilities</li>
          </ul>
        </div>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="bg-gray-900/50 rounded-lg border border-blue-500/30 p-4">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-gray-400">Creating your DAO on Honeycomb Protocol...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-lg border border-blue-500/30 p-4 space-y-4">
      {/* DAO Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-gaming text-blue-400">{selectedDAO?.name}</h3>
          <p className="text-sm text-gray-400">Level {selectedDAO?.level}</p>
        </div>
        <div 
          className="w-8 h-8 rounded-full" 
          style={{ backgroundColor: selectedDAO?.color }}
        />
      </div>

      {/* Resources */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-gray-300">Resources</h4>
        <div className="grid grid-cols-2 gap-2">
          {selectedDAO && Object.entries(selectedDAO.resources).map(([type, amount]) => (
            <div key={type} className="bg-gray-800/50 rounded p-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>{getResourceIcon(type as ResourceType)}</span>
                <span className="text-xs text-gray-400 capitalize">{type}</span>
              </div>
              <span className="text-sm font-bold text-white">{Math.floor(amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Units */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold text-gray-300">Units ({selectedDAO?.units.length})</h4>
          <button className="text-xs text-blue-400 hover:text-blue-300">
            View All
          </button>
        </div>
        
        <div className="space-y-2">
          {selectedDAO?.units.slice(0, 3).map(unit => (
            <div key={unit.id} className="bg-gray-800/50 rounded p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>{getUnitIcon(unit.type)}</span>
                  <div>
                    <div className="text-sm font-bold text-white capitalize">
                      {unit.type}
                    </div>
                    <div className="text-xs text-gray-400">
                      Level {unit.level} • {unit.experience} XP
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {unit.traits.map(trait => (
                    <div 
                      key={trait.id}
                      className="w-2 h-2 rounded-full bg-green-400"
                      title={`${trait.category} trait`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unit Creation */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-gray-300">Recruit Units</h4>
        <div className="grid grid-cols-2 gap-2">
          {(['validator', 'developer', 'degen', 'whale'] as UnitType[]).map(unitType => (
            <button
              key={unitType}
              onClick={() => handleCreateUnit(unitType)}
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 hover:border-gray-500 rounded text-xs transition-all"
            >
              <div className="text-lg mb-1">{getUnitIcon(unitType)}</div>
              <div className="capitalize text-white font-bold">{unitType}</div>
              <div className="text-gray-400">100 💧</div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="pt-2 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-sm font-bold text-green-400">
              {selectedDAO?.territories.length || 0}
            </div>
            <div className="text-xs text-gray-400">Territories</div>
          </div>
          <div>
            <div className="text-sm font-bold text-blue-400">
              {selectedDAO?.alliances.length || 0}
            </div>
            <div className="text-xs text-gray-400">Alliances</div>
          </div>
          <div>
            <div className="text-sm font-bold text-purple-400">
              {Math.floor((selectedDAO?.level || 0) * 100 + (selectedDAO?.territories.length || 0) * 50)}
            </div>
            <div className="text-xs text-gray-400">Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}