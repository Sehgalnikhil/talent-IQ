import { motion } from "framer-motion";
import { Zap, Shield, Crown, Sparkles, CheckCircle2, ArrowRight, BrainCircuit, Cpu, Globe, Rocket } from "lucide-react";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useCredits } from "../hooks/useCredits";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { AnimatePresence } from "framer-motion";


const TIERS = [
    {
        id: "lite",
        name: "NEURAL_LITE",
        price: "0",
        credits: "5,000",
        bonus: "Daily Refill",
        color: "from-slate-400 to-slate-600",
        icon: BrainCircuit,
        features: ["Standard AI Interview", "Basic Performance Analytics", "Community Support", "Standard Low-Latency"]
    },
    {
        id: "pro",
        name: "NEURAL_LINK",
        price: "449",
        credits: "25,000",
        bonus: "+5,000 Bonus",
        color: "from-primary to-secondary",
        icon: Zap,
        popular: true,
        features: ["Priority Neural Queuing", "Unlimited Custom Problems", "Detailed Neural Dossiers", "24/7 Priority Support"]
    },
    {
        id: "elite",
        name: "NEURAL_CORE",
        price: "1499",
        credits: "100,000",
        bonus: "Unlimited Validity",
        color: "from-secondary to-accent",
        icon: Crown,
        features: ["Exclusive Expert Archetypes", "Full Portfolio Export (PDF/MD)", "Advanced Biometric Tracking", "Early Access to Beta Nodes"]
    }
];


