'use client';

import { useState, useEffect, useCallback } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHoneycomb } from '@/hooks/useHoneycomb';

type GameState = 'menu' | 'waiting' | 'ready' | 'playing' | 'results';

interface GameStats {
  wins: number;
  losses: number;
  bestTime: number;
  totalGames: number;
  streak: number;
  level: number;
  xp: number;
  traits: string[];
}

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [gameState, setGameState] = useState<GameState>('menu');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [waitTime, setWaitTime] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [stats, setStats] = useState<GameStats>({
    wins: 0,
    losses: 0,
    bestTime: Infinity,
    totalGames: 0,
    streak: 0,
    level: 1,
    xp: 0,
    traits: []
  });
  const [showResults, setShowResults] = useState(false);
  const [tooEarly, setTooEarly] = useState(false);
  const [newTraitUnlocked, setNewTraitUnlocked] = useState<string | null>(null);
  const { connected } = useWallet();
  const { 
    missions, 
    characters, 
    initializeProject, 
    createCharacter, 
    startMission, 
    completeMission,
    loading 
  } = useHoneycomb();

  useEffect(() => {
    setIsClient(true);
    // Load stats from localStorage
    const savedStats = localStorage.getItem('reactionGameStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    
    // Initialize Honeycomb if wallet connected
    if (connected) {
      initializeProject("Reaction Battle Championship");
    }
  }, [connected, initializeProject]);

  // Create character on first play
  const ensureCharacter = useCallback(async () => {
    if (connected && characters.length === 0) {
      await createCharacter("Lightning Reflexes", "speed_demon");
    }
  }, [connected, characters, createCharacter]);

  // Check for trait unlocks based on performance
  const checkTraitUnlocks = useCallback((newStats: GameStats) => {
    const newTraits = [];
    
    if (newStats.bestTime < 150 && !newStats.traits.includes('Lightning_Reflexes')) {
      newTraits.push('Lightning_Reflexes');
    }
    if (newStats.streak >= 5 && !newStats.traits.includes('Consistent_Performer')) {
      newTraits.push('Consistent_Performer');
    }
    if (newStats.wins >= 10 && !newStats.traits.includes('Veteran_Clicker')) {
      newTraits.push('Veteran_Clicker');
    }
    if (newStats.bestTime < 100 && !newStats.traits.includes('Superhuman')) {
      newTraits.push('Superhuman');
    }
    
    if (newTraits.length > 0) {
      const updatedStats = {
        ...newStats,
        traits: [...newStats.traits, ...newTraits],
        xp: newStats.xp + (newTraits.length * 100)
      };
      setNewTraitUnlocked(newTraits[0]);
      return updatedStats;
    }
    
    return newStats;
  }, []);

  // Start Honeycomb mission for each game
  const startHoneycombMission = useCallback(async () => {
    if (connected && characters.length > 0) {
      const missionId = `reaction_test_${Date.now()}`;
      await startMission(missionId, characters[0].id);
    }
  }, [connected, characters, startMission]);

  // Complete Honeycomb mission with results
  const completeHoneycombMission = useCallback(async (success: boolean, time?: number) => {
    if (connected && characters.length > 0) {
      const activeMission = missions.find(m => m.status === 'active');
      if (activeMission) {
        await completeMission(activeMission.id);
      }
    }
  }, [connected, characters, missions, completeMission]);

  const saveStats = useCallback((newStats: GameStats) => {
    setStats(newStats);
    localStorage.setItem('reactionGameStats', JSON.stringify(newStats));
  }, []);

  const startGame = useCallback(async () => {
    setGameState('waiting');
    setReactionTime(null);
    setTooEarly(false);
    setShowResults(false);
    setNewTraitUnlocked(null);
    
    // Ensure Honeycomb character exists
    await ensureCharacter();
    
    // Start Honeycomb mission
    await startHoneycombMission();
    
    // Random wait time between 2-8 seconds
    const randomWait = Math.random() * 6000 + 2000;
    setWaitTime(randomWait);
    
    setTimeout(() => {
      setGameStartTime(Date.now());
      setGameState('ready');
    }, randomWait);
  }, [ensureCharacter, startHoneycombMission]);

  const handleClick = useCallback(async () => {
    if (gameState === 'waiting') {
      // Clicked too early!
      setTooEarly(true);
      setGameState('results');
      
      // Complete Honeycomb mission with failure
      await completeHoneycombMission(false);
      
      let newStats = {
        ...stats,
        losses: stats.losses + 1,
        totalGames: stats.totalGames + 1,
        streak: 0
      };
      
      // Check for trait unlocks
      newStats = checkTraitUnlocks(newStats);
      saveStats(newStats);
      setShowResults(true);
      return;
    }
    
    if (gameState === 'ready') {
      // Perfect timing!
      const time = Date.now() - gameStartTime;
      setReactionTime(time);
      setGameState('results');
      
      // Complete Honeycomb mission with success
      await completeHoneycombMission(true, time);
      
      let newStats = {
        ...stats,
        wins: stats.wins + 1,
        totalGames: stats.totalGames + 1,
        bestTime: Math.min(stats.bestTime, time),
        streak: stats.streak + 1,
        xp: stats.xp + (time < 200 ? 50 : time < 300 ? 30 : 10), // XP based on performance
        level: Math.floor((stats.xp + (time < 200 ? 50 : time < 300 ? 30 : 10)) / 500) + 1
      };
      
      // Check for trait unlocks
      newStats = checkTraitUnlocks(newStats);
      saveStats(newStats);
      setShowResults(true);
    }
  }, [gameState, gameStartTime, stats, saveStats, completeHoneycombMission, checkTraitUnlocks]);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-4xl font-bold text-red-400 animate-pulse">
          REACTION BATTLE Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white overflow-hidden">
      
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-red-900/20"></div>
      <div className="fixed inset-0" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), 
                         radial-gradient(circle at 75% 75%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)`
      }}></div>

      {/* Header */}
      <header className="relative z-10 bg-black/50 backdrop-blur-sm border-b border-blue-500/30 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-red-400">
              ⚡ REACTION BATTLE
            </h1>
            <div className="text-sm text-gray-400">
              Test your lightning reflexes
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right text-sm">
              <div className="text-gray-400">Best Time</div>
              <div className="text-yellow-400 font-bold">
                {stats.bestTime === Infinity ? '---' : `${stats.bestTime}ms`}
              </div>
            </div>
            <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-purple-600 hover:!from-blue-700 hover:!to-purple-700" />
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        
        {/* Stats Panel with Honeycomb Integration */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-black/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 text-center">
            <div className="text-blue-400 text-2xl font-bold">{stats.wins}</div>
            <div className="text-gray-400 text-sm">Wins</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 text-center">
            <div className="text-red-400 text-2xl font-bold">{stats.losses}</div>
            <div className="text-gray-400 text-sm">Losses</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 text-center">
            <div className="text-green-400 text-2xl font-bold">{stats.level}</div>
            <div className="text-gray-400 text-sm">Level</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-4 text-center">
            <div className="text-yellow-400 text-2xl font-bold">{stats.xp}</div>
            <div className="text-gray-400 text-sm">XP</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 text-center">
            <div className="text-purple-400 text-2xl font-bold">{stats.traits.length}</div>
            <div className="text-gray-400 text-sm">Traits</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-orange-500/30 rounded-lg p-4 text-center">
            <div className="text-orange-400 text-2xl font-bold">{missions.length}</div>
            <div className="text-gray-400 text-sm">Missions</div>
          </div>
        </div>

        {/* Honeycomb Protocol Integration Status */}
        {connected && (
          <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  🍯
                </div>
                <div>
                  <div className="text-green-400 font-bold">Honeycomb Protocol Active</div>
                  <div className="text-gray-400 text-sm">
                    {characters.length > 0 
                      ? `Character: ${characters[0]?.name || 'Lightning Reflexes'}` 
                      : 'Creating character...'
                    }
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold">On-Chain Progress</div>
                <div className="text-gray-400 text-sm">Level {stats.level} • {stats.xp} XP</div>
              </div>
            </div>
          </div>
        )}

        {/* Active Traits Display */}
        {stats.traits.length > 0 && (
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
            <div className="text-purple-400 font-bold mb-2">🏆 Unlocked Traits</div>
            <div className="flex flex-wrap gap-2">
              {stats.traits.map(trait => (
                <span 
                  key={trait}
                  className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm"
                >
                  {trait.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Game Interface */}
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="bg-black/70 backdrop-blur-sm border border-blue-500/50 rounded-2xl p-12 mb-8">
                <h2 className="text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  READY?
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Wait for the screen to turn <span className="text-green-400 font-bold">GREEN</span>, then click as fast as possible!<br/>
                  Click too early and you lose. Perfect timing wins!
                </p>
                <button
                  onClick={startGame}
                  className="px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-2xl font-bold rounded-xl shadow-2xl shadow-blue-500/30 transform hover:scale-105 transition-all duration-200"
                >
                  🚀 START REACTION TEST
                </button>
              </div>
              <div className="text-gray-400 text-lg">
                Best players react in under 200ms!
              </div>
            </motion.div>
          )}

          {gameState === 'waiting' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
              onClick={handleClick}
            >
              <div className="bg-red-900/50 backdrop-blur-sm border-4 border-red-500 rounded-2xl p-12 cursor-pointer hover:bg-red-900/70 transition-all min-h-[400px] flex flex-col items-center justify-center">
                <h2 className="text-8xl font-black text-red-400 mb-6 animate-pulse">
                  WAIT...
                </h2>
                <p className="text-2xl text-red-300 mb-4">
                  Don't click yet!
                </p>
                <div className="text-lg text-gray-400">
                  Screen will turn green when ready
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'ready' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
              onClick={handleClick}
            >
              <div className="bg-green-900/50 backdrop-blur-sm border-4 border-green-500 rounded-2xl p-12 cursor-pointer hover:bg-green-900/70 transition-all min-h-[400px] flex flex-col items-center justify-center animate-pulse">
                <h2 className="text-8xl font-black text-green-400 mb-6">
                  CLICK!
                </h2>
                <p className="text-2xl text-green-300 mb-4">
                  Click now as fast as possible!
                </p>
                <div className="text-lg text-gray-400">
                  ⚡ GO GO GO! ⚡
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'results' && showResults && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className={`backdrop-blur-sm border-4 rounded-2xl p-12 ${
                tooEarly 
                  ? 'bg-red-900/50 border-red-500' 
                  : 'bg-green-900/50 border-green-500'
              }`}>
                {tooEarly ? (
                  <>
                    <h2 className="text-6xl font-black text-red-400 mb-6">
                      TOO EARLY!
                    </h2>
                    <p className="text-xl text-red-300 mb-8">
                      You clicked before the green light! 😅<br/>
                      Patience is key to lightning reflexes.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-6xl font-black text-green-400 mb-6">
                      {reactionTime! < 200 ? 'LIGHTNING!' : reactionTime! < 300 ? 'EXCELLENT!' : 'GOOD!'}
                    </h2>
                    <div className="text-8xl font-black text-yellow-400 mb-4">
                      {reactionTime}ms
                    </div>
                    <p className="text-xl text-green-300 mb-8">
                      {reactionTime! < 150 && "🔥 INHUMAN REFLEXES! Are you a robot?"}
                      {reactionTime! >= 150 && reactionTime! < 200 && "⚡ Lightning fast! You're in the top 1%!"}
                      {reactionTime! >= 200 && reactionTime! < 250 && "🎯 Excellent reflexes! Very impressive!"}
                      {reactionTime! >= 250 && reactionTime! < 350 && "👍 Good reaction time! Keep practicing!"}
                      {reactionTime! >= 350 && "💪 Room for improvement - try again!"}
                    </p>
                    {reactionTime === stats.bestTime && (
                      <div className="text-2xl text-yellow-400 font-bold mb-4 animate-bounce">
                        🏆 NEW PERSONAL BEST! 🏆
                      </div>
                    )}
                    {newTraitUnlocked && (
                      <div className="text-2xl text-purple-400 font-bold mb-4 animate-pulse">
                        🎉 TRAIT UNLOCKED: {newTraitUnlocked.replace('_', ' ')}! 🎉
                      </div>
                    )}
                  </>
                )}
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={startGame}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    🔄 TRY AGAIN
                  </button>
                  <button
                    onClick={() => setGameState('menu')}
                    className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white text-xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    📊 MENU
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer with challenge tips */}
      <div className="relative z-10 text-center mt-8 p-6">
        <div className="text-gray-400 text-sm mb-4">
          💡 Pro Tips: Stay relaxed • Focus on the center • Don't anticipate • React purely to color change
        </div>
        {connected && (
          <div className="text-blue-400 text-sm">
            🌟 Wallet connected! Your best times are automatically saved.
          </div>
        )}
      </div>
    </div>
  );
}