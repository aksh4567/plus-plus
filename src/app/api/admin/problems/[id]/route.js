// src/app/api/admin/problems/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Problem from "@/models/Problem";
import { checkAdmin } from "@/lib/admin";
import { getLanguageById, submitBatch, submitToken } from "@/lib/judge0"; // <-- add

// GET PROBLEM (ADMIN - includes all fields)
export async function GET(req, context) {
    try {
        if (!(await checkAdmin(req))) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        const resolvedParams = await context.params;
        const id = resolvedParams.id;

        if (!id) {
            return NextResponse.json(
                { error: "ID is Missing" },
                { status: 400 }
            );
        }

        await connectDB();

        const problem = await Problem.findById(id);

        if (!problem) {
            return NextResponse.json(
                { error: "Problem not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ problem }, { status: 200 });

    } catch (error) {
        console.error("Get problem error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// UPDATE PROBLEM
export async function PUT(req, context) {
    try {
        // 1. Admin check
        if (!(await checkAdmin(req))) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        // 2. Next 15/16: params is a Promise
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { error: "Missing ID Field" },
                { status: 400 }
            );
        }

        await connectDB();

        // 3. Ensure problem exists
        const existing = await Problem.findById(id);
        if (!existing) {
            return NextResponse.json(
                { error: "ID is not present in server" },
                { status: 404 }
            );
        }

        const body = await req.json();
        const {
            title,
            description,
            difficulty,
            tags,
            visibleTestCases,
            hiddenTestCases,
            startCode,
            referenceSolution,
        } = body;

        // Check if reference solution has changed
        const existingRefSol = existing.referenceSolution.map(item => ({
            language: item.language,
            completeCode: item.completeCode
        }));

        // Clean incoming reference solution for comparison
        const newRefSol = referenceSolution.map(item => ({
            language: item.language,
            completeCode: item.completeCode
        }));

        const isRefSolutionChanged = JSON.stringify(existingRefSol) !== JSON.stringify(newRefSol);

        // 4. Validate referenceSolution with Judge0 (MERN logic) ONLY if changed
        if (isRefSolutionChanged) {
            if (
                !Array.isArray(referenceSolution) ||
                referenceSolution.length === 0
            ) {
                return NextResponse.json(
                    { error: "Reference solution is required" },
                    { status: 400 }
                );
            }

            if (
                !Array.isArray(visibleTestCases) ||
                visibleTestCases.length === 0
            ) {
                return NextResponse.json(
                    { error: "At least one visible test case is required" },
                    { status: 400 }
                );
            }

            for (const { language, completeCode } of referenceSolution) {
                const languageId = getLanguageById(language);

                const submissions = visibleTestCases.map((testcase) => ({
                    source_code: completeCode,
                    language_id: languageId,
                    stdin: testcase.input,
                    expected_output: testcase.output,
                }));

                const submitResult = await submitBatch(submissions);
                const tokens = submitResult.map((value) => value.token);
                const testResult = await submitToken(tokens);

                const allAccepted = testResult.every((t) => t.status_id === 3);
                if (!allAccepted) {
                    return NextResponse.json(
                        { error: "Reference solution failed visible test cases" },
                        { status: 400 }
                    );
                }
            }
        }

        // 5. Update problem with validation and return new doc
        const updated = await Problem.findByIdAndUpdate(
            id,
            {
                title,
                description,
                difficulty,
                tags,
                visibleTestCases,
                hiddenTestCases,
                startCode,
                referenceSolution,
            },
            { runValidators: true, new: true }
        );

        return NextResponse.json(
            { success: true, problem: updated },
            { status: 200 }
        );
    } catch (error) {
        console.error("Update problem error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// DELETE PROBLEM
export async function DELETE(req, context) {
    try {
        if (!(await checkAdmin(req))) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { error: "ID is Missing" },
                { status: 400 }
            );
        }

        await connectDB();

        const deleted = await Problem.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { error: "Problem is Missing" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Successfully Deleted" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Delete problem error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
