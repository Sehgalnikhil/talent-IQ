import { motion } from "framer-motion";

/**
 * Ambient background floating nodes layout that animates infinitely.
 */
export default function FloatingParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.2 + 0.05,
                        scale: Math.random() * 0.5 + 0.5,
                    }}
                    animate={{
                        y: ["-10%", "110%"],
                        x: [`${Math.random() * 80 + 10}%`, `${Math.random() * 80 + 10}%`],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: Math.random() * 20 + 20,
                        ease: "linear",
                        delay: Math.random() * 5,
                    }}
                    className="absolute size-6 rounded-full bg-gradient-to-tr from-primary/30 to-secondary/10 blur-[6px]"
                />
            ))}
        </div>
    );
}
