"use client";

import Editor from "@monaco-editor/react";
import { defineMonacoTheme } from "../../lib/monaco-themes";
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
    <div className="flex flex-col overflow-hidden h-full">
      {/* Toolbar */}
      <div className="bg-code-bg-secondary px-5 py-3 border-b border-code-border flex items-center gap-4 shrink-0">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 bg-code-bg-tertiary border border-code-border rounded-lg text-code-text-primary cursor-pointer text-sm"
        >
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>

        <button
          onClick={onRun}
          disabled={isRunning}
          className="px-5 py-2 bg-code-bg-tertiary border border-code-border rounded-lg text-code-text-primary hover:bg-code-accent hover:border-code-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
        >
          ▶ Run
        </button>

        <button
          onClick={onSubmit}
          disabled={isRunning}
          style={{ backgroundColor: "var(--color-success)" }}
          className="px-5 py-2 text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
        >
          Submit
        </button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 bg-lc-body overflow-hidden border border-lc-border rounded-lg shadow-sm">
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
