"use client";

import Link from "next/link";

export default function ProblemList({ problems, filter, onFilterChange }) {
  return (
    <div>
      {/* //filter buttons */}
      <div className="flex gap-3 mb-6">
        {["all", "easy", "medium", "hard"].map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => onFilterChange(difficulty)}
            className={`
              px-4 py-2 rounded-lg font-medium capitalize
              border border-code-border transition-all duration-200
              ${
                filter === difficulty
                  ? "bg-code-accent text-white border-code-accent"
                  : "bg-code-bg-secondary text-code-text-primary hover:bg-code-bg-tertiary"
              }
            `}
          >
            {difficulty}
          </button>
        ))}
      </div>
      {/* 
 //problems table list */}
      <div className="bg-code-bg-secondary rounded-xl border border-code-border overflow-hidden">
        {problems.length === 0 ? (
          <div className="p-8 text-center text-code-text-secondary">
            No problems found for filter:{" "}
            <span className="capitalize">{filter}</span>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-code-bg-tertiary border-b border-code-border">
                <th className="px-4 py-4 text-left text-code-text-primary font-semibold w-1/2">
                  Title
                </th>
                <th className="px-4 py-4 text-left text-code-text-primary font-semibold w-1/4">
                  Difficulty
                </th>
                <th className="px-4 py-4 text-left text-code-text-primary font-semibold w-1/4">
                  Tags
                </th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr
                  key={problem._id}
                  className="border-b border-code-border hover:bg-code-bg-tertiary transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-4">
                    <Link
                      href={`/problems/${problem._id}`}
                      className="text-code-text-primary group-hover:text-code-accent transition-colors font-medium"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`
                        px-3 py-1 rounded text-xs font-bold uppercase
                        ${
                          problem.difficulty === "easy"
                            ? "difficulty-easy"
                            : problem.difficulty === "medium"
                            ? "difficulty-medium"
                            : "difficulty-hard"
                        }
                      `}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-code-text-secondary text-sm capitalize">
                      {problem.tags || "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
