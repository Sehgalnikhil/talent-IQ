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

    const chars = "function mergeSort(arr) { if (arr.length <= 1) return arr; const mid = Math.floor(arr.length / 2); return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid))); } for while if else return const let var => {} [] () + - * / = == === !== < > <= >= && || ! map filter reduce forEach splice push pop shift unshift".split("");
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

        // Gradient from primary to dim
        const brightness = Math.max(0.1, 1 - (drops[i] * fontSize) / canvas.height);
        ctx.fillStyle = `rgba(99, 102, 241, ${brightness * 0.6})`;
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
      className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
    />
  );
}

function HomePage() {
  return (
    <div className="bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* NAVBAR */}
      <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          <Link
            to={"/"}
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
          >
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
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
            <button className="group px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2">
              <span>Get Started</span>
              <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* Feature #1: HERO SECTION WITH CODE RAIN */}
      <div className="relative overflow-hidden">
        <CodeRainCanvas />
        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT CONTENT */}
            <div className="space-y-8">
              <div className="badge badge-primary badge-lg gap-2">
                <ZapIcon className="size-4" />
                Real-time Collaboration
              </div>

              <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Code Together,
                </span>
                <br />
                <span className="text-base-content">Learn Together</span>
              </h1>

              <p className="text-xl text-base-content/70 leading-relaxed max-w-xl">
                The ultimate platform for collaborative coding interviews and pair programming.
                Connect face-to-face, code in real-time, and ace your technical interviews.
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="badge badge-lg badge-outline gap-1">
                  <CheckIcon className="size-4 text-success" /> Live Video Chat
                </div>
                <div className="badge badge-lg badge-outline gap-1">
                  <CheckIcon className="size-4 text-success" /> AI Interviewer
                </div>
                <div className="badge badge-lg badge-outline gap-1">
                  <CheckIcon className="size-4 text-success" /> ELO Ranking
                </div>
                <div className="badge badge-lg badge-outline gap-1">
                  <CheckIcon className="size-4 text-success" /> Multi-Language
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <SignInButton mode="modal">
                  <button className="btn btn-primary btn-lg">
                    Start Coding Now
                    <ArrowRightIcon className="size-5" />
                  </button>
                </SignInButton>

                <button className="btn btn-outline btn-lg">
                  <VideoIcon className="size-5" />
                  Watch Demo
                </button>
              </div>

              <div className="stats stats-vertical lg:stats-horizontal bg-base-100 shadow-lg">
                <div className="stat">
                  <div className="stat-value text-primary">10K+</div>
                  <div className="stat-title">Active Users</div>
                </div>
                <div className="stat">
                  <div className="stat-value text-secondary">50K+</div>
                  <div className="stat-title">Sessions</div>
                </div>
                <div className="stat">
                  <div className="stat-value text-accent">99.9%</div>
                  <div className="stat-title">Uptime</div>
                </div>
              </div>
            </div>

            {/* RIGHT — Animated code snippet instead of static image */}
            <div className="relative">
              <div className="bg-base-100 rounded-3xl shadow-2xl border-4 border-base-300/50 p-6 font-mono text-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="size-3 rounded-full bg-error"></div>
                  <div className="size-3 rounded-full bg-warning"></div>
                  <div className="size-3 rounded-full bg-success"></div>
                  <span className="ml-4 text-xs text-base-content/40">twoSum.js</span>
                </div>
                <pre className="text-base-content/80 leading-relaxed overflow-hidden">
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
  
  return []; // No solution found
}

// Tests: ✅ All Passed!
// Time Complexity: O(n)
// Space Complexity: O(n)`}
                  </code>
                </pre>
                <div className="mt-4 flex items-center gap-2">
                  <span className="badge badge-success badge-sm gap-1"><CheckIcon className="size-3" /> All Tests Passed</span>
                  <span className="badge badge-ghost badge-sm">Runtime: 4ms</span>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION — Enhanced */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to <span className="text-primary font-mono">Succeed</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Powerful features designed to make your coding interviews seamless and productive
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow hover:-translate-y-1 duration-300">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <BrainCircuitIcon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">AI Interviewer</h3>
              <p className="text-base-content/70">
                Practice with our Gemini-powered AI that simulates FAANG-level interviewers with adjustable difficulty
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow hover:-translate-y-1 duration-300">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-error/10 rounded-2xl flex items-center justify-center mb-4">
                <SwordsIcon className="size-8 text-error" />
              </div>
              <h3 className="card-title">Speedrun Arena</h3>
              <p className="text-base-content/70">
                Race against real opponents with ELO ranking, sabotage mechanics, and live spectator mode
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow hover:-translate-y-1 duration-300">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-warning/10 rounded-2xl flex items-center justify-center mb-4">
                <TrophyIcon className="size-8 text-warning" />
              </div>
              <h3 className="card-title">Achievement System</h3>
              <p className="text-base-content/70">
                Earn badges, build streaks, climb the leaderboard, and track your progress with beautiful analytics
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow hover:-translate-y-1 duration-300">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <VideoIcon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">HD Video Call</h3>
              <p className="text-base-content/70">
                Crystal clear video and audio for seamless communication during interviews
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow hover:-translate-y-1 duration-300">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Code2Icon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Live Code Editor</h3>
              <p className="text-base-content/70">
                Collaborate in real-time with syntax highlighting, AI hints, and multiple language support
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow hover:-translate-y-1 duration-300">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <UsersIcon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Easy Collaboration</h3>
              <p className="text-base-content/70">
                Share your screen, discuss solutions, and learn from each other in real-time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
