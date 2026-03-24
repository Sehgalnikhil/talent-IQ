import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function LiquidMeshBackground() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [winSize, setWinSize] = useState({ w: 1000, h: 1000 });

    useEffect(() => {
        if (typeof window !== "undefined") {
            setWinSize({ w: window.innerWidth, h: window.innerHeight });
            const handleResize = () => setWinSize({ w: window.innerWidth, h: window.innerHeight });
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    // Hooks must be called unconditionally at top level
    const x1 = useTransform(mouseX, [0, winSize.w], [-100, winSize.w]);
    const y1 = useTransform(mouseY, [0, winSize.h], [-100, winSize.h]);
    
    const x2 = useTransform(mouseX, [0, winSize.w], [winSize.w, -100]);
    const y2 = useTransform(mouseY, [0, winSize.h], [winSize.h, -100]);

    if (!isMounted) return null;

    return (
        <div className="absolute inset-0 -z-50 overflow-hidden bg-[#0a0c10]">
            {/* Static Grid Layer */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--fallback-b1,oklch(var(--b1)))_1px,transparent_1px)] bg-[size:32px_32px] opacity-15 pointer-events-none" 
                 style={{ 
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                    backgroundSize: "24px 24px"
                 }}
            />

            {/* Liquid mesh Light trails (Mouse tracking and automated glow) */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full filter blur-[100px] pointer-events-none opacity-40 mix-blend-screen"
                style={{
                    background: "radial-gradient(circle, rgba(0, 218, 243, 0.45) 0%, rgba(0, 97, 109, 0.1) 50%, transparent 100%)",
                    left: x1,
                    top: y1,
                }}
            />

            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full filter blur-[80px] pointer-events-none opacity-30 mix-blend-screen"
                style={{
                    background: "radial-gradient(circle, rgba(239, 68, 68, 0.35) 0%, rgba(249, 115, 22, 0.05) 50%, transparent 100%)",
                    left: x2,
                    top: y2,
                }}
            />

            {/* Ambient automated slow lights */}
            <motion.div
                animate={{
                    x: ["20%", "60%", "20%"],
                    y: ["20%", "50%", "20%"],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px] pointer-events-none opacity-30 mix-blend-screen"
            />
            
            <motion.div
                animate={{
                    x: ["80%", "40%", "80%"],
                    y: ["70%", "30%", "70%"],
                    scale: [1.1, 0.9, 1.1],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none opacity-30 mix-blend-screen"
            />
        </div>
    );
}
