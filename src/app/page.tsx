'use client';

import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import BattlefieldMap from '@/components/BattlefieldMap';
import MissionPanel from '@/components/MissionPanel';
import DAOPanel from '@/components/DAOPanel';
import Leaderboard from '@/components/Leaderboard';
import { ResourcePanel, UnitDeployment, BattleLog, LeaderboardPanel } from '@/components/GameSystems';
import SoundSystem from '@/components/SoundSystem';
import useGameState from '@/hooks/useGameState';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { processGameTick, daos, territories, missions, leaderboard } = useGameState();

  useEffect(() => {
    setIsClient(true);
    
    // Start game loop
    const gameLoop = setInterval(() => {
      processGameTick();
    }, 1000);

    return () => clearInterval(gameLoop);
  }, [processGameTick]);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl font-gaming text-blue-400 animate-pulse">
          Protocol Wars Loading...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-2 lg:p-4">
      <SoundSystem enabled={true} />
      
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl lg:text-4xl font-gaming font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Protocol Wars
          </h1>
          <div className="text-xs lg:text-sm text-gray-400">
            Season {useGameState.getState().season.number}
          </div>
        </div>
        <div className="flex items-center space-x-2 lg:space-x-4">
          <WalletMultiButton className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" />
        </div>
      </header>

      {/* Main Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 lg:gap-6">
        {/* Left Panel - Resources & Unit Management */}
        <div className="lg:col-span-1 space-y-3 lg:space-y-4">
          <ResourcePanel />
          <UnitDeployment />
        </div>

        {/* Center - Battlefield */}
        <div className="lg:col-span-3">
          <div className="bg-gray-900/50 rounded-lg border border-blue-500/30 p-4">
            <h2 className="text-lg lg:text-xl font-gaming text-blue-400 mb-4">Battlefield</h2>
            <BattlefieldMap />
          </div>
        </div>

        {/* Right Panel - Battle Log & Leaderboard */}
        <div className="lg:col-span-2 space-y-3 lg:space-y-4">
          <BattleLog />
          <LeaderboardPanel />
          
          {/* Game Stats */}
          <div className="bg-gray-900/50 rounded-lg border border-purple-500/30 p-4">
            <h3 className="text-lg font-gaming text-purple-400 mb-3">Live Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Active DAOs:</span>
                <span className="text-white font-bold">{daos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Territories:</span>
                <span className="text-white font-bold">{territories.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Active Missions:</span>
                <span className="text-white font-bold">
                  {missions.filter(m => m.status === 'active').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Panels - Hidden on Mobile, Visible on Large Screens */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6 mt-6">
        <DAOPanel />
        <MissionPanel />
        <div className="col-span-2">
          <Leaderboard />
        </div>
      </div>

      {/* Mobile-friendly bottom navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm border-t border-blue-500/30">
        <div className="flex justify-around p-4">
          <button className="flex flex-col items-center text-xs text-blue-400">
            <div className="w-6 h-6 mb-1">🏰</div>
            <span>DAO</span>
          </button>
          <button className="flex flex-col items-center text-xs text-purple-400">
            <div className="w-6 h-6 mb-1">⚔️</div>
            <span>Battle</span>
          </button>
          <button className="flex flex-col items-center text-xs text-green-400">
            <div className="w-6 h-6 mb-1">📋</div>
            <span>Missions</span>
          </button>
          <button className="flex flex-col items-center text-xs text-yellow-400">
            <div className="w-6 h-6 mb-1">🏆</div>
            <span>Ranks</span>
          </button>
        </div>
      </div>
    </main>
  );
}