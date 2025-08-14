'use client';

  import { useState, useEffect, useCallback } from 'react';
  import { useConnection, useWallet } from '@solana/wallet-adapter-react';
  import HoneycombClient, { Mission, Character, Project } from '@/lib/honeycomb';

  interface UseHoneycombReturn {
      // State
      client: HoneycombClient | null;
      project: Project | null;
      missions: Mission[];
      characters: Character[];
      loading: boolean;
      error: string | null;

      // Actions
      initializeProject: (name: string) => Promise<void>;
      createCharacter: (name: string, model: string) => Promise<void>;
      startMission: (missionId: string, characterId: string) => Promise<boolean>;
      completeMission: (missionId: string) => Promise<void>;
      refreshData: () => Promise<void>;
  }

  export const useHoneycomb = (): UseHoneycombReturn => {
      const { connection } = useConnection();
      const { publicKey, wallet } = useWallet();

      const [client, setClient] = useState<HoneycombClient | null>(null);
      const [project, setProject] = useState<Project | null>(null);
      const [missions, setMissions] = useState<Mission[]>([]);
      const [characters, setCharacters] = useState<Character[]>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      // Initialize Honeycomb client when wallet connects
      useEffect(() => {
          if (connection && wallet) {
              const honeycombClient = new HoneycombClient({
                  connection,
                  wallet,
                  cluster: 'devnet'
              });
              setClient(honeycombClient);
          } else {
              setClient(null);
          }
      }, [connection, wallet]);

      // Initialize project
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

      // Create character
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

      // Start mission
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
                  // Update mission status
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

      // Complete mission
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
                  // Update mission status
                  setMissions(prev => prev.map(mission =>
                      mission.id === missionId
                          ? { ...mission, status: 'completed' as const }
                          : mission
                  ));

                  // TODO: Update character XP/traits based on rewards
                  console.log('Mission completed with rewards:', result.rewards);
              }
          } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to complete mission');
              console.error('Mission completion failed:', err);
          } finally {
              setLoading(false);
          }
      }, [client]);

      // Refresh all data
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
