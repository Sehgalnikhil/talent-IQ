import { Link, useLocation } from "react-router";
import {
   BookOpenIcon,
   LayoutDashboardIcon,
   SparklesIcon,
   TrophyIcon,
   SwordsIcon,
   PaletteIcon,
   SearchIcon,
   ChevronDownIcon,
   Code2Icon,
   CpuIcon,
   Mic2Icon,
   BookMarkedIcon,
   HistoryIcon,
   UserCircle2Icon,
   StarIcon
} from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";
import NotificationCenter from "./NotificationCenter";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCredits } from "../hooks/useCredits";
import { Zap } from "lucide-react";


const THEMES = ["dark", "light", "dracula", "nord", "synthwave", "night", "sunset", "luxury", "corporate"];

function Navbar() {
   const { user } = useUser();
   const { balance, isLoading } = useCredits();
   const [isExploreHovered, setIsExploreHovered] = useState(false);

   const location = useLocation();
   const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("talentiq-theme") || "dark");
   const [scrolled, setScrolled] = useState(false);

   useEffect(() => {
      document.documentElement.setAttribute("data-theme", currentTheme);
      localStorage.setItem("talentiq-theme", currentTheme);
   }, [currentTheme]);

   useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   const isActive = (path) => location.pathname === path;

   return (
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4 pointer-events-none ${scrolled ? 'mt-0' : 'mt-2'}`}>
         <div className={`max-w-[1400px] mx-auto rounded-[40px] transition-all duration-500 border relative overflow-visible shadow-2xl pointer-events-auto ${scrolled ? 'bg-base-100/80 backdrop-blur-3xl border-base-content/10' : 'bg-transparent border-transparent'}`}>

            <div className="px-5 py-2.5 flex items-center justify-between relative z-10">


               {/* LOGO & PRIMARY CLUSTER */}
               <div className="flex items-center gap-4">


                  <Link to="/" className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105 shrink-0">
                     <div className="size-11 rounded-full bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-[0_0_30px_rgba(var(--color-primary),0.5)] ">
                        <SparklesIcon className="size-6 text-white" />
                     </div>
                     <div className="flex flex-col">
                        <span className="font-black text-2xl tracking-tighter leading-none bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">Talent IQ</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Neural Consensus</span>
                     </div>
                  </Link>

                  <div className="hidden xl:flex items-center gap-2">
                     {[
                        { label: "Problems", path: "/problems", icon: BookOpenIcon },
                        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboardIcon },
                        { label: "Arena", path: "/speedrun", icon: SwordsIcon, color: "text-error" },
                        { label: "Leaderboard", path: "/leaderboard", icon: TrophyIcon },
                        { label: "Profile", path: `/u/${user?.username || user?.firstName || "Candidate"}`, icon: UserCircle2Icon },
                     ].map((node) => (
                        <Link
                           key={node.path}
                           to={node.path}
                           className={`flex items-center gap-2 px-3 py-2 rounded-[18px] transition-all duration-500 font-black text-[10px] uppercase tracking-widest border border-transparent ${isActive(node.path)


                                 ? "bg-primary text-primary-content shadow-[0_0_25px_rgba(var(--color-primary),0.3)] scale-105"
                                 : `text-base-content/50 hover:bg-base-content/5 hover:text-base-content ${node.color || ""}`
                              }`}
                        >
                           <node.icon className="size-4" />
                           <span>{node.label}</span>
                        </Link>
                     ))}

                     {/* EXPLORE MEGA MENU NODE */}
                     <div 
                        className="relative ml-2"

                        onMouseEnter={() => setIsExploreHovered(true)}
                        onMouseLeave={() => setIsExploreHovered(false)}
                     >
                        <div
                           className="flex items-center gap-2 px-3 py-2 rounded-[18px] transition-all duration-500 font-black text-[10px] uppercase tracking-widest text-base-content/50 hover:bg-base-content/5 hover:text-base-content group border border-transparent cursor-pointer"


                        >
                           <SparklesIcon className="size-4 group-hover:animate-pulse" />
                           <span>Explore Space</span>
                           <ChevronDownIcon className="size-3 opacity-30" />
                        </div>

                 <AnimatePresence>
                   {isExploreHovered && (
                     <motion.div
                       initial={{ opacity: 0, y: 15, scale: 0.98 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.98 }}
                       transition={{ duration: 0.25, ease: "easeOut" }}
                       className="absolute top-[80%] right-0 pt-6 z-[200] w-[750px] pointer-events-auto"
                     >
                       <div className="menu p-10 shadow-[0_30px_100px_rgba(0,0,0,0.2)] bg-base-100/95 backdrop-blur-3xl border border-base-content/10 rounded-[48px] overflow-hidden grid grid-cols-2 gap-10">
                          {/* Column 1: Learning & Practice */}
                          <div className="flex flex-col gap-5">
                             <div className="px-5 py-3 border-b border-base-content/10 mb-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Intelligence Tracks</p>
                             </div>
                             <div className="space-y-2">
                                <li><Link to="/curated" className="rounded-3xl p-6 hover:bg-primary/10 group border border-transparent hover:border-primary/20 transition-all"><div className="flex items-center gap-5"><div className="size-12 bg-primary/15 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"><BookMarkedIcon className="size-5" /></div><div className="flex flex-col"><span className="font-black text-sm uppercase tracking-widest text-base-content">Curated Pathways</span><span className="text-[9px] opacity-40 uppercase font-black tracking-widest text-base-content">Sovereign Knowledge</span></div></div></Link></li>
                                <li><Link to="/whiteboard" className="rounded-3xl p-6 hover:bg-primary/10 group border border-transparent hover:border-primary/20 transition-all"><div className="flex items-center gap-5"><div className="size-12 bg-primary/15 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"><CpuIcon className="size-5" /></div><div className="flex flex-col"><span className="font-black text-sm uppercase tracking-widest text-base-content">System Architecture</span><span className="text-[9px] opacity-40 uppercase font-black tracking-widest text-base-content">Interactive Canvas</span></div></div></Link></li>
                                <li><Link to="/playground" className="rounded-3xl p-6 hover:bg-primary/10 group border border-transparent hover:border-primary/20 transition-all"><div className="flex items-center gap-5"><div className="size-12 bg-primary/15 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"><Code2Icon className="size-5" /></div><div className="flex flex-col"><span className="font-black text-sm uppercase tracking-widest text-base-content">Neural Sandbox</span><span className="text-[9px] opacity-40 uppercase font-black tracking-widest text-base-content">Real-time Compiler</span></div></div></Link></li>
                                <li><Link to="/flashcards" className="rounded-3xl p-6 hover:bg-primary/10 group border border-transparent hover:border-primary/20 transition-all"><div className="flex items-center gap-5"><div className="size-12 bg-primary/15 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"><HistoryIcon className="size-5" /></div><div className="flex flex-col"><span className="font-black text-sm uppercase tracking-widest text-base-content">Smart Memory</span><span className="text-[9px] opacity-40 uppercase font-black tracking-widest text-base-content">AI Spaced Repetition</span></div></div></Link></li>
                             </div>
                          </div>
      
                          {/* Column 2: Interview Simulation */}
                          <div className="flex flex-col gap-5">
                             <div className="px-5 py-3 border-b border-error/10 mb-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-error">Combat Protocol</p>
                             </div>
                             <div className="space-y-2">
                                <li><Link to="/interview" className="rounded-3xl p-6 bg-error/5 hover:bg-error text-error hover:text-white transition-all group border border-error/5 shadow-2xl"><div className="flex items-center gap-5"><div className="size-12 bg-error/20 rounded-2xl flex items-center justify-center"><SparklesIcon className="size-5" /></div><div className="flex flex-col"><span className="font-black text-sm uppercase tracking-widest">Neural Interview</span><span className="text-[9px] opacity-60 uppercase font-black tracking-widest">AI Consensus Board</span></div></div></Link></li>
                                 <li><Link to="/behavioral" className="rounded-3xl p-6 hover:bg-warning/10 group border border-transparent hover:border-warning/20 transition-all"><div className="flex items-center gap-5"><div className="size-12 bg-warning/15 rounded-2xl flex items-center justify-center text-warning group-hover:bg-warning group-hover:text-white transition-all"><StarIcon className="size-5" /></div><div className="flex flex-col"><span className="font-black text-sm uppercase tracking-widest text-base-content">STAR Simulator</span><span className="text-[9px] opacity-40 uppercase font-black tracking-widest text-base-content">Soft-Skill Analysis</span></div></div></Link></li>
                                <li><Link to="/voice-interview" className="rounded-3xl p-6 hover:bg-error/10 group border border-transparent hover:border-error/20 transition-all"><div className="flex items-center gap-5"><div className="size-12 bg-error/15 rounded-2xl flex items-center justify-center text-error group-hover:bg-error group-hover:text-white transition-all"><Mic2Icon className="size-5" /></div><div className="flex flex-col"><span className="font-black text-sm uppercase tracking-widest text-base-content">Acoustic Session</span><span className="text-[9px] opacity-40 uppercase font-black tracking-widest text-base-content">Sync-Vocal Analysis</span></div></div></Link></li>
                                <li><Link to="/generate" className="rounded-3xl p-6 hover:bg-primary/10 group border border-transparent hover:border-primary/20 transition-all"><div className="flex items-center gap-5"><div className="size-12 bg-primary/15 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"><SparklesIcon className="size-5" /></div><div className="flex flex-col"><span className="font-black text-sm uppercase tracking-widest text-base-content">AI Problem Lab</span><span className="text-[9px] opacity-40 uppercase font-black tracking-widest text-base-content">Infinite generation</span></div></div></Link></li>
                             </div>
                          </div>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
                     </div>
                  </div>
               </div>

               {/* R: STATUS & COMMAND CLUSTER */}
               <div className="flex items-center gap-4">
                  {/* CREDIT COUNTER */}
                  <Link to="/pricing" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-[22px] bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all group group-hover:scale-105">

                     <Zap className="size-4 text-primary animate-pulse" />
                     <div className="flex flex-col items-start leading-none">
                        <span className="text-[10px] font-black italic text-primary uppercase">{isLoading ? "SYNC..." : `${balance?.toLocaleString()} SCARLET`}</span>
                        <span className="text-[7px] font-black opacity-30 uppercase tracking-[0.2em]">Neural_Nodes</span>
                     </div>
                  </Link>

                  <div className="flex items-center gap-2">

                     <button onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))} className="btn btn-ghost btn-circle btn-sm">
                        <SearchIcon className="size-4 opacity-30" />
                     </button>

                     <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm">
                           <PaletteIcon className="size-4 opacity-30" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[200] menu p-5 shadow-3xl bg-base-100/95 backdrop-blur-3xl rounded-[32px] w-64 border border-base-content/5 mt-4 gap-2">
                           <header className="text-center py-2 mb-2 border-b border-base-content/5">
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">INTERFACE_THEME</span>
                           </header>
                           <div className="grid grid-cols-1 gap-1">
                              {THEMES.map((theme) => (
                                 <li key={theme}>
                                    <button onClick={() => setCurrentTheme(theme)} className={`capitalize font-black text-[10px] rounded-xl py-3 justify-center ${currentTheme === theme ? "bg-primary text-primary-content shadow-lg shadow-primary/20" : "hover:bg-primary/5"}`}>
                                       {theme}
                                    </button>
                                 </li>
                              ))}
                           </div>
                        </ul>
                     </div>

                     <NotificationCenter />

                     <div className="ml-2 pl-4 border-l border-base-content/10 scale-[1.1]">
                        <UserButton appearance={{ elements: { userButtonAvatarBox: "size-10 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-primary/20" } }} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </nav>
   );
}
export default Navbar;
