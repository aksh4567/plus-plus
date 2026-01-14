"use client";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ProblemDescription from "./workspace/ProblemDescription";
import CodeEditor from "./workspace/CodeEditor";
import OutputConsole from "./workspace/OutputConsole";
import { LoaderCircle } from "lucide-react";

// 1. Map lowercase state to DB format
const dbLangMap = {
  javascript: "JavaScript",
  java: "Java",
  cpp: "C++",
};

// 2. Map lowercase state to Judge0 IDs
const judge0IdMap = {
  javascript: 63, // Node.js
  java: 62, // Java (OpenJDK 13)
  cpp: 54, // C++ (GCC 9.2.0)
};

export default function ProblemSolver({ problem }) {
  // 1. Editor State
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // 2. Output Panel State
  const [activeTab, setActiveTab] = useState("testcases");
  const [testResults, setTestResults] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  // 3. Resizer State
  const [horizontalSplit, setHorizontalSplit] = useState(50); // Default 50% split
  const [verticalSplit, setVerticalSplit] = useState(60); // Default 60% top / 40% bottom
  const [isDraggingH, setIsDraggingH] = useState(false);
  const [isDraggingV, setIsDraggingV] = useState(false);

  // 4. Refs & Theme
  const containerRef = useRef(null);
  const { theme } = useTheme();

  // Load starter code
  useEffect(() => {
    if (problem?.startCode) {
      const starterCodeObj = problem.startCode.find(
        (sc) => sc.language === dbLangMap[language]
      );
      setCode(starterCodeObj?.initialCode || "// No starter code found");
    }
  }, [language, problem]);

  // Resizer handlers
  const handleMouseMoveH = (e) => {
    if (!isDraggingH || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newSplit =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;
    // Constrain split between 20% and 80%
    if (newSplit >= 20 && newSplit <= 80) setHorizontalSplit(newSplit);
  };

  const handleMouseMoveV = (e) => {
    if (!isDraggingV || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const rightSectionHeight = containerRect.height; // Approximate height of right panel
    // We need relative Y within the container, but since we don't have a ref to just the right panel easily available here
    // we can approximate using window or the main container.
    // Better approach: Since container is full height, e.clientY relative to top is roughly correct minus navbar
    const relativeY = e.clientY - containerRect.top;
    const newSplit = (relativeY / rightSectionHeight) * 100;

    // Constrain split between 20% and 80%
    if (newSplit >= 20 && newSplit <= 80) setVerticalSplit(newSplit);
  };

  const stopDragging = () => {
    setIsDraggingH(false);
    setIsDraggingV(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    if (isDraggingH || isDraggingV) {
      document.addEventListener(
        "mousemove",
        isDraggingH ? handleMouseMoveH : handleMouseMoveV
      );
      document.addEventListener("mouseup", stopDragging);
      document.body.style.cursor = isDraggingH ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";

      // Add a transparent overlay to prevent iframe stealing mouse events (if using iframes)
    }
    return () => {
      document.removeEventListener(
        "mousemove",
        isDraggingH ? handleMouseMoveH : handleMouseMoveV
      );
      document.removeEventListener("mouseup", stopDragging);
    };
  }, [isDraggingH, isDraggingV]);

  const handleRunCode = async () => {
    setActiveTab("testcases");
    setIsRunning(true);
    setTestResults(null);
    try {
      const response = await axios.post("/api/code/run", {
        code,
        language: language,
        languageId: judge0IdMap[language],
        problemId: problem._id,
      });
      const data = response.data;
      if (data.testCases) {
        setTestResults(data.testCases);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    setActiveTab("submission");
    setIsRunning(true);
    setSubmissionResult(null);
    try {
      const response = await axios.post("/api/code/submit", {
        code,
        language: language,
        languageId: judge0IdMap[language],
        problemId: problem._id,
      });
      setSubmissionResult(response.data);
    } catch (error) {
      setSubmissionResult({ error: error.message, accepted: false });
    } finally {
      setIsRunning(false);
    }
  };

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4 bg-code-bg-secondary">
        <LoaderCircle className="animate-spin text-blue-500" size={40} />
        <p className="text-code-text-primary font-medium">Loading Problem...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex h-[calc(100vh-64px)] w-full bg-code-bg-primary overflow-hidden select-none"
    >
      {/* 1. LEFT PANEL: Problem Description */}
      {/* IMPORTANT: Ensure ProblemDescription accepts and uses 'style={{ width: ... }}' or class */}
      <div
        style={{
          width: `${horizontalSplit}%`,
          maxWidth: "80%",
          minWidth: "20%",
        }}
        className="h-full shrink-0"
      >
        <ProblemDescription problem={problem} />
      </div>

      {/* 2. HORIZONTAL RESIZER (LeetCode Style: Subtle 1px line, fat hover area) */}
      <div
        className="relative w-1.5 h-full cursor-col-resize shrink-0 z-50 group flex justify-center items-center"
        onMouseDown={(e) => {
          e.preventDefault();
          setIsDraggingH(true);
        }}
      >
        {/* Visual Line (Usually invisible or very thin, becomes blue on hover) */}
        <div
          className={`w-0.5 h-full transition-colors duration-200 ${
            isDraggingH
              ? "bg-blue-500"
              : "bg-transparent group-hover:bg-blue-500/50"
          }`}
        />
      </div>

      {/* 3. RIGHT PANEL: Code + Output */}
      <div
        style={{ width: `${100 - horizontalSplit}%` }}
        className="flex flex-col h-full min-w-[20%]"
      >
        {/* TOP: Code Editor */}
        <div
          style={{ height: `${verticalSplit}%`, minHeight: "20%" }}
          className="w-full shrink-0"
        >
          <CodeEditor
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
            theme={theme}
            isRunning={isRunning}
            onRun={handleRunCode}
            onSubmit={handleSubmitCode}
            height={100}
          />
        </div>

        {/* VERTICAL RESIZER */}
        <div
          className="relative h-1.5 w-full cursor-row-resize shrink-0 z-50 group flex flex-col justify-center"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDraggingV(true);
          }}
        >
          <div
            className={`h-0.5 w-full transition-colors duration-200 ${
              isDraggingV
                ? "bg-blue-500"
                : "bg-transparent group-hover:bg-blue-500/50"
            }`}
          />
        </div>

        {/* BOTTOM: Output Console */}
        <div
          style={{ height: `${100 - verticalSplit}%`, minHeight: "20%" }}
          className="w-full shrink-0 bg-code-bg-primary"
        >
          <OutputConsole
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            problem={problem}
            testResults={testResults}
            submissionResult={submissionResult}
            isRunning={isRunning}
          />
        </div>
      </div>
    </div>
  );
}
