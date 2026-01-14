import { getAuth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function checkAdmin(req) {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) return false;

    await connectDB();
    const user = await User.findOne({ clerkUserId });

    return user && user.role === 'admin';
}
