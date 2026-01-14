"use client";

import { useState, useEffect } from "react";
import ProblemList from "@/components/ProblemList";

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [allProblems, setAllProblems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch all problems on mount
  useEffect(() => {
    async function fetchProblems() {
      try {
        const res = await fetch("/api/problems");
        if (!res.ok) {
          console.error("Failed to fetch problems");
          setAllProblems([]);
          setProblems([]);
          return;
        }

        const data = await res.json(); // backend returns an array
        setAllProblems(Array.isArray(data) ? data : []);
        setProblems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching problems:", error);
        setAllProblems([]);
        setProblems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProblems();
  }, []);

  // Filter when filter changes
  useEffect(() => {
    if (filter === "all") {
      setProblems(allProblems);
    } else {
      const filtered = allProblems.filter(
        (p) => p.difficulty?.toLowerCase() === filter.toLowerCase()
      );
      setProblems(filtered);
    }
  }, [filter, allProblems]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-10 py-10 h-full">
        <div className="text-center text-code-text-secondary">
          Loading proble
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-10 py-10">
      <h1 className="text-4xl font-bold mb-8 text-code-text-primary">
        Problems
      </h1>

      <ProblemList
        problems={problems}
        filter={filter}
        onFilterChange={setFilter}
      />
    </div>
  );
}
