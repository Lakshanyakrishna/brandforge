import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

function HexMark({ reducedMotion }) {
  const groupRef = useRef(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (!reducedMotion) {
      group.rotation.y += delta * 0.25;
    }

    const targetX = reducedMotion ? 0.4 : 0.4 + state.pointer.y * 0.25;
    const targetZ = reducedMotion ? 0 : state.pointer.x * -0.2;
    group.rotation.x = MathUtils.lerp(group.rotation.x, targetX, 0.06);
    group.rotation.z = MathUtils.lerp(group.rotation.z, targetZ, 0.06);
  });

  return (
    <group ref={groupRef} rotation={[0.4, 0.6, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.95, 6]} />
        <meshStandardMaterial attach="material-0" color="#5850ec" emissive="#5850ec" emissiveIntensity={0.3} roughness={0.4} metalness={0.3} />
        <meshStandardMaterial attach="material-1" color="#c3c0ff" emissive="#c3c0ff" emissiveIntensity={0.2} roughness={0.25} metalness={0.15} />
        <meshStandardMaterial attach="material-2" color="#100b26" roughness={0.55} metalness={0.3} />
      </mesh>
    </group>
  );
}

export default function HeroScene3D({ reducedMotion }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 38 }}
      style={{ touchAction: 'pan-y' }}
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[4, 4, 5]} intensity={160} color="#a996ff" decay={2} />
      <pointLight position={[-4, -2, -4]} intensity={14} color="#47bfff" decay={2} />
      <directionalLight position={[2, 3, 4]} intensity={0.7} />
      <HexMark reducedMotion={reducedMotion} />
    </Canvas>
  );
}
