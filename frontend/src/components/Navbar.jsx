import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon, TrophyIcon, SwordsIcon, PaletteIcon, SearchIcon, ChevronDownIcon } from "lucide-react";
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
      <div className={`max-w-[1400px] mx-auto rounded-[32px] transition-all duration-500 border relative overflow-hidden shadow-2xl ${scrolled ? 'bg-base-100/70 backdrop-blur-3xl border-white/10' : 'bg-transparent border-transparent'}`}>
        
        <div className="px-8 py-3 flex items-center justify-between relative z-10">
          
          {/* L: LOGO CLUSTER */}
          <div className="flex items-center gap-12">
            <Link to="/" className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105">
              <div className="size-11 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-[0_0_25px_rgba(var(--color-primary),0.4)] ">
                <SparklesIcon className="size-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter leading-none bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">Talent IQ</span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Neural Core</span>
              </div>
            </Link>

            {/* MAIN NAVIGATION NODES */}
            <div className="hidden xl:flex items-center gap-1">
              {[
                { label: "Problems", path: "/problems", icon: BookOpenIcon },
                { label: "Dashboard", path: "/dashboard", icon: LayoutDashboardIcon },
                { label: "Arena", path: "/speedrun", icon: SwordsIcon, color: "text-error" },
                { label: "Rankings", path: "/leaderboard", icon: TrophyIcon },
              ].map((node) => (
                <Link
                  key={node.path}
                  to={node.path}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-500 font-black text-[11px] uppercase tracking-widest border border-transparent ${
                    isActive(node.path)
                      ? "bg-primary text-primary-content shadow-[0_0_25px_rgba(var(--color-primary),0.4)]"
                      : `text-base-content/50 hover:bg-base-content/5 hover:text-base-content ${node.color || ""}`
                  }`}
                >
                  <node.icon className="size-4" />
                  <span>{node.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* R: ACTION CLUSTER */}
          <div className="flex items-center gap-6">
            
            {/* EXPLORE MEGA MENU NODE */}
            <div className="dropdown dropdown-hover">
               <div tabIndex={0} role="button" className="flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 font-black text-[11px] uppercase tracking-widest text-base-content/50 hover:bg-base-content/5 hover:text-base-content group">
                  <SparklesIcon className="size-4 group-hover:animate-pulse" />
                  <span>Explore</span>
                  <ChevronDownIcon className="size-3 opacity-30" />
               </div>
               <ul tabIndex={0} className="dropdown-content z-[150] menu p-5 shadow-2xl bg-base-100/95 backdrop-blur-3xl rounded-[40px] w-80 border border-white/10 mt-3 gap-3 -translate-x-1/2 left-1/2">
                  <header className="px-4 py-2">
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Neural Synchronization</span>
                  </header>
                  <div className="grid gap-2">
                    <li><Link to="/curated" className="rounded-2xl p-4 font-black text-xs hover:bg-primary/10">Curated Intelligence Tracks</Link></li>
                    <li><Link to="/whiteboard" className="rounded-2xl p-4 font-black text-xs hover:bg-primary/10">System Design Architecture</Link></li>
                    <li><Link to="/interview" className="rounded-2xl p-4 font-black text-xs bg-error/5 text-error hover:bg-error/20">AI Protocol Interview (LIVE)</Link></li>
                  </div>
               </ul>
            </div>

            <div className="h-6 w-px bg-base-content/10" />

            {/* UTILITY TOOLS */}
            <div className="flex items-center gap-2">
               <button onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))} className="btn btn-ghost btn-circle btn-sm">
                  <SearchIcon className="size-4 opacity-40" />
               </button>

               {/* THEME SELECTOR DROPDOWN */}
               <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm">
                     <PaletteIcon className="size-4 opacity-40" />
                  </div>
                  <ul tabIndex={0} className="dropdown-content z-[200] menu p-4 shadow-3xl bg-base-100/98 backdrop-blur-3xl rounded-[32px] w-56 border border-white/10 mt-4 gap-1">
                     <header className="text-center py-2 mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Command Theme</span>
                     </header>
                     <div className="grid grid-cols-1 gap-1">
                        {THEMES.map((theme) => (
                           <li key={theme}>
                              <button onClick={() => setCurrentTheme(theme)} className={`capitalize font-black text-xs rounded-xl py-2 justify-center ${currentTheme === theme ? "bg-primary text-primary-content" : "hover:bg-primary/10"}`}>
                                 {theme}
                              </button>
                           </li>
                        ))}
                     </div>
                  </ul>
               </div>

               <NotificationCenter />
               
               <div className="ml-4 pl-4 border-l border-white/10 scale-95 flex items-center">
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