function PricingPage() {
    const { balance, createOrder, verifyPayment, isVerifying } = useCredits();
    const [selectedTier, setSelectedTier] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [purchasedTier, setPurchasedTier] = useState(null);
    const navigate = useNavigate();


    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePurchase = async (tier) => {
        if (tier.price === "0") {
            toast.error("You already have access to the Lite tier.");
            return;
        }

        const res = await loadRazorpay();
        if (!res) {
            toast.error("Razorpay SDK failed to load. Check your internet connection.");
            return;
        }

        try {
            const amount = parseInt(tier.price);
            const order = await createOrder(amount);
            
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
                amount: order.amount,
                currency: order.currency,
                name: "TalentIQ",
                description: `Purchase ${tier.credits} SCARLET Credits`,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        const verificationData = {
                            ...response,
                            amount,
                            credits: tier.credits.replace(/,/g, '')
                        };
                        await verifyPayment(verificationData);
                        setPurchasedTier(tier);
                        setShowSuccessModal(true);
                    } catch (err) {

                        toast.error("Payment Verification Failed.");
                    }
                },
                prefill: {
                    name: "Candidate",
                    email: "support@talentiq.ai"
                },
                theme: {
                    color: "#8F00FF"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Razorpay Error:", err);
            toast.error("Failed to initialize transaction.");
        }
    };


    return (
        <div className="min-h-screen bg-base-300 text-base-content font-sans selection:bg-primary/30">
            <Navbar />
            
            {/* AMBIENT BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden h-full">
                <div className="absolute top-1/4 right-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[160px] animate-pulse" />
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-40 pb-32 relative z-10">
                
                {/* HERO */}
                <div className="text-center space-y-6 mb-24">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest"
                    >
                        <Sparkles className="size-3" />
                        Neural_Node_Expansion
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-7xl font-black italic tracking-tighter bg-gradient-to-r from-base-content via-base-content to-base-content/40 bg-clip-text text-transparent"
                    >
                        POWER YOUR GROWTH_
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base-content/50 max-w-2xl mx-auto text-sm font-medium uppercase tracking-widest leading-relaxed"
                    >
                        Scale your interview prep with Scarlet Credits. <br />
                        Deploy high-availability AI models for your career success.
                    </motion.p>
                </div>

                {/* CURRENT BALANCE WIDGET */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center mb-16"
                >
                    <div className="px-10 py-6 rounded-[32px] bg-base-100/50 border border-base-content/10 backdrop-blur-3xl flex items-center gap-8 shadow-2xl">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 mb-1 leading-none">CURRENT_SYNCHRONIZED_BALANCE</span>
                            <span className="text-3xl font-black italic text-primary">{balance?.toLocaleString()} <span className="text-sm opacity-40">SCARLET</span></span>
                        </div>
                        <div className="h-10 w-px bg-base-content/10" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 mb-1 leading-none">NEURAL_STABILITY</span>
                            <div className="flex gap-1">
                                {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-1.5 bg-success rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />)}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* TIERS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {TIERS.map((tier, idx) => (
                        <motion.div
                            key={tier.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                            className={`group relative p-1 rounded-[48px] transition-all duration-500 hover:scale-[1.02] ${tier.popular ? 'bg-gradient-to-br from-primary via-secondary to-accent shadow-2xl shadow-primary/20' : 'bg-base-content/10 hover:bg-base-content/20'}`}
                        >
                            <div className="h-full w-full bg-base-100 rounded-[44px] p-10 flex flex-col items-start overflow-hidden relative">
                                {/* TIER SHIMMER */}
                                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${tier.color} opacity-[0.03] blur-[100px] pointer-events-none group-hover:opacity-[0.08] transition-all duration-700`} />

                                {tier.popular && (
                                    <div className="absolute top-8 right-8 px-4 py-1.5 rounded-full bg-primary text-primary-content text-[9px] font-black uppercase tracking-widest shadow-xl">MOST_DEPLOYED</div>
                                )}

                                <div className={`size-16 rounded-[22px] bg-gradient-to-br ${tier.color} flex items-center justify-center mb-10 shadow-xl ring-8 ring-base-content/5`}>
                                    <tier.icon className="size-8 text-white" />
                                </div>

                                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-base-content/40 mb-2">{tier.name}</h3>
                                <div className="flex items-baseline gap-2 mb-8">
                                    <span className="text-5xl font-black italic tracking-tighter">₹{tier.price}</span>
                                    <span className="text-base-content/30 text-[10px] font-black uppercase">/ node sync</span>
                                </div>


                                <div className="space-y-6 mb-12 w-full">
                                    <div className="p-4 rounded-2xl bg-base-content/5 border border-base-content/5 flex items-center justify-between group-hover:border-primary/20 transition-all">
                                        <span className="text-xs font-black uppercase opacity-40">Sync_Credits</span>
                                        <span className="text-xl font-black italic text-primary">{tier.credits}</span>
                                    </div>
                                    {tier.bonus && (
                                        <p className="text-[10px] font-black uppercase tracking-widest text-success px-2">{tier.bonus}</p>
                                    )}
                                </div>

                                <div className="space-y-4 mb-20 flex-1">
                                    {tier.features.map(f => (
                                        <div key={f} className="flex gap-4 items-center group/item transition-all">
                                            <div className="size-5 rounded-full bg-base-content/5 flex items-center justify-center border border-base-content/10 group-hover/item:border-primary/40 transition-all">
                                                <CheckCircle2 className="size-3 opacity-40 group-hover/item:opacity-100 transition-all text-primary" />
                                            </div>
                                            <span className="text-[11px] font-bold text-base-content/50 group-hover/item:text-white transition-all">{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    onClick={() => handlePurchase(tier)}
                                    disabled={isVerifying}
                                    className={`w-full h-20 rounded-[28px] font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-500 overflow-hidden relative group/btn ${tier.popular ? 'bg-primary text-primary-content hover:scale-[0.98]' : 'bg-base-content/5 hover:bg-base-content/10 border border-base-content/10'}`}
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                                    {isVerifying ? "SYNCHRONIZING..." : "SYNCHRONIZE_NOW"}
                                    <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>

                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ / SECURITY FOOTER */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-base-content/10 pt-20"
                >
                    {[
                        { icon: Shield, title: "SECURE_GATEWAY", desc: "Military-grade 256-bit AES encryption." },
                        { icon: Globe, title: "LATENCY_SYNC", desc: "Edge-distributed nodes for zero lag." },
                        { icon: Cpu, title: "AUTO_REFILL", desc: "Neural links refreshed every 24h." },
                        { icon: Rocket, title: "INSTANT_BOOST", desc: "Immediate access to compute nodes." }
                    ].map(item => (
                        <div key={item.title} className="text-center space-y-3">
                            <item.icon className="size-6 text-primary/40 mx-auto" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">{item.title}</h4>
                            <p className="text-[9px] font-bold opacity-30 uppercase tracking-tighter leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </motion.div>

            </div>

            {/* SUCCESS MODAL */}
            <AnimatePresence>
                {showSuccessModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSuccessModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-base-100 border border-primary/30 rounded-[48px] p-12 overflow-hidden shadow-[0_0_100px_rgba(var(--color-primary),0.2)]"
                        >
                            {/* AMBIENT EFFECTS */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                            <div className="absolute -top-24 -right-24 size-64 bg-primary/20 rounded-full blur-[80px]" />
                            
                            <div className="relative z-10 text-center space-y-8">
                                <div className="size-24 bg-gradient-to-br from-primary to-secondary rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-primary/40 rotate-12">
                                    <Sparkles className="size-12 text-white animate-pulse" />
                                </div>
                                
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black italic tracking-tighter text-white">NODES_SYNCHRONIZED_</h2>
                                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/40">Neural Link Established Successfully</p>
                                </div>

                                <div className="p-8 rounded-3xl bg-base-content/5 border border-base-content/10 space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                                        <span>TIER_DEPLOYED</span>
                                        <span>SYNC_NODES</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-xl font-black italic text-primary">{purchasedTier?.name}</span>
                                        <span className="text-2xl font-black italic text-white">+{purchasedTier?.credits}</span>
                                    </div>
                                </div>

                                <div className="pt-6 space-y-4">
                                    <button 
                                        onClick={() => navigate("/interview")}
                                        className="w-full h-20 bg-primary text-primary-content rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                                    >
                                        DEPLOY TO ARENA NOW
                                        <ArrowRight className="size-4" />
                                    </button>
                                    <button 
                                        onClick={() => setShowSuccessModal(false)}
                                        className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white/40 transition-colors"
                                    >
                                        RETURN_TO_DASHBOARD
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default PricingPage;
