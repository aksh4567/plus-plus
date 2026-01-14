import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Problem from "@/models/Problem";
import User from "@/models/User";
import { checkAdmin } from "@/lib/admin";
import { getAuth } from "@clerk/nextjs/server";
import { getLanguageById, submitBatch, submitToken } from "@/lib/judge0"; // <-- add

export async function POST(req) {
    try {
        await connectDB();

        // 1. Admin check
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) {
            return NextResponse.json(
                { error: "Unauthorized: Admin only" },
                { status: 403 }
            );
        }

        // 2. Parse body
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

        // 3. Get creator (Clerk user -> local User)
        const { userId: clerkUserId } = getAuth(req);
        if (!clerkUserId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await User.findOne({ clerkUserId });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // 4. Validate reference solution using Judge0 (MERN logic)
        if (!Array.isArray(referenceSolution) || referenceSolution.length === 0) {
            return NextResponse.json(
                { error: "Reference solution is required" },
                { status: 400 }
            );
        }

        if (!Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
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

            const submitResult = await submitBatch(submissions); // [{ token }, ...]
            const tokens = submitResult.map((value) => value.token);

            const testResult = await submitToken(tokens); // [{ status_id, ... }, ...]

            // If any visible test case fails, reject problem creation
            const allAccepted = testResult.every((t) => t.status_id === 3);
            if (!allAccepted) {
                return NextResponse.json(
                    { error: "Reference solution failed visible test cases" },
                    { status: 400 }
                );
            }
        }

        // 5. Create problem in DB
        const problem = await Problem.create({
            title,
            description,
            difficulty,
            tags,
            visibleTestCases,
            hiddenTestCases,
            startCode,
            referenceSolution,
            problemCreator: user._id,
        });

        return NextResponse.json(
            { success: true, problem },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create problem error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
