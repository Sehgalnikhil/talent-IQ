import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export default function HolographicAvatar({ sentiment = "neutral", isSpeaking = false }) {
    const meshRef = useRef();
    
    // Choose colors based on sentiment
    const colors = useMemo(() => {
        if (sentiment === 'impressed') return { emissive: '#FFD700', color: '#ffb300' }; // Warm Gold
        if (sentiment === 'stressed' || sentiment === 'angry') return { emissive: '#FF003C', color: '#ff003c' }; // Red
        return { emissive: '#00F0FF', color: '#00F0FF' }; // Cold Blue (Default)
    }, [sentiment]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            // Morph pulse based on isSpeaking
            const scaleBase = 1.0;
            const pulse = isSpeaking ? Math.sin(time * 15) * 0.15 + 0.1 : Math.sin(time * 2) * 0.02;
            const scale = scaleBase + pulse;
            meshRef.current.scale.set(scale, scale, scale);
            
            // Rotation
            meshRef.current.rotation.y = time * 0.2;
            meshRef.current.rotation.x = time * 0.1;

            // Make it twitch slightly if speaking violently (like it's processing)
            if (isSpeaking) {
                meshRef.current.position.y = Math.sin(time * 20) * 0.02;
                meshRef.current.rotation.z = Math.sin(time * 25) * 0.05;
            } else {
                meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.1);
                meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.1);
            }
        }
    });

    return (
        <group>
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 4, 3]} intensity={sentiment === 'impressed' ? 2 : 1} color={colors.emissive} />
            <pointLight position={[-5, -4, -3]} intensity={0.5} color={colors.color} />
            
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh ref={meshRef}>
                    <icosahedronGeometry args={[1.6, 64]} />
                    <MeshDistortMaterial
                        color={colors.color}
                        emissive={colors.emissive}
                        emissiveIntensity={isSpeaking ? 2.5 : 1.2}
                        distort={isSpeaking ? 0.6 : 0.3}
                        speed={isSpeaking ? 10 : 2}
                        roughness={0.1}
                        metalness={0.9}
                        wireframe={sentiment === 'stressed' || sentiment === 'angry'}
                    />
                </mesh>
            </Float>

            {/* Sparkles / Particles for extra holographic effect */}
            <Sparkles 
                count={isSpeaking ? 150 : 50} 
                scale={6} 
                size={isSpeaking ? 6 : 2} 
                speed={isSpeaking ? 2 : 0.2} 
                opacity={0.6} 
                color={colors.color} 
            />
            
            <Environment preset={sentiment === 'impressed' ? "sunset" : "night"} />
        </group>
    );
}
