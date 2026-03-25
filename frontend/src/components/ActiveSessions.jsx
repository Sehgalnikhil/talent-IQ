import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";
import { getDifficultyBadgeClass } from "../lib/utils";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <div className="h-full bg-base-100/40 backdrop-blur-3xl border border-white/5 rounded-[50px] overflow-hidden shadow-2xl relative">
       <div className="p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/40 shadow-lg">
                   <ZapIcon className="size-6 text-primary animate-pulse" />
                </div>
                <div>
                   <h3 className="text-xl font-black tracking-widest">LIVE_GRID</h3>
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Synchronized_Active</span>
                </div>
             </div>
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20">
                <div className="size-2 bg-success rounded-full animate-ping" />
                <span className="text-[9px] font-black text-success uppercase tracking-widest">{sessions.length} ACTIVE</span>
             </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2 no-scrollbar">
             {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-40">
                   <LoaderIcon className="size-10 animate-spin text-primary" />
                   <p className="text-[10px] font-black uppercase tracking-widest mt-4">DECRYPTING_NODES...</p>
                </div>
             ) : sessions.length > 0 ? (
                sessions.map((session) => (
                   <div key={session._id} className="group p-5 bg-white/5 border border-white/5 rounded-3xl transition-all duration-300 hover:bg-white/10 hover:border-primary/40 shadow-xl">
                      <div className="flex items-center justify-between gap-4">
                         <div className="flex items-center gap-5 min-w-0">
                            <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/40 to-secondary/10 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                               <Code2Icon className="size-7 text-white" />
                            </div>
                            <div className="min-w-0">
                               <div className="flex items-center gap-3 mb-1">
                                  <h4 className="font-black text-lg truncate">{session.problem}</h4>
                                  <span className={`badge badge-xs font-black uppercase tracking-widest ${getDifficultyBadgeClass(session.difficulty)}`}>{session.difficulty}</span>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-black opacity-30 uppercase tracking-widest">
                                   <div className="flex items-center gap-1.5"><CrownIcon className="size-3" /> {session.host?.name}</div>
                                   <div className="flex items-center gap-1.5"><UsersIcon className="size-3" /> {session.participant ? "2/2" : "1/2"}</div>
                                </div>
                            </div>
                         </div>

                         <Link to={`/session/${session._id}`} className="btn btn-primary btn-sm rounded-xl font-black px-6 shadow-lg shadow-primary/30">
                            {isUserInSession(session) ? "REJOIN" : "JOIN"}
                         </Link>
                      </div>
                   </div>
                ))
             ) : (
                <div className="text-center py-20 opacity-40">
                   <SparklesIcon className="size-12 mx-auto mb-4 text-primary/40" />
                   <p className="text-sm font-black uppercase tracking-[0.2em]">No Active Nodes Found</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
export default ActiveSessions;
