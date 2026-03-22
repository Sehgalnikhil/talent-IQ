import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router";
import { BuildingIcon, LockIcon, TimerIcon, PlayIcon, ShieldAlertIcon, AwardIcon, CheckCircleIcon } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const COMPANIES = [
    { id: "meta", name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg", timeLimit: 45, problemCount: 2, problems: "two-sum,valid-anagram", color: "from-blue-600 to-sky-400", bg: "bg-blue-500/10", glow: "shadow-blue-500/10" },
    { id: "google", name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg", timeLimit: 45, problemCount: 2, problems: "reverse-linked-list,longest-substring", color: "from-red-500 to-yellow-500", bg: "bg-red-500/10", glow: "shadow-red-500/10" },
    { id: "amazon", name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg", timeLimit: 60, problemCount: 2, problems: "two-sum,valid-parentheses", color: "from-amber-500 to-orange-400", bg: "bg-amber-500/10", glow: "shadow-amber-500/10" },
    { id: "netflix", name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Netflix_2015_N_logo.svg", timeLimit: 60, problemCount: 1, problems: "longest-substring", color: "from-red-700 to-red-500", bg: "bg-red-600/10", glow: "shadow-red-600/10" },
    { id: "apple", name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", timeLimit: 45, problemCount: 2, problems: "valid-anagram,reverse-linked-list", color: "from-slate-400 to-slate-200", bg: "bg-base-300", glow: "shadow-slate-500/10" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function CompanyMockPage() {
    const navigate = useNavigate();
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [agreed, setAgreed] = useState(false);
    const [pastMocks, setPastMocks] = useState([]);

    useState(() => {
       setPastMocks(JSON.parse(localStorage.getItem("pastMocks") || "[]"));
    }, []);

    const startMockAssessment = () => {
        if (!agreed) return toast.error("You must agree to the assessment rules.");
        toast.success(`Starting ${selectedCompany.name} Assessment! Good luck!`);
        
        const problemList = selectedCompany.problems;
        const firstProblem = problemList.split(',')[0];
        navigate(`/problem/${firstProblem}?strictMode=true&company=${selectedCompany.id}&timeLimit=${selectedCompany.timeLimit}&mockList=${problemList}`);
    };

    return (
        <div className="min-h-screen bg-base-200 flex flex-col relative overflow-hidden">
            <Navbar />
            
            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 size-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 size-96 bg-secondary/10 rounded-full blur-3xl -z-10" />

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex-1 max-w-5xl mx-auto w-full p-4 lg:p-8 relative z-10"
            >
                <motion.div variants={cardVariants} className="mb-12 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl lg:text-5xl font-black mb-4 flex items-center justify-center gap-3">
                        <BuildingIcon className="size-11 text-primary animate-bounce" />
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Mock Assessments
                        </span>
                    </h1>
                    <p className="text-base-content/60 font-medium leading-relaxed">
                        Experience high-pressure realism. These absolute locked-down environments strictly gauge Time, Operations, and behavioral logic absolute flawed flawlessly.
                    </p>
                </motion.div>

                {/* Company Grid */}
                <motion.div 
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                >
                    {COMPANIES.map((company) => (
                        <motion.div 
                            key={company.id}
                            variants={cardVariants}
                            whileHover={{ scale: 1.03, translateY: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { setSelectedCompany(company); setAgreed(false); }}
                            className={`card bg-base-100/60 backdrop-blur-xl border border-white/5 cursor-pointer shadow-sm relative overflow-hidden transition-all duration-300 ${
                                selectedCompany?.id === company.id 
                                ? `ring-2 ring-primary ${company.glow}` 
                                : 'hover:shadow-md'
                            }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br opacity-5 -z-10" />
                            <div className="card-body items-center text-center p-6">
                                <div className="size-16 rounded-2xl bg-white flex items-center justify-center p-3 mb-3 shadow-md border border-white/10 relative">
                                    <img src={company.logo} alt={company.name} className="size-10 object-contain" />
                                </div>
                                <h2 className={`card-title text-xl font-black bg-gradient-to-r ${company.color} bg-clip-text text-transparent`}>
                                    {company.name} Mode
                                </h2>
                                
                                <div className="flex gap-4 mt-4 text-xs font-black text-base-content/40 uppercase tracking-wider">
                                    <div className="flex items-center gap-1.5 p-1 px-2.5 rounded-lg bg-base-200/50">
                                        <TimerIcon className="size-3 text-primary" /> {company.timeLimit} mins
                                    </div>
                                    <div className="flex items-center gap-1.5 p-1 px-2.5 rounded-lg bg-base-200/50">
                                        <LockIcon className="size-3 text-secondary" /> {company.problemCount} Qs
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Past Attempts Table trigger Node flawlessly setups */}
                {pastMocks.length > 0 && (
                    <motion.div variants={cardVariants} className="mt-12 bg-base-100/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-xl max-w-4xl mx-auto w-full">
                        <h2 className="text-xl font-black mb-4 flex items-center gap-2 text-base-content/80">
                            <CheckCircleIcon className="size-5 text-success animate-pulse" /> Your Recent Mock Screening Verdicts
                        </h2>
                        <span className="text-xs text-base-content/50 block mb-3 font-semibold">Track your readiness for real technical interviews nodes!</span>
                        <div className="overflow-hidden rounded-2xl border border-white/5 bg-base-200/30">
                            <table className="table w-full">
                                <thead>
                                    <tr className="border-b border-white/5 text-xs font-black uppercase text-base-content/50 bg-base-300/40 p-3">
                                        <th>Company</th>
                                        <th>Verdict</th>
                                        <th>Score</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pastMocks.sort((a,b) => b.timestamp - a.timestamp).map((mock, idx) => (
                                        <tr key={idx} className="border-b border-white/5 hover:bg-base-200/50 cursor-pointer transition-colors">
                                            <td className="font-bold text-sm tracking-wide">{mock.company}</td>
                                            <td>
                                                <span className={`badge badge-sm font-black border-none ${mock.verdict === "Strong Hire" ? "bg-success text-success-content" : "bg-error text-error-content"}`}>
                                                    {mock.verdict}
                                                </span>
                                            </td>
                                            <td className="font-mono text-xs font-black">{mock.score}/100</td>
                                            <td className="text-xs opacity-60 font-semibold">{new Date(mock.timestamp).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* Selected Action Panel */}
                <AnimatePresence>
                    {selectedCompany && (
                        <motion.div 
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="card bg-base-100/80 backdrop-blur-2xl shadow-xl border border-warning/20 relative rounded-3xl overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-transparent -z-10" />
                            <div className="card-body p-8">
                                <h3 className="card-title text-2xl font-black text-warning flex items-center gap-2 mb-4">
                                    <ShieldAlertIcon className="size-8" />
                                    {selectedCompany.name} Screening Rules
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                                    {[
                                        { text: `You have ${selectedCompany.timeLimit} minutes to complete ${selectedCompany.problemCount} problems.`, icon: <TimerIcon className="size-5" /> },
                                        { text: "AI Assistant, hints and debuggers are strictly disabled.", icon: <LockIcon className="size-5" /> },
                                        { text: "Tab switching and window blur detection are active.", icon: <ShieldAlertIcon className="size-5" /> },
                                        { text: "Your verdict will determine a Hire/No-Hire verdict.", icon: <AwardIcon className="size-5" /> }
                                    ].map((rule, index) => (
                                        <div key={index} className="flex gap-3 bg-base-200/40 p-4 rounded-xl border border-white/5 items-start">
                                            <div className="size-8 rounded-lg bg-warning/10 flex items-center justify-center text-warning shrink-0 mt-0.5">
                                                {rule.icon}
                                            </div>
                                            <span className="text-sm font-semibold text-base-content/70 leading-relaxed">{rule.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <label className="label cursor-pointer justify-start gap-3 bg-warning/5 p-4 rounded-xl border border-warning/10 transition-colors hover:bg-warning/10">
                                    <input 
                                        type="checkbox" 
                                        className="checkbox checkbox-warning checkbox-sm" 
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                    />
                                    <span className="label-text font-black text-warning text-sm">I swear to follow standard interviewing ethical criteria.</span>
                                </label>

                                <div className="card-actions justify-end mt-6 gap-3">
                                    <button className="btn btn-ghost font-black" onClick={() => setSelectedCompany(null)}>Go Back</button>
                                    <button 
                                        className="btn btn-warning gap-2 px-8 font-black shadow-lg shadow-warning/20 hover:scale-105 active:scale-95 transition-all text-neutral" 
                                        disabled={!agreed}
                                        onClick={startMockAssessment}
                                    >
                                        <PlayIcon className="size-4 fill-current" /> Start Assessment
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
