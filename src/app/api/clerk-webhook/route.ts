import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";

export const runtime = 'edge';

// Types for Clerk webhook event data
type UserWebhookEvent = {
    data: {
        id: string;
        email_addresses: { email_address: string }[];
        first_name: string;
        image_url: string;
    };
    type: 'user.created' | 'user.updated';
};

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error('CLERK_WEBHOOK_SECRET is missing');
        return new NextResponse('Webhook secret missing', { status: 500 });
    }

    // Get the headers
    const headersList = headers();
    const svix_id = headersList.get("svix-id");
    const svix_timestamp = headersList.get("svix-timestamp");
    const svix_signature = headersList.get("svix-signature");

    // Validate headers
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new NextResponse('Missing svix headers', { status: 400 });
    }

    // Get the body
    let payload;
    try {
        payload = await req.json();
    } catch (err) {
        return new NextResponse('Invalid payload', { status: 400 });
    }

    const body = JSON.stringify(payload);

    // Verify the webhook signature
    let evt: WebhookEvent;

    try {
        const wh = new Webhook(WEBHOOK_SECRET);
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Webhook verification failed:', err);
        return new NextResponse('Invalid signature', { status: 400 });
    }

    // Verify event type
    if (evt.type !== 'user.created' && evt.type !== 'user.updated') {
        return new NextResponse(`Webhook type ${evt.type} not handled`, { status: 400 });
    }

    const event = evt as UserWebhookEvent;
    const { id, email_addresses, first_name, image_url } = event.data;

    // Validate required data
    if (!email_addresses?.[0]?.email_address) {
        return new NextResponse('No email address found', { status: 400 });
    }

    try {
        await db.user.upsert({
            where: {
                clerkId: id
            },
            update: {
                email: email_addresses[0].email_address,
                name: first_name,
                profileImage: image_url
            },
            create: {
                clerkId: id,
                email: email_addresses[0].email_address,
                name: first_name,
                profileImage: image_url
            },
        });

        return new NextResponse(
            JSON.stringify({ message: 'User updated successfully' }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error('Database error:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Database error occurred' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}