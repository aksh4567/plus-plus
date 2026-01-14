
// src/app/api/problems/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Problem from "@/models/Problem";

export async function GET() {
    try {
        await connectDB();

        const problems = await Problem.find({})
            .select("_id title difficulty tags")
            .sort({ _id: 1 });

        if (!problems || problems.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        // Match MERN: send the array directly, not wrapped in { problems }
        return NextResponse.json(problems, { status: 200 });
    } catch (err) {
        console.error("Error fetching problems:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
