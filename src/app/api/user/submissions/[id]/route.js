import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Submission from "@/models/Submission";

export async function GET(req, context) {
    try {
        // 1. Auth check
        const { userId: clerkUserId } = getAuth(req);
        if (!clerkUserId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Resolve dynamic route param [pid]
        const { id: problemId } = await context.params;
        if (!problemId) {
            return NextResponse.json(
                { error: "Problem ID missing" },
                { status: 400 }
            );
        }

        await connectDB();

        // 3. Find local user by Clerk ID
        const user = await User.findOne({ clerkUserId });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // 4. Fetch submissions
        const submissions = await Submission.find({
            userId: user._id,
            problemId: problemId,
        });

        // Return array directly (empty array if none found)
        return NextResponse.json(submissions, { status: 200 });
    } catch (err) {
        console.error("submittedProblem error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
