"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ProblemSolver from "@/components/ProblemSolver";
import { LoaderCircle } from "lucide-react";

export default function ProblemPage() {
  const params = useParams();
  // In Client Components, useParams() is already handled, but we ensure it's a string
  const problemId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProblem() {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching problem", problemId);
        const res = await fetch(`/api/problems/${problemId}`);

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Problem not found");
        }

        const data = await res.json();

        // FIX: The API sends { problem: { ... } }.
        // We need to store just the inner problem object.
        if (data && data.problem) {
          setProblem(data.problem);
        } else {
          setProblem(data); // Fallback if API structure changes
        }
      } catch (err) {
        console.error("Error fetching problem:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (problemId) {
      fetchProblem();
    }
  }, [problemId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 gap-4 bg-code-bg-secondary min-h-screen">
        <LoaderCircle
          className="animate-spin text-code-text-primary"
          size={40}
        />
        <p className="text-code-text-primary font-medium">Loading Problem...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-slate-900">
        <div className="text-xl text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/50">
          ⚠️ Error: {error}
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-slate-900">
        <div className="text-xl text-gray-400">Problem not found</div>
      </div>
    );
  }

  // Now 'problem' contains the actual fields (title, description, etc.)
  return <ProblemSolver problem={problem} />;
}
