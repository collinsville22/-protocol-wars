'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import useGameState from '@/hooks/useGameState';
import { Mission } from '@/types/game';
import { HoneycombService } from '@/lib/honeycomb';

export default function MissionPanel() {
  const wallet = useWallet();
  const { daos, missions, addMission, updateMission } = useGameState();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [honeycomb] = useState(() => new HoneycombService());

  const playerDAO = daos.find(dao => dao.leader === wallet.publicKey?.toString());
  const playerMissions = missions.filter(m => 
    playerDAO && m.participants.includes(playerDAO.id)
  );

  const activeMissions = playerMissions.filter(m => m.status === 'active');
  const completedMissions = playerMissions.filter(m => m.status === 'completed');

  const getMissionIcon = (type: Mission['type']) => {
    switch (type) {
      case 'attack': return '⚔️';
      case 'defend': return '🛡️';
      case 'harvest': return '🌾';
      case 'raid': return '💥';
    }
  };

  const getMissionColor = (type: Mission['type']) => {
    switch (type) {
      case 'attack': return 'text-red-400';
      case 'defend': return 'text-blue-400';
      case 'harvest': return 'text-green-400';
      case 'raid': return 'text-purple-400';
    }
  };

  const getTimeRemaining = (mission: Mission) => {
    if (!mission.startTime || mission.status !== 'active') return null;
    
    const elapsed = Date.now() - mission.startTime;
    const remaining = (mission.duration * 1000) - elapsed;
    
    if (remaining <= 0) return 'Completing...';
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCreateQuickMission = async (type: Mission['type']) => {
    if (!playerDAO) return;
    
    try {
      // Create mission pool first if needed
      const poolName = `${type}_missions`;
      const { poolAddress } = await honeycomb.createMissionPool(poolName, wallet.publicKey!);
      
      // Create the mission
      const missionName = `${type}_${Date.now()}`;
      const duration = type === 'harvest' ? 300 : 180; // 5 min harvest, 3 min others
      const resourceCost = {
        address: 'dummy_resource_address',
        amount: type === 'raid' ? '200' : '100'
      };
      
      const { missionAddress } = await honeycomb.createBattleMission(
        missionName,
        poolAddress.toString(),
        duration,
        0, // No minimum XP for demo
        resourceCost,
        wallet.publicKey!
      );
      
      const newMission: Mission = {
        id: missionAddress.toString(),
        type: type,
        participants: [playerDAO.id],
        target: type === 'harvest' ? undefined : 'random_territory',
        duration: duration,
        rewards: [
          { type: 'xp', amount: type === 'raid' ? 150 : 100 },
          { type: 'resource', amount: type === 'harvest' ? 500 : 250, resourceType: 'computing' }
        ],
        status: 'active',
        startTime: Date.now(),
      };
      
      addMission(newMission);
    } catch (error) {
      console.error(`Failed to create ${type} mission:`, error);
    }
  };

  const handleRecallMission = async (mission: Mission) => {
    if (!playerDAO) return;
    
    try {
      // Get units on this mission (simplified for demo)
      const unitsOnMission = playerDAO.units.filter(unit => 
        unit.currentMission === mission.id
      );
      
      if (unitsOnMission.length > 0) {
        const unitAddresses = unitsOnMission.map(unit => unit.id);
        await honeycomb.recallUnits(mission.id, unitAddresses, wallet.publicKey!);
      }
      
      updateMission(mission.id, { status: 'completed' });
    } catch (error) {
      console.error('Failed to recall mission:', error);
    }
  };

  if (!wallet.connected || !playerDAO) {
    return (
      <div className="bg-gray-900/50 rounded-lg border border-green-500/30 p-4">
        <h3 className="text-lg font-gaming text-green-400 mb-3">Missions</h3>
        <p className="text-gray-400 text-sm">
          Create a DAO to access Honeycomb Protocol missions and start earning rewards!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-lg border border-green-500/30 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-gaming text-green-400">Missions</h3>
        <div className="text-xs text-gray-400">
          {activeMissions.length} active
        </div>
      </div>

      {/* Quick Mission Creation */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-gray-300">Quick Deploy</h4>
        <div className="grid grid-cols-2 gap-2">
          {(['attack', 'defend', 'harvest', 'raid'] as const).map(type => (
            <button
              key={type}
              onClick={() => handleCreateQuickMission(type)}
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 hover:border-gray-500 rounded text-xs transition-all"
            >
              <div className="text-lg mb-1">{getMissionIcon(type)}</div>
              <div className={`capitalize font-bold ${getMissionColor(type)}`}>
                {type}
              </div>
              <div className="text-gray-400">
                {type === 'harvest' ? '5min' : '3min'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Missions */}
      {activeMissions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-gray-300">Active Missions</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {activeMissions.map(mission => (
              <div key={mission.id} className="bg-gray-800/50 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span>{getMissionIcon(mission.type)}</span>
                    <span className={`text-sm font-bold capitalize ${getMissionColor(mission.type)}`}>
                      {mission.type}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {getTimeRemaining(mission)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    {mission.participants.length} units deployed
                  </div>
                  <button
                    onClick={() => handleRecallMission(mission)}
                    className="px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs rounded border border-red-600/30"
                  >
                    Recall
                  </button>
                </div>

                {/* Mission progress bar */}
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div 
                      className="bg-green-500 h-1 rounded-full transition-all duration-1000"
                      style={{ 
                        width: mission.startTime 
                          ? `${Math.min(100, ((Date.now() - mission.startTime) / (mission.duration * 1000)) * 100)}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mission History */}
      {completedMissions.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-gray-300">Recent Completions</h4>
            <button className="text-xs text-green-400 hover:text-green-300">
              View All
            </button>
          </div>
          
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {completedMissions.slice(0, 3).map(mission => (
              <div key={mission.id} className="bg-green-500/10 rounded p-2 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{getMissionIcon(mission.type)}</span>
                    <span className="text-xs text-green-400 capitalize">
                      {mission.type} Complete
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    +{mission.rewards.reduce((sum, r) => sum + r.amount, 0)} rewards
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mission Stats */}
      <div className="pt-2 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-sm font-bold text-green-400">
              {completedMissions.length}
            </div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
          <div>
            <div className="text-sm font-bold text-yellow-400">
              {activeMissions.length}
            </div>
            <div className="text-xs text-gray-400">Active</div>
          </div>
          <div>
            <div className="text-sm font-bold text-purple-400">
              {completedMissions.reduce((sum, m) => 
                sum + m.rewards.reduce((rSum, r) => rSum + r.amount, 0), 0
              )}
            </div>
            <div className="text-xs text-gray-400">Total XP</div>
          </div>
        </div>
      </div>

      {/* Honeycomb Integration Notice */}
      <div className="bg-blue-500/10 rounded p-2 border border-blue-500/20">
        <div className="text-xs text-blue-400 flex items-center space-x-1">
          <span>🍯</span>
          <span>Powered by Honeycomb Protocol</span>
        </div>
      </div>
    </div>
  );
}