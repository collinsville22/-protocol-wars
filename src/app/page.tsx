'use client';

  import { useState, useEffect } from 'react';

  export default function Home() {
    const [isClient, setIsClient] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    if (!isClient) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-4xl font-bold text-blue-400 animate-pulse">
            Protocol Wars Loading...
          </div>
        </div>
      );
    }

    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text
  text-transparent">
              PROTOCOL WARS
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Real-time strategy game where DAOs battle for blockchain supremacy using Honeycomb Protocol
            </p>
          </header>

          {/* Game Area */}
          <div className="max-w-6xl mx-auto">
            {!gameStarted ? (
              <div className="text-center space-y-8">
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2">🎯 Missions</h3>
                    <p className="text-gray-300">Complete on-chain missions powered by Honeycomb Protocol</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2">⚡ Traits</h3>
                    <p className="text-gray-300">Evolve your DAO units with dynamic traits and abilities</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2">📈 Progression</h3>
                    <p className="text-gray-300">Permanent on-chain progression that never resets</p>
                  </div>
                </div>

                <button
                  onClick={() => setGameStarted(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700
  px-8 py-4 rounded-lg text-xl font-bold transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  🚀 Enter the Battle Arena
                </button>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">⚔️ Battle Arena</h2>
                <p className="text-gray-300 mb-6">
                  Welcome to Protocol Wars! This is where DAOs compete for blockchain dominance.
                </p>

                {/* Simple game interface */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
                    <h3 className="font-bold text-blue-400">Solana Supremacy DAO</h3>
                    <p className="text-sm text-gray-300">Level 3 • 1,500 Tokens • 120 Power</p>
                    <div className="mt-2 bg-blue-600/30 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>

                  <div className="bg-purple-500/20 border border-purple-500 rounded-lg p-4">
                    <h3 className="font-bold text-purple-400">Battle Status</h3>
                    <p className="text-sm text-gray-300">🎯 Active Missions: 3</p>
                    <p className="text-sm text-gray-300">🏆 Territories: 2/5</p>
                    <p className="text-sm text-gray-300">⚔️ Battles Won: 8</p>
                  </div>

                  <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
                    <h3 className="font-bold text-green-400">Resources</h3>
                    <p className="text-sm text-gray-300">💻 Computing: 150</p>
                    <p className="text-sm text-gray-300">💰 Liquidity: 120</p>
                    <p className="text-sm text-gray-300">👥 Community: 85</p>
                  </div>
                </div>

                <div className="space-x-4">
                  <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold">
                    🎯 Start Mission
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-bold">
                    ⚔️ Attack Territory
                  </button>
                  <button
                    onClick={() => setGameStarted(false)}
                    className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-bold"
                  >
                    ← Back to Menu
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="text-center mt-16 text-gray-400">
            <p>Built for Honeycomb Protocol Game Jam • Powered by Solana Blockchain</p>
            <p className="text-sm mt-2">Season 1 • Real-time DAO Strategy Game</p>
          </footer>
        </div>
      </main>
    );
  }
