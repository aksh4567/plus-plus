import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req) {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
        return NextResponse.json({ isAdmin: false });
    }

    await connectDB();
    const user = await User.findOne({ clerkUserId });

    if (user && user.role === 'admin') {
        return NextResponse.json({ isAdmin: true });
    }

    return NextResponse.json({ isAdmin: false });
}
