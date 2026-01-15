"use client";
import { useEffect, useState } from "react";
import { FileText, BookOpen, FlaskConical, History } from "lucide-react";
import { Check, Copy } from "lucide-react";
import axios from "axios";
import { Clock, Cpu, Calendar } from "lucide-react";

export default function ProblemDescription({ problem, horizontalSplit }) {
  // 6. Left Panel Tabs
  const [leftTab, setLeftTab] = useState("description"); // "description" | "editorial" | "solutions" | "submissions"
  // 7. copied icon in solution tab
  const [copiedIndex, setCopiedIndex] = useState(null);

  //submissions state
  const [submissions, setSubmissions] = useState([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  // Fetch when tab changes to 'submissions'
  useEffect(() => {
    if (leftTab === "submissions" && problem?._id) {
      const fetchSubmissions = async () => {
        setIsLoadingSubmissions(true);
        try {
          // Adjust endpoint if yours is different
          const res = await axios.get(`/api/user/submissions/${problem._id}`);
          setSubmissions(res.data);
        } catch (err) {
          console.error("Failed to fetch submissions", err);
        } finally {
          setIsLoadingSubmissions(false);
        }
      };
      fetchSubmissions();
    }
  }, [leftTab, problem._id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      style={{ width: `${horizontalSplit}%`, minWidth: "250px" }}
      className="flex flex-col h-full overflow-hidden border-2 bg-code-bg-secondary border-code-border shrink-0 rounded-xl"
    >
      {/* 1. Tab Header (LeetCode Style) */}
      <div className="flex items-center w-full px-1 overflow-x-auto border-b h-9 border-code-border bg-code-bg-tertiary scrollbar-hide">
        <div className="flex p-1 gap-1">
          {/* Tab: Description */}
          <button
            onClick={() => setLeftTab("description")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all rounded-lg whitespace-nowrap ${
              leftTab === "description"
                ? "bg-code-bg-primary text-code-text-primary shadow-sm"
                : "text-code-text-secondary hover:bg-code-bg-primary/50 hover:text-code-text-primary"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            Description
          </button>

          {/* Tab: Editorial */}
          <button
            onClick={() => setLeftTab("editorial")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all rounded-lg whitespace-nowrap ${
              leftTab === "editorial"
                ? "bg-code-bg-primary text-code-text-primary shadow-sm"
                : "text-code-text-secondary hover:bg-code-bg-primary/50 hover:text-code-text-primary"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-yellow-500" />
            Editorial
          </button>

          {/* Tab: Solutions */}
          <button
            onClick={() => setLeftTab("solutions")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all rounded-lg whitespace-nowrap ${
              leftTab === "solutions"
                ? "bg-code-bg-primary text-code-text-primary shadow-sm"
                : "text-code-text-secondary hover:bg-code-bg-primary/50 hover:text-code-text-primary"
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-blue-500" />
            Solutions
          </button>

          {/* Tab: Submissions */}
          <button
            onClick={() => setLeftTab("submissions")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all rounded-lg whitespace-nowrap ${
              leftTab === "submissions"
                ? "bg-code-bg-primary text-code-text-primary shadow-sm"
                : "text-code-text-secondary hover:bg-code-bg-primary/50 hover:text-code-text-primary"
            }`}
          >
            <History className="w-3.5 h-3.5 text-blue-500" />
            Submissions
          </button>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-code-bg-secondary">
        {/* CONTENT: DESCRIPTION */}
        {leftTab === "description" && (
          <div className="animate-fade-in">
            <h2 className="mb-4 text-2xl font-bold text-code-text-primary">
              {problem.title}
            </h2>
            <div className="flex gap-3 mb-4">
              <span
                className={`px-3 py-1 text-xs rounded-full bg-code-bg-tertiary capitalize font-medium ${
                  problem.difficulty === "easy"
                    ? "text-green-500"
                    : problem.difficulty === "medium"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {problem.difficulty}
              </span>
            </div>

            <div className="mb-8 leading-relaxed text-code-text-primary whitespace-pre-wrap">
              {problem.description}
            </div>

            {/* Example Cases */}
            <div className="space-y-6">
              {problem.visibleTestCases?.map((ex, idx) => (
                <div key={idx} className="">
                  <div className="mb-2 text-sm font-bold text-code-text-primary">
                    Example {idx + 1}:
                  </div>
                  <div className="pl-4 border-l-2 border-code-border">
                    <div className="mb-2">
                      <span className="font-bold text-code-text-primary">
                        Input:
                      </span>{" "}
                      <span className="font-mono text-sm text-code-text-secondary">
                        {ex.input}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="font-bold text-code-text-primary">
                        Output:
                      </span>{" "}
                      <span className="font-mono text-sm text-code-text-secondary">
                        {ex.output}
                      </span>
                    </div>
                    {ex.explanation && (
                      <div>
                        <span className="font-bold text-code-text-primary">
                          Explanation:
                        </span>{" "}
                        <span className="text-sm text-code-text-secondary">
                          {ex.explanation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTENT: EDITORIAL (Empty State) */}
        {leftTab === "editorial" && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-lg font-medium text-code-text-secondary">
              Editorial Content
            </div>
            <div className="text-sm text-code-text-secondary/60">
              Coming soon
            </div>
          </div>
        )}

        {/* CONTENT: SOLUTIONS (Updated with Code Blocks) */}
        {/* CONTENT: SOLUTIONS */}
        {leftTab === "solutions" && (
          <div className="animate-fade-in space-y-6 pb-6">
            <h2 className="text-xl font-bold mb-4 text-code-text-primary">
              Reference Solutions
            </h2>

            {problem.referenceSolution &&
            problem.referenceSolution.length > 0 ? (
              problem.referenceSolution.map((sol, index) => (
                <div
                  key={index}
                  className="overflow-hidden border rounded-lg border-code-border bg-code-bg-primary"
                >
                  {/* Header: Language Name & Copy Button */}
                  <div className="flex items-center justify-between px-4 py-2 border-b border-code-border bg-code-bg-tertiary">
                    <span className="text-sm font-semibold text-code-text-primary">
                      {sol.language} Solution
                    </span>

                    {/* Copy Button with Feedback State */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(sol.completeCode);
                        setCopiedIndex(index);
                        setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2s
                      }}
                      className="flex items-center gap-1.5 text-xs text-code-text-secondary hover:text-code-text-primary transition-colors"
                      title="Copy Code"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-green-500 font-medium">
                            Copied!
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code Block */}
                  <div className="relative group">
                    <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-code-text-primary whitespace-pre scrollbar-thin scrollbar-thumb-code-border scrollbar-track-transparent">
                      {sol.completeCode}
                    </pre>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center text-code-text-secondary">
                <div className="mb-2 text-lg">
                  No official solutions available
                </div>
                <div className="text-sm opacity-60">
                  Check the Editorial tab for explanations
                </div>
              </div>
            )}
          </div>
        )}

        {/* CONTENT: SUBMISSIONS */}
        {/* CONTENT: SUBMISSIONS */}
        {leftTab === "submissions" && (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-code-text-primary">
                Submissions
              </h2>
            </div>

            {isLoadingSubmissions ? (
              <div className="flex justify-center py-10 text-code-text-secondary">
                Loading history...
              </div>
            ) : submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-code-text-secondary opacity-60">
                <div className="text-lg">No submissions yet</div>
                <div className="text-sm">Run your code to see history here</div>
              </div>
            ) : (
              /* Table Container */
              <div className="flex flex-col w-full text-sm">
                {/* Table Header */}
                <div className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr] px-4 pb-2 mb-2 font-medium text-code-text-primary border-b border-code-border">
                  <div>#</div>
                  <div>Status</div>
                  <div>Language</div>
                  <div>Runtime</div>
                  <div>Memory</div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col">
                  {submissions.map((sub, idx) => {
                    // Map DB status (lowercase) to UI
                    const isAccepted = sub.status === "accepted";
                    const isWrong = sub.status === "wrong";
                    const isError = sub.status === "error";

                    let statusLabel = "Pending";
                    let statusColor = "text-yellow-500";

                    if (isAccepted) {
                      statusLabel = "Accepted";
                      statusColor = "text-green-500";
                    } else if (isWrong) {
                      statusLabel = "Wrong Answer";
                      statusColor = "text-red-500";
                    } else if (isError) {
                      statusLabel = "Error";
                      statusColor = "text-red-500";
                    }

                    const memoryMB = (sub.memory / 1024).toFixed(1);
                    // Reverse index for display (Submission #5, #4...)
                    const displayIndex = submissions.length - idx;

                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr] items-center px-4 py-3 transition-colors hover:bg-code-bg-tertiary even:bg-code-bg-tertiary/30 rounded-md"
                      >
                        {/* Row Number */}
                        <div className="text-code-text-primary">
                          {displayIndex}
                        </div>

                        {/* Status & Date */}
                        <div className="flex flex-col">
                          <span className={`font-bold ${statusColor}`}>
                            {statusLabel}
                          </span>
                          <span className="text-xs text-code-text-primary mt-0.5 opacity-80">
                            {formatDate(sub.createdAt)}
                          </span>
                        </div>

                        {/* Language Badge */}
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-code-bg-tertiary text-code-text-primary border border-code-border/50 capitalize">
                            {sub.language === "c++"
                              ? "C++"
                              : sub.language === "javascript"
                              ? "JS"
                              : "Java"}
                          </span>
                        </div>

                        {/* Runtime */}
                        <div className="flex items-center gap-1.5 font-mono text-code-text-primary">
                          <Clock className="w-3.5 h-3.5 text-code-text-secondary" />
                          <span>
                            {sub.runtime > 0 ? `${sub.runtime} ms` : "N/A"}
                          </span>
                        </div>

                        {/* Memory */}
                        <div className="flex items-center gap-1.5 font-mono text-code-text-primary">
                          <Cpu className="w-3.5 h-3.5 text-code-text-secondary" />
                          <span>
                            {sub.memory > 0 ? `${memoryMB} MB` : "N/A"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
