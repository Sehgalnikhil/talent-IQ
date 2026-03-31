import React, { useRef, useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Hyperspace = () => {
  const meshRef = useRef();
  const count = 3000;
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    const colorA = new THREE.Color("#8F00FF"); // Premium Talent-IQ Purple
    const colorB = new THREE.Color("#00F0FF"); // Cyan/Neon Blue
    
    for (let i = 0; i < count; i++) {
        // Cylindrical coordinate for the tunnel
        const r = 10 + Math.random() * 120;
        const theta = Math.random() * Math.PI * 2;
        const z = -Math.random() * 1500;
        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * r;
        
        // Random length of the streaking star
        const length = 5 + Math.random() * 20;
        
        const mixedColor = colorA.clone().lerp(colorB, Math.random());
        
        temp.push({ x, y, z, length, color: mixedColor });
    }
    return temp;
  }, [count]);

  const colorArray = useMemo(() => {
      const arr = new Float32Array(count * 3);
      particles.forEach((p, i) => {
          arr[i * 3 + 0] = p.color.r;
          arr[i * 3 + 1] = p.color.g;
          arr[i * 3 + 2] = p.color.b;
      });
      return arr;
  }, [particles, count]);

  useEffect(() => {
    if (meshRef.current) {
        meshRef.current.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colorArray, 3));
    }
  }, [colorArray]);

  const time = useRef(0);
  
  useFrame((state, delta) => {
      time.current += delta;
      
      // Exponential acceleration curve for warp speed
      const speed = 200 + Math.pow(time.current, 3) * 800;
      
      for (let i = 0; i < count; i++) {
         let p = particles[i];
         p.z += speed * delta;
         if (p.z > 100) {
            p.z -= 1500;
         }
         
         const stretch = 1 + speed / 300;
         
         dummy.position.set(p.x, p.y, p.z);
         dummy.rotation.x = Math.PI / 2; // Point cylinder down Z axis
         dummy.scale.set(0.15, p.length * stretch, 0.15); // Local Y is world Z
         dummy.updateMatrix();
         meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
      <instancedMesh ref={meshRef} args={[null, null, count]}>
         <cylinderGeometry args={[1, 1, 1, 5]} />
         <meshBasicMaterial vertexColors={true} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </instancedMesh>
  );
};

const PlasmaBlast = () => {
    const meshRef = useRef();
    const time = useRef(0);

    useFrame((state, delta) => {
        time.current += delta;
        // Engulf the screen near the end of the transition
        if (time.current > 1.8) { 
           const scale = Math.pow((time.current - 1.8) * 8, 3);
           meshRef.current.scale.setScalar(scale);
        } else {
           meshRef.current.scale.setScalar(0.001);
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, -50]}>
           <sphereGeometry args={[1, 32, 32]} />
           <meshBasicMaterial color="#ffffff" transparent opacity={1} />
        </mesh>
    );
};

const GauntletTransition = ({ onComplete }) => {
   const [phase, setPhase] = useState('warp');

   useEffect(() => {
       const t1 = setTimeout(() => {
           setPhase('flash');
           setTimeout(() => {
               onComplete();
           }, 100); // Trigger navigation smoothly during whiteout
       }, 2300); // Sequence takes ~2.3 seconds
       return () => clearTimeout(t1);
   }, [onComplete]);

   return (
       <AnimatePresence>
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.5 }}
             className="fixed inset-0 z-[99999] bg-black pointer-events-none cursor-none overflow-hidden"
          >
             {phase === 'warp' && (
                 <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full"
                 >
                     <Canvas camera={{ position: [0, 0, 0], fov: 100 }}>
                         <Hyperspace />
                         <PlasmaBlast />
                     </Canvas>
                 </motion.div>
             )}
             
             {/* Final Whiteout Flash */}
             <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: phase === 'flash' ? 1 : 0 }}
                 transition={{ duration: 0.2 }}
                 className="absolute inset-0 bg-white"
             />
          </motion.div>
       </AnimatePresence>
   );
};

export default GauntletTransition;
