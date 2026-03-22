import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon, SettingsIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

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
          theme="vs-dark"
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
