'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import useGameState from '@/hooks/useGameState';
import { LeaderboardEntry } from '@/types/game';

export default function Leaderboard() {
  const wallet = useWallet();
  const { leaderboard, daos, season } = useGameState();
  const [viewMode, setViewMode] = useState<'current' | 'allTime'>('current');
  const [timeLeft, setTimeLeft] = useState('');

  const playerDAO = daos.find(dao => dao.leader === wallet.publicKey?.toString());
  const playerRank = leaderboard.find(entry => entry.daoId === playerDAO?.id);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = season.endTime - now;
      
      if (remaining <= 0) {
        setTimeLeft('Season Ended');
        return;
      }
      
      const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
      const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [season.endTime]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '👑';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '#' + rank;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-amber-600';
      default: return 'text-gray-400';
    }
  };

  const getDAOForEntry = (entry: LeaderboardEntry) => {
    return daos.find(dao => dao.id === entry.daoId);
  };

  const topEntries = leaderboard.slice(0, 10);
  const isPlayerInTop10 = playerRank && playerRank.rank <= 10;

  return (
    <div className="bg-gray-900/50 rounded-lg border border-yellow-500/30 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-gaming text-yellow-400">Leaderboard</h3>
        <div className="text-xs text-gray-400">
          Season {season.number}
        </div>
      </div>

      {/* Season Timer */}
      <div className="bg-yellow-500/10 rounded p-3 border border-yellow-500/20">
        <div className="flex items-center justify-between">
          <span className="text-sm text-yellow-400 font-bold">Season Ends:</span>
          <span className="text-sm text-white font-mono">{timeLeft}</span>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1 rounded-full transition-all duration-1000"
              style={{ 
                width: `${Math.max(0, Math.min(100, 
                  ((Date.now() - season.startTime) / (season.endTime - season.startTime)) * 100
                ))}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-2">
        <button
          onClick={() => setViewMode('current')}
          className={`px-3 py-1 rounded text-xs font-bold transition-all ${
            viewMode === 'current'
              ? 'bg-yellow-500 text-black'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}
        >
          Current Season
        </button>
        <button
          onClick={() => setViewMode('allTime')}
          className={`px-3 py-1 rounded text-xs font-bold transition-all ${
            viewMode === 'allTime'
              ? 'bg-yellow-500 text-black'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}
        >
          All Time
        </button>
      </div>

      {/* Player's Rank (if not in top 10) */}
      {playerRank && !isPlayerInTop10 && (
        <div className="bg-blue-500/10 rounded p-2 border border-blue-500/20">
          <div className="text-xs text-blue-400 mb-1">Your Rank:</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-blue-400">
                #{playerRank.rank}
              </span>
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: playerDAO?.color || '#3b82f6' }}
              />
              <span className="text-sm font-bold text-white">
                {playerDAO?.name || 'Your DAO'}
              </span>
            </div>
            <div className="text-sm font-bold text-yellow-400">
              {playerRank.score.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Top Rankings */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-gray-300">Top DAOs</h4>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {topEntries.length > 0 ? (
            topEntries.map((entry, index) => {
              const dao = getDAOForEntry(entry);
              const isPlayer = dao?.leader === wallet.publicKey?.toString();
              
              return (
                <div 
                  key={entry.daoId}
                  className={`p-3 rounded border transition-all ${
                    isPlayer 
                      ? 'bg-blue-500/20 border-blue-500/50' 
                      : 'bg-gray-800/50 border-gray-600/30 hover:border-gray-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`text-lg font-bold ${getRankColor(entry.rank)}`}>
                        {getRankIcon(entry.rank)}
                      </span>
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white/50" 
                        style={{ backgroundColor: dao?.color || '#6b7280' }}
                      />
                      <div>
                        <div className="text-sm font-bold text-white">
                          {dao?.name || `DAO ${entry.daoId.slice(-4)}`}
                          {isPlayer && <span className="text-blue-400 ml-1">(You)</span>}
                        </div>
                        <div className="text-xs text-gray-400">
                          Level {dao?.level || 1} • {entry.territoriesControlled} territories
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-400">
                        {entry.score.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {entry.battlesWon} wins
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-gray-400">No rankings yet</div>
              <div className="text-sm text-gray-500">
                Create a DAO and start battling to appear on the leaderboard!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Season Rewards Preview */}
      <div className="pt-2 border-t border-gray-700">
        <div className="text-xs text-gray-300 mb-2">Season Rewards:</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-yellow-500/10 rounded p-2 border border-yellow-500/20">
            <div className="text-yellow-400 text-sm font-bold">1st</div>
            <div className="text-xs text-gray-400">10,000 SOL</div>
          </div>
          <div className="bg-gray-500/10 rounded p-2 border border-gray-500/20">
            <div className="text-gray-300 text-sm font-bold">2nd</div>
            <div className="text-xs text-gray-400">5,000 SOL</div>
          </div>
          <div className="bg-amber-600/10 rounded p-2 border border-amber-600/20">
            <div className="text-amber-600 text-sm font-bold">3rd</div>
            <div className="text-xs text-gray-400">2,500 SOL</div>
          </div>
        </div>
        <div className="text-xs text-center text-gray-500 mt-2">
          + Special NFT badges for top 10 DAOs
        </div>
      </div>

      {/* Real-time update indicator */}
      <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>Live rankings • Updates every second</span>
      </div>
    </div>
  );
}