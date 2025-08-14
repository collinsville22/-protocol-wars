'use client';

  import { useRef, useState, useEffect } from 'react';
  import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
  import { OrbitControls, Text, Html } from '@react-three/drei';
  import * as THREE from 'three';

  // Define hex grid system
  interface HexCoords {
    q: number;
    r: number;
    s: number;
  }

  interface BattleTile {
    id: string;
    coords: HexCoords;
    owner: string | null;
    resourceType: 'computing' | 'liquidity' | 'community' | 'governance';
    defenseLevel: number;
    units: GameUnit[];
    isAttackable: boolean;
  }

  interface GameUnit {
    id: string;
    type: 'validator' | 'developer' | 'whale' | 'defi_protocol';
    owner: string;
    health: number;
    attack: number;
    position: HexCoords;
    traits: string[];
  }

  // Hex tile component
  function HexTile({ tile, onClick, selected }: {
    tile: BattleTile;
    onClick: (tile: BattleTile) => void;
    selected: boolean;
  }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    // Create hexagon geometry
    const hexGeometry = new THREE.CylinderGeometry(0.9, 0.9, 0.1, 6);

    // Get tile color based on owner and resource type
    const getTileColor = () => {
      if (selected) return '#ffffff';
      if (hovered) return '#64b5f6';
      if (tile.owner === 'player') return '#4caf50';
      if (tile.owner === 'enemy') return '#f44336';

      // Resource type colors
      switch (tile.resourceType) {
        case 'computing': return '#2196f3';
        case 'liquidity': return '#4caf50';
        case 'community': return '#ff9800';
        case 'governance': return '#9c27b0';
        default: return '#424242';
      }
    };

    useFrame(() => {
      if (meshRef.current) {
        meshRef.current.rotation.y += selected ? 0.02 : 0;
        meshRef.current.position.y = selected ? 0.2 : (hovered ? 0.1 : 0);
      }
    });

    return (
      <group position={[tile.coords.q * 1.5, 0, tile.coords.r * Math.sqrt(3) * 0.5]}>
        <mesh
          ref={meshRef}
          geometry={hexGeometry}
          onClick={() => onClick(tile)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <meshLambertMaterial color={getTileColor()} />
        </mesh>

        {/* Defense towers */}
        {tile.defenseLevel > 0 && (
          <mesh position={[0, 0.3, 0]}>
            <coneGeometry args={[0.2, 0.4, 4]} />
            <meshLambertMaterial color="#ff5722" />
          </mesh>
        )}

        {/* Units on tile */}
        {tile.units.map((unit, index) => (
          <mesh key={unit.id} position={[
            (index % 3 - 1) * 0.3,
            0.3,
            Math.floor(index / 3) * 0.3 - 0.3
          ]}>
            <boxGeometry args={[0.2, 0.4, 0.2]} />
            <meshLambertMaterial color={unit.owner === 'player' ? '#00e676' : '#ff1744'} />
          </mesh>
        ))}

        {/* Tile info */}
        <Html position={[0, 0.8, 0]} center>
          <div className="text-xs text-white text-center pointer-events-none">
            <div className="bg-black/70 px-2 py-1 rounded">
              <div className="font-bold">{tile.resourceType.toUpperCase()}</div>
              {tile.units.length > 0 && (
                <div className="text-yellow-400">Units: {tile.units.length}</div>
              )}
            </div>
          </div>
        </Html>
      </group>
    );
  }

  // Game units floating above battlefield
  function BattleUnits({ units }: { units: GameUnit[] }) {
    return (
      <>
        {units.map(unit => (
          <group key={unit.id} position={[
            unit.position.q * 1.5,
            1,
            unit.position.r * Math.sqrt(3) * 0.5
          ]}>
            <mesh>
              <sphereGeometry args={[0.15]} />
              <meshLambertMaterial
                color={unit.owner === 'player' ? '#00e676' : '#ff1744'}
                emissive={unit.owner === 'player' ? '#004d40' : '#b71c1c'}
                emissiveIntensity={0.3}
              />
            </mesh>

            <Html position={[0, 0.5, 0]} center>
              <div className="text-xs text-white font-bold pointer-events-none">
                {unit.type.charAt(0).toUpperCase()}
              </div>
            </Html>
          </group>
        ))}
      </>
    );
  }

  // Main battlefield scene
  function BattlefieldScene({
    tiles,
    selectedTile,
    onTileClick
  }: {
    tiles: BattleTile[];
    selectedTile: string | null;
    onTileClick: (tile: BattleTile) => void;
  }) {
    const { camera } = useThree();

    useEffect(() => {
      camera.position.set(0, 15, 10);
      camera.lookAt(0, 0, 0);
    }, [camera]);

    const allUnits = tiles.flatMap(tile => tile.units);

    return (
      <>
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#64b5f6" />

        {/* Battlefield tiles */}
        {tiles.map(tile => (
          <HexTile
            key={tile.id}
            tile={tile}
            onClick={onTileClick}
            selected={selectedTile === tile.id}
          />
        ))}

        {/* Battle units */}
        <BattleUnits units={allUnits} />

        {/* Background plane */}
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshLambertMaterial color="#0d1117" opacity={0.8} transparent />
        </mesh>
      </>
    );
  }

  export default function HexBattlefield() {
    const [tiles, setTiles] = useState<BattleTile[]>([]);
    const [selectedTile, setSelectedTile] = useState<string | null>(null);
    const [gamePhase, setGamePhase] = useState<'setup' | 'battle' | 'results'>('setup');

    // Generate initial hex battlefield
    useEffect(() => {
      const initialTiles: BattleTile[] = [];
      const radius = 4;

      for (let q = -radius; q <= radius; q++) {
        const r1 = Math.max(-radius, -q - radius);
        const r2 = Math.min(radius, -q + radius);

        for (let r = r1; r <= r2; r++) {
          const s = -q - r;
          const distance = Math.abs(q) + Math.abs(r) + Math.abs(s);

          const tile: BattleTile = {
            id: `tile_${q}_${r}_${s}`,
            coords: { q, r, s },
            owner: distance < 2 ? (Math.random() > 0.5 ? 'player' : 'enemy') : null,
            resourceType: ['computing', 'liquidity', 'community', 'governance'][
              Math.floor(Math.random() * 4)
            ] as any,
            defenseLevel: Math.random() > 0.7 ? 1 : 0,
            units: [],
            isAttackable: distance < 3
          };

          // Add some random units
          if (tile.owner) {
            const unitCount = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < unitCount; i++) {
              tile.units.push({
                id: `unit_${tile.id}_${i}`,
                type: ['validator', 'developer', 'whale', 'defi_protocol'][
                  Math.floor(Math.random() * 4)
                ] as any,
                owner: tile.owner,
                health: 100,
                attack: 25,
                position: tile.coords,
                traits: ['fast_deploy', 'high_security'].slice(0, Math.floor(Math.random() * 2) + 1)
              });
            }
          }

          initialTiles.push(tile);
        }
      }

      setTiles(initialTiles);
    }, []);

    const handleTileClick = (tile: BattleTile) => {
      setSelectedTile(tile.id);

      if (tile.isAttackable && tile.owner !== 'player') {
        // Initiate battle sequence
        console.log(`🍯 Honeycomb Protocol: Battle initiated on ${tile.id}`);
        // Here we would call actual Honeycomb mission system
      }
    };

    return (
      <div className="w-full h-96 bg-black rounded-lg overflow-hidden relative">
        <Canvas camera={{ fov: 60, near: 0.1, far: 1000 }}>
          <BattlefieldScene
            tiles={tiles}
            selectedTile={selectedTile}
            onTileClick={handleTileClick}
          />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={25}
            minDistance={5}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>

        {/* Battle UI Overlay */}
        <div className="absolute top-4 left-4 right-4 pointer-events-none">
          <div className="bg-black/80 border border-green-500 rounded-lg p-4">
            <h3 className="text-green-400 font-bold mb-2">🎯 BATTLE COMMAND</h3>
            <div className="text-sm text-gray-300">
              {selectedTile ? (
                <div>
                  <div>Selected: {selectedTile}</div>
                  <div>Click enemy territories to attack</div>
                </div>
              ) : (
                <div>Click a tile to select your target</div>
              )}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
          <div className="bg-black/90 border border-blue-500 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-2">
              <button className="bg-red-600 hover:bg-red-700 px-3 py-2 text-sm font-bold rounded transition-colors">
                ⚔️ ATTACK
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 px-3 py-2 text-sm font-bold rounded transition-colors">
                🛡️ DEFEND
              </button>
              <button className="bg-green-600 hover:bg-green-700 px-3 py-2 text-sm font-bold rounded transition-colors">
                📋 MISSION
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
