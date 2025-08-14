'use client';

  import { useState, useEffect } from 'react';

  export default function Home() {
    const [isClient, setIsClient] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [selectedDAO, setSelectedDAO] = useState(0);
    const [missionProgress, setMissionProgress] = useState(0);

    useEffect(() => {
      setIsClient(true);

      // Simulate mission progress
      const progressInterval = setInterval(() => {
        setMissionProgress(prev => (prev + 1) % 101);
      }, 100);

      return () => clearInterval(progressInterval);
    }, []);

    const daos = [
      {
        name: "SHADOW PROTOCOL",
        level: 7,
        power: 1847,
        status: "ACTIVE",
        color: "from-red-900 to-red-700",
        accent: "border-red-500",
        territories: 3,
        threat: "HIGH"
      },
      {
        name: "GHOST NETWORK",
        level: 5,
        power: 1203,
        status: "HOSTILE",
        color: "from-purple-900 to-purple-700",
        accent: "border-purple-500",
        territories: 2,
        threat: "MEDIUM"
      },
      {
        name: "IRON COLLECTIVE",
        level: 3,
        power: 856,
        status: "NEUTRAL",
        color: "from-gray-800 to-gray-600",
        accent: "border-gray-500",
        territories: 1,
        threat: "LOW"
      }
    ];

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

        {!gameStarted ? (
          <>
            {/* Main Menu */}
            <div className="relative z-10 min-h-screen flex flex-col">

              {/* Header */}
              <header className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-red-500 animate-pulse rounded-full"></div>
                    <span className="text-xs font-mono text-gray-400 tracking-wider">SECURE CONNECTION
  ESTABLISHED</span>
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
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-64 h-1
  bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                  </div>

                  <p className="text-xl text-gray-300 mt-8 max-w-2xl font-light tracking-wide leading-relaxed">
                    In a world where blockchain protocols battle for supremacy,<br/>
                    only the strongest DAOs survive the digital wasteland.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-6">
                  <button
                    onClick={() => setGameStarted(true)}
                    className="group relative px-16 py-6 bg-gradient-to-r from-red-600 to-red-700 border-2
  border-red-400 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0
  group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative text-2xl font-bold tracking-wider">ENTER THE WASTELAND</span>
                    <div className="absolute inset-0 border-2 border-red-300 transform scale-110 opacity-0
  group-hover:opacity-100 transition-all duration-300"></div>
                  </button>

                  <div className="text-center">
                    <div className="text-sm font-mono text-gray-500 mb-2">SURVIVAL STATISTICS</div>
                    <div className="flex justify-center space-x-8 text-xs font-mono">
                      <div>ACTIVE DAOS: <span className="text-red-400">23</span></div>
                      <div>TERRITORIES: <span className="text-orange-400">47</span></div>
                      <div>THREAT LEVEL: <span className="text-red-400 animate-pulse">CRITICAL</span></div>
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
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="font-mono text-sm text-green-400">ONLINE</span>
                    </div>
                    <div className="text-xl font-bold text-white tracking-wide">
                      {daos[selectedDAO].name}
                    </div>
                    <div className="text-sm text-gray-400">LVL {daos[selectedDAO].level}</div>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div className="text-sm">
                      <span className="text-gray-400">POWER:</span>
                      <span className="text-orange-400 font-bold ml-2">{daos[selectedDAO].power}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">STATUS:</span>
                      <span className={`font-bold ml-2 ${daos[selectedDAO].status === 'ACTIVE' ? 'text-green-400' :
   daos[selectedDAO].status === 'HOSTILE' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {daos[selectedDAO].status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Game Area */}
              <div className="flex-1 flex">

                {/* Left Panel - DAO Selection */}
                <div className="w-80 bg-black/60 border-r border-gray-800 p-6 space-y-4">
                  <div className="text-lg font-bold text-red-400 mb-6 font-mono tracking-wider">
                    › HOSTILE ENTITIES
                  </div>

                  {daos.map((dao, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedDAO(index)}
                      className={`p-4 border-2 cursor-pointer transition-all duration-300 ${
                        selectedDAO === index
                          ? `bg-gradient-to-r ${dao.color} ${dao.accent} shadow-lg`
                          : 'border-gray-700 hover:border-gray-600 bg-gray-900/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-white text-sm">{dao.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          dao.threat === 'HIGH' ? 'bg-red-900 text-red-200' :
                          dao.threat === 'MEDIUM' ? 'bg-orange-900 text-orange-200' :
                          'bg-gray-700 text-gray-200'
                        }`}>
                          {dao.threat}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-gray-400">
                        <div>Level: <span className="text-white">{dao.level}</span></div>
                        <div>Power: <span className="text-orange-400">{dao.power}</span></div>
                        <div>Territories: <span className="text-blue-400">{dao.territories}</span></div>
                      </div>
                      <div className="mt-2 bg-gray-800 rounded-full h-1">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${dao.color}`}
                          style={{width: `${(dao.power / 2000) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Center - Battle View */}
                <div className="flex-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black/80">
                    <div className="h-full flex flex-col items-center justify-center p-8">

                      {/* Battle Status */}
                      <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-white mb-4">TERRITORY CONTROL</h2>
                        <p className="text-gray-300 text-lg">Blockchain supremacy hangs in the balance</p>
                      </div>

                      {/* Mission Progress */}
                      <div className="w-full max-w-md mb-8">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>MISSION PROGRESS</span>
                          <span>{missionProgress}%</span>
                        </div>
                        <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all
  duration-300"
                            style={{width: `${missionProgress}%`}}
                          ></div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <button className="px-8 py-4 bg-gradient-to-r from-red-700 to-red-600 border border-red-500
   text-white font-bold tracking-wide hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300">
                          ⚔️ ATTACK
                        </button>
                        <button className="px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-600 border
  border-blue-500 text-white font-bold tracking-wide hover:shadow-lg hover:shadow-blue-500/50 transition-all
  duration-300">
                          🛡️ DEFEND
                        </button>
                        <button className="px-8 py-4 bg-gradient-to-r from-green-700 to-green-600 border
  border-green-500 text-white font-bold tracking-wide hover:shadow-lg hover:shadow-green-500/50 transition-all
  duration-300">
                          📋 MISSION
                        </button>
                        <button className="px-8 py-4 bg-gradient-to-r from-purple-700 to-purple-600 border
  border-purple-500 text-white font-bold tracking-wide hover:shadow-lg hover:shadow-purple-500/50 transition-all
  duration-300">
                          🔧 UPGRADE
                        </button>
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

                {/* Right Panel - Stats */}
                <div className="w-80 bg-black/60 border-l border-gray-800 p-6">
                  <div className="text-lg font-bold text-orange-400 mb-6 font-mono tracking-wider">
                    › BATTLEFIELD INTEL
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-900/50 border border-gray-700 p-4">
                      <h4 className="text-sm font-bold text-white mb-2">CURRENT THREATS</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Active Hostiles:</span>
                          <span className="text-red-400">7</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Incoming Raids:</span>
                          <span className="text-orange-400">3</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Defense Status:</span>
                          <span className="text-green-400">ACTIVE</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-700 p-4">
                      <h4 className="text-sm font-bold text-white mb-2">RESOURCES</h4>
                      <div className="space-y-3 text-xs">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-400">Computing Power</span>
                            <span className="text-blue-400">847/1000</span>
                          </div>
                          <div className="bg-gray-800 rounded-full h-1">
                            <div className="bg-blue-400 h-1 rounded-full" style={{width: '84.7%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-400">Network Security</span>
                            <span className="text-green-400">623/800</span>
                          </div>
                          <div className="bg-gray-800 rounded-full h-1">
                            <div className="bg-green-400 h-1 rounded-full" style={{width: '77.9%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-400">Token Reserves</span>
                            <span className="text-yellow-400">1,247</span>
                          </div>
                          <div className="bg-gray-800 rounded-full h-1">
                            <div className="bg-yellow-400 h-1 rounded-full" style={{width: '62.4%'}}></div>
                          </div>
                        </div>
                      </div>
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
