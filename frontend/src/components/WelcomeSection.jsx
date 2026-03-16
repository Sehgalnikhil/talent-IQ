import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon, Bot, Cpu } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden mb-6">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent blur-3xl rounded-bl-[100px] pointer-events-none -mr-20"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex-1"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <SparklesIcon className="w-7 h-7 text-white animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Welcome back, {user?.firstName || "Engineer"}
              </h1>
            </div>
            <p className="text-xl text-base-content/60 ml-[4.5rem] font-medium tracking-wide">
              Ready to crush your next FAANG interview?
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 120 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/interview"
              className="group px-8 py-4 bg-gradient-to-r from-secondary to-accent text-white rounded-2xl shadow-xl shadow-secondary/20 transition-all duration-300 hover:shadow-secondary/40 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="flex items-center justify-center gap-3 font-bold text-lg relative z-10">
                <Bot className="w-6 h-6" />
                <span>Enter AI Arena</span>
                <Cpu className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              </div>
            </Link>

            <button
              onClick={onCreateSession}
              className="group px-8 py-4 bg-base-100 border-2 border-primary/20 text-primary rounded-2xl shadow-lg transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:-translate-y-1"
            >
              <div className="flex items-center justify-center gap-3 font-bold text-lg">
                <ZapIcon className="w-6 h-6" />
                <span>Co-op Session</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
