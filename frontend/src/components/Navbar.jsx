import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon, TrophyIcon, SwordsIcon, PaletteIcon, SearchIcon } from "lucide-react";
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
      <div className={`max-w-7xl mx-auto rounded-3xl transition-all duration-500 border relative overflow-hidden shadow-2xl ${scrolled ? 'bg-base-100/70 backdrop-blur-2xl border-white/10' : 'bg-transparent border-transparent'}`}>
        {/* LOGO & BRAND */}
        <div className="px-6 py-4 flex items-center justify-between relative z-10">
          <Link
            to="/"
            className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105"
          >
            <div className="size-10 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-[0_0_20px_rgba(var(--color-primary),0.3)] ">
              <SparklesIcon className="size-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent tracking-tighter">
                Talent IQ
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40 -mt-1">Neural Consensus</span>
            </div>
          </Link>

          {/* MAIN NAVIGATION NODES */}
          <div className="hidden lg:flex items-center gap-2">
            {[
              { label: "Problems", path: "/problems", icon: BookOpenIcon },
              { label: "Dashboard", path: "/dashboard", icon: LayoutDashboardIcon },
              { label: "Leaderboard", path: "/leaderboard", icon: TrophyIcon },
              { label: "Speedrun", path: "/speedrun", icon: SwordsIcon, color: "text-error" },
            ].map((node) => (
              <Link
                key={node.path}
                to={node.path}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 font-black text-xs uppercase tracking-widest border border-transparent ${
                  isActive(node.path)
                    ? "bg-primary text-primary-content shadow-[0_0_20px_rgba(var(--color-primary),0.4)]"
                    : `text-base-content/60 hover:bg-base-content/5 hover:text-base-content ${node.color || ""}`
                }`}
              >
                <node.icon className="size-4" />
                <span>{node.label}</span>
              </Link>
            ))}

            {/* EXPLORE DROPDOWN */}
            <div className="dropdown dropdown-hover">
               <div tabIndex={0} role="button" className="flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 font-black text-xs uppercase tracking-widest text-base-content/60 hover:bg-base-content/5 hover:text-base-content">
                  <SparklesIcon className="size-4" />
                  <span>Explore</span>
               </div>
               <ul tabIndex={0} className="dropdown-content z-[100] menu p-3 shadow-2xl bg-base-100/95 backdrop-blur-2xl rounded-[32px] w-72 border border-white/10 mt-2 gap-2">
                  <li className="menu-title text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 px-4 py-2">Neural Tracks</li>
                  <li><Link to="/curated" className="rounded-xl font-bold">Curated Paths</Link></li>
                  <li><Link to="/whiteboard" className="rounded-xl font-bold">System Design</Link></li>
                  <li><Link to="/playground" className="rounded-xl font-bold">Sync Sandbox</Link></li>
                  <li className="menu-title text-[9px] font-black uppercase tracking-[0.4em] text-error/60 px-4 py-2 mt-4">Combat Simulation</li>
                  <li><Link to="/interview" className="rounded-xl font-bold bg-error/5 text-error">AI Neural Interview</Link></li>
                  <li><Link to="/voice-interview" className="rounded-xl font-bold">Vocal Auth Session</Link></li>
               </ul>
            </div>
          </div>

          {/* ACTION CLUSTER */}
          <div className="flex items-center gap-3">
             <button onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))} className="btn btn-ghost btn-circle btn-sm">
                <SearchIcon className="size-4 opacity-40" />
             </button>

             <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm">
                   <PaletteIcon className="size-4 opacity-40" />
                </div>
                <ul tabIndex={0} className="dropdown-content z-[100] menu p-3 shadow-2xl bg-base-100/95 backdrop-blur-2xl rounded-3xl w-48 border border-white/10 mt-2">
                   <li className="menu-title text-[9px] font-black uppercase tracking-widest opacity-40 text-center mb-2">INTERFACE THEME</li>
                   {THEMES.map((theme) => (
                      <li key={theme}>
                         <button onClick={() => setCurrentTheme(theme)} className={`capitalize font-bold rounded-xl ${currentTheme === theme ? "bg-primary text-primary-content" : "hover:bg-primary/10"}`}>
                            {theme}
                         </button>
                      </li>
                   ))}
                </ul>
             </div>

             <div className="w-px h-6 bg-base-content/10 mx-2" />
             
             <NotificationCenter />
             <div className="ml-2 scale-90">
                <UserButton appearance={{ elements: { userButtonAvatarBox: "size-9 rounded-xl overflow-hidden shadow-lg" } }} />
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
