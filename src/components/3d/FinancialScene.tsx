import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Animated particle system representing market data
function DataParticles({ count = 500 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const light = useRef<THREE.PointLight>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spread particles in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3 + Math.random() * 4;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Color gradient from electric blue to cyan
      const t = Math.random();
      colors[i * 3] = 0.39 + t * 0.0;     // R: 99/255 to 0/255
      colors[i * 3 + 1] = 0.36 + t * 0.47; // G: 91/255 to 212/255
      colors[i * 3 + 2] = 1.0;              // B: 255/255
    }

    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
    if (light.current) {
      light.current.position.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 5;
      light.current.position.z = Math.cos(state.clock.getElapsedTime() * 0.5) * 5;
    }
  });

  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="#635BFF" />
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
          size={0.05}
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

// Floating geometric shapes
function FloatingShape({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.005;
      mesh.current.rotation.y += 0.005;
      mesh.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + position[0]) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={mesh} position={position} scale={scale}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

// Central glowing sphere
function CentralOrb() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      const material = mesh.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <Sphere ref={mesh} args={[1.2, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#635BFF"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive="#635BFF"
          emissiveIntensity={0.4}
        />
      </Sphere>
    </Float>
  );
}

// Connection lines between points (network visualization)
function NetworkLines() {
  const linesRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const points: number[] = [];
    const nodeCount = 20;
    const nodes: THREE.Vector3[] = [];

    // Create random nodes
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2 + Math.random() * 2;

      nodes.push(new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      ));
    }

    // Connect nearby nodes
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const distance = nodes[i].distanceTo(nodes[j]);
        if (distance < 2.5) {
          points.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );
        }
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geom;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#00D4FF" transparent opacity={0.3} />
    </lineSegments>
  );
}

// Main scene component
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#635BFF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00D4FF" />

      {/* Background stars */}
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />

      {/* Central orb */}
      <CentralOrb />

      {/* Network visualization */}
      <NetworkLines />

      {/* Data particles */}
      <DataParticles count={800} />

      {/* Floating geometric shapes */}
      <FloatingShape position={[-3, 2, -2]} color="#635BFF" scale={0.8} />
      <FloatingShape position={[3, -1, -1]} color="#00D4FF" scale={0.6} />
      <FloatingShape position={[2, 2.5, 1]} color="#10B981" scale={0.5} />
      <FloatingShape position={[-2.5, -2, 2]} color="#F59E0B" scale={0.4} />
      <FloatingShape position={[4, 0, -3]} color="#635BFF" scale={0.7} />

      {/* Camera controls (subtle auto-rotate) */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
}

// Exported component with Canvas wrapper
export default function FinancialScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
