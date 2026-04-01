import Navbar from "../components/Navbar";
import {
    NetworkIcon, Loader2Icon, MousePointer2Icon, PlusIcon,
    DownloadIcon, Trash2Icon, Share2Icon, SparklesIcon, XIcon, LinkIcon, CheckCircleIcon
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useSearchParams } from "react-router";
import axiosInstance from "../lib/axios";

// 3D Imports
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Line, Environment, ContactShadows, Grid, Html } from "@react-three/drei";
import * as THREE from "three";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SYSTEM_COMPONENTS = [
    { id: "database", label: "Database", emoji: "🗄️", color: "#3b82f6", geometry: 'cylinder' },
    { id: "loadbalancer", label: "Load Balancer", emoji: "⚖️", color: "#10b981", geometry: 'box' },
    { id: "cache", label: "Redis Cache", emoji: "⚡", color: "#f59e0b", geometry: 'box' },
    { id: "api-gw", label: "API Gateway", emoji: "🚪", color: "#8b5cf6", geometry: 'box' },
    { id: "queue", label: "Message Queue", emoji: "📬", color: "#ef4444", geometry: 'box' },
    { id: "cdn", label: "CDN Node", emoji: "🌐", color: "#06b6d4", geometry: 'sphere' },
    { id: "service", label: "Microservice", emoji: "📦", color: "#6366f1", geometry: 'box' },
    { id: "client", label: "Client/User", emoji: "👤", color: "#ec4899", geometry: 'sphere' },
];

function Scene({ nodes, setNodes, connections, setConnections, activeTool, setActiveTool, isLightMode }) {
    const [draggingNode, setDraggingNode] = useState(null);
    const [selectedTarget, setSelectedTarget] = useState(null);
    const planeRef = useRef();

    const handlePointerMove = (e) => {
        if (draggingNode && activeTool === "cursor") {
            setNodes((prev) => prev.map(n => 
                n.nodeId === draggingNode 
                ? { ...n, position: [e.point.x, n.comp.geometry === 'cylinder' ? 1.5 : 1.5, e.point.z] } 
                : n
            ));
        }
    };

    const handleNodePointerDown = (e, nodeId) => {
        e.stopPropagation();
        if (activeTool === "cursor") {
            setDraggingNode(nodeId);
        } else if (activeTool === "connect") {
            if (!selectedTarget) {
                setSelectedTarget(nodeId);
                toast("Select target node to establish data pipe", { icon: "🔗" });
            } else if (selectedTarget !== nodeId) {
                setConnections(prev => [...prev, { from: selectedTarget, to: nodeId }]);
                setSelectedTarget(null);
                setActiveTool('cursor');
                toast.success("Security Pipe Established!");
            }
        }
    };

    return (
        <group onPointerUp={() => setDraggingNode(null)}>
            {/* Grid Floor */}
            <mesh 
                ref={planeRef} 
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[0, -0.1, 0]} 
                onPointerMove={handlePointerMove} 
                onPointerUp={(e) => { e.stopPropagation(); setDraggingNode(null); }}
                receiveShadow
            >
                <planeGeometry args={[200, 200]} />
                <meshStandardMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            <Grid 
                args={[200, 200]} 
                cellSize={1} 
                cellThickness={isLightMode ? 2 : 1.5} 
                cellColor={isLightMode ? "#cbd5e1" : "#1e293b"} 
                sectionSize={5} 
                sectionThickness={isLightMode ? 3 : 2} 
                sectionColor={isLightMode ? "#94a3b8" : "#334155"} 
                fadeDistance={100} 
                fadeStrength={1.5} 
            />

            {nodes.map(node => {
                const isSelectedForPipe = selectedTarget === node.nodeId;
                
                return (
                    <group 
                        key={node.nodeId} 
                        position={node.position} 
                        onPointerDown={(e) => handleNodePointerDown(e, node.nodeId)}
                        onPointerUp={(e) => { e.stopPropagation(); setDraggingNode(null); }}
                    >
                       <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
                            {/* Core Geometry */}
                            <mesh castShadow receiveShadow>
                                {node.comp.geometry === 'cylinder' ? <cylinderGeometry args={[1.5, 1.5, 2.5, 32]} /> :
                                 node.comp.geometry === 'sphere' ? <sphereGeometry args={[1.5, 32, 32]} /> :
                                 <boxGeometry args={[2, 2, 2]} />}
                                <meshStandardMaterial 
                                    color={node.comp.color} 
                                    metalness={isLightMode ? 0.3 : 0.9} 
                                    roughness={isLightMode ? 0.5 : 0.1} 
                                    emissive={node.comp.color}
                                    emissiveIntensity={isSelectedForPipe ? 2 : (isLightMode ? 0.8 : 0.4)}
                                />
                            </mesh>

                            {/* Holographic Wireframe Shield */}
                            <mesh scale={1.1}>
                                {node.comp.geometry === 'cylinder' ? <cylinderGeometry args={[1.5, 1.5, 2.5, 16]} /> :
                                 node.comp.geometry === 'sphere' ? <sphereGeometry args={[1.5, 16, 16]} /> :
                                 <boxGeometry args={[2, 2, 2]} />}
                                <meshStandardMaterial color={isSelectedForPipe ? (isLightMode ? "#000000" : "#ffffff") : node.comp.color} wireframe transparent opacity={isLightMode ? 0.6 : 0.3} />
                            </mesh>
                            
                            {/* HUD Tag */}
                            <Html position={[0, 2.8, 0]} center style={{ pointerEvents: 'none' }}>
                                <div className={`bg-base-100/90 backdrop-blur-xl px-4 py-2 rounded-2xl border ${isSelectedForPipe ? 'border-success' : 'border-base-content/10'} shadow-2xl flex items-center gap-3 text-base-content font-bold whitespace-nowrap`}>
                                    <span className="text-xl drop-shadow-md">{node.comp.emoji}</span>
                                    <span className="text-[10px] uppercase tracking-widest leading-none mt-0.5">{node.comp.label}</span>
                                </div>
                            </Html>
                       </Float>
                    </group>
                );
            })}

            {/* Neon Data Pipes (Connections) */}
            {connections.map((conn, idx) => {
                const nodeA = nodes.find(n => n.nodeId === conn.from);
                const nodeB = nodes.find(n => n.nodeId === conn.to);
                if (!nodeA || !nodeB) return null;
                
                // Draw curve if we want to be fancy, or just straight line
                const points = [
                    new THREE.Vector3(nodeA.position[0], 1, nodeA.position[2]),
                    new THREE.Vector3(nodeB.position[0], 1, nodeB.position[2])
                ];

                return (
                    <Line 
                        key={idx} 
                        points={points} 
                        color="#00F0FF" 
                        lineWidth={4} 
                        dashed={false} 
                        transparent 
                        opacity={0.8}
                    />
                );
            })}

            <Environment preset={isLightMode ? "city" : "night"} />
            <ambientLight intensity={isLightMode ? 1.5 : 0.2} />
            <directionalLight position={[10, 20, 10]} intensity={isLightMode ? 2.5 : 1.5} color={isLightMode ? "#ffffff" : "#d8b9ff"} castShadow />
            <directionalLight position={[-10, 5, -10]} intensity={isLightMode ? 1.5 : 1} color="#00daf3" />
            <ContactShadows position={[0, -0.05, 0]} opacity={isLightMode ? 0.2 : 0.6} scale={100} blur={2.5} far={15} color="#000000" />
            
            {/* Limit orbiting so user doesn't get lost under the floor */}
            <OrbitControls 
                makeDefault 
                minPolarAngle={0} 
                maxPolarAngle={Math.PI / 2 - 0.1} 
                enablePan={true}
                enableDamping={true}
                dampingFactor={0.05}
                mouseButtons={{ LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }}
            />
        </group>
    );
}

function WhiteboardPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Theme detection
    const [theme, setTheme] = useState(document.documentElement.getAttribute("data-theme") || "dark");
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "data-theme") {
                    setTheme(document.documentElement.getAttribute("data-theme") || "dark");
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);
    const isLightMode = ["light", "corporate"].includes(theme);

    useEffect(() => {
        if (!searchParams.get("room")) {
            const randomRoom = Math.random().toString(36).substring(7);
            setSearchParams({ room: randomRoom }, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const roomId = searchParams.get("room") ? `whiteboard_${searchParams.get("room")}` : null;

    const [activeTool, setActiveTool] = useState("cursor"); // cursor, connect
    const socketRef = useRef(null);

    // 3D Nodes State
    const [nodes, setNodes] = useState([]);
    const [connections, setConnections] = useState([]);

    const [showComponentLib, setShowComponentLib] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    // AI States
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiFeedback, setAiFeedback] = useState(null);

    // Initialize Socket Syncing
    useEffect(() => {
        if (!roomId) return;
        const socket = io(SOCKET_URL, { withCredentials: true });
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Connected to 3D Whiteboard Server:", socket.id);
            socket.emit("join_whiteboard", roomId);
            toast.success("Joined 3D Architecture Arena", { icon: "🟢" });
        });

        socket.on("clear_whiteboard", () => {
            setNodes([]);
            setConnections([]);
        });

        socket.on("sync_3d_state", (data) => {
            if (data.nodes) setNodes(data.nodes);
            if (data.connections) setConnections(data.connections);
        });

        return () => socket.disconnect();
    }, [roomId]);

    // Force Sync out when local state changes
    useEffect(() => {
        if (socketRef.current && nodes.length > 0) {
            socketRef.current.emit("sync_3d_state", { roomId, nodes, connections });
            setIsSyncing(true);
            const t = setTimeout(() => setIsSyncing(false), 500);
            return () => clearTimeout(t);
        }
    }, [nodes, connections, roomId]);

    const handleAddComponent = (compId) => {
        const comp = SYSTEM_COMPONENTS.find(c => c.id === compId);
        if (!comp) return;

        // Spread spawn positions
        const offset = (nodes.length % 5) * 3;
        
        const newNode = {
            nodeId: `${compId}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            comp,
            position: [offset - 6, 1.5, offset - 6], // Drop at height 1.5 to match pivot
        };
        
        setNodes(prev => [...prev, newNode]);
        toast.success(`Dropped ${comp.label} into arena!`, { icon: comp.emoji });
    };

    const clearCanvas = () => {
        setNodes([]);
        setConnections([]);
        if (socketRef.current) socketRef.current.emit("clear_whiteboard", roomId);
    };

    const shareBoard = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Live link copied! Share it with your architectural team.", {
            icon: '🔗'
        });
    };

    const analyzeBoard = async () => {
        if (nodes.length === 0) {
            toast.error("No components in the sector to analyze.");
            return;
        }

        setIsAnalyzing(true);
        setAiFeedback(null);
        toast("Initiating System Scan...", { icon: "⚡" });
        
        try {
            const graphData = {
                components: nodes.map(n => n.comp.label),
                connections: connections.length
            };
            
            const prompt = `Evaluate this distributed system architecture: Nodes present: ${graphData.components.join(", ")}. Total Pipes: ${graphData.connections}. Provide a highly analytical, 3-point assessment on Scalability, Fault Tolerance, and Latency. You are a Staff Engineer at AWS interviewing the user. Keep it very punchy and professional.`;
            const res = await axiosInstance.post("/interview/chat", { 
                chatLog: [{ role: "user", text: prompt }], 
                interviewType: "SystemDesign", 
                hostility: 1 
            });
            
            setAiFeedback(res.data.reply);
            toast.success("AI Design Matrix Complete!", { icon: "✨" });
        } catch (err) {
            toast.error("Cloud Architect Offline.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="h-screen bg-base-200 flex flex-col font-sans selection:bg-primary/30 pt-24 text-base-content">
            <Navbar />

            <div className="flex-1 flex overflow-hidden relative">

                {/* Left Floating Tools */}
                <div className="absolute left-6 top-6 w-16 bg-base-100/90 backdrop-blur-3xl border border-base-content/10 rounded-3xl flex flex-col items-center py-6 gap-4 z-30 shadow-[0_8px_40px_rgba(0,0,0,0.1)]">
                    <button
                        onClick={() => setActiveTool("cursor")}
                        title="Select & Move (V)"
                        className={`p-3 rounded-2xl transition-all duration-300 relative group
                            ${activeTool === "cursor" ? 'bg-primary/20 text-primary scale-110' : 'text-base-content/40 hover:bg-base-content/10 hover:text-base-content'}`}
                    >
                        <MousePointer2Icon className="size-5" />
                    </button>
                    <button
                        onClick={() => setActiveTool("connect")}
                        title="Connect Nodes (C)"
                        className={`p-3 rounded-2xl transition-all duration-300 relative group
                            ${activeTool === "connect" ? 'bg-[#00daf3]/20 text-[#00daf3] shadow-[0_0_15px_rgba(0,218,243,0.4)] scale-110' : 'text-base-content/40 hover:bg-base-content/10 hover:text-base-content'}`}
                    >
                        <LinkIcon className="size-5" />
                    </button>
                </div>

                {/* Top Action Bar */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 h-16 bg-base-100/90 backdrop-blur-3xl border border-base-content/10 rounded-full flex items-center px-6 gap-6 z-30 shadow-[0_8px_40px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center gap-3 pr-6 border-r border-base-content/10">
                        <div className="px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                            <span className="relative flex size-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full size-2 bg-primary"></span>
                            </span>
                            Live Arena
                        </div>
                        <div className="w-24 flex items-center">
                            {isSyncing ? (
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#00daf3] opacity-80 flex items-center gap-1.5 animate-pulse w-full">
                                    <Loader2Icon className="size-3.5 animate-spin" /> Syncing
                                </span>
                            ) : (
                                <span className="text-[10px] font-black uppercase tracking-widest text-success flex items-center gap-1.5 w-full">
                                    <CheckCircleIcon className="size-3.5" /> Synced
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="text-[10px] uppercase font-black tracking-[0.3em] opacity-30 px-2 hidden md:block">
                        3D_Architecture_Core
                    </div>
                </div>

                {/* Right Action Bar */}
                <div className="absolute top-6 right-6 h-16 bg-base-100/90 backdrop-blur-3xl border border-base-content/10 rounded-full flex items-center px-4 gap-2 z-30 shadow-[0_8px_40px_rgba(0,0,0,0.1)]">
                    <button
                        onClick={clearCanvas}
                        className="btn btn-ghost btn-circle text-error/80 hover:bg-error/20 hover:text-error transition-colors"
                        title="Purge Arena"
                    >
                        <Trash2Icon className="size-5" /> 
                    </button>
                    <div className="w-px h-8 bg-base-content/10 mx-1 hidden sm:block"></div>
                    <button
                        onClick={analyzeBoard}
                        disabled={isAnalyzing}
                        className="btn bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white rounded-full mx-1 border-none gap-2 shadow-[0_0_20px_rgba(146,68,244,0.3)] px-6 hover:scale-105 transition-transform"
                    >
                        {isAnalyzing ? <Loader2Icon className="size-4 animate-spin" /> : <SparklesIcon className="size-4" />}
                        <span className="hidden xl:inline text-xs font-black tracking-widest uppercase">{isAnalyzing ? "Scanning..." : "Perform Review"}</span>
                    </button>
                    <button onClick={shareBoard} className="btn btn-ghost btn-circle text-base-content/50 hover:text-base-content" title="Invite">
                        <Share2Icon className="size-5" /> 
                    </button>
                    <button
                        onClick={() => setShowComponentLib(!showComponentLib)}
                        className={`btn btn-circle transition-all ${showComponentLib ? 'bg-[#00daf3]/20 text-[#00daf3]' : 'btn-ghost text-base-content/50'}`}
                        title="Component Library"
                    >
                        <PlusIcon className="size-5" />
                    </button>
                </div>

                {/* Component Library Sidebar */}
                {showComponentLib && (
                    <div className="absolute right-6 top-28 w-64 bg-base-100/95 backdrop-blur-3xl border border-base-content/10 rounded-[32px] shadow-2xl z-40 p-6 space-y-4">
                        <h3 className="font-black text-sm text-base-content flex items-center gap-2 mb-2 uppercase tracking-[0.2em]">
                            <NetworkIcon className="size-4 text-[#00daf3]" /> Deployment Bay
                        </h3>
                        <p className="text-[10px] text-base-content/40 mb-4 font-bold uppercase tracking-widest border-b border-base-content/10 pb-4">Initialize target mesh</p>
                        <div className="grid grid-cols-2 gap-3">
                            {SYSTEM_COMPONENTS.map(comp => (
                                <div
                                    key={comp.id}
                                    onClick={() => handleAddComponent(comp.id)}
                                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-base-content/5 hover:border-primary/40 cursor-pointer hover:bg-base-content/5 transition-colors bg-base-content/5 group"
                                >
                                    <span className="text-2xl group-hover:scale-125 transition-transform" style={{ filter: `drop-shadow(0 0 10px ${comp.color}80)` }}>{comp.emoji}</span>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-center opacity-60 group-hover:opacity-100">{comp.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Canvas Area: React Three Fiber */}
                <div className="flex-1 w-full h-full relative cursor-crosshair">
                    <Canvas shadows camera={{ position: [15, 20, 20], fov: 45 }}>
                        <Scene 
                            nodes={nodes} 
                            setNodes={setNodes} 
                            connections={connections} 
                            setConnections={setConnections}
                            activeTool={activeTool}
                            setActiveTool={setActiveTool}
                            isLightMode={isLightMode}
                        />
                    </Canvas>

                    <div className="absolute bottom-8 left-8 text-base-content/40 text-[10px] font-black uppercase tracking-[0.4em] pointer-events-none">
                        Use [Left Click] to drag nodes or rotate view · [Scroll] to zoom · [Right Click] to pan
                        <br/>
                        {activeTool === 'connect' && <span className="text-warning animate-pulse mt-2 block">Connect Mode Active - Select two nodes</span>}
                    </div>
                </div>

                {/* AI Diagram Analysis Slide-over */}
                {aiFeedback && (
                    <div className="absolute right-6 top-28 bottom-6 w-[400px] bg-base-100/95 backdrop-blur-3xl border border-primary/30 rounded-[32px] shadow-2xl z-40 flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-base-content/10 bg-primary/10">
                            <div className="flex items-center gap-3">
                                <SparklesIcon className="size-6 text-primary" />
                                <h3 className="font-black italic text-lg text-base-content">System Assessment</h3>
                            </div>
                            <button onClick={() => setAiFeedback(null)} className="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-base-content">
                                <XIcon className="size-5" />
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto flex-1 text-sm font-medium leading-loose text-base-content/80 whitespace-pre-wrap">
                            {aiFeedback.replace(/\*+/g, "")}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WhiteboardPage;
