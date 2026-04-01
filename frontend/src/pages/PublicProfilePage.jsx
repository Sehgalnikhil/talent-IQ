import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router";
import { 
  UserCheckIcon, 
  CodeIcon, 
  TrophyIcon, 
  ActivityIcon, 
  HexagonIcon, 
  SparklesIcon, 
  Share2Icon, 
  FlameIcon, 
  AwardIcon, 
  FileTextIcon, 
  CheckCircle2Icon, 
  TrendingUpIcon,
  CrownIcon,
  ShieldCheckIcon,
  ZapIcon
} from "lucide-react";
import toast from "react-hot-toast";
import { WeaknessAnalyzer, SmartTagger } from "../lib/ml-engine";
import { motion, AnimatePresence } from "framer-motion";
import { PROBLEMS } from "../data/problems";

// 3D Imports for Skill Constellation
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Line, Html, Float } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

// --- 3D GALAXY SKILL TREE COMPONENTS ---

function SkillNode({ category, strengthScore, position, color }) {
    const scale = 0.5 + (strengthScore / 100) * 1.5;
    
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={position}>
            {/* The glowing star */}
            <mesh>
                <sphereGeometry args={[scale, 32, 32]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={strengthScore > 70 ? 2 : 0.8} toneMapped={false} />
            </mesh>
            
            {/* Halo pulse effect */}
            <mesh>
                <sphereGeometry args={[scale * 1.5, 32, 32]} />
                <meshStandardMaterial color={color} transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* Text Overlay synced to 3D space */}
            <Html position={[0, -scale - 0.8, 0]} center transform sprite zIndexRange={[100, 0]}>
                <div className="text-center font-black uppercase tracking-widest pointer-events-none select-none whitespace-nowrap bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <div className="text-[6px] text-white/50">{strengthScore >= 70 ? 'OPTIMIZED' : 'LEARNING'}</div>
                    <div className="text-[10px] drop-shadow-lg" style={{ color }}>{category}</div>
                </div>
            </Html>
        </Float>
    );
}

function GalaxySkillTree({ data }) {
    // Generate positions via spherical fibonacci 
    const nodes = useMemo(() => {
        if (!data || data.length === 0) return [];
        
        const count = data.length;
        const radius = 6;
        const PHI = Math.PI * (3 - Math.sqrt(5)); // Golden angle

        return data.map((item, i) => {
            const y = 1 - (i / (count - 1)) * 2 || 0; // Handle single item
            const r = Math.sqrt(1 - y * y);
            const theta = PHI * i; 

            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;
            
            const position = [x * radius, y * radius, z * radius];
            const color = item.strengthScore >= 70 ? "#10b981" : "#3b82f6";
            
            return { ...item, position, color };
        });
    }, [data]);

    // Generate neural connections between proximal nodes
    const connections = useMemo(() => {
        const lines = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const p1 = new THREE.Vector3(...nodes[i].position);
                const p2 = new THREE.Vector3(...nodes[j].position);
                if (p1.distanceTo(p2) < 8) {
                    const isStrong = nodes[i].strengthScore > 60 && nodes[j].strengthScore > 60;
                    lines.push({
                        points: [p1, p2],
                        color: isStrong ? "#10b981" : "#00f0ff",
                        opacity: isStrong ? 0.4 : 0.05
                    });
                }
            }
        }
        return lines;
    }, [nodes]);

    const groupRef = useRef();
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    if (nodes.length === 0) {
        return (
            <Html center>
                <div className="text-white/50 text-xs font-black uppercase tracking-widest text-center animate-pulse flex flex-col items-center gap-2">
                    Neural Matrix Empty
                </div>
            </Html>
        );
    }

    return (
        <group ref={groupRef}>
            <Stars radius={50} depth={50} count={2500} factor={4} saturation={1} fade speed={1} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} intensity={2} color="#00f0ff" />
            <spotLight position={[-10, -10, -10]} intensity={1.5} color="#ff00ff" />

            {/* Neural Pipelines */}
            {connections.map((c, i) => (
                <Line 
                    key={i} 
                    points={c.points} 
                    color={c.color} 
                    lineWidth={1.5} 
                    transparent 
                    opacity={c.opacity} 
                />
            ))}

            {/* Core Idea Nodes */}
            {nodes.map((node, i) => (
                <SkillNode key={i} {...node} />
            ))}
            
            <OrbitControls enableZoom={true} enablePan={true} autoRotate autoRotateSpeed={0.5} />
        </group>
    );
}
// ---------------------------------------------

