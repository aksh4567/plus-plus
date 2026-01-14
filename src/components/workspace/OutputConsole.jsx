"use client";
import { useState } from "react";

export default function OutputConsole({
  activeTab,
  setActiveTab,
  problem,
  testResults,
  submissionResult,
  isRunning,
}) {
  // Local state for switching between Test Case 1, 2, 3...
  const [activeTestCaseId, setActiveTestCaseId] = useState(0);

  return (
    <div className="flex flex-col h-full overflow-hidden border-t border-code-border bg-code-bg-secondary">
      {/* 1. Header Tabs */}
      <div className="flex items-center px-4 py-2 space-x-6 border-b border-code-border bg-code-bg-tertiary/50 h-10 shrink-0">
        <button
          onClick={() => setActiveTab("testcases")}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            activeTab === "testcases"
              ? "text-green-500"
              : "text-code-text-secondary hover:text-code-text-primary"
          }`}
        >
          <div
            className={`flex items-center justify-center w-4 h-4 rounded ${
              activeTab === "testcases" ? "bg-code-text-secondary/20" : ""
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              width="1em"
              height="1em"
              className="w-3 h-3 text-code-text-secondary fill-current"
            >
              <path d="M21 7L9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59 21 7z" />
            </svg>
          </div>
          Testcase
        </button>

        <button
          onClick={() => setActiveTab("submission")}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            activeTab === "submission"
              ? "text-green-500"
              : "text-code-text-secondary hover:text-code-text-primary"
          }`}
        >
          <span className="text-lg leading-none">›_</span>
          Test Result
        </button>
      </div>

      {/* 2. Content Area */}
      <div className="flex-1 p-4 overflow-auto">
        {/* ---------------- TAB 1: TEST CASES ---------------- */}
        {activeTab === "testcases" && (
          <div className="flex flex-col gap-4">
            {/* DEFAULT VIEW (No Run Results Yet) */}
            {!testResults ? (
              <div className="flex flex-col gap-4">
                {/* Case Switcher Buttons */}
                <div className="flex gap-2 mb-2">
                  {problem.visibleTestCases?.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestCaseId(idx)} // CLICK HANDLER ADDED
                      className={`px-4 py-1.5 text-xs font-medium transition-colors rounded-lg ${
                        activeTestCaseId === idx
                          ? "bg-code-bg-tertiary text-code-text-primary border border-code-border"
                          : "text-code-text-secondary hover:bg-code-bg-tertiary hover:text-code-text-primary"
                      }`}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Dynamic Content based on activeTestCaseId */}
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 text-xs text-code-text-secondary uppercase">
                      Input
                    </div>
                    <div className="p-3 font-mono text-sm rounded-lg bg-code-bg-tertiary text-code-text-primary">
                      {problem.visibleTestCases?.[activeTestCaseId]?.input}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-code-text-secondary uppercase">
                      Expected Output
                    </div>
                    <div className="p-3 font-mono text-sm rounded-lg bg-code-bg-tertiary text-code-text-primary">
                      {problem.visibleTestCases?.[activeTestCaseId]?.output}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* RESULT VIEW (After Run) */
              <div className="space-y-4">
                {/* Case Switcher Buttons with Status Colors */}
                <div className="flex gap-2 mb-2">
                  {testResults.map((tc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestCaseId(idx)} // CLICK HANDLER ADDED
                      className={`px-4 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-all ${
                        activeTestCaseId === idx
                          ? "ring-1 ring-offset-1 ring-code-border"
                          : "opacity-80 hover:opacity-100"
                      } ${
                        tc.status_id === 3
                          ? "text-green-500 bg-green-500/10"
                          : "text-red-500 bg-red-500/10"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          tc.status_id === 3 ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      Case {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Dynamic Result Details */}
                <div className="space-y-3 animate-fade-in">
                  <div>
                    <div className="mb-1 text-xs text-code-text-secondary">
                      Input
                    </div>
                    <div className="p-3 font-mono text-sm rounded-lg bg-code-bg-tertiary text-code-text-primary">
                      {testResults[activeTestCaseId]?.stdin}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-code-text-secondary">
                      Output
                    </div>
                    <div
                      className={`p-3 font-mono text-sm rounded-lg ${
                        testResults[activeTestCaseId]?.status_id === 3
                          ? "bg-code-bg-tertiary"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {testResults[activeTestCaseId]?.stdout || "null"}
                    </div>
                  </div>
                  {testResults[activeTestCaseId]?.status_id !== 3 && (
                    <div>
                      <div className="mb-1 text-xs text-code-text-secondary">
                        Expected
                      </div>
                      <div className="p-3 font-mono text-sm rounded-lg bg-code-bg-tertiary text-code-text-primary">
                        {testResults[activeTestCaseId]?.expected_output}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- TAB 2: SUBMISSION (No Changes Needed) ---------------- */}
        {activeTab === "submission" && (
          /* ... Reuse previous submission code ... */
          <div className="flex items-center justify-center h-full">
            {!submissionResult && !isRunning ? (
              <div className="text-center text-code-text-secondary">
                <div className="mb-2 text-sm">You must run your code first</div>
              </div>
            ) : isRunning ? (
              <div className="text-center animate-pulse">
                <div className="mb-2 text-code-text-primary">Running...</div>
              </div>
            ) : (
              <div className="w-full h-full text-left animate-fade-in">
                <div
                  className={`text-xl font-bold mb-4 ${
                    submissionResult.verdict === "Accepted" ||
                    submissionResult.accepted
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {submissionResult.verdict === "Accepted" ||
                  submissionResult.accepted
                    ? "Accepted"
                    : "Wrong Answer"}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-code-bg-tertiary">
                    <div className="text-xs text-code-text-secondary">
                      Runtime
                    </div>
                    <div className="text-lg font-bold text-code-text-primary">
                      {submissionResult.runtime || 0} ms
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-code-bg-tertiary">
                    <div className="text-xs text-code-text-secondary">
                      Cases
                    </div>
                    <div className="text-lg font-bold text-code-text-primary">
                      {submissionResult.passedTestCases}/
                      {submissionResult.totalTestCases}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
