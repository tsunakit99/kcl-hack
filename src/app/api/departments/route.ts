import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
export async function GET() {
    const departments = await prisma.department.findMany({
        select: {
            id: true,
            name: true,
        },
    });
    if (!departments) {
        return new NextResponse(JSON.stringify({ error: '学科取得に失敗しました' }), { status: 400 });
    }

    return new NextResponse(JSON.stringify(departments), { status: 200 });
}