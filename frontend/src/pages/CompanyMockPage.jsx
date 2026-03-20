import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router";
import { BuildingIcon, LockIcon, TimerIcon, PlayIcon, ShieldAlertIcon } from "lucide-react";
import toast from "react-hot-toast";

const COMPANIES = [
    { id: "meta", name: "Meta", logo: "Ⓜ️", timeLimit: 45, problemCount: 2, problems: "two-sum,valid-anagram", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { id: "google", name: "Google", logo: "🇬", timeLimit: 45, problemCount: 2, problems: "reverse-linked-list,longest-substring", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
    { id: "amazon", name: "Amazon", logo: "🅰️", timeLimit: 60, problemCount: 2, problems: "two-sum,valid-parentheses", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { id: "netflix", name: "Netflix", logo: "🇳", timeLimit: 60, problemCount: 1, problems: "longest-substring", color: "text-red-600", bg: "bg-red-600/10", border: "border-red-600/20" },
    { id: "apple", name: "Apple", logo: "🍎", timeLimit: 45, problemCount: 2, problems: "valid-anagram,reverse-linked-list", color: "text-base-content", bg: "bg-base-300", border: "border-base-content/20" },
];

export default function CompanyMockPage() {
    const navigate = useNavigate();
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [agreed, setAgreed] = useState(false);

    const startMockAssessment = () => {
        if (!agreed) return toast.error("You must agree to the assessment rules.");
        toast.success(`Starting ${selectedCompany.name} Assessment! Good luck!`);
        
        const problemList = selectedCompany.problems;
        const firstProblem = problemList.split(',')[0];
        navigate(`/problem/${firstProblem}?strictMode=true&company=${selectedCompany.id}&timeLimit=${selectedCompany.timeLimit}&mockList=${problemList}`);
    };

    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            <Navbar />
            
            <div className="flex-1 max-w-5xl mx-auto w-full p-4 lg:p-8">
                <div className="mb-10 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
                        <BuildingIcon className="size-10 text-primary" />
                        Company Mock Assessments
                    </h1>
                    <p className="text-base-content/60">
                        Experience high-pressure, realistic interview environments. 
                        These 45-60 minute sessions are completely locked down—no AI hints, no external help, just you and the compiler.
                    </p>
                </div>

                {/* Company Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {COMPANIES.map((company) => (
                        <div 
                            key={company.id}
                            onClick={() => { setSelectedCompany(company); setAgreed(false); }}
                            className={`card bg-base-100 border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                                selectedCompany?.id === company.id ? `border-primary shadow-primary/20` : company.border
                            }`}
                        >
                            <div className={`card-body items-center text-center p-6 ${selectedCompany?.id === company.id ? company.bg : ''}`}>
                                <div className="text-5xl mb-2">{company.logo}</div>
                                <h2 className={`card-title text-2xl font-bold ${company.color}`}>{company.name}</h2>
                                
                                <div className="flex gap-4 mt-4 text-sm font-semibold text-base-content/60">
                                    <div className="flex items-center gap-1">
                                        <TimerIcon className="size-4" /> {company.timeLimit} mins
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <LockIcon className="size-4" /> {company.problemCount} Qs
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Selected Action Panel */}
                {selectedCompany && (
                    <div className="card bg-base-100 shadow-2xl border border-warning/30 animate-in slide-in-from-bottom-8">
                        <div className="card-body">
                            <h3 className="card-title text-xl text-warning flex gap-2">
                                <ShieldAlertIcon className="size-6" />
                                {selectedCompany.name} Assessment Rules
                            </h3>
                            
                            <ul className="list-disc list-inside space-y-2 text-base-content/70 my-4 text-sm">
                                <li>You will have exactly <b>{selectedCompany.timeLimit} minutes</b> to complete <b>{selectedCompany.problemCount} algorithmic problems</b>.</li>
                                <li>The AI Assistant and Hint system will be <b>disabled</b>.</li>
                                <li>Tab switching and window blur detection are <b>active</b>. Leaving the page may automatically fail you.</li>
                                <li>Your code complexity and completion time will be strictly recorded to determine a Hire/No-Hire verdict.</li>
                            </ul>

                            <label className="label cursor-pointer justify-start gap-3 bg-base-200 p-4 rounded-xl">
                                <input 
                                    type="checkbox" 
                                    className="checkbox checkbox-warning" 
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                />
                                <span className="label-text font-semibold">I understand the rules and am ready to begin the {selectedCompany.timeLimit}-minute simulation.</span>
                            </label>

                            <div className="card-actions justify-end mt-4">
                                <button className="btn btn-ghost" onClick={() => setSelectedCompany(null)}>Cancel</button>
                                <button 
                                    className="btn btn-warning gap-2" 
                                    disabled={!agreed}
                                    onClick={startMockAssessment}
                                >
                                    <PlayIcon className="size-4" /> Start Interview Context
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
