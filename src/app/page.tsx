'use client';

import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import BattlefieldMap from '@/components/BattlefieldMap';
import MissionPanel from '@/components/MissionPanel';
import DAOPanel from '@/components/DAOPanel';
import Leaderboard from '@/components/Leaderboard';
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
    <main className="min-h-screen p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-4xl font-gaming font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Protocol Wars
          </h1>
          <div className="text-sm text-gray-400">
            Season {useGameState.getState().season.number}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <WalletMultiButton className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" />
        </div>
      </header>

      {/* Main Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - DAO Management */}
        <div className="lg:col-span-1 space-y-4">
          <DAOPanel />
          <MissionPanel />
        </div>

        {/* Center - Battlefield */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900/50 rounded-lg border border-blue-500/30 p-4">
            <h2 className="text-xl font-gaming text-blue-400 mb-4">Battlefield</h2>
            <BattlefieldMap />
          </div>
        </div>

        {/* Right Panel - Leaderboard & Stats */}
        <div className="lg:col-span-1 space-y-4">
          <Leaderboard />
          
          {/* Game Stats */}
          <div className="bg-gray-900/50 rounded-lg border border-purple-500/30 p-4">
            <h3 className="text-lg font-gaming text-purple-400 mb-3">Game Stats</h3>
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