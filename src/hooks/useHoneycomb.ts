'use client';

  import { useState, useEffect, useCallback } from 'react';
  import { useConnection, useWallet } from '@solana/wallet-adapter-react';

  interface Mission {
      id: string;
      name: string;
      description: string;
      requirements: {
          level: number;
          character?: string;
      };
      rewards: {
          xp: number;
          tokens: number;
          traits?: string[];
      };
      duration: number;
      status: 'available' | 'active' | 'completed' | 'failed';
      cooldown?: number;
  }

  interface Character {
      id: string;
      name: string;
      level: number;
      xp: number;
      traits: any[];
      owner: any;
      model: string;
  }

  interface Project {
      id: string;
      name: string;
      authority: any;
      characters: Character[];
      missions: Mission[];
  }

  interface UseHoneycombReturn {
      client: any;
      project: Project | null;
      missions: Mission[];
      characters: Character[];
      loading: boolean;
      error: string | null;
      initializeProject: (name: string) => Promise<void>;
      createCharacter: (name: string, model: string) => Promise<void>;
      startMission: (missionId: string, characterId: string) => Promise<boolean>;
      completeMission: (missionId: string) => Promise<void>;
      refreshData: () => Promise<void>;
  }

  export const useHoneycomb = (): UseHoneycombReturn => {
      const { connection } = useConnection();
      const { publicKey, wallet } = useWallet();

      const [client, setClient] = useState<any>(null);
      const [project, setProject] = useState<Project | null>(null);
      const [missions, setMissions] = useState<Mission[]>([]);
      const [characters, setCharacters] = useState<Character[]>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      // Mock Honeycomb client
      useEffect(() => {
          if (connection && wallet) {
              const mockClient = {
                  createProject: async (name: string, authority: any): Promise<Project> => {
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      const project: Project = {
                          id: `project_${Date.now()}`,
                          name,
                          authority,
                          characters: [],
                          missions: [
                              {
                                  id: 'mission_1',
                                  name: 'Validator Deployment',
                                  description: 'Deploy a new validator node to strengthen the network',
                                  requirements: { level: 1 },
                                  rewards: { xp: 150, tokens: 500 },
                                  duration: 3600,
                                  status: 'available' as const,
                                  cooldown: 86400
                              },
                              {
                                  id: 'mission_2',
                                  name: 'DAO Governance Vote',
                                  description: 'Participate in critical governance decisions',
                                  requirements: { level: 2 },
                                  rewards: { xp: 200, tokens: 750, traits: ['governance'] },
                                  duration: 7200,
                                  status: 'available' as const,
                                  cooldown: 172800
                              },
                              {
                                  id: 'mission_3',
                                  name: 'Protocol Security Audit',
                                  description: 'Audit smart contracts for vulnerabilities',
                                  requirements: { level: 3 },
                                  rewards: { xp: 300, tokens: 1000 },
                                  duration: 5400,
                                  status: 'available' as const,
                                  cooldown: 259200
                              }
                          ],
                      };
                      console.log('🍯 Honeycomb Protocol: Creating project', project);
                      return project;
                  },
                   createCharacter: async (name: string, model: string): Promise<Character> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const character: Character = {
          id: `char_${Date.now()}`,
          name,
          level: 1,
          xp: 0,
          traits: [],
          owner: publicKey,
          model,
      };
      console.log('🍯 Honeycomb Protocol: Creating character', character);
      return character;
  },
                  startMission: async (missionId: string, characterId: string): Promise<boolean> => {
                      console.log(`🍯 Honeycomb Protocol: Starting mission ${missionId}`);
                      await new Promise(resolve => setTimeout(resolve, 800));
                      return Math.random() > 0.1; // 90% success rate
                  },
                  completeMission: async (missionId: string) => {
                      console.log(`🍯 Honeycomb Protocol: Completing mission ${missionId}`);
                      await new Promise(resolve => setTimeout(resolve, 800));
                      return {
                          success: true,
                          rewards: { xp: 100, tokens: 50, traits: [] }
                      };
                  },
                  getMissions: async (projectId: string): Promise<Mission[]> => {
                      return missions;
                  }
              };
              setClient(mockClient);
          } else {
              setClient(null);
          }
      }, [connection, wallet, missions]);

      const initializeProject = useCallback(async (name: string) => {
          if (!client || !publicKey) {
              setError('Wallet not connected');
              return;
          }

          setLoading(true);
          setError(null);

          try {
              const newProject = await client.createProject(name, publicKey);
              setProject(newProject);
              setMissions(newProject.missions);
              setCharacters(newProject.characters);
          } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to create project');
              console.error('Project initialization failed:', err);
          } finally {
              setLoading(false);
          }
      }, [client, publicKey]);

      const createCharacter = useCallback(async (name: string, model: string) => {
          if (!client) {
              setError('Client not initialized');
              return;
          }

          setLoading(true);
          setError(null);

          try {
              const newCharacter = await client.createCharacter(name, model);
              setCharacters(prev => [...prev, newCharacter]);
          } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to create character');
              console.error('Character creation failed:', err);
          } finally {
              setLoading(false);
          }
      }, [client]);

      const startMission = useCallback(async (missionId: string, characterId: string): Promise<boolean> => {
          if (!client) {
              setError('Client not initialized');
              return false;
          }

          setLoading(true);
          setError(null);

          try {
              const success = await client.startMission(missionId, characterId);

              if (success) {
                  setMissions(prev => prev.map(mission =>
                      mission.id === missionId
                          ? { ...mission, status: 'active' as const }
                          : mission
                  ));
              }

              return success;
          } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to start mission');
              console.error('Mission start failed:', err);
              return false;
          } finally {
              setLoading(false);
          }
      }, [client]);

      const completeMission = useCallback(async (missionId: string) => {
          if (!client) {
              setError('Client not initialized');
              return;
          }

          setLoading(true);
          setError(null);

          try {
              const result = await client.completeMission(missionId);

              if (result.success) {
                  setMissions(prev => prev.map(mission =>
                      mission.id === missionId
                          ? { ...mission, status: 'completed' as const }
                          : mission
                  ));

                  console.log('🍯 Mission completed with rewards:', result.rewards);
              }
          } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to complete mission');
              console.error('Mission completion failed:', err);
          } finally {
              setLoading(false);
          }
      }, [client]);

      const refreshData = useCallback(async () => {
          if (!client || !project) return;

          setLoading(true);
          setError(null);

          try {
              const updatedMissions = await client.getMissions(project.id);
              setMissions(updatedMissions);
          } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to refresh data');
              console.error('Data refresh failed:', err);
          } finally {
              setLoading(false);
          }
      }, [client, project]);

      return {
          client,
          project,
          missions,
          characters,
          loading,
          error,
          initializeProject,
          createCharacter,
          startMission,
          completeMission,
          refreshData,
      };
  };

  export default useHoneycomb;
