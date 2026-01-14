export const maxDuration = 30;

import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Problem from '@/models/Problem';
import { getLanguageById, submitBatch, submitToken } from '@/lib/judge0';

export async function POST(req) {
    const startTime = Date.now(); // ✅ LOGGING START
    console.log(`🚀 /api/code/run started at ${new Date().toISOString()}`);
    try {
        const { userId: clerkUserId } = getAuth(req);
        if (!clerkUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { code, language, problemId } = await req.json();

        if (!code || !language || !problemId) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        await connectDB();
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
        }

        const langKey = language === 'cpp' ? 'c++' : language;
        const languageId = getLanguageById(langKey);

        // Map visible test cases for batch submission
        const submissions = problem.visibleTestCases.map((tc) => ({
            source_code: code,
            language_id: languageId,
            stdin: tc.input,
            expected_output: tc.output,
        }));

        // Submit and poll results
        const submitResult = await submitBatch(submissions);
        const tokens = submitResult.map((r) => r.token);
        const testResults = await submitToken(tokens);

        // Aggregate results
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let success = true;

        for (const test of testResults) {
            if (test.status_id === 3) {
                testCasesPassed++;
                runtime += parseFloat(test.time || 0);
                memory = Math.max(memory, test.memory || 0);
            } else {
                success = false;
            }
        }

        const endTime = Date.now();
        console.log(`✅ /api/code/run completed in ${endTime - startTime}ms`);

        return NextResponse.json({
            success,
            testCases: testResults,
            runtime,
            memory,
        });
    } catch (error) {
        const endTime = Date.now();
        console.error(`❌ /api/code/run failed after ${endTime - startTime}ms:`, error.message);


        console.error('Run code error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
