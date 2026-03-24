import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon, SettingsIcon, RotateCcwIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";
import { loader } from "@monaco-editor/react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  fontSize,
  onFontSizeChange,
  isAskingAI,
  onGetAIHint,
  isRefactoring,
  onRefactorCode,
  isEvaluating,
  onEvaluateCode,
  isMock
}) {
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async (toLang) => {
      if (!code || isTranslating) return;
      setIsTranslating(true);
      try {
          const res = await axiosInstance.post("/interview/translate", { code, fromLanguage: selectedLanguage, toLanguage: toLang });
          if (res.data.code) {
               onCodeChange(res.data.code);
               onLanguageChange({ target: { value: toLang } });
               toast.success(`Ported to ${toLang}! 🔁`);
          }
      } catch (e) {
          toast.error("Code Port failed.");
      } finally {
          setIsTranslating(false);
      }
  };

  useEffect(() => {
    loader.init().then(monaco => {
        monaco.editor.defineTheme('talentiq-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [{ token: 'comment', foreground: '6272a4', fontStyle: 'italic' }],
            colors: {
                'editor.background': '#111317',
                'editor.lineHighlightBackground': '#181a1f',
                'editor.selectionBackground': '#44475a50',
                'editorCursor.foreground': '#00e3fd'
            }
        });
    });
  }, []);
  return (
    <div className="h-full bg-base-300 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-base-100 border-t border-base-300">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="size-6"
          />
          <select className="select select-sm" value={selectedLanguage} onChange={onLanguageChange}>
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>

          <div className="dropdown dropdown-bottom ml-1">
             <div tabIndex={0} role="button" className={`btn btn-xs btn-outline btn-info gap-1 flex items-center ${isTranslating ? "opacity-50 pointer-events-none" : ""}`}>
                {isTranslating ? <Loader2Icon className="size-3 animate-spin"/> : <RotateCcwIcon className="size-3" />} Translate
             </div>
             <ul tabIndex={0} className="dropdown-content z-[10] menu p-1 shadow bg-base-200 rounded-box w-36 border border-base-300 mt-1">
                {Object.entries(LANGUAGE_CONFIG).filter(([key]) => key !== selectedLanguage).map(([key, lang]) => (
                    <li key={key}>
                       <button onClick={() => handleTranslate(key)} className="text-xs p-1.5 flex items-center gap-1.5">
                          ➟ {lang.name}
                       </button>
                    </li>
                ))}
             </ul>
          </div>
          <div className="dropdown dropdown-bottom dropdown-end ml-2">
            <div tabIndex={0} role="button" className="btn btn-sm btn-ghost p-1 flex items-center justify-center">
              <SettingsIcon className="size-4" />
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40 border border-base-300 mt-2">
              <li className="menu-title px-2 py-1 text-xs">Font Size</li>
              <li>
                <div className="flex justify-between items-center py-1">
                  {[12, 14, 16, 18, 20].map((size) => (
                    <button
                      key={size}
                      onClick={() => onFontSizeChange(size)}
                      className={`btn btn-xs ${fontSize === size ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-2">
          {!isMock && onGetAIHint && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className={`btn btn-secondary btn-outline btn-sm gap-2 whitespace-nowrap hidden sm:flex ${isAskingAI || isRefactoring || isEvaluating ? 'opacity-70 pointer-events-none' : ''}`}>
                {isAskingAI || isRefactoring || isEvaluating ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    AI Thinking...
                  </>
                ) : (
                  <>✨ AI Tools</>
                )}
              </div>
              <ul tabIndex={0} className="dropdown-content z-[2] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300 mt-2">
                <li><button onClick={onGetAIHint} disabled={isAskingAI}>🐛 Debug & Hint</button></li>
                <li><button onClick={onRefactorCode} disabled={isRefactoring}>🧹 Refactor Code</button></li>
                <li><button onClick={onEvaluateCode} disabled={isEvaluating}>📊 Evaluate Score</button></li>
              </ul>
            </div>
          )}

          <button className="btn btn-primary btn-sm gap-2" disabled={isRunning} onClick={onRunCode}>
            {isRunning ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <PlayIcon className="size-4" />
                Run Code
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="talentiq-dark"
          options={{
            fontSize: fontSize || 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;
