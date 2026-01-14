"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2, Edit, ChevronLeft, AlertCircle } from "lucide-react";

export default function AdminUpdateListPage() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== "admin")
      router.push("/admin");
    if (isLoaded) fetchProblems();
  }, [isLoaded, user, router]);

  async function fetchProblems() {
    try {
      setLoading(true);
      const res = await fetch("/api/problems");
      if (!res.ok) throw new Error("Failed to fetch problems");
      const data = await res.json();
      setProblems(Array.isArray(data) ? data : data.problems || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch problems");
      console.error(err);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded || user?.publicMetadata?.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-code-text-primary w-8 h-8" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-code-text-primary w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-code-bg-primary min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center gap-2 text-code-text-secondary hover:text-code-text-primary transition-colors"
        >
          <ChevronLeft size={24} />
          Back to Dashboard
        </button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-code-text-primary flex items-center gap-3">
          <Edit className="text-amber-700" size={36} />
          Update Problems
        </h1>
        <button
          onClick={fetchProblems}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-code-text-primary bg-code-bg-tertiary hover:bg-code-bg-tertiary/70 border border-code-border rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
          <AlertCircle size={24} />
          {error}
        </div>
      )}

      <div className="bg-code-bg-secondary border border-code-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-code-bg-tertiary/50 border-b border-code-border">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-semibold text-code-text-secondary uppercase tracking-wider w-16">
                  #
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-code-text-secondary uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-code-text-secondary uppercase tracking-wider w-32">
                  Difficulty
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-code-text-secondary uppercase tracking-wider w-40">
                  Tags
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-code-text-secondary uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, index) => (
                <tr
                  key={problem._id}
                  className={`hover:bg-code-bg-tertiary/70 transition-colors ${
                    index % 2 === 1 ? "bg-code-bg-tertiary" : ""
                  }`}
                >
                  <td className="px-4 py-4 text-sm text-code-text-secondary">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-code-text-primary">
                    {problem.title}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        problem.difficulty === "easy"
                          ? "text-green-600 bg-green-500/10"
                          : problem.difficulty === "medium"
                          ? "text-yellow-600 bg-yellow-500/10"
                          : "text-red-600 bg-red-500/10"
                      }`}
                    >
                      {problem.difficulty?.charAt(0).toUpperCase() +
                        problem.difficulty?.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-2.5 py-0.5 bg-code-bg-secondary text-code-text-primary border border-code-border rounded-full text-xs font-medium">
                      {problem.tags}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/update/${problem._id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors"
                    >
                      <Edit size={14} />
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {problems.length === 0 && !loading && (
        <div className="text-center py-20 text-code-text-secondary">
          <Edit className="mx-auto h-16 w-16 text-code-text-secondary/50 mb-4" />
          <h3 className="text-2xl font-bold mb-2 text-code-text-primary">
            No problems found
          </h3>
          <p>Create your first problem from the dashboard!</p>
        </div>
      )}
    </div>
  );
}
