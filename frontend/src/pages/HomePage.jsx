import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
  SwordsIcon,
  BrainCircuitIcon,
  TrophyIcon,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Feature #1: Code Rain Canvas Animation
function CodeRainCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "function x() { return 1; } map reduce filter join split push pop".split(" ");
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1).map(() => Math.random() * -100);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const brightness = Math.max(0.1, 1 - (drops[i] * fontSize) / canvas.height);
        ctx.fillStyle = `rgba(99, 102, 241, ${brightness * 0.5})`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.5;
      }
    };

    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
    />
  );
}

function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 80, damping: 12 } }
  };

  return (
    <div className="bg-gradient-to-br from-base-300 via-base-200 to-base-100 text-base-content selection:bg-primary/30 min-h-screen">
      {/* NAVBAR */}
      <nav className="bg-base-100/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          <Link
            to={"/"}
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
          >
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <SparklesIcon className="size-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
                Talent IQ
              </span>
              <span className="text-xs text-base-content/60 font-medium -mt-1">Code Together</span>
            </div>
          </Link>

          <SignInButton mode="modal">
            <button className="btn btn-primary btn-sm px-6 h-10 shadow-lg glow-effect">
              Get Started
              <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative overflow-hidden min-h-[85vh] flex items-center">
        <CodeRainCanvas />
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 animate-pulse [animation-delay:2s]" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto px-6 py-20 relative z-10"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT CONTENT */}
            <div className="space-y-8">
              <motion.div variants={itemVariants} className="badge badge-primary badge-lg gap-2 font-black py-4 px-4 shadow-md bg-primary/20 border-primary/30 text-primary">
                <ZapIcon className="size-4 animate-bounce" />
                Collaborative Code Arena
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Code Together,
                </span>
                <br />
                <span className="text-white drop-shadow-sm">Learn Together</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-xl text-base-content/70 leading-relaxed max-w-xl font-medium">
                The ultimate platform for collaborative coding interviews and pair programming.
                Connect face-to-face, code in real-time, and ace your technical interviews.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
                {["Live Video Chat", "AI Interviewer", "ELO Ranking", "Multi-Language"].map((text) => (
                  <div key={text} className="badge badge-lg badge-outline gap-1 font-bold border-base-content/10 bg-base-100/30 backdrop-blur-md">
                    <CheckIcon className="size-4 text-primary" /> {text}
                  </div>
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <SignInButton mode="modal">
                  <button className="btn btn-primary btn-lg shadow-xl shadow-primary/20 px-8 group font-bold">
                    Start Coding Now
                    <ArrowRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>

                <button className="btn btn-outline btn-lg border-white/10 hover:border-white/20 glass px-8">
                  <VideoIcon className="size-5" />
                  Watch Demo
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="stats stats-vertical lg:stats-horizontal bg-base-100/40 backdrop-blur-xl shadow-2xl border border-white/5 rounded-2xl">
                <div className="stat">
                  <div className="stat-value bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">10K+</div>
                  <div className="stat-title font-bold text-base-content/60">Active Users</div>
                </div>
                <div className="stat border-none">
                  <div className="stat-value bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">50K+</div>
                  <div className="stat-title font-bold text-base-content/60">Sessions</div>
                </div>
                <div className="stat border-none">
                  <div className="stat-value bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">99.9%</div>
                  <div className="stat-title font-bold text-base-content/60">Uptime</div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT CODESNIPPET */}
            <motion.div variants={cardVariants} className="relative group">
              <div className="card bg-black/40 backdrop-blur-xl border border-white/10 p-6 font-mono text-sm overflow-hidden rounded-3xl shadow-2xl shadow-black/50">
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                  <div className="size-3 rounded-full bg-red-500"></div>
                  <div className="size-3 rounded-full bg-yellow-500"></div>
                  <div className="size-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-xs text-base-content/40">twoSum.js</span>
                </div>
                <pre className="text-base-content/80 leading-relaxed overflow-hidden text-xs md:text-sm">
                  <code>
                    {`function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`}
                  </code>
                </pre>
                <div className="mt-4 flex items-center justify-between z-10 relative">
                  <div className="flex gap-2">
                    <span className="badge badge-success badge-sm gap-1"><CheckIcon className="size-3" /> Tests Passed</span>
                    <span className="badge badge-ghost badge-sm border-white/5">4ms</span>
                  </div>
                  <div className="text-[11px] font-bold text-primary">O(n) Time</div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl blur-2xl -z-10 group-hover:scale-105 transition-transform duration-500" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black mb-4">
            Everything You Need to <span className="text-primary font-mono tracking-wide">Succeed</span>
          </h2>
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto font-medium">
            Powerful features designed to make your coding interviews seamless and productive
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {[
            { icon: <BrainCircuitIcon className="size-8 text-primary" />, title: "AI Interviewer", desc: "Practice with our Gemini-powered AI that simulates FAANG-level interviewers with adjustable difficulty", bg: "bg-primary/10" },
            { icon: <SwordsIcon className="size-8 text-error" />, title: "Speedrun Arena", desc: "Race against real opponents with ELO ranking, sabotage mechanics, and live spectator mode", bg: "bg-error/10" },
            { icon: <TrophyIcon className="size-8 text-warning" />, title: "Achievement System", desc: "Earn badges, build streaks, climb the leaderboard, and track your progress with beautiful analytics", bg: "bg-warning/10" },
            { icon: <VideoIcon className="size-8 text-secondary" />, title: "HD Video Call", desc: "Crystal clear video and audio for seamless communication during interviews", bg: "bg-secondary/10" },
            { icon: <Code2Icon className="size-8 text-accent" />, title: "Live Code Editor", desc: "Collaborate in real-time with syntax highlighting, AI hints, and multiple language support", bg: "bg-accent/10" },
            { icon: <UsersIcon className="size-8 text-success" />, title: "Easy Collaboration", desc: "Share your screen, discuss solutions, and learn from each other in real-time", bg: "bg-success/10" }
          ].map((feat, i) => (
            <motion.div key={i} variants={itemVariants} className="card bg-base-100/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl p-6 group">
              <div className="card-body items-center text-center p-2">
                <div className={`size-16 ${feat.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{feat.title}</h3>
                <p className="text-base-content/60 font-medium text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
export default HomePage;
