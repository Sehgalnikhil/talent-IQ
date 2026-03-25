import { useEffect, useRef, useMemo, Suspense } from "react";
import { Link } from "react-router";
import { SignInButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Environment,
  Stars,
  Text,
  PerspectiveCamera,
  Center,
} from "@react-three/drei";
import * as THREE from "three";
import { 
  CommandIcon, 
  ChevronDownIcon, 
  ArrowRightIcon, 
  CpuIcon, 
  Code2Icon, 
  BrainCircuitIcon, 
  LayersIcon,
  VideoIcon,
} from "lucide-react";

// --- GSAP REGISTRATION ---
gsap.registerPlugin(ScrollTrigger);

// --- 3D COMPONENTS ---

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
      {/* Outer Glow Ring */}
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
    // GSAP Scroll Path for Camera
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    // Move camera into the scene
    tl.to(camera.position, { z: 5, y: 0.5, ease: "none" })
      .to(camera.position, { x: -3, z: 8, y: -0.5, ease: "none" })
      .to(camera.position, { x: 3, z: 6, y: 1, ease: "none" })
      .to(camera.position, { x: 0, z: 12, y: 0, ease: "none" });

    // Rotate the whole scene group for dynamic perspective
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

// --- UI SECTIONS ---

const Section = ({ children, className = "" }) => (
  <section className={`min-h-screen relative z-10 flex flex-col items-center justify-center p-8 ${className}`}>
    {children}
  </section>
);

