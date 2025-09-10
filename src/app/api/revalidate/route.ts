import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
    const { path } = await request.json();

    if (!path) {
        return NextResponse.json({ message: 'Chemin manquant' }, { status: 400 });
    }

    revalidatePath(path);

    return NextResponse.json({ revalidated: true, now: Date.now() });
}