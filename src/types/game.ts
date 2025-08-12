export interface DAO {
  id: string;
  name: string;
  treasury: string;
  level: number;
  territories: Territory[];
  units: Unit[];
  resources: ResourcePool;
  alliances: string[];
  color: string;
  leader: string;
}

export interface Territory {
  id: string;
  hexCoords: { q: number; r: number; s: number };
  owner: string;
  resourceType: ResourceType;
  productionRate: number;
  defenseLevel: number;
}

export interface Unit {
  id: string;
  type: UnitType;
  owner: string;
  traits: UnitTrait[];
  experience: number;
  level: number;
  currentMission?: string;
  position?: { q: number; r: number; s: number };
}

export interface UnitTrait {
  id: string;
  category: 'offensive' | 'defensive' | 'economic';
  level: number;
  experience: number;
  evolutions: Evolution[];
  synergies: string[];
}

export interface Evolution {
  id: string;
  name: string;
  requirements: { level: number; experience: number };
  bonuses: { [key: string]: number };
}

export interface Mission {
  id: string;
  type: 'attack' | 'defend' | 'harvest' | 'raid';
  participants: string[];
  target?: string;
  duration: number;
  rewards: MissionReward[];
  status: 'pending' | 'active' | 'completed' | 'failed';
  startTime?: number;
}

export interface MissionReward {
  type: 'xp' | 'resource' | 'trait';
  amount: number;
  resourceType?: ResourceType;
  traitId?: string;
}

export interface ResourcePool {
  computing: number;
  liquidity: number;
  community: number;
  governance: number;
}

export type ResourceType = 'computing' | 'liquidity' | 'community' | 'governance';
export type UnitType = 'validator' | 'developer' | 'degen' | 'whale';

export interface GameState {
  daos: DAO[];
  territories: Territory[];
  missions: Mission[];
  leaderboard: LeaderboardEntry[];
  season: {
    number: number;
    startTime: number;
    endTime: number;
  };
}

export interface LeaderboardEntry {
  daoId: string;
  score: number;
  territoriesControlled: number;
  battlesWon: number;
  rank: number;
}