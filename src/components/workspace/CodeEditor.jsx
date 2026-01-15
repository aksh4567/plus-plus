"use client";

import Editor from "@monaco-editor/react";
import { defineMonacoTheme } from "../../lib/monaco-themes";
import { CloudUpload, CodeXml, Play } from "lucide-react";
export default function CodeEditor({
  language,
  setLanguage,
  code,
  setCode,
  theme,
  isRunning,
  onRun,
  onSubmit,
}) {
  const handleEditorWillMount = (monaco) => {
    defineMonacoTheme(monaco);
  };

  // Monaco languages (separate from your DB/Judge0 maps)
  const monacoLanguageMap = {
    javascript: "javascript",
    java: "java",
    cpp: "cpp",
  };

  return (
    <div className="flex flex-col overflow-hidden h-full rounded-xl border-2 border-lc-border">
      {/* Toolbar */}
      <div className="flex items-center w-full px-1 overflow-x-auto  h-9 bg-code-bg-tertiary scrollbar-hide">
        <div className="text-code-text-primary text-sm flex gap-1.5 items-center px-3 py-1.5 font-bold ">
          <CodeXml className="w-3.5 h-3.5 text-green-500" />
          Code
        </div>

        <div className="flex items-center gap-2 flex-1 justify-center-safe">
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1 bg-code-bg-primary border border-code-border rounded-md text-code-text-primary hover:bg-code-accent hover:border-code-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Run</span>
          </button>

          <button
            onClick={onSubmit}
            disabled={isRunning}
            className="bg-green-600 flex items-center gap-2 px-4 py-1 text-white rounded-md hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
          >
            <CloudUpload className="w-4 h-4" />
            <span>Submit</span>
          </button>
        </div>
      </div>
      <div className="bg-code-bg-primary px-5 py-3 flex items-center gap-4 shrink-0 h-9 border-b border-lc-border">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className=" bg-code-bg-primary rounded-lg text-code-text-primary cursor-pointer text-sm focus:outline-none focus:ring-0"
        >
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 bg-lc-body overflow-hidden shadow-sm">
        <Editor
          height="100%"
          language={monacoLanguageMap[language] || "javascript"}
          theme={theme === "dark" ? "leetcode-dark" : "leetcode-light"}
          value={code}
          onChange={(value) => setCode(value || "")}
          beforeMount={handleEditorWillMount}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 },
            wordWrap: "on",
            lineNumbersMinChars: 3,
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
}
