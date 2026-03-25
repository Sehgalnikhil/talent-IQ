import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";

function AnimatedSphere({ analyserNode }) {
    const meshRef = useRef();
    const materialRef = useRef();
    const dataArray = useRef(new Uint8Array(128));

    useFrame((state) => {
        if (!meshRef.current) return;

        let avgVolume = 0;
        if (analyserNode) {
            analyserNode.getByteFrequencyData(dataArray.current);
            let sum = 0;
            for (let i = 0; i < dataArray.current.length; i++) {
                sum += dataArray.current[i];
            }
            avgVolume = sum / dataArray.current.length;
        }

        // Scale and Distort based on Frequency Volume
        const targetScale = 1 + (avgVolume / 255) * 0.4;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        
        if (materialRef.current) {
            // Adjust distort and speed dynamically over volume nodes
            materialRef.current.distort = 0.3 + (avgVolume / 255) * 0.8;
            materialRef.current.speed = 1 + (avgVolume / 255) * 4;
        }

        // Ambient Rotation
        meshRef.current.rotation.y += 0.002;
    });

    return (
        <Sphere ref={meshRef} args={[1.2, 128, 128]}>
            <MeshDistortMaterial
                ref={materialRef}
                color="#7c3aed"
                attach="material"
                distort={0.4}
                speed={2}
                roughness={0.1}
                metalness={0.8}
                clearcoat={1}
                clearcoatRoughness={0.1}
            />
        </Sphere>
    );
}

export default function SoundReactiveSphere({ analyserNode }) {
    return (
        <div className="w-full h-full relative cursor-pointer">
            <Canvas camera={{ position: [0, 0, 3] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
                <directionalLight position={[0, 5, 5]} intensity={1} />
                
                <AnimatedSphere analyserNode={analyserNode} />
                
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
            </Canvas>
        </div>
    );
}
