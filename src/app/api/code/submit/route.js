export const maxDuration = 30;

import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Problem from '@/models/Problem';
import Submission from '@/models/Submission';
import User from '@/models/User';
import { getLanguageById, submitBatch, submitToken } from '@/lib/judge0';

export async function POST(req) {
    const startTime = Date.now(); // ✅ LOGGING START
    console.log(`🚀 /api/code/submit started at ${new Date().toISOString()}`);



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
        const user = await User.findOne({ clerkUserId });
        const problem = await Problem.findById(problemId);

        if (!user || !problem) {
            return NextResponse.json({ error: 'User or Problem not found' }, { status: 404 });
        }

        const langKey = language === 'cpp' ? 'c++' : language;

        // Create initial submission record
        const submission = await Submission.create({
            userId: user._id,
            problemId: problem._id,
            code,
            language: langKey,
            status: 'pending',
            testCasesTotal: problem.hiddenTestCases.length,
        });

        const languageId = getLanguageById(langKey);

        // Prepare submissions for hidden test cases
        const submissionsPayload = problem.hiddenTestCases.map((tc) => ({
            source_code: code,
            language_id: languageId,
            stdin: tc.input,
            expected_output: tc.output,
        }));

        // Submit to Judge0
        const submitResult = await submitBatch(submissionsPayload);
        const tokens = submitResult.map((r) => r.token);
        const testResults = await submitToken(tokens);

        // Process results
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';
        let errorMessage = null;

        for (const test of testResults) {
            if (test.status_id === 3) {
                testCasesPassed++;
                runtime += parseFloat(test.time || 0);
                memory = Math.max(memory, test.memory || 0);
            } else {
                status = test.status_id === 6 ? 'error' : 'wrong'; // 6 is compilation error usually, adjust based on Judge0 docs
                errorMessage = test.stderr || test.compile_output || 'Unknown error';
            }
        }

        // Update Submission Record
        submission.status = status;
        submission.testCasesPassed = testCasesPassed;
        submission.errorMessage = errorMessage;
        submission.runtime = runtime;
        submission.memory = memory;
        await submission.save();

        // Update User's solved problems if accepted
        if (status === 'accepted') {
            // Add to set to ensure uniqueness
            await User.findByIdAndUpdate(user._id, {
                $addToSet: { problemSolved: problem._id }
            });
        }

        const endTime = Date.now();
        console.log(`✅ /api/code/submit completed in ${endTime - startTime}ms`);

        return NextResponse.json({
            accepted: status === 'accepted',
            totalTestCases: problem.hiddenTestCases.length,
            passedTestCases: testCasesPassed,
            runtime,
            memory,
            submissionId: submission._id
        }, { status: 201 });

    } catch (error) {
        const endTime = Date.now();
        console.error(`❌ /api/code/submit failed after ${endTime - startTime}ms:`, error.message);


        console.error('Submit code error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
