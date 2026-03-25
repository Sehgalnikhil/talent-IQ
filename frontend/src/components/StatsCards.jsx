import { TrophyIcon, UsersIcon, ZapIcon } from "lucide-react";
import { motion } from "framer-motion";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 h-full">
      {/* Active Count Node */}
      <div className="group relative overflow-hidden bg-base-100/40 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-2xl transition-all hover:bg-white/5 hover:border-primary/40">
        <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:scale-110 transition-transform">
           <div className="size-20 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        </div>
        <div className="flex flex-col justify-between h-full space-y-8 relative z-10">
           <div className="flex items-center justify-between">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg">
                 <UsersIcon className="size-7 text-primary" />
              </div>
              <div className="flex items-center gap-2 group-hover:scale-110 transition-transform">
                 <div className="size-2 rounded-full bg-success animate-ping" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-success">SYNCHRONIZED_ACTIVE</span>
              </div>
           </div>
           <div>
              <p className="text-6xl font-black tracking-tighter">{activeSessionsCount}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mt-1">Live Global Consensus Sessions</p>
           </div>
        </div>
      </div>

      {/* Persistence Count Node */}
      <div className="group relative overflow-hidden bg-base-100/40 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-2xl transition-all hover:bg-white/5 hover:border-secondary/40">
        <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:scale-110 transition-transform">
           <div className="size-20 rounded-full bg-secondary/20 blur-3xl animate-pulse" />
        </div>
        <div className="flex flex-col justify-between h-full space-y-8 relative z-10">
           <div className="flex items-center justify-between">
              <div className="size-14 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-lg">
                 <TrophyIcon className="size-7 text-secondary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">PERMANENT_RECORD_SYNC</span>
           </div>
           <div>
              <p className="text-6xl font-black tracking-tighter">{recentSessionsCount}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mt-1">Total Sovereignty Encounters</p>
           </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
