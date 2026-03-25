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
  UserCircle2Icon 
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import NotificationCenter from "./NotificationCenter";
import { useState, useEffect } from "react";

const THEMES = ["dark", "light", "dracula", "nord", "synthwave", "night", "sunset", "luxury", "corporate"];

function Navbar() {
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
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4 ${scrolled ? 'mt-0' : 'mt-2'}`}>
      <div className={`max-w-[1400px] mx-auto rounded-[40px] transition-all duration-500 border relative overflow-visible shadow-2xl ${scrolled ? 'bg-base-100/70 backdrop-blur-3xl border-white/10' : 'bg-transparent border-transparent'}`}>
        
        <div className="px-10 py-4 flex items-center justify-between relative z-10">
          
          {/* LOGO & PRIMARY CLUSTER */}
          <div className="flex items-center gap-14">
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
              ].map((node) => (
                <Link
                  key={node.path}
                  to={node.path}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-3xl transition-all duration-500 font-black text-[11px] uppercase tracking-widest border border-transparent ${
                    isActive(node.path)
                      ? "bg-primary text-primary-content shadow-[0_0_30px_rgba(var(--color-primary),0.4)] scale-110"
                      : `text-base-content/50 hover:bg-base-content/5 hover:text-base-content ${node.color || ""}`
                  }`}
                >
                  <node.icon className="size-4" />
                  <span>{node.label}</span>
                </Link>
              ))}

              {/* EXPLORE MEGA MENU NODE */}
              <div className="dropdown dropdown-hover ml-6">
                 <div tabIndex={0} role="button" className="flex items-center gap-2 px-8 py-3.5 rounded-3xl transition-all duration-500 font-black text-[11px] uppercase tracking-widest text-base-content/50 hover:bg-base-content/5 hover:text-base-content group border border-transparent">
                    <SparklesIcon className="size-4 group-hover:animate-pulse" />
                    <span>Explore Space</span>
                    <ChevronDownIcon className="size-3 opacity-30" />
                 </div>
                 <ul tabIndex={0} className="dropdown-content z-[150] menu p-8 shadow-[0_0_80px_rgba(0,0,0,0.5)] bg-base-100/98 backdrop-blur-3xl rounded-[50px] w-[600px] border border-white/5 mt-3 grid grid-cols-2 gap-x-12 gap-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    {/* Column 1: Learning & Practice */}
                    <div className="space-y-4">
                       <header className="px-4 py-2 border-b border-white/5 mb-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Intelligence Tracks</span>
                       </header>
                       <li><Link to="/curated" className="rounded-2xl p-5 hover:bg-primary/5 group"><div className="flex items-center gap-4"><div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary text-primary group-hover:text-white transition-all"><BookMarkedIcon className="size-4" /></div><div className="flex flex-col"><span className="font-black text-xs uppercase tracking-widest">Curated Pathways</span><span className="text-[9px] opacity-40 uppercase font-black">Sovereign Knowledge</span></div></div></Link></li>
                       <li><Link to="/whiteboard" className="rounded-2xl p-5 hover:bg-primary/5 group"><div className="flex items-center gap-4"><div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary text-primary group-hover:text-white transition-all"><CpuIcon className="size-4" /></div><div className="flex flex-col"><span className="font-black text-xs uppercase tracking-widest">System Architecture</span><span className="text-[9px] opacity-40 uppercase font-black">Interactive Canvas</span></div></div></Link></li>
                       <li><Link to="/playground" className="rounded-2xl p-5 hover:bg-primary/5 group"><div className="flex items-center gap-4"><div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary text-primary group-hover:text-white transition-all"><Code2Icon className="size-4" /></div><div className="flex flex-col"><span className="font-black text-xs uppercase tracking-widest">Neural Sandbox</span><span className="text-[9px] opacity-40 uppercase font-black">Real-time Compiler</span></div></div></Link></li>
                       <li><Link to="/flashcards" className="rounded-2xl p-5 hover:bg-primary/5 group"><div className="flex items-center gap-4"><div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary text-primary group-hover:text-white transition-all"><HistoryIcon className="size-4" /></div><div className="flex flex-col"><span className="font-black text-xs uppercase tracking-widest">Smart Memory</span><span className="text-[9px] opacity-40 uppercase font-black">AI Spaced Repetition</span></div></div></Link></li>
                    </div>

                    {/* Column 2: Interview Simulation */}
                    <div className="space-y-4">
                       <header className="px-4 py-2 border-b border-error/10 mb-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-error">Combat Protocol</span>
                       </header>
                       <li><Link to="/interview" className="rounded-2xl p-5 bg-error/5 hover:bg-error text-error hover:text-white transition-all group shadow-xl"><div className="flex items-center gap-4"><div className="p-2 bg-error/20 rounded-xl"><SparklesIcon className="size-4" /></div><div className="flex flex-col"><span className="font-black text-xs uppercase tracking-widest">Neural Interview</span><span className="text-[9px] opacity-60 uppercase font-black">AI Consensus Board</span></div></div></Link></li>
                       <li><Link to="/voice-interview" className="rounded-2xl p-5 hover:bg-error/5 group"><div className="flex items-center gap-4"><div className="p-2 bg-error/10 rounded-xl group-hover:bg-error text-error group-hover:text-white transition-all"><Mic2Icon className="size-4" /></div><div className="flex flex-col"><span className="font-black text-xs uppercase tracking-widest">Acoustic Session</span><span className="text-[9px] opacity-40 uppercase font-black">Sync-Vocal Analysis</span></div></div></Link></li>
                       <li><Link to="/u/Developer" className="rounded-2xl p-5 hover:bg-secondary/5 group"><div className="flex items-center gap-4"><div className="p-2 bg-secondary/10 rounded-xl group-hover:bg-secondary text-secondary group-hover:text-white transition-all"><UserCircle2Icon className="size-4" /></div><div className="flex flex-col"><span className="font-black text-xs uppercase tracking-widest">Sovereign Portfolio</span><span className="text-[9px] opacity-40 uppercase font-black">Master Node Status</span></div></div></Link></li>
                       <li><Link to="/generate" className="rounded-2xl p-5 hover:bg-primary/5 group"><div className="flex items-center gap-4"><div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary text-primary group-hover:text-white transition-all"><SparklesIcon className="size-4" /></div><div className="flex flex-col"><span className="font-black text-xs uppercase tracking-widest">AI Problem Lab</span><span className="text-[9px] opacity-40 uppercase font-black">Infinite generation</span></div></div></Link></li>
                    </div>
                 </ul>
              </div>
            </div>
          </div>

          {/* R: STATUS & COMMAND CLUSTER */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <button onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))} className="btn btn-ghost btn-circle btn-sm">
                  <SearchIcon className="size-4 opacity-30" />
               </button>

               <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm">
                     <PaletteIcon className="size-4 opacity-30" />
                  </div>
                  <ul tabIndex={0} className="dropdown-content z-[200] menu p-5 shadow-3xl bg-base-100/98 backdrop-blur-3xl rounded-[32px] w-64 border border-white/5 mt-4 gap-2">
                     <header className="text-center py-2 mb-2 border-b border-white/5">
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
               
               <div className="ml-4 pl-6 border-l border-white/10 scale-[1.1]">
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
