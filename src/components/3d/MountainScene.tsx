import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Clean, sharp mountain geometry - elegant and minimal
function Mountain({ position, scale, color, emissive }: {
  position: [number, number, number];
  scale: number;
  color: string;
  emissive?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && emissive) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.15;
    }
  });

  // Sharp 4-sided pyramid - clean and precise
  const geometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(1, 3, 4, 1);
    geo.rotateY(Math.PI / 4);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} position={position} scale={scale} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.6}
        flatShading
        emissive={emissive ? color : '#000000'}
        emissiveIntensity={emissive ? 0.35 : 0}
      />
    </mesh>
  );
}

// Cosmic mountain range - gentle swaying motion
function CosmicMountains() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle back-and-forth sway
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.08;
      groupRef.current.position.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.3;
    }
  });

  const mountains = useMemo(() => [
    // Hero mountain - brand purple, glowing
    { position: [0, -0.5, -6] as [number, number, number], scale: 2.2, color: '#635BFF', emissive: true },

    // Flanking peaks - slate grays
    { position: [-3.5, -1, -7] as [number, number, number], scale: 1.8, color: '#475569', emissive: false },
    { position: [3.5, -0.8, -6.5] as [number, number, number], scale: 1.6, color: '#475569', emissive: false },

    // Mid-ground peaks
    { position: [-6, -1.2, -9] as [number, number, number], scale: 2.0, color: '#334155', emissive: false },
    { position: [6, -1, -8] as [number, number, number], scale: 1.9, color: '#334155', emissive: false },
    { position: [-1.5, -1.3, -10] as [number, number, number], scale: 2.4, color: '#1e293b', emissive: false },
    { position: [2, -1.4, -11] as [number, number, number], scale: 2.6, color: '#1e293b', emissive: false },

    // Distant silhouettes
    { position: [-8, -1.5, -14] as [number, number, number], scale: 3.0, color: '#0f172a', emissive: false },
    { position: [0, -1.5, -16] as [number, number, number], scale: 3.5, color: '#0f172a', emissive: false },
    { position: [8, -1.5, -13] as [number, number, number], scale: 2.8, color: '#0f172a', emissive: false },

    // Small accent peaks - floating
    { position: [-2.5, 1.5, -4] as [number, number, number], scale: 0.5, color: '#635BFF', emissive: true },
    { position: [3, 2, -3.5] as [number, number, number], scale: 0.4, color: '#00D4FF', emissive: true },
  ], []);

  return (
    <group ref={groupRef}>
      {mountains.map((m, i) => (
        <Mountain key={i} {...m} />
      ))}
    </group>
  );
}

// Data particles (from FinancialScene style)
function CosmicParticles({ count = 600 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const light = useRef<THREE.PointLight>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 4 + Math.random() * 6;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Color gradient: purple to cyan to white
      const t = Math.random();
      if (t < 0.5) {
        colors[i * 3] = 0.39;      // Purple
        colors[i * 3 + 1] = 0.36;
        colors[i * 3 + 2] = 1.0;
      } else if (t < 0.8) {
        colors[i * 3] = 0.0;       // Cyan
        colors[i * 3 + 1] = 0.83;
        colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 0.9;       // White
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 1.0;
      }
    }

    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.1;
    }
    if (light.current) {
      light.current.position.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 6;
      light.current.position.z = Math.cos(state.clock.getElapsedTime() * 0.3) * 6;
    }
  });

  return (
    <>
      <pointLight ref={light} distance={50} intensity={5} color="#635BFF" />
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

// Central glowing orb (sun/moon behind mountains)
function CelestialOrb() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      const material = mesh.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.4 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.15;
    }
  });

  return (
    <group>
      <Sphere ref={mesh} args={[1.5, 64, 64]} position={[0, 3, -15]}>
        <MeshDistortMaterial
          color="#F0F0F5"
          attach="material"
          distort={0.2}
          speed={1.5}
          roughness={0.1}
          metalness={0.2}
          emissive="#F0F0F5"
          emissiveIntensity={0.5}
        />
      </Sphere>
      {/* Glow ring */}
      <mesh position={[0, 3, -15.1]}>
        <ringGeometry args={[1.6, 3, 64]} />
        <meshBasicMaterial color="#635BFF" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Network lines connecting peaks (constellation effect)
function ConstellationLines() {
  const linesRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const points: number[] = [];
    const nodes = [
      [0, 0.5, -5],
      [-4, -0.5, -6],
      [4, -0.2, -5.5],
      [-3, 2, -4],
      [4, 1.5, -3],
      [0, 3, -15],
    ];

    // Connect nodes in a constellation pattern
    const connections = [
      [0, 1], [0, 2], [0, 5],
      [1, 3], [2, 4],
      [3, 5], [4, 5],
    ];

    connections.forEach(([i, j]) => {
      points.push(
        nodes[i][0], nodes[i][1], nodes[i][2],
        nodes[j][0], nodes[j][1], nodes[j][2]
      );
    });

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geom;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      const material = linesRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.15 + Math.sin(state.clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#00D4FF" transparent opacity={0.2} />
    </lineSegments>
  );
}

// Shooting stars / meteors
function ShootingStars() {
  const starsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 5;
    const positions = new Float32Array(count * 3);
    const velocities: number[] = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = 5 + Math.random() * 10;
      positions[i * 3 + 2] = -10 - Math.random() * 10;
      velocities.push(0.1 + Math.random() * 0.1);
    }

    return { positions, velocities, count };
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      const positions = starsRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particles.count; i++) {
        positions[i * 3] += particles.velocities[i] * 2;
        positions[i * 3 + 1] -= particles.velocities[i];

        // Reset when off screen
        if (positions[i * 3] > 20 || positions[i * 3 + 1] < -5) {
          positions[i * 3] = -20 + Math.random() * 10;
          positions[i * 3 + 1] = 5 + Math.random() * 10;
        }
      }

      starsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffffff"
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Main scene
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 10, 5]} intensity={0.3} color="#9CA3AF" />
      <pointLight position={[-5, 5, -5]} intensity={0.8} color="#635BFF" />
      <pointLight position={[5, 3, -3]} intensity={0.5} color="#00D4FF" />
      <pointLight position={[0, 5, -10]} intensity={1} color="#F0F0F5" />

      {/* Background stars */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.2} fade speed={0.5} />

      {/* Celestial orb (moon/sun) */}
      <CelestialOrb />

      {/* Shooting stars */}
      <ShootingStars />

      {/* Cosmic particles */}
      <CosmicParticles count={800} />

      {/* Constellation lines */}
      <ConstellationLines />

      {/* Floating mountains */}
      <CosmicMountains />
    </>
  );
}

// Exported component
export default function MountainScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 1, 8], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
