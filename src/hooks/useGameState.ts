import { create } from 'zustand';
import { GameState, DAO, Mission, Territory, Unit, UnitType } from '@/types/game';

interface GameStateStore extends GameState {
  // Actions
  updateDAO: (dao: DAO) => void;
  addMission: (mission: Mission) => void;
  updateMission: (missionId: string, updates: Partial<Mission>) => void;
  captureTerritory: (territoryId: string, newOwner: string) => void;
  addDAO: (dao: DAO) => void;
  
  // Game loop
  processGameTick: () => void;
  
  // Battle system
  initiateBattle: (attackerDAO: string, targetTerritory: string) => void;
  resolveBattle: (missionId: string) => void;
  
  // Unit system
  deployUnit: (unitType: UnitType, position: { q: number; r: number; s: number }) => void;
  
  // Game initialization
  initializeGame: () => void;
}

const useGameState = create<GameStateStore>((set, get) => ({
  // Initial state
  daos: [],
  territories: [],
  missions: [],
  leaderboard: [],
  season: {
    number: 1,
    startTime: Date.now(),
    endTime: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
  },

  // Actions
  updateDAO: (dao: DAO) => 
    set((state) => ({
      daos: state.daos.map(d => d.id === dao.id ? dao : d)
    })),

  addDAO: (dao: DAO) =>
    set((state) => ({
      daos: [...state.daos, dao]
    })),

  addMission: (mission: Mission) =>
    set((state) => ({
      missions: [...state.missions, mission]
    })),

  updateMission: (missionId: string, updates: Partial<Mission>) =>
    set((state) => ({
      missions: state.missions.map(m => 
        m.id === missionId ? { ...m, ...updates } : m
      )
    })),

  captureTerritory: (territoryId: string, newOwner: string) =>
    set((state) => ({
      territories: state.territories.map(t =>
        t.id === territoryId ? { ...t, owner: newOwner } : t
      )
    })),

  processGameTick: () => {
    const state = get();
    const now = Date.now();
    
    // Process active missions
    state.missions.forEach(mission => {
      if (mission.status === 'active' && mission.startTime) {
        const elapsed = now - mission.startTime;
        if (elapsed >= mission.duration * 1000) {
          get().resolveBattle(mission.id);
        }
      }
    });

    // Update resource production
    state.territories.forEach(territory => {
      if (territory.owner) {
        const dao = state.daos.find(d => d.id === territory.owner);
        if (dao) {
          const resourceGain = territory.productionRate / 60; // per second
          const updatedDAO = {
            ...dao,
            resources: {
              ...dao.resources,
              [territory.resourceType]: dao.resources[territory.resourceType] + resourceGain
            }
          };
          get().updateDAO(updatedDAO);
        }
      }
    });

    // Update leaderboard
    const updatedLeaderboard = state.daos
      .map(dao => ({
        daoId: dao.id,
        score: dao.level * 100 + dao.territories.length * 50,
        territoriesControlled: dao.territories.length,
        battlesWon: 0, // This would be tracked separately
        rank: 0,
      }))
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    set({ leaderboard: updatedLeaderboard });
  },

  initiateBattle: (attackerDAO: string, targetTerritory: string) => {
    const mission: Mission = {
      id: `battle_${Date.now()}`,
      type: 'attack',
      participants: [attackerDAO],
      target: targetTerritory,
      duration: 300, // 5 minutes
      rewards: [
        { type: 'xp', amount: 100 },
        { type: 'resource', amount: 1000, resourceType: 'computing' }
      ],
      status: 'active',
      startTime: Date.now(),
    };

    get().addMission(mission);
  },

  resolveBattle: (missionId: string) => {
    const state = get();
    const mission = state.missions.find(m => m.id === missionId);
    if (!mission || !mission.target) return;

    const attackerDAO = state.daos.find(d => d.id === mission.participants[0]);
    const territory = state.territories.find(t => t.id === mission.target);
    
    if (!attackerDAO || !territory) return;

    // Simple battle resolution - could be made more complex
    const attackPower = attackerDAO.units.reduce((sum, unit) => 
      sum + unit.level * 10, 0
    );
    const defensePower = territory.defenseLevel * 50;

    const success = attackPower > defensePower;

    if (success) {
      // Capture territory
      get().captureTerritory(territory.id, attackerDAO.id);
      
      // Update DAO
      const updatedDAO = {
        ...attackerDAO,
        territories: [...attackerDAO.territories, territory],
        level: attackerDAO.level + 1,
      };
      get().updateDAO(updatedDAO);
    }

    // Update mission status
    get().updateMission(missionId, { 
      status: success ? 'completed' : 'failed' 
    });

    // Award rewards if successful
    if (success && mission.rewards) {
      mission.rewards.forEach(reward => {
        if (reward.type === 'xp') {
          attackerDAO.units.forEach(unit => {
            unit.experience += reward.amount;
            if (unit.experience >= unit.level * 100) {
              unit.level += 1;
              unit.experience = 0;
            }
          });
        }
      });
    }
  },

  deployUnit: (unitType: UnitType, position: { q: number; r: number; s: number }) => {
    const state = get();
    const playerDAO = state.daos.find(dao => dao.id === 'player_dao');
    
    if (!playerDAO) {
      // Create player DAO if it doesn't exist
      const newPlayerDAO: DAO = {
        id: 'player_dao',
        name: 'Player DAO',
        treasury: '0x...',
        level: 1,
        territories: [],
        units: [],
        resources: {
          computing: 1000,
          liquidity: 1000,
          community: 1000,
          governance: 1000,
        },
        alliances: [],
        color: '#3b82f6',
        leader: 'player',
      };
      get().addDAO(newPlayerDAO);
    }

    const updatedPlayerDAO = state.daos.find(dao => dao.id === 'player_dao');
    if (!updatedPlayerDAO) return;

    const newUnit: Unit = {
      id: `unit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: unitType,
      owner: 'player_dao',
      traits: [],
      experience: 0,
      level: 1,
      position: position,
    };

    const updatedDAO: DAO = {
      ...updatedPlayerDAO,
      units: [...updatedPlayerDAO.units, newUnit],
    };

    get().updateDAO(updatedDAO);
  },

  initializeGame: () => {
    const state = get();
    
    // Generate hex grid territories
    const generateHexGrid = (radius: number): Territory[] => {
      const territories: Territory[] = [];
      let id = 0;

      for (let q = -radius; q <= radius; q++) {
        const r1 = Math.max(-radius, -q - radius);
        const r2 = Math.min(radius, -q + radius);
        
        for (let r = r1; r <= r2; r++) {
          const s = -q - r;
          const resourceTypes = ['computing', 'liquidity', 'community', 'governance'] as const;
          
          territories.push({
            id: `hex_${id++}`,
            hexCoords: { q, r, s },
            owner: Math.random() > 0.8 ? 'enemy_dao' : '', // Some enemy territories
            resourceType: resourceTypes[Math.floor(Math.random() * resourceTypes.length)],
            productionRate: Math.floor(Math.random() * 50) + 10,
            defenseLevel: Math.floor(Math.random() * 3),
          });
        }
      }
      
      return territories;
    };

    // Create initial territories
    const initialTerritories = generateHexGrid(3);
    
    // Create player DAO if it doesn't exist
    if (!state.daos.find(dao => dao.id === 'player_dao')) {
      const playerDAO: DAO = {
        id: 'player_dao',
        name: 'Your DAO',
        treasury: '0x1234...abcd',
        level: 1,
        territories: initialTerritories.filter(t => !t.owner).slice(0, 2), // Give player 2 starting territories
        units: [],
        resources: {
          computing: 1000,
          liquidity: 1000,
          community: 1000,
          governance: 1000,
        },
        alliances: [],
        color: '#3b82f6',
        leader: 'Commander',
      };
      
      // Mark some territories as owned by player
      initialTerritories.slice(0, 2).forEach(t => t.owner = 'player_dao');
      
      get().addDAO(playerDAO);
    }

    // Create enemy DAO
    if (!state.daos.find(dao => dao.id === 'enemy_dao')) {
      const enemyDAO: DAO = {
        id: 'enemy_dao',
        name: 'Rival Protocol',
        treasury: '0xabcd...1234',
        level: 2,
        territories: initialTerritories.filter(t => t.owner === 'enemy_dao'),
        units: [],
        resources: {
          computing: 800,
          liquidity: 800,
          community: 800,
          governance: 800,
        },
        alliances: [],
        color: '#ef4444',
        leader: 'AI Commander',
      };
      
      get().addDAO(enemyDAO);
    }

    // Set territories in state
    set({ territories: initialTerritories });

    // Add some initial missions
    if (state.missions.length === 0) {
      const initialMissions: Mission[] = [
        {
          id: 'tutorial_deploy',
          type: 'deploy' as any,
          participants: ['player_dao'],
          duration: 60,
          rewards: [
            { type: 'xp', amount: 100 },
            { type: 'resource', amount: 500, resourceType: 'computing' }
          ],
          status: 'pending',
        },
        {
          id: 'tutorial_attack',
          type: 'attack',
          participants: ['player_dao'],
          target: initialTerritories.find(t => !t.owner)?.id,
          duration: 120,
          rewards: [
            { type: 'xp', amount: 200 },
            { type: 'resource', amount: 1000, resourceType: 'liquidity' }
          ],
          status: 'pending',
        }
      ];
      
      initialMissions.forEach(mission => get().addMission(mission));
    }
  },
}));

export default useGameState;