'use client';

  import { useState, useEffect } from 'react';
  import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
  import { useWallet } from '@solana/wallet-adapter-react';
  import { WalletStatus } from '@/components/WalletProvider';
  import { useHoneycomb } from '@/hooks/useHoneycomb';
  import HexBattlefield from '@/components/HexBattlefield';

  export default function Home() {
    const [isClient, setIsClient] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [selectedMission, setSelectedMission] = useState<string | null>(null);
    const [missionProgress, setMissionProgress] = useState(0);
    const [notifications, setNotifications] = useState<string[]>([]);
    const [gameStats, setGameStats] = useState({
      playerTerritories: 3,
      enemyTerritories: 2,
      neutralTerritories: 15,
      totalUnits: 8,
      activeBattles: 1
    });

    const { connected } = useWallet();
    const {
      missions,
      characters,
      loading,
      error,
      initializeProject,
      createCharacter,
      startMission,
      completeMission
    } = useHoneycomb();

    useEffect(() => {
      setIsClient(true);

      if (connected && missions.length === 0) {
        initializeProject("Protocol Wars Command Center");
      }
    }, [connected, initializeProject, missions.length]);

    // Real-time mission system
    useEffect(() => {
      const activeMissions = missions.filter(m => m.status === 'active');
      if (activeMissions.length > 0 && selectedMission) {
        const missionInterval = setInterval(() => {
          setMissionProgress(prev => {
            const newProgress = Math.min(prev + 2, 100);

            if (newProgress === 100) {
              completeMission(selectedMission);
              addNotification(`✅ Mission Complete! +500 tokens, +150 XP earned!`);
              setSelectedMission(null);
              updateGameStats('mission_complete');
            }

            return newProgress;
          });
        }, 100);

        return () => clearInterval(missionInterval);
      }
    }, [missions, selectedMission, completeMission]);

    // Battle simulation system
    useEffect(() => {
      const battleInterval = setInterval(() => {
        if (gameStats.activeBattles > 0) {
          const battleOutcome = Math.random() > 0.3;
          if (battleOutcome) {
            addNotification(`⚔️ Battle Victory! Territory captured!`);
            updateGameStats('territory_captured');
          }
        }
      }, 15000);

      return () => clearInterval(battleInterval);
    }, [gameStats.activeBattles]);

    const addNotification = (message: string) => {
      setNotifications(prev => [...prev.slice(-2), message]);
      setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 5000);
    };

    const updateGameStats = (event: 'mission_complete' | 'territory_captured' | 'battle_started') => {
      setGameStats(prev => {
        switch (event) {
          case 'mission_complete':
            return { ...prev, totalUnits: prev.totalUnits + 1 };
          case 'territory_captured':
            return {
              ...prev,
              playerTerritories: prev.playerTerritories + 1,
              enemyTerritories: Math.max(0, prev.enemyTerritories - 1),
              activeBattles: Math.max(0, prev.activeBattles - 1)
            };
          case 'battle_started':
            return { ...prev, activeBattles: prev.activeBattles + 1 };
          default:
            return prev;
        }
      });
    };

    const handleStartMission = async (missionId: string) => {
      if (characters.length === 0) {
        await createCharacter("DAO Commander Alpha", "elite_validator");
        addNotification("🚀 DAO Commander deployed to battlefield!");
      }

      const character = characters[0] || { id: 'commander_alpha' };
      const success = await startMission(missionId, character.id);

      if (success) {
        setSelectedMission(missionId);
        setMissionProgress(0);
        addNotification(`🎯 Mission "${missions.find(m => m.id === missionId)?.name}" initiated!`);
      } else {
        addNotification("❌ Mission failed to start. Insufficient resources.");
      }
    };

    if (!isClient) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="relative">
            <div className="text-4xl font-mono text-green-400 animate-pulse tracking-wider">
              {`>>> INITIALIZING PROTOCOL WARS COMMAND CENTER`}
            </div>
            <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 animate-pulse" style={{width: '75%'}}></div>
            </div>
            <div className="mt-2 text-center text-sm text-gray-400 font-mono">
              Loading 3D Battlefield Systems...
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-red-900 opacity-50"></div>
        <div className="fixed inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg
  fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='m36
  34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6
  4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        {/* Tactical Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => (
            <div key={index} className="bg-green-900/90 border border-green-500 px-4 py-2 rounded-lg text-green-200 animate-pulse shadow-lg">
              {notification}
            </div>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="fixed top-4 left-4 z-50 bg-red-900/90 border border-red-500 px-4 py-2 rounded-lg text-red-200">
            ⚠️ System Error: {error}
          </div>
        )}

        {!gameStarted ? (
          <>
            {/* Enhanced Main Menu */}
            <div className="relative z-10 min-h-screen flex flex-col">

              <header className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <WalletStatus />
                    <span className="text-xs font-mono text-gray-400 tracking-wider">
                      {connected ? 'HONEYCOMB PROTOCOL ACTIVE' : 'AWAITING WALLET CONNECTION'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-gray-400">
                    Combat Season 1 • {new Date().toLocaleDateString()}
                  </div>
                </div>
              </header>

              <div className="flex-1 flex flex-col items-center justify-center px-8">
                <div className="text-center mb-16">
                  <div className="relative">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 relative">
                      <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-pulse">
                        PROTOCOL
                      </span>
                    </h1>
                    <h2 className="text-4xl md:text-6xl font-black tracking-wider text-white opacity-90">
                      WARS: COMMAND CENTER
                    </h2>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-red-500
  to-transparent"></div>
                  </div>

                  <p className="text-xl text-gray-300 mt-8 max-w-2xl font-light tracking-wide leading-relaxed">
                    Command your DAO in epic 3D battles for blockchain supremacy.<br/>
                    Deploy units, capture territories, complete missions on-chain.
                  </p>
                </div>

                <div className="space-y-6">
                  {!connected ? (
                    <div className="text-center space-y-4">
                      <div className="text-red-400 font-mono text-lg mb-4">
                        🔐 SECURE WALLET CONNECTION REQUIRED
                      </div>
                      <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-purple-600 hover:!from-blue-700 hover:!to-purple-700 !border-2
   !border-blue-400 !px-8 !py-4 !text-xl !font-bold !tracking-wider" />
                    </div>
                  ) : (
                    <button
                      onClick={() => setGameStarted(true)}
                      className="group relative px-16 py-6 bg-gradient-to-r from-red-600 to-red-700 border-2 border-red-400 transform transition-all
  duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50"
                      disabled={loading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity
  duration-300"></div>
                      <span className="relative text-2xl font-bold tracking-wider">
                        {loading ? '🔄 INITIALIZING...' : '⚔️ ENTER COMMAND CENTER'}
                      </span>
                      <div className="absolute inset-0 border-2 border-red-300 transform scale-110 opacity-0 group-hover:opacity-100 transition-all
  duration-300"></div>
                    </button>
                  )}

                  <div className="text-center">
                    <div className="text-sm font-mono text-gray-500 mb-2">🍯 HONEYCOMB PROTOCOL STATUS</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                      <div>MISSIONS: <span className="text-green-400">{missions.length}</span></div>
                      <div>COMMANDERS: <span className="text-blue-400">{characters.length}</span></div>
                      <div>NETWORK: <span className="text-orange-400">DEVNET-ACTIVE</span></div>
                      <div>STATUS: <span className="text-green-400 animate-pulse">ONLINE</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* EPIC 3D GAME INTERFACE */}
            <div className="relative z-10 h-screen flex flex-col">

              {/* Command HUD */}
              <div className="bg-black/80 border-b border-green-500/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <WalletStatus />
                    <div className="text-xl font-bold text-white tracking-wide">
                      PROTOCOL WARS COMMAND CENTER
                    </div>
                    <div className="text-sm text-gray-400">
                      Territories: {gameStats.playerTerritories}/{gameStats.playerTerritories + gameStats.enemyTerritories +
  gameStats.neutralTerritories} |
                      Units: {gameStats.totalUnits} |
                      Active Battles: {gameStats.activeBattles}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-gray-400">THREAT LEVEL:</span>
                      <span className="text-red-400 font-bold ml-2 animate-pulse">HIGH</span>
                    </div>
                    <WalletMultiButton className="!bg-transparent !border !border-gray-600 hover:!border-gray-400 !text-sm" />
                  </div>
                </div>
              </div>

              {/* MAIN GAME AREA WITH 3D BATTLEFIELD */}
              <div className="flex-1 flex">

                {/* Left Panel - Enhanced Mission Control */}
                <div className="w-80 bg-black/60 border-r border-gray-800 p-6 space-y-4 overflow-y-auto">
                  <div className="text-lg font-bold text-green-400 mb-6 font-mono tracking-wider">
                    🎯 MISSION CONTROL
                  </div>

                  {missions.map((mission, index) => (
                    <div
                      key={mission.id}
                      className={`p-4 border-2 transition-all duration-300 ${
                        mission.status === 'active'
                          ? 'border-green-500 bg-green-900/20 shadow-lg shadow-green-500/20'
                          : mission.status === 'completed'
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-900/50 hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-white text-sm">{mission.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded font-bold ${
                          mission.status === 'active' ? 'bg-green-900 text-green-200 animate-pulse' :
                          mission.status === 'completed' ? 'bg-blue-900 text-blue-200' :
                          'bg-gray-700 text-gray-200'
                        }`}>
                          {mission.status.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mb-3">{mission.description}</p>

                      <div className="space-y-1 text-xs text-gray-400 mb-3">
                        <div>🎖️ Level Required: <span className="text-white">{mission.requirements.level}</span></div>
                        <div>⏱️ Duration: <span className="text-yellow-400">{Math.floor(mission.duration / 60)}min</span></div>
                        <div>🎁 Rewards: <span className="text-green-400">{mission.rewards.xp} XP • {mission.rewards.tokens} tokens</span></div>
                      </div>

                      {mission.status === 'available' && (
                        <button
                          onClick={() => handleStartMission(mission.id)}
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-3 py-2 text-xs
  font-bold rounded transition-all duration-300 disabled:opacity-50 shadow-lg"
                        >
                          {loading ? '🔄 DEPLOYING...' : '🚀 DEPLOY MISSION'}
                        </button>
                      )}

                      {mission.status === 'active' && selectedMission === mission.id && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>⚡ MISSION PROGRESS</span>
                            <span>{missionProgress}%</span>
                          </div>
                          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-300"
                              style={{width: `${missionProgress}%`}}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Center - 3D BATTLEFIELD */}
                <div className="flex-1 relative">
                  <HexBattlefield />
                </div>

                {/* Right Panel - Command Intelligence */}
                <div className="w-80 bg-black/60 border-l border-gray-800 p-6">
                  <div className="text-lg font-bold text-orange-400 mb-6 font-mono tracking-wider">
                    🧠 TACTICAL INTEL
                  </div>

                  <div className="space-y-6">
                    {/* Territory Control */}
                    <div className="bg-gray-900/50 border border-gray-700 p-4 rounded">
                      <h4 className="text-sm font-bold text-white mb-2">🗺️ TERRITORY STATUS</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-green-400">Your Control:</span>
                          <span className="text-white font-bold">{gameStats.playerTerritories}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-400">Enemy Control:</span>
                          <span className="text-white font-bold">{gameStats.enemyTerritories}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Neutral:</span>
                          <span className="text-white font-bold">{gameStats.neutralTerritories}</span>
                        </div>
                      </div>
                      <div className="mt-3 bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-l-full"
                          style={{width: `${(gameStats.playerTerritories / (gameStats.playerTerritories + gameStats.enemyTerritories +
  gameStats.neutralTerritories)) * 100}%`}}
                        ></div>
                      </div>
                    </div>

                    {/* Active Mission Status */}
                    {selectedMission && (
                      <div className="bg-green-900/20 border border-green-500 p-4 rounded">
                        <h4 className="text-sm font-bold text-green-400 mb-2">🎯 ACTIVE MISSION</h4>
                        <p className="text-white text-sm mb-2">
                          {missions.find(m => m.id === selectedMission)?.name}
                        </p>
                        <div className="text-xs text-gray-300">
                          Progress: {missionProgress}% • ETA: {Math.floor((100 - missionProgress) * 0.5)}s
                        </div>
                      </div>
                    )}

                    {/* Commander Status */}
                    <div className="bg-gray-900/50 border border-gray-700 p-4 rounded">
                      <h4 className="text-sm font-bold text-white mb-2">⭐ COMMANDER STATUS</h4>
                      {characters.length > 0 ? (
                        <div className="space-y-2">
                          {characters.map((character) => (
                            <div key={character.id} className="text-xs">
                              <div className="text-blue-400 font-bold">{character.name}</div>
                              <div className="text-gray-400">
                                Level {character.level} • {character.xp} XP • {character.traits.length} Traits
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-xs">
                          No commanders deployed. Start a mission to deploy your first commander!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
