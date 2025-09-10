import { pusherServer } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        await pusherServer.trigger('admin-notifications', 'help-request', {
            message: message || "Un client demande de l'aide !",
            timestamp: new Date(),
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}