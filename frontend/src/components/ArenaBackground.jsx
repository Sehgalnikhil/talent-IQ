import { Suspense } from "react";
import { Float, Stars, Environment, Sparkles } from "@react-three/drei";

function ArenaNodes() {
  return (
    <group>
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={2} />
      <Sparkles count={50} scale={20} size={3} speed={0.5} opacity={0.2} color="#00daf3" />
      {[...Array(12)].map((_, i) => (
        <Float key={i} speed={1.5} rotationIntensity={2} floatIntensity={1} position={[
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 20 - 20
        ]}>
          <mesh rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <icosahedronGeometry args={[Math.random() * 0.8 + 0.2, 0]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#00daf3" : "#8F00FF"}
              emissive={i % 2 === 0 ? "#00daf3" : "#8F00FF"}
              emissiveIntensity={0.8}
              transparent
              opacity={0.3}
              wireframe={i % 3 === 0}
            />
          </mesh>
        </Float>
      ))}
      <Environment preset="city" />
    </group>
  );
}

export default function ArenaBackground() {
  return (
    <Suspense fallback={null}>
      <ArenaNodes />
    </Suspense>
  );
}
