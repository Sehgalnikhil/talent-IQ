import { useState } from "react";

/**
 * Premium Spotlight Card component providing immersive 
 * mouse-tracking glow gradients over border and backgrounds.
 */
export default function SpotlightCard({ children, className = "" }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            className={`relative rounded-3xl overflow-hidden border border-white/5 bg-base-100/40 backdrop-blur-xl transition-all duration-300 ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, rgba(146, 68, 244, 0.12), transparent 80%)`,
                }}
            />
            {isHovered && (
                <div
                    className="pointer-events-none absolute -inset-px z-10"
                    style={{
                        background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(0, 227, 253, 0.4), transparent 40%)`,
                        WebkitMaskImage: 'radial-gradient(circle, transparent 100%, black 100%)',
                        maskImage: 'radial-gradient(circle, transparent 100%, black 100%)',
                    }}
                />
            )}
            <div className="relative z-10 h-full">{children}</div>
        </div>
    );
}
