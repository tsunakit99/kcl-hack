import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
export async function GET() {
    const tags = await prisma.tag.findMany({
        select: {
            id: true,
            name: true,
        },
    });
    if (!tags) {
        return new NextResponse(JSON.stringify({ error: 'タグ取得に失敗しました' }), { status: 400 });
    }

    return new NextResponse(JSON.stringify(tags), { status: 200 });
}