import { headers } from 'next/headers';
import { Webhook } from 'svix';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error('❌ Missing CLERK_WEBHOOK_SECRET');
        return new Response('Server configuration error', { status: 500 });
    }

    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error('❌ Missing Svix headers');
        return new Response('Missing webhook headers', { status: 400 });
    }

    // Get  request body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Verify webhook signature
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;

    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });
    } catch (err) {
        console.error('❌ Webhook verification failed:', err.message);
        return new Response('Invalid signature', { status: 400 });
    }

    // handle webhook event
    const eventType = evt.type;
    const data = evt.data;

    console.log(`📥 Webhook received: ${eventType}`);

    await connectDB();

    try {
        if (eventType === 'user.created' || eventType === 'user.updated') {
            const {
                id: clerkUserId,
                email_addresses,
                first_name,
                last_name,
            } = data;

            const primaryEmail = email_addresses?.[0]?.email_address;

            if (!primaryEmail) {
                console.error('❌ No email found in webhook data');
                return new Response('No email found', { status: 400 });
            }

            // Up--sert user in MongoDB
            const user = await User.findOneAndUpdate(
                { clerkUserId },
                {
                    clerkUserId,
                    emailId: primaryEmail,
                    firstName: first_name || '',
                    lastName: last_name || '',
                },
                { upsert: true, new: true }
            );

            console.log(`✅ User synced: ${user.emailId} (${eventType})`);
        }

        if (eventType === 'user.deleted') {
            const { id: clerkUserId } = data;

            const user = await User.findOneAndDelete({ clerkUserId });

            if (user) {
                console.log(`🗑️ User deleted: ${user.emailId}`);
            } else {
                console.log(`⚠️ User not found for deletion: ${clerkUserId}`);
            }
        }

        return new Response('Webhook processed', { status: 200 });
    } catch (error) {
        console.error('❌ Error processing webhook:', error);
        return new Response('Internal server error', { status: 500 });
    }
}