const HomePage = () => {
  const containerRef = useRef();
  const lenisRef = useRef();

  // Function to start the high-speed Cinematic Tour
  const startVirtualTour = () => {
    if (lenisRef.current) {
      // Scroll to the end of the page smoothly but swiftly
      lenisRef.current.scrollTo(document.body.scrollHeight, {
        duration: 8,
        easing: (t) => t, // Linear for cinematic uniformity
      });
      
      // Auto-scrolling back to top after a delay or just leave it at the Gateway
    }
  };

  const jumpToAscension = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo("#scroll-container > section:last-of-type", {
        duration: 3,
        easing: (t) => t * (2 - t),
      });
    }
  };

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. GSAP Animations for Content
    const sections = gsap.utils.toArray(".reveal-section");
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: true,
          },
        }
      );
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div id="scroll-container" ref={containerRef} className="bg-[#050505] text-white selection:bg-primary/30 font-sans overflow-x-hidden">
      
      {/* 3D CANVAS LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas shadows gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
          <Suspense fallback={null}>
            <Experience3D />
          </Suspense>
        </Canvas>
      </div>

      {/* TOP HUD NAV */}
      <nav className="fixed top-0 left-0 right-0 h-24 z-50 flex items-center justify-between px-12 pointer-events-auto bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="size-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(143,0,255,0.4)] group-hover:scale-110 transition-transform">
             <CommandIcon className="size-6 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white">TALENTIQ</span>
        </Link>
        <div className="flex items-center gap-8">
          <SignInButton mode="modal">
            <button className="h-12 px-10 rounded-full bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl">
              INITIALIZE GATEWAY
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <Section className="text-center pt-32">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12 max-w-5xl"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-xl">
             <div className="size-2 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Neural Connection established</span>
          </div>
          <h1 className="text-8xl md:text-[14rem] font-black tracking-tighter leading-[0.75] mix-blend-difference select-none pointer-events-none">
             CRACK<br />INTERVIEWS<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">WITH AI.</span>
          </h1>
          <div className="flex flex-col items-center gap-12 mt-20">
             <div className="flex gap-4">
                 <button 
                   className="btn btn-primary btn-lg rounded-full px-16 h-20 text-xl font-black shadow-[0_0_50px_rgba(143,0,255,0.4)]"
                   onClick={jumpToAscension}
                 >
                   EXPLORE SPACE
                 </button>
                 <button 
                   className="btn btn-ghost btn-lg rounded-full px-10 h-20 text-xl font-black border border-white/10 backdrop-blur-xl"
                   onClick={startVirtualTour}
                 >
                   VIRTUAL TOUR
                 </button>
             </div>
             <div className="flex flex-col items-center gap-2 opacity-30 animate-bounce">
                <span className="text-[10px] font-black uppercase tracking-widest">Scroll to Begin</span>
                <ChevronDownIcon className="size-4" />
             </div>
          </div>
        </motion.div>
      </Section>

      {/* 2. JOURNEY SECTION */}
      <Section className="reveal-section px-20">
         <div className="grid lg:grid-cols-2 gap-20 items-center w-full max-w-7xl">
            <div className="space-y-12">
               <h2 className="text-7xl md:text-9xl font-black tracking-tighter text-white leading-none">THE<br /><span className="text-primary italic">JOURNEY.</span></h2>
               <p className="text-2xl text-white/40 font-medium leading-relaxed max-w-lg">
                  Every candidate follows a unique synaptic path. From raw aptitude to deep system architecture.
               </p>
            </div>
            <div className="grid grid-cols-2 gap-6 relative">
               {/* Connecting Lines would go here */}
               {[
                 { title: "Aptitude", icon: <CpuIcon />, color: "border-primary/20" },
                 { title: "Coding", icon: <Code2Icon />, color: "border-secondary/20" },
                 { title: "AI Interview", icon: <BrainCircuitIcon />, color: "border-accent/20" },
                 { title: "System Design", icon: <LayersIcon />, color: "border-success/20" },
               ].map((card, i) => (
                 <div key={i} className={`premium-glass p-8 rounded-[40px] border ${card.color} flex flex-col gap-6 hover:scale-105 transition-transform duration-500`}>
                    <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary">{card.icon}</div>
                    <span className="text-xl font-black tracking-tighter">{card.title}</span>
                 </div>
               ))}
            </div>
         </div>
      </Section>

      {/* 3. EXPERIENCE SECTION */}
      <Section className="reveal-section bg-black/50 backdrop-blur-3xl overflow-hidden">
         <div className="w-full max-w-7xl text-center space-y-20">
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter">HYPER-AWARE<br /><span className="text-secondary italic">TERMINAL.</span></h2>
            
            <div className="relative group max-w-5xl mx-auto rounded-[60px] overflow-hidden border border-white/10 shadow-2xl">
               <div className="bg-[#111] p-10 font-mono text-left space-y-4">
                  <div className="flex gap-2 mb-8">
                     <div className="size-3 rounded-full bg-red-500/50" />
                     <div className="size-3 rounded-full bg-yellow-500/50" />
                     <div className="size-3 rounded-full bg-green-500/50" />
                  </div>
                  <p className="text-secondary/70">{">"} Initializing interview_sandbox.v4</p>
                  <p className="text-white/40">{">"} Monitoring cognitive_load: NORMAL</p>
                  <p className="text-white/80 leading-loose">
                     <span className="text-primary font-bold">function</span> optimizeSovereignLogic(node) {"{"} <br />
                     &nbsp;&nbsp;<span className="text-secondary">if</span> (node.isReady) {"{"} <br />
                     &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary font-bold italic">return</span> node.ascend(); <br />
                     &nbsp;&nbsp;{"}"} <br />
                     {"}"}
                  </p>
                  <div className="h-32 flex items-end gap-2 pt-10">
                     {[30, 80, 45, 95, 60, 40, 85, 70, 50, 90].map((h, i) => (
                       <div key={i} className="flex-1 bg-secondary/10 border-t border-secondary/40 rounded-t-sm animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </Section>

      {/* 4. SYSTEM DESIGN SECTION */}
      <Section className="reveal-section">
         <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-12 order-2 lg:order-1">
               <div className="flex flex-wrap gap-10 justify-center">
                  {[
                    { label: "API", color: "bg-primary" },
                    { label: "DB", color: "bg-secondary" },
                    { label: "CACHE", color: "bg-accent" },
                    { label: "QUEUE", color: "bg-success" },
                  ].map(node => (
                    <div key={node.label} className="size-24 rounded-full border border-white/5 flex items-center justify-center relative">
                       <div className={`absolute inset-0 ${node.color} opacity-10 rounded-full animate-ping`} />
                       <span className="text-xs font-black tracking-widest">{node.label}</span>
                    </div>
                  ))}
               </div>
            </div>
            <div className="space-y-10 order-1 lg:order-2 text-right">
               <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white">SYSTEM<br /><span className="text-primary">ARCHITECT.</span></h2>
               <p className="text-2xl text-white/40 font-medium">Build, scale, and optimize real-world infrastructure in a live-reactive visual simulation.</p>
            </div>
         </div>
      </Section>

      {/* 5. AI INTERVIEW SECTION */}
      <Section className="reveal-section bg-secondary/5">
         <div className="text-center space-y-16">
            <div className="size-64 mx-auto rounded-full border-2 border-secondary/50 flex items-center justify-center relative group">
               <div className="absolute inset-0 bg-secondary/10 rounded-full blur-3xl group-hover:blur-[60px] transition-all" />
               <BrainCircuitIcon className="size-32 text-secondary animate-pulse" />
               <div className="absolute -bottom-10 flex gap-1">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-1 bg-secondary/40 rounded-full h-8" style={{ animation: `wave 1.5s infinite ease-in-out ${i * 0.1}s` }} />
                  ))}
               </div>
            </div>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter">AI <span className="text-secondary italic">SANCTUARY.</span></h2>
            <p className="text-2xl text-white/30 max-w-2xl mx-auto italic">"Your logical pattern is exceptional, Candidate. Let's delve deeper into potential concurrency bottlenecks."</p>
         </div>
      </Section>

      {/* 6. FINAL REPORT SECTION */}
      <Section className="reveal-section py-40">
         <div className="max-w-7xl w-full grid md:grid-cols-2 gap-32 items-center">
            <div className="space-y-12">
               <h2 className="text-6xl md:text-8xl font-black tracking-tighter">THE <span className="text-primary italic">SCORE.</span></h2>
               <div className="space-y-8">
                  {["Logic", "Pattern Recognition", "Communication", "System Integrity"].map(stat => (
                    <div key={stat} className="space-y-3">
                       <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                          <span>{stat}</span>
                          <span className="text-primary">98%</span>
                       </div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[98%] shadow-[0_0_10px_rgba(143,0,255,0.8)]" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="text-center p-20 premium-glass rounded-[80px] border-primary/20">
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60 mb-6">Aggregate Skill Score</p>
               <span className="text-[12rem] font-black tracking-tighter leading-none italic">98</span>
               <p className="text-xl text-white/40 mt-8 font-bold">TOP 0.1% GLOBALLY</p>
            </div>
         </div>
      </Section>

      {/* 7. FOOTER & CTA */}
      <Section className="reveal-section py-40 border-t border-white/5 relative overflow-hidden">
         <div className="text-center space-y-16 relative z-10">
            <h2 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8]">ASCEND TO THE<br /><span className="text-primary italic">GATEWAY.</span></h2>
            <div className="flex justify-center gap-8">
               <SignInButton mode="modal">
                 <button className="btn btn-primary btn-lg rounded-full px-20 h-24 text-3xl font-black shadow-[0_0_80px_rgba(143,0,255,0.6)] animate-pulse">
                   ENTER SANCTUARY
                 </button>
               </SignInButton>
            </div>
         </div>
         
         {/* Footer Links */}
         <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
            <p>© 2026 TALENTIQ ENGINE</p>
            <div className="flex gap-10">
               <span>Nodes</span>
               <span>Ledger</span>
               <span>Privacy Protocol</span>
            </div>
         </div>
      </Section>
      
      {/* KEYFRAMES FOR ANIMATIONS */}
      <style>{`
        @keyframes wave {
          0%, 100% { height: 8px; opacity: 0.3; }
          50% { height: 32px; opacity: 1; }
        }
      `}</style>

    </div>
  );
};

export default HomePage;




