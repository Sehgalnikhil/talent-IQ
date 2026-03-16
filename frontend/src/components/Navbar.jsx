import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon, TrophyIcon, SwordsIcon, PaletteIcon, SearchIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import NotificationCenter from "./NotificationCenter";
import { useState, useEffect } from "react";

const THEMES = ["dark", "light", "dracula", "nord", "cyberpunk", "synthwave", "night", "sunset"];

function Navbar() {
  const location = useLocation();
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("talentiq-theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("talentiq-theme", currentTheme);
  }, [currentTheme]);

  const isActive = (path) => location.pathname === path;

  const handleCmdK = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
  };

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-3 hover:scale-105 transition-transform duration-200"
        >
          <div className="size-10 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg ">
            <SparklesIcon className="size-6 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
              Talent IQ
            </span>
            <span className="text-xs text-base-content/60 font-medium -mt-1">Code Together</span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {/* CMD+K SEARCH TRIGGER */}
          <button
            onClick={handleCmdK}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base-200/50 border border-base-300 hover:bg-base-200 transition-colors mr-2 text-base-content/50 text-sm"
          >
            <SearchIcon className="size-3.5" />
            <span>Search...</span>
            <kbd className="kbd kbd-xs ml-2">⌘K</kbd>
          </button>

          {/* PROBLEMS PAGE LINK */}
          <Link
            to={"/problems"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${isActive("/problems")
                ? "bg-primary text-primary-content"
                : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }`}
          >
            <div className="flex items-center gap-x-2.5">
              <BookOpenIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Problems</span>
            </div>
          </Link>

          {/* EXPLORE DROPDOWN */}
          <div className="dropdown dropdown-hover">
            <div tabIndex={0} role="button" className="px-4 py-2.5 rounded-lg transition-all duration-200 text-base-content/70 hover:bg-base-200 hover:text-base-content flex items-center gap-x-2.5">
              <SparklesIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Explore</span>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[100] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300 gap-1">
              <li>
                <Link to="/curated" className={isActive("/curated") ? "bg-primary text-primary-content" : ""}>
                  Curated Tracks
                </Link>
              </li>
              <li>
                <Link to="/interview" className={isActive("/interview") ? "bg-primary text-primary-content" : ""}>
                  AI Interview <span className="badge badge-primary badge-xs ml-2">PRO</span>
                </Link>
              </li>
              <li>
                <Link to="/whiteboard" className={isActive("/whiteboard") ? "bg-primary text-primary-content" : ""}>
                  System Design
                </Link>
              </li>
              <li>
                <Link to="/playground" className={isActive("/playground") ? "bg-primary text-primary-content" : ""}>
                  Code Sandbox
                </Link>
              </li>
              <li>
                <Link to="/generate" className={isActive("/generate") ? "bg-primary text-primary-content" : ""}>
                  AI Problem Generator <span className="badge badge-accent badge-xs ml-1">NEW</span>
                </Link>
              </li>
              <li>
                <Link to="/flashcards" className={isActive("/flashcards") ? "bg-primary text-primary-content" : ""}>
                  Smart Flashcards <span className="badge badge-success badge-xs ml-1">NEW</span>
                </Link>
              </li>
              <li>
                <Link to="/analyzer" className={isActive("/analyzer") ? "bg-primary text-primary-content" : ""}>
                  Code Analyzer <span className="badge badge-info badge-xs ml-1">LOCAL ML</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* DASHBOARD */}
          <Link
            to={"/dashboard"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${isActive("/dashboard")
                ? "bg-primary text-primary-content"
                : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }`}
          >
            <div className="flex items-center gap-x-2.5">
              <LayoutDashboardIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Dashboard</span>
            </div>
          </Link>

          {/* LEADERBOARD */}
          <Link
            to={"/leaderboard"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${isActive("/leaderboard")
                ? "bg-primary text-primary-content"
                : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }`}
          >
            <div className="flex items-center gap-x-2.5">
              <TrophyIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Leaderboard</span>
            </div>
          </Link>

          {/* SPEEDRUN */}
          <Link
            to={"/speedrun"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${isActive("/speedrun")
                ? "bg-error text-error-content shadow-lg shadow-error/20"
                : "hover:bg-base-200 text-base-content/70 hover:text-error hover:shadow-lg"
              }`}
          >
            <div className="flex items-center gap-x-2.5">
              <SwordsIcon className="size-4 animate-pulse" />
              <span className="font-medium hidden sm:inline">Speedrun</span>
            </div>
          </Link>

          {/* THEME SELECTOR — Feature #17 */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle">
              <PaletteIcon className="size-5" />
            </div>
            <ul tabIndex={0} className="dropdown-content z-[100] menu p-2 shadow-lg bg-base-100 rounded-box w-40 border border-base-300 gap-1">
              {THEMES.map((theme) => (
                <li key={theme}>
                  <button
                    onClick={() => setCurrentTheme(theme)}
                    className={`capitalize ${currentTheme === theme ? "bg-primary text-primary-content" : ""}`}
                  >
                    {theme}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* NOTIFICATION CENTER — Feature #18 */}
          <NotificationCenter />

          <div className="ml-4 mt-2">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
