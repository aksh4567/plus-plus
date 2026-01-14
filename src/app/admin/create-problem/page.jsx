"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, AlertCircle } from "lucide-react";

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum(["array", "linkedList", "graph", "dp", "string", "math"]),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation is required"),
      })
    )
    .min(1, "At least one visible test case required"),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one hidden test case required"),
  startCode: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        initialCode: z.string().min(1, "Initial code is required"),
      })
    )
    .length(3, "All three languages required"),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        completeCode: z.string().min(1, "Complete code is required"),
      })
    )
    .length(3, "All three languages required"),
});

export default function CreateProblemPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [authorized, setAuthorized] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: "C++", initialCode: "// Complete the function\n" },
        {
          language: "Java",
          initialCode: "// Complete the method\npublic static ",
        },
        {
          language: "JavaScript",
          initialCode: "// Complete the function\nfunction ",
        },
      ],
      referenceSolution: [
        { language: "C++", completeCode: "" },
        { language: "Java", completeCode: "" },
        { language: "JavaScript", completeCode: "" },
      ],
      visibleTestCases: [{ input: "", output: "", explanation: "" }],
      hiddenTestCases: [{ input: "", output: "" }],
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });
  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role === "admin") {
      setAuthorized(true);
    }
  }, [isLoaded, user]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/admin/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh(); // Revalidate
      } else {
        throw new Error("Failed to create problem");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!isLoaded || !authorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-code-text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-code-bg-primary min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.back()} className="btn btn-ghost">
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-code-text-primary">
          Create New Problem
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-code-bg-secondary border border-code-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-code-text-primary mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-linear-to-r from-blue-500 to-purple-500 rounded-full" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-code-text-primary font-medium mb-2">
                Title
              </label>
              <input
                {...register("title")}
                className="w-full p-4 bg-code-bg-tertiary border border-code-border rounded-xl text-code-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={16} /> {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-code-text-primary font-medium mb-2">
                  Difficulty
                </label>
                <select
                  {...register("difficulty")}
                  className="w-full p-4 bg-code-bg-tertiary border border-code-border rounded-xl text-code-text-primary"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-code-text-primary font-medium mb-2">
                  Tag
                </label>
                <select
                  {...register("tags")}
                  className="w-full p-4 bg-code-bg-tertiary border border-code-border rounded-xl text-code-text-primary"
                >
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                  <option value="string">String</option>
                  <option value="math">Math</option>
                </select>
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-code-text-primary font-medium mb-2">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={6}
                className="w-full p-4 bg-code-bg-tertiary border border-code-border rounded-xl text-code-text-primary resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={16} /> {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <div className="bg-code-bg-secondary border border-code-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-code-text-primary mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-linear-to-r from-green-500 to-emerald-500 rounded-full" />
            Test Cases
          </h2>

          {/* Visible Test Cases */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-code-text-primary">
                Visible Test Cases
              </h3>
              <button
                type="button"
                onClick={() =>
                  appendVisible({ input: "", output: "", explanation: "" })
                }
                className="btn bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
              >
                <Plus size={20} /> Add Visible Case
              </button>
            </div>
            {visibleFields.map((field, index) => (
              <div
                key={field.id}
                className="bg-code-bg-tertiary border border-code-border rounded-xl p-6 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-code-text-primary">
                    Case {index + 1}
                  </h4>
                  {visibleFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVisible(index)}
                      className="btn bg-red-500 hover:bg-red-600 text-white btn-sm flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-code-text-secondary text-sm mb-2">
                      Input
                    </label>
                    <textarea
                      {...register(`visibleTestCases.${index}.input`)}
                      className="w-full p-3 bg-code-bg-secondary border border-code-border rounded-lg text-code-text-primary"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-code-text-secondary text-sm mb-2">
                      Expected Output
                    </label>
                    <textarea
                      {...register(`visibleTestCases.${index}.output`)}
                      className="w-full p-3 bg-code-bg-secondary border border-code-border rounded-lg text-code-text-primary"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-code-text-secondary text-sm mb-2">
                      Explanation
                    </label>
                    <textarea
                      {...register(`visibleTestCases.${index}.explanation`)}
                      className="w-full p-3 bg-code-bg-secondary border border-code-border rounded-lg text-code-text-primary"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hidden Test Cases */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-code-text-primary">
                Hidden Test Cases
              </h3>
              <button
                type="button"
                onClick={() => appendHidden({ input: "", output: "" })}
                className="btn bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
              >
                <Plus size={20} /> Add Hidden Case
              </button>
            </div>
            {hiddenFields.map((field, index) => (
              <div
                key={field.id}
                className="bg-code-bg-tertiary border border-code-border rounded-xl p-6 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-code-text-primary">
                    Hidden Case {index + 1}
                  </h4>
                  {hiddenFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHidden(index)}
                      className="btn bg-red-500 hover:bg-red-600 text-white btn-sm flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-code-text-secondary text-sm mb-2">
                      Input
                    </label>
                    <textarea
                      {...register(`hiddenTestCases.${index}.input`)}
                      className="w-full p-3 bg-code-bg-secondary border border-code-border rounded-lg text-code-text-primary"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-code-text-secondary text-sm mb-2">
                      Expected Output
                    </label>
                    <textarea
                      {...register(`hiddenTestCases.${index}.output`)}
                      className="w-full p-3 bg-code-bg-secondary border border-code-border rounded-lg text-code-text-primary"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Templates */}
        <div className="bg-code-bg-secondary border border-code-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-code-text-primary mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-linear-to-r from-indigo-500 to-violet-500 rounded-full" />
            Code Templates
          </h2>
          <div className="space-y-8">
            {[
              { lang: "C++", idx: 0 },
              { lang: "Java", idx: 1 },
              { lang: "JavaScript", idx: 2 },
            ].map(({ lang, idx }) => (
              <div key={lang} className="space-y-4">
                <h3 className="text-xl font-semibold text-code-text-primary border-b border-code-border pb-2">
                  {lang} Template
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-code-text-primary font-medium mb-2">
                      Starter Code
                    </label>
                    <textarea
                      {...register(`startCode.${idx}.initialCode`)}
                      className="w-full h-32 p-4 bg-code-bg-tertiary border border-code-border rounded-xl text-code-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-code-text-primary font-medium mb-2">
                      Reference Solution
                    </label>
                    <textarea
                      {...register(`referenceSolution.${idx}.completeCode`)}
                      className="w-full h-32 p-4 bg-code-bg-tertiary border border-code-border rounded-xl text-code-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-6 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin w-6 h-6" />
              Creating Problem...
            </>
          ) : (
            "Create Problem"
          )}
        </button>
      </form>
    </div>
  );
}
