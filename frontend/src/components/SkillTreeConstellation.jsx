import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function NodePoint({ position, label, value, color }) {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            // Pulse node size based on sine offset wave framing triggers
            const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
            meshRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial 
                    color={color || "#7c3aed"} 
                    emissive={color || "#7c3aed"} 
                    emissiveIntensity={0.8} 
                    roughness={0} 
                    metalness={1} 
                />
            </mesh>
            <Text
                position={[0, -0.15, 0]}
                fontSize={0.07}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/manrope/v34/xn7gNHE6In92v_Xv_YVHVpY.woff"
            >
                {label} ({value}%)
            </Text>
        </group>
    );
}

function Constellation({ data }) {
    const groupRef = useRef();

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.001;
        }
    });

    // Generate positions nodes along space
    const nodes = useMemo(() => {
        const radius = 1.2;
        return data.map((d, i) => {
            const angle = (i * Math.PI * 2) / data.length;
            const r = (d.value / 100) * radius;
            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * r;
            const y = (Math.random() - 0.5) * 0.4; // slight vertical asymmetry
            return {
                ...d,
                position: [x, y, z]
            };
        });
    }, [data]);

    // Draw connecting lines to center node
    return (
        <group ref={groupRef}>
            {nodes.map((node, i) => (
                <group key={i}>
                    <NodePoint 
                        position={node.position} 
                        label={node.label} 
                        value={node.value} 
                        color={node.label === "DP" ? "#ef4444" : "#00f2ff"} 
                    />
                    <Line 
                        points={[[0, 0, 0], node.position]} 
                        color="#ffffff" 
                        lineWidth={1} 
                        transparent 
                        opacity={0.15} 
                    />
                </group>
            ))}
            
            {/* Center Core node */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshBasicMaterial color="#ffffff" wireframe />
            </mesh>
            
            {/* Edge Connecting Rings */}
            {nodes.map((node, i) => {
                const nextNode = nodes[(i + 1) % nodes.length];
                return (
                    <Line 
                        key={`edge-${i}`} 
                        points={[node.position, nextNode.position]} 
                        color="#7c3aed" 
                        lineWidth={1.5} 
                        transparent 
                        opacity={0.3} 
                    />
                );
            })}
        </group>
    );
}

export default function SkillTreeConstellation({ data }) {
    return (
        <div className="w-full h-64 relative cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 1.5, 2.5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[5, 5, 5]} intensity={1.5} color="#00f2ff" />
                <pointLight position={[-5, -5, -5]} intensity={0.5} color="#7c3aed" />
                
                <Constellation data={data} />
                
                <OrbitControls 
                    enableZoom={false} 
                    enablePan={false} 
                    autoRotate 
                    autoRotateSpeed={0.3} 
                />
            </Canvas>
        </div>
    );
}
