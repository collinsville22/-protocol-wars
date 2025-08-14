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
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <SoundSystem enabled={true} />
      
      {/* TLOU2-Inspired Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-red-900 opacity-70"></div>
      <div className="fixed inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Tactical Header */}
      <header className="relative z-10 bg-black/80 border-b border-red-500/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-white">
                <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-pulse">
                  PROTOCOL
                </span>
                <span className="text-white ml-2">WARS</span>
              </h1>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-transparent"></div>
            </div>
            <div className="text-sm font-mono text-gray-400">
              <div>COMBAT SEASON {useGameState.getState().season.number}</div>
              <div className="text-red-400 animate-pulse">⚠ THREAT LEVEL: HIGH</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-mono">
              <div className="text-gray-400">CONNECTION STATUS:</div>
              <div className="text-green-400 animate-pulse">● SECURE</div>
            </div>
            <WalletMultiButton className="!bg-gradient-to-r !from-red-600 !to-red-700 hover:!from-red-700 hover:!to-red-800 !border-2 !border-red-400" />
          </div>
        </div>
      </header>

      {/* Epic Mission Briefing */}
      <div className="relative z-10 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 mx-4 mt-6 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-red-400">CURRENT OBJECTIVE</h2>
              <p className="text-gray-300">Establish DAO supremacy across blockchain territories</p>
            </div>
          </div>
          <div className="text-right font-mono">
            <div className="text-yellow-400 text-2xl font-bold">75%</div>
            <div className="text-xs text-gray-400">MISSION PROGRESS</div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-full h-3 overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-red-500 to-yellow-500 h-full rounded-full animate-pulse" style={{width: '75%'}}></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-black/50 p-3 rounded border border-red-500/20">
            <div className="text-red-400 font-bold">🏃 ACTIVE TASK</div>
            <div className="text-white">Deploy 5 Validator Units</div>
            <div className="text-gray-400">Reward: +1000 XP, +500 SOL</div>
          </div>
          <div className="bg-black/50 p-3 rounded border border-yellow-500/20">
            <div className="text-yellow-400 font-bold">⏳ PENDING</div>
            <div className="text-white">Capture 3 Territories</div>
            <div className="text-gray-400">Unlock: Advanced Units</div>
          </div>
          <div className="bg-black/50 p-3 rounded border border-green-500/20">
            <div className="text-green-400 font-bold">✓ COMPLETED</div>
            <div className="text-white">Connect Wallet</div>
            <div className="text-gray-400">+100 XP Earned</div>
          </div>
        </div>
      </div>

      {/* Main Game Area with Dark Theme */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-6 gap-4 lg:gap-6 p-4">
        {/* Left Panel - Enhanced Resources & Unit Management */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-black/80 border border-red-500/30 rounded-lg">
            <ResourcePanel />
          </div>
          <div className="bg-black/80 border border-purple-500/30 rounded-lg">
            <UnitDeployment />
          </div>
        </div>

        {/* Center - Enhanced 3D Battlefield */}
        <div className="lg:col-span-3">
          <div className="bg-black/90 border-2 border-red-500/50 rounded-lg p-4 shadow-2xl shadow-red-500/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-red-400 font-mono tracking-wider">🌍 COMBAT ZONE</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded font-bold animate-pulse">
                  ⚔️ ATTACK MODE
                </button>
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded font-bold">
                  🚀 DEPLOY
                </button>
              </div>
            </div>
            <div className="relative">
              <BattlefieldMap />
              <div className="absolute top-2 right-2 bg-black/80 p-2 rounded border border-yellow-500/50">
                <div className="text-xs font-mono text-yellow-400">TACTICAL OVERVIEW</div>
                <div className="text-xs text-white">Units: {daos.find(d => d.id === 'player_dao')?.units?.length || 0}/10</div>
                <div className="text-xs text-white">Territories: {territories.filter(t => t.owner === 'player_dao').length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Enhanced Intelligence */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-black/80 border border-green-500/30 rounded-lg">
            <BattleLog />
          </div>
          <div className="bg-black/80 border border-yellow-500/30 rounded-lg">
            <LeaderboardPanel />
          </div>
          
          {/* Enhanced Stats with TLOU2 Style */}
          <div className="bg-black/90 border border-red-500/30 rounded-lg p-4">
            <h3 className="text-lg font-bold text-red-400 mb-3 font-mono">📊 TACTICAL STATUS</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                <span className="text-gray-400 font-mono">ACTIVE DAOS:</span>
                <span className="text-white font-bold text-lg">{daos.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                <span className="text-gray-400 font-mono">TERRITORIES:</span>
                <span className="text-white font-bold text-lg">{territories.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                <span className="text-gray-400 font-mono">MISSIONS:</span>
                <span className="text-red-400 font-bold text-lg animate-pulse">
                  {missions.filter(m => m.status === 'active').length} ACTIVE
                </span>
              </div>
              <div className="mt-4 p-3 bg-gradient-to-r from-red-900/30 to-yellow-900/30 border border-red-500/20 rounded">
                <div className="text-xs font-mono text-yellow-400 mb-1">NEXT REWARD UNLOCK</div>
                <div className="text-white font-bold">Deploy 2 more units → +500 SOL</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Secondary Panels with TLOU2 Theme */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6 mt-6 px-4 relative z-10">
        <div className="bg-black/80 border border-blue-500/30 rounded-lg">
          <DAOPanel />
        </div>
        <div className="bg-black/80 border border-green-500/30 rounded-lg">
          <MissionPanel />
        </div>
        <div className="col-span-2 bg-black/80 border border-yellow-500/30 rounded-lg">
          <Leaderboard />
        </div>
      </div>

      {/* Enhanced Mobile Navigation with TLOU2 Style */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-red-500/50 z-50">
        <div className="flex justify-around p-4">
          <button className="flex flex-col items-center text-xs text-red-400 hover:text-red-300 transition-colors">
            <div className="w-8 h-8 mb-1 bg-red-600/20 rounded-full flex items-center justify-center border border-red-500/30">🏰</div>
            <span className="font-mono">DAO</span>
          </button>
          <button className="flex flex-col items-center text-xs text-yellow-400 hover:text-yellow-300 transition-colors">
            <div className="w-8 h-8 mb-1 bg-yellow-600/20 rounded-full flex items-center justify-center border border-yellow-500/30 animate-pulse">⚔️</div>
            <span className="font-mono">COMBAT</span>
          </button>
          <button className="flex flex-col items-center text-xs text-green-400 hover:text-green-300 transition-colors">
            <div className="w-8 h-8 mb-1 bg-green-600/20 rounded-full flex items-center justify-center border border-green-500/30">📋</div>
            <span className="font-mono">MISSIONS</span>
          </button>
          <button className="flex flex-col items-center text-xs text-orange-400 hover:text-orange-300 transition-colors">
            <div className="w-8 h-8 mb-1 bg-orange-600/20 rounded-full flex items-center justify-center border border-orange-500/30">🏆</div>
            <span className="font-mono">RANKS</span>
          </button>
        </div>
      </div>

      {/* Atmospheric Particles Effect */}
      <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
        <div className="absolute w-2 h-2 bg-red-500/30 rounded-full animate-ping" style={{top: '20%', left: '10%', animationDelay: '0s'}}></div>
        <div className="absolute w-1 h-1 bg-orange-500/40 rounded-full animate-ping" style={{top: '60%', left: '80%', animationDelay: '1s'}}></div>
        <div className="absolute w-3 h-3 bg-yellow-500/20 rounded-full animate-ping" style={{top: '80%', left: '30%', animationDelay: '2s'}}></div>
        <div className="absolute w-1 h-1 bg-red-500/50 rounded-full animate-ping" style={{top: '40%', left: '70%', animationDelay: '0.5s'}}></div>
      </div>
    </div>
  );
}