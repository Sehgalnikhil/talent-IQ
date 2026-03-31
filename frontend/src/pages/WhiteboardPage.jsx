import Navbar from "../components/Navbar";
import {
    NetworkIcon, Loader2Icon, MousePointer2Icon, PencilIcon,
    EraserIcon, DownloadIcon, Trash2Icon, CircleIcon, SquareIcon,
    TypeIcon, Share2Icon, Undo2Icon, Redo2Icon, CheckCircleIcon,
    SparklesIcon, XIcon
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useSearchParams } from "react-router";
import axiosInstance from "../lib/axios";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function WhiteboardPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!searchParams.get("room")) {
            const randomRoom = Math.random().toString(36).substring(7);
            setSearchParams({ room: randomRoom }, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const roomId = searchParams.get("room") ? `whiteboard_${searchParams.get("room")}` : null;

    const [activeTool, setActiveTool] = useState("draw");
    const [color, setColor] = useState("#3b82f6"); // primary blue
    const [brushSize, setBrushSize] = useState(3);
    const canvasRef = useRef(null);
    const socketRef = useRef(null);
    const otherCursorsRef = useRef({});

    // Feature #14: Live cursor presence
    const [liveCursors, setLiveCursors] = useState({});
    const cursorCanvasRef = useRef(null);

    // Feature #13: System Design Component Library
    const [showComponentLib, setShowComponentLib] = useState(false);
    const SYSTEM_COMPONENTS = [
        { id: "database", label: "Database", emoji: "🗄️", color: "#3b82f6", w: 120, h: 60 },
        { id: "loadbalancer", label: "Load Balancer", emoji: "⚖️", color: "#10b981", w: 130, h: 50 },
        { id: "cache", label: "Cache (Redis)", emoji: "⚡", color: "#f59e0b", w: 120, h: 50 },
        { id: "api-gw", label: "API Gateway", emoji: "🚪", color: "#8b5cf6", w: 120, h: 50 },
        { id: "queue", label: "Message Queue", emoji: "📬", color: "#ef4444", w: 130, h: 50 },
        { id: "cdn", label: "CDN", emoji: "🌐", color: "#06b6d4", w: 80, h: 50 },
        { id: "service", label: "Microservice", emoji: "📦", color: "#6366f1", w: 120, h: 60 },
        { id: "client", label: "Client/User", emoji: "👤", color: "#ec4899", w: 100, h: 50 },
    ];
    const [placedComponents, setPlacedComponents] = useState([]);
    const [draggingComponent, setDraggingComponent] = useState(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // State for undo/redo
    const historyRef = useRef([]);
    const stepRef = useRef(-1);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    // AI States
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiFeedback, setAiFeedback] = useState(null);

    // State for shapes & text
    const startPosRef = useRef({ x: 0, y: 0 });
    const snapshotRef = useRef(null);

    // Track state changes to prevent infinite socket loops
    const ignoreNextDrawRef = useRef(false);

    useEffect(() => {
        if (!roomId) return;

        const socket = io(SOCKET_URL, { withCredentials: true });
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Connected to Whiteboard Server:", socket.id);
            socket.emit("join_whiteboard", roomId);
            toast.success("Joined Live Whiteboard!", { icon: "🟢" });
        });

        socket.on("clear_whiteboard", () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            saveState();
        });

        socket.on("draw_event", (data) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });

            if (data.action === "start") {
                ctx.beginPath();
                ctx.moveTo(data.x, data.y);
            } else if (data.action === "draw") {
                const oldColor = ctx.strokeStyle;
                const oldSize = ctx.lineWidth;
                const oldOp = ctx.globalCompositeOperation;

                ctx.strokeStyle = data.tool === "eraser" ? "#ffffff" : data.color;
                ctx.lineWidth = data.tool === "eraser" ? data.brushSize * 4 : data.brushSize;
                ctx.globalCompositeOperation = data.tool === "eraser" ? "destination-out" : "source-over";

                ctx.lineTo(data.x, data.y);
                ctx.stroke();

                // Restore
                ctx.strokeStyle = oldColor;
                ctx.lineWidth = oldSize;
                ctx.globalCompositeOperation = oldOp;
            } else if (data.action === "stop") {
                ctx.closePath();
                saveState();
            } else if (data.action === "shape") {
                // Someone drew a completed shape online! (mock support for simplicity)
                setIsSyncing(true);
                setTimeout(() => setIsSyncing(false), 500);
            }
        });

        socket.on("cursor_move", (data) => {
            otherCursorsRef.current[data.socketId] = { x: data.x, y: data.y, color: data.color, name: data.name || "Peer" };
            setLiveCursors({ ...otherCursorsRef.current });
        });

        socket.on("user_left_whiteboard", (data) => {
            delete otherCursorsRef.current[data.socketId];
            setLiveCursors({ ...otherCursorsRef.current });
        });

        return () => {
            socket.disconnect();
        };
    }, [roomId]);

    const updateUndoRedoState = () => {
        setCanUndo(stepRef.current > 0);
        setCanRedo(stepRef.current < historyRef.current.length - 1);
    };

    const saveState = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const newHistory = historyRef.current.slice(0, stepRef.current + 1);
        newHistory.push(imageData);
        historyRef.current = newHistory;
        stepRef.current = newHistory.length - 1;
        updateUndoRedoState();
    };

    const undo = () => {
        if (stepRef.current > 0) {
            stepRef.current -= 1;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.putImageData(historyRef.current[stepRef.current], 0, 0);
            updateUndoRedoState();
        }
    };

    const redo = () => {
        if (stepRef.current < historyRef.current.length - 1) {
            stepRef.current += 1;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.putImageData(historyRef.current[stepRef.current], 0, 0);
            updateUndoRedoState();
        }
    };

    // Canvas resize logic
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            const rect = parent.getBoundingClientRect();

            if (canvas.width !== rect.width || canvas.height !== rect.height) {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                const tempCtx = tempCanvas.getContext('2d');
                if (canvas.width > 0 && canvas.height > 0) {
                    tempCtx.drawImage(canvas, 0, 0);
                }

                canvas.width = rect.width;
                canvas.height = rect.height;

                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                if (canvas.width > 0 && canvas.height > 0) {
                    ctx.drawImage(tempCanvas, 0, 0);
                }

                if (historyRef.current.length === 0) {
                    saveState();
                }
            }
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.strokeStyle = activeTool === "eraser" ? "#ffffff" : color;

        if (activeTool === "eraser") {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = brushSize * 4;
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.lineWidth = brushSize;
        }

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    }, [color, brushSize, activeTool]);

    const startDrawing = (e) => {
        if (activeTool === "cursor") return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const rect = canvas.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        startPosRef.current = { x, y };

        if (activeTool === "text") {
            const text = prompt("Enter text to place here:");
            if (text) {
                ctx.globalCompositeOperation = "source-over";
                ctx.font = `bold ${brushSize * 4 + 12}px sans-serif`;
                ctx.fillStyle = color;
                ctx.fillText(text, x, y);
                saveState();

                setIsSyncing(true);
                setTimeout(() => setIsSyncing(false), 1200);
            }
            return;
        }

        if (activeTool === "rect" || activeTool === "circle") {
            snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);

        // Emit to socket
        if (socketRef.current) {
            socketRef.current.emit("draw_event", { roomId, action: "start", x, y, color, brushSize, tool: activeTool });
        }
    };

    const draw = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (socketRef.current) {
            socketRef.current.emit("cursor_move", { roomId, x, y, color });
        }

        if (!isDrawing || activeTool === "cursor" || activeTool === "text") return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (activeTool === "draw" || activeTool === "eraser") {
            ctx.lineTo(x, y);
            ctx.stroke();

            if (socketRef.current) {
                socketRef.current.emit("draw_event", { roomId, action: "draw", x, y, color, brushSize, tool: activeTool });
            }
        } else if (activeTool === "rect" || activeTool === "circle") {
            ctx.putImageData(snapshotRef.current, 0, 0);
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = color;
            ctx.lineWidth = brushSize;

            ctx.beginPath();
            if (activeTool === "rect") {
                ctx.rect(startPosRef.current.x, startPosRef.current.y, x - startPosRef.current.x, y - startPosRef.current.y);
            } else if (activeTool === "circle") {
                const radius = Math.sqrt(Math.pow(x - startPosRef.current.x, 2) + Math.pow(y - startPosRef.current.y, 2));
                ctx.arc(startPosRef.current.x, startPosRef.current.y, radius, 0, 2 * Math.PI);
            }
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        if (isDrawing) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.closePath();
            setIsDrawing(false);
            snapshotRef.current = null;

            saveState();

            if (socketRef.current) {
                socketRef.current.emit("draw_event", { roomId, action: "stop" });
            }

            setIsSyncing(true);
            setTimeout(() => setIsSyncing(false), 900);
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        saveState();

        if (socketRef.current) {
            socketRef.current.emit("clear_whiteboard", roomId);
        }
    };

    const downloadCanvas = () => {
        const canvas = canvasRef.current;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");

        tempCtx.fillStyle = "#ffffff";
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvas, 0, 0);

        const dataUrl = tempCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "talent-iq-whiteboard.png";
        link.href = dataUrl;
        link.click();
    };

    const shareBoard = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Live link copied! Share it with friends.", {
            icon: '🔗',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    };

    const analyzeBoard = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Generate an opaque white background snapshot so the AI can read it perfectly (otherwise transparent PNGs fail)
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");

        tempCtx.fillStyle = "#ffffff";
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvas, 0, 0);

        const dataUrl = tempCanvas.toDataURL("image/png");

        setIsAnalyzing(true);
        setAiFeedback(null);
        try {
            const res = await axiosInstance.post("/interview/analyze-diagram", { image: dataUrl });
            setAiFeedback(res.data.feedback);
            toast.success("AI Design Assessment Complete!", { icon: "✨" });
        } catch (err) {
            toast.error("Failed to map diagram.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const colors = [
        { name: "Blue", value: "#3b82f6" },
        { name: "Rose", value: "#f43f5e" },
        { name: "Emerald", value: "#10b981" },
        { name: "Amber", value: "#f59e0b" },
        { name: "Purple", value: "#8b5cf6" },
        { name: "Dark", value: "#1e293b" },
    ];

    const tools = [
        { id: "cursor", icon: MousePointer2Icon, label: "Select (V)" },
        { id: "draw", icon: PencilIcon, label: "Freehand Draw (P)" },
        { id: "eraser", icon: EraserIcon, label: "Eraser (E)" },
        { id: "rect", icon: SquareIcon, label: "Rectangle (R)" },
        { id: "circle", icon: CircleIcon, label: "Circle (C)" },
        { id: "text", icon: TypeIcon, label: "Text (T)" },
    ];

    // Feature #13: Drop handler for dragging components onto canvas
    const handleCanvasDrop = (e) => {
        if (!draggingComponent) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const comp = SYSTEM_COMPONENTS.find(c => c.id === draggingComponent);
        if (!comp) return;

        // Draw the component box on canvas
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.save();
        ctx.fillStyle = comp.color + "20";
        ctx.strokeStyle = comp.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x - comp.w / 2, y - comp.h / 2, comp.w, comp.h, 10);
        ctx.fill();
        ctx.stroke();
        // Label
        ctx.fillStyle = comp.color;
        ctx.font = "bold 13px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`${comp.emoji} ${comp.label}`, x, y + 5);
        ctx.restore();
        saveState();

        setPlacedComponents(prev => [...prev, { ...comp, x, y }]);
        setDraggingComponent(null);
        toast.success(`Placed ${comp.label}!`, { icon: comp.emoji });
    };

    return (
        <div className="h-screen bg-base-200 flex flex-col font-sans selection:bg-primary/30 pt-24">
            <Navbar />

            <div className="flex-1 flex overflow-hidden relative">

                {/* Floating Left Toolbar */}
                <div className="absolute left-6 top-6 bottom-6 w-16 bg-base-100/90 backdrop-blur-xl border border-base-300/50 rounded-2xl flex flex-col items-center py-6 gap-3 z-30 shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-y-auto overflow-x-hidden no-scrollbar">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        const isActive = activeTool === tool.id;
                        return (
                            <button
                                key={tool.id}
                                onClick={() => setActiveTool(tool.id)}
                                title={tool.label}
                                className={`p-3 rounded-xl transition-all duration-300 relative group
                                    ${isActive
                                        ? 'bg-primary/15 text-primary shadow-inner hover:bg-primary/20 scale-105'
                                        : 'hover:bg-base-200/80 text-base-content/60 hover:text-base-content hover:scale-105'
                                    }`}
                            >
                                <Icon className="size-5" />
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                )}

                                <div className="absolute left-full ml-4 px-3 py-1.5 bg-base-300 text-base-content text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {tool.label}
                                </div>
                            </button>
                        );
                    })}

                    <div className="w-8 h-px bg-base-300 my-2 shrink-0"></div>

                    {/* Color Palette */}
                    <div className="flex flex-col gap-3 pt-2">
                        {colors.map((c) => (
                            <button
                                key={c.value}
                                onClick={() => {
                                    setColor(c.value);
                                    if (activeTool === "cursor" || activeTool === "eraser") setActiveTool("draw");
                                }}
                                title={c.name}
                                className={`size-6 shrink-0 rounded-full transition-all duration-300 outline-none hover:rotate-12
                                    ${color === c.value && activeTool !== "eraser" && activeTool !== "cursor" ? 'scale-125 ring-2 ring-offset-2 ring-primary ring-offset-base-100 shadow-md' : 'hover:scale-110 shadow-sm opacity-80 hover:opacity-100'}
                                `}
                                style={{ backgroundColor: c.value }}
                            />
                        ))}
                    </div>
                </div>

                {/* Top Floating Action Bar */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 h-14 bg-base-100/90 backdrop-blur-xl border border-base-300/50 rounded-2xl flex items-center px-6 gap-6 z-30 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                    <div className="flex items-center gap-3 pr-6 border-r border-base-300">
                        <div className="badge badge-primary badge-sm p-3 font-bold uppercase tracking-wider text-[10px] gap-1.5 shadow-primary/20 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                            <NetworkIcon className="size-3.5" /> Live Session
                        </div>
                        <div className="w-24 flex items-center">
                            {isSyncing ? (
                                <span className="text-xs font-medium text-base-content/60 flex items-center gap-1.5 animate-pulse w-full">
                                    <Loader2Icon className="size-3.5 animate-spin" /> Syncing...
                                </span>
                            ) : (
                                <span className="text-xs font-medium text-success flex items-center gap-1.5 w-full transition-opacity">
                                    <CheckCircleIcon className="size-3.5" /> All synced
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-widest hidden md:inline">Brush Size</span>
                            <input
                                type="range"
                                min="1" max="24"
                                value={brushSize}
                                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                className="range range-xs range-primary w-24 mx-2"
                            />
                        </div>

                        <div className="w-px h-6 bg-base-300"></div>

                        <div className="flex gap-1">
                            <button
                                onClick={undo}
                                disabled={!canUndo}
                                className={`btn btn-ghost btn-sm btn-square hover:bg-base-200 transition-colors ${canUndo ? 'text-base-content' : 'text-base-content/20'}`}
                            >
                                <Undo2Icon className="size-4" />
                            </button>
                            <button
                                onClick={redo}
                                disabled={!canRedo}
                                className={`btn btn-ghost btn-sm btn-square hover:bg-base-200 transition-colors ${canRedo ? 'text-base-content' : 'text-base-content/20'}`}
                            >
                                <Redo2Icon className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Floating Action Bar */}
                <div className="absolute top-6 right-6 h-14 bg-base-100/90 backdrop-blur-xl border border-base-300/50 rounded-2xl flex items-center px-2 gap-1 z-30 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                    <button
                        onClick={clearCanvas}
                        className="btn btn-ghost btn-sm text-error/80 hover:bg-error/10 hover:text-error gap-2 font-semibold transition-colors"
                    >
                        <Trash2Icon className="size-4" /> <span className="hidden md:inline">Clear</span>
                    </button>
                    <button
                        onClick={downloadCanvas}
                        className="btn btn-ghost btn-sm text-base-content/70 hover:text-base-content gap-2 font-semibold transition-colors"
                    >
                        <DownloadIcon className="size-4" /> <span className="hidden md:inline">Export</span>
                    </button>
                    <div className="w-px h-6 bg-base-300 mx-1 hidden sm:block"></div>
                    <button
                        onClick={analyzeBoard}
                        disabled={isAnalyzing}
                        className="btn bg-fuchsia-500 hover:bg-fuchsia-600 text-white btn-sm mx-1 border-none gap-2 shadow-fuchsia-500/30 shadow-sm px-4 hover:scale-105 transition-transform"
                    >
                        {isAnalyzing ? <Loader2Icon className="size-4 animate-spin" /> : <SparklesIcon className="size-4" />}
                        <span className="hidden md:inline">{isAnalyzing ? "Analyzing..." : "AI Assessment"}</span>
                    </button>
                    <button onClick={shareBoard} className="btn btn-primary btn-sm mx-1 gap-2 shadow-primary/30 shadow-sm px-4 hover:scale-105 transition-transform">
                        <Share2Icon className="size-4" /> <span className="hidden md:inline">Share</span>
                    </button>
                    <button
                        onClick={() => setShowComponentLib(!showComponentLib)}
                        className={`btn btn-sm mx-1 gap-2 px-4 hover:scale-105 transition-transform ${showComponentLib ? 'btn-secondary' : 'btn-ghost text-base-content/70'}`}
                    >
                        <NetworkIcon className="size-4" /> <span className="hidden md:inline">Components</span>
                    </button>
                </div>

                {/* Feature #13: System Design Component Library Sidebar */}
                {showComponentLib && (
                    <div className="absolute right-6 top-24 w-52 bg-base-100/95 backdrop-blur-xl border border-secondary/30 rounded-2xl shadow-2xl z-40 p-4 space-y-2">
                        <h3 className="font-bold text-sm text-secondary flex items-center gap-2 mb-3">
                            <NetworkIcon className="size-4" /> System Design
                        </h3>
                        <p className="text-[10px] text-base-content/40 mb-2">Drag components onto the canvas</p>
                        {SYSTEM_COMPONENTS.map(comp => (
                            <div
                                key={comp.id}
                                draggable
                                onDragStart={() => setDraggingComponent(comp.id)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-base-300 hover:border-secondary/40 cursor-grab active:cursor-grabbing hover:bg-secondary/5 transition-colors"
                            >
                                <span className="text-lg">{comp.emoji}</span>
                                <span className="text-xs font-bold">{comp.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Canvas Area Backdrop */}
                <div
                    className="flex-1 w-full h-full bg-[#f8fafc] dark:bg-[#0f172a] relative transition-colors duration-500 overflow-hidden"
                    style={{
                        backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                        color: 'rgba(148, 163, 184, 0.25)',
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full absolute top-0 left-0 bg-transparent"
                        style={{ cursor: activeTool === 'draw' || activeTool === 'eraser' ? 'crosshair' : activeTool === 'rect' || activeTool === 'circle' ? 'crosshair' : activeTool === 'text' ? 'text' : 'pointer' }}
                        onMouseDown={startDrawing}
                        onMouseMove={(e) => {
                            draw(e);
                            // Feature #14: Send cursor position
                            if (socketRef.current && roomId) {
                                const rect = canvasRef.current.getBoundingClientRect();
                                socketRef.current.emit("cursor_move", {
                                    roomId,
                                    x: e.clientX - rect.left,
                                    y: e.clientY - rect.top,
                                    color,
                                    name: "You"
                                });
                            }
                        }}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onDrop={handleCanvasDrop}
                        onDragOver={(e) => e.preventDefault()}
                    />

                    {/* Feature #14: Live cursor overlays */}
                    {Object.entries(liveCursors).map(([id, cursor]) => (
                        <div
                            key={id}
                            className="absolute pointer-events-none z-50 transition-all duration-75"
                            style={{ left: cursor.x, top: cursor.y }}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill={cursor.color || "#3b82f6"}>
                                <path d="M0 0L16 6L9 9L6 16L0 0Z" />
                            </svg>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-3 -mt-1 inline-block shadow-sm" style={{ background: cursor.color || "#3b82f6", color: '#fff' }}>
                                {cursor.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* AI Diagram Analysis Slide-over */}
                {aiFeedback && (
                    <div className="absolute right-6 top-24 bottom-6 w-96 bg-base-100/95 backdrop-blur-xl border border-fuchsia-500/30 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-300">
                        <div className="flex items-center justify-between p-4 border-b border-base-300 bg-fuchsia-500/10">
                            <div className="flex items-center gap-2">
                                <SparklesIcon className="size-5 text-fuchsia-500" />
                                <h3 className="font-bold text-fuchsia-500">AI Design Analysis</h3>
                            </div>
                            <button onClick={() => setAiFeedback(null)} className="btn btn-ghost btn-xs btn-square hover:bg-fuchsia-500/20 text-fuchsia-500">
                                <XIcon className="size-4" />
                            </button>
                        </div>
                        <div className="p-5 overflow-y-auto flex-1 prose prose-sm max-w-none text-base-content/80 whitespace-pre-wrap">
                            {aiFeedback.replace(/\*+/g, "") /* Clean up heavy markdown bolding for UI rendering */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WhiteboardPage;
