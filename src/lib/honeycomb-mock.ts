// Mock Honeycomb service for development when SDK is not available
import { Connection, PublicKey } from '@solana/web3.js';

export class HoneycombService {
  private connection: Connection;
  private projectAddress: string;
  
  constructor(rpcUrl?: string) {
    this.connection = new Connection(rpcUrl || 'https://api.devnet.solana.com', 'confirmed');
    this.projectAddress = process.env.NEXT_PUBLIC_PROJECT_ADDRESS || '';
  }

  async createDAO(name: string, leader: PublicKey) {
    // Mock implementation - generates fake addresses for development
    const mockAddress = new PublicKey('11111111111111111111111111111112');
    return { 
      profileAddress: mockAddress, 
      transaction: { serialize: () => Buffer.from([]) }
    };
  }

  async createUnit(daoAddress: string, unitType: string, authority: PublicKey) {
    const mockAddress = new PublicKey('11111111111111111111111111111113');
    return { 
      unitAddress: mockAddress, 
      transaction: { serialize: () => Buffer.from([]) }
    };
  }

  async createMissionPool(name: string, authority: PublicKey) {
    const mockAddress = new PublicKey('11111111111111111111111111111114');
    return { 
      poolAddress: mockAddress, 
      transaction: { serialize: () => Buffer.from([]) }
    };
  }

  async createBattleMission(
    name: string,
    poolAddress: string,
    duration: number,
    minXp: number,
    resourceCost: { address: string; amount: string },
    authority: PublicKey
  ) {
    const mockAddress = new PublicKey('11111111111111111111111111111115');
    return { 
      missionAddress: mockAddress, 
      transaction: { serialize: () => Buffer.from([]) }
    };
  }

  async sendUnitsOnMission(
    missionAddress: string,
    unitAddresses: string[],
    authority: PublicKey
  ) {
    return { serialize: () => Buffer.from([]) };
  }

  async recallUnits(
    missionAddress: string,
    unitAddresses: string[],
    authority: PublicKey
  ) {
    return { serialize: () => Buffer.from([]) };
  }

  async assignTrait(
    characterAddress: string,
    traitType: string,
    authority: PublicKey
  ) {
    return { serialize: () => Buffer.from([]) };
  }

  async getCharacterData(characterAddress: string) {
    return {
      address: characterAddress,
      name: 'Mock Character',
      level: 1,
      experience: 0,
    };
  }

  async getMissionData(missionAddress: string) {
    return {
      address: missionAddress,
      name: 'Mock Mission',
      status: 'active',
      duration: 300,
    };
  }

  getConnection(): Connection {
    return this.connection;
  }
}