import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
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
        <meshStandardMaterial attach="material-0" color="#5850ec" roughness={0.35} metalness={0.45} />
        <meshStandardMaterial attach="material-1" color="#c3c0ff" roughness={0.2} metalness={0.2} />
        <meshStandardMaterial attach="material-2" color="#100b26" roughness={0.55} metalness={0.3} />
      </mesh>
    </group>
  );
}

function FloatingAccents({ reducedMotion }) {
  const floatIntensity = reducedMotion ? 0 : 1.2;
  const rotationIntensity = reducedMotion ? 0 : 1;
  const speed = reducedMotion ? 0 : 1.6;

  return (
    <>
      <Float speed={speed} floatIntensity={floatIntensity} rotationIntensity={rotationIntensity}>
        <mesh position={[-2.5, 1.2, -1]}>
          <icosahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial color="#ec4899" roughness={0.3} metalness={0.5} emissive="#ec4899" emissiveIntensity={0.4} />
        </mesh>
      </Float>
      <Float speed={speed * 0.8} floatIntensity={floatIntensity * 1.3} rotationIntensity={rotationIntensity * 0.7}>
        <mesh position={[2.4, -0.9, -0.6]}>
          <octahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial color="#47bfff" roughness={0.25} metalness={0.5} emissive="#47bfff" emissiveIntensity={0.4} />
        </mesh>
      </Float>
      <Float speed={speed * 1.3} floatIntensity={floatIntensity * 0.8} rotationIntensity={rotationIntensity * 1.3}>
        <mesh position={[1.7, 1.6, -1.2]}>
          <torusGeometry args={[0.2, 0.07, 12, 24]} />
          <meshStandardMaterial color="#c3c0ff" roughness={0.4} metalness={0.4} />
        </mesh>
      </Float>
    </>
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
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 4, 5]} intensity={120} color="#8b7bff" decay={2} />
      <pointLight position={[-4, -2, -4]} intensity={60} color="#47bfff" decay={2} />
      <directionalLight position={[2, 3, 4]} intensity={0.6} />
      <HexMark reducedMotion={reducedMotion} />
      <FloatingAccents reducedMotion={reducedMotion} />
    </Canvas>
  );
}
