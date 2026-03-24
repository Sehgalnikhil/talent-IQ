import { motion } from "framer-motion";

/**
 * Premium Interactive Audio wave bars component that animate on audio streams flows.
 */
export default function AudioWave({ isRecording }) {
    return (
        <div className="flex items-center gap-1 h-6">
            {[1, 2, 3, 4, 5].map((item, index) => (
                <motion.div
                    key={index}
                    animate={isRecording ? { height: [4, 18, 4], opacity: [0.6, 1, 0.6] } : { height: 4, opacity: 0.4 }}
                    transition={{
                        repeat: Infinity,
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: "linear"
                    }}
                    className="w-1.5 bg-gradient-to-t from-primary via-secondary to-accent rounded-full shadow-[0_0_10px_rgba(146,68,244,0.4)]"
                />
            ))}
        </div>
    );
}
