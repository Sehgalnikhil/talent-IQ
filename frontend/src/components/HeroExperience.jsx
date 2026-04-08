import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Environment,
  Stars,
  PerspectiveCamera,
} from "@react-three/drei";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NeuralOrb = () => {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.1;
      meshRef.current.rotation.y = t * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 20]} />
        <MeshDistortMaterial
          color="#8F00FF"
          emissive="#7C4DFF"
          emissiveIntensity={2}
          distort={0.4}
          speed={4}
          roughness={0}
          metalness={1}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.2, 0.02, 16, 100]} />
        <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={5} />
      </mesh>
    </Float>
  );
};

const Experience3D = () => {
  const { camera } = useThree();
  const sceneGroup = useRef();

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    tl.to(camera.position, { z: 5, y: 0.5, ease: "none" })
      .to(camera.position, { x: -3, z: 8, y: -0.5, ease: "none" })
      .to(camera.position, { x: 3, z: 6, y: 1, ease: "none" })
      .to(camera.position, { x: 0, z: 12, y: 0, ease: "none" });

    tl.to(sceneGroup.current.rotation, { y: Math.PI * 0.5, ease: "none" }, 0);
  }, [camera]);

  return (
    <group ref={sceneGroup}>
      <Stars radius={100} depth={50} count={8000} factor={4} saturation={0} fade speed={1.5} />
      <Environment preset="night" />
      <NeuralOrb />
      <pointLight intensity={20} color="#8F00FF" position={[5, 5, 5]} />
      <pointLight intensity={10} color="#00F0FF" position={[-5, -5, -5]} />
    </group>
  );
};

const HeroExperience = () => {
  return (
    <Canvas shadows gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
      <Suspense fallback={null}>
        <Experience3D />
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;
