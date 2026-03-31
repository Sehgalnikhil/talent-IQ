import Navbar from "../components/Navbar";
import { PlayIcon, CodeIcon, SettingsIcon, TerminalIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

function PlaygroundPage() {
    const [htmlCode, setHtmlCode] = useState("<h1>Hello World</h1>\n<p>Start writing some HTML!</p>");
    const [cssCode, setCssCode] = useState("h1 {\n  color: #f43f5e;\n  font-family: sans-serif;\n}\n\np {\n  font-size: 16px;\n  color: #64748b;\n}");
    const [jsCode, setJsCode] = useState("console.log('Playground loaded!');\n\nconst heading = document.querySelector('h1');\nheading.addEventListener('click', () => {\n  heading.style.color = '#3b82f6';\n});");
    
    const [activeTab, setActiveTab] = useState("html");

    const combinedCode = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
       <style>${cssCode}</style>
    </head>
    <body style="font-family: system-ui, sans-serif; padding: 1rem;">
       ${htmlCode}
       <script>${jsCode}</script>
    </body>
    </html>
    `;

    const tabs = [
        { id: "html", label: "HTML", color: "text-orange-500", dot: "bg-orange-500" },
        { id: "css", label: "CSS", color: "text-blue-500", dot: "bg-blue-500" },
        { id: "js", label: "JavaScript", color: "text-yellow-500", dot: "bg-yellow-500" }
    ];

    const [liveCode, setLiveCode] = useState(combinedCode);

    const handleRunPreview = () => {
        setLiveCode(combinedCode);
        toast.success("Preview Updated! 🚀", { icon: "🚀" });
    };

    const handleEmbed = () => {
        const embedCode = `<iframe src="${window.location.origin}/playground" width="100%" height="500px" style="border:none; border-radius:12px; overflow:hidden;" sandbox="allow-scripts"></iframe>`;
        navigator.clipboard.writeText(embedCode);
        toast.success("Embed Code Copied to Clipboard! 📋", { icon: "📋" });
    };

    return (
        <div className="h-screen bg-base-300 flex flex-col overflow-hidden text-base-content selection:bg-primary/30 pt-24">
            <Navbar />

            {/* Background Accents */}
            <div className="absolute inset-x-0 top-16 bottom-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
            </div>

            <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden relative z-10">
                {/* HEADER */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center bg-base-100/60 backdrop-blur-xl p-4 rounded-2xl border border-white/5 shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                            <CodeIcon className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black bg-gradient-to-r from-white to-base-content/80 bg-clip-text text-transparent">Frontend Playground</h1>
                            <p className="text-[11px] uppercase tracking-widest font-black text-base-content/40 mt-0.5">Static sandbox environment</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={handleEmbed} className="btn btn-ghost btn-sm rounded-xl gap-2 font-bold hover:bg-base-200">
                            <SettingsIcon className="size-4" /> Embed
                        </button>
                        <button onClick={handleRunPreview} className="btn btn-primary shadow-lg shadow-primary/20 btn-sm rounded-xl gap-2 font-bold px-4">
                            <PlayIcon className="size-4" /> Run Preview
                        </button>
                    </div>
                </motion.div>

                {/* MAIN AREA */}
                <div className="flex-1 flex gap-4 overflow-hidden">
                    {/* EDITORS - Glassy tabbed container */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="w-1/2 flex flex-col rounded-2xl border border-white/5 bg-base-100/40 backdrop-blur-xl overflow-hidden shadow-sm"
                    >
                        {/* Custom Tabs Navigation bar */}
                        <div className="bg-base-100/80 border-b border-white/5 px-2 flex justify-between items-center h-12 sticky top-0 z-20 backdrop-blur-md">
                            <div className="flex gap-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative px-4 h-full flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${activeTab === tab.id ? tab.color : "text-base-content/40 hover:text-base-content/70"}`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${tab.dot} shadow-md`} />
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <motion.div 
                                                layoutId="playgroundTab"
                                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="px-4 text-[11px] font-bold text-base-content/30 flex items-center gap-1.5">
                                <TerminalIcon className="size-3.5" /> Workspace
                            </div>
                        </div>

                        {/* Editor Canvas Container */}
                        <div className="flex-1 w-full h-full relative overflow-hidden bg-[#1e1e1e]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute inset-0 w-full h-full"
                                >
                                    <Editor
                                        height="100%"
                                        language={activeTab === "js" ? "javascript" : activeTab}
                                        value={activeTab === "html" ? htmlCode : activeTab === "css" ? cssCode : jsCode}
                                        onChange={(val) => {
                                            if (activeTab === "html") setHtmlCode(val);
                                            else if (activeTab === "css") setCssCode(val);
                                            else setJsCode(val);
                                        }}
                                        theme="vs-dark"
                                        options={{ 
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbersMinChars: 3,
                                            scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 }
                                        }}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* IFRAME PREVIEW - Floating layout frame */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-1/2 bg-white rounded-2xl border border-white/5 shadow-2xl overflow-hidden flex flex-col relative"
                    >
                        <div className="bg-slate-100 border-b border-slate-200 px-4 h-12 text-xs font-black text-slate-500 uppercase flex items-center justify-between sticky top-0 z-10">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                </div>
                                <span className="ml-2">Preview Browser</span>
                            </div>
                            <SparklesIcon className="size-4 animate-pulse text-slate-400" />
                        </div>
                        <iframe
                             srcDoc={liveCode}
                            title="Output"
                            sandbox="allow-scripts"
                            className="w-full h-full border-0 flex-1 bg-white"
                        />
                    </motion.div>

                </div>
            </div>
        </div>
    );
}

export default PlaygroundPage;
