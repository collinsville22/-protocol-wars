'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import useGameState from '@/hooks/useGameState';
import { Territory, DAO } from '@/types/game';

// Hexagon geometry helper
function createHexagonGeometry(radius: number) {
  const geometry = new THREE.RingGeometry(radius * 0.8, radius, 6);
  geometry.rotateZ(Math.PI / 6);
  return geometry;
}

// Individual hex tile component
function HexTile({ territory, dao, position, onClick }: {
  territory: Territory;
  dao?: DAO;
  position: [number, number, number];
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const getColor = () => {
    if (!dao) return '#334155'; // Neutral gray
    return dao.color;
  };

  const getResourceColor = () => {
    switch (territory.resourceType) {
      case 'computing': return '#3b82f6'; // Blue
      case 'liquidity': return '#10b981';  // Green
      case 'community': return '#f59e0b';  // Orange
      case 'governance': return '#8b5cf6'; // Purple
      default: return '#6b7280';
    }
  };

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += hovered ? 0.01 : 0;
      meshRef.current.scale.setScalar(hovered ? 1.1 : 1);
    }
  });

  return (
    <group position={position}>
      {/* Main hex tile */}
      <mesh
        ref={meshRef}
        geometry={createHexagonGeometry(1)}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={getColor()}
          transparent
          opacity={dao ? 0.8 : 0.3}
          emissive={hovered ? new THREE.Color(getColor()).multiplyScalar(0.3) : undefined}
        />
      </mesh>

      {/* Resource indicator */}
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[0.3, 0.5, 6]} />
        <meshStandardMaterial color={getResourceColor()} transparent opacity={0.6} />
      </mesh>

      {/* Defense level indicator */}
      {territory.defenseLevel > 0 && (
        <mesh position={[0, 0, 0.02]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1 + territory.defenseLevel * 0.1]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      )}

      {/* Territory info */}
      <Html position={[0, 0, 1]} center>
        <div className="pointer-events-none text-xs text-white text-center">
          <div className="font-bold">{territory.id.slice(-4)}</div>
          {dao && <div className="text-xs opacity-75">{dao.name}</div>}
        </div>
      </Html>
    </group>
  );
}

// Units visualization
function UnitMarkers() {
  const { daos } = useGameState();

  return (
    <>
      {daos.map(dao =>
        dao.units.map(unit => {
          if (!unit.position) return null;
          
          const position = hexToWorldPos(unit.position.q, unit.position.r);
          
          return (
            <mesh key={unit.id} position={[position[0], position[1], 0.5]}>
              <sphereGeometry args={[0.2]} />
              <meshStandardMaterial color={dao.color} emissive={dao.color} emissiveIntensity={0.3} />
              <Html position={[0, 0, 0.5]} center>
                <div className="text-xs text-white font-bold">
                  {unit.type.charAt(0).toUpperCase()}
                </div>
              </Html>
            </mesh>
          );
        })
      )}
    </>
  );
}

// Convert hex coordinates to world position
function hexToWorldPos(q: number, r: number): [number, number, number] {
  const x = 1.5 * q;
  const y = Math.sqrt(3) * (r + q / 2);
  return [x, y, 0];
}

// Generate initial hex grid
function generateHexGrid(radius: number): Territory[] {
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
        owner: Math.random() > 0.7 ? '' : '', // Most territories start neutral
        resourceType: resourceTypes[Math.floor(Math.random() * resourceTypes.length)],
        productionRate: Math.floor(Math.random() * 50) + 10,
        defenseLevel: Math.floor(Math.random() * 3),
      });
    }
  }
  
  return territories;
}

// Scene setup component
function BattlefieldScene() {
  const { territories, daos, initiateBattle } = useGameState();
  const { camera } = useThree();
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(null);

  useEffect(() => {
    // Initialize territories if empty
    if (territories.length === 0) {
      const initialTerritories = generateHexGrid(4);
      // This would need to be implemented in the store
      // useGameState.setState({ territories: initialTerritories });
    }
  }, [territories]);

  const handleTerritoryClick = (territory: Territory) => {
    setSelectedTerritory(territory.id);
    
    // If territory is neutral or enemy, show attack options
    if (!territory.owner || territory.owner !== 'player_dao') {
      // For demo purposes, auto-initiate battle
      initiateBattle('player_dao', territory.id);
    }
  };

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#3b82f6" />
      
      {/* Render hex grid */}
      {territories.map(territory => {
        const position = hexToWorldPos(territory.hexCoords.q, territory.hexCoords.r);
        const dao = territory.owner ? daos.find(d => d.id === territory.owner) : undefined;
        
        return (
          <HexTile
            key={territory.id}
            territory={territory}
            dao={dao}
            position={position}
            onClick={() => handleTerritoryClick(territory)}
          />
        );
      })}
      
      {/* Render units */}
      <UnitMarkers />
      
      {/* Background grid */}
      <gridHelper args={[20, 20, '#334155', '#1e293b']} />
    </>
  );
}

export default function BattlefieldMap() {
  return (
    <div className="w-full h-96 bg-slate-900 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <BattlefieldScene />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={25}
          minDistance={5}
        />
      </Canvas>
      
      {/* Battle controls overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex justify-between items-center bg-gray-900/80 rounded-lg p-3">
          <div className="text-sm text-gray-300">
            <div>Click territories to attack</div>
            <div className="text-xs opacity-75">Mouse to pan/zoom</div>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded">
              Attack Mode
            </button>
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">
              Deploy Units
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}