export default function PublicProfilePage() {
    const { username } = useParams();
    const [stats, setStats] = useState({ solved: 0, streak: 0, points: 0 });
    const [heatmapData, setHeatmapData] = useState([]);
    const [patterns, setPatterns] = useState([]);
    const [solvedList, setSolvedList] = useState([]);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Sync with system or app theme
        const checkTheme = () => {
           const theme = document.documentElement.getAttribute("data-theme");
           setIsDark(!["light", "cupcake", "bumblebee", "emerald", "corporate", "retro", "cyberpunk", "valentine", "garden", "lofi", "pastel", "fantasy", "wireframe", "cmyk", "autumn", "business", "acid", "lemonade", "winter", "nord"].includes(theme));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        
        const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
        const streak = parseInt(localStorage.getItem("currentStreak") || "1");
        const points = solved.length * 10 + (streak * 5);
        
        setStats({ solved: solved.length, streak, points });
        setHeatmapData(WeaknessAnalyzer.analyze().categories);
        setPatterns(SmartTagger.getPatternStats());
        setSolvedList(solved);
        
        return () => observer.disconnect();
    }, []);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Consensus Node link copied!", { 
            style: { borderRadius: '20px', background: '#1a1a1a', color: '#fff' }
        });
    };

    return (
        <div className={`min-h-screen transition-colors duration-700 font-sans selection:bg-primary/30 relative overflow-x-hidden ${isDark ? 'bg-[#050505] text-white' : 'bg-base-300 text-base-content'}`}>
            <Navbar />
            
            {/* AMBIENT BACKGROUND ENGINE */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden h-[120vh]">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] mix-blend-screen" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[20%] right-[-10%] w-[700px] h-[700px] bg-secondary/10 rounded-full blur-[160px] mix-blend-screen" 
                />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 space-y-12">
                
                {/* 1. NODE IDENTITY HEADER */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative p-1 rounded-[48px] overflow-hidden ${isDark ? 'bg-white/5 border border-white/10' : 'bg-base-100/40 border border-black/5'} backdrop-blur-3xl shadow-3xl`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                    
                    <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
                        {/* AVATAR NODE */}
                        <div className="relative group">
                            <div className="size-40 rounded-[40px] bg-gradient-to-br from-primary via-secondary to-accent p-[2px] shadow-2xl group-hover:rotate-6 transition-transform duration-500">
                                <div className={`w-full h-full rounded-[38px] flex items-center justify-center ${isDark ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
                                    <span className="text-7xl font-black bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent italic">
                                        {username?.substring(0, 1).toUpperCase() || "D"}
                                    </span>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 size-14 bg-success text-success-content rounded-3xl flex items-center justify-center border-4 border-base-100 shadow-2xl">
                                <ShieldCheckIcon className="size-7" />
                            </div>
                        </div>

                        {/* PROFILE CONTENT */}
                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                                    <h1 className="text-6xl font-black italic tracking-tighter bg-gradient-to-r from-white via-white/80 to-base-content/40 bg-clip-text text-transparent">{username || "Developer"}</h1>
                                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40">
                                       <CrownIcon className="size-4 text-primary" />
                                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Sovereign_PRO</span>
                                    </div>
                                </div>
                                <p className={`text-sm font-black uppercase tracking-[0.4em] ${isDark ? 'opacity-30' : 'opacity-40'}`}>Talent_IQ Consensus Node ID: {username?.toUpperCase()}_0x842</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <div className="bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                                    <ZapIcon className="size-5 text-primary" />
                                    <div>
                                       <p className="text-xl font-black">{stats.points}</p>
                                       <p className="text-[8px] font-black uppercase tracking-widest opacity-40">SYNERGY_POINTS</p>
                                    </div>
                                </div>
                                <div className="bg-success/10 border border-success/20 px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                                    <FlameIcon className="size-5 text-success animate-pulse" />
                                    <div>
                                       <p className="text-xl font-black">{stats.streak}D</p>
                                       <p className="text-[8px] font-black uppercase tracking-widest opacity-40">PERSISTENCE_STREAK</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleShare} className="btn btn-primary btn-lg rounded-[28px] px-8 shadow-2xl shadow-primary/40 font-black group">
                            <Share2Icon className="size-5 group-hover:rotate-12 transition-transform" />
                            BROADCAST_PROFILE
                        </button>
                    </div>
                </motion.div>

                {/* 2. GRID ARCHITECTURE */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* L: METRIC STACK (4 Cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        
                        {/* SKILL PROVENANCE CARD */}
                        <motion.div initial={{ opacity:0, x: -20 }} animate={{ opacity:1, x:0 }} className={`p-8 rounded-[40px] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-base-100/60 border-black/5'} backdrop-blur-3xl shadow-xl space-y-6`}>
                            <div className="flex items-center gap-4">
                                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                                    <ShieldCheckIcon className="size-7 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-black text-xs uppercase tracking-[0.3em]">Verified_Provenance</h3>
                                    <span className="text-[10px] opacity-40 font-bold">ANTI-CHEAT_ENGINE_ACTIVE</span>
                                </div>
                            </div>
                            <p className="text-xs leading-relaxed opacity-60 font-medium">
                                This consensus node represents verified algorithmic execution. Every problem solved has been validated through the TalentIQ Neural Matrix for authenticity and performance optimization.
                            </p>
                            <div className="pt-4 flex items-center gap-2">
                               <div className="size-2 rounded-full bg-success animate-ping" />
                               <span className="text-[9px] font-black uppercase tracking-widest text-success">AUTHENTICITY_CONFIRMED</span>
                            </div>
                        </motion.div>

                        {/* COGNITIVE DISTRIBUTION */}
                        <div className={`p-8 rounded-[40px] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-base-100/60 border-black/5'} backdrop-blur-3xl shadow-xl space-y-8`}>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 flex items-center gap-2">
                                <ActivityIcon className="size-3 text-secondary" /> COGNITIVE_DISTRIBUTION
                            </h3>
                            <div className="space-y-6">
                                {[{ lang: "JavaScript", val: 85, color: "bg-warning" }, { lang: "Python", val: 10, color: "bg-info" }, { lang: "Java", val: 5, color: "bg-error" }].map((item) => (
                                    <div key={item.lang} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-black uppercase tracking-widest">{item.lang}</span>
                                            <span className="text-[10px] font-black opacity-40">{item.val}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.val}%` }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                className={`h-full ${item.color} shadow-[0_0_10px_rgba(var(--color-primary),0.5)]`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI MATURITY QUOTIENT */}
                        <div className={`p-10 rounded-[48px] border overflow-hidden relative ${isDark ? 'bg-gradient-to-br from-primary/10 to-transparent border-white/5' : 'bg-gradient-to-br from-primary/5 to-transparent border-black/5'} backdrop-blur-3xl shadow-2xl items-center flex flex-col`}>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-8">NEURAL_READY_QUOTIENT</h3>
                            <div className="radial-progress bg-white/5 text-primary border-8 border-transparent font-black text-4xl shadow-3xl" style={{ "--value": stats.solved > 10 ? 92 : stats.solved * 9, "--size": "150px", "--thickness": "12px" }}>
                                {stats.solved > 10 ? "92%" : `${stats.solved * 9}%`}
                            </div>
                            <div className="mt-8 text-center space-y-1">
                                <p className="text-sm font-black uppercase tracking-widest text-secondary">TIER_I_CANDIDATE</p>
                                <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">Algorithmic Efficiency Top 8%</p>
                            </div>
                        </div>
                    </div>

                    {/* R: PROFICIENCY GRID (8 Cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* SKILL PROFICIENCY CONSTELLATION */}
                        <motion.div initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y:0 }} className={`p-10 rounded-[48px] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-base-100/60 border-black/5'} backdrop-blur-3xl shadow-2xl`}>
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-2xl font-black italic tracking-tighter">Skill Proficiency Constellation</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 mt-1">Cross-Functional_Category_Mapping</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-5xl font-black tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{stats.solved}</span>
                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40">SOLUTIONS_ARCHITECTED</p>
                                </div>
                            </div>

                            {/* THE 3D GALAXY MAP */}
                            <div className="w-full h-[500px] rounded-[32px] overflow-hidden bg-[#020202] border border-white/10 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] relative group">
                                <Canvas camera={{ position: [0, 0, 16], fov: 50 }}>
                                    <GalaxySkillTree data={heatmapData} />
                                </Canvas>
                                
                                <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-black/80 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">
                                         Orbital Drag Enabled [ Neural Mapping ]
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* VERIFIED PATTERN NODES */}
                        <div className={`p-10 rounded-[48px] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-base-100/60 border-black/5'} backdrop-blur-3xl shadow-2xl space-y-8`}>
                             <div className="flex items-center gap-4">
                                <SparklesIcon className="size-6 text-accent animate-pulse" />
                                <h3 className="font-black italic text-xl tracking-tight">Recognized Patterns</h3>
                             </div>
                             <div className="flex flex-wrap gap-3">
                                {patterns.length > 0 ? (
                                    patterns.map((p, i) => (
                                        <div key={p.name} className="px-6 py-4 rounded-3xl bg-accent/10 border border-accent/20 flex items-center gap-4 group hover:bg-accent ring-accent/40 hover:ring-8 transition-all duration-500 cursor-pointer">
                                            <span className="text-2xl group-hover:scale-125 transition-transform">{p.icon}</span>
                                            <div>
                                               <p className="text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">{p.name}</p>
                                               <span className="text-[8px] font-black opacity-40 uppercase tracking-widest group-hover:text-white/60">Verified_Pattern</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full p-8 border border-dashed border-white/10 rounded-3xl text-center opacity-40 italic text-xs font-medium">
                                        Solve problems to synthesize recognized algorithmic protocols.
                                    </div>
                                )}
                             </div>
                        </div>

                        {/* RECENT CONSENSUS CAPTURES */}
                        <div className={`p-10 rounded-[48px] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-base-100/60 border-black/5'} backdrop-blur-3xl shadow-2xl`}>
                             <div className="flex items-center justify-between mb-8">
                                <h3 className="font-black text-[10px] uppercase tracking-[0.5em] opacity-40">RECENT_NODE_LOGS</h3>
                                <div className="size-2 rounded-full bg-success animate-ping" />
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {solvedList.length > 0 ? (
                                    solvedList.slice().reverse().slice(0, 4).map((id, index) => {
                                        const prob = PROBLEMS[id] || { title: id, difficulty: "Medium" };
                                        return (
                                            <div key={index} className={`flex items-center justify-between p-5 rounded-3xl border ${isDark ? 'bg-white/2 border-white/5 hover:bg-white/10' : 'bg-black/2 border-black/5 hover:bg-black/10'} transition-all`}>
                                                <div className="flex items-center gap-4">
                                                   <div className={`size-10 rounded-xl flex items-center justify-center border ${prob.difficulty === "Easy" ? 'border-success/20 bg-success/10 text-success' : 'border-warning/20 bg-warning/10 text-warning'}`}>
                                                      <CodeIcon className="size-5" />
                                                   </div>
                                                   <span className="text-xs font-black uppercase tracking-widest">{prob.title}</span>
                                                </div>
                                                <TrendingUpIcon className="size-4 opacity-30" />
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="col-span-full text-center opacity-30 text-xs italic">No solutions recorded.</p>
                                )}
                             </div>
                        </div>

                    </div>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow { animation: spin-slow 8s linear infinite; }
            `}} />
        </div>
    );
}
