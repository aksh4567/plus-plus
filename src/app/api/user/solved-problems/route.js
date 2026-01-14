import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Problem from "@/models/Problem"; // ensure Problem model is registered

export async function GET(req) {
    try {
        const { userId: clerkUserId } = getAuth(req);
        if (!clerkUserId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findOne({ clerkUserId }).populate({
            path: "problemSolved",
            select: "_id title difficulty tags",
            model: Problem, // strictly enforce model usage
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Return the array directly (matches MERN behavior)
        return NextResponse.json(user.problemSolved || [], { status: 200 });
    } catch (err) {
        console.error("solvedAllProblembyUser error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
