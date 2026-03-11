import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Clean silver arrow with sweeping light - runs 3 times then stays lit
function SilverArrow() {
  const glowLightRef = useRef<THREE.PointLight>(null);
  const startTime = useRef<number | null>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Record start time on first frame
    if (startTime.current === null) {
      startTime.current = time;
    }

    // Time since component mounted
    const localTime = time - startTime.current;

    // 0.4s sweep + 0.5s hold = 0.9s total cycle
    const sweepTime = 0.4;
    const holdTime = 0.5;
    const cycleTime = sweepTime + holdTime;

    // Count cycles since mount
    const cycleCount = Math.floor(localTime / cycleTime);

    // After 7 cycles complete, stay fully lit
    if (cycleCount >= 7) {
      if (glowLightRef.current) {
        glowLightRef.current.position.x = 0;
        glowLightRef.current.position.z = 6;
        glowLightRef.current.intensity = 100;
        glowLightRef.current.distance = 25;
      }
      return;
    }

    const rawTime = localTime % cycleTime;
    const progress = rawTime < sweepTime
      ? rawTime / sweepTime
      : 1;

    // Light sweeps continuously from left to right
    const lightX = -1.5 + progress * 3.5;

    if (glowLightRef.current) {
      // On the 7th cycle (index 6), gradually expand light coverage as it sweeps
      if (cycleCount === 6) {
        // Sweep position moves right, but light expands to cover everything behind it
        glowLightRef.current.position.x = (lightX - 1.5) / 2; // Center between start and current
        glowLightRef.current.position.z = 4 + progress * 2; // Move back to cover more
        glowLightRef.current.distance = 10 + progress * 15; // Expand coverage
        glowLightRef.current.intensity = 60 + progress * 40; // Increase brightness
      } else {
        // Normal sweep
        glowLightRef.current.position.x = lightX;
        glowLightRef.current.position.z = 4;
        glowLightRef.current.distance = 15;
        const brightness = 0.7 + progress * 0.3;
        glowLightRef.current.intensity = 60 * brightness;
      }
    }
  });

  return (
    <group>
      <ambientLight intensity={0.03} />
      <pointLight
        ref={glowLightRef}
        position={[-1.5, 0, 4]}
        intensity={60}
        color="#ffffff"
        distance={15}
        decay={0}
      />
      <pointLight position={[0, 0, -1]} intensity={0.3} color="#635BFF" distance={5} />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 0.1, 0.1]} />
        <meshStandardMaterial color="#888899" metalness={1} roughness={0.12} />
      </mesh>
      <mesh position={[1.15, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.32, 0.55, 3]} />
        <meshStandardMaterial color="#AAAABC" metalness={1} roughness={0.05} />
      </mesh>
    </group>
  );
}

export default function Philosophy() {
  return (
    <div className="py-12">
      <div className="flex justify-center items-center gap-2 md:gap-3 whitespace-nowrap">
        {/* FAST */}
        <span
          className="text-lg md:text-2xl lg:text-3xl font-semibold tracking-wide"
          style={{
            color: '#9CA3AF',
            letterSpacing: '0.05em',
          }}
        >
          Fast
        </span>

        {/* Arrow 1 */}
        <div
          className="h-8 w-12 md:h-10 md:w-16 lg:h-12 lg:w-20"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.25))',
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 2], fov: 50 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <SilverArrow />
          </Canvas>
        </div>

        {/* ADAPTIVE */}
        <span
          className="text-lg md:text-2xl lg:text-3xl font-semibold tracking-wide"
          style={{
            color: '#9CA3AF',
            letterSpacing: '0.05em',
          }}
        >
          Adaptive
        </span>

        {/* Arrow 2 */}
        <div
          className="h-8 w-12 md:h-10 md:w-16 lg:h-12 lg:w-20"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.25))',
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 2], fov: 50 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <SilverArrow />
          </Canvas>
        </div>

        {/* TOGETHER */}
        <span
          className="text-lg md:text-2xl lg:text-3xl font-semibold tracking-wide"
          style={{
            color: '#9CA3AF',
            letterSpacing: '0.05em',
          }}
        >
          Together
        </span>
      </div>
    </div>
  );
}
