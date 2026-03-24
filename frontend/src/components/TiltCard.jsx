import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from "framer-motion";

/**
 * Premium 3D Tilt Card utilizing framer-motion absolute depths 
 * for rich hovering triggers and tilting effects.
 */
export default function TiltCard({ children, className = "", intensity = 15, onClick }) {
    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    // Motion values to track coordinates
    const x = useMotionValue(200);
    const y = useMotionValue(200);

    // Calculate rotation with spring damping
    const rotateX = useTransform(y, [0, 400], [intensity, -intensity]);
    const rotateY = useTransform(x, [0, 400], [-intensity, intensity]);

    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        
        // Normalize mouse coordinates to 0..400 inside the Card
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const cardWidth = rect.width;
        const cardHeight = rect.height;

        // Map values on relative percentages
        x.set((mouseX / cardWidth) * 400);
        y.set((mouseY / cardHeight) * 400);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(200); // Return to default
        y.set(200);
    };

    const glowX = useTransform(x, [0, 400], [0, 100]);
    const glowY = useTransform(y, [0, 400], [0, 100]);

    const glossBackground = useMotionTemplate`radial-gradient(400px circle at ${glowX}% ${glowY}%, rgba(0, 218, 243, 0.15), transparent 80%)`;
    const borderBackground = useMotionTemplate`radial-gradient(500px circle at ${glowX}% ${glowY}%, rgba(0, 227, 253, 0.4), transparent 50%)`;

    return (
        <motion.div
            ref={cardRef}
            className={`relative rounded-3xl overflow-hidden border border-white/5 bg-[#121418]/60 backdrop-blur-xl transition-all duration-300 ${className}`}
            style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
                rotateX: springRotateX,
                rotateY: springRotateY,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {/* Gloss Highlight Overlay */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-10"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: glossBackground,
                }}
            />
            
            {/* Border glow */}
            {isHovered && (
                <motion.div
                    className="pointer-events-none absolute -inset-px z-20"
                    style={{
                        background: borderBackground,
                        WebkitMaskImage: 'radial-gradient(circle, transparent 100%, black 100%)',
                        maskImage: 'radial-gradient(circle, transparent 100%, black 100%)',
                    }}
                />
            )}

            <div 
                className="relative z-30 h-full"
                style={{
                    transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
                    transition: "transform 0.3s ease-out",
                    transformStyle: "preserve-3d"
                }}
            >
                {children}
            </div>
        </motion.div>
    );
}
