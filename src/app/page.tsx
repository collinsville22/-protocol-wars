'use client';

  import { useState, useEffect } from 'react';
  import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
  import { useWallet } from '@solana/wallet-adapter-react';
  import { WalletStatus } from '@/components/WalletProvider';
  import { useHoneycomb } from '@/hooks/useHoneycomb';

  export default function Home() {
    const [isClient, setIsClient] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [selectedMission, setSelectedMission] = useState<string | null>(null);
    const [missionProgress, setMissionProgress] = useState(0);
    const [notifications, setNotifications] = useState<string[]>([]);

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

      // Auto-initialize project when wallet connects
      if (connected && missions.length === 0) {
        initializeProject("Protocol Wars DAO");
      }
    }, [connected, initializeProject, missions.length]);

    // Simulate mission progress for active missions
    useEffect(() => {
      const activeMissions = missions.filter(m => m.status === 'active');
      if (activeMissions.length > 0) {
        const progressInterval = setInterval(() => {
          setMissionProgress(prev => {
            const newProgress = (prev + 1) % 101;

            // Auto-complete mission at 100%
            if (newProgress === 100 && selectedMission) {
              completeMission(selectedMission);
              addNotification(`Mission completed! Rewards earned.`);
              setSelectedMission(null);
            }

            return newProgress;
          });
        }, 50);

        return () => clearInterval(progressInterval);
      }
    }, [missions, selectedMission, completeMission]);

    const addNotification = (message: string) => {
      setNotifications(prev => [...prev.slice(-2), message]);
      setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 5000);
    };

    const handleStartMission = async (missionId: string) => {
      if (characters.length === 0) {
        await createCharacter("DAO Commander", "leader");
        addNotification("Character created: DAO Commander");
      }

      const character = characters[0] || { id: 'temp_char' };
      const success = await startMission(missionId, character.id);

      if (success) {
        setSelectedMission(missionId);
        setMissionProgress(0);
        addNotification("Mission started successfully!");
      } else {
        addNotification("Failed to start mission. Try again.");
      }
    };

    if (!isClient) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="relative">
            <div className="text-4xl font-mono text-green-400 animate-pulse tracking-wider">
              {`>>> INITIALIZING PROTOCOL WARS`}
            </div>
            <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-red-900 opacity-50"></div>
        <div className="fixed inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60'
  xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'
  fill-opacity='0.03'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6
  34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        {/* Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => (
            <div key={index} className="bg-green-900/90 border border-green-500 px-4 py-2 rounded-lg text-green-200
  animate-pulse">
              {notification}
            </div>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="fixed top-4 left-4 z-50 bg-red-900/90 border border-red-500 px-4 py-2 rounded-lg text-red-200">
            Error: {error}
          </div>
        )}

        {!gameStarted ? (
          <>
            {/* Main Menu */}
            <div className="relative z-10 min-h-screen flex flex-col">

              {/* Header */}
              <header className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <WalletStatus />
                    <span className="text-xs font-mono text-gray-400 tracking-wider">
                      {connected ? 'HONEYCOMB PROTOCOL READY' : 'WALLET CONNECTION REQUIRED'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-gray-400">
                    Season 1 • {new Date().toLocaleDateString()}
                  </div>
                </div>
              </header>

              {/* Main Title */}
              <div className="flex-1 flex flex-col items-center justify-center px-8">
                <div className="text-center mb-16">
                  <div className="relative">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 relative">
                      <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text
  text-transparent animate-pulse">
                        PROTOCOL
                      </span>
                    </h1>
                    <h2 className="text-4xl md:text-6xl font-black tracking-wider text-white opacity-90">
                      WARS
                    </h2>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r
  from-transparent via-red-500 to-transparent"></div>
                  </div>

                  <p className="text-xl text-gray-300 mt-8 max-w-2xl font-light tracking-wide leading-relaxed">
                    In a world where blockchain protocols battle for supremacy,<br/>
                    only the strongest DAOs survive the digital wasteland.
                  </p>
                </div>

                {/* Connection Status & Action */}
                <div className="space-y-6">
                  {!connected ? (
                    <div className="text-center space-y-4">
                      <div className="text-red-400 font-mono text-lg mb-4">
                        WALLET CONNECTION REQUIRED
                      </div>
                      <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-purple-600 hover:!from-blue-700
  hover:!to-purple-700 !border-2 !border-blue-400 !px-8 !py-4 !text-xl !font-bold !tracking-wider" />
                    </div>
                  ) : (
                    <button
                      onClick={() => setGameStarted(true)}
                      className="group relative px-16 py-6 bg-gradient-to-r from-red-600 to-red-700 border-2 border-red-400
  transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50"
                      disabled={loading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0
  group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative text-2xl font-bold tracking-wider">
                        {loading ? 'LOADING...' : 'ENTER THE WASTELAND'}
                      </span>
                      <div className="absolute inset-0 border-2 border-red-300 transform scale-110 opacity-0
  group-hover:opacity-100 transition-all duration-300"></div>
                    </button>
                  )}

                  <div className="text-center">
                    <div className="text-sm font-mono text-gray-500 mb-2">BLOCKCHAIN STATUS</div>
                    <div className="flex justify-center space-x-8 text-xs font-mono">
                      <div>MISSIONS: <span className="text-green-400">{missions.length}</span></div>
                      <div>CHARACTERS: <span className="text-blue-400">{characters.length}</span></div>
                      <div>NETWORK: <span className="text-orange-400">DEVNET</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Game Interface */}
            <div className="relative z-10 h-screen flex flex-col">

              {/* Top HUD */}
              <div className="bg-black/80 border-b border-red-900/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <WalletStatus />
                    <div className="text-xl font-bold text-white tracking-wide">
                      PROTOCOL WARS DAO
                    </div>
                    <div className="text-sm text-gray-400">
                      Characters: {characters.length} | Missions: {missions.filter(m => m.status ===
  'completed').length}/{missions.length}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <WalletMultiButton className="!bg-transparent !border !border-gray-600 hover:!border-gray-400" />
                  </div>
                </div>
              </div>

              {/* Main Game Area */}
              <div className="flex-1 flex">

                {/* Left Panel - Real Honeycomb Missions */}
                <div className="w-80 bg-black/60 border-r border-gray-800 p-6 space-y-4 overflow-y-auto">
                  <div className="text-lg font-bold text-green-400 mb-6 font-mono tracking-wider">
                    › HONEYCOMB MISSIONS
                  </div>

                  {missions.map((mission, index) => (
                    <div
                      key={mission.id}
                      className={`p-4 border-2 transition-all duration-300 ${
                        mission.status === 'active'
                          ? 'border-green-500 bg-green-900/20'
                          : mission.status === 'completed'
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-900/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-white text-sm">{mission.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          mission.status === 'active' ? 'bg-green-900 text-green-200' :
                          mission.status === 'completed' ? 'bg-blue-900 text-blue-200' :
                          'bg-gray-700 text-gray-200'
                        }`}>
                          {mission.status.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mb-3">{mission.description}</p>

                      <div className="space-y-1 text-xs text-gray-400 mb-3">
                        <div>Level Req: <span className="text-white">{mission.requirements.level}</span></div>
                        <div>Duration: <span className="text-yellow-400">{Math.floor(mission.duration / 60)}min</span></div>
                        <div>Rewards: <span className="text-green-400">{mission.rewards.xp} XP, {mission.rewards.tokens}
  tokens</span></div>
                      </div>

                      {mission.status === 'available' && (
                        <button
                          onClick={() => handleStartMission(mission.id)}
                          disabled={loading}
                          className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 text-xs font-bold rounded
  transition-colors duration-300 disabled:opacity-50"
                        >
                          {loading ? 'STARTING...' : 'START MISSION'}
                        </button>
                      )}

                      {mission.status === 'active' && selectedMission === mission.id && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>PROGRESS</span>
                            <span>{missionProgress}%</span>
                          </div>
                          <div className="bg-gray-800 rounded-full h-1">
                            <div
                              className="h-full bg-green-400 rounded-full transition-all duration-300"
                              style={{width: `${missionProgress}%`}}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Center - Battle Command */}
                <div className="flex-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black/80">
                    <div className="h-full flex flex-col items-center justify-center p-8">

                      <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-white mb-4">MISSION CONTROL</h2>
                        <p className="text-gray-300 text-lg">Real on-chain missions powered by Honeycomb Protocol</p>
                      </div>

                      {/* Active Mission Display */}
                      {selectedMission && (
                        <div className="w-full max-w-md mb-8 bg-black/50 border border-green-500 rounded-lg p-6">
                          <h3 className="text-green-400 font-bold mb-2">ACTIVE MISSION</h3>
                          <p className="text-white mb-4">
                            {missions.find(m => m.id === selectedMission)?.name}
                          </p>
                          <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300"
                              style={{width: `${missionProgress}%`}}
                            ></div>
                          </div>
                          <div className="text-right text-sm text-gray-400 mt-1">
                            {missionProgress}% Complete
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-900/50 border border-gray-700 p-4 rounded">
                          <h4 className="text-green-400 font-bold mb-2">COMPLETED MISSIONS</h4>
                          <div className="text-3xl font-bold text-white">
                            {missions.filter(m => m.status === 'completed').length}
                          </div>
                        </div>
                        <div className="bg-gray-900/50 border border-gray-700 p-4 rounded">
                          <h4 className="text-blue-400 font-bold mb-2">ACTIVE CHARACTERS</h4>
                          <div className="text-3xl font-bold text-white">
                            {characters.length}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setGameStarted(false)}
                        className="text-gray-400 hover:text-white transition-colors duration-300 font-mono text-sm
  tracking-wider"
                      >
                        ← RETURN TO MAIN MENU
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Character Info */}
                <div className="w-80 bg-black/60 border-l border-gray-800 p-6">
                  <div className="text-lg font-bold text-blue-400 mb-6 font-mono tracking-wider">
                    › DAO ROSTER
                  </div>

                  {characters.length > 0 ? (
                    <div className="space-y-4">
                      {characters.map((character) => (
                        <div key={character.id} className="bg-gray-900/50 border border-gray-700 p-4 rounded">
                          <h4 className="text-white font-bold mb-2">{character.name}</h4>
                          <div className="space-y-1 text-xs text-gray-400">
                            <div>Level: <span className="text-white">{character.level}</span></div>
                            <div>XP: <span className="text-green-400">{character.xp}</span></div>
                            <div>Traits: <span className="text-purple-400">{character.traits.length}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <p className="mb-4">No characters created yet.</p>
                      <p className="text-xs">Start a mission to auto-create your first DAO commander!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
