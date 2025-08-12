# Protocol Wars 🏆

> Real-time strategy game where DAOs battle for blockchain supremacy using Honeycomb Protocol

Built for the Honeycomb Protocol Game Bounty - showcasing on-chain progression, player traits, and mission logic in an epic DAO battle royale.

## 🎮 Game Overview

Protocol Wars is a multiplayer strategy game where players create and lead DAOs in territorial conquest battles. Each action is tracked on-chain via Honeycomb Protocol, creating permanent, portable progression that transcends individual gaming sessions.

### Core Features

- **DAO Creation & Management**: Create your DAO with on-chain identity via Honeycomb Protocol
- **Territorial Conquest**: Battle for control of resource-generating hexagonal territories  
- **Unit Evolution**: Units gain traits and experience through Honeycomb's trait system
- **Mission System**: Deploy units on various mission types (attack, defend, harvest, raid)
- **Real-time Battles**: 3D battlefield visualization with smooth Three.js animations
- **Seasonal Rankings**: Compete for leaderboard dominance across time-limited seasons

## 🏗️ Technical Architecture

### Honeycomb Protocol Integration

**Missions System**
- Resource gathering missions with time-based rewards
- PvP battle missions with trait-based outcomes  
- Collaborative alliance raids and defense missions
- Daily quest system with persistent tracking

**Trait System**
- Unit evolution based on battle performance
- Dynamic NFT traits that influence combat abilities
- Synergy bonuses between complementary traits
- Cross-game trait portability foundation

**Progression Tracking**  
- Persistent DAO levels and reputation scores
- Individual unit experience and advancement
- Season-based competitive rankings
- Cross-session achievement continuity

### Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **3D Graphics**: Three.js with React Three Fiber
- **Blockchain**: Solana (Devnet), Anchor Framework
- **State Management**: Zustand for real-time game state
- **Wallet Integration**: Solana Wallet Adapter
- **On-chain Logic**: Honeycomb Protocol SDK

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Solana CLI
- Phantom or Solflare wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/ndubu/protocol-wars
cd protocol-wars

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Honeycomb project address

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start playing!

### Environment Setup

Create `.env.local` with:

```bash
NEXT_PUBLIC_PROJECT_ADDRESS=your_honeycomb_project_address
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
```

## 🎯 How to Play

1. **Connect Wallet**: Use Phantom, Solflare, or any Solana wallet
2. **Create DAO**: Establish your on-chain DAO identity via Honeycomb
3. **Recruit Units**: Build your army with Validators, Developers, Degens, and Whales
4. **Deploy Missions**: Send units on resource gathering or battle missions
5. **Conquer Territory**: Attack neutral or enemy territories to expand your domain
6. **Evolve & Upgrade**: Units gain traits and experience through successful missions
7. **Climb Rankings**: Compete for seasonal leaderboard dominance

## 🏅 Honeycomb Protocol Showcase

### Mission Integration
- **Time-based Missions**: Harvest resources over 5-minute cycles
- **Battle Missions**: 3-minute territorial conquest attempts  
- **Reward Distribution**: XP and resource rewards based on mission outcomes
- **Mission Pools**: Categorized mission types with specific requirements

### Trait Evolution
- **Battle Traits**: Offensive, defensive, and economic specializations
- **Experience Tracking**: Unit advancement through successful mission completion
- **Trait Synergies**: Combined abilities unlock enhanced capabilities
- **Permanent Storage**: All traits stored on-chain for cross-game portability

### Progression Systems
- **DAO Leveling**: Collective advancement through territorial expansion
- **Individual Growth**: Unit-specific experience and trait development  
- **Reputation Tracking**: Cross-session performance metrics
- **Seasonal Competition**: Time-limited competitive cycles

## 📱 Mobile Responsive

Protocol Wars is built mobile-first with:
- Touch-optimized battlefield controls
- Responsive UI components
- Progressive Web App capabilities
- Gesture-based navigation

## 🔧 Development

### Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── BattlefieldMap.tsx
│   ├── DAOPanel.tsx
│   ├── MissionPanel.tsx
│   └── Leaderboard.tsx
├── hooks/               # Custom React hooks
│   └── useGameState.ts
├── lib/                 # Utilities and integrations
│   └── honeycomb.ts
├── types/               # TypeScript definitions
│   └── game.ts
└── utils/               # Helper functions
```

### Key Components

- **BattlefieldMap**: Three.js 3D hexagonal battlefield with territory visualization
- **DAOPanel**: DAO management, unit creation, and resource tracking
- **MissionPanel**: Honeycomb mission deployment and progress monitoring
- **Leaderboard**: Real-time competitive rankings and season progression

### Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build production version
npm run build
```

## 🌟 Unique Selling Points

### Complete Honeycomb Integration
- Utilizes ALL three core features (missions, traits, progression)
- Not just a backend utility - core game mechanics powered by Honeycomb
- Demonstrates protocol mastery and genuine utility

### Economic Innovation
- Real resource trading between DAOs creates micro-economy
- Victory rewards in actual Solana tokens, not just points
- Sustainable game economy with staking mechanisms

### Technical Excellence
- Three.js delivers AAA-quality visuals in browser
- Real-time multiplayer synchronization
- Mobile-responsive design for mass adoption
- Gas-optimized smart contracts

### Social & Viral Mechanics
- DAO vs DAO competition drives engagement
- Alliance systems encourage community building
- Seasonal competitions create recurring engagement
- Cross-game reputation foundation

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

This project was built for the Honeycomb Protocol Game Bounty. Future contributions welcome after the competition period.

## 🔗 Links

- [Live Demo](https://protocol-wars.vercel.app)
- [Honeycomb Protocol](https://docs.honeycombprotocol.com)
- [Solana](https://solana.com)
- [Three.js](https://threejs.org)

---

**Built with ❤️ for the Honeycomb Protocol Game Bounty**

*Showcasing the future of on-chain gaming where every action matters, every trait is meaningful, and every progression is permanent.*