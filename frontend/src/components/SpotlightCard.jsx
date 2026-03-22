import React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';

const SpotlightCard = ({ children, className = "" }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div onMouseMove={handleMouseMove} className={`relative group overflow-hidden ${className}`}>
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
                style={{
                    background: useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.1), transparent 80%)`,
                }}
            />
            {children}
        </div>
    );
};

export default SpotlightCard;
