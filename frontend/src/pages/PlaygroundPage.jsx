import Navbar from "../components/Navbar";
import { PlayIcon, CodeIcon, SettingsIcon } from "lucide-react";
import { useState } from "react";
import Editor from "@monaco-editor/react";

function PlaygroundPage() {
    const [htmlCode, setHtmlCode] = useState("<h1>Hello World</h1>\n<p>Start writing some HTML!</p>");
    const [cssCode, setCssCode] = useState("h1 {\n  color: #f43f5e;\n  font-family: sans-serif;\n}\n\np {\n  font-size: 16px;\n  color: #64748b;\n}");
    const [jsCode, setJsCode] = useState("console.log('Playground loaded!');\n\nconst heading = document.querySelector('h1');\nheading.addEventListener('click', () => {\n  heading.style.color = '#3b82f6';\n});");

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

    return (
        <div className="h-screen bg-base-300 flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col p-4 gap-4">
                {/* HEADER */}
                <div className="flex justify-between items-center bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-info/10 rounded-xl flex items-center justify-center text-info">
                            <CodeIcon className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Frontend Playground</h1>
                            <p className="text-xs text-base-content/60">HTML, CSS, and JS Sandbox</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm">
                            <SettingsIcon className="size-4" /> Embed
                        </button>
                        <button className="btn btn-primary shadow-sm btn-sm gap-2">
                            <PlayIcon className="size-4" /> Live Preview
                        </button>
                    </div>
                </div>

                {/* MAIN AREA */}
                <div className="flex-1 flex gap-4 overflow-hidden">
                    {/* EDITORS */}
                    <div className="w-1/2 flex flex-col gap-4">

                        <div className="flex-1 rounded-xl overflow-hidden border border-base-300 flex flex-col h-1/3 bg-base-200 shadow-sm">
                            <div className="bg-base-200 px-4 py-2 text-xs font-bold text-orange-500 uppercase flex items-center gap-2 border-b border-base-300">
                                <span className="w-3 h-3 rounded-full bg-orange-500/20 flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span></span>
                                HTML
                            </div>
                            <Editor
                                height="100%"
                                language="html"
                                value={htmlCode}
                                onChange={setHtmlCode}
                                theme="vs-dark"
                                options={{ minimap: { enabled: false } }}
                            />
                        </div>

                        <div className="flex-1 rounded-xl overflow-hidden border border-base-300 flex flex-col h-1/3 bg-base-200 shadow-sm">
                            <div className="bg-base-200 px-4 py-2 text-xs font-bold text-blue-500 uppercase flex items-center gap-2 border-b border-base-300">
                                <span className="w-3 h-3 rounded-full bg-blue-500/20 flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span></span>
                                CSS
                            </div>
                            <Editor
                                height="100%"
                                language="css"
                                value={cssCode}
                                onChange={setCssCode}
                                theme="vs-dark"
                                options={{ minimap: { enabled: false } }}
                            />
                        </div>

                        <div className="flex-1 rounded-xl overflow-hidden border border-base-300 flex flex-col h-1/3 bg-base-200 shadow-sm">
                            <div className="bg-base-200 px-4 py-2 text-xs font-bold text-yellow-500 uppercase flex items-center gap-2 border-b border-base-300">
                                <span className="w-3 h-3 rounded-full bg-yellow-500/20 flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span></span>
                                JS
                            </div>
                            <Editor
                                height="100%"
                                language="javascript"
                                value={jsCode}
                                onChange={setJsCode}
                                theme="vs-dark"
                                options={{ minimap: { enabled: false } }}
                            />
                        </div>

                    </div>

                    {/* IFRAME PREVIEW */}
                    <div className="w-1/2 bg-white rounded-xl border border-base-300 shadow-inner overflow-hidden flex flex-col">
                        <div className="bg-base-200 px-4 py-2 text-xs font-bold text-base-content/60 uppercase flex items-center gap-2 border-b border-base-300">
                            <PlayIcon className="size-4" /> Live Output
                        </div>
                        <iframe
                            srcDoc={combinedCode}
                            title="Output"
                            sandbox="allow-scripts"
                            className="w-full h-full border-0 flex-1 bg-white"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PlaygroundPage;
