import { motion } from "framer-motion";

/**
 * Premium 3D Rotate Card component with support for Flip reveals.
 */
export default function FlipCard({ front, back, isFlipped, onClick, className = "" }) {
    return (
        <div 
            onClick={onClick} 
            className={`perspective-[1000px] w-full cursor-pointer h-full ${className}`}
        >
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="relative w-full h-full preserve-3d"
            >
                {/* Front Side */}
                <div 
                    className={`absolute inset-0 backface-hidden flex items-center justify-center p-6 rounded-3xl border border-white/10 bg-base-100/60 backdrop-blur-md shadow-2xl z-20`}
                >
                    <div className="flex flex-col items-center justify-center text-center">
                        {front}
                    </div>
                </div>

                {/* Back Side */}
                <div 
                    className={`absolute inset-0 backface-hidden [transform:rotateY(180deg)] flex items-center justify-center p-6 rounded-3xl border border-primary/40 bg-gradient-to-br from-base-100/90 to-primary/5 backdrop-blur-lg shadow-[0_0_30px_rgba(114,56,240,0.15)]`}
                >
                    <div className="flex flex-col items-center justify-center text-center">
                        {back}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
