// src/app/api/problems/[id]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Problem from "@/models/Problem";
import { auth } from "@clerk/nextjs/server";

export async function GET(request, context) {
    const { userId } = await auth();

    // Optional: Log this to your terminal to see it working!
    console.log("Request from user:", userId || "Anonymous/Postman");
    try {
        // ✅ unwrap params as a Promise
        const resolvedParams = await context.params;
        const problemId = resolvedParams?.id;

        if (!problemId) {
            return NextResponse.json(
                { error: "ID is Missing" },
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            return NextResponse.json(
                { error: "Invalid problem ID" },
                { status: 400 }
            );
        }

        await connectDB();

        const problem = await Problem.findById(problemId).select(
            "_id title description difficulty tags visibleTestCases startCode referenceSolution"
        );

        if (!problem) {
            return NextResponse.json(
                { error: "Problem not found" },
                { status: 404 }
            );
        }

        const response = {
            _id: problem._id.toString(),
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            tags: problem.tags,
            visibleTestCases: problem.visibleTestCases || [],
            startCode: problem.startCode || [],
            referenceSolution: problem.referenceSolution || [],
        };

        // match your original shape so frontend still uses data.problem
        return NextResponse.json({ problem: response }, { status: 200 });
    } catch (err) {
        console.error("Error fetching problem by id:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